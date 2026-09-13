import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Navigation,
  Trash2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Bookmark,
  Filter,
  Radio,
  Zap,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { Session } from '../../types';

export const ScheduleView: React.FC = () => {
  const {
    sessions,
    savedSessionIds,
    toggleSaveSession,
    navigateDirectlyToZone,
    setActiveView,
  } = useEvent();

  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');
  const [selectedDay, setSelectedDay] = useState<'Day 1' | 'Day 2'>('Day 1');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'AI & ML', 'Startups & Venture', 'Web3 & Security', 'Cloud & Systems', 'Design & UX'];

  const displayedSessions = useMemo(() => {
    return sessions
      .filter((s) => {
        if (activeTab === 'saved' && !savedSessionIds.includes(s.id)) return false;
        if (s.day !== selectedDay) return false;
        if (selectedCategory !== 'all' && s.category !== selectedCategory) return false;
        return true;
      })
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [sessions, savedSessionIds, activeTab, selectedDay, selectedCategory]);

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 space-y-8 pb-16 font-mono">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-cyan-500/20 pb-4 gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-cyan-400 block font-bold">
            CHRONOLOGICAL SESSION MATRIX
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
            Timetable & Agenda
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Direct living map routing and bookmarking for EventPulse OS
          </p>
        </div>

        {/* Tab switcher: All vs Saved */}
        <div className="flex items-center space-x-2 bg-[#080b11] p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
              activeTab === 'all'
                ? 'bg-cyan-500 text-black shadow-lg glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Sessions ({sessions.length})
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
              activeTab === 'saved'
                ? 'bg-cyan-500 text-black shadow-lg glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Saved ({savedSessionIds.length})
          </button>
        </div>
      </div>

      {/* Filter Row: Day & Categories */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Day switch */}
        <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {(['Day 1', 'Day 2'] as const).map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-1 rounded-lg font-bold uppercase transition-all ${
                selectedDay === day
                  ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-[11px] uppercase transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-950 border border-cyan-400 text-cyan-300 font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'ALL TRACKS' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Requirement 21: EMPTY STATE IF NO SAVED SESSIONS */}
      {displayedSessions.length === 0 ? (
        <div className="bg-[#080b11] border-2 border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-400 flex items-center justify-center mx-auto glow-cyan-sm">
            <Calendar className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black text-white uppercase tracking-wider">
              NO SAVED SESSIONS
            </h3>
            <p className="text-sm text-slate-400 italic">
              “Your event story hasn't started yet.”
            </p>
          </div>
          <button
            onClick={() => {
              setActiveTab('all');
              setSelectedCategory('all');
            }}
            className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-wider shadow-lg glow-cyan transition-all"
          >
            DISCOVER SESSIONS
          </button>
        </div>
      ) : (
        /* List of Sessions */
        <div className="space-y-4">
          {displayedSessions.map((session) => {
            const isSaved = savedSessionIds.includes(session.id);
            return (
              <div
                key={session.id}
                className="bg-[#080b11] border border-cyan-500/20 hover:border-cyan-400/60 rounded-3xl p-5 sm:p-6 transition-all shadow-xl space-y-4 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 text-xs">
                  <div className="flex items-center space-x-2 text-cyan-400 font-bold flex-wrap">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{session.startTime} – {session.endTime}</span>
                    {session.delayMinutes ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-950 border border-amber-500 text-amber-300 font-mono text-[10px]">
                        +{session.delayMinutes}M DELAY
                      </span>
                    ) : null}
                    <span className="text-slate-600">·</span>
                    <span className="text-amber-400">{session.category}</span>
                    {session.status === 'live' && (
                      <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-rose-950 border border-rose-500 text-rose-300 font-mono text-[10px] animate-pulse">
                        <Radio className="w-2.5 h-2.5" />
                        <span>LIVE NOW</span>
                      </span>
                    )}
                    {session.isLocationChanged && (
                      <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-950 border border-amber-500 text-amber-300 font-mono text-[10px]">
                        <Zap className="w-2.5 h-2.5 text-amber-400" />
                        <span>DYNAMICALLY RELOCATED</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-white font-bold">{session.hallName}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors uppercase font-sans">
                      {session.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 font-sans">
                      {session.description}
                    </p>
                    <p className="text-[11px] text-cyan-400/80 pt-1">
                      Speaker: <span className="text-white font-bold">{session.speaker}</span> ({session.speakerRole} · {session.speakerCompany})
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <button
                      onClick={() => toggleSaveSession(session.id)}
                      className={`p-3 rounded-2xl border transition-all ${
                        isSaved
                          ? 'bg-cyan-950 border-cyan-400 text-cyan-300 glow-cyan-sm'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                      title="Toggle Save"
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => navigateDirectlyToZone(session.hallId)}
                      className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-wider flex items-center space-x-1.5 transition-all shadow-lg glow-cyan active:scale-95"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>LIVING ROUTE</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { useEvent } from '../../context/EventContext';
import {
  Clock,
  Navigation,
  Sparkles,
  ArrowRight,
  Flame,
  Radio,
  MapPin,
  TrendingUp,
  AlertCircle,
  Activity,
  Layers,
  ChevronRight,
  Bookmark,
} from 'lucide-react';
import { EventPulse } from '../common/EventPulse';

export const EventHomeView: React.FC = () => {
  const {
    sessions,
    zones,
    announcements,
    metrics,
    simulatedSecondsRemaining,
    navigateDirectlyToZone,
    setActiveView,
    toggleSaveSession,
    savedSessionIds,
  } = useEvent();

  const formatCountdown = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const keynoteSession = sessions.find((s) => s.id === 'session-01') || sessions[0];
  const activeAnnouncements = announcements.slice(0, 4);

  return (
    <div className="space-y-10 max-w-6xl mx-auto px-2 sm:px-4 pb-16">
      {/* Top Banner: Greeting & Live Tag */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-cyan-500/20 pb-4 gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 block">
            ATTENDEE TERMINAL
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
            Good Morning, Attendee
          </h1>
          <p className="text-xs sm:text-sm font-mono text-slate-400">
            EVENTPULSE OS · DAY 1 · LIVE
          </p>
        </div>

        {/* Live system state chip */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
            <span>ALL NODES SYNCHRONIZED</span>
          </div>
          <button
            onClick={() => setActiveView('dna')}
            className="px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-xs font-mono text-cyan-300 hover:bg-cyan-900 transition-colors"
          >
            EVENT DNA →
          </button>
        </div>
      </div>

      {/* Grid: Left = RIGHT NOW & HAPPENING AROUND YOU, Right = EVENT PULSE & LIVE SIGNALS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): The Dynamic Live Event Feed */}
        <div className="lg:col-span-7 space-y-8">
          {/* Dynamic "RIGHT NOW" Spotlight Card */}
          <section className="bg-gradient-to-br from-[#0c121d] via-[#080b11] to-[#05070a] border-2 border-cyan-500/40 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl glow-cyan-sm">
            <div className="absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl bg-cyan-500 text-black font-black text-[10px] font-mono uppercase tracking-widest">
              RIGHT NOW
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-bold uppercase tracking-wider">{keynoteSession.category}</span>
                <span>·</span>
                <span>{keynoteSession.hallName}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight uppercase">
                {keynoteSession.title}
              </h2>

              <p className="text-xs text-slate-400 line-clamp-2">
                {keynoteSession.description}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
                <div className="space-y-0.5 font-mono">
                  <span className="text-[10px] uppercase text-slate-400 tracking-wider block">
                    STARTING IN
                  </span>
                  <div className="text-3xl font-black text-amber-400 tracking-tighter">
                    {formatCountdown(simulatedSecondsRemaining)}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleSaveSession(keynoteSession.id)}
                    className={`p-3 rounded-2xl border transition-colors ${
                      savedSessionIds.includes(keynoteSession.id)
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                    title="Bookmark session"
                  >
                    <Bookmark className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => navigateDirectlyToZone(keynoteSession.hallId)}
                    className="px-6 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs font-mono uppercase tracking-wider flex items-center space-x-2 transition-all shadow-lg glow-cyan cursor-pointer active:scale-95"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>VIEW ROUTE</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* HAPPENING AROUND YOU: Live Information Tiles */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                <h3 className="text-base font-black text-white uppercase tracking-wider font-mono">
                  HAPPENING AROUND YOU
                </h3>
              </div>
              <button
                onClick={() => setActiveView('schedule')}
                className="text-xs font-mono text-cyan-400 hover:underline"
              >
                VIEW FULL TIMETABLE →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tile 1: AI Workshop */}
              <div
                onClick={() => navigateDirectlyToZone('zone-hall-a')}
                className="p-5 rounded-2xl bg-[#080b11] border border-cyan-500/20 hover:border-cyan-400/50 transition-all cursor-pointer shadow-lg space-y-3 group"
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                    WORKSHOP HALL A
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-300 text-[9px] font-mono">
                    ● 42% FULL
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors uppercase">
                  Autonomous AI Agents Workshop
                </h4>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-900">
                  <span className="flex items-center space-x-1 text-lime-400">
                    <span>↓ 4 MIN WALK</span>
                  </span>
                  <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">
                    NAVIGATE →
                  </span>
                </div>
              </div>

              {/* Tile 2: Startup Pitch */}
              <div
                onClick={() => navigateDirectlyToZone('zone-hall-c')}
                className="p-5 rounded-2xl bg-[#080b11] border border-amber-500/20 hover:border-amber-400/50 transition-all cursor-pointer shadow-lg space-y-3 group"
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                    STARTUP PAVILION
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-950 border border-amber-500/30 text-amber-300 text-[9px] font-mono animate-pulse">
                    ● STARTING NOW
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors uppercase">
                  Early-Stage AI Pitch Battle
                </h4>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-900">
                  <span className="flex items-center space-x-1 text-amber-300">
                    <span>↓ 2 MIN WALK</span>
                  </span>
                  <span className="text-amber-400 group-hover:translate-x-1 transition-transform">
                    NAVIGATE →
                  </span>
                </div>
              </div>

              {/* Tile 3: Food Court Live Telemetry */}
              <div
                onClick={() => navigateDirectlyToZone('zone-food-b')}
                className="p-5 rounded-2xl bg-[#080b11] border border-rose-500/20 hover:border-rose-400/50 transition-all cursor-pointer shadow-lg space-y-3 group"
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono text-rose-400 font-bold uppercase">
                    DINING & CAFE
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-rose-950 border border-rose-500/30 text-rose-300 text-[9px] font-mono">
                    ● BUSY (FOOD COURT A)
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors uppercase">
                  Try Food Court B (No Queue)
                </h4>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-900">
                  <span className="text-lime-400">Low wait time · 3 min</span>
                  <span className="text-rose-400 group-hover:translate-x-1 transition-transform">
                    REROUTE →
                  </span>
                </div>
              </div>

              {/* Tile 4: Networking Garden */}
              <div
                onClick={() => navigateDirectlyToZone('zone-networking')}
                className="p-5 rounded-2xl bg-[#080b11] border border-lime-500/20 hover:border-lime-400/50 transition-all cursor-pointer shadow-lg space-y-3 group"
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono text-lime-400 font-bold uppercase">
                    OUTDOOR LOUNGE
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-lime-950 border border-lime-500/30 text-lime-300 text-[9px] font-mono">
                    ● OPTIMAL (31%)
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-lime-300 transition-colors uppercase">
                  Quiet Networking Terrace
                </h4>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-900">
                  <span className="text-slate-400">Coffee Bar Active</span>
                  <span className="text-lime-400 group-hover:translate-x-1 transition-transform">
                    JOIN →
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column (5 cols): EVENT PULSE & LIVE SIGNALS */}
        <div className="lg:col-span-5 space-y-8">
          {/* Signature Event Pulse Display */}
          <div className="bg-[#080b11] border border-cyan-500/30 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-3 left-4 text-[10px] font-mono uppercase text-cyan-400 tracking-wider">
              EVENT PULSE TELEMETRY
            </div>
            <div className="my-4">
              <EventPulse size="md" interactive={true} />
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-2">
              Tap the central orb to toggle real-time crowd and sensor stream.
            </p>
          </div>

          {/* LIVE SIGNALS: Vertical Real-time Feed */}
          <div className="bg-[#080b11] border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <h3 className="text-xs font-black text-white uppercase tracking-widest font-mono">
                  LIVE SIGNALS
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase">
                AUTOMATED STREAM
              </span>
            </div>

            {/* Vertical timeline */}
            <div className="space-y-4">
              {activeAnnouncements.map((ann, idx) => (
                <div
                  key={ann.id}
                  className="relative pl-6 border-l border-slate-800 space-y-1 group hover:border-cyan-500/50 transition-colors"
                >
                  {/* Living node dot on line */}
                  <span
                    className={`absolute -left-[5px] top-1.5 w-2 h-2 rounded-full ${
                      ann.priority === 'emergency'
                        ? 'bg-rose-500 animate-ping'
                        : ann.priority === 'important'
                        ? 'bg-amber-400'
                        : 'bg-cyan-400'
                    }`}
                  />
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400">{ann.timestamp}</span>
                    <span
                      className={`font-bold uppercase ${
                        ann.priority === 'emergency'
                          ? 'text-rose-400'
                          : ann.priority === 'important'
                          ? 'text-amber-400'
                          : 'text-cyan-400'
                      }`}
                    >
                      {ann.priority}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase group-hover:text-cyan-300 transition-colors">
                    {ann.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {ann.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

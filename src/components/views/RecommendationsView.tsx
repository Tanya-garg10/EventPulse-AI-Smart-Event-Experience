import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Calendar,
  Navigation,
  Clock,
  MapPin,
  Check,
  TrendingUp,
  Sliders,
  Filter,
  Users,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { RecommendationEngine } from '../../services/recommendations/recommendationEngine';
import { AttendeeProfile, ScoredSession } from '../../types';

export const RecommendationsView: React.FC = () => {
  const {
    sessions,
    zones,
    savedSessionIds,
    toggleSaveSession,
    navigateDirectlyToZone,
    selectedOriginZoneId,
    accessibilitySettings,
  } = useEvent();

  const [profile, setProfile] = useState<AttendeeProfile>({
    name: 'Alex Chen',
    interests: ['AI & Machine Learning', 'Startups & Venture'],
    preferredTypes: ['Workshop', 'Keynote', 'Panel'],
    availableTimeMins: 120,
    accessibilityPrefs: accessibilitySettings,
  });

  const availableInterests = [
    'AI & Machine Learning',
    'Startups & Venture',
    'Web3 & Crypto',
    'Cloud Architecture',
    'Product & UX Design',
    'Cybersecurity',
    'Robotics & Hardware',
  ];

  const availableGoals = [
    'Learn new technologies',
    'Pitch to investors / Angel funding',
    'Hire talent / Find jobs',
    'Network with founders',
  ];

  const timeOptions = [
    { label: '30 mins', value: 30 },
    { label: '1 hour', value: 60 },
    { label: '2 hours', value: 120 },
    { label: 'Half Day (4h)', value: 240 },
    { label: 'All Day', value: 480 },
  ];

  const toggleInterest = (item: string) => {
    setProfile((prev) => {
      const exists = prev.interests.includes(item);
      return {
        ...prev,
        interests: exists ? prev.interests.filter((i) => i !== item) : [...prev.interests, item],
      };
    });
  };

  const toggleGoal = (item: string) => {
    setProfile((prev) => {
      const exists = prev.preferredTypes.includes(item);
      return {
        ...prev,
        preferredTypes: exists ? prev.preferredTypes.filter((g) => g !== item) : [...prev.preferredTypes, item],
      };
    });
  };

  // Rank sessions using deterministic scoring engine
  const scoredSessions: ScoredSession[] = useMemo(() => {
    return RecommendationEngine.scoreSessions(
      sessions,
      zones,
      profile,
      selectedOriginZoneId || 'zone-registration'
    );
  }, [sessions, zones, profile, selectedOriginZoneId]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-blue-900/40 p-6 rounded-3xl border border-purple-800/40 shadow-xl backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Personalized Event Discovery
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-mono">
              Scored Multi-Factor Engine
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Deterministic matching weighing your topics (50%), time window (20%), crowd density (15%), proximity (10%), and popularity (5%).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Customizer Sidebar */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              <h2 className="font-bold text-sm text-white">Your Event Preferences</h2>
            </div>
            <span className="text-[11px] text-slate-400">Live Updating</span>
          </div>

          {/* Interests */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              1. What topics interest you?
            </label>
            <div className="flex flex-wrap gap-2">
              {availableInterests.map((interest) => {
                const active = profile.interests.includes(interest);
                return (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      active
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/60'
                    }`}
                  >
                    {interest} {active && '✓'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Available Time Slider / Pills */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              2. Available Time Window:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {timeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setProfile((p) => ({ ...p, availableTimeMinutes: opt.value }))}
                  className={`py-1.5 px-2 rounded-xl text-xs font-medium text-center transition-all ${
                    profile.availableTimeMinutes === opt.value
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/60'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Goals */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              3. What is your primary objective?
            </label>
            <div className="space-y-1.5">
              {availableGoals.map((goal) => {
                const active = profile.goals.includes(goal);
                return (
                  <button
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                      active
                        ? 'bg-indigo-950/70 text-indigo-200 border border-indigo-500/50'
                        : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-700/50'
                    }`}
                  >
                    <span>{goal}</span>
                    {active && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Formula disclosure */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
            <p className="font-semibold text-slate-300">Deterministic Scoring Formula</p>
            <p className="text-[10px] leading-relaxed">
              Match = 0.50 × Topic + 0.20 × Time + 0.15 × (Low Crowd) + 0.10 × Proximity + 0.05 × Popularity
            </p>
          </div>
        </div>

        {/* Scored Session Results List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400 font-medium">
              Ranked <strong className="text-white">{scoredSessions.length}</strong> conference sessions for your profile
            </p>
            <span className="text-[11px] text-emerald-400 flex items-center space-x-1 font-mono">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Sorted by Highest Match</span>
            </span>
          </div>

          <div className="space-y-4">
            {scoredSessions.map(({ session, matchScore, reasons, breakdown }) => {
              const isSaved = savedSessionIds.includes(session.id);
              return (
                <div
                  key={session.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 shadow-xl transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <span className="px-3 py-1 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-semibold">
                        {session.category}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {session.durationMinutes} min
                      </span>
                    </div>

                    {/* Match Score Badge */}
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-400 font-mono">
                          {matchScore}% MATCH
                        </span>
                      </div>
                      <div className="w-16 h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${matchScore}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Title & Speaker */}
                  <div>
                    <h3 className="text-base font-bold text-white hover:text-blue-400 transition-colors">
                      {session.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      By <strong className="text-white">{session.speaker}</strong> ({session.speakerRole}, {session.speakerCompany})
                    </p>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {session.description}
                    </p>
                  </div>

                  {/* Session Hall, Time, and Status info */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      <span>{session.startTime} – {session.endTime}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-400" />
                      <span>{session.hallName}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Users className="w-3.5 h-3.5 text-blue-400" />
                      <span>{session.registeredCount} enrolled ({Math.round((session.registeredCount / session.capacity) * 100)}% seats)</span>
                    </div>
                  </div>

                  {/* Reasons Breakdown (Why this was recommended) */}
                  <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 space-y-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                      Why this was recommended:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-300">
                      {(reasons || []).map((r, i) => (
                        <div key={i} className="flex items-center space-x-1.5 text-[11px]">
                          <span className="text-emerald-400">✓</span>
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>

                    {/* Visual 5-factor mini score bars */}
                    <div className="grid grid-cols-5 gap-2 pt-2 border-t border-slate-800/60 text-[10px] text-slate-400">
                      <div>
                        <div className="flex justify-between mb-0.5">
                          <span>Topic</span>
                          <span className="font-mono text-slate-300">{breakdown.interestMatch}/50</span>
                        </div>
                        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500 rounded-full"
                            style={{ width: `${(breakdown.interestMatch / 50) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-0.5">
                          <span>Time</span>
                          <span className="font-mono text-slate-300">{breakdown.timeCompatibility}/20</span>
                        </div>
                        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${(breakdown.timeCompatibility / 20) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-0.5">
                          <span>Low Crowd</span>
                          <span className="font-mono text-slate-300">{breakdown.crowdComfort}/15</span>
                        </div>
                        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${(breakdown.crowdComfort / 15) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-0.5">
                          <span>Proximity</span>
                          <span className="font-mono text-slate-300">{breakdown.proximity}/10</span>
                        </div>
                        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full"
                            style={{ width: `${(breakdown.proximity / 10) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-0.5">
                          <span>Popularity</span>
                          <span className="font-mono text-slate-300">{breakdown.popularity}/5</span>
                        </div>
                        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${(breakdown.popularity / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Save & Navigate */}
                  <div className="flex items-center justify-end space-x-3 pt-1">
                    <button
                      onClick={() => toggleSaveSession(session.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                        isSaved
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                      }`}
                    >
                      {isSaved ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Saved to Schedule</span>
                        </>
                      ) : (
                        <>
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Save to Schedule</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => navigateDirectlyToZone(session.hallId)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 flex items-center space-x-1.5 transition-all"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Navigate Here</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

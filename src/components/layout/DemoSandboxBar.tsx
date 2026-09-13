import React from 'react';
import {
  Sparkles,
  Users,
  Shuffle,
  BellRing,
  ShieldAlert,
  Bot,
  Accessibility,
  RotateCcw,
  X,
  Check,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';

export const DemoSandboxBar: React.FC = () => {
  const { isDemoDrawerOpen, setIsDemoDrawerOpen, simulateDemoScenario, accessibilitySettings } =
    useEvent();

  if (!isDemoDrawerOpen) return null;

  return (
    <div className="bg-gradient-to-r from-amber-950/90 via-slate-900 to-indigo-950/90 border-b border-amber-500/40 text-white px-4 py-3 shadow-xl backdrop-blur-md relative z-40 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-amber-300">
                Judge Demo Sandbox
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-200 px-2 py-0.5 rounded-full border border-amber-500/30">
                1-Click Simulation Controls
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Test real-time event telemetry, safety overrides, and dynamic routing instantly:
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => simulateDemoScenario('crowd_surge')}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-amber-500/30 text-amber-200 text-xs font-medium transition-all"
            title="Surge Workshop Hall B capacity to 95% (Critical)"
          >
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>1. Crowd Surge (Hall B)</span>
          </button>

          <button
            onClick={() => simulateDemoScenario('session_moved')}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-blue-500/30 text-blue-200 text-xs font-medium transition-all"
            title="Relocate Workshop session to Hall C and trigger broadcast"
          >
            <Shuffle className="w-3.5 h-3.5 text-blue-400" />
            <span>2. Move Session (Hall A→C)</span>
          </button>

          <button
            onClick={() => simulateDemoScenario('emergency_announcement')}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-purple-500/30 text-purple-200 text-xs font-medium transition-all"
            title="Broadcast emergency weather/crowd announcement"
          >
            <BellRing className="w-3.5 h-3.5 text-purple-400" />
            <span>3. Broadcast Alert</span>
          </button>

          <button
            onClick={() => simulateDemoScenario('sos_trigger')}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 text-rose-200 text-xs font-medium transition-all"
            title="Launch Attendee SOS interface"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>4. SOS Mode</span>
          </button>

          <button
            onClick={() => simulateDemoScenario('ai_itinerary')}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-500/40 text-indigo-200 text-xs font-medium transition-all"
            title="Open AI Concierge with custom prompt"
          >
            <Bot className="w-3.5 h-3.5 text-indigo-400" />
            <span>5. AI Concierge</span>
          </button>

          <button
            onClick={() => simulateDemoScenario('wheelchair_mode')}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              accessibilitySettings.wheelchair
                ? 'bg-emerald-950 border-emerald-500/60 text-emerald-200'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
            }`}
            title="Toggle Wheelchair Accessible Route filter"
          >
            <Accessibility className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              6. Wheelchair Mode {accessibilitySettings.wheelchair && <Check className="inline w-3 h-3 text-emerald-400 ml-1" />}
            </span>
          </button>

          <button
            onClick={() => simulateDemoScenario('reset')}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white text-xs font-medium transition-all"
            title="Reset to default TechNova 2026 data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={() => setIsDemoDrawerOpen(false)}
            className="p-1 text-slate-400 hover:text-white rounded-md transition-all ml-1"
            title="Close Sandbox Bar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

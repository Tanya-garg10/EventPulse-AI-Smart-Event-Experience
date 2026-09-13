import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import {
  Radio,
  Clock,
  Compass,
  ShieldAlert,
  Sliders,
  Sparkles,
  ChevronDown,
  Layers,
  Activity,
  Zap,
} from 'lucide-react';

export const DynamicIslandHUD: React.FC = () => {
  const {
    metrics,
    simulatedSecondsRemaining,
    isLiveSimulationRunning,
    toggleLiveSimulation,
    currentRole,
    setCurrentRole,
    activeView,
    setActiveView,
    setAssistanceModeActive,
    zones,
  } = useEvent();

  const [isExpanded, setIsExpanded] = useState(false);

  const formatCountdown = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const criticalZones = zones.filter((z) => z.crowdLevel === 'critical' || z.crowdLevel === 'high');

  return (
    <header className="sticky top-2 z-50 px-3 max-w-5xl mx-auto w-full transition-all">
      {/* Dynamic Island Container */}
      <div
        className={`mx-auto bg-[#080b11]/90 backdrop-blur-xl border border-cyan-500/20 rounded-full shadow-2xl transition-all duration-300 ${
          isExpanded
            ? 'rounded-3xl border-cyan-400/40 p-4 shadow-cyan-500/10'
            : 'px-4 py-2 hover:border-cyan-400/40'
        }`}
      >
        <div className="flex items-center justify-between text-xs">
          {/* Brand & Live status */}
          <div
            onClick={() => setActiveView('home')}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-cyan-950 border border-cyan-400/60 glow-cyan-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-black tracking-widest text-white uppercase text-[11px] group-hover:text-cyan-300 transition-colors">
                EVENTPULSE
              </span>
              <span className="text-[9px] font-mono text-cyan-400 tracking-tighter">
                EVENTPULSE OS · LIVE
              </span>
            </div>
          </div>

          {/* Dynamic "Right Now" Ticker in Island */}
          <div
            onClick={() => setActiveView('map')}
            className="hidden md:flex items-center space-x-3 px-3 py-1 rounded-full bg-[#0d131f] border border-slate-800 cursor-pointer hover:border-cyan-500/40 transition-colors"
          >
            <div className="flex items-center space-x-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-semibold text-[11px]">KEYNOTE</span>
            </div>
            <span className="text-[11px] font-mono text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
              in {formatCountdown(simulatedSecondsRemaining)}
            </span>
            <span className="text-[10px] text-slate-400">Main Stage</span>
          </div>

          {/* Telemetry pill */}
          <div className="hidden lg:flex items-center space-x-2 text-[11px] font-mono text-slate-300">
            <span className="text-slate-400">PRESSURE</span>
            <span
              className={`font-bold px-2 py-0.5 rounded-full text-[10px] border ${
                metrics.averageOccupancyRate >= 80
                  ? 'bg-coral-950/60 text-rose-300 border-rose-500/50'
                  : metrics.averageOccupancyRate >= 60
                  ? 'bg-amber-950/60 text-amber-300 border-amber-500/50'
                  : 'bg-lime-950/60 text-lime-300 border-lime-500/50'
              }`}
            >
              {metrics.averageOccupancyRate}%
            </span>
          </div>

          {/* Controls: Live Simulation, Mode switch & SOS */}
          <div className="flex items-center space-x-2">
            {/* Live simulation toggle */}
            <button
              onClick={toggleLiveSimulation}
              title="Toggle Live Event Sensor Simulation"
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-mono border transition-all ${
                isLiveSimulationRunning
                  ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300 glow-cyan-sm'
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}
            >
              <Zap className={`w-3 h-3 ${isLiveSimulationRunning ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
              <span className="hidden sm:inline">SIMULATION:</span>
              <span className="font-bold">{isLiveSimulationRunning ? 'ON' : 'OFF'}</span>
            </button>

            {/* Role switch */}
            <button
              onClick={() => {
                if (currentRole === 'organizer') {
                  setCurrentRole('attendee');
                  setActiveView('home');
                } else {
                  setCurrentRole('organizer');
                  setActiveView('organizer');
                }
              }}
              className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
            >
              {currentRole === 'attendee' ? 'CONTROL ROOM' : 'ATTENDEE'}
            </button>

            {/* ASSISTANCE MODE (SOS) Trigger */}
            <button
              onClick={() => setAssistanceModeActive(true)}
              className="px-3 py-1 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white font-bold text-[11px] font-mono flex items-center space-x-1 shadow-lg shadow-rose-600/30 transition-all active:scale-95 glow-coral"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>SOS</span>
            </button>

            {/* Expand Island */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-full hover:bg-slate-800 text-slate-400 transition-colors"
            >
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isExpanded ? 'rotate-180 text-cyan-400' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Expanded Drawer Details inside Dynamic Island */}
        {isExpanded && (
          <div className="pt-3 mt-3 border-t border-slate-800 text-xs grid grid-cols-1 md:grid-cols-3 gap-3 animate-in fade-in duration-200">
            <div className="bg-[#0b1018] p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] font-mono text-cyan-400 block mb-1">
                LIVING MAP RADAR
              </span>
              <p className="text-slate-300 text-[11px]">
                {criticalZones.length > 0
                  ? `High congestion detected in ${criticalZones.map((z) => z.code).join(', ')}. Living paths automatically bypass bottlenecks.`
                  : 'All 14 venue zones flowing smoothly. Optimal transit times.'}
              </p>
              <button
                onClick={() => {
                  setActiveView('map');
                  setIsExpanded(false);
                }}
                className="mt-2 text-cyan-400 font-mono text-[10px] font-semibold hover:underline block"
              >
                OPEN LIVING MAP →
              </button>
            </div>

            <div className="bg-[#0b1018] p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] font-mono text-amber-400 block mb-1">
                PULSE AI ENGINE
              </span>
              <p className="text-slate-300 text-[11px]">
                Gemini 3.8 Flash standing by for spatial itinerary synthesis, quiet zones, and session queries.
              </p>
              <button
                onClick={() => {
                  setActiveView('concierge');
                  setIsExpanded(false);
                }}
                className="mt-2 text-amber-400 font-mono text-[10px] font-semibold hover:underline block"
              >
                ASK PULSE AI →
              </button>
            </div>

            <div className="bg-[#0b1018] p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] font-mono text-lime-400 block mb-1">
                EVENT DNA PROFILE
              </span>
              <p className="text-slate-300 text-[11px]">
                Orbiting interests calibrated for tailored recommendation routes.
              </p>
              <button
                onClick={() => {
                  setActiveView('dna');
                  setIsExpanded(false);
                }}
                className="mt-2 text-lime-400 font-mono text-[10px] font-semibold hover:underline block"
              >
                CALIBRATE EVENT DNA →
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

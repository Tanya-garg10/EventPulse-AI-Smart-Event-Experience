import React from 'react';
import { useEvent } from '../../context/EventContext';
import { Radio, Users, Sparkles, Bell, Network, Zap } from 'lucide-react';

interface EventPulseProps {
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

export const EventPulse: React.FC<EventPulseProps> = ({ size = 'md', interactive = true }) => {
  const { metrics, zones, setActiveView, isLiveSimulationRunning, toggleLiveSimulation } = useEvent();

  const totalAttendees = zones.reduce((a, b) => a + b.currentCount, 0);
  const eventPressure = metrics.averageOccupancyRate;
  const criticalCount = zones.filter((z) => z.crowdLevel === 'critical' || z.crowdLevel === 'high').length;

  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  const containerDimensions = isSmall ? 'w-48 h-48' : isLarge ? 'w-80 h-80' : 'w-64 h-64';

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      {/* Outer Glow Halo */}
      <div className={`relative ${containerDimensions} flex items-center justify-center`}>
        {/* Background Radar Rings */}
        <div className="absolute inset-0 rounded-full border border-cyan-500/15 animate-pulse-halo pointer-events-none" />
        <div className="absolute inset-4 rounded-full border border-cyan-500/25 border-dashed pointer-events-none" />
        <div className="absolute inset-8 rounded-full border border-cyan-500/10 pointer-events-none" />

        {/* Orbiting Ring 1 (Sessions & Alerts) */}
        <div className="absolute inset-2 rounded-full border border-transparent animate-orbit pointer-events-none">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-900 border border-cyan-400 text-[10px] font-mono text-cyan-300 shadow-lg glow-cyan-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>SESSIONS 04</span>
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-900 border border-amber-400 text-[10px] font-mono text-amber-300 shadow-lg glow-amber">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>ALERTS {criticalCount > 0 ? `0${criticalCount}` : 'OK'}</span>
          </div>
        </div>

        {/* Orbiting Ring 2 (Crowds & Networking) - reverse spin */}
        <div className="absolute inset-6 rounded-full border border-transparent animate-orbit-reverse pointer-events-none">
          <div className="absolute top-1/2 -left-4 -translate-y-1/2 flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-900 border border-lime-400 text-[10px] font-mono text-lime-300 shadow-lg glow-lime">
            <span className="w-1.5 h-1.5 rounded-full bg-lime-400" />
            <span>CROWDS {eventPressure}%</span>
          </div>
          <div className="absolute top-1/2 -right-4 -translate-y-1/2 flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-900 border border-purple-400 text-[10px] font-mono text-purple-300 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span>CONNECT</span>
          </div>
        </div>

        {/* Central Living Core Orb */}
        <div
          onClick={interactive ? toggleLiveSimulation : undefined}
          title={interactive ? 'Click to toggle Live Telemetry Stream' : undefined}
          className={`relative z-10 w-36 h-36 rounded-full bg-gradient-to-b from-slate-900 via-slate-950 to-[#06080d] border-2 border-cyan-500/40 flex flex-col items-center justify-center p-3 text-center shadow-2xl transition-all ${
            interactive ? 'cursor-pointer hover:border-cyan-400 hover:scale-105 active:scale-95' : ''
          }`}
          style={{
            boxShadow: isLiveSimulationRunning
              ? '0 0 35px -5px rgba(6, 182, 212, 0.4), inset 0 0 20px rgba(6, 182, 212, 0.2)'
              : '0 0 15px -5px rgba(100, 116, 139, 0.3)',
          }}
        >
          {/* Attendee Number Display */}
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-300/80">
            ATTENDEES
          </span>
          <span className="text-2xl font-black text-white font-mono tracking-tighter my-0.5">
            {totalAttendees.toLocaleString()}
          </span>

          {/* Central Living Dot ◉ */}
          <div className="flex items-center space-x-1 my-1">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isLiveSimulationRunning
                  ? 'bg-cyan-400 animate-ping shadow-lg shadow-cyan-400'
                  : 'bg-slate-500'
              }`}
            />
            <span className="text-cyan-400 font-bold text-xs">◉</span>
          </div>

          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
            EVENT PULSE
          </span>
          <span className="text-[9px] font-mono font-bold text-lime-400 flex items-center space-x-1">
            <span className="w-1 h-1 rounded-full bg-lime-400 animate-pulse" />
            <span>{isLiveSimulationRunning ? 'LIVE NOW' : 'PAUSED'}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

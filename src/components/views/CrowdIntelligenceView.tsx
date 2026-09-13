import React, { useState } from 'react';
import {
  Users,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Navigation,
  Sliders,
  Sparkles,
  Activity,
  Flame,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { CrowdService } from '../../services/crowd/crowdService';
import { VenueZone } from '../../types';

export const CrowdIntelligenceView: React.FC = () => {
  const { zones, updateZoneCount, navigateDirectlyToZone, metrics, isLiveSimulationRunning } = useEvent();

  const [selectedZoneForSim, setSelectedZoneForSim] = useState<string>('zone-main-stage');

  const mainStage = zones.find((z) => z.id === 'zone-main-stage') || zones[0];
  const foodCourt = zones.find((z) => z.id === 'zone-food-a') || zones[1];
  const aiLab = zones.find((z) => z.id === 'zone-hall-a') || zones[2];
  const startupPavilion = zones.find((z) => z.id === 'zone-hall-c') || zones[3];

  const keyZones = [mainStage, foodCourt, aiLab, startupPavilion].filter(Boolean);

  const getTrendDisplay = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return (
          <span className="flex items-center space-x-1 text-rose-400 font-mono text-xs font-bold">
            <TrendingUp className="w-4 h-4" />
            <span>↑ INCREASING</span>
          </span>
        );
      case 'decreasing':
        return (
          <span className="flex items-center space-x-1 text-lime-400 font-mono text-xs font-bold">
            <TrendingDown className="w-4 h-4" />
            <span>↓ DECREASING</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center space-x-1 text-slate-400 font-mono text-xs font-bold">
            <Minus className="w-4 h-4" />
            <span>→ STABLE</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 space-y-10 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-cyan-500/20 pb-4 gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 block">
            CROWD TELEMETRY & FLUID DYNAMICS
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
            Event Pressure
          </h1>
          <p className="text-xs font-mono text-slate-400">
            Real-time sensor heatmap, bottleneck anticipation, and crowd movement trajectories
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
            TOTAL CONGREGATION: <span className="text-cyan-400 font-bold">{metrics.totalAttendees}</span>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300">
            PRESSURE: <span className="font-bold">{metrics.averageOccupancyRate}%</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Heatmap Blueprint on Left, Pressure & Movement on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): The Venue Heatmap Blueprint */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#06080d] border-2 border-cyan-500/30 rounded-3xl p-5 shadow-2xl bg-tech-grid relative overflow-hidden">
            <div className="flex justify-between items-center text-[10px] font-mono text-cyan-400 mb-3">
              <span>● BLUEPRINT HEATMAP LAYER</span>
              <span className="text-lime-400">PARTICLE DENSITY ACTIVE</span>
            </div>

            {/* SVG Visual Blueprint with Density Rings */}
            <div className="relative w-full aspect-[16/10] bg-[#070a12] rounded-2xl border border-slate-800 overflow-hidden">
              <svg viewBox="0 0 1000 700" className="w-full h-full">
                {zones.slice(0, 10).map((z) => {
                  const x = z.coordinates.x * 10;
                  const y = z.coordinates.y * 7;
                  const w = z.coordinates.width * 10;
                  const h = z.coordinates.height * 7;
                  const pct = Math.round((z.currentCount / z.capacity) * 100);

                  const fillColor =
                    z.crowdLevel === 'critical'
                      ? 'rgba(244, 63, 94, 0.25)'
                      : z.crowdLevel === 'high'
                      ? 'rgba(245, 158, 11, 0.2)'
                      : z.crowdLevel === 'moderate'
                      ? 'rgba(253, 224, 71, 0.12)'
                      : 'rgba(132, 204, 22, 0.12)';

                  const strokeColor =
                    z.crowdLevel === 'critical'
                      ? '#f43f5e'
                      : z.crowdLevel === 'high'
                      ? '#f59e0b'
                      : '#00f2fe';

                  return (
                    <g
                      key={z.id}
                      onClick={() => setSelectedZoneForSim(z.id)}
                      className="cursor-pointer group"
                    >
                      <rect
                        x={x}
                        y={y}
                        width={w}
                        height={h}
                        rx="14"
                        fill={fillColor}
                        stroke={strokeColor}
                        strokeWidth="1.5"
                        className="transition-colors group-hover:fill-opacity-40"
                      />

                      {/* Animated Crowd Density Particles */}
                      {Array.from({ length: Math.min(8, Math.max(2, Math.floor(pct / 12))) }).map(
                        (_, i) => (
                          <circle
                            key={i}
                            cx={x + 20 + ((i * 31) % (w - 40))}
                            cy={y + 20 + ((i * 19) % (h - 40))}
                            r={pct > 80 ? 3 : 2}
                            fill={strokeColor}
                            opacity={0.8}
                            className={isLiveSimulationRunning ? 'animate-pulse' : ''}
                          />
                        )
                      )}

                      <text
                        x={x + w / 2}
                        y={y + h / 2}
                        fill="#f8fafc"
                        fontSize="11"
                        fontWeight="bold"
                        fontFamily="monospace"
                        textAnchor="middle"
                        className="pointer-events-none uppercase"
                      >
                        {z.code} · {pct}%
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Live simulation slider below map */}
            <div className="mt-4 p-4 rounded-2xl bg-[#090d16] border border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400 uppercase">
                  SIMULATE PRESSURE SURGE ON:
                </span>
                <select
                  value={selectedZoneForSim}
                  onChange={(e) => setSelectedZoneForSim(e.target.value)}
                  aria-label="Select Zone for Pressure Surge Simulation"
                  className="bg-slate-900 border border-slate-700 text-cyan-300 font-bold rounded-lg px-2 py-1 text-xs"
                >
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} ({z.code})
                    </option>
                  ))}
                </select>
              </div>

              {(() => {
                const targetZone = zones.find((z) => z.id === selectedZoneForSim);
                if (!targetZone) return null;
                const pct = Math.round((targetZone.currentCount / targetZone.capacity) * 100);
                return (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-white font-bold">{targetZone.name}</span>
                      <span className="text-cyan-400 font-bold">
                        {targetZone.currentCount} / {targetZone.capacity} ({pct}%)
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={targetZone.capacity}
                      value={targetZone.currentCount}
                      onChange={(e) => updateZoneCount(targetZone.id, Number(e.target.value))}
                      aria-label={`Occupancy level for ${targetZone.name}`}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Requirement 11 "EVENT PRESSURE" & "CROWD MOVEMENT" */}
        <div className="lg:col-span-5 space-y-8">
          {/* 1. EVENT PRESSURE Section */}
          <div className="bg-[#080b11] border-2 border-cyan-500/20 rounded-3xl p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Flame className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-mono font-black text-white uppercase tracking-wider">
                  EVENT PRESSURE
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase">
                CAPACITY SATURATION
              </span>
            </div>

            <div className="space-y-4">
              {keyZones.map((zone) => {
                const pct = Math.round((zone.currentCount / zone.capacity) * 100);
                return (
                  <div key={zone.id} className="space-y-1.5 font-mono">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-white uppercase">{zone.name}</span>
                      <span
                        className={`font-black ${
                          pct >= 90
                            ? 'text-rose-400'
                            : pct >= 70
                            ? 'text-amber-400'
                            : 'text-cyan-400'
                        }`}
                      >
                        {pct}%
                      </span>
                    </div>
                    {/* Visual Energy Meter Bar */}
                    <div className="w-full h-3 bg-slate-950 rounded-lg p-0.5 border border-slate-800">
                      <div
                        className={`h-full rounded transition-all duration-500 ${
                          pct >= 90
                            ? 'bg-rose-500 glow-coral'
                            : pct >= 70
                            ? 'bg-amber-400'
                            : 'bg-gradient-to-r from-cyan-500 to-lime-400'
                        }`}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. CROWD MOVEMENT Section */}
          <div className="bg-[#080b11] border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-lime-400" />
                <h3 className="text-xs font-mono font-black text-white uppercase tracking-wider">
                  CROWD MOVEMENT
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase">
                TRAJECTORY VECTORS
              </span>
            </div>

            <div className="space-y-3 font-mono">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">MAIN STAGE</h4>
                  <p className="text-[10px] text-slate-400">Post-keynote egress surge anticipated</p>
                </div>
                {getTrendDisplay('increasing')}
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">AI LAB & HALL A</h4>
                  <p className="text-[10px] text-slate-400">Steady seated attendance</p>
                </div>
                {getTrendDisplay('stable')}
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">FOOD COURT A</h4>
                  <p className="text-[10px] text-slate-400">Lunch wave easing down</p>
                </div>
                {getTrendDisplay('decreasing')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

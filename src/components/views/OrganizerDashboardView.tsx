import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  Activity,
  AlertTriangle,
  Radio,
  Sliders,
  Send,
  RefreshCw,
  MapPin,
  Clock,
  ArrowRight,
  Layers,
  ChevronRight,
  CheckCircle2,
  Zap,
  Play,
  Pause,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { CrowdService } from '../../services/crowd/crowdService';
import { AnnouncementPriority, VenueZone, Session } from '../../types';

export const OrganizerDashboardView: React.FC = () => {
  const {
    zones,
    sessions,
    announcements,
    metrics,
    updateZoneCount,
    publishAnnouncement,
    updateSessionLocation,
    isLiveSimulationRunning,
    toggleLiveSimulation,
    simulateDemoScenario,
    navigateDirectlyToZone,
    addToast,
  } = useEvent();

  const [selectedZoneToSim, setSelectedZoneToSim] = useState<string>('zone-main-stage');

  // Relocation states
  const [relocateSessionId, setRelocateSessionId] = useState<string>('session-02');
  const [relocateHallId, setRelocateHallId] = useState<string>('zone-hall-c');

  // Announcement state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastPriority, setBroadcastPriority] = useState<AnnouncementPriority>('important');

  const totalAttendees = zones.reduce((a, b) => a + b.currentCount, 0);
  const criticalZones = zones.filter((z) => z.crowdLevel === 'critical' || z.crowdLevel === 'high');

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMsg.trim()) return;
    await publishAnnouncement({
      title: broadcastTitle,
      message: broadcastMsg,
      priority: broadcastPriority,
      targetAudience: 'All Attendees',
    });
    setBroadcastTitle('');
    setBroadcastMsg('');
  };

  const handleRelocate = async () => {
    const targetHall = zones.find((z) => z.id === relocateHallId);
    if (!targetHall) return;
    await updateSessionLocation(relocateSessionId, targetHall.id, targetHall.name);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-4 pb-16 font-mono">
      {/* Top Operations Center Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-cyan-500/40 pb-4 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
              FLIGHT OPERATIONS ROOM // LEVEL 0
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            Event Control
          </h1>
          <p className="text-xs text-slate-400">
            TECHNOVA 2026 · LIVE CONTROL TERMINAL
          </p>
        </div>

        {/* Real-time Event Simulation Toggle */}
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
          <div className="flex items-center space-x-2 bg-[#090d16] p-1.5 rounded-2xl border border-cyan-500/30">
            <button
              onClick={toggleLiveSimulation}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all flex items-center space-x-2 shadow-lg ${
                isLiveSimulationRunning
                  ? 'bg-cyan-500 text-black border-cyan-300 glow-cyan font-black'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {isLiveSimulationRunning ? (
                <Pause className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current" />
              )}
              <span>
                REAL-TIME SIMULATION: {isLiveSimulationRunning ? 'ONLINE' : 'PAUSED'}
              </span>
            </button>
            <div className="px-2.5 py-1 flex items-center space-x-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isLiveSimulationRunning ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'
                }`}
              />
              <span className="text-[10px] uppercase font-bold text-slate-400">
                {isLiveSimulationRunning ? 'Fluctuating & Shifting' : 'Static'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Requirement 15: Top 3 Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* LIVE ATTENDEES */}
        <div className="p-5 rounded-3xl bg-[#080b11] border-2 border-cyan-500/30 space-y-1 shadow-xl glow-cyan-sm">
          <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-widest block">
            LIVE ATTENDEES
          </span>
          <div className="text-4xl font-black text-white tracking-tighter">
            {totalAttendees.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-400">RFID turnstiles & beacon aggregate</p>
        </div>

        {/* EVENT PRESSURE */}
        <div className="p-5 rounded-3xl bg-[#080b11] border-2 border-amber-500/30 space-y-1 shadow-xl glow-amber">
          <span className="text-[10px] text-amber-400 uppercase font-bold tracking-widest block">
            EVENT PRESSURE
          </span>
          <div className="text-4xl font-black text-amber-400 tracking-tighter">
            {metrics.averageOccupancyRate}%
          </div>
          <p className="text-[10px] text-slate-400">Average venue capacity saturation</p>
        </div>

        {/* ACTIVE ALERTS */}
        <div className="p-5 rounded-3xl bg-[#080b11] border-2 border-rose-500/30 space-y-1 shadow-xl glow-coral">
          <span className="text-[10px] text-rose-400 uppercase font-bold tracking-widest block">
            ACTIVE ALERTS
          </span>
          <div className="text-4xl font-black text-rose-400 tracking-tighter">
            {criticalZones.length > 0 ? `0${criticalZones.length}` : '00'}
          </div>
          <p className="text-[10px] text-slate-400">Congestion or location changes</p>
        </div>
      </div>

      {/* Center Layout: Left (8 cols) = Huge Live Venue Control Map & Simulation Sliders; Right (4 cols) = Live Incidents & Instant Dispatch */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Huge Live Venue Map & Sliders */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#06080d] border-2 border-cyan-500/30 rounded-3xl p-5 shadow-2xl bg-tech-grid">
            <div className="flex justify-between items-center text-xs text-cyan-400 mb-3 border-b border-slate-800 pb-2">
              <span className="font-bold">LIVE VENUE OPERATING BLUEPRINT</span>
              <span className="text-lime-400 font-bold">● ONLINE</span>
            </div>

            {/* SVG Live Control Map */}
            <div className="relative w-full aspect-[16/10] bg-[#070b12] rounded-2xl border border-slate-800 overflow-hidden">
              <svg viewBox="0 0 1000 700" className="w-full h-full select-none">
                {zones.map((zone) => {
                  const x = zone.coordinates.x * 10;
                  const y = zone.coordinates.y * 7;
                  const w = zone.coordinates.width * 10;
                  const h = zone.coordinates.height * 7;
                  const pct = Math.round((zone.currentCount / zone.capacity) * 100);
                  const isSelected = selectedZoneToSim === zone.id;

                  const strokeColor =
                    zone.crowdLevel === 'critical'
                      ? '#f43f5e'
                      : zone.crowdLevel === 'high'
                      ? '#f59e0b'
                      : isSelected
                      ? '#00f2fe'
                      : '#334155';

                  const fillColor =
                    zone.crowdLevel === 'critical'
                      ? 'rgba(244, 63, 94, 0.25)'
                      : zone.crowdLevel === 'high'
                      ? 'rgba(245, 158, 11, 0.2)'
                      : isSelected
                      ? 'rgba(0, 242, 254, 0.15)'
                      : 'rgba(15, 23, 42, 0.6)';

                  return (
                    <g
                      key={zone.id}
                      onClick={() => setSelectedZoneToSim(zone.id)}
                      className="cursor-pointer group"
                    >
                      <rect
                        x={x}
                        y={y}
                        width={w}
                        height={h}
                        rx="12"
                        fill={fillColor}
                        stroke={strokeColor}
                        strokeWidth={isSelected ? 2.5 : 1.5}
                        className="transition-colors group-hover:stroke-cyan-400"
                      />
                      <text
                        x={x + w / 2}
                        y={y + h / 2 - 4}
                        fill="#f8fafc"
                        fontSize="11"
                        fontWeight="bold"
                        textAnchor="middle"
                        className="pointer-events-none uppercase"
                      >
                        {zone.code}
                      </text>
                      <text
                        x={x + w / 2}
                        y={y + h / 2 + 12}
                        fill={strokeColor}
                        fontSize="10"
                        fontWeight="bold"
                        textAnchor="middle"
                        className="pointer-events-none"
                      >
                        {pct}%
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Requirement 16: Dynamic Crowd Simulation Slider */}
            {(() => {
              const activeSimZone = zones.find((z) => z.id === selectedZoneToSim) || zones[0];
              const pct = Math.round((activeSimZone.currentCount / activeSimZone.capacity) * 100);

              return (
                <div className="mt-4 p-5 rounded-2xl bg-[#090d16] border border-cyan-500/30 space-y-3">
                  <div className="flex flex-wrap items-center justify-between text-xs">
                    <span className="text-cyan-400 font-bold uppercase">
                      MAIN STAGE & ZONE SIMULATION SLIDER
                    </span>
                    <span
                      className={`font-black px-2.5 py-0.5 rounded-full border text-[11px] ${
                        pct >= 90
                          ? 'bg-rose-950 border-rose-500 text-rose-300'
                          : pct >= 75
                          ? 'bg-amber-950 border-amber-500 text-amber-300'
                          : 'bg-lime-950 border-lime-500 text-lime-300'
                      }`}
                    >
                      {activeSimZone.name}: {pct}% FULL
                    </span>
                  </div>

                  <div className="space-y-1">
                    <input
                      type="range"
                      min={0}
                      max={activeSimZone.capacity}
                      value={activeSimZone.currentCount}
                      onChange={(e) => {
                        const nextCount = Number(e.target.value);
                        updateZoneCount(activeSimZone.id, nextCount);
                        if (nextCount / activeSimZone.capacity >= 0.85) {
                          addToast(
                            '⚠ CAPACITY WARNING',
                            `${activeSimZone.name} approaching capacity threshold (${Math.round(
                              (nextCount / activeSimZone.capacity) * 100
                            )}%). Attendees rerouted.`,
                            'warning'
                          );
                        }
                      }}
                      aria-label={`Capacity slider for ${activeSimZone.name}`}
                      className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-900 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>0 Attendees (Empty)</span>
                      <span className="text-white font-bold">
                        {activeSimZone.currentCount} / {activeSimZone.capacity}
                      </span>
                      <span>{activeSimZone.capacity} (Max Capacity)</span>
                    </div>
                  </div>

                  {pct >= 85 && (
                    <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-300 text-xs flex items-center space-x-2 animate-in fade-in">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 animate-bounce" />
                      <span>
                        ⚠ {activeSimZone.name.toUpperCase()} APPROACHING CRITICAL CAPACITY. Living paths
                        automatically detour incoming traffic.
                      </span>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Quick Dynamic Relocation Hub */}
          <div className="bg-[#080b11] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center space-x-2 text-xs text-white font-bold uppercase">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>DYNAMIC SESSION RELOCATION ENGINE</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase">Select Session</label>
                <select
                  value={relocateSessionId}
                  onChange={(e) => setRelocateSessionId(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                >
                  {sessions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.hallName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase">Relocate to Hall</label>
                <select
                  value={relocateHallId}
                  onChange={(e) => setRelocateHallId(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                >
                  {zones
                    .filter((z) => z.type === 'stage' || z.type === 'workshop')
                    .map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.name} ({z.code})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleRelocate}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg glow-amber cursor-pointer"
            >
              Relocate Session & Push Live Signal to All Attendees
            </button>
          </div>

          {/* Real-time Event Simulation Feed & Responsiveness Panel */}
          <div className="bg-[#080b11] border border-cyan-500/30 rounded-3xl p-5 space-y-3 shadow-xl glow-cyan-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isLiveSimulationRunning ? 'bg-cyan-400 animate-ping' : 'bg-slate-600'}`} />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  REAL-TIME EVENT SIMULATION TELEMETRY
                </span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase ${
                isLiveSimulationRunning ? 'bg-cyan-950 border-cyan-400 text-cyan-300' : 'bg-slate-900 border-slate-700 text-slate-500'
              }`}>
                {isLiveSimulationRunning ? 'SYSTEM RESPONSIVE' : 'STREAM MUTED'}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Dynamic simulator pulses crowd headcounts across all zones every 3s, shifts overloaded sessions to higher-capacity auditoriums, activates virtual streams, and recalculates navigational routes in real time.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span>CROWD BEACON PULSE</span>
                  <span className="text-cyan-400 font-bold">±4–8 FLUX</span>
                </div>
                <div className="text-[10px] text-slate-500">Auto-updates zone load & route detours</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span>SESSION ENGINE</span>
                  <span className="text-amber-400 font-bold">AUTO RELOCATE / LIVE</span>
                </div>
                <div className="text-[10px] text-slate-500">Broadcasts room shifts & live alerts</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): LIVE INCIDENTS */}
        <div className="lg:col-span-4 space-y-6">
          {/* Requirement 15: LIVE INCIDENTS */}
          <div className="bg-[#080b11] border-2 border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-white uppercase">
                <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" />
                <span>LIVE INCIDENTS</span>
              </div>
              <span className="text-[10px] text-slate-400">REAL-TIME LOG</span>
            </div>

            <div className="space-y-3">
              {/* Main Stage */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">🔴 MAIN STAGE</h4>
                  <p className="text-[10px] text-slate-400">Keynote auditorium</p>
                </div>
                <span className="text-xs font-black text-rose-400">
                  {Math.round((zones[0].currentCount / zones[0].capacity) * 100)}% CAPACITY
                </span>
              </div>

              {/* Food Court */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">🟡 FOOD COURT</h4>
                  <p className="text-[10px] text-slate-400">Lunch wave</p>
                </div>
                <span className="text-xs font-black text-amber-400">
                  {Math.round((zones[1].currentCount / zones[1].capacity) * 100)}% CAPACITY
                </span>
              </div>

              {/* AI Lab */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">🟢 AI LAB</h4>
                  <p className="text-[10px] text-slate-400">Normal flow</p>
                </div>
                <span className="text-xs font-black text-lime-400">
                  {Math.round((zones[2].currentCount / zones[2].capacity) * 100)}% CAPACITY
                </span>
              </div>
            </div>
          </div>

          {/* Live Signal Announcement Broadcaster */}
          <div className="bg-[#080b11] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400 uppercase">
              <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>DISPATCH LIVE SIGNAL</span>
            </div>

            <form onSubmit={handlePublish} className="space-y-3">
              <input
                type="text"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder="Signal Headline"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <textarea
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
                placeholder="Broadcast instructions..."
                rows={3}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <div className="flex justify-between items-center">
                <select
                  value={broadcastPriority}
                  onChange={(e) => setBroadcastPriority(e.target.value as AnnouncementPriority)}
                  className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl p-2"
                >
                  <option value="routine">Routine</option>
                  <option value="important">Important</option>
                  <option value="emergency">Emergency</option>
                </select>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase cursor-pointer"
                >
                  Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

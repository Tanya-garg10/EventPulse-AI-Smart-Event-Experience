import React, { useState, useMemo } from 'react';
import {
  Navigation,
  Compass,
  Layers,
  AlertTriangle,
  Info,
  Clock,
  CheckCircle2,
  Accessibility,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Search,
  Filter,
  Bookmark,
  Shield,
  Zap,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { RoutingService } from '../../services/navigation/routingService';
import { CrowdService } from '../../services/crowd/crowdService';
import { VenueZone, RouteOption } from '../../types';
import { VENUE_NODES } from '../../data/eventData';

export const InteractiveMapView: React.FC = () => {
  const {
    zones,
    selectedDestinationZoneId,
    setSelectedDestinationZoneId,
    selectedOriginZoneId,
    setSelectedOriginZoneId,
    accessibilitySettings,
    updateAccessibility,
    sessions,
    toggleSaveSession,
    savedSessionIds,
    isLiveSimulationRunning,
  } = useEvent();

  const [activeFloor, setActiveFloor] = useState<1 | 2>(1);
  const [selectedZone, setSelectedZone] = useState<VenueZone | null>(() => {
    if (selectedDestinationZoneId) {
      return zones.find((z) => z.id === selectedDestinationZoneId) || zones[0];
    }
    return zones[0];
  });

  const [selectedRouteType, setSelectedRouteType] = useState<'fastest' | 'crowd_aware' | 'accessible'>(
    accessibilitySettings.wheelchair || accessibilitySettings.avoidStairs ? 'accessible' : 'crowd_aware'
  );

  // Compute multi-route options deterministically
  const routes = useMemo(() => {
    const destId = selectedZone ? selectedZone.id : selectedDestinationZoneId || 'zone-main-stage';
    return RoutingService.calculateRoutes(
      selectedOriginZoneId,
      destId,
      zones,
      accessibilitySettings.wheelchair || accessibilitySettings.avoidStairs
    );
  }, [selectedOriginZoneId, selectedZone, selectedDestinationZoneId, zones, accessibilitySettings]);

  const activeRoute =
    selectedRouteType === 'fastest'
      ? routes.fastest
      : selectedRouteType === 'accessible'
      ? routes.accessible
      : routes.crowdAware;

  const zoneSession = sessions.find((s) => s.hallId === selectedZone?.id);

  // SVG path coordinates generator
  const routePathSvg = useMemo(() => {
    if (!activeRoute || !activeRoute.pathNodes || activeRoute.pathNodes.length === 0) return null;
    const points = activeRoute.pathNodes
      .map((nodeId) => {
        const node = VENUE_NODES[nodeId];
        if (!node) return null;
        return `${node.x * 10},${node.y * 7}`;
      })
      .filter(Boolean);
    if (points.length < 2) return null;
    return `M ${points.join(' L ')}`;
  }, [activeRoute]);

  // Intermediate callout positions on route
  const intermediateWaypoint = useMemo(() => {
    if (!activeRoute?.pathNodes || activeRoute.pathNodes.length < 3) return null;
    const midNodeId = activeRoute.pathNodes[Math.floor(activeRoute.pathNodes.length / 2)];
    const node = VENUE_NODES[midNodeId];
    if (!node) return null;
    return {
      x: node.x * 10,
      y: node.y * 7,
      label: node.isElevator
        ? 'Elevator Available'
        : node.isStairs
        ? 'Stairs Ahead'
        : 'Crowd Monitored',
    };
  }, [activeRoute]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 sm:px-4 pb-16">
      {/* Header HUD: Mode & Floor Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-cyan-500/20 pb-4 gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 block">
            VENUE BLUEPRINT INTELLIGENCE
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
            The Living Map
          </h1>
          <p className="text-xs font-mono text-slate-400">
            Real-time indoor radar with dynamic crowd particle density & living paths
          </p>
        </div>

        {/* Floor & Level Switcher */}
        <div className="flex items-center space-x-2 bg-[#090d16] p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveFloor(1)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
              activeFloor === 1
                ? 'bg-cyan-500 text-black shadow-lg glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Level 1 · Ground Atrium
          </button>
          <button
            onClick={() => setActiveFloor(2)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
              activeFloor === 2
                ? 'bg-cyan-500 text-black shadow-lg glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Level 2 · Mezzanine & Labs
          </button>
        </div>
      </div>

      {/* Main Blueprint & Living Route Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): The Dark Venue Blueprint Canvas */}
        <div className="lg:col-span-8 space-y-4">
          {/* Blueprint Container */}
          <div className="relative bg-[#06080d] border-2 border-cyan-500/30 rounded-3xl p-4 shadow-2xl overflow-hidden bg-tech-grid">
            {/* Ambient radar sweep glow in background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

            {/* Top Blueprint Info Overlay */}
            <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-cyan-400/80 mb-2">
              <span>● EVENTPULSE VENUE MATRIX // LEVEL {activeFloor}</span>
              <span className="flex items-center space-x-1 text-lime-400">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
                <span>CROWD TELEMETRY STREAMING</span>
              </span>
            </div>

            {/* SVG Venue Map Canvas */}
            <div className="relative w-full aspect-[16/10] bg-[#070b12] rounded-2xl border border-slate-800/80 overflow-hidden">
              <svg
                viewBox="0 0 1000 700"
                className="w-full h-full select-none"
                style={{ filter: 'drop-shadow(0 0 15px rgba(0,242,254,0.05))' }}
              >
                {/* Architectural Grid Guidelines */}
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 242, 254, 0.04)" strokeWidth="1" />
                  </pattern>
                  <linearGradient id="livingCyan" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00f2fe" />
                    <stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>
                  <linearGradient id="livingLime" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a3e635" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                </defs>

                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Corridor Connections */}
                <g stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" opacity="0.6">
                  <line x1="500" y1="588" x2="500" y2="504" />
                  <line x1="500" y1="504" x2="220" y2="546" />
                  <line x1="500" y1="504" x2="800" y2="546" />
                  <line x1="500" y1="504" x2="500" y2="364" />
                  <line x1="500" y1="364" x2="260" y2="364" />
                  <line x1="500" y1="364" x2="740" y2="364" />
                  <line x1="500" y1="364" x2="500" y2="238" />
                  <line x1="500" y1="238" x2="500" y2="154" />
                </g>

                {/* Living Route Path Animation */}
                {routePathSvg && (
                  <g>
                    {/* Living Route Outer Glow */}
                    <path
                      d={routePathSvg}
                      fill="none"
                      stroke={selectedRouteType === 'accessible' ? '#a3e635' : '#00f2fe'}
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.25"
                      className="blur-sm"
                    />
                    {/* Animated Stream */}
                    <path
                      d={routePathSvg}
                      fill="none"
                      stroke={selectedRouteType === 'accessible' ? '#a3e635' : '#00f2fe'}
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="animate-living-path"
                    />
                  </g>
                )}

                {/* Intermediate Living Callout */}
                {intermediateWaypoint && (
                  <g transform={`translate(${intermediateWaypoint.x}, ${intermediateWaypoint.y})`}>
                    <circle r="6" fill="#00f2fe" className="animate-ping" />
                    <circle r="4" fill="#fff" />
                    <rect
                      x="-60"
                      y="-32"
                      width="120"
                      height="22"
                      rx="6"
                      fill="#080b11"
                      stroke="#00f2fe"
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="-18"
                      fill="#00f2fe"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {intermediateWaypoint.label.toUpperCase()}
                    </text>
                  </g>
                )}

                {/* Render Illuminated Venue Zones */}
                {zones
                  .filter((z) => (activeFloor === 2 ? z.floor === 2 : z.floor === 1))
                  .map((zone) => {
                    const x = zone.coordinates.x * 10;
                    const y = zone.coordinates.y * 7;
                    const w = zone.coordinates.width * 10;
                    const h = zone.coordinates.height * 7;

                    const isSelected = selectedZone?.id === zone.id;
                    const isOrigin = selectedOriginZoneId === zone.id;
                    const pct = CrowdService.getOccupancyPercentage(zone.currentCount, zone.capacity);

                    // Border color by state: Cyan for selected, Coral for critical, Amber for high, Lime for low
                    let strokeColor = '#334155';
                    let glowClass = '';
                    if (isSelected) {
                      strokeColor = '#00f2fe';
                      glowClass = 'stroke-[2.5]';
                    } else if (zone.crowdLevel === 'critical') {
                      strokeColor = '#f43f5e';
                    } else if (zone.crowdLevel === 'high') {
                      strokeColor = '#f59e0b';
                    } else if (zone.crowdLevel === 'low') {
                      strokeColor = '#84cc16';
                    }

                    // Calculate number of simulated animated crowd particles for this zone
                    const particleCount = Math.min(10, Math.max(2, Math.floor(pct / 10)));

                    return (
                      <g
                        key={zone.id}
                        onClick={() => {
                          setSelectedZone(zone);
                          setSelectedDestinationZoneId(zone.id);
                        }}
                        className="cursor-pointer transition-all group"
                      >
                        {/* Zone Illuminated Floor Region */}
                        <rect
                          x={x}
                          y={y}
                          width={w}
                          height={h}
                          rx="14"
                          fill={isSelected ? '#0c1626' : '#080c14'}
                          stroke={strokeColor}
                          strokeWidth={isSelected ? 2.5 : 1.5}
                          className="transition-colors duration-200 group-hover:fill-[#0f1b2e]"
                        />

                        {/* Crowd Particle Density Simulation inside Zone */}
                        {Array.from({ length: particleCount }).map((_, i) => {
                          const px = x + 15 + ((i * 37) % (w - 30));
                          const py = y + 15 + ((i * 23) % (h - 30));
                          const dotColor =
                            zone.crowdLevel === 'critical'
                              ? '#f43f5e'
                              : zone.crowdLevel === 'high'
                              ? '#f59e0b'
                              : '#38bdf8';
                          return (
                            <circle
                              key={i}
                              cx={px}
                              cy={py}
                              r={zone.crowdLevel === 'critical' ? 2.5 : 2}
                              fill={dotColor}
                              opacity={0.7}
                              className={isLiveSimulationRunning ? 'animate-pulse' : ''}
                            />
                          );
                        })}

                        {/* Origin Marker "YOU" */}
                        {isOrigin && (
                          <g>
                            <circle cx={x + 20} cy={y + 20} r="10" fill="#a3e635" className="animate-pulse" />
                            <text
                              x={x + 20}
                              y={y + 23}
                              fill="#000"
                              fontSize="8"
                              fontWeight="900"
                              fontFamily="monospace"
                              textAnchor="middle"
                            >
                              YOU
                            </text>
                          </g>
                        )}

                        {/* Destination Star Pin */}
                        {isSelected && (
                          <g>
                            <circle cx={x + w - 20} cy={y + 20} r="10" fill="#00f2fe" />
                            <text
                              x={x + w - 20}
                              y={y + 24}
                              fill="#000"
                              fontSize="12"
                              fontWeight="bold"
                              textAnchor="middle"
                            >
                              ★
                            </text>
                          </g>
                        )}

                        {/* Zone Name Label */}
                        <text
                          x={x + w / 2}
                          y={y + h / 2 - 6}
                          fill="#f8fafc"
                          fontSize="12"
                          fontWeight="700"
                          fontFamily="sans-serif"
                          textAnchor="middle"
                          className="pointer-events-none uppercase tracking-wider"
                        >
                          {zone.name.length > 20 ? zone.name.slice(0, 18) + '…' : zone.name}
                        </text>

                        {/* Percentage and Occupancy */}
                        <text
                          x={x + w / 2}
                          y={y + h / 2 + 14}
                          fill={
                            zone.crowdLevel === 'critical'
                              ? '#f43f5e'
                              : zone.crowdLevel === 'high'
                              ? '#fbbf24'
                              : zone.crowdLevel === 'moderate'
                              ? '#fde047'
                              : '#84cc16'
                          }
                          fontSize="10"
                          fontWeight="bold"
                          fontFamily="monospace"
                          textAnchor="middle"
                          className="pointer-events-none"
                        >
                          ◉ {pct}% FULL · {zone.currentCount}/{zone.capacity}
                        </text>
                      </g>
                    );
                  })}
              </svg>
            </div>

            {/* Interactive Origin Selector Bar */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono bg-[#080b11] p-3 rounded-2xl border border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="text-slate-400 uppercase text-[10px]">CURRENT LOCATION:</span>
                <select
                  value={selectedOriginZoneId}
                  onChange={(e) => setSelectedOriginZoneId(e.target.value)}
                  aria-label="Current Location Origin Zone"
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-cyan-300 font-bold focus:outline-none focus:border-cyan-400 text-xs"
                >
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} ({z.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-3 text-[11px]">
                <span className="flex items-center space-x-1 text-lime-400">
                  <span className="w-2 h-2 rounded-full bg-lime-400" />
                  <span>&lt;50% Safe</span>
                </span>
                <span className="flex items-center space-x-1 text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>50-80% Moderate</span>
                </span>
                <span className="flex items-center space-x-1 text-rose-400">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  <span>&gt;80% Surge</span>
                </span>
              </div>
            </div>
          </div>

          {/* Living Route Visualization & Selection */}
          <div className="bg-[#080b11] border border-cyan-500/20 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Navigation className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-mono font-black text-white uppercase tracking-wider">
                  LIVING PATH OPTIONS
                </h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-400">
                DYNAMIC DIJKSTRA RESOLVER
              </span>
            </div>

            {/* 3 Living Route Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* FASTEST */}
              <button
                onClick={() => setSelectedRouteType('fastest')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedRouteType === 'fastest'
                    ? 'bg-cyan-950/80 border-cyan-400 shadow-lg glow-cyan scale-102'
                    : 'bg-[#0a0e16] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-start text-xs font-mono mb-1">
                  <span className="font-bold text-white uppercase">FASTEST</span>
                  <span className="text-cyan-400 font-bold">{routes.fastest.durationMinutes} MIN</span>
                </div>
                <div className="h-1 w-full bg-slate-800 rounded-full my-2 overflow-hidden">
                  <div className="h-full bg-cyan-400 w-full" />
                </div>
                <span className="text-[10px] text-slate-400 block font-mono">
                  {routes.fastest.distanceMeters}m · Direct transit
                </span>
              </button>

              {/* CROWD-AWARE */}
              <button
                onClick={() => setSelectedRouteType('crowd_aware')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedRouteType === 'crowd_aware'
                    ? 'bg-cyan-950/80 border-cyan-400 shadow-lg glow-cyan scale-102'
                    : 'bg-[#0a0e16] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-start text-xs font-mono mb-1">
                  <span className="font-bold text-white uppercase">CROWD-AWARE</span>
                  <span className="text-lime-400 font-bold">{routes.crowdAware.durationMinutes} MIN</span>
                </div>
                <div className="h-1 w-full bg-slate-800 rounded-full my-2 overflow-hidden">
                  <div className="h-full bg-lime-400 w-full" />
                </div>
                <span className="text-[10px] text-lime-300 block font-mono">
                  {routes.crowdAware.distanceMeters}m · Evades bottlenecks
                </span>
              </button>

              {/* ACCESSIBLE */}
              <button
                onClick={() => setSelectedRouteType('accessible')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedRouteType === 'accessible'
                    ? 'bg-cyan-950/80 border-cyan-400 shadow-lg glow-cyan scale-102'
                    : 'bg-[#0a0e16] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-start text-xs font-mono mb-1">
                  <span className="font-bold text-white uppercase">ACCESSIBLE</span>
                  <span className="text-amber-400 font-bold">{routes.accessible.durationMinutes} MIN</span>
                </div>
                <div className="h-1 w-full bg-slate-800 rounded-full my-2 overflow-hidden">
                  <div className="h-full bg-amber-400 w-full" />
                </div>
                <span className="text-[10px] text-amber-300 block font-mono">
                  {routes.accessible.distanceMeters}m · Step-free ramps
                </span>
              </button>
            </div>

            {/* Requirement 14: "YOUR ROUTE" Direct Modifiers */}
            <div className="pt-3 border-t border-slate-800/80">
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block mb-2">
                YOUR ROUTE MODIFIERS
              </span>
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                <button
                  onClick={() =>
                    updateAccessibility({ avoidStairs: !accessibilitySettings.avoidStairs })
                  }
                  className={`px-3 py-1.5 rounded-xl border transition-all ${
                    accessibilitySettings.avoidStairs
                      ? 'bg-lime-950 border-lime-400 text-lime-300 glow-lime'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  ✓ NO STAIRS
                </button>

                <button
                  onClick={() =>
                    updateAccessibility({ avoidCrowds: !accessibilitySettings.avoidCrowds })
                  }
                  className={`px-3 py-1.5 rounded-xl border transition-all ${
                    accessibilitySettings.avoidCrowds
                      ? 'bg-lime-950 border-lime-400 text-lime-300 glow-lime'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  ✓ LOW CROWD
                </button>

                <button
                  onClick={() =>
                    updateAccessibility({ preferElevators: !accessibilitySettings.preferElevators })
                  }
                  className={`px-3 py-1.5 rounded-xl border transition-all ${
                    accessibilitySettings.preferElevators
                      ? 'bg-lime-950 border-lime-400 text-lime-300 glow-lime'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  ✓ ELEVATOR
                </button>

                <button
                  onClick={() =>
                    updateAccessibility({ wheelchair: !accessibilitySettings.wheelchair })
                  }
                  className={`px-3 py-1.5 rounded-xl border transition-all ${
                    accessibilitySettings.wheelchair
                      ? 'bg-lime-950 border-lime-400 text-lime-300 glow-lime'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  ✓ WIDE PATH
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Selected Zone Inspector & Step Navigation */}
        <div className="lg:col-span-4 space-y-6">
          {selectedZone ? (
            <div className="bg-[#080b11] border-2 border-cyan-500/30 rounded-3xl p-6 space-y-5 shadow-2xl">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                  ZONE INSPECTOR // {selectedZone.code}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                    selectedZone.crowdLevel === 'critical'
                      ? 'bg-rose-950 border-rose-500 text-rose-300 glow-coral'
                      : selectedZone.crowdLevel === 'high'
                      ? 'bg-amber-950 border-amber-500 text-amber-300'
                      : 'bg-lime-950 border-lime-500 text-lime-300'
                  }`}
                >
                  {selectedZone.crowdLevel.toUpperCase()}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">
                  {selectedZone.name}
                </h3>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Level {selectedZone.floor} · {selectedZone.type}
                </p>
              </div>

              {/* Occupancy Bar */}
              <div className="space-y-1.5 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">PRESSURE METRIC</span>
                  <span className="font-bold text-white">
                    {Math.round((selectedZone.currentCount / selectedZone.capacity) * 100)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      selectedZone.crowdLevel === 'critical'
                        ? 'bg-rose-500'
                        : selectedZone.crowdLevel === 'high'
                        ? 'bg-amber-400'
                        : 'bg-cyan-400'
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        (selectedZone.currentCount / selectedZone.capacity) * 100
                      )}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-1">
                  <span>{selectedZone.currentCount} attendees present</span>
                  <span>Max {selectedZone.capacity}</span>
                </div>
              </div>

              {/* Active Session in Zone if any */}
              {zoneSession && (
                <div className="p-4 rounded-2xl bg-[#0c121d] border border-cyan-500/30 space-y-2">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block">
                    ACTIVE SCHEDULED SESSION
                  </span>
                  <h4 className="text-sm font-bold text-white uppercase">
                    {zoneSession.title}
                  </h4>
                  <p className="text-xs font-mono text-slate-400">
                    {zoneSession.startTime} – {zoneSession.endTime} · {zoneSession.speaker}
                  </p>
                  <button
                    onClick={() => toggleSaveSession(zoneSession.id)}
                    className="mt-2 text-xs font-mono text-cyan-400 hover:underline flex items-center space-x-1"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>
                      {savedSessionIds.includes(zoneSession.id) ? 'SAVED IN SCHEDULE' : 'SAVE SESSION'}
                    </span>
                  </button>
                </div>
              )}

              {/* Turn-by-turn Directions */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
                  TURN-BY-TURN GUIDANCE
                </span>
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {(activeRoute?.stepInstructions || []).map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs font-mono flex items-start space-x-2.5"
                    >
                      <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <span className="text-slate-300 flex-1 leading-relaxed">{step}</span>
                    </div>
                  ))}
                  {(!activeRoute?.stepInstructions || activeRoute.stepInstructions.length === 0) && (
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs font-mono text-slate-400">
                      Follow central concourse signage to target zone.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#080b11] border border-slate-800 rounded-3xl p-8 text-center text-slate-500 font-mono text-xs">
              Select a zone on the living blueprint to inspect real-time conditions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

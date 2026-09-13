import React, { useState } from 'react';
import {
  Compass,
  Bot,
  Calendar,
  Users,
  ShieldAlert,
  Dna,
  Radio,
  Sliders,
  Sparkles,
  Bell,
  Search,
  CheckCircle2,
  Navigation,
  Activity,
  Flame,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { useEvent, AppView } from '../../context/EventContext';
import { DynamicIslandHUD } from './DynamicIslandHUD';

export const Header: React.FC = () => {
  const {
    activeView,
    setActiveView,
    currentRole,
    setCurrentRole,
    announcements,
    markAnnouncementAsRead,
    setAssistanceModeActive,
    searchQuery,
    setSearchQuery,
    navigateDirectlyToZone,
    isLiveSimulationRunning,
  } = useEvent();

  const [isSignalsOpen, setIsSignalsOpen] = useState(false);
  const unreadCount = announcements.filter((a) => !a.read).length;

  const navItems: { id: AppView; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'EVENT PULSE', icon: <Radio className="w-3.5 h-3.5" /> },
    { id: 'map', label: 'LIVING MAP', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'concierge', label: 'PULSE AI', icon: <Bot className="w-3.5 h-3.5" /> },
    { id: 'dna', label: 'EVENT DNA', icon: <Dna className="w-3.5 h-3.5" /> },
    { id: 'schedule', label: 'TIMETABLE', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'crowd', label: 'PRESSURE', icon: <Activity className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="w-full space-y-3 pt-2">
      {/* 1. Futuristic Apple Dynamic Island HUD at the very top */}
      <DynamicIslandHUD />

      {/* 2. Sleek Secondary Command Bar for Desktop */}
      <div className="max-w-6xl mx-auto px-3 hidden md:flex items-center justify-between py-2 border-b border-cyan-500/15 text-xs font-mono">
        {/* Navigation Items */}
        <nav aria-label="Main Navigation" className="flex items-center space-x-1">
          {navItems.map((item) => {
            const isActive = activeView === item.id && currentRole === 'attendee';
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentRole('attendee');
                  setActiveView(item.id);
                }}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-950 border border-cyan-400 text-cyan-300 shadow-md glow-cyan-sm font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <span className={isActive ? 'text-cyan-400' : 'text-slate-500'}>{item.icon}</span>
                <span className="tracking-wider uppercase text-[11px]">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Live Signals Drawer Trigger */}
        <div className="relative flex items-center space-x-3">
          <button
            onClick={() => setIsSignalsOpen(!isSignalsOpen)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 text-slate-300 hover:border-cyan-400 text-xs transition-colors cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] tracking-wider uppercase font-bold">LIVE SIGNALS</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white font-bold text-[9px] animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Live Signals Flyout Modal */}
          {isSignalsOpen && (
            <div className="absolute right-0 top-10 z-50 w-80 bg-[#080b11] border-2 border-cyan-500/30 rounded-3xl p-4 shadow-2xl space-y-3 animate-in fade-in">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-white uppercase">INCOMING LIVE SIGNALS</span>
                <button
                  onClick={() => setIsSignalsOpen(false)}
                  className="text-slate-500 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {announcements.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => markAnnouncementAsRead(a.id)}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1 cursor-pointer hover:border-cyan-500/50 transition-colors"
                  >
                    <div className="flex justify-between text-[9px] text-slate-500">
                      <span className="text-cyan-400 font-bold">{a.timestamp}</span>
                      <span className="uppercase text-amber-400">{a.priority}</span>
                    </div>
                    <h5 className="text-xs font-bold text-white uppercase">{a.title}</h5>
                    <p className="text-[10px] text-slate-400">{a.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useEvent } from '../../context/EventContext';
import {
  Compass,
  Bot,
  Users,
  ShieldAlert,
  ArrowRight,
  Activity,
  Layers,
  Sparkles,
  Navigation,
  Zap,
} from 'lucide-react';
import { EventPulse } from '../common/EventPulse';

export const LandingView: React.FC = () => {
  const { setActiveView, setCurrentRole, zones } = useEvent();

  return (
    <div className="space-y-16 pb-16">
      {/* Huge Interactive Living Map Hero Viewport */}
      <section className="relative min-h-[85vh] flex flex-col justify-between p-4 sm:p-8 rounded-3xl border border-cyan-500/20 bg-[#06080d] bg-tech-grid overflow-hidden shadow-2xl">
        {/* Living blueprint ambient radar glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-600/5 blur-3xl pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full bg-lime-500/5 blur-3xl pointer-events-none" />

        {/* Top Header Row of Hero */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest">
              EVENT OPERATING SYSTEM v2.6
            </span>
          </div>

          {/* Floating live signal chip */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-lime-400/40 text-xs font-mono text-lime-300 shadow-lg glow-lime">
            <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
            <span>● 1,284 ATTENDEES ONLINE</span>
          </div>
        </div>

        {/* Center: The Living Venue Blueprint with Floating Live Signals */}
        <div className="relative z-10 my-8 py-4 flex flex-col items-center justify-center">
          {/* Floating Live Signals Overlay */}
          <div className="w-full max-w-4xl relative h-72 sm:h-96 border border-cyan-500/20 rounded-3xl bg-[#090d16]/80 backdrop-blur-md overflow-hidden flex items-center justify-center shadow-2xl">
            {/* SVG living grid and radar vector lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
              <circle cx="50%" cy="50%" r="90" fill="none" stroke="#00f2fe" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="50%" cy="50%" r="170" fill="none" stroke="#00f2fe" strokeWidth="1" strokeDasharray="6 6" />
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#00f2fe" strokeWidth="0.5" strokeDasharray="3 3" />
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#00f2fe" strokeWidth="0.5" strokeDasharray="3 3" />
            </svg>

            {/* Central Event Pulse Node */}
            <div className="relative z-10">
              <EventPulse size="md" interactive={false} />
            </div>

            {/* Floating Live Signal 1: Main Stage */}
            <div
              onClick={() => setActiveView('map')}
              className="absolute top-6 left-6 sm:left-12 px-3 py-2 rounded-2xl bg-slate-950/90 border border-amber-500/60 shadow-xl cursor-pointer hover:scale-105 transition-transform glow-amber"
            >
              <div className="flex items-center space-x-2 text-[11px] font-mono">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span className="font-bold text-white">● MAIN STAGE</span>
                <span className="text-amber-400 font-bold">82%</span>
              </div>
              <span className="text-[9px] text-slate-400 block mt-0.5">Keynote commencing</span>
            </div>

            {/* Floating Live Signal 2: AI Workshop */}
            <div
              onClick={() => setActiveView('schedule')}
              className="absolute top-6 right-6 sm:right-12 px-3 py-2 rounded-2xl bg-slate-950/90 border border-cyan-500/60 shadow-xl cursor-pointer hover:scale-105 transition-transform glow-cyan"
            >
              <div className="flex items-center space-x-2 text-[11px] font-mono">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-bold text-white">● AI WORKSHOP</span>
              </div>
              <span className="text-[10px] text-cyan-300 font-mono font-bold block mt-0.5">
                STARTING 08:12
              </span>
            </div>

            {/* Floating Live Signal 3: Food Court */}
            <div
              onClick={() => setActiveView('crowd')}
              className="absolute bottom-6 left-6 sm:left-14 px-3 py-2 rounded-2xl bg-slate-950/90 border border-rose-500/60 shadow-xl cursor-pointer hover:scale-105 transition-transform glow-coral"
            >
              <div className="flex items-center space-x-2 text-[11px] font-mono">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="font-bold text-white">● FOOD COURT</span>
                <span className="text-rose-400 font-bold">BUSY</span>
              </div>
              <span className="text-[9px] text-slate-400 block mt-0.5">Try Food Court B (No queue)</span>
            </div>

            {/* Floating Live Signal 4: Living Navigation */}
            <div
              onClick={() => setActiveView('map')}
              className="absolute bottom-6 right-6 sm:right-14 px-3 py-2 rounded-2xl bg-slate-950/90 border border-lime-500/60 shadow-xl cursor-pointer hover:scale-105 transition-transform glow-lime"
            >
              <div className="flex items-center space-x-2 text-[11px] font-mono">
                <Navigation className="w-3.5 h-3.5 text-lime-400" />
                <span className="font-bold text-white">LIVING PATHS</span>
              </div>
              <span className="text-[9px] text-lime-300 block mt-0.5">3 Active Reroutes</span>
            </div>
          </div>
        </div>

        {/* Hero Overlay Titles & Actions */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-5">
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-7xl font-black text-white tracking-tight uppercase">
              EVENTPULSE
            </h1>
            <p className="text-xs sm:text-sm font-mono tracking-[0.3em] uppercase text-cyan-400 font-bold">
              LIVE EVENT INTELLIGENCE
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xl sm:text-2xl font-bold text-slate-200">
              Your event is alive.
            </p>
            <p className="text-base sm:text-lg text-slate-400">
              We help you move through it.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setActiveView('home')}
              className="px-8 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-sm uppercase tracking-wider flex items-center space-x-2 transition-all shadow-xl glow-cyan hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>ENTER EVENT</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveView('concierge')}
              className="px-8 py-4 rounded-2xl bg-[#0e1420] hover:bg-[#151e30] text-cyan-300 font-mono font-bold text-sm uppercase tracking-wider border border-cyan-500/40 flex items-center space-x-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>EXPLORE AI</span>
            </button>

            <button
              onClick={() => {
                setCurrentRole('organizer');
                setActiveView('organizer');
              }}
              className="px-6 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white font-mono text-xs uppercase tracking-wider border border-slate-800 transition-all cursor-pointer"
            >
              <span>EVENT CONTROL ROOM →</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3 Pillars of the Living Event OS */}
      <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#080b11] border border-cyan-500/20 rounded-3xl p-6 space-y-3 shadow-xl hover:border-cyan-500/40 transition-all">
          <div className="w-10 h-10 rounded-2xl bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <Navigation className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 block">
            01 · SPATIAL INTELLIGENCE
          </span>
          <h3 className="text-lg font-bold text-white uppercase">The Living Blueprint</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Indoor dark blueprint with live crowd particle density. Routes recalculate in real-time to evade bottlenecks without risking safety.
          </p>
        </div>

        <div className="bg-[#080b11] border border-amber-500/20 rounded-3xl p-6 space-y-3 shadow-xl hover:border-amber-500/40 transition-all">
          <div className="w-10 h-10 rounded-2xl bg-amber-950/80 border border-amber-400/40 flex items-center justify-center text-amber-300">
            <Bot className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block">
            02 · COMMAND INTERFACE
          </span>
          <h3 className="text-lg font-bold text-white uppercase">Pulse AI</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Floating prompt engine synthesizes sequential 90-minute itineraries, answers venue questions, and turns suggestions directly into living paths.
          </p>
        </div>

        <div className="bg-[#080b11] border border-rose-500/20 rounded-3xl p-6 space-y-3 shadow-xl hover:border-rose-500/40 transition-all">
          <div className="w-10 h-10 rounded-2xl bg-rose-950/80 border border-rose-400/40 flex items-center justify-center text-rose-300">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-rose-400 block">
            03 · IMMEDIATE DEFENSE
          </span>
          <h3 className="text-lg font-bold text-white uppercase">Assistance Mode</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            1-tap SOS transforms the entire interface into high-visibility emergency dispatch. Coordinates instantly ping on-site paramedics and security.
          </p>
        </div>
      </section>
    </div>
  );
};

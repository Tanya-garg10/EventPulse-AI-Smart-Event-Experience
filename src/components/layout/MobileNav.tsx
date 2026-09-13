import React from 'react';
import { Home, Compass, Calendar, ShieldAlert, Zap } from 'lucide-react';
import { useEvent, AppView } from '../../context/EventContext';

export const MobileNav: React.FC = () => {
  const { activeView, setActiveView, setAssistanceModeActive, currentRole } = useEvent();

  if (currentRole === 'organizer') return null;

  return (
    <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#06080d]/95 backdrop-blur-xl border-t border-cyan-500/20 px-3 py-1 flex items-center justify-between shadow-2xl font-mono">
      {/* 1. HOME */}
      <button
        onClick={() => setActiveView('home')}
        className={`flex-1 flex flex-col items-center justify-center py-1.5 transition-all ${
          activeView === 'home' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[9px] uppercase tracking-wider mt-1">HOME</span>
      </button>

      {/* 2. MAP */}
      <button
        onClick={() => setActiveView('map')}
        className={`flex-1 flex flex-col items-center justify-center py-1.5 transition-all ${
          activeView === 'map' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
        }`}
      >
        <Compass className="w-5 h-5" />
        <span className="text-[9px] uppercase tracking-wider mt-1">MAP</span>
      </button>

      {/* 3. Central Signature PULSE Button */}
      <div className="flex-1 flex justify-center -mt-5">
        <button
          onClick={() => setActiveView('concierge')}
          className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-600 via-cyan-400 to-lime-300 p-0.5 shadow-2xl glow-cyan flex flex-col items-center justify-center text-black active:scale-90 transition-transform"
        >
          <div className="w-full h-full rounded-full bg-[#070b12] flex flex-col items-center justify-center text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping mb-0.5" />
            <span className="text-[8px] font-black tracking-widest uppercase">PULSE</span>
          </div>
        </button>
      </div>

      {/* 4. SCHEDULE */}
      <button
        onClick={() => setActiveView('schedule')}
        className={`flex-1 flex flex-col items-center justify-center py-1.5 transition-all ${
          activeView === 'schedule' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
        }`}
      >
        <Calendar className="w-5 h-5" />
        <span className="text-[9px] uppercase tracking-wider mt-1">SCHEDULE</span>
      </button>

      {/* 5. SOS */}
      <button
        onClick={() => setAssistanceModeActive(true)}
        className="flex-1 flex flex-col items-center justify-center py-1.5 text-rose-400 hover:text-rose-300 transition-all"
      >
        <ShieldAlert className="w-5 h-5 animate-pulse" />
        <span className="text-[9px] font-bold text-rose-400 uppercase tracking-wider mt-1">SOS</span>
      </button>
    </nav>
  );
};

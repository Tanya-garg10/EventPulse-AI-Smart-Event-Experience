import React, { useState, useEffect } from 'react';
import { useEvent } from '../../context/EventContext';
import {
  ShieldAlert,
  PhoneCall,
  Navigation,
  HeartPulse,
  Shield,
  X,
  AlertTriangle,
  Radio,
  CheckCircle2,
} from 'lucide-react';

export const AssistanceModeView: React.FC = () => {
  const { assistanceModeActive, setAssistanceModeActive, zones, addToast } = useEvent();
  const [dispatchedUnit, setDispatchedUnit] = useState<string | null>(null);
  const [etaSeconds, setEtaSeconds] = useState(45);

  useEffect(() => {
    if (!dispatchedUnit) return;
    const timer = setInterval(() => {
      setEtaSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [dispatchedUnit]);

  if (!assistanceModeActive) return null;

  const handleDispatch = (type: 'first_aid' | 'security' | 'call') => {
    if (type === 'call') {
      window.open('tel:112', '_self');
      addToast('Emergency Call Initialized', 'Dialing emergency dispatch (112)...', 'error');
      return;
    }
    setDispatchedUnit(type === 'first_aid' ? 'Paramedic Unit 01' : 'Security Patrol Delta');
    setEtaSeconds(45);
    addToast(
      'ASSISTANCE DISPATCHED',
      type === 'first_aid'
        ? 'Medical responder dispatched to your coordinate. Hold position.'
        : 'Security officer dispatched to your coordinate.',
      'error'
    );
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#050608] text-white flex flex-col p-4 sm:p-8 overflow-y-auto font-mono">
      {/* High-visibility alarm strobe banner */}
      <div className="w-full max-w-4xl mx-auto space-y-8 flex-1 flex flex-col justify-between">
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b-2 border-rose-600 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-rose-500 tracking-wider">
                🚨 ASSISTANCE MODE
              </h1>
              <p className="text-xs text-rose-300 font-bold uppercase tracking-widest">
                RAPID SAFETY PROTOCOL ACTIVE · LIFE SAFETY FIRST
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setAssistanceModeActive(false);
              setDispatchedUnit(null);
            }}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold uppercase transition-colors"
          >
            <X className="w-4 h-4" />
            <span>EXIT ASSISTANCE</span>
          </button>
        </div>

        {/* Live Dispatch Feedback if Triggered */}
        {dispatchedUnit && (
          <div className="bg-rose-950/80 border-2 border-rose-500 rounded-2xl p-5 shadow-2xl space-y-2 glow-coral animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-2 text-rose-300 font-black text-sm uppercase">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span>DISPATCH CONFIRMED: {dispatchedUnit}</span>
              </span>
              <span className="text-xl font-black text-white font-mono">
                ETA {etaSeconds}s
              </span>
            </div>
            <p className="text-xs text-slate-200">
              Responders have your exact indoor beacon coordinate (Floor 1 · Central Concourse). Remain in position.
            </p>
          </div>
        )}

        {/* Big 3 Emergency Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => handleDispatch('first_aid')}
            className="p-6 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black flex flex-col items-center justify-center space-y-3 shadow-2xl transition-transform active:scale-95 border-2 border-rose-400"
          >
            <HeartPulse className="w-10 h-10 animate-bounce" />
            <span className="text-xl tracking-wider uppercase">FIRST AID</span>
            <span className="text-[11px] font-normal opacity-90">Nearest Station 120m away</span>
          </button>

          <button
            onClick={() => handleDispatch('security')}
            className="p-6 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-black flex flex-col items-center justify-center space-y-3 shadow-2xl transition-transform active:scale-95 border-2 border-amber-400"
          >
            <Shield className="w-10 h-10" />
            <span className="text-xl tracking-wider uppercase">SECURITY</span>
            <span className="text-[11px] font-normal opacity-90">On-site patrol desk 180m</span>
          </button>

          <button
            onClick={() => handleDispatch('call')}
            className="p-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-rose-400 font-black flex flex-col items-center justify-center space-y-3 shadow-2xl transition-transform active:scale-95 border-2 border-rose-600"
          >
            <PhoneCall className="w-10 h-10 animate-pulse" />
            <span className="text-xl tracking-wider uppercase">CALL 112</span>
            <span className="text-[11px] font-normal text-slate-400">Direct Emergency Services</span>
          </button>
        </div>

        {/* Nearest Emergency Stations Telemetry */}
        <div className="bg-[#0c0f16] border-2 border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              NEAREST PHYSICAL HELP POINTS
            </span>
            <span className="text-[10px] text-lime-400 font-bold">ALL STATIONS MANNED</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-rose-900/60 space-y-1">
              <span className="text-[10px] text-rose-400 font-bold block">01 · MEDICAL</span>
              <h4 className="text-base font-bold text-white">First Aid Clinic</h4>
              <p className="text-2xl font-black text-rose-400">120m</p>
              <p className="text-[11px] text-slate-400">Level 1 · Next to Main Atrium</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-amber-900/60 space-y-1">
              <span className="text-[10px] text-amber-400 font-bold block">02 · SECURITY</span>
              <h4 className="text-base font-bold text-white">Security Command</h4>
              <p className="text-2xl font-black text-amber-400">180m</p>
              <p className="text-[11px] text-slate-400">Level 1 · Gate 2 Concourse</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-blue-900/60 space-y-1">
              <span className="text-[10px] text-cyan-400 font-bold block">03 · INFO DESK</span>
              <h4 className="text-base font-bold text-white">Central Help Desk</h4>
              <p className="text-2xl font-black text-cyan-400">250m</p>
              <p className="text-[11px] text-slate-400">Central Entrance Lobby</p>
            </div>
          </div>

          {/* High-visibility Safe Evacuation Path Visualizer */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Navigation className="w-6 h-6 text-lime-400 animate-pulse" />
              <div>
                <span className="text-xs font-bold text-white block uppercase">
                  SAFEST IMMEDIATE EXIT PATH: EMERGENCY STAIRWELL WEST
                </span>
                <span className="text-[11px] text-slate-400">
                  Direct outdoor egress · Clear corridor · 45 meters straight ahead
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                setAssistanceModeActive(false);
                addToast('Showing Safest Exit Route on Living Map', undefined, 'warning');
              }}
              className="px-4 py-2 rounded-lg bg-lime-600 hover:bg-lime-500 text-black font-black text-xs uppercase"
            >
              ILLUMINATE ON MAP
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[10px] text-slate-500 uppercase tracking-widest pt-4">
          EventPulse OS Life-Safety System · Incident Response Channel Monitored 24/7
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useEvent } from '../../context/EventContext';
import { Dna, Sparkles, ArrowRight, CheckCircle2, Flame } from 'lucide-react';

export const EventDNAView: React.FC = () => {
  const { eventDNAInterests, toggleEventDNAInterest, setActiveView } = useEvent();

  const availableTags = [
    { label: 'AI', affinity: 94, color: 'border-cyan-400 text-cyan-300' },
    { label: 'STARTUPS', affinity: 86, color: 'border-amber-400 text-amber-300' },
    { label: 'MUSIC', affinity: 65, color: 'border-purple-400 text-purple-300' },
    { label: 'NETWORKING', affinity: 90, color: 'border-lime-400 text-lime-300' },
    { label: 'WORKSHOPS', affinity: 82, color: 'border-blue-400 text-blue-300' },
    { label: 'DESIGN', affinity: 75, color: 'border-rose-400 text-rose-300' },
    { label: 'FOOD', affinity: 70, color: 'border-amber-300 text-amber-200' },
    { label: 'COMPETITIONS', affinity: 78, color: 'border-emerald-400 text-emerald-300' },
    { label: 'CYBERSECURITY', affinity: 80, color: 'border-cyan-300 text-cyan-200' },
    { label: 'CLOUD', affinity: 72, color: 'border-indigo-400 text-indigo-300' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono tracking-widest uppercase">
          <Dna className="w-3.5 h-3.5" />
          <span>ATTENDEE EVENT DNA CALIBRATION</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
          What are you here for?
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Tap words to synthesize your personal Event DNA. Living paths and recommendations re-orbit around your choices.
        </p>
      </div>

      {/* Floating Word Matrix & Orbiting Center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Floating Interactive Words */}
        <div className="lg:col-span-7 flex flex-wrap gap-3 justify-center lg:justify-start">
          {availableTags.map((tag) => {
            const isSelected = eventDNAInterests.includes(tag.label);
            return (
              <button
                key={tag.label}
                onClick={() => toggleEventDNAInterest(tag.label)}
                className={`px-5 py-3 rounded-2xl font-black text-sm tracking-wider uppercase transition-all duration-200 cursor-pointer border ${
                  isSelected
                    ? `${tag.color} bg-slate-900 shadow-xl glow-cyan scale-105`
                    : 'bg-[#0b0e14] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>{tag.label}</span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: The Orbiting DNA Profile Sphere */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-[#080b11] border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-tech-dots opacity-40 pointer-events-none" />

          {/* Orbiting Avatar */}
          <div className="relative w-48 h-48 flex items-center justify-center my-4">
            {/* Outer spinning ring */}
            <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-orbit" />
            <div className="absolute inset-4 rounded-full border border-dashed border-cyan-500/30 animate-orbit-reverse" />

            {/* Orbiting chips */}
            {eventDNAInterests.slice(0, 4).map((interest, idx) => {
              const angles = [0, 90, 180, 270];
              const angle = angles[idx] || 0;
              return (
                <div
                  key={interest}
                  className="absolute px-2 py-0.5 rounded-full bg-slate-900 border border-cyan-400 text-[9px] font-mono text-cyan-300 shadow-md glow-cyan-sm"
                  style={{
                    transform: `rotate(${angle}deg) translate(80px) rotate(-${angle}deg)`,
                  }}
                >
                  {interest}
                </div>
              );
            })}

            {/* Center DNA Core */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-950 via-slate-900 to-black border-2 border-cyan-400 flex flex-col items-center justify-center text-center p-2 glow-cyan">
              <Dna className="w-6 h-6 text-cyan-400 animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-white uppercase mt-1">
                YOU
              </span>
              <span className="text-[8px] font-mono text-cyan-300">
                {eventDNAInterests.length} ACTIVE
              </span>
            </div>
          </div>

          <span className="text-xs font-mono font-bold text-slate-300 tracking-wider uppercase mt-2">
            YOUR EVENT DNA
          </span>

          {/* DNA Energy Bars */}
          <div className="w-full space-y-2 mt-4 text-xs font-mono">
            {eventDNAInterests.length === 0 ? (
              <p className="text-center text-slate-500 text-[11px] py-2">
                Tap words above to activate your DNA spectrum.
              </p>
            ) : (
              eventDNAInterests.map((interest) => {
                const tagInfo = availableTags.find((t) => t.label === interest);
                const score = tagInfo ? tagInfo.affinity : 80;
                return (
                  <div key={interest} className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-300">
                      <span>{interest}</span>
                      <span className="text-cyan-400 font-bold">{score}% AFFINITY</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-lime-400 rounded-full transition-all duration-500"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <button
            onClick={() => setActiveView('recommendations')}
            className="w-full mt-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-xl glow-cyan active:scale-95"
          >
            <span>Activate Living Recommendations</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

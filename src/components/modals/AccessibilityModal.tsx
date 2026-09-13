import React from 'react';
import { X, Accessibility, Check, Eye, Type, ShieldCheck, ArrowRight } from 'lucide-react';
import { useEvent } from '../../context/EventContext';

export const AccessibilityModal: React.FC = () => {
  const {
    isAccessibilityOpen,
    setIsAccessibilityOpen,
    accessibilitySettings,
    updateAccessibility,
    setActiveView,
  } = useEvent();

  if (!isAccessibilityOpen) return null;

  const toggleOption = (key: keyof typeof accessibilitySettings) => {
    updateAccessibility({ [key]: !accessibilitySettings[key] });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-xl">
              ♿
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Accessibility Preferences</h2>
              <p className="text-xs text-slate-400">
                Customizes navigation routes and app contrast
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAccessibilityOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {/* Wheelchair route */}
          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/60 hover:bg-slate-800 cursor-pointer transition-all">
            <div className="flex items-center space-x-3">
              <span className="text-xl">🦽</span>
              <div>
                <p className="text-xs font-semibold text-white">Wheelchair-Friendly Routes</p>
                <p className="text-[11px] text-slate-400">
                  Enforces step-free paths and ramps only
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={accessibilitySettings.wheelchair}
              onChange={() => toggleOption('wheelchair')}
              className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
            />
          </label>

          {/* Avoid stairs */}
          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/60 hover:bg-slate-800 cursor-pointer transition-all">
            <div className="flex items-center space-x-3">
              <span className="text-xl">🚫🪜</span>
              <div>
                <p className="text-xs font-semibold text-white">Avoid Stairs</p>
                <p className="text-[11px] text-slate-400">
                  Filters out staircases across halls and balconies
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={accessibilitySettings.avoidStairs}
              onChange={() => toggleOption('avoidStairs')}
              className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
            />
          </label>

          {/* Prefer elevators */}
          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/60 hover:bg-slate-800 cursor-pointer transition-all">
            <div className="flex items-center space-x-3">
              <span className="text-xl">🛗</span>
              <div>
                <p className="text-xs font-semibold text-white">Prefer Elevators</p>
                <p className="text-[11px] text-slate-400">
                  Uses central and east wing elevator banks for vertical transit
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={accessibilitySettings.preferElevators}
              onChange={() => toggleOption('preferElevators')}
              className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
            />
          </label>

          {/* Avoid crowded areas */}
          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/60 hover:bg-slate-800 cursor-pointer transition-all">
            <div className="flex items-center space-x-3">
              <span className="text-xl">👥</span>
              <div>
                <p className="text-xs font-semibold text-white">Avoid Crowded Areas</p>
                <p className="text-[11px] text-slate-400">
                  Re-routes away from high-density bottlenecks & queues
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={accessibilitySettings.avoidCrowds}
              onChange={() => toggleOption('avoidCrowds')}
              className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
            />
          </label>

          {/* Accessible restroom preference */}
          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/60 hover:bg-slate-800 cursor-pointer transition-all">
            <div className="flex items-center space-x-3">
              <span className="text-xl">🚻</span>
              <div>
                <p className="text-xs font-semibold text-white">Accessible Restroom Preference</p>
                <p className="text-[11px] text-slate-400">
                  Prioritizes restrooms with wide entries & automatic doors
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={accessibilitySettings.accessibleRestroom}
              onChange={() => toggleOption('accessibleRestroom')}
              className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
            />
          </label>

          {/* Visual preferences: High contrast & Large text */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => toggleOption('highContrast')}
              className={`p-3 rounded-2xl border text-xs font-medium flex items-center justify-center space-x-2 transition-all ${
                accessibilitySettings.highContrast
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                  : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>High Contrast</span>
              {accessibilitySettings.highContrast && <Check className="w-3.5 h-3.5 ml-1 text-amber-400" />}
            </button>

            <button
              onClick={() => toggleOption('largeText')}
              className={`p-3 rounded-2xl border text-xs font-medium flex items-center justify-center space-x-2 transition-all ${
                accessibilitySettings.largeText
                  ? 'bg-blue-500/20 border-blue-400 text-blue-300'
                  : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Type className="w-4 h-4" />
              <span>Larger Text</span>
              {accessibilitySettings.largeText && <Check className="w-3.5 h-3.5 ml-1 text-blue-400" />}
            </button>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-800">
          <span className="text-[11px] text-slate-400">
            {accessibilitySettings.wheelchair || accessibilitySettings.avoidStairs
              ? 'Active: Step-free mode enabled'
              : 'Standard route parameters'}
          </span>
          <button
            onClick={() => {
              setIsAccessibilityOpen(false);
              setActiveView('map');
            }}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-md transition-all"
          >
            <span>View Accessible Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

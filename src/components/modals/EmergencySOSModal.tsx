import React, { useState } from 'react';
import {
  ShieldAlert,
  PhoneCall,
  Navigation,
  HelpCircle,
  X,
  AlertTriangle,
  Radio,
  CheckCircle2,
  Clock,
  MapPin,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { EmergencyService, SOSDispatchStatus } from '../../services/emergency/emergencyService';

export const EmergencySOSModal: React.FC = () => {
  const { isSOSOpen, setIsSOSOpen, navigateDirectlyToZone, addToast } = useEvent();

  const [confirmed, setConfirmed] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState<SOSDispatchStatus | null>(null);
  const [isSimulatingCall, setIsSimulatingCall] = useState(false);

  if (!isSOSOpen) return null;

  const contacts = EmergencyService.getEmergencyContacts();
  const nearestMed = EmergencyService.getNearestPoint('medical');
  const nearestSec = EmergencyService.getNearestPoint('security');
  const nearestHelp = EmergencyService.getNearestPoint('help');

  const handleConfirmSOS = async (incidentType: 'medical' | 'security' | 'general' = 'medical') => {
    setConfirmed(true);
    const status = EmergencyService.createSOSAlert('Central Concourse / Registration', incidentType);
    setDispatchStatus(status);

    // Call server endpoint
    try {
      await fetch('/api/events/emergency/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incidentType,
          attendeeLocation: 'Central Concourse / Registration (Zone REG-01)',
        }),
      });
    } catch {
      // ignore
    }

    addToast(
      '🚨 EMERGENCY SOS DISPATCHED',
      'Event security and medical personnel have received your coordinates.',
      'error'
    );
  };

  const handleSimulateCall = () => {
    setIsSimulatingCall(true);
    setTimeout(() => {
      setIsSimulatingCall(false);
      addToast(
        'Simulated Emergency Call Connected',
        'In a production environment, this triggers direct dial to 112 / Central Dispatch.',
        'info'
      );
    }, 1800);
  };

  const handleNavigateToFirstAid = () => {
    setIsSOSOpen(false);
    navigateDirectlyToZone('zone-first-aid');
  };

  const handleNavigateToSecurity = () => {
    setIsSOSOpen(false);
    navigateDirectlyToZone('zone-security-desk');
  };

  const handleReset = () => {
    setConfirmed(false);
    setDispatchStatus(null);
    setIsSOSOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-rose-600 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl relative overflow-hidden">
        {/* Glowing emergency accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-600/30 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-rose-900/60 mb-5">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/50 animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-rose-100">Emergency Assistance</h2>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 font-bold px-2 py-0.5 rounded border border-rose-500/40">
                  SOS MODE
                </span>
              </div>
              <p className="text-xs text-rose-300">
                EventPulse OS Safety & Rapid Response Protocol
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!confirmed ? (
          <div className="space-y-5">
            {/* Accidental prevention notice */}
            <div className="bg-rose-950/50 border border-rose-800/80 rounded-2xl p-4 flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-rose-200">
                  Confirmation Required
                </p>
                <p className="text-[11px] text-rose-300 mt-1 leading-relaxed">
                  To prevent false alarms, please select the nature of your emergency. Responders will immediately be alerted to your location.
                </p>
              </div>
            </div>

            {/* Quick emergency dispatch trigger options */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleConfirmSOS('medical')}
                className="p-4 rounded-2xl bg-gradient-to-br from-rose-700 to-red-800 hover:from-rose-600 hover:to-red-700 text-white font-bold text-sm shadow-lg shadow-rose-900/50 border border-rose-400/40 flex flex-col items-center justify-center text-center space-y-2 group transition-all transform active:scale-95"
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">
                  🩺
                </div>
                <span>Medical Emergency</span>
                <span className="text-[10px] text-rose-200 font-normal">First Aid / Paramedic</span>
              </button>

              <button
                onClick={() => handleConfirmSOS('security')}
                className="p-4 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white font-bold text-sm shadow-lg border border-slate-700 flex flex-col items-center justify-center text-center space-y-2 group transition-all transform active:scale-95"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">
                  🛡️
                </div>
                <span>Security / Safety</span>
                <span className="text-[10px] text-slate-300 font-normal">Crowd Crush / Hazard</span>
              </button>
            </div>

            {/* Nearby Emergency Points Card */}
            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Nearest Physical Aid Posts</span>
                <span className="font-mono text-emerald-400">All Posts Active</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/70 border border-slate-700/50 text-xs">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-base">🏥</span>
                    <div>
                      <p className="font-semibold text-white">{nearestMed.name}</p>
                      <p className="text-[10px] text-slate-400">{nearestMed.contactPerson}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                      {nearestMed.distanceMeters}m away
                    </span>
                    <button
                      onClick={handleNavigateToFirstAid}
                      className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-medium transition-colors"
                      title="Navigate"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/70 border border-slate-700/50 text-xs">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-base">👮</span>
                    <div>
                      <p className="font-semibold text-white">{nearestSec.name}</p>
                      <p className="text-[10px] text-slate-400">{nearestSec.contactPerson}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                      {nearestSec.distanceMeters}m away
                    </span>
                    <button
                      onClick={handleNavigateToSecurity}
                      className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-medium transition-colors"
                      title="Navigate"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/70 border border-slate-700/50 text-xs">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-base">ℹ️</span>
                    <div>
                      <p className="font-semibold text-white">{nearestHelp.name}</p>
                      <p className="text-[10px] text-slate-400">{nearestHelp.contactPerson}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-mono text-[10px]">
                    {nearestHelp.distanceMeters}m away
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Dial Options */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleSimulateCall}
                disabled={isSimulatingCall}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-rose-600/30 hover:bg-rose-600/40 border border-rose-500/50 text-rose-200 text-xs font-semibold transition-all"
              >
                <PhoneCall className="w-4 h-4 text-rose-400" />
                <span>{isSimulatingCall ? 'Connecting to 112...' : 'Call Emergency Services (112)'}</span>
              </button>

              <span className="text-[10px] text-slate-400 italic">
                *Simulated action in demo mode
              </span>
            </div>
          </div>
        ) : (
          /* Active SOS Dispatch Screen */
          <div className="space-y-5">
            <div className="bg-emerald-950/40 border border-emerald-500/60 rounded-2xl p-4 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-4 ring-emerald-500/20 animate-pulse">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-emerald-300">
                SOS Signal Live & Broadcasting
              </h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                {dispatchStatus?.statusText}
              </p>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                <span className="text-slate-400">Incident Type:</span>
                <span className="font-semibold text-rose-300 uppercase">
                  {dispatchStatus?.incidentType} Alert
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                <span className="text-slate-400">Assigned Unit:</span>
                <span className="font-semibold text-white">
                  {dispatchStatus?.assignedResponder}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                <span className="text-slate-400">Estimated Arrival:</span>
                <span className="font-mono text-amber-400 font-bold">
                  ~{dispatchStatus?.estimatedArrivalMins} minutes
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Attendee Location:</span>
                <span className="font-semibold text-blue-300">
                  {dispatchStatus?.attendeeLocation}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleNavigateToFirstAid}
                className="flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg transition-all"
              >
                <Navigation className="w-4 h-4" />
                <span>Navigate Toward Aid Station</span>
              </button>

              <button
                onClick={handleReset}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold transition-all"
              >
                End SOS
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

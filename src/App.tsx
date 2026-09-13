/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EventProvider, useEvent } from './context/EventContext';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { DemoSandboxBar } from './components/layout/DemoSandboxBar';
import { ToastContainer } from './components/layout/ToastContainer';
import { LandingView } from './components/views/LandingView';
import { EventHomeView } from './components/views/EventHomeView';
import { InteractiveMapView } from './components/views/InteractiveMapView';
import { AIConciergeView } from './components/views/AIConciergeView';
import { EventDNAView } from './components/views/EventDNAView';
import { RecommendationsView } from './components/views/RecommendationsView';
import { ScheduleView } from './components/views/ScheduleView';
import { CrowdIntelligenceView } from './components/views/CrowdIntelligenceView';
import { OrganizerDashboardView } from './components/views/OrganizerDashboardView';
import { AssistanceModeView } from './components/modals/AssistanceModeView';
import { EmergencySOSModal } from './components/modals/EmergencySOSModal';
import { AccessibilityModal } from './components/modals/AccessibilityModal';
import { Radio, Zap } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeView, currentRole, assistanceModeActive } = useEvent();

  // If Assistance Mode is engaged, take over the entire screen with the emergency console
  if (assistanceModeActive) {
    return <AssistanceModeView />;
  }

  return (
    <main className="flex-1 pb-20 lg:pb-12 pt-4">
      {/* View routing */}
      {currentRole === 'organizer' ? (
        <OrganizerDashboardView />
      ) : (
        <>
          {activeView === 'landing' && <LandingView />}
          {activeView === 'home' && <EventHomeView />}
          {activeView === 'map' && <InteractiveMapView />}
          {activeView === 'concierge' && <AIConciergeView />}
          {activeView === 'dna' && <EventDNAView />}
          {activeView === 'recommendations' && <RecommendationsView />}
          {activeView === 'schedule' && <ScheduleView />}
          {activeView === 'crowd' && <CrowdIntelligenceView />}
          {activeView === 'organizer' && <OrganizerDashboardView />}
        </>
      )}

      {/* Persistent global modals */}
      <EmergencySOSModal />
      <AccessibilityModal />
    </main>
  );
};

export default function App() {
  return (
    <EventProvider>
      <div className="min-h-screen flex flex-col bg-[#06080d] text-slate-100 selection:bg-cyan-500 selection:text-black font-sans antialiased">
        <Header />
        <DemoSandboxBar />
        <ToastContainer />
        <MainContent />
        <MobileNav />

        {/* Futuristic Minimal Footer */}
        <footer className="border-t border-cyan-500/10 bg-[#040609] py-6 text-xs text-slate-500 hidden lg:block font-mono">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-black text-white tracking-wider">EVENTPULSE OS</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">Your event, alive. Powered by Google Gemini &amp; Deterministic Dijkstra.</span>
            </div>
            <div className="flex items-center space-x-4 text-[11px] text-cyan-400">
              <span>● LIVE TELEMETRY</span>
              <span className="text-slate-600">·</span>
              <span className="text-lime-400">99.98% NODE ACCESSIBILITY</span>
            </div>
          </div>
        </footer>
      </div>
    </EventProvider>
  );
}

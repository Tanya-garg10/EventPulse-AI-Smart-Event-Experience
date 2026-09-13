import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Session,
  VenueZone,
  Announcement,
  AccessibilitySettings,
  EventMetrics,
  AnnouncementPriority,
} from '../types';
import {
  INITIAL_SESSIONS,
  INITIAL_ZONES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_METRICS,
} from '../data/eventData';
import { CrowdService } from '../services/crowd/crowdService';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
}

export type AppView =
  | 'landing'
  | 'home'
  | 'map'
  | 'concierge'
  | 'recommendations'
  | 'schedule'
  | 'crowd'
  | 'dna'
  | 'organizer';

export type OrganizerTab =
  | 'dashboard'
  | 'map'
  | 'sessions'
  | 'crowd'
  | 'announcements'
  | 'analytics';

interface EventContextType {
  sessions: Session[];
  zones: VenueZone[];
  announcements: Announcement[];
  metrics: EventMetrics;
  savedSessionIds: string[];
  activeView: AppView;
  currentRole: 'attendee' | 'organizer';
  organizerTab: OrganizerTab;
  selectedDestinationZoneId: string | null;
  selectedOriginZoneId: string;
  isSOSOpen: boolean;
  isAccessibilityOpen: boolean;
  isDemoDrawerOpen: boolean;
  accessibilitySettings: AccessibilitySettings;
  toasts: ToastMessage[];
  searchQuery: string;

  // New Live Operating System & Event DNA state
  isLiveSimulationRunning: boolean;
  assistanceModeActive: boolean;
  eventDNAInterests: string[];
  simulatedSecondsRemaining: number;

  // Actions
  setActiveView: (view: AppView) => void;
  setCurrentRole: (role: 'attendee' | 'organizer') => void;
  setOrganizerTab: (tab: OrganizerTab) => void;
  setSearchQuery: (query: string) => void;
  setIsSOSOpen: (open: boolean) => void;
  setIsAccessibilityOpen: (open: boolean) => void;
  setIsDemoDrawerOpen: (open: boolean) => void;
  setSelectedDestinationZoneId: (zoneId: string | null) => void;
  setSelectedOriginZoneId: (zoneId: string) => void;
  setIsLiveSimulationRunning: (val: boolean | ((prev: boolean) => boolean)) => void;
  toggleLiveSimulation: () => void;
  setAssistanceModeActive: (active: boolean) => void;
  toggleEventDNAInterest: (interest: string) => void;
  setEventDNAInterests: React.Dispatch<React.SetStateAction<string[]>>;

  toggleSaveSession: (sessionId: string) => void;
  navigateDirectlyToZone: (zoneId: string) => void;
  updateSessionLocation: (sessionId: string, newHallId: string, newHallName: string) => Promise<void>;
  addSession: (session: Omit<Session, 'id'>) => void;
  deleteSession: (sessionId: string) => void;
  publishAnnouncement: (ann: {
    title: string;
    message: string;
    priority: AnnouncementPriority;
    targetAudience: 'All Attendees' | 'VIP & Speakers' | 'Workshop Registrants' | 'Exhibitors';
  }) => Promise<void>;
  updateZoneCount: (zoneId: string, newCount: number) => void;
  updateAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  markAnnouncementAsRead: (id: string) => void;
  addToast: (title: string, description?: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;
  simulateDemoScenario: (
    scenario:
      | 'crowd_surge'
      | 'session_moved'
      | 'emergency_announcement'
      | 'sos_trigger'
      | 'ai_itinerary'
      | 'wheelchair_mode'
      | 'reset'
  ) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);
  const [zones, setZones] = useState<VenueZone[]>(INITIAL_ZONES);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [metrics, setMetrics] = useState<EventMetrics>(INITIAL_METRICS);
  const [savedSessionIds, setSavedSessionIds] = useState<string[]>(['session-01', 'session-02']);
  const [activeView, setActiveView] = useState<AppView>('landing');
  const [currentRole, setCurrentRole] = useState<'attendee' | 'organizer'>('attendee');
  const [organizerTab, setOrganizerTab] = useState<OrganizerTab>('dashboard');
  const [selectedDestinationZoneId, setSelectedDestinationZoneId] = useState<string | null>(null);
  const [selectedOriginZoneId, setSelectedOriginZoneId] = useState<string>('zone-registration');
  const [isSOSOpen, setIsSOSOpen] = useState<boolean>(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState<boolean>(false);
  const [isDemoDrawerOpen, setIsDemoDrawerOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Living simulation & Event DNA
  const [isLiveSimulationRunning, setIsLiveSimulationRunning] = useState<boolean>(true);
  const [assistanceModeActive, setAssistanceModeActive] = useState<boolean>(false);
  const [eventDNAInterests, setEventDNAInterests] = useState<string[]>([
    'AI',
    'STARTUPS',
    'WORKSHOPS',
  ]);
  const [simulatedSecondsRemaining, setSimulatedSecondsRemaining] = useState<number>(522); // 08:42 countdown

  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>({
    avoidStairs: false,
    wheelchair: false,
    preferElevators: false,
    avoidCrowds: false,
    accessibleRestroom: false,
    highContrast: false,
    largeText: false,
  });

  // Apply high contrast & large text classes to root document
  useEffect(() => {
    if (accessibilitySettings.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    if (accessibilitySettings.largeText) {
      document.documentElement.classList.add('text-lg');
    } else {
      document.documentElement.classList.remove('text-lg');
    }
  }, [accessibilitySettings.highContrast, accessibilitySettings.largeText]);

  // Recalculate metrics when zones or sessions change
  useEffect(() => {
    const crowdedCount = zones.filter((z) => z.crowdLevel === 'high' || z.crowdLevel === 'critical').length;
    const totalCapacity = zones.reduce((acc, z) => acc + z.capacity, 0);
    const totalCount = zones.reduce((acc, z) => acc + z.currentCount, 0);
    const avgOccupancy = Math.round((totalCount / totalCapacity) * 100);

    setMetrics((prev) => ({
      ...prev,
      totalAttendees: totalCount,
      crowdedZonesCount: crowdedCount,
      announcementsCount: announcements.length,
      averageOccupancyRate: avgOccupancy,
    }));
  }, [zones, announcements]);

  // Real-time Event Pulse simulation ticker
  useEffect(() => {
    if (!isLiveSimulationRunning) return;

    let tickCount = 0;

    const interval = setInterval(() => {
      tickCount += 1;

      // 1. Tick down keynote seconds
      setSimulatedSecondsRemaining((prev) => (prev > 5 ? prev - 1 : 540));

      // 2. Crowd levels fluctuate organically across all venue zones
      setZones((prevZones) =>
        prevZones.map((z) => {
          // Dynamic swing: sometimes surges, sometimes eases up
          let delta = 0;
          if (tickCount % 5 === 0 && (z.id === 'zone-main-stage' || z.id === 'zone-food-lawn')) {
            delta = Math.floor(Math.random() * 8) - 3;
          } else {
            delta = (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 4);
          }
          const newCount = Math.max(12, Math.min(Math.round(z.capacity * 1.05), z.currentCount + delta));
          return CrowdService.updateZoneCount(z, newCount);
        })
      );

      // 3. Dynamic session shifts and virtual session triggers to showcase system responsiveness
      if (tickCount % 4 === 0) {
        setSessions((prevSessions) => {
          const updated = [...prevSessions];
          const phase = Math.floor(tickCount / 4) % 4;

          if (phase === 1) {
            // Shift session-02 (AI Agents) location due to crowd surge
            const targetIndex = updated.findIndex((s) => s.id === 'session-02');
            if (targetIndex !== -1 && updated[targetIndex].hallId !== 'zone-main-stage') {
              const old = updated[targetIndex];
              updated[targetIndex] = {
                ...old,
                hallId: 'zone-main-stage',
                hallName: 'Grand Main Stage (Relocated)',
                originalHallName: old.originalHallName || old.hallName,
                isLocationChanged: true,
                status: 'shifted',
                liveNotes: 'Relocated to Grand Main Stage due to high registration overflow.',
              };
              addToast(
                'Live System Dynamic Shift',
                `"${old.title}" relocated to Grand Main Stage. Attendee routes re-routed!`,
                'warning'
              );
            }
          } else if (phase === 2) {
            // Virtual session start & live broadcast signal
            const targetIndex = updated.findIndex((s) => s.id === 'session-01');
            if (targetIndex !== -1) {
              const old = updated[targetIndex];
              updated[targetIndex] = {
                ...old,
                status: 'live',
                liveNotes: 'LIVE BROADCAST IN PROGRESS · Audio feed active',
                registeredCount: Math.min(old.capacity, old.registeredCount + 5),
              };
              addToast(
                'Virtual Session Activated',
                `"${old.title}" is now LIVE with active room telemetry!`,
                'success'
              );
            }
          } else if (phase === 3) {
            // Flash workshop session shift / schedule delay adjustment
            const targetIndex = updated.findIndex((s) => s.id === 'session-04');
            if (targetIndex !== -1) {
              const old = updated[targetIndex];
              const newDelay = (old.delayMinutes || 0) === 0 ? 10 : 0;
              updated[targetIndex] = {
                ...old,
                delayMinutes: newDelay,
                status: newDelay > 0 ? 'shifted' : 'upcoming',
                liveNotes: newDelay > 0 ? 'Extended Q&A buffer added (+10 mins)' : undefined,
              };
              addToast(
                'Schedule Pulse Updated',
                `"${old.title}" schedule dynamically buffered by +10m.`,
                'info'
              );
            }
          } else {
            // Rotate session-05 room back or start next block
            const targetIndex = updated.findIndex((s) => s.id === 'session-05');
            if (targetIndex !== -1) {
              const old = updated[targetIndex];
              updated[targetIndex] = {
                ...old,
                status: old.status === 'live' ? 'upcoming' : 'live',
                liveNotes: 'Interactive audience polling enabled in upper tier.',
              };
            }
          }

          return updated;
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isLiveSimulationRunning]);

  const toggleLiveSimulation = () => {
    setIsLiveSimulationRunning((prev) => {
      const next = !prev;
      addToast(
        next ? 'Live Simulation: ACTIVE' : 'Live Simulation: PAUSED',
        next ? 'Crowds fluctuating and dynamic session shifts streaming in real time.' : 'Real-time telemetry frozen.',
        next ? 'success' : 'info'
      );
      return next;
    });
  };

  const toggleEventDNAInterest = (interest: string) => {
    setEventDNAInterests((prev) => {
      const upper = interest.toUpperCase();
      const exists = prev.includes(upper);
      if (exists) {
        return prev.filter((i) => i !== upper);
      } else {
        return [...prev, upper];
      }
    });
  };

  const addToast = (
    title: string,
    description?: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info'
  ) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      title,
      description,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    setToasts((prev) => [newToast, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 5000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleSaveSession = (sessionId: string) => {
    setSavedSessionIds((prev) => {
      const exists = prev.includes(sessionId);
      const session = sessions.find((s) => s.id === sessionId);
      if (exists) {
        addToast('Removed from My Schedule', session?.title, 'info');
        return prev.filter((id) => id !== sessionId);
      } else {
        addToast('Saved to My Schedule', session?.title, 'success');
        return [...prev, sessionId];
      }
    });
  };

  const navigateDirectlyToZone = (zoneId: string) => {
    setSelectedDestinationZoneId(zoneId);
    if (currentRole === 'organizer') {
      setOrganizerTab('map');
    } else {
      setActiveView('map');
    }
    const zone = zones.find((z) => z.id === zoneId);
    addToast('Living Route Calibrated', `Directing to ${zone?.name || 'Venue Zone'}`, 'info');
  };

  const updateSessionLocation = async (sessionId: string, newHallId: string, newHallName: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return;
    const oldHall = session.hallName;

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          return {
            ...s,
            hallId: newHallId,
            hallName: newHallName,
            isLocationChanged: true,
            originalHallName: s.originalHallName || oldHall,
          };
        }
        return s;
      })
    );

    // Create automatic broadcast announcement
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title: `Location Change: ${session.title}`,
      message: `Attention: "${session.title}" has been moved from ${oldHall} to ${newHallName}. Routes have been automatically re-calculated.`,
      priority: 'important',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      targetAudience: 'All Attendees',
      read: false,
      relatedSessionId: sessionId,
      relatedZoneId: newHallId,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);

    addToast(
      'Session Relocated',
      `"${session.title}" moved to ${newHallName}. Live signals pushed across all attendee screens.`,
      'warning'
    );
  };

  const addSession = (newSessionData: Omit<Session, 'id'>) => {
    const newId = `session-${Date.now()}`;
    const newSession: Session = {
      ...newSessionData,
      id: newId,
      popularityScore: 80,
    };
    setSessions((prev) => [...prev, newSession]);
    addToast('Session Published', newSession.title, 'success');
  };

  const deleteSession = (sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    setSavedSessionIds((prev) => prev.filter((id) => id !== sessionId));
    addToast('Session Deleted', session?.title, 'info');
  };

  const publishAnnouncement = async (annData: {
    title: string;
    message: string;
    priority: AnnouncementPriority;
    targetAudience: 'All Attendees' | 'VIP & Speakers' | 'Workshop Registrants' | 'Exhibitors';
  }) => {
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      ...annData,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };

    setAnnouncements((prev) => [newAnn, ...prev]);
    addToast(
      `${annData.priority === 'emergency' ? '🚨 LIVE SIGNAL ALARM' : '● LIVE SIGNAL'} Dispatched`,
      annData.title,
      annData.priority === 'emergency' ? 'error' : annData.priority === 'important' ? 'warning' : 'info'
    );
  };

  const updateZoneCount = (zoneId: string, newCount: number) => {
    setZones((prev) =>
      prev.map((zone) => {
        if (zone.id === zoneId) {
          return CrowdService.updateZoneCount(zone, newCount);
        }
        return zone;
      })
    );
  };

  const updateAccessibility = (settings: Partial<AccessibilitySettings>) => {
    setAccessibilitySettings((prev) => ({ ...prev, ...settings }));
    addToast('Route Constraints Updated', 'Map routes recalculated.', 'info');
  };

  const markAnnouncementAsRead = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a))
    );
  };

  // Demo simulator scenarios for judges
  const simulateDemoScenario = (scenario: string) => {
    switch (scenario) {
      case 'crowd_surge': {
        updateZoneCount('zone-hall-b', 380);
        addToast(
          'EVENT PRESSURE SURGE',
          'Workshop Hall B density surged to 95% (Critical). Living routes now dynamically detour around Hall B.',
          'error'
        );
        break;
      }
      case 'session_moved': {
        updateSessionLocation('session-02', 'zone-hall-c', 'Workshop Hall C');
        break;
      }
      case 'emergency_announcement': {
        publishAnnouncement({
          title: 'WEATHER ADVISORY: North Terrace Wind Alert',
          message: 'High gusts on North Terrace. Please use West Concourse connecting skywalk.',
          priority: 'important',
          targetAudience: 'All Attendees',
        });
        break;
      }
      case 'sos_trigger': {
        setAssistanceModeActive(true);
        break;
      }
      case 'ai_itinerary': {
        setActiveView('concierge');
        addToast('PULSE AI Ready', 'Try asking: "Plan my next 2 hours"', 'info');
        break;
      }
      case 'wheelchair_mode': {
        const next = !accessibilitySettings.wheelchair;
        updateAccessibility({
          wheelchair: next,
          avoidStairs: next,
          preferElevators: next,
        });
        addToast(
          next ? 'ACCESSIBLE ROUTING: ENABLED' : 'ACCESSIBLE ROUTING: DISABLED',
          'Step-free elevator passages guaranteed across living map.',
          'info'
        );
        break;
      }
      case 'reset': {
        setSessions(INITIAL_SESSIONS);
        setZones(INITIAL_ZONES);
        setAnnouncements(INITIAL_ANNOUNCEMENTS);
        setSavedSessionIds(['session-01', 'session-02']);
        setAssistanceModeActive(false);
        setAccessibilitySettings({
          avoidStairs: false,
          wheelchair: false,
          preferElevators: false,
          avoidCrowds: false,
          accessibleRestroom: false,
          highContrast: false,
          largeText: false,
        });
        addToast('EVENT TELEMETRY RESET', 'All nodes restored to default EventPulse OS baseline.', 'info');
        break;
      }
      default:
        break;
    }
  };

  return (
    <EventContext.Provider
      value={{
        sessions,
        zones,
        announcements,
        metrics,
        savedSessionIds,
        activeView,
        currentRole,
        organizerTab,
        selectedDestinationZoneId,
        selectedOriginZoneId,
        isSOSOpen,
        isAccessibilityOpen,
        isDemoDrawerOpen,
        accessibilitySettings,
        toasts,
        searchQuery,

        isLiveSimulationRunning,
        assistanceModeActive,
        eventDNAInterests,
        simulatedSecondsRemaining,

        setActiveView,
        setCurrentRole,
        setOrganizerTab,
        setSearchQuery,
        setIsSOSOpen,
        setIsAccessibilityOpen,
        setIsDemoDrawerOpen,
        setSelectedDestinationZoneId,
        setSelectedOriginZoneId,
        setIsLiveSimulationRunning,
        toggleLiveSimulation,
        setAssistanceModeActive,
        toggleEventDNAInterest,
        setEventDNAInterests,

        toggleSaveSession,
        navigateDirectlyToZone,
        updateSessionLocation,
        addSession,
        deleteSession,
        publishAnnouncement,
        updateZoneCount,
        updateAccessibility,
        markAnnouncementAsRead,
        addToast,
        dismissToast,
        simulateDemoScenario,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = (): EventContextType => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};

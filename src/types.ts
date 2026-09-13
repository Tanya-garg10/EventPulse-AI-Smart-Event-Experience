export type CrowdLevel = 'low' | 'moderate' | 'high' | 'critical';
export type CrowdTrend = 'increasing' | 'stable' | 'decreasing';

export interface VenueZone {
  id: string;
  name: string;
  code: string;
  type: 'stage' | 'workshop' | 'pavilion' | 'food' | 'restroom' | 'medical' | 'security' | 'help' | 'networking' | 'registration';
  floor: 1 | 2;
  coordinates: {
    x: number; // percentage (0-100)
    y: number; // percentage (0-100)
    width: number;
    height: number;
  };
  capacity: number;
  currentCount: number;
  crowdLevel: CrowdLevel;
  trend: CrowdTrend;
  crowdReason: string;
  hasStairs: boolean;
  hasElevator: boolean;
  isAccessible: boolean;
  nearestRestroomId: string;
}

export interface Session {
  id: string;
  title: string;
  speaker: string;
  speakerRole: string;
  speakerCompany: string;
  hallId: string;
  hallName: string;
  startTime: string; // e.g. "10:30"
  endTime: string;   // e.g. "11:15"
  day: 'Day 1' | 'Day 2';
  durationMinutes: number;
  category: 'AI & ML' | 'Startups & Venture' | 'Web3 & Security' | 'Design & UX' | 'Cloud & Systems';
  tags: string[];
  capacity: number;
  registeredCount: number;
  description: string;
  isCrowded?: boolean;
  isSaved?: boolean;
  isLocationChanged?: boolean;
  originalHallName?: string;
  popularityScore: number; // 0-100
  status?: 'upcoming' | 'live' | 'shifted' | 'concluded';
  delayMinutes?: number;
  liveNotes?: string;
}

export type AnnouncementPriority = 'normal' | 'important' | 'emergency';

export interface Announcement {
  id: string;
  title: string;
  message: string;
  priority: AnnouncementPriority;
  timestamp: string;
  targetAudience: 'All Attendees' | 'VIP & Speakers' | 'Workshop Registrants' | 'Exhibitors';
  read?: boolean;
  relatedSessionId?: string;
  relatedZoneId?: string;
}

export interface RouteOption {
  type: 'fastest' | 'crowd_aware' | 'accessible';
  title: string;
  durationMinutes: number;
  distanceMeters: number;
  pathNodes: string[]; // zone IDs
  pathCoordinates: { x: number; y: number }[];
  warnings?: string[];
  elevatorUsed: boolean;
  crowdLevelEncountered: CrowdLevel;
  description: string;
  isRecommended?: boolean;
  stepInstructions?: string[];
}

export interface EmergencyPoint {
  id: string;
  name: string;
  type: 'medical' | 'security' | 'help';
  zoneId: string;
  distanceMeters: number;
  phone: string;
  contactPerson: string;
  status: 'Ready' | 'Busy';
}

export interface AccessibilitySettings {
  avoidStairs: boolean;
  wheelchair: boolean;
  preferElevators: boolean;
  avoidCrowds: boolean;
  accessibleRestroom: boolean;
  highContrast: boolean;
  largeText: boolean;
}

export interface AttendeeProfile {
  name: string;
  interests: string[];
  preferredTypes: string[];
  availableTimeMins: number;
  accessibilityPrefs: AccessibilitySettings;
}

export interface ScoredSession {
  session: Session;
  matchScore: number; // 0-100
  breakdown: {
    interestMatch: number;      // max 50
    timeCompatibility: number;  // max 20
    crowdComfort: number;       // max 15
    proximity: number;          // max 10
    popularity: number;         // max 5
  };
  reasons: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedSessions?: Session[];
  suggestedRoute?: {
    fromZoneId?: string;
    toZoneId: string;
    zoneName: string;
  };
  actionPrompt?: string;
}

export interface EventMetrics {
  totalAttendees: number;
  activeSessionsCount: number;
  crowdedZonesCount: number;
  emergencyAlertsCount: number;
  announcementsCount: number;
  peakHour: string;
  averageOccupancyRate: number;
}

import { EmergencyPoint } from '../../types';
import { INITIAL_EMERGENCY_POINTS } from '../../data/eventData';

export interface SOSDispatchStatus {
  active: boolean;
  timestamp: string;
  incidentType: 'medical' | 'security' | 'fire' | 'general';
  attendeeLocation: string;
  assignedResponder: string;
  estimatedArrivalMins: number;
  statusText: string;
}

export class EmergencyService {
  private static emergencyPoints: EmergencyPoint[] = [...INITIAL_EMERGENCY_POINTS];

  static getEmergencyContacts(): EmergencyPoint[] {
    return this.emergencyPoints;
  }

  static getNearestPoint(type?: 'medical' | 'security' | 'help'): EmergencyPoint {
    const pool = type ? this.emergencyPoints.filter((p) => p.type === type) : this.emergencyPoints;
    if (pool.length === 0) return this.emergencyPoints[0];
    return pool.reduce((prev, curr) => (curr.distanceMeters < prev.distanceMeters ? curr : prev));
  }

  static createSOSAlert(
    locationName: string,
    incidentType: 'medical' | 'security' | 'fire' | 'general' = 'medical'
  ): SOSDispatchStatus {
    const assigned =
      incidentType === 'medical'
        ? 'Paramedic Rapid Response Team 1'
        : incidentType === 'security'
        ? 'Venue Security Unit A-Alpha'
        : 'Operations Duty Officer';

    return {
      active: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      incidentType,
      attendeeLocation: locationName || 'Central Atrium Zone',
      assignedResponder: assigned,
      estimatedArrivalMins: 2,
      statusText: 'Dispatcher connected. Response team moving to your verified GPS pin.',
    };
  }
}

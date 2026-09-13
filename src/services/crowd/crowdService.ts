import { VenueZone, CrowdLevel, CrowdTrend } from '../../types';

export class CrowdService {
  /**
   * Determine crowd level based on capacity utilization percentage
   */
  static getCrowdLevel(current: number, capacity: number): CrowdLevel {
    const ratio = current / capacity;
    if (ratio >= 0.9) return 'critical';
    if (ratio >= 0.75) return 'high';
    if (ratio >= 0.5) return 'moderate';
    return 'low';
  }

  /**
   * Get percentage string
   */
  static getOccupancyPercentage(current: number, capacity: number): number {
    return Math.min(100, Math.round((current / capacity) * 100));
  }

  /**
   * Explains why a specific zone is currently crowded based on schedule and events
   */
  static explainCrowd(zone: VenueZone): string {
    if (zone.crowdReason) return zone.crowdReason;
    const pct = this.getOccupancyPercentage(zone.currentCount, zone.capacity);
    if (pct > 80) {
      return `Popular high-demand session active with adjacent corridor queue buildup (${pct}% capacity).`;
    }
    if (pct > 50) {
      return `Steady foot traffic flowing between main atrium and exhibition wings (${pct}% capacity).`;
    }
    return `Comfortable capacity with low queue times and open seating (${pct}% capacity).`;
  }

  /**
   * Update zone count and calculate new level and trend
   */
  static updateZoneCount(zone: VenueZone, newCount: number): VenueZone {
    const clamped = Math.max(0, Math.min(zone.capacity * 1.1, newCount));
    const trend: CrowdTrend =
      clamped > zone.currentCount ? 'increasing' : clamped < zone.currentCount ? 'decreasing' : 'stable';
    const level = this.getCrowdLevel(clamped, zone.capacity);

    return {
      ...zone,
      currentCount: Math.round(clamped),
      crowdLevel: level,
      trend,
    };
  }

  /**
   * Get high priority crowd warnings for organizers and attendees
   */
  static getCrowdAlerts(zones: VenueZone[]): { zoneId: string; zoneName: string; message: string; severity: 'warning' | 'danger' }[] {
    const alerts: { zoneId: string; zoneName: string; message: string; severity: 'warning' | 'danger' }[] = [];
    for (const z of zones) {
      const pct = this.getOccupancyPercentage(z.currentCount, z.capacity);
      if (pct >= 90) {
        alerts.push({
          zoneId: z.id,
          zoneName: z.name,
          message: `${z.name} has reached critical capacity (${pct}%). Re-routing recommended.`,
          severity: 'danger',
        });
      } else if (pct >= 80) {
        alerts.push({
          zoneId: z.id,
          zoneName: z.name,
          message: `${z.name} is approaching capacity (${pct}%). Consider alternative zones.`,
          severity: 'warning',
        });
      }
    }
    return alerts;
  }
}

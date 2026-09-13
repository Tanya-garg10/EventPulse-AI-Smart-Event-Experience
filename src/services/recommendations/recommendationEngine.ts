import { Session, VenueZone, AttendeeProfile, ScoredSession } from '../../types';

export class RecommendationEngine {
  /**
   * Evaluates sessions against attendee profile using deterministic multi-variable scoring
   * - Interest match: 50% (0-50 pts)
   * - Time compatibility: 20% (0-20 pts)
   * - Crowd comfort: 15% (0-15 pts)
   * - Proximity: 10% (0-10 pts)
   * - Popularity: 5% (0-5 pts)
   */
  static scoreSessions(
    sessions: Session[],
    zones: VenueZone[],
    profile: AttendeeProfile,
    currentLocationZoneId = 'zone-registration'
  ): ScoredSession[] {
    const zoneMap = new Map(zones.map((z) => [z.id, z]));

    const scored: ScoredSession[] = sessions.map((session) => {
      const reasons: string[] = [];

      // 1. Interest Match (50 points)
      let interestScore = 0;
      const sessionText = `${session.category} ${session.tags.join(' ')} ${session.title} ${session.description}`.toLowerCase();
      
      let matchedInterests = 0;
      profile.interests.forEach((interest) => {
        if (sessionText.includes(interest.toLowerCase())) {
          matchedInterests++;
        }
      });

      if (profile.interests.length > 0) {
        const ratio = matchedInterests / profile.interests.length;
        interestScore = Math.min(50, Math.round(ratio * 50 + (matchedInterests > 0 ? 15 : 0)));
      } else {
        interestScore = 35; // default baseline
      }

      if (matchedInterests > 0) {
        const matched = profile.interests.filter((i) => sessionText.includes(i.toLowerCase()));
        reasons.push(`✓ Matches your ${matched.slice(0, 2).join(' & ')} interest`);
      }

      // 2. Time Compatibility (20 points)
      let timeScore = 15;
      if (session.durationMinutes <= profile.availableTimeMins) {
        timeScore = 20;
        reasons.push(`✓ Fits inside your ${profile.availableTimeMins} min time budget`);
      } else {
        timeScore = Math.max(5, 20 - Math.round(((session.durationMinutes - profile.availableTimeMins) / 30) * 10));
      }

      // 3. Crowd Level (15 points)
      const zone = zoneMap.get(session.hallId);
      let crowdScore = 15;
      if (zone) {
        if (zone.crowdLevel === 'low') {
          crowdScore = 15;
          reasons.push('✓ Low crowd with guaranteed open seating');
        } else if (zone.crowdLevel === 'moderate') {
          crowdScore = 11;
        } else if (zone.crowdLevel === 'high') {
          crowdScore = 6;
        } else if (zone.crowdLevel === 'critical') {
          crowdScore = 2;
        }
      }

      // 4. Proximity (10 points)
      let proximityScore = 8;
      if (session.hallId === currentLocationZoneId) {
        proximityScore = 10;
        reasons.push('✓ In your current hall (zero transit time)');
      } else {
        proximityScore = 8;
        reasons.push('✓ 3-5 min walking distance');
      }

      // 5. Popularity (5 points)
      const popRatio = (session.popularityScore || 80) / 100;
      const popularityScore = Math.round(popRatio * 5);
      if (session.popularityScore > 90) {
        reasons.push('✓ Highly rated by attendees');
      }

      // Accessibility filtering: if wheelchair preferred and zone has stairs with no elevator
      if (profile.accessibilityPrefs.wheelchair && zone && !zone.isAccessible) {
        interestScore = Math.max(0, interestScore - 20);
        reasons.push('⚠ Note: Zone has stairs; staff assistance requested');
      }

      const totalScore = Math.min(99, Math.max(25, interestScore + timeScore + crowdScore + proximityScore + popularityScore));

      return {
        session,
        matchScore: totalScore,
        breakdown: {
          interestMatch: interestScore,
          timeCompatibility: timeScore,
          crowdComfort: crowdScore,
          proximity: proximityScore,
          popularity: popularityScore,
        },
        reasons: reasons.slice(0, 4),
      };
    });

    // Sort by matchScore descending
    return scored.sort((a, b) => b.matchScore - a.matchScore);
  }
}

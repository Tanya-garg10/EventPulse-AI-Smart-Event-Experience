import { describe, it, expect } from 'vitest';
import { RecommendationEngine } from './recommendationEngine';
import { INITIAL_SESSIONS, INITIAL_ZONES } from '../../data/eventData';

describe('RecommendationEngine', () => {
  describe('scoreSessions', () => {
    it('should score sessions based on attendee profile', () => {
      const profile = {
        interests: ['AI', 'Machine Learning'],
        availableTimeMins: 60,
        accessibilityPrefs: {
          wheelchair: false,
          visualAssistance: false,
          hearingAssistance: false,
        },
      };

      const result = RecommendationEngine.scoreSessions(
        INITIAL_SESSIONS,
        INITIAL_ZONES,
        profile
      );

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(INITIAL_SESSIONS.length);
      expect(result[0]).toHaveProperty('session');
      expect(result[0]).toHaveProperty('matchScore');
      expect(result[0]).toHaveProperty('breakdown');
      expect(result[0]).toHaveProperty('reasons');
    });

    it('should sort sessions by match score descending', () => {
      const profile = {
        interests: ['AI', 'Startups'],
        availableTimeMins: 60,
        accessibilityPrefs: {
          wheelchair: false,
          visualAssistance: false,
          hearingAssistance: false,
        },
      };

      const result = RecommendationEngine.scoreSessions(
        INITIAL_SESSIONS,
        INITIAL_ZONES,
        profile
      );

      // Check that scores are in descending order
      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].matchScore).toBeGreaterThanOrEqual(result[i + 1].matchScore);
      }
    });

    it('should give higher scores to sessions matching interests', () => {
      const aiProfile = {
        interests: ['AI', 'Machine Learning', 'Deep Learning'],
        availableTimeMins: 60,
        accessibilityPrefs: {
          wheelchair: false,
          visualAssistance: false,
          hearingAssistance: false,
        },
      };

      const result = RecommendationEngine.scoreSessions(
        INITIAL_SESSIONS,
        INITIAL_ZONES,
        aiProfile
      );

      // AI sessions should have higher scores
      const aiSessions = result.filter(r => 
        r.session.category === 'AI & ML' || 
        r.session.tags.some(tag => tag.toLowerCase().includes('ai'))
      );

      const averageAiScore = aiSessions.reduce((sum, r) => sum + r.matchScore, 0) / aiSessions.length;
      const averageScore = result.reduce((sum, r) => sum + r.matchScore, 0) / result.length;

      expect(averageAiScore).toBeGreaterThanOrEqual(averageScore);
    });

    it('should penalize sessions that exceed available time', () => {
      const shortTimeProfile = {
        interests: ['AI'],
        availableTimeMins: 30,
        accessibilityPrefs: {
          wheelchair: false,
          visualAssistance: false,
          hearingAssistance: false,
        },
      };

      const result = RecommendationEngine.scoreSessions(
        INITIAL_SESSIONS,
        INITIAL_ZONES,
        shortTimeProfile
      );

      // Sessions longer than 30 mins should have lower time scores
      const longSessions = result.filter(r => r.session.durationMinutes > 30);
      longSessions.forEach(session => {
        expect(session.breakdown.timeCompatibility).toBeLessThan(20);
      });
    });

    it('should prefer low crowd zones', () => {
      const profile = {
        interests: ['AI'],
        availableTimeMins: 60,
        accessibilityPrefs: {
          wheelchair: false,
          visualAssistance: false,
          hearingAssistance: false,
        },
      };

      const result = RecommendationEngine.scoreSessions(
        INITIAL_SESSIONS,
        INITIAL_ZONES,
        profile
      );

      // Sessions in low crowd zones should have higher crowd comfort scores
      const lowCrowdSessions = result.filter(r => {
        const zone = INITIAL_ZONES.find(z => z.id === r.session.hallId);
        return zone?.crowdLevel === 'low';
      });

      if (lowCrowdSessions.length > 0) {
        lowCrowdSessions.forEach(session => {
          expect(session.breakdown.crowdComfort).toBeGreaterThanOrEqual(11);
        });
      }
    });

    it('should penalize inaccessible zones for wheelchair users', () => {
      const wheelchairProfile = {
        interests: ['AI'],
        availableTimeMins: 60,
        accessibilityPrefs: {
          wheelchair: true,
          visualAssistance: false,
          hearingAssistance: false,
        },
      };

      const result = RecommendationEngine.scoreSessions(
        INITIAL_SESSIONS,
        INITIAL_ZONES,
        wheelchairProfile
      );

      // Sessions in inaccessible zones should have lower scores
      const inaccessibleSessions = result.filter(r => {
        const zone = INITIAL_ZONES.find(z => z.id === r.session.hallId);
        return zone && !zone.isAccessible;
      });

      inaccessibleSessions.forEach(session => {
        expect(session.breakdown.interestMatch).toBeLessThan(50);
      });
    });

    it('should provide reasons for recommendations', () => {
      const profile = {
        interests: ['AI', 'Startups'],
        availableTimeMins: 60,
        accessibilityPrefs: {
          wheelchair: false,
          visualAssistance: false,
          hearingAssistance: false,
        },
      };

      const result = RecommendationEngine.scoreSessions(
        INITIAL_SESSIONS,
        INITIAL_ZONES,
        profile
      );

      // Top recommendations should have reasons
      const topRecommendations = result.slice(0, 5);
      topRecommendations.forEach(rec => {
        expect(rec.reasons).toBeInstanceOf(Array);
        // At least some recommendations should have reasons
      });
    });

    it('should handle empty interests gracefully', () => {
      const noInterestsProfile = {
        interests: [],
        availableTimeMins: 60,
        accessibilityPrefs: {
          wheelchair: false,
          visualAssistance: false,
          hearingAssistance: false,
        },
      };

      const result = RecommendationEngine.scoreSessions(
        INITIAL_SESSIONS,
        INITIAL_ZONES,
        noInterestsProfile
      );

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(INITIAL_SESSIONS.length);
      // Should still provide scores even without interests
      result.forEach(session => {
        expect(session.matchScore).toBeGreaterThan(0);
      });
    });

    it('should calculate score breakdown correctly', () => {
      const profile = {
        interests: ['AI'],
        availableTimeMins: 60,
        accessibilityPrefs: {
          wheelchair: false,
          visualAssistance: false,
          hearingAssistance: false,
        },
      };

      const result = RecommendationEngine.scoreSessions(
        INITIAL_SESSIONS,
        INITIAL_ZONES,
        profile
      );

      result.forEach(session => {
        const { breakdown } = session;
        const calculatedTotal = 
          breakdown.interestMatch + 
          breakdown.timeCompatibility + 
          breakdown.crowdComfort + 
          breakdown.proximity + 
          breakdown.popularity;

        // Total should match the sum of breakdown parts (within rounding)
        expect(Math.abs(session.matchScore - calculatedTotal)).toBeLessThanOrEqual(2);
      });
    });

    it('should handle sessions with missing popularity scores', () => {
      const sessionsWithoutPopularity = INITIAL_SESSIONS.map(s => ({
        ...s,
        popularityScore: undefined
      }));

      const profile = {
        interests: ['AI'],
        availableTimeMins: 60,
        accessibilityPrefs: {
          wheelchair: false,
          visualAssistance: false,
          hearingAssistance: false,
        },
      };

      const result = RecommendationEngine.scoreSessions(
        sessionsWithoutPopularity,
        INITIAL_ZONES,
        profile
      );

      expect(result).toBeInstanceOf(Array);
      result.forEach(session => {
        expect(session.breakdown.popularity).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
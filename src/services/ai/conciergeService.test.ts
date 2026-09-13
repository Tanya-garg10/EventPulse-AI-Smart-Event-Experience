import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ConciergeService } from './conciergeService';
import { INITIAL_SESSIONS, INITIAL_ZONES } from '../../data/eventData';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('ConciergeService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockClear();
  });

  describe('askConcierge', () => {
    it('should handle food queries correctly', async () => {
      const result = await ConciergeService.askConcierge(
        'Where can I get food?',
        INITIAL_SESSIONS,
        INITIAL_ZONES
      );

      expect(result.text).toContain('Food Court B');
      expect(result.text).toContain('Garden Plaza');
      expect(result.suggestedRoute).toBeDefined();
      expect(result.suggestedRoute?.toZoneId).toBe('zone-food-b');
    });

    it('should handle 2-hour planning queries', async () => {
      const result = await ConciergeService.askConcierge(
        'Plan my next 2 hours',
        INITIAL_SESSIONS,
        INITIAL_ZONES
      );

      expect(result.text).toContain('10:30');
      expect(result.text).toContain('12:15');
      expect(result.suggestedSessions).toBeDefined();
      expect(result.suggestedSessions?.length).toBeGreaterThan(0);
    });

    it('should handle low crowd queries', async () => {
      const result = await ConciergeService.askConcierge(
        'Where are fewer people?',
        INITIAL_SESSIONS,
        INITIAL_ZONES
      );

      expect(result.text).toContain('lowest attendee density');
      expect(result.suggestedSessions).toBeDefined();
    });

    it('should handle AI and startup queries', async () => {
      const result = await ConciergeService.askConcierge(
        'Find AI sessions',
        INITIAL_SESSIONS,
        INITIAL_ZONES
      );

      expect(result.text).toContain('AI');
      expect(result.suggestedSessions).toBeDefined();
      expect(result.suggestedSessions?.length).toBeGreaterThan(0);
    });

    it('should handle restroom queries', async () => {
      const result = await ConciergeService.askConcierge(
        'Where is the restroom?',
        INITIAL_SESSIONS,
        INITIAL_ZONES
      );

      expect(result.text).toContain('restroom');
      expect(result.text).toContain('West Wing');
      expect(result.suggestedRoute).toBeDefined();
    });

    it('should return default response for unknown queries', async () => {
      const result = await ConciergeService.askConcierge(
        'Random query',
        INITIAL_SESSIONS,
        INITIAL_ZONES
      );

      expect(result.text).toContain('Welcome to EventPulse AI');
      expect(result.suggestedSessions).toBeDefined();
    });

    it('should call server API when available', async () => {
      const mockResponse = {
        text: 'AI response from server',
        sessionIds: ['session-01'],
        suggestedRoute: { toZoneId: 'zone-main-stage', zoneName: 'Main Stage' }
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await ConciergeService.askConcierge(
        'Test query',
        INITIAL_SESSIONS,
        INITIAL_ZONES
      );

      expect(global.fetch).toHaveBeenCalledWith('/api/ai/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'Test query', savedSessionIds: [] })
      });
    });

    it('should fallback to local knowledge when server fails', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      const result = await ConciergeService.askConcierge(
        'Where can I get food?',
        INITIAL_SESSIONS,
        INITIAL_ZONES
      );

      expect(result.text).toContain('Food Court B');
      expect(result.suggestedRoute).toBeDefined();
    });
  });

  describe('fallbackLocalKnowledge', () => {
    it('should correctly identify food courts and their capacity', () => {
      const result = (ConciergeService as any).fallbackLocalKnowledge(
        'I want food',
        INITIAL_SESSIONS,
        INITIAL_ZONES
      );

      expect(result.text).toContain('Food Court B');
      expect(result.text).toContain('Food Court A');
      expect(result.suggestedRoute?.toZoneId).toBe('zone-food-b');
    });

    it('should avoid crowded zones in recommendations', () => {
      const result = (ConciergeService as any).fallbackLocalKnowledge(
        'Where are fewer people?',
        INITIAL_SESSIONS,
        INITIAL_ZONES
      );

      expect(result.text).toContain('lowest attendee density');
      const suggestedZoneIds = result.suggestedSessions?.map((s: any) => s.hallId);
      expect(suggestedZoneIds).not.toContain('zone-hall-b'); // This is crowded
    });
  });
});
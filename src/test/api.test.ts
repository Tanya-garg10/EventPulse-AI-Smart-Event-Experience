import { describe, it, expect } from 'vitest';
import { INITIAL_SESSIONS, INITIAL_ZONES, INITIAL_ANNOUNCEMENTS } from '../data/eventData';

describe('Data Validation Tests', () => {
  describe('Data Structures', () => {
    it('should validate data structures', () => {
      expect(Array.isArray(INITIAL_SESSIONS)).toBe(true);
      expect(Array.isArray(INITIAL_ZONES)).toBe(true);
      expect(Array.isArray(INITIAL_ANNOUNCEMENTS)).toBe(true);
      
      expect(INITIAL_SESSIONS.length).toBeGreaterThan(0);
      expect(INITIAL_ZONES.length).toBeGreaterThan(0);
      expect(INITIAL_ANNOUNCEMENTS.length).toBeGreaterThan(0);
    });

    it('should validate session structure', () => {
      const session = INITIAL_SESSIONS[0];
      
      expect(session).toHaveProperty('id');
      expect(session).toHaveProperty('title');
      expect(session).toHaveProperty('speaker');
      expect(session).toHaveProperty('hallId');
      expect(session).toHaveProperty('startTime');
      expect(session).toHaveProperty('endTime');
      expect(session).toHaveProperty('category');
    });

    it('should validate zone structure', () => {
      const zone = INITIAL_ZONES[0];
      
      expect(zone).toHaveProperty('id');
      expect(zone).toHaveProperty('name');
      expect(zone).toHaveProperty('type');
      expect(zone).toHaveProperty('capacity');
      expect(zone).toHaveProperty('currentCount');
      expect(zone).toHaveProperty('crowdLevel');
      expect(zone).toHaveProperty('isAccessible');
    });

    it('should validate announcement structure', () => {
      const announcement = INITIAL_ANNOUNCEMENTS[0];
      
      expect(announcement).toHaveProperty('id');
      expect(announcement).toHaveProperty('title');
      expect(announcement).toHaveProperty('message');
      expect(announcement).toHaveProperty('priority');
      expect(announcement).toHaveProperty('timestamp');
    });
  });

  describe('Data Integrity', () => {
    it('should have unique session IDs', () => {
      const sessionIds = INITIAL_SESSIONS.map(s => s.id);
      const uniqueIds = new Set(sessionIds);
      expect(uniqueIds.size).toBe(sessionIds.length);
    });

    it('should have unique zone IDs', () => {
      const zoneIds = INITIAL_ZONES.map(z => z.id);
      const uniqueIds = new Set(zoneIds);
      expect(uniqueIds.size).toBe(zoneIds.length);
    });

    it('should have valid crowd levels', () => {
      const validCrowdLevels = ['low', 'moderate', 'high', 'critical'];
      INITIAL_ZONES.forEach(zone => {
        expect(validCrowdLevels).toContain(zone.crowdLevel);
      });
    });

    it('should have valid session times', () => {
      INITIAL_SESSIONS.forEach(session => {
        expect(session.startTime).toMatch(/^\d{1,2}:\d{2}$/);
        expect(session.endTime).toMatch(/^\d{1,2}:\d{2}$/);
        expect(session.durationMinutes).toBeGreaterThan(0);
      });
    });
  });
});
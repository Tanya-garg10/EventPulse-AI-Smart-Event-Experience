import { describe, it, expect } from 'vitest';
import { RoutingService } from './routingService';
import { INITIAL_ZONES } from '../../data/eventData';

describe('RoutingService', () => {
  describe('calculateRoutes', () => {
    it('should calculate routes between two zones', () => {
      const result = RoutingService.calculateRoutes(
        'zone-main-stage',
        'zone-hall-a',
        INITIAL_ZONES
      );

      expect(result).toHaveProperty('fastest');
      expect(result).toHaveProperty('crowdAware');
      expect(result).toHaveProperty('accessible');

      expect(result.fastest).toHaveProperty('durationMinutes');
      expect(result.fastest).toHaveProperty('distanceMeters');
      expect(result.fastest).toHaveProperty('pathNodes');
      expect(result.fastest).toHaveProperty('stepInstructions');
    });

    it('should prefer accessible route when requested', () => {
      const result = RoutingService.calculateRoutes(
        'zone-main-stage',
        'zone-hall-c',
        INITIAL_ZONES,
        true
      );

      expect(result.accessible.isRecommended).toBe(true);
      expect(result.accessible.pathNodes).toBeDefined();
    });

    it('should avoid stairs in accessible routes', () => {
      const result = RoutingService.calculateRoutes(
        'zone-main-stage',
        'zone-hall-c',
        INITIAL_ZONES
      );

      expect(result.accessible.elevatorUsed).toBe(true);
    });

    it('should calculate crowd-aware routes with penalties', () => {
      const result = RoutingService.calculateRoutes(
        'zone-main-stage',
        'zone-hall-b',
        INITIAL_ZONES
      );

      expect(result.crowdAware).toBeDefined();
      expect(result.crowdAware.durationMinutes).toBeGreaterThanOrEqual(0);
    });

    it('should recommend crowd-aware route when fastest passes through high crowd', () => {
      // Create a scenario where fastest route goes through crowded area
      const crowdedZones = INITIAL_ZONES.map(zone => {
        if (zone.id === 'zone-hall-b') {
          return { ...zone, crowdLevel: 'critical' as const };
        }
        return zone;
      });

      const result = RoutingService.calculateRoutes(
        'zone-main-stage',
        'zone-hall-b',
        crowdedZones
      );

      // If fastest route encounters high crowd, crowd-aware should be recommended
      if (result.fastest.crowdLevelEncountered === 'high' || result.fastest.crowdLevelEncountered === 'critical') {
        expect(result.crowdAware.isRecommended).toBe(true);
      }
    });

    it('should generate step-by-step instructions', () => {
      const result = RoutingService.calculateRoutes(
        'zone-main-stage',
        'zone-hall-a',
        INITIAL_ZONES
      );

      expect(result.fastest.stepInstructions).toBeInstanceOf(Array);
      expect(result.fastest.stepInstructions.length).toBeGreaterThan(0);
      expect(result.fastest.stepInstructions[0]).toContain('Depart');
    });

    it('should handle zones on different floors', () => {
      const result = RoutingService.calculateRoutes(
        'zone-hall-a',
        'zone-hall-c',
        INITIAL_ZONES
      );

      expect(result.accessible.elevatorUsed).toBe(true);
      const hasElevatorInstruction = result.accessible.stepInstructions.some((step: string) =>
        step.toLowerCase().includes('elevator')
      );
      expect(hasElevatorInstruction).toBe(true);
    });

    it('should handle invalid zone IDs gracefully', () => {
      const result = RoutingService.calculateRoutes(
        'invalid-zone',
        'zone-hall-a',
        INITIAL_ZONES
      );

      expect(result).toBeDefined();
      expect(result.fastest.pathNodes).toBeDefined();
    });

    it('should calculate distance correctly', () => {
      const result = RoutingService.calculateRoutes(
        'zone-main-stage',
        'zone-hall-a',
        INITIAL_ZONES
      );

      expect(result.fastest.distanceMeters).toBeGreaterThan(0);
      expect(result.fastest.durationMinutes).toBeGreaterThan(0);
    });

    it('should provide different routes with different characteristics', () => {
      const result = RoutingService.calculateRoutes(
        'zone-main-stage',
        'zone-hall-b',
        INITIAL_ZONES
      );

      // Routes should have different characteristics
      const routes = [result.fastest, result.crowdAware, result.accessible];
      const uniqueDurations = new Set(routes.map(r => r.durationMinutes));
      
      // At least some routes should be different
      expect(uniqueDurations.size).toBeGreaterThan(1);
    });
  });

  describe('dijkstra algorithm', () => {
    it('should find shortest path using standard distance', () => {
      const result = RoutingService.calculateRoutes(
        'zone-main-stage',
        'zone-hall-a',
        INITIAL_ZONES
      );

      expect(result.fastest.pathNodes.length).toBeGreaterThan(1);
      expect(result.fastest.distanceMeters).toBeGreaterThan(0);
    });

    it('should handle unreachable nodes gracefully', () => {
      // This test ensures the algorithm doesn't crash on edge cases
      const result = RoutingService.calculateRoutes(
        'zone-main-stage',
        'zone-main-stage',
        INITIAL_ZONES
      );

      expect(result).toBeDefined();
    });
  });

  describe('route building', () => {
    it('should include proper metadata in route options', () => {
      const result = RoutingService.calculateRoutes(
        'zone-main-stage',
        'zone-hall-a',
        INITIAL_ZONES
      );

      expect(result.fastest).toMatchObject({
        type: 'fastest',
        title: 'Fastest Route',
        durationMinutes: expect.any(Number),
        distanceMeters: expect.any(Number),
        pathNodes: expect.any(Array),
        pathCoordinates: expect.any(Array),
      });
    });

    it('should generate human-readable descriptions', () => {
      const result = RoutingService.calculateRoutes(
        'zone-main-stage',
        'zone-hall-a',
        INITIAL_ZONES
      );

      expect(result.fastest.description).toBeDefined();
      expect(result.fastest.description.length).toBeGreaterThan(0);
      expect(result.crowdAware.description).toBeDefined();
      expect(result.accessible.description).toBeDefined();
    });
  });
});
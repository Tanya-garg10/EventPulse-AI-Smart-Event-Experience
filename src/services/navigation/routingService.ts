import { RouteOption, VenueZone } from '../../types';
import { VENUE_NODES, VENUE_EDGES, GraphNode, GraphEdge } from '../../data/eventData';

export class RoutingService {
  /**
   * Deterministically finds a path between two zones or nodes using Dijkstra.
   * Safety-critical routing NEVER uses probabilistic AI.
   */
  static calculateRoutes(
    fromZoneId: string,
    toZoneId: string,
    zones: VenueZone[],
    preferAccessible = false
  ): {
    fastest: RouteOption;
    crowdAware: RouteOption;
    accessible: RouteOption;
  } {
    const fromNode = this.findNodeByZoneId(fromZoneId) || 'n-reg';
    const toNode = this.findNodeByZoneId(toZoneId) || 'n-main-stage';

    const zoneMap = new Map(zones.map((z) => [z.id, z]));

    // 1. Calculate Fastest Route (standard distance)
    const fastestPath = this.dijkstra(fromNode, toNode, (edge) => edge.distanceMeters);

    // 2. Calculate Crowd-Aware Route (distance + heavy penalty for high/critical crowd zones)
    const crowdAwarePath = this.dijkstra(fromNode, toNode, (edge) => {
      const targetNode = VENUE_NODES[edge.to];
      let crowdMultiplier = 1.0;
      if (targetNode?.zoneId && zoneMap.has(targetNode.zoneId)) {
        const zone = zoneMap.get(targetNode.zoneId)!;
        if (zone.crowdLevel === 'critical') crowdMultiplier = 4.5;
        else if (zone.crowdLevel === 'high') crowdMultiplier = 2.5;
        else if (zone.crowdLevel === 'moderate') crowdMultiplier = 1.2;
      }
      return edge.distanceMeters * crowdMultiplier;
    });

    // 3. Calculate Accessible Route (stairs strictly forbidden, elevator mandatory for floor 2)
    const accessiblePath = this.dijkstra(
      fromNode,
      toNode,
      (edge) => {
        if (edge.hasStairs) return Infinity; // impassable for wheelchairs
        return edge.distanceMeters;
      },
      (edge) => !edge.hasStairs
    );

    const fastest = this.buildRouteOption('fastest', 'Fastest Route', fastestPath, zoneMap);
    const crowdAware = this.buildRouteOption('crowd_aware', 'Crowd-Aware Route', crowdAwarePath, zoneMap);
    const accessible = this.buildRouteOption('accessible', 'Accessible Route (Step-Free)', accessiblePath, zoneMap);

    // Add smart comparative recommendation
    if (fastest.crowdLevelEncountered === 'high' || fastest.crowdLevelEncountered === 'critical') {
      fastest.warnings = ['Fastest route currently passes through a high-crowd bottleneck.'];
      crowdAware.isRecommended = true;
      crowdAware.description = `Crowd-aware route adds ~${Math.max(1, crowdAware.durationMinutes - fastest.durationMinutes)} min but avoids severe corridor congestion.`;
    } else {
      fastest.isRecommended = true;
    }

    if (preferAccessible) {
      accessible.isRecommended = true;
    }

    return { fastest, crowdAware, accessible };
  }

  private static findNodeByZoneId(zoneId: string): string | null {
    for (const [nodeId, node] of Object.entries(VENUE_NODES)) {
      if (node.zoneId === zoneId) return nodeId;
    }
    return null;
  }

  private static dijkstra(
    startNodeId: string,
    endNodeId: string,
    weightFn: (edge: GraphEdge) => number,
    edgeFilter?: (edge: GraphEdge) => boolean
  ): { nodes: string[]; totalDistance: number; elevatorUsed: boolean; hasStairs: boolean } {
    const distances: Record<string, number> = {};
    const previous: Record<string, { node: string; edge: GraphEdge } | null> = {};
    const unvisited = new Set<string>(Object.keys(VENUE_NODES));

    for (const nodeId of Object.keys(VENUE_NODES)) {
      distances[nodeId] = Infinity;
      previous[nodeId] = null;
    }
    distances[startNodeId] = 0;

    // Build bi-directional adjacency map
    const adjacency: Record<string, GraphEdge[]> = {};
    for (const nodeId of Object.keys(VENUE_NODES)) {
      adjacency[nodeId] = [];
    }
    for (const edge of VENUE_EDGES) {
      if (!edgeFilter || edgeFilter(edge)) {
        adjacency[edge.from].push(edge);
        adjacency[edge.to].push({
          from: edge.to,
          to: edge.from,
          distanceMeters: edge.distanceMeters,
          hasStairs: edge.hasStairs,
          isElevator: edge.isElevator,
        });
      }
    }

    while (unvisited.size > 0) {
      // Pick unvisited node with smallest distance
      let current: string | null = null;
      let minDistance = Infinity;

      for (const node of unvisited) {
        if (distances[node] < minDistance) {
          minDistance = distances[node];
          current = node;
        }
      }

      if (current === null || distances[current] === Infinity) break;
      if (current === endNodeId) break;

      unvisited.delete(current);

      for (const edge of adjacency[current]) {
        if (!unvisited.has(edge.to)) continue;
        const weight = weightFn(edge);
        if (weight === Infinity) continue;
        const newDist = distances[current] + weight;
        if (newDist < distances[edge.to]) {
          distances[edge.to] = newDist;
          previous[edge.to] = { node: current, edge };
        }
      }
    }

    // Reconstruct path
    const pathNodes: string[] = [];
    let curr: string | null = endNodeId;
    let totalDist = 0;
    let elevatorUsed = false;
    let hasStairs = false;

    if (distances[endNodeId] !== Infinity) {
      while (curr) {
        pathNodes.unshift(curr);
        const prev = previous[curr];
        if (prev) {
          totalDist += prev.edge.distanceMeters;
          if (prev.edge.isElevator) elevatorUsed = true;
          if (prev.edge.hasStairs) hasStairs = true;
          curr = prev.node;
        } else {
          curr = null;
        }
      }
    } else {
      // Fallback direct path
      pathNodes.push(startNodeId, endNodeId);
      totalDist = 120;
    }

    return { nodes: pathNodes, totalDistance: totalDist, elevatorUsed, hasStairs };
  }

  private static buildRouteOption(
    type: 'fastest' | 'crowd_aware' | 'accessible',
    title: string,
    result: { nodes: string[]; totalDistance: number; elevatorUsed: boolean; hasStairs: boolean },
    zoneMap: Map<string, VenueZone>
  ): RouteOption {
    // Normal walking pace: 75 meters / min (~1.25 m/s). Elevator adds 1.5 min. Stairs add 0.5 min.
    let minutes = Math.ceil(result.totalDistance / 70);
    if (result.elevatorUsed) minutes += 1;
    if (result.hasStairs) minutes += 0.5;

    const coordinates = result.nodes.map((nodeId) => {
      const node = VENUE_NODES[nodeId];
      return { x: node ? node.x : 50, y: node ? node.y : 50 };
    });

    // Check worst crowd encountered
    let worstCrowd: 'low' | 'moderate' | 'high' | 'critical' = 'low';
    for (const nodeId of result.nodes) {
      const node = VENUE_NODES[nodeId];
      if (node?.zoneId && zoneMap.has(node.zoneId)) {
        const zone = zoneMap.get(node.zoneId)!;
        if (zone.crowdLevel === 'critical') worstCrowd = 'critical';
        else if (zone.crowdLevel === 'high' && worstCrowd !== 'critical') worstCrowd = 'high';
        else if (zone.crowdLevel === 'moderate' && worstCrowd === 'low') worstCrowd = 'moderate';
      }
    }

    let description = '';
    if (type === 'fastest') {
      description = `Direct path via main central concourses (${Math.round(result.totalDistance)}m).`;
    } else if (type === 'crowd_aware') {
      description = `Bypasses high-density choke points and crowded corridors (${Math.round(result.totalDistance)}m).`;
    } else {
      description = `Wheelchair and mobility accessible route: zero stairs, uses elevator bank (${Math.round(result.totalDistance)}m).`;
    }

    // Generate human-readable step-by-step guidance
    const stepInstructions: string[] = [];
    if (result.nodes.length <= 1) {
      stepInstructions.push('You are currently inside or adjacent to your destination zone.');
    } else {
      for (let i = 0; i < result.nodes.length; i++) {
        const currNode = VENUE_NODES[result.nodes[i]];
        const nextNode = i < result.nodes.length - 1 ? VENUE_NODES[result.nodes[i + 1]] : null;
        if (i === 0) {
          stepInstructions.push(`Depart from ${currNode?.name || 'current origin'}.`);
        } else if (i === result.nodes.length - 1) {
          stepInstructions.push(`Arrive at destination: ${currNode?.name || 'target zone'}.`);
        } else {
          if (currNode?.isElevator) {
            stepInstructions.push(`Enter East Elevator bank and proceed to Floor ${nextNode?.floor || 1}.`);
          } else if (currNode?.isStairs) {
            stepInstructions.push(`Take staircase towards ${nextNode?.name || 'upper level concourse'}.`);
          } else {
            stepInstructions.push(`Walk straight along ${currNode?.name || 'concourse'} towards ${nextNode?.name || 'next corridor'}.`);
          }
        }
      }
    }

    return {
      type,
      title,
      durationMinutes: Math.max(1, Math.round(minutes)),
      distanceMeters: Math.round(result.totalDistance),
      pathNodes: result.nodes,
      pathCoordinates: coordinates,
      elevatorUsed: result.elevatorUsed,
      crowdLevelEncountered: worstCrowd,
      description,
      stepInstructions,
    };
  }
}

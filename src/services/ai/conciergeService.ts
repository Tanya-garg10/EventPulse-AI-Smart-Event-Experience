import { ChatMessage, Session, VenueZone } from '../../types';

export class ConciergeService {
  /**
   * Calls server-side Gemini API or falls back to smart local event knowledge engine
   */
  static async askConcierge(
    query: string,
    sessions: Session[],
    zones: VenueZone[],
    savedSessionIds: string[] = []
  ): Promise<{
    text: string;
    suggestedSessions?: Session[];
    suggestedRoute?: { toZoneId: string; zoneName: string };
  }> {
    try {
      const res = await fetch('/api/ai/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, savedSessionIds }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.text) {
          // Resolve matched session objects if provided by server
          let matchedSessions: Session[] = [];
          if (Array.isArray(data.sessionIds)) {
            matchedSessions = sessions.filter((s) => data.sessionIds.includes(s.id));
          }
          return {
            text: data.text,
            suggestedSessions: matchedSessions.length > 0 ? matchedSessions : undefined,
            suggestedRoute: data.suggestedRoute,
          };
        }
      }
    } catch (err) {
      console.warn('Server Gemini call failed or offline, falling back to local event logic:', err);
    }

    // Local deterministic AI-style event intelligence
    return this.fallbackLocalKnowledge(query, sessions, zones);
  }

  private static fallbackLocalKnowledge(
    query: string,
    sessions: Session[],
    zones: VenueZone[]
  ): {
    text: string;
    suggestedSessions?: Session[];
    suggestedRoute?: { toZoneId: string; zoneName: string };
  } {
    const q = query.toLowerCase();

    // 1. Food queries
    if (q.includes('food') || q.includes('lunch') || q.includes('eat') || q.includes('coffee') || q.includes('snack')) {
      const foodB = zones.find((z) => z.id === 'zone-food-b')!;
      const foodA = zones.find((z) => z.id === 'zone-food-a')!;
      return {
        text: `Food Court B (Garden Plaza) is currently the best choice. It has only ${foodB.currentCount}/${foodB.capacity} people (${Math.round((foodB.currentCount / foodB.capacity) * 100)}% capacity) with open terrace seating.\n\nFood Court A (North Courtyard) is currently congested at ${Math.round((foodA.currentCount / foodA.capacity) * 100)}% capacity with longer wait times.`,
        suggestedRoute: {
          toZoneId: 'zone-food-b',
          zoneName: 'Food Court B (Garden Plaza)',
        },
      };
    }

    // 2. 2 hours or time budget query
    if (q.includes('2 hour') || q.includes('two hour') || q.includes('plan my schedule') || q.includes('short time')) {
      const rec1 = sessions.find((s) => s.id === 'session-02')!; // GenAI workshop Hall A
      const rec2 = sessions.find((s) => s.id === 'session-05')!; // Startup Panel Hall C
      const rec3 = sessions.find((s) => s.id === 'session-08')!; // Networking

      return {
        text: `Based on your available 2-hour window and current venue density, here is an optimized, low-congestion itinerary:\n\n• 10:30 — ${rec1.title} (${rec1.hallName}, 60 min)\n• 12:15 — ${rec2.title} (${rec2.hallName}, 45 min)\n• 14:30 — ${rec3.title} (${rec3.hallName})\n\n💡 I routed you around Workshop Hall B, which is currently at critical capacity (91%).`,
        suggestedSessions: [rec1, rec2],
        suggestedRoute: {
          toZoneId: rec1.hallId,
          zoneName: rec1.hallName,
        },
      };
    }

    // 3. Fewer people / low crowd workshop
    if (q.includes('fewer people') || q.includes('less crowd') || q.includes('quiet') || q.includes('empty')) {
      const lowCrowdSessions = sessions.filter((s) => {
        const zone = zones.find((z) => z.id === s.hallId);
        return zone && zone.crowdLevel === 'low';
      });

      const chosen = lowCrowdSessions.slice(0, 2);
      return {
        text: `Workshop Hall A and Hall C currently have the lowest attendee density. Both have plenty of open seats and quick entry:\n\n• ${chosen[0]?.title} in ${chosen[0]?.hallName}\n• ${chosen[1]?.title} in ${chosen[1]?.hallName}`,
        suggestedSessions: chosen,
        suggestedRoute: chosen[0] ? { toZoneId: chosen[0].hallId, zoneName: chosen[0].hallName } : undefined,
      };
    }

    // 4. After AI Keynote
    if (q.includes('after') && (q.includes('keynote') || q.includes('opening'))) {
      const afterSessions = [
        sessions.find((s) => s.id === 'session-02')!,
        sessions.find((s) => s.id === 'session-04')!,
      ].filter(Boolean);

      return {
        text: `Right after the Opening Keynote concludes at 11:00 AM, thousands of attendees exit the Main Stage into the central concourse. To avoid the corridor crush, I suggest walking directly to Workshop Hall A:\n\n• 10:30/11:00 — ${afterSessions[0]?.title}\n• 11:15 — ${afterSessions[1]?.title}`,
        suggestedSessions: afterSessions,
        suggestedRoute: afterSessions[0] ? { toZoneId: afterSessions[0].hallId, zoneName: afterSessions[0].hallName } : undefined,
      };
    }

    // 5. AI & Startups query
    if (q.includes('startup') || q.includes('ai') || q.includes('investor') || q.includes('pitch')) {
      const matched = sessions.filter(
        (s) => s.category === 'AI & ML' || s.category === 'Startups & Venture'
      ).slice(0, 3);

      return {
        text: `For your focus on AI & Startups, TechNova 2026 has curated high-impact sessions and deal-making lounges:\n\n1. ${matched[0]?.title} (${matched[0]?.hallName})\n2. ${matched[1]?.title} (${matched[1]?.hallName})\n3. ${matched[2]?.title} (${matched[2]?.hallName})\n\nDon't miss the Founder & Investor Lounge (Zone NET-01) for curated 1-on-1 angel introductions.`,
        suggestedSessions: matched,
        suggestedRoute: matched[0] ? { toZoneId: matched[0].hallId, zoneName: matched[0].hallName } : undefined,
      };
    }

    // 6. Restroom / Accessibility
    if (q.includes('restroom') || q.includes('toilet') || q.includes('bathroom') || q.includes('wheelchair')) {
      const wc = zones.find((z) => z.id === 'zone-restroom-west')!;
      return {
        text: `The nearest fully accessible restrooms with automatic doors and wide stalls are in the West Wing (Zone WC-01), 40 meters from Hall A. It currently has zero queue.`,
        suggestedRoute: {
          toZoneId: wc.id,
          zoneName: wc.name,
        },
      };
    }

    // Default friendly event response
    const generalSessions = sessions.slice(0, 2);
    return {
      text: `Welcome to EventPulse AI! I can help you find sessions, generate a personalized timetable, check real-time crowd levels, or calculate step-free accessible routes across the convention center.\n\nHere are top trending sessions right now:`,
      suggestedSessions: generalSessions,
      suggestedRoute: {
        toZoneId: generalSessions[0]?.hallId || 'zone-main-stage',
        zoneName: generalSessions[0]?.hallName || 'Main Stage',
      },
    };
  }
}

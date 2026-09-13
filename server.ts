import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { INITIAL_SESSIONS, INITIAL_ZONES, INITIAL_ANNOUNCEMENTS } from './src/data/eventData';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory state for event operations
let eventSessions = [...INITIAL_SESSIONS];
let eventZones = [...INITIAL_ZONES];
let eventAnnouncements = [...INITIAL_ANNOUNCEMENTS];

// Lazy Gemini SDK client initialization
let genAiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  if (!genAiClient) {
    genAiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAiClient;
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    event: 'EventPulse OS',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// Event State endpoint
app.get('/api/events/state', (req, res) => {
  res.json({
    sessions: eventSessions,
    zones: eventZones,
    announcements: eventAnnouncements,
  });
});

// Update session location or details (Organizer action)
app.post('/api/events/sessions/update', (req, res) => {
  const { sessionId, hallId, hallName, startTime, endTime, capacity } = req.body;
  const sessionIndex = eventSessions.findIndex((s) => s.id === sessionId);

  if (sessionIndex === -1) {
    res.status(404).json({ error: 'Session not found' });
    return;
  }

  const existing = eventSessions[sessionIndex];
  const oldHall = existing.hallName;

  const isLocationChanged = hallName && hallName !== oldHall;

  eventSessions[sessionIndex] = {
    ...existing,
    hallId: hallId || existing.hallId,
    hallName: hallName || existing.hallName,
    startTime: startTime || existing.startTime,
    endTime: endTime || existing.endTime,
    capacity: capacity ? Number(capacity) : existing.capacity,
    isLocationChanged: isLocationChanged || existing.isLocationChanged,
    originalHallName: existing.originalHallName || oldHall,
  };

  // If location changed, automatically broadcast an important announcement
  if (isLocationChanged) {
    const newAnnouncement = {
      id: `ann-${Date.now()}`,
      title: `Location Change: ${existing.title}`,
      message: `Attention: "${existing.title}" has been moved from ${oldHall} to ${hallName}. Please check the map for updated crowd-aware routes.`,
      priority: 'important' as const,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      targetAudience: 'All Attendees' as const,
      read: false,
      relatedSessionId: existing.id,
      relatedZoneId: hallId,
    };
    eventAnnouncements.unshift(newAnnouncement);
  }

  res.json({ session: eventSessions[sessionIndex], announcements: eventAnnouncements });
});

// Broadcast Announcement (Organizer action)
app.post('/api/events/announcements', (req, res) => {
  const { title, message, priority, targetAudience } = req.body;
  if (!title || !message) {
    res.status(400).json({ error: 'Title and message are required' });
    return;
  }

  const newAnn = {
    id: `ann-${Date.now()}`,
    title,
    message,
    priority: (priority || 'normal') as 'normal' | 'important' | 'emergency',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    targetAudience: targetAudience || 'All Attendees',
    read: false,
  };

  eventAnnouncements.unshift(newAnn);
  res.json({ success: true, announcement: newAnn, total: eventAnnouncements.length });
});

// Update Zone Crowd (Simulate or manual)
app.post('/api/events/crowd/update', (req, res) => {
  const { zoneId, newCount } = req.body;
  const zIdx = eventZones.findIndex((z) => z.id === zoneId);
  if (zIdx === -1) {
    res.status(404).json({ error: 'Zone not found' });
    return;
  }

  const zone = eventZones[zIdx];
  const count = Number(newCount);
  const ratio = count / zone.capacity;
  const crowdLevel = ratio >= 0.9 ? 'critical' : ratio >= 0.75 ? 'high' : ratio >= 0.5 ? 'moderate' : 'low';
  const trend = count > zone.currentCount ? 'increasing' : count < zone.currentCount ? 'decreasing' : 'stable';

  eventZones[zIdx] = {
    ...zone,
    currentCount: count,
    crowdLevel,
    trend,
  };

  res.json({ zone: eventZones[zIdx] });
});

// Conversational AI Concierge (Gemini 3.8 Flash)
app.post('/api/ai/concierge', async (req, res) => {
  const { query, savedSessionIds } = req.body;
  if (!query || typeof query !== 'string') {
    res.status(400).json({ error: 'Query string is required' });
    return;
  }

  const ai = getGeminiClient();
  if (!ai) {
    // If no API key is provided, return flag to let client use intelligent local model
    res.status(200).json({ fallback: true });
    return;
  }

  try {
    const sessionSummaries = eventSessions
      .map(
        (s) =>
          `ID: ${s.id} | "${s.title}" | Speaker: ${s.speaker} (${s.speakerCompany}) | Hall: ${s.hallName} (ID: ${s.hallId}) | Time: ${s.startTime}-${s.endTime} | Category: ${s.category} | Tags: ${s.tags.join(', ')}`
      )
      .join('\n');

    const zoneSummaries = eventZones
      .map(
        (z) =>
          `ID: ${z.id} | Name: ${z.name} | Capacity: ${z.capacity} | Current: ${z.currentCount} (${Math.round((z.currentCount / z.capacity) * 100)}%) | Crowd Level: ${z.crowdLevel} | Accessibility: ${z.isAccessible ? 'Wheelchair Accessible' : 'Has Stairs'}`
      )
      .join('\n');

    const systemInstruction = `You are EventPulse AI, an intelligent event concierge and real-time operating system for the "EventPulse OS" platform.
Your job is to provide concise, friendly, extremely helpful, event-specific recommendations and directions to attendees.
Always consider current crowd levels: avoid recommending crowded or critical zones (e.g. Workshop Hall B if high) unless specifically requested.

Available Sessions:
${sessionSummaries}

Available Venue Zones & Real-time Crowd Levels:
${zoneSummaries}

User Query: "${query}"

Instructions:
1. Provide a direct, actionable answer with 1-3 bullet points.
2. If suggesting sessions, mention exact times, speaker, and hall name.
3. If recommending directions or food, mention the zone name and current crowd comfort (e.g. recommend Food Court B because Food Court A is crowded).
4. At the very end of your response, output a single JSON block on a new line formatted strictly as:
\`\`\`json
{
  "sessionIds": ["session-02", "session-05"],
  "suggestedRoute": { "toZoneId": "zone-hall-a", "zoneName": "Workshop Hall A" }
}
\`\`\`
If no specific session or route applies, put empty array for sessionIds and null for suggestedRoute.`;

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: query,
        config: {
          systemInstruction,
          temperature: 0.3,
        },
      });
    } catch (primaryErr: any) {
      // If 503 unavailable / high demand, immediately retry with 'gemini-3.1-flash-lite'
      const isTemporaryDemand =
        primaryErr?.status === 503 ||
        primaryErr?.code === 503 ||
        (typeof primaryErr?.message === 'string' && primaryErr.message.includes('high demand'));

      if (isTemporaryDemand) {
        console.warn('Primary model gemini-3.8-flash experienced high demand (503). Retrying with gemini-3.1-flash-lite...');
        response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: query,
          config: {
            systemInstruction,
            temperature: 0.3,
          },
        });
      } else {
        throw primaryErr;
      }
    }

    const rawText = response?.text || '';
    
    // Extract optional JSON block at the bottom
    let sessionIds: string[] = [];
    let suggestedRoute: { toZoneId: string; zoneName: string } | null = null;
    let cleanText = rawText;

    const jsonMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        if (Array.isArray(parsed.sessionIds)) sessionIds = parsed.sessionIds;
        if (parsed.suggestedRoute?.toZoneId) suggestedRoute = parsed.suggestedRoute;
        cleanText = rawText.replace(/```json[\s\S]*?```/, '').trim();
      } catch {
        // ignore parse error
      }
    }

    res.json({
      text: cleanText,
      sessionIds,
      suggestedRoute,
    });
  } catch (error: any) {
    console.error('Gemini API error in /api/ai/concierge:', error);
    res.status(200).json({ fallback: true, error: error?.message });
  }
});

// Emergency SOS dispatch log
app.post('/api/events/emergency/dispatch', (req, res) => {
  const { incidentType, attendeeLocation, coordinates } = req.body;
  
  // Create high-priority emergency announcement for organizers
  const emergencyAnn = {
    id: `sos-${Date.now()}`,
    title: `EMERGENCY SOS: ${incidentType?.toUpperCase() || 'ASSISTANCE'}`,
    message: `Attendee SOS triggered near ${attendeeLocation || 'General Concourse'}. Medical & Security units have been notified.`,
    priority: 'emergency' as const,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    targetAudience: 'All Attendees' as const,
    read: false,
  };
  eventAnnouncements.unshift(emergencyAnn);

  res.json({
    success: true,
    dispatchId: `DISP-${Math.floor(100000 + Math.random() * 900000)}`,
    assignedUnit: incidentType === 'medical' ? 'First Aid Paramedic Unit 1' : 'Security Patrol Alpha',
    estimatedETASeconds: 90,
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EventPulse AI Server running on port ${PORT}`);
  });
}

startServer();

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { EventProvider, useEvent } from './EventContext';
import { INITIAL_SESSIONS, INITIAL_ZONES, INITIAL_ANNOUNCEMENTS } from '../data/eventData';

describe('EventContext', () => {
  it('should provide initial state', () => {
    const { result } = renderHook(() => useEvent(), {
      wrapper: EventProvider,
    });

    expect(result.current.sessions).toEqual(INITIAL_SESSIONS);
    expect(result.current.zones).toEqual(INITIAL_ZONES);
    expect(result.current.announcements).toEqual(INITIAL_ANNOUNCEMENTS);
  });

  it('should toggle active view', () => {
    const { result } = renderHook(() => useEvent(), {
      wrapper: EventProvider,
    });

    expect(result.current.activeView).toBe('landing');

    act(() => {
      result.current.setActiveView('home');
    });

    expect(result.current.activeView).toBe('home');
  });

  it('should toggle session save', () => {
    const { result } = renderHook(() => useEvent(), {
      wrapper: EventProvider,
    });

    const sessionId = 'session-99'; // Use a session ID that doesn't exist in initial state
    expect(result.current.savedSessionIds).not.toContain(sessionId);

    act(() => {
      result.current.toggleSaveSession(sessionId);
    });

    expect(result.current.savedSessionIds).toContain(sessionId);

    act(() => {
      result.current.toggleSaveSession(sessionId);
    });

    expect(result.current.savedSessionIds).not.toContain(sessionId);
  });

  it('should mark announcement as read', () => {
    const { result } = renderHook(() => useEvent(), {
      wrapper: EventProvider,
    });

    const announcementId = INITIAL_ANNOUNCEMENTS[0].id;
    expect(result.current.announcements[0].read).toBe(false);

    act(() => {
      result.current.markAnnouncementAsRead(announcementId);
    });

    const updatedAnnouncement = result.current.announcements.find(a => a.id === announcementId);
    expect(updatedAnnouncement?.read).toBe(true);
  });

  it('should switch user roles', () => {
    const { result } = renderHook(() => useEvent(), {
      wrapper: EventProvider,
    });

    expect(result.current.currentRole).toBe('attendee');

    act(() => {
      result.current.setCurrentRole('organizer');
    });

    expect(result.current.currentRole).toBe('organizer');
  });

  it('should handle search query', () => {
    const { result } = renderHook(() => useEvent(), {
      wrapper: EventProvider,
    });

    expect(result.current.searchQuery).toBe('');

    act(() => {
      result.current.setSearchQuery('AI sessions');
    });

    expect(result.current.searchQuery).toBe('AI sessions');
  });

  it('should toggle assistance mode', () => {
    const { result } = renderHook(() => useEvent(), {
      wrapper: EventProvider,
    });

    expect(result.current.assistanceModeActive).toBe(false);

    act(() => {
      result.current.setAssistanceModeActive(true);
    });

    expect(result.current.assistanceModeActive).toBe(true);
  });
});
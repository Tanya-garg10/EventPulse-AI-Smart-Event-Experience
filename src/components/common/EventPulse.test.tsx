import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EventPulse } from './EventPulse';
import { EventProvider } from '../../context/EventContext';

describe('EventPulse Component', () => {
  it('should render without crashing', () => {
    render(
      <EventProvider>
        <EventPulse />
      </EventProvider>
    );
    expect(screen.getByText(/EVENT PULSE/i)).toBeInTheDocument();
  });

  it('should display attendee count', () => {
    render(
      <EventProvider>
        <EventPulse />
      </EventProvider>
    );
    expect(screen.getByText(/ATTENDEES/i)).toBeInTheDocument();
  });
});
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from './Header';
import { EventProvider } from '../../context/EventContext';

describe('Header Component', () => {
  it('should render without crashing', () => {
    render(
      <EventProvider>
        <Header />
      </EventProvider>
    );
    expect(screen.getByText(/event pulse/i)).toBeInTheDocument();
  });

  it('should display navigation items', () => {
    render(
      <EventProvider>
        <Header />
      </EventProvider>
    );
    
    expect(screen.getByText(/living map/i)).toBeInTheDocument();
    expect(screen.getByText(/pulse ai/i)).toBeInTheDocument();
    expect(screen.getByText(/timetable/i)).toBeInTheDocument();
  });
});
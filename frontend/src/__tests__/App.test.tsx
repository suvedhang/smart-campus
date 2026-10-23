import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

describe('App', () => {
  it('renders the sidebar brand', () => {
    render(<App />);
    expect(screen.getByText('Smart Campus')).toBeInTheDocument();
    expect(screen.getByText('Digital Twin')).toBeInTheDocument();
  });

  it('renders all navigation items', () => {
    render(<App />);
    const navLabels = [
      'Dashboard',
      'Buildings',
      'Energy',
      'Occupancy',
      'Infrastructure',
      'Transportation',
      'Alerts',
    ];
    navLabels.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('shows the dashboard page by default', () => {
    render(<App />);
    // The dashboard nav button should have the active styling class
    const dashboardBtn = screen.getByText('Dashboard').closest('button');
    expect(dashboardBtn).toHaveClass('bg-campus-600');
  });
});

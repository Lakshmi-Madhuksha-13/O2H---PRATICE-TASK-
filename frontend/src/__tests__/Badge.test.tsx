import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { Badge } from '../components/ui';

describe('Badge Component Tests', () => {
  test('renders badge text value correctly', () => {
    render(<Badge type="status" value="Completed" />);
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  test('applies correct styling for Completed status', () => {
    render(<Badge type="status" value="Completed" />);
    const badgeElement = screen.getByText('Completed');
    expect(badgeElement.className).toContain('text-emerald-400');
  });

  test('applies correct styling for In Progress status', () => {
    render(<Badge type="status" value="In Progress" />);
    const badgeElement = screen.getByText('In Progress');
    expect(badgeElement.className).toContain('text-sky-400');
  });

  test('applies correct styling for High priority', () => {
    render(<Badge type="priority" value="High" />);
    const badgeElement = screen.getByText('High');
    expect(badgeElement.className).toContain('text-rose-400');
  });

  test('applies correct styling for Low priority', () => {
    render(<Badge type="priority" value="Low" />);
    const badgeElement = screen.getByText('Low');
    expect(badgeElement.className).toContain('text-slate-400');
  });
});

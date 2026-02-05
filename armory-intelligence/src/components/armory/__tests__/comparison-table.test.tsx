/**
 * @file comparison-table.test.tsx
 * @description Tests for ComparisonTable component
 */

import { render, screen } from '@testing-library/react';
import { ComparisonTable } from '@/components/armory/comparison-table';

const mockFirearms = [
  {
    id: '1',
    name: 'Glock 19',
    manufacturer: 'Glock',
    type: 'Handgun',
    caliber: '9mm',
    capacity: 15,
    weight: 23.65,
    barrelLength: 4.02,
    action: 'Semi-Automatic',
    price: 599.99,
    overallLength: 7.36,
    yearIntroduced: 1988,
    era: 'Modern',
  },
  {
    id: '2',
    name: 'Sig P320',
    manufacturer: 'Sig Sauer',
    type: 'Handgun',
    caliber: '9mm',
    capacity: 17,
    weight: 25.6,
    barrelLength: 4.7,
    action: 'Semi-Automatic',
    price: 649.99,
    overallLength: 8.0,
    yearIntroduced: 2014,
    era: 'Modern',
  },
];

describe('ComparisonTable Component', () => {
  it('renders comparison table with multiple firearms', () => {
    render(<ComparisonTable firearms={mockFirearms} />);
    expect(screen.getByText('Glock 19')).toBeInTheDocument();
    expect(screen.getByText('Sig P320')).toBeInTheDocument();
  });

  it('displays all comparison fields', () => {
    render(<ComparisonTable firearms={mockFirearms} />);
    expect(screen.getByText(/Type/i)).toBeInTheDocument();
    expect(screen.getByText(/Caliber/i)).toBeInTheDocument();
    expect(screen.getByText(/Capacity/i)).toBeInTheDocument();
  });

  it('shows differences in specifications', () => {
    render(<ComparisonTable firearms={mockFirearms} />);
    // Looking for capacity values in the rendered table
    expect(screen.getByText('Capacity')).toBeInTheDocument();
    expect(screen.getByText(/15/)).toBeInTheDocument(); // Glock capacity
    expect(screen.getByText(/17/)).toBeInTheDocument(); // Sig capacity
  });

  it('handles single firearm', () => {
    render(<ComparisonTable firearms={[mockFirearms[0]]} />);
    // Single firearm shows message requiring at least 2 firearms
    expect(screen.getByText(/Need at least 2 firearms to compare/i)).toBeInTheDocument();
  });

  it('renders empty state when no firearms provided', () => {
    render(<ComparisonTable firearms={[]} />);
    expect(screen.getByText(/No firearms to compare/i)).toBeInTheDocument();
  });
});

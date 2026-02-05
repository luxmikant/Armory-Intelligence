/**
 * @file firearm-card.test.tsx
 * @description Tests for FirearmCard component
 */

import { render, screen } from '@testing-library/react';
import { FirearmCard } from '@/components/armory/firearm-card';

const mockFirearm = {
  id: '1',
  name: 'Glock 19',
  manufacturer: 'Glock',
  type: 'Handgun',
  caliber: '9mm',
  capacity: 15,
  weight: 23.65,
  barrelLength: 4.02,
  overallLength: 7.36,
  action: 'Semi-Automatic',
  price: 599.99,
  image: '/images/glock-19.jpg',
  era: 'Modern (1980-Present)',
  yearIntroduced: 1988,
  description: 'Compact and reliable striker-fired pistol',
};

describe('FirearmCard Component', () => {
  it('renders firearm name correctly', () => {
    render(<FirearmCard {...mockFirearm} />);
    expect(screen.getByText('Glock 19')).toBeInTheDocument();
  });

  it('displays manufacturer and type', () => {
    render(<FirearmCard {...mockFirearm} />);
    expect(screen.getAllByText(/Glock/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Handgun/i)).toBeInTheDocument();
  });

  it('shows caliber information', () => {
    render(<FirearmCard {...mockFirearm} />);
    expect(screen.getByText(/9mm/i)).toBeInTheDocument();
  });

  it('displays price when provided', () => {
    render(<FirearmCard {...mockFirearm} />);
    expect(screen.getByText(/599\.99/)).toBeInTheDocument();
  });

  it('renders without image if not provided', () => {
    const firearmWithoutImage = { ...mockFirearm, image: undefined };
    const { container } = render(<FirearmCard {...firearmWithoutImage} />);
    expect(container).toBeInTheDocument();
  });

  it('matches snapshot for consistent rendering', () => {
    const { container } = render(<FirearmCard {...mockFirearm} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});

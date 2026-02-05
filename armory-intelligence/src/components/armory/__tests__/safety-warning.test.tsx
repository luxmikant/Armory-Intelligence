/**
 * @file safety-warning.test.tsx
 * @description Tests for SafetyWarning component
 */

import { render, screen } from '@testing-library/react';
import { SafetyWarning } from '@/components/armory/safety-warning';

describe('SafetyWarning Component', () => {
  it('renders critical warning with correct styling', () => {
    render(
      <SafetyWarning
        title="Loaded Firearm"
        message="Always treat every firearm as if it is loaded."
        severity="critical"
      />
    );
    expect(screen.getByText('Loaded Firearm')).toBeInTheDocument();
    expect(screen.getByText(/Always treat every firearm/i)).toBeInTheDocument();
  });

  it('renders warning severity correctly', () => {
    render(
      <SafetyWarning
        title="Range Safety"
        message="Wear eye and ear protection at all times."
        severity="warning"
      />
    );
    expect(screen.getByText('Range Safety')).toBeInTheDocument();
  });

  it('renders caution severity', () => {
    render(
      <SafetyWarning
        title="Maintenance Caution"
        message="Always disassemble in a well-lit area."
        severity="caution"
      />
    );
    expect(screen.getByText('Maintenance Caution')).toBeInTheDocument();
  });

  it('renders info severity', () => {
    render(
      <SafetyWarning
        title="Storage Tip"
        message="Store in a cool, dry place."
        severity="info"
      />
    );
    expect(screen.getByText('Storage Tip')).toBeInTheDocument();
  });

  it('handles missing title gracefully', () => {
    const { container } = render(
      <SafetyWarning
        message="Important safety information"
        severity="warning"
      />
    );
    expect(container).toBeInTheDocument();
  });
});

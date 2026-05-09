import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UsageBar } from './UsageBar';

describe('<UsageBar />', () => {
  it('exposes the percentage to assistive tech via aria-valuenow', () => {
    render(<UsageBar used={2_500} entitled={10_000} label="Calls" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '25');
  });

  it('drops aria-valuenow for unmetered (unlimited) entitlements', () => {
    render(<UsageBar used={500} entitled={null} label="Storage" />);
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow');
  });

  it('caps at 100% when usage exceeds the entitlement', () => {
    render(<UsageBar used={20_000} entitled={10_000} label="Calls" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });
});

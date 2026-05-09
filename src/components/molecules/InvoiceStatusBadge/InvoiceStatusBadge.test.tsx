import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InvoiceStatusBadge } from './InvoiceStatusBadge';

describe('<InvoiceStatusBadge />', () => {
  it('shows the humanised label for "paid"', () => {
    render(<InvoiceStatusBadge status="paid" />);
    expect(screen.getByText('Paid')).toBeInTheDocument();
  });

  it('humanises snake_case statuses', () => {
    render(<InvoiceStatusBadge status="past_due" />);
    expect(screen.getByText('Past Due')).toBeInTheDocument();
  });

  it('hides the icon when hideIcon is true', () => {
    const { container } = render(<InvoiceStatusBadge status="paid" hideIcon />);
    expect(container.querySelector('svg')).toBeNull();
  });
});

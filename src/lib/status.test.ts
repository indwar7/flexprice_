import { describe, expect, it } from 'vitest';
import {
  invoiceStatusToLabel,
  planStatusToLabel,
  subscriptionStatusToLabel,
} from './status';

describe('invoiceStatusToLabel', () => {
  it('maps paid to a success tone', () => {
    expect(invoiceStatusToLabel('paid')).toEqual({ label: 'Paid', tone: 'success' });
  });

  it('maps past_due to warning and humanises the label', () => {
    expect(invoiceStatusToLabel('past_due')).toEqual({ label: 'Past Due', tone: 'warning' });
  });

  it('maps uncollectible to danger', () => {
    expect(invoiceStatusToLabel('uncollectible').tone).toBe('danger');
  });

  it('maps draft to a muted tone', () => {
    expect(invoiceStatusToLabel('draft').tone).toBe('muted');
  });
});

describe('planStatusToLabel', () => {
  it('treats active plans as a success tone', () => {
    expect(planStatusToLabel('active').tone).toBe('success');
  });

  it('treats archived plans as muted', () => {
    expect(planStatusToLabel('archived').tone).toBe('muted');
  });
});

describe('subscriptionStatusToLabel', () => {
  it('maps trialing to info', () => {
    expect(subscriptionStatusToLabel('trialing').tone).toBe('info');
  });

  it('maps past_due to danger for subscriptions', () => {
    expect(subscriptionStatusToLabel('past_due').tone).toBe('danger');
  });
});

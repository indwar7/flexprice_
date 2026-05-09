export type InvoiceStatus = 'paid' | 'draft' | 'open' | 'void' | 'uncollectible' | 'past_due';
export type PlanStatus = 'active' | 'archived' | 'draft';
export type SubscriptionStatus = 'active' | 'trialing' | 'paused' | 'canceled' | 'past_due';

export type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'muted';

const INVOICE_TONE: Record<InvoiceStatus, StatusTone> = {
  paid: 'success',
  draft: 'muted',
  open: 'info',
  void: 'muted',
  uncollectible: 'danger',
  past_due: 'warning',
};

const PLAN_TONE: Record<PlanStatus, StatusTone> = {
  active: 'success',
  archived: 'muted',
  draft: 'info',
};

const SUBSCRIPTION_TONE: Record<SubscriptionStatus, StatusTone> = {
  active: 'success',
  trialing: 'info',
  paused: 'warning',
  canceled: 'muted',
  past_due: 'danger',
};

/** Map an invoice status string to a label and tone. */
export function invoiceStatusToLabel(status: InvoiceStatus): {
  label: string;
  tone: StatusTone;
} {
  return { label: humanize(status), tone: INVOICE_TONE[status] };
}

export function planStatusToLabel(status: PlanStatus) {
  return { label: humanize(status), tone: PLAN_TONE[status] };
}

export function subscriptionStatusToLabel(status: SubscriptionStatus) {
  return { label: humanize(status), tone: SUBSCRIPTION_TONE[status] };
}

function humanize(s: string): string {
  return s
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

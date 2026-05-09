import type { InvoiceStatus } from '@/lib/status';

export interface MockCustomer {
  id: string;
  name: string;
  email: string;
  plan: string;
  mrrCents: number;
  status: 'active' | 'trialing' | 'paused' | 'canceled';
  createdAt: string;
}

export interface MockInvoice {
  id: string;
  number: string;
  customer: string;
  amountCents: number;
  currency: string;
  status: InvoiceStatus;
  dueDate: string;
}

const FIRST = ['Acme', 'Initech', 'Hooli', 'Stark', 'Wayne', 'Wonka', 'Globex', 'Soylent', 'Cyberdyne', 'Pied Piper'];
const LAST = ['Industries', 'Corp', 'Labs', 'Holdings', 'Group', 'Studio', 'Systems', 'Co', 'Inc', 'Ltd'];
const PLANS = ['Starter', 'Growth', 'Pro Annual', 'Enterprise', 'Pay as you go'];
const STATUSES: MockCustomer['status'][] = ['active', 'active', 'active', 'trialing', 'paused', 'canceled'];
const INV_STATUSES: InvoiceStatus[] = ['paid', 'paid', 'paid', 'open', 'past_due', 'draft', 'void'];

function seeded(n: number): () => number {
  let s = n;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function makeMockCustomers(count: number, seed = 1): MockCustomer[] {
  const rand = seeded(seed);
  return Array.from({ length: count }, (_, i) => {
    const name = `${FIRST[Math.floor(rand() * FIRST.length)]} ${LAST[Math.floor(rand() * LAST.length)]}`;
    return {
      id: `cus_${(i + 1).toString().padStart(6, '0')}`,
      name,
      email: `billing+${i + 1}@${name.toLowerCase().replace(/[^a-z]/g, '')}.com`,
      plan: PLANS[Math.floor(rand() * PLANS.length)],
      mrrCents: Math.floor(rand() * 50_000_00),
      status: STATUSES[Math.floor(rand() * STATUSES.length)],
      createdAt: new Date(2024, 0, 1 + Math.floor(rand() * 500)).toISOString(),
    };
  });
}

export function makeMockInvoices(count: number, seed = 2): MockInvoice[] {
  const rand = seeded(seed);
  return Array.from({ length: count }, (_, i) => {
    const customer = `${FIRST[Math.floor(rand() * FIRST.length)]} ${LAST[Math.floor(rand() * LAST.length)]}`;
    return {
      id: `in_${(i + 1).toString().padStart(6, '0')}`,
      number: `INV-${(2024_000 + i + 1).toString()}`,
      customer,
      amountCents: Math.floor(rand() * 250_000_00) + 1000,
      currency: 'USD',
      status: INV_STATUSES[Math.floor(rand() * INV_STATUSES.length)],
      dueDate: new Date(2025, 4, 1 + Math.floor(rand() * 60)).toISOString(),
    };
  });
}

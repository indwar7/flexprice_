import { CheckCircle2, Circle, FileText, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/atoms/Badge/Badge';
import { invoiceStatusToLabel, type InvoiceStatus } from '@/lib/status';

const ICON: Record<InvoiceStatus, typeof CheckCircle2> = {
  paid: CheckCircle2,
  draft: FileText,
  open: Circle,
  void: XCircle,
  uncollectible: AlertTriangle,
  past_due: Clock,
};

export interface InvoiceStatusBadgeProps {
  /** The invoice status string returned by the FlexPrice API. */
  status: InvoiceStatus;
  /** Hide the leading icon. */
  hideIcon?: boolean;
}

/**
 * Maps an invoice status string to a coloured chip with a matching icon.
 * Tone is derived from the semantic meaning (paid → success, past_due → warning, etc.).
 */
export function InvoiceStatusBadge({ status, hideIcon = false }: InvoiceStatusBadgeProps) {
  const { label, tone } = invoiceStatusToLabel(status);
  const Icon = ICON[status];
  return <Badge tone={tone} icon={hideIcon ? undefined : <Icon />}>{label}</Badge>;
}

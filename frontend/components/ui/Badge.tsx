import { cn } from "@/lib/utils";
import type { CampaignStatus, CallStatus, LeadStatus } from "@/types";

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "purple";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-gray-100 text-gray-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  danger: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
  purple: "bg-purple-100 text-purple-700",
};

export default function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// ─── Convenience status badge helpers ─────────────────────────────────────────

export function CampaignStatusBadge({ status }: { status: CampaignStatus }) {
  const map: Record<CampaignStatus, { label: string; variant: BadgeVariant }> = {
    draft: { label: "Draft", variant: "default" },
    active: { label: "Active", variant: "success" },
    paused: { label: "Paused", variant: "warning" },
    completed: { label: "Completed", variant: "info" },
  };
  const { label, variant } = map[status] ?? { label: status, variant: "default" };
  return <Badge variant={variant}>{label}</Badge>;
}

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  const map: Record<LeadStatus, { label: string; variant: BadgeVariant }> = {
    pending: { label: "Pending", variant: "default" },
    called: { label: "Called", variant: "info" },
    converted: { label: "Converted", variant: "success" },
    do_not_call: { label: "Do Not Call", variant: "danger" },
  };
  const { label, variant } = map[status] ?? { label: status, variant: "default" };
  return <Badge variant={variant}>{label}</Badge>;
}

export function CallStatusBadge({ status }: { status: CallStatus }) {
  const map: Record<CallStatus, { label: string; variant: BadgeVariant }> = {
    pending: { label: "Pending", variant: "default" },
    in_progress: { label: "In Progress", variant: "warning" },
    completed: { label: "Completed", variant: "success" },
    failed: { label: "Failed", variant: "danger" },
  };
  const { label, variant } = map[status] ?? { label: status, variant: "default" };
  return <Badge variant={variant}>{label}</Badge>;
}

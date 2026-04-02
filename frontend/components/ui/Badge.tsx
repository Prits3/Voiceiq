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
  default: "bg-white/8 text-slate-400 border border-white/10",
  success: "bg-green-500/10 text-green-400 border border-green-500/20",
  warning: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  danger:  "bg-red-500/10 text-red-400 border border-red-500/20",
  info:    "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
  purple:  "bg-violet-500/10 text-violet-400 border border-violet-500/20",
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

export function CampaignStatusBadge({ status }: { status: CampaignStatus }) {
  const map: Record<CampaignStatus, { label: string; variant: BadgeVariant }> = {
    draft:     { label: "Draft",     variant: "default" },
    active:    { label: "Active",    variant: "success" },
    paused:    { label: "Paused",    variant: "warning" },
    completed: { label: "Completed", variant: "info" },
  };
  const { label, variant } = map[status] ?? { label: status, variant: "default" };
  return <Badge variant={variant}>{label}</Badge>;
}

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  const map: Record<LeadStatus, { label: string; variant: BadgeVariant }> = {
    pending:     { label: "Pending",      variant: "default" },
    called:      { label: "Called",       variant: "info" },
    converted:   { label: "Converted",    variant: "success" },
    do_not_call: { label: "Do Not Call",  variant: "danger" },
  };
  const { label, variant } = map[status] ?? { label: status, variant: "default" };
  return <Badge variant={variant}>{label}</Badge>;
}

export function CallStatusBadge({ status }: { status: CallStatus }) {
  const map: Record<CallStatus, { label: string; variant: BadgeVariant }> = {
    pending:     { label: "Pending",     variant: "default" },
    in_progress: { label: "In Progress", variant: "warning" },
    completed:   { label: "Completed",   variant: "success" },
    failed:      { label: "Failed",      variant: "danger" },
  };
  const { label, variant } = map[status] ?? { label: status, variant: "default" };
  return <Badge variant={variant}>{label}</Badge>;
}

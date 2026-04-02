"use client";

import Table from "@/components/ui/Table";
import { LeadStatusBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatPhone, formatDate } from "@/lib/utils";
import type { Lead } from "@/types";

interface LeadTableProps {
  leads: Lead[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onDelete?: (lead: Lead) => void;
  onStatusChange?: (lead: Lead) => void;
}

export default function LeadTable({
  leads,
  isLoading = false,
  onRefresh,
  onDelete,
  onStatusChange,
}: LeadTableProps) {
  return (
    <Table
      keyExtractor={(row) => row.id as string | number}
      isLoading={isLoading}
      emptyMessage="No leads yet. Import a CSV or add leads manually."
      data={leads as unknown as Record<string, unknown>[]}
      columns={[
        {
          key: "name",
          header: "Name",
          render: (row) => {
            const lead = row as unknown as Lead;
            return (
              <span className="font-medium text-gray-900">
                {lead.first_name} {lead.last_name ?? ""}
              </span>
            );
          },
        },
        {
          key: "phone_number",
          header: "Phone",
          render: (row) => formatPhone((row as unknown as Lead).phone_number),
        },
        {
          key: "email",
          header: "Email",
          render: (row) => (row as unknown as Lead).email ?? "—",
        },
        {
          key: "status",
          header: "Status",
          render: (row) => <LeadStatusBadge status={(row as unknown as Lead).status} />,
        },
        {
          key: "created_at",
          header: "Added",
          render: (row) => formatDate((row as unknown as Lead).created_at),
        },
        ...(onDelete || onStatusChange
          ? [
              {
                key: "actions",
                header: "",
                render: (row: Record<string, unknown>) => {
                  const lead = row as unknown as Lead;
                  return (
                    <div className="flex items-center gap-2">
                      {onStatusChange && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onStatusChange(lead);
                          }}
                        >
                          Update
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(lead);
                          }}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  );
                },
              },
            ]
          : []),
      ]}
    />
  );
}

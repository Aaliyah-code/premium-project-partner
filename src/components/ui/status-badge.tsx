import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type StatusType = "Present" | "Absent" | "Approved" | "Denied" | "Pending";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusStyles: Record<StatusType, string> = {
  Present: "status-present",
  Absent: "status-absent",
  Approved: "status-approved",
  Denied: "status-denied",
  Pending: "status-pending",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium border",
        statusStyles[status],
        className
      )}
    >
      {status}
    </Badge>
  );
}

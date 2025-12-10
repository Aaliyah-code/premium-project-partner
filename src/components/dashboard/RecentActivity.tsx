import { useEmployees } from "@/contexts/EmployeeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { CalendarDays, UserCheck } from "lucide-react";

export function RecentActivity() {
  const { attendance } = useEmployees();

  // Get recent leave requests
  const recentLeaves = attendance
    .flatMap((emp) =>
      emp.leaveRequests.map((req) => ({
        name: emp.name,
        ...req,
      }))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <Card className="shadow-soft border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          Recent Leave Requests
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentLeaves.map((leave, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 transition-colors hover:bg-muted"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{leave.name}</p>
                  <p className="text-sm text-muted-foreground">{leave.reason}</p>
                </div>
              </div>
              <div className="text-right">
                <StatusBadge status={leave.status} />
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(leave.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

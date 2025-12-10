import { Employee } from "@/data/employees";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Edit, Trash2, Mail, Briefcase } from "lucide-react";

interface EmployeeCardProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (id: number) => void;
}

export function EmployeeCard({ employee, onEdit, onDelete }: EmployeeCardProps) {
  const initials = employee.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="group shadow-soft border-border/50 transition-all duration-300 hover:shadow-soft-lg hover:border-border animate-in">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground text-lg">
                {employee.name}
              </h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                <Briefcase className="h-3.5 w-3.5" />
                {employee.position}
              </p>
            </div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(employee)}
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(employee.employeeId)}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="font-medium">
              {employee.department}
            </Badge>
            <span className="text-sm font-semibold text-foreground">
              R{employee.salary.toLocaleString()}
            </span>
          </div>

          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Mail className="h-3.5 w-3.5" />
            {employee.contact}
          </p>

          <p className="text-xs text-muted-foreground border-t border-border pt-3 mt-3">
            {employee.employmentHistory}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

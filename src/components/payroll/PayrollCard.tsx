import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, TrendingUp, Wallet } from "lucide-react";
import { Employee, PayrollRecord } from "@/data/employees";
import { cn } from "@/lib/utils";

interface PayrollCardProps {
  employee: Employee;
  payroll: PayrollRecord;
  onViewPayslip: () => void;
  delay?: number;
}

export function PayrollCard({ employee, payroll, onViewPayslip, delay = 0 }: PayrollCardProps) {
  const efficiency = Math.round((payroll.hoursWorked / 176) * 100);
  
  return (
    <Card 
      className={cn(
        "group relative overflow-hidden border-border/50 shadow-soft transition-all duration-300",
        "hover:shadow-soft-lg hover:border-primary/20 hover:-translate-y-1",
        "animate-fade-in"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-primary/60" />
      
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-2 ring-primary/10">
                <span className="text-lg font-bold text-primary">
                  {employee.name.split(" ").map((n) => n[0]).join("")}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-success border-2 border-card" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {employee.name}
              </h3>
              <p className="text-sm text-muted-foreground">{employee.position}</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs font-medium">
            {employee.department}
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Hours Worked</span>
            </div>
            <p className="text-lg font-bold text-foreground">{payroll.hoursWorked}</p>
          </div>
          
          <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Efficiency</span>
            </div>
            <p className={cn(
              "text-lg font-bold",
              efficiency >= 90 ? "text-success" : efficiency >= 75 ? "text-warning" : "text-destructive"
            )}>
              {efficiency}%
            </p>
          </div>
        </div>

        {/* Salary Section */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Base Salary</span>
            <span className="text-sm font-medium text-foreground">R{employee.salary.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Leave Deductions</span>
            <span className="text-sm font-medium text-destructive">
              -{payroll.leaveDeductions} hrs
            </span>
          </div>
          <div className="border-t border-primary/10 pt-2 mt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-primary" />
                <span className="font-medium text-foreground">Final Salary</span>
              </div>
              <span className="text-xl font-bold text-primary">
                R{payroll.finalSalary.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          onClick={onViewPayslip}
          className="w-full gap-2 font-medium"
          variant="outline"
        >
          <FileText className="h-4 w-4" />
          View Payslip
        </Button>
      </CardContent>
    </Card>
  );
}

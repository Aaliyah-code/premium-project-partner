import { Employee, PayrollRecord } from "@/data/employees";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, Building2 } from "lucide-react";

interface PayslipModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  payroll: PayrollRecord | null;
}

export function PayslipModal({
  open,
  onOpenChange,
  employee,
  payroll,
}: PayslipModalProps) {
  if (!employee || !payroll) return null;

  const grossSalary = employee.salary;
  const deductions = grossSalary - payroll.finalSalary;
  const taxEstimate = Math.round(grossSalary * 0.18); // Estimated tax
  const uifContribution = Math.round(grossSalary * 0.01);
  const otherDeductions = deductions - taxEstimate - uifContribution;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Employee Payslip
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 print:p-8">
          {/* Company Header */}
          <div className="text-center pb-4 border-b border-border">
            <h2 className="text-2xl font-bold gradient-text">ModernTech Solutions</h2>
            <p className="text-sm text-muted-foreground">
              HR Management System - Payslip
            </p>
          </div>

          {/* Employee Details */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Employee Name</p>
              <p className="font-semibold">{employee.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Employee ID</p>
              <p className="font-semibold">#{employee.employeeId.toString().padStart(4, "0")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Department</p>
              <p className="font-semibold">{employee.department}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Position</p>
              <p className="font-semibold">{employee.position}</p>
            </div>
          </div>

          {/* Pay Period */}
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
            <p className="text-sm text-muted-foreground">Pay Period</p>
            <p className="font-semibold">December 2025</p>
            <p className="text-sm text-muted-foreground mt-2">Hours Worked</p>
            <p className="font-semibold">{payroll.hoursWorked} hours</p>
          </div>

          {/* Earnings */}
          <div>
            <h4 className="font-semibold mb-3">Earnings</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Basic Salary</span>
                <span className="font-medium">R{grossSalary.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Deductions */}
          <div>
            <h4 className="font-semibold mb-3">Deductions</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">PAYE Tax (Est.)</span>
                <span className="font-medium text-destructive">
                  -R{taxEstimate.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">UIF Contribution</span>
                <span className="font-medium text-destructive">
                  -R{uifContribution.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Leave Deductions ({payroll.leaveDeductions} hrs)
                </span>
                <span className="font-medium text-destructive">
                  -R{Math.max(0, otherDeductions).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Net Pay */}
          <div className="p-4 bg-success/10 rounded-lg border border-success/20">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Net Pay</span>
              <span className="text-2xl font-bold text-success">
                R{payroll.finalSalary.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 print:hidden">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button onClick={handlePrint} className="gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useEmployees } from "@/contexts/EmployeeContext";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PayslipModal } from "@/components/payroll/PayslipModal";
import { Search, FileText, TrendingUp, DollarSign, Clock } from "lucide-react";
import { Employee, PayrollRecord } from "@/data/employees";

export default function Payroll() {
  const { employees, payroll, getEmployeeById } = useEmployees();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollRecord | null>(null);
  const [payslipOpen, setPayslipOpen] = useState(false);

  // Combine employee and payroll data
  const payrollData = payroll.map((pay) => {
    const employee = getEmployeeById(pay.employeeId);
    return {
      ...pay,
      name: employee?.name || "Unknown",
      position: employee?.position || "",
      department: employee?.department || "",
      baseSalary: employee?.salary || 0,
    };
  });

  const filteredPayroll = payrollData.filter((record) =>
    record.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewPayslip = (record: typeof payrollData[0]) => {
    const employee = getEmployeeById(record.employeeId);
    const payrollRecord = payroll.find((p) => p.employeeId === record.employeeId);
    if (employee && payrollRecord) {
      setSelectedEmployee(employee);
      setSelectedPayroll(payrollRecord);
      setPayslipOpen(true);
    }
  };

  // Calculate summary stats
  const totalPayroll = payroll.reduce((acc, p) => acc + p.finalSalary, 0);
  const totalHours = payroll.reduce((acc, p) => acc + p.hoursWorked, 0);
  const avgSalary = totalPayroll / payroll.length;
  const totalDeductions = payroll.reduce((acc, p) => acc + p.leaveDeductions, 0);

  const columns = [
    {
      header: "Employee",
      accessor: (row: (typeof payrollData)[0]) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">
              {row.name.split(" ").map((n) => n[0]).join("")}
            </span>
          </div>
          <div>
            <p className="font-medium">{row.name}</p>
            <p className="text-sm text-muted-foreground">{row.position}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Department",
      accessor: "department" as keyof (typeof payrollData)[0],
    },
    {
      header: "Hours Worked",
      accessor: (row: (typeof payrollData)[0]) => (
        <span className="font-medium">{row.hoursWorked} hrs</span>
      ),
    },
    {
      header: "Leave Deductions",
      accessor: (row: (typeof payrollData)[0]) => (
        <span className="text-muted-foreground">{row.leaveDeductions} hrs</span>
      ),
    },
    {
      header: "Base Salary",
      accessor: (row: (typeof payrollData)[0]) => (
        <span className="text-muted-foreground">
          R{row.baseSalary.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Final Salary",
      accessor: (row: (typeof payrollData)[0]) => (
        <span className="font-semibold text-success">
          R{row.finalSalary.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: (row: (typeof payrollData)[0]) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            handleViewPayslip(row);
          }}
          className="gap-2"
        >
          <FileText className="h-4 w-4" />
          View Payslip
        </Button>
      ),
    },
  ];

  return (
    <MainLayout
      title="Payroll Management"
      subtitle="View and manage employee salaries and generate payslips"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="shadow-soft border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">R{(totalPayroll / 1000).toFixed(0)}K</p>
                <p className="text-sm text-muted-foreground">Total Payroll</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">R{avgSalary.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Average Salary</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalHours}</p>
                <p className="text-sm text-muted-foreground">Total Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalDeductions} hrs</p>
                <p className="text-sm text-muted-foreground">Total Deductions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Payroll Table */}
      <Card className="shadow-soft border-border/50">
        <CardHeader>
          <CardTitle>December 2025 Payroll</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredPayroll}
            columns={columns}
            onRowClick={handleViewPayslip}
          />
        </CardContent>
      </Card>

      {/* Payslip Modal */}
      <PayslipModal
        open={payslipOpen}
        onOpenChange={setPayslipOpen}
        employee={selectedEmployee}
        payroll={selectedPayroll}
      />
    </MainLayout>
  );
}

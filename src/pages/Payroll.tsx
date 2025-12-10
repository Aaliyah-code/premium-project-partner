import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useEmployees } from "@/contexts/EmployeeContext";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { PayslipModal } from "@/components/payroll/PayslipModal";
import { PayrollCard } from "@/components/payroll/PayrollCard";
import { Search, DollarSign, TrendingUp, Clock, Users } from "lucide-react";
import { Employee, PayrollRecord } from "@/data/employees";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Payroll() {
  const { employees, payroll, getEmployeeById } = useEmployees();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollRecord | null>(null);
  const [payslipOpen, setPayslipOpen] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState("all");

  // Get unique departments
  const departments = [...new Set(employees.map((e) => e.department))];

  // Combine employee and payroll data
  const payrollData = payroll.map((pay) => {
    const employee = getEmployeeById(pay.employeeId);
    return {
      payroll: pay,
      employee: employee!,
    };
  }).filter((item) => item.employee);

  const filteredPayroll = payrollData.filter((item) => {
    const matchesSearch = item.employee.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || item.employee.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const handleViewPayslip = (employee: Employee, payrollRecord: PayrollRecord) => {
    setSelectedEmployee(employee);
    setSelectedPayroll(payrollRecord);
    setPayslipOpen(true);
  };

  // Calculate summary stats
  const totalPayroll = payroll.reduce((acc, p) => acc + p.finalSalary, 0);
  const totalHours = payroll.reduce((acc, p) => acc + p.hoursWorked, 0);
  const avgSalary = totalPayroll / payroll.length;
  const totalEmployees = payroll.length;

  const summaryCards = [
    {
      title: "Total Payroll",
      value: `R${(totalPayroll / 1000).toFixed(0)}K`,
      subtitle: "This month",
      icon: DollarSign,
      gradient: "from-primary/20 to-primary/5",
      iconColor: "text-primary",
    },
    {
      title: "Average Salary",
      value: `R${avgSalary.toLocaleString()}`,
      subtitle: "Per employee",
      icon: TrendingUp,
      gradient: "from-success/20 to-success/5",
      iconColor: "text-success",
    },
    {
      title: "Total Hours",
      value: totalHours.toLocaleString(),
      subtitle: "Hours worked",
      icon: Clock,
      gradient: "from-warning/20 to-warning/5",
      iconColor: "text-warning",
    },
    {
      title: "Employees",
      value: totalEmployees,
      subtitle: "Active payroll",
      icon: Users,
      gradient: "from-accent/20 to-accent/5",
      iconColor: "text-accent",
    },
  ];

  return (
    <MainLayout
      title="Payroll Management"
      subtitle="View and manage employee salaries and generate payslips"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card, index) => (
          <Card 
            key={card.title} 
            className="border-border/50 shadow-soft overflow-hidden animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center`}>
                  <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{card.value}</p>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Payroll Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredPayroll.map((item, index) => (
          <PayrollCard
            key={item.employee.employeeId}
            employee={item.employee}
            payroll={item.payroll}
            onViewPayslip={() => handleViewPayslip(item.employee, item.payroll)}
            delay={index * 50}
          />
        ))}
      </div>

      {filteredPayroll.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No payroll records found</p>
        </div>
      )}

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

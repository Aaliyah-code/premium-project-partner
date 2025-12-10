import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/ui/stat-card";
import { DepartmentChart } from "@/components/dashboard/DepartmentChart";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { useEmployees } from "@/contexts/EmployeeContext";
import { Users, UserCheck, UserX, Wallet } from "lucide-react";

export default function Dashboard() {
  const { employees, attendance, payroll } = useEmployees();

  // Calculate stats
  const totalEmployees = employees.length;
  
  const todayAttendance = attendance.reduce((acc, emp) => {
    const today = emp.attendance.find(
      (a) => a.date === "2025-07-29"
    );
    if (today?.status === "Present") acc++;
    return acc;
  }, 0);

  const pendingLeaves = attendance.reduce((acc, emp) => {
    return acc + emp.leaveRequests.filter((l) => l.status === "Pending").length;
  }, 0);

  const totalPayroll = payroll.reduce((acc, p) => acc + p.finalSalary, 0);

  return (
    <MainLayout
      title="Dashboard"
      subtitle="Welcome back! Here's what's happening today."
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <StatCard
          title="Total Employees"
          value={totalEmployees}
          change="+2 this month"
          changeType="positive"
          icon={Users}
          iconColor="bg-primary"
          delay={0}
        />
        <StatCard
          title="Present Today"
          value={todayAttendance}
          change={`${Math.round((todayAttendance / totalEmployees) * 100)}% attendance`}
          changeType="positive"
          icon={UserCheck}
          iconColor="bg-success"
          delay={100}
        />
        <StatCard
          title="Pending Leave"
          value={pendingLeaves}
          change="Requires attention"
          changeType="neutral"
          icon={UserX}
          iconColor="bg-warning"
          delay={200}
        />
        <StatCard
          title="Monthly Payroll"
          value={`R${(totalPayroll / 1000).toFixed(0)}K`}
          change="Total salaries"
          changeType="neutral"
          icon={Wallet}
          iconColor="bg-accent"
          delay={300}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-8">
        <AttendanceChart />
        <DepartmentChart />
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </MainLayout>
  );
}

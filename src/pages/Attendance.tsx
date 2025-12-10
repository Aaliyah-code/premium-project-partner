import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useEmployees } from "@/contexts/EmployeeContext";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Check, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { LeaveRequest } from "@/data/employees";

export default function Attendance() {
  const { attendance, updateLeaveRequest } = useEmployees();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Flatten attendance data for the table
  const attendanceRecords = attendance.flatMap((emp) =>
    emp.attendance.map((record) => ({
      employeeId: emp.employeeId,
      name: emp.name,
      date: record.date,
      status: record.status,
    }))
  );

  // Flatten leave requests
  const leaveRequests = attendance.flatMap((emp) =>
    emp.leaveRequests.map((req) => ({
      employeeId: emp.employeeId,
      name: emp.name,
      ...req,
    }))
  );

  const filteredAttendance = attendanceRecords.filter((record) => {
    const matchesSearch = record.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredLeaves = leaveRequests.filter((req) => {
    const matchesSearch = req.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleLeaveAction = (
    employeeId: number,
    date: string,
    newStatus: LeaveRequest["status"]
  ) => {
    updateLeaveRequest(employeeId, date, newStatus);
    toast({
      title: `Leave Request ${newStatus}`,
      description: `The leave request has been ${newStatus.toLowerCase()}.`,
    });
  };

  const attendanceColumns = [
    {
      header: "Employee",
      accessor: (row: (typeof attendanceRecords)[0]) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">
              {row.name.split(" ").map((n) => n[0]).join("")}
            </span>
          </div>
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    {
      header: "Date",
      accessor: (row: (typeof attendanceRecords)[0]) =>
        new Date(row.date).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
    },
    {
      header: "Status",
      accessor: (row: (typeof attendanceRecords)[0]) => (
        <StatusBadge status={row.status} />
      ),
    },
  ];

  const leaveColumns = [
    {
      header: "Employee",
      accessor: (row: (typeof leaveRequests)[0]) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">
              {row.name.split(" ").map((n) => n[0]).join("")}
            </span>
          </div>
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    {
      header: "Date",
      accessor: (row: (typeof leaveRequests)[0]) =>
        new Date(row.date).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
    },
    {
      header: "Reason",
      accessor: "reason" as keyof (typeof leaveRequests)[0],
    },
    {
      header: "Status",
      accessor: (row: (typeof leaveRequests)[0]) => (
        <StatusBadge status={row.status} />
      ),
    },
    {
      header: "Actions",
      accessor: (row: (typeof leaveRequests)[0]) =>
        row.status === "Pending" ? (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-success hover:text-success hover:bg-success/10"
              onClick={(e) => {
                e.stopPropagation();
                handleLeaveAction(row.employeeId, row.date, "Approved");
              }}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={(e) => {
                e.stopPropagation();
                handleLeaveAction(row.employeeId, row.date, "Denied");
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        ),
    },
  ];

  // Calculate summary stats
  const totalPresent = attendanceRecords.filter(
    (r) => r.status === "Present"
  ).length;
  const totalAbsent = attendanceRecords.filter(
    (r) => r.status === "Absent"
  ).length;
  const pendingLeaves = leaveRequests.filter(
    (r) => r.status === "Pending"
  ).length;

  return (
    <MainLayout
      title="Attendance & Leave"
      subtitle="Track employee attendance and manage leave requests"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="shadow-soft border-border/50">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-success">{totalPresent}</div>
            <p className="text-sm text-muted-foreground">Present Records</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft border-border/50">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">{totalAbsent}</div>
            <p className="text-sm text-muted-foreground">Absent Records</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft border-border/50">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-warning">{pendingLeaves}</div>
            <p className="text-sm text-muted-foreground">Pending Leaves</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by employee name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Present">Present</SelectItem>
            <SelectItem value="Absent">Absent</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Denied">Denied</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="attendance" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="attendance">Attendance Records</TabsTrigger>
          <TabsTrigger value="leaves">Leave Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance">
          <Card className="shadow-soft border-border/50">
            <CardHeader>
              <CardTitle>Daily Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable data={filteredAttendance} columns={attendanceColumns} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaves">
          <Card className="shadow-soft border-border/50">
            <CardHeader>
              <CardTitle>Leave Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable data={filteredLeaves} columns={leaveColumns} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}

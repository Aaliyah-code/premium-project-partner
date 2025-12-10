import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useEmployees } from "@/contexts/EmployeeContext";
import { Employee } from "@/data/employees";
import { EmployeeCard } from "@/components/employees/EmployeeCard";
import { EmployeeForm } from "@/components/employees/EmployeeForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, LayoutGrid, List } from "lucide-react";
import { departments } from "@/data/employees";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Employees() {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useEmployees();
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<number | null>(null);

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.contact.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      departmentFilter === "all" || emp.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setFormOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setFormOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setEmployeeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (employeeToDelete) {
      deleteEmployee(employeeToDelete);
      toast({
        title: "Employee Deleted",
        description: "The employee has been removed successfully.",
      });
    }
    setDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

  const handleFormSubmit = (data: Omit<Employee, "employeeId">) => {
    if (selectedEmployee) {
      updateEmployee(selectedEmployee.employeeId, data);
      toast({
        title: "Employee Updated",
        description: "Employee information has been updated successfully.",
      });
    } else {
      addEmployee(data);
      toast({
        title: "Employee Added",
        description: "New employee has been added successfully.",
      });
    }
  };

  const tableColumns = [
    {
      header: "Employee",
      accessor: (row: Employee) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">
              {row.name.split(" ").map((n) => n[0]).join("")}
            </span>
          </div>
          <div>
            <p className="font-medium">{row.name}</p>
            <p className="text-sm text-muted-foreground">{row.contact}</p>
          </div>
        </div>
      ),
    },
    { header: "Position", accessor: "position" as keyof Employee },
    {
      header: "Department",
      accessor: (row: Employee) => (
        <Badge variant="secondary">{row.department}</Badge>
      ),
    },
    {
      header: "Salary",
      accessor: (row: Employee) => (
        <span className="font-semibold">R{row.salary.toLocaleString()}</span>
      ),
    },
  ];

  return (
    <MainLayout
      title="Employees"
      subtitle={`Manage your team of ${employees.length} employees`}
    >
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <div className="flex border border-border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleAddEmployee} className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Employee</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {filteredEmployees.map((employee, index) => (
            <div
              key={employee.employeeId}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <EmployeeCard
                employee={employee}
                onEdit={handleEditEmployee}
                onDelete={handleDeleteClick}
              />
            </div>
          ))}
        </div>
      ) : (
        <DataTable
          data={filteredEmployees}
          columns={tableColumns}
          onRowClick={handleEditEmployee}
        />
      )}

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No employees found</p>
        </div>
      )}

      {/* Employee Form Modal */}
      <EmployeeForm
        open={formOpen}
        onOpenChange={setFormOpen}
        employee={selectedEmployee}
        onSubmit={handleFormSubmit}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              employee and all associated records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}

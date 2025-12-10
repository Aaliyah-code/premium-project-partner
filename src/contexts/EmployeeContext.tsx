import React, { createContext, useContext, useState } from "react";
import {
  Employee,
  EmployeeAttendance,
  PayrollRecord,
  LeaveRequest,
  employeeInformation as initialEmployees,
  attendanceAndLeave as initialAttendance,
  payrollData as initialPayroll,
} from "@/data/employees";

interface EmployeeContextType {
  employees: Employee[];
  attendance: EmployeeAttendance[];
  payroll: PayrollRecord[];
  addEmployee: (employee: Omit<Employee, "employeeId">) => void;
  updateEmployee: (id: number, employee: Partial<Employee>) => void;
  deleteEmployee: (id: number) => void;
  updateLeaveRequest: (employeeId: number, date: string, status: LeaveRequest["status"]) => void;
  getEmployeeById: (id: number) => Employee | undefined;
  getAttendanceById: (id: number) => EmployeeAttendance | undefined;
  getPayrollById: (id: number) => PayrollRecord | undefined;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export function EmployeeProvider({ children }: { children: React.ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [attendance, setAttendance] = useState<EmployeeAttendance[]>(initialAttendance);
  const [payroll, setPayroll] = useState<PayrollRecord[]>(initialPayroll);

  const addEmployee = (employee: Omit<Employee, "employeeId">) => {
    const newId = Math.max(...employees.map((e) => e.employeeId)) + 1;
    const newEmployee: Employee = { ...employee, employeeId: newId };
    setEmployees([...employees, newEmployee]);
    
    // Add default attendance and payroll records
    setAttendance([
      ...attendance,
      {
        employeeId: newId,
        name: employee.name,
        attendance: [],
        leaveRequests: [],
      },
    ]);
    setPayroll([
      ...payroll,
      {
        employeeId: newId,
        hoursWorked: 0,
        leaveDeductions: 0,
        finalSalary: employee.salary,
      },
    ]);
  };

  const updateEmployee = (id: number, updates: Partial<Employee>) => {
    setEmployees(
      employees.map((emp) =>
        emp.employeeId === id ? { ...emp, ...updates } : emp
      )
    );
  };

  const deleteEmployee = (id: number) => {
    setEmployees(employees.filter((emp) => emp.employeeId !== id));
    setAttendance(attendance.filter((att) => att.employeeId !== id));
    setPayroll(payroll.filter((pay) => pay.employeeId !== id));
  };

  const updateLeaveRequest = (
    employeeId: number,
    date: string,
    status: LeaveRequest["status"]
  ) => {
    setAttendance(
      attendance.map((att) =>
        att.employeeId === employeeId
          ? {
              ...att,
              leaveRequests: att.leaveRequests.map((req) =>
                req.date === date ? { ...req, status } : req
              ),
            }
          : att
      )
    );
  };

  const getEmployeeById = (id: number) =>
    employees.find((emp) => emp.employeeId === id);

  const getAttendanceById = (id: number) =>
    attendance.find((att) => att.employeeId === id);

  const getPayrollById = (id: number) =>
    payroll.find((pay) => pay.employeeId === id);

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        attendance,
        payroll,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        updateLeaveRequest,
        getEmployeeById,
        getAttendanceById,
        getPayrollById,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployees() {
  const context = useContext(EmployeeContext);
  if (context === undefined) {
    throw new Error("useEmployees must be used within an EmployeeProvider");
  }
  return context;
}

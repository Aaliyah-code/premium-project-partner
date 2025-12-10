import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { useEmployees } from "@/contexts/EmployeeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = [
  "hsl(199, 89%, 48%)",
  "hsl(172, 66%, 50%)",
  "hsl(38, 92%, 50%)",
  "hsl(280, 65%, 60%)",
  "hsl(0, 84%, 60%)",
  "hsl(142, 76%, 36%)",
  "hsl(215, 16%, 47%)",
  "hsl(199, 89%, 68%)",
  "hsl(172, 66%, 70%)",
];

export function DepartmentChart() {
  const { employees } = useEmployees();

  const departmentData = employees.reduce((acc, emp) => {
    const existing = acc.find((d) => d.name === emp.department);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: emp.department, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  return (
    <Card className="shadow-soft border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Employees by Department
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {departmentData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    className="transition-all duration-300 hover:opacity-80"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Legend
                formatter={(value) => (
                  <span className="text-sm text-muted-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

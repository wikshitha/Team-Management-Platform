"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type { TaskStatusCounts } from "@/types/dashboard";

interface TaskStatusChartProps {
  data: TaskStatusCounts;
}

const STATUS_COLORS: Record<string, string> = {
  "To Do": "#64748b",
  "In Progress": "#3b82f6",
  "In Review": "#f59e0b",
  Completed: "#10b981",
};

export default function TaskStatusChart({
  data,
}: TaskStatusChartProps) {
  const chartData = [
    {
      name: "To Do",
      value: data.TODO,
    },
    {
      name: "In Progress",
      value: data.IN_PROGRESS,
    },
    {
      name: "In Review",
      value: data.IN_REVIEW,
    },
    {
      name: "Completed",
      value: data.COMPLETED,
    },
  ];

  const totalTasks = chartData.reduce(
    (total, item) => total + item.value,
    0
  );

  if (totalTasks === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-xl bg-slate-50">
        <p className="text-sm text-slate-500">
          No task data is available.
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-72 w-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="45%"
            innerRadius={62}
            outerRadius={92}
            paddingAngle={3}
          >
            {chartData.map((item) => (
              <Cell
                key={item.name}
                fill={STATUS_COLORS[item.name]}
              />
            ))}
          </Pie>

          <Tooltip
            formatter={(value) => [
              Number(value),
              "Tasks",
            ]}
          />

          <Legend
            verticalAlign="bottom"
            height={36}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="pointer-events-none absolute left-1/2 top-[43%] -translate-x-1/2 -translate-y-1/2 text-center">
        <p className="text-3xl font-bold text-slate-900">
          {totalTasks}
        </p>

        <p className="text-xs text-slate-500">
          Total Tasks
        </p>
      </div>
    </div>
  );
}
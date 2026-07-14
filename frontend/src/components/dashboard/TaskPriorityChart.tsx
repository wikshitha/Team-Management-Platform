"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { TaskPriorityCounts } from "@/types/dashboard";

interface TaskPriorityChartProps {
  data: TaskPriorityCounts;
}

interface PriorityChartItem {
  name: string;
  value: number;
  fill: string;
}

interface CustomBarShapeProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
}

const PRIORITY_COLORS: Record<string, string> = {
  Low: "#22c55e",
  Medium: "#3b82f6",
  High: "#f59e0b",
  Urgent: "#ef4444",
};

function CustomBarShape({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  fill = "#3b82f6",
}: CustomBarShapeProps) {
  return (
    <Rectangle
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      radius={[8, 8, 0, 0]}
    />
  );
}

export default function TaskPriorityChart({
  data,
}: TaskPriorityChartProps) {
  const chartData: PriorityChartItem[] = [
    {
      name: "Low",
      value: data.LOW,
      fill: PRIORITY_COLORS.Low,
    },
    {
      name: "Medium",
      value: data.MEDIUM,
      fill: PRIORITY_COLORS.Medium,
    },
    {
      name: "High",
      value: data.HIGH,
      fill: PRIORITY_COLORS.High,
    },
    {
      name: "Urgent",
      value: data.URGENT,
      fill: PRIORITY_COLORS.Urgent,
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
          No priority data is available.
        </p>
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 10,
            right: 10,
            left: -20,
            bottom: 0,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
          />

          <Tooltip
            cursor={{
              fill: "#f8fafc",
            }}
            formatter={(value) => [
              Number(value),
              "Tasks",
            ]}
          />

          <Bar
            dataKey="value"
            maxBarSize={54}
            shape={(props) => (
              <CustomBarShape
                x={props.x}
                y={props.y}
                width={props.width}
                height={props.height}
                fill={
                  typeof props.payload?.fill === "string"
                    ? props.payload.fill
                    : "#3b82f6"
                }
              />
            )}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
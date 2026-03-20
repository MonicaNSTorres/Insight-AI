"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

const COLORS = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"];

export function InsightBarChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
      >
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#2563eb" stopOpacity={0.6} />
          </linearGradient>
        </defs>

        <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />

        <XAxis
          dataKey="label"
          stroke="#94a3b8"
          tick={{ fontSize: 12 }}
        />

        <YAxis
          stroke="#94a3b8"
          tick={{ fontSize: 12 }}
        />

        <Tooltip
          cursor={{ fill: "rgba(37, 99, 235, 0.08)" }}
          contentStyle={{
            background: "#0f172a",
            border: "none",
            borderRadius: "12px",
            color: "#fff",
            fontSize: "12px",
          }}
        />

        <Bar
          dataKey="value"
          radius={[10, 10, 0, 0]}
          fill="url(#barGradient)"
          animationDuration={800}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
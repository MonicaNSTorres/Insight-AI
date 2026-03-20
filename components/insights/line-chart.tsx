"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
} from "recharts";

export function InsightLineChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  const hasSinglePoint = data.length === 1;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
      >
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
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
          contentStyle={{
            background: "#0f172a",
            border: "none",
            borderRadius: "12px",
            color: "#fff",
            fontSize: "12px",
          }}
        />

        <Area
          type="monotone"
          dataKey="value"
          stroke="none"
          fill="url(#areaGradient)"
        />

        <Line
          type="monotone"
          dataKey="value"
          stroke="#2563eb"
          strokeWidth={3}
          dot={hasSinglePoint ? { r: 6, fill: "#2563eb" } : false}
          activeDot={{ r: 7 }}
          animationDuration={900}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
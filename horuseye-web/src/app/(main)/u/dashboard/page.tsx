"use client";

import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { useDashboardStore } from "@/stores/useDashboardStore";
import {
  Activity,
  AlertOctagon,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  Scan,
  TrendingUp,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { format, subDays } from "date-fns";

const STATUS_COLORS = {
  completed: "#10b981",
  failed: "#ef4444",
  running: "#3b82f6",
  submitted: "#f59e0b",
  pending: "#6b7280",
  recon_complete: "#8b5cf6",
  vuln_complete: "#ec4899",
  vuln_report_complete: "#06b6d4",
};

const CHART_COLORS = {
  primary: "#3b82f6",
  secondary: "#8b5cf6",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  grid: "#f1f5f9",
  gridDark: "#374151",
  tooltip: "#1e293b",
};

const formatDuration = (totalSeconds: number | null | undefined) => {
  if (totalSeconds === null || totalSeconds === undefined) return "N/A";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
};

export default function DashboardPage() {
  const { stats, isLoading, error, fetchStats } = useDashboardStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (isLoading) {
    return (
      <div className="flex min-h-[600px] flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Loading Dashboard
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Preparing your security insights...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[600px] flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Failed to load dashboard
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
          </div>
          <button
            onClick={() => fetchStats()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-10 pt-6 pb-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Security Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor and analyze your security scan activities
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Scans"
          value={stats?.kpis.total_scans ?? 0}
          description="All time scan count"
          icon={<Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
          trend={{ value: 12.5, positive: true }}
        />
        <StatCard
          title="Scans Today"
          value={stats?.kpis.scans_today ?? 0}
          description="Scans performed today"
          icon={
            <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
          }
          trend={{ value: 8.2, positive: true }}
        />
        <StatCard
          title="Avg. Scan Time"
          value={formatDuration(stats?.kpis.avg_scan_time_seconds)}
          description="Average completion time"
          icon={
            <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          }
        />
        <StatCard
          title="Reports Generated"
          value={stats?.kpis.total_reports_generated ?? 0}
          description="Total reports created"
          icon={
            <FileText className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
          }
          trend={{ value: 5.7, positive: true }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="shadow-lg lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Scan Activity - Last 7 Days
            </CardTitle>
            <CardDescription>Daily scan volume and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ScansBarChart data={stats?.scans_last_7_days ?? []} />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              Status Distribution
            </CardTitle>
            <CardDescription>Current scan status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <StatusPieChart data={stats?.status_breakdown ?? []} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-lg lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Scan Performance</CardTitle>
            <CardDescription>Average completion time trends</CardDescription>
          </CardHeader>
          <CardContent>
            <PerformanceChart data={stats?.scans_last_7_days ?? []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
  trend,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: { value: number; positive: boolean };
}) {
  return (
    <Card className="relative overflow-hidden shadow-lg transition-all hover:shadow-md dark:border-gray-800 dark:hover:shadow-gray-900/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {value}
          </div>
          {trend && (
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                trend.positive
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              <TrendingUp
                className={`h-4 w-4 ${!trend.positive && "rotate-180"}`}
              />
              {trend.value}%
            </div>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

function ScansBarChart({ data }: { data: { date: string; count: number }[] }) {
  const filledData: any[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const dateString = format(date, "yyyy-MM-dd");
    const found = data.find((d) => d.date === dateString);
    filledData.push({
      name: format(date, "EEE"),
      fullDate: format(date, "MMM d"),
      count: found ? found.count : 0,
    });
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={filledData}
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={CHART_COLORS.grid}
            className="dark:stroke-gray-700"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            stroke="#64748b"
            className="dark:stroke-gray-400"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#64748b"
            className="dark:stroke-gray-400"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const fullDate = filledData.find(
                  (d) => d.name === label,
                )?.fullDate;
                return (
                  <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/50">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {fullDate}
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      {payload[0].value} scans
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="count"
            fill={CHART_COLORS.primary}
            radius={[4, 4, 0, 0]}
            className="hover:opacity-80"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function StatusPieChart({
  data,
}: {
  data: { status: string; count: number }[];
}) {
  if (data.length === 0) {
    return (
      <div className="flex h-[300px] flex-col items-center justify-center text-center">
        <Scan className="mb-2 h-8 w-8 text-gray-400 dark:text-gray-500" />
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          No scan data
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Scan results will appear here
        </p>
      </div>
    );
  }

  const mappedData = data.map((entry) => ({
    ...entry,
    name:
      entry.status === "vuln_report_complete"
        ? "Reports Generated"
        : entry.status,
    formattedName:
      entry.status === "vuln_report_complete"
        ? "Reports"
        : entry.status
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
  }));

  const total = mappedData.reduce((sum, entry) => sum + entry.count, 0);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={mappedData}
            dataKey="count"
            nameKey="formattedName"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            label={({ formattedName, percent }) =>
              `${formattedName}: ${((Number(percent) || 0) * 100).toFixed(0)}%`
            }
            labelLine={false}
          >
            {mappedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  STATUS_COLORS[entry.status as keyof typeof STATUS_COLORS] ||
                  "#6b7280"
                }
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [
              `${value} scans (${((value / total) * 100).toFixed(1)}%)`,
              "Count",
            ]}
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              color: "hsl(var(--foreground))",
            }}
          />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            formatter={(value, entry: any) => (
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {entry.payload.formattedName}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function PerformanceChart({
  data,
}: {
  data: { date: string; count: number }[];
}) {
  const mockPerformanceData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return {
      name: format(date, "EEE"),
      time: Math.random() * 120 + 60,
    };
  });

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={mockPerformanceData}
          margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={CHART_COLORS.grid}
            className="dark:stroke-gray-700"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            stroke="#64748b"
            className="dark:stroke-gray-400"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#64748b"
            className="dark:stroke-gray-400"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}s`}
          />
          <Tooltip
            formatter={(value: number) => [
              `${value.toFixed(1)} seconds`,
              "Time",
            ]}
            labelFormatter={(label) => `Day: ${label}`}
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              color: "hsl(var(--foreground))",
            }}
          />
          <Line
            type="monotone"
            dataKey="time"
            stroke={CHART_COLORS.secondary}
            strokeWidth={2}
            dot={{ fill: CHART_COLORS.secondary, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: CHART_COLORS.secondary }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

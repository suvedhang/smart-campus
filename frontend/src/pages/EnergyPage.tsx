import React, { useCallback } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Zap, Sun, Leaf } from 'lucide-react';
import { api } from '../services/api';
import { useApiData } from '../services/useApiData';
import { KpiCard } from '../components/KpiCard';
import { LoadingState, ErrorState } from '../components/StatusStates';
import type { EnergyData } from '../types';

export const EnergyPage: React.FC = () => {
  const fetcher = useCallback(() => api.getEnergy(), []);
  const { data, loading, error, refetch } = useApiData<EnergyData>(fetcher);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!data) return <ErrorState message="No energy data available" />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Energy Monitoring</h2>
        <p className="text-sm text-gray-500">Campus-wide energy consumption analytics (simulated)</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard
          title="Today's Consumption"
          value={`${data.summary.totalToday.toLocaleString()} ${data.summary.unit}`}
          subtitle={`${data.summary.percentChange > 0 ? '+' : ''}${data.summary.percentChange}% vs average`}
          icon={Zap}
          color="amber"
        />
        <KpiCard
          title="Solar Generation"
          value={`${data.summary.solarGeneration} ${data.summary.unit}`}
          subtitle="Renewable contribution"
          icon={Sun}
          color="green"
        />
        <KpiCard
          title="Carbon Footprint"
          value={`${data.summary.carbonFootprint} ${data.summary.carbonUnit}`}
          subtitle="Today's estimated emissions"
          icon={Leaf}
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* 7-Day Trend */}
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <h3 className="mb-4 text-sm font-semibold text-gray-700">7-Day Consumption Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data.daily}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v: string) => v.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="totalConsumption" stroke="#0c8ee6" strokeWidth={2} dot={{ r: 4 }} name="kWh" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly Consumption */}
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <h3 className="mb-4 text-sm font-semibold text-gray-700">Today's Hourly Consumption</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data.hourly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="hour" tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${v}:00`} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip labelFormatter={(v) => `${v}:00`} />
              <Area type="monotone" dataKey="consumption" stroke="#f59e0b" fill="#fef3c7" strokeWidth={2} name="kWh" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Building Breakdown */}
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <h3 className="mb-4 text-sm font-semibold text-gray-700">Consumption by Building</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.buildingBreakdown} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis
              type="category"
              dataKey="buildingName"
              tick={{ fontSize: 11 }}
              width={140}
              tickFormatter={(v: string) => (v.length > 18 ? v.slice(0, 18) + '…' : v)}
            />
            <Tooltip />
            <Bar dataKey="consumption" fill="#0c8ee6" name="kWh" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-gray-400 italic">{data.note}</p>
    </div>
  );
};

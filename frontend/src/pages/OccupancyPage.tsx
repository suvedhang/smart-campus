import React, { useCallback } from 'react';
import {
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
import { Users } from 'lucide-react';
import { api } from '../services/api';
import { useApiData } from '../services/useApiData';
import { KpiCard } from '../components/KpiCard';
import { LoadingState, ErrorState } from '../components/StatusStates';
import type { OccupancyData } from '../types';

export const OccupancyPage: React.FC = () => {
  const fetcher = useCallback(() => api.getOccupancy(), []);
  const { data, loading, error, refetch } = useApiData<OccupancyData>(fetcher);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!data) return <ErrorState message="No occupancy data available" />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Occupancy Monitoring</h2>
        <p className="text-sm text-gray-500">Campus-wide occupancy analytics (simulated)</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard
          title="Current Occupancy"
          value={data.campusTotal.currentOccupancy.toLocaleString()}
          subtitle={`${data.campusTotal.utilizationPercent}% utilization`}
          icon={Users}
          color="green"
        />
        <KpiCard
          title="Total Capacity"
          value={data.campusTotal.totalCapacity.toLocaleString()}
          subtitle="Maximum capacity"
          icon={Users}
          color="blue"
        />
        <KpiCard
          title="Available Spaces"
          value={(data.campusTotal.totalCapacity - data.campusTotal.currentOccupancy).toLocaleString()}
          subtitle="Remaining capacity"
          icon={Users}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Building Occupancy */}
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <h3 className="mb-4 text-sm font-semibold text-gray-700">Building Occupancy vs Capacity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.buildings}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="buildingName"
                tick={{ fontSize: 10 }}
                angle={-20}
                textAnchor="end"
                height={70}
                tickFormatter={(v: string) => (v.length > 12 ? v.slice(0, 12) + '…' : v)}
              />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="capacity" fill="#e0effe" name="Capacity" />
              <Bar dataKey="currentOccupancy" fill="#0c8ee6" name="Occupancy" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly Trend */}
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <h3 className="mb-4 text-sm font-semibold text-gray-700">Hourly Occupancy Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.hourlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="occupancy" stroke="#10b981" fill="#d1fae5" strokeWidth={2} name="Occupancy" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Building Detail Table */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4">
          <h3 className="text-sm font-semibold text-gray-700">Building Utilization Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-xs font-medium uppercase text-gray-500">
              <tr>
                <th className="px-5 py-3">Building</th>
                <th className="px-5 py-3">Occupancy</th>
                <th className="px-5 py-3">Capacity</th>
                <th className="px-5 py-3">Utilization</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.buildings.map((b) => (
                <tr key={b.buildingId} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-900">{b.buildingName}</td>
                  <td className="px-5 py-3">{b.currentOccupancy}</td>
                  <td className="px-5 py-3">{b.capacity}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 rounded-full bg-gray-100">
                        <div
                          className={`h-2 rounded-full ${
                            b.utilizationPercent > 80 ? 'bg-red-500' : b.utilizationPercent > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(b.utilizationPercent, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{b.utilizationPercent}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium ${
                      b.utilizationPercent > 80 ? 'text-red-600' : b.utilizationPercent > 60 ? 'text-amber-600' : 'text-emerald-600'
                    }`}>
                      {b.utilizationPercent > 80 ? 'High' : b.utilizationPercent > 60 ? 'Moderate' : 'Normal'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-400 italic">{data.note}</p>
    </div>
  );
};

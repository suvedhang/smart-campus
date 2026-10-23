import React, { useCallback } from 'react';
import {
  Building2,
  Users,
  Zap,
  AlertTriangle,
  Bus,
  Wrench,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { api } from '../services/api';
import { useApiData } from '../services/useApiData';
import { KpiCard } from '../components/KpiCard';
import { LoadingState, ErrorState } from '../components/StatusStates';
import { StatusBadge } from '../components/StatusBadge';
import type { DashboardSummary, EnergyData, OccupancyData, Building as BuildingType } from '../types';

export const DashboardPage: React.FC = () => {
  const fetchDashboard = useCallback(() => api.getDashboard(), []);
  const fetchEnergy = useCallback(() => api.getEnergy(), []);
  const fetchOccupancy = useCallback(() => api.getOccupancy(), []);
  const fetchBuildings = useCallback(() => api.getBuildings(), []);

  const { data: summary, loading: l1, error: e1 } = useApiData<DashboardSummary>(fetchDashboard);
  const { data: energy, loading: l2 } = useApiData<EnergyData>(fetchEnergy);
  const { data: occupancy, loading: l3 } = useApiData<OccupancyData>(fetchOccupancy);
  const { data: buildings, loading: l4 } = useApiData<BuildingType[]>(fetchBuildings);

  if (l1 || l2 || l3 || l4) return <LoadingState />;
  if (e1 || !summary) return <ErrorState message={e1 || 'Failed to load dashboard'} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Campus Overview</h2>
        <p className="text-sm text-gray-500">Real-time simulated metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Total Buildings"
          value={summary.totalBuildings}
          subtitle="Across campus"
          icon={Building2}
          color="blue"
        />
        <KpiCard
          title="Current Occupancy"
          value={`${summary.currentOccupancy.toLocaleString()}`}
          subtitle={`${summary.occupancyPercent}% of ${summary.totalCapacity.toLocaleString()} capacity`}
          icon={Users}
          color="green"
        />
        <KpiCard
          title="Energy Consumption"
          value={`${summary.totalEnergyConsumption.toLocaleString()} ${summary.energyUnit}`}
          subtitle="Today's total"
          icon={Zap}
          color="amber"
        />
        <KpiCard
          title="Active Alerts"
          value={summary.activeAlerts}
          subtitle={`${summary.criticalAlerts} critical · ${summary.warningAlerts} warning`}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <KpiCard
          title="Shuttles In Service"
          value={`${summary.shuttlesInService} / ${summary.totalShuttles}`}
          subtitle="Campus transportation"
          icon={Bus}
          color="purple"
        />
        <KpiCard
          title="Infrastructure"
          value={`${summary.infrastructureItems} items`}
          subtitle={`${summary.infrastructureFaults} fault${summary.infrastructureFaults !== 1 ? 's' : ''} detected`}
          icon={Wrench}
          color="blue"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Energy Line Chart */}
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <h3 className="mb-4 text-sm font-semibold text-gray-700">
            Energy Consumption (7 Day Trend)
          </h3>
          {energy && (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={energy.daily}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v: string) => v.slice(5)}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="totalConsumption"
                  stroke="#0c8ee6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Consumption (kWh)"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Occupancy Bar Chart */}
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <h3 className="mb-4 text-sm font-semibold text-gray-700">
            Building-wise Occupancy vs Capacity
          </h3>
          {occupancy && (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={occupancy.buildings}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="buildingName"
                  tick={{ fontSize: 10 }}
                  angle={-20}
                  textAnchor="end"
                  height={60}
                  tickFormatter={(v: string) =>
                    v.length > 12 ? v.slice(0, 12) + '…' : v
                  }
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="capacity" fill="#e0effe" name="Capacity" />
                <Bar
                  dataKey="currentOccupancy"
                  fill="#0c8ee6"
                  name="Occupancy"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Buildings Table */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4">
          <h3 className="text-sm font-semibold text-gray-700">
            Buildings Overview
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-xs font-medium uppercase text-gray-500">
              <tr>
                <th className="px-5 py-3">Building</th>
                <th className="px-5 py-3">Occupancy</th>
                <th className="px-5 py-3">Capacity</th>
                <th className="px-5 py-3">Energy (kWh)</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {buildings?.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-900">
                    {b.name}
                  </td>
                  <td className="px-5 py-3">{b.currentOccupancy}</td>
                  <td className="px-5 py-3">{b.capacity}</td>
                  <td className="px-5 py-3">{b.energyConsumption}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={b.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

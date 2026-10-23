import React, { useCallback, useState } from 'react';
import { Search } from 'lucide-react';
import { api } from '../services/api';
import { useApiData } from '../services/useApiData';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingState, ErrorState, EmptyState } from '../components/StatusStates';
import type { InfrastructureItem } from '../types';

export const InfrastructurePage: React.FC = () => {
  const fetcher = useCallback(() => api.getInfrastructure(), []);
  const { data, loading, error, refetch } = useApiData<InfrastructureItem[]>(fetcher);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!data || data.length === 0) return <EmptyState message="No infrastructure data available." />;

  const filtered = data.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.type.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses = ['All', ...Array.from(new Set(data.map((i) => i.status)))];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Infrastructure Monitoring</h2>
        <p className="text-sm text-gray-500">{data.length} equipment items tracked</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Operational', count: data.filter((i) => i.status === 'Operational').length, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Warning', count: data.filter((i) => i.status === 'Warning').length, color: 'text-amber-600 bg-amber-50' },
          { label: 'Fault', count: data.filter((i) => i.status === 'Fault').length, color: 'text-red-600 bg-red-50' },
          { label: 'Avg Health', count: `${Math.round(data.reduce((s, i) => s + i.health, 0) / data.length)}%`, color: 'text-blue-600 bg-blue-50' },
        ].map((card) => (
          <div key={card.label} className={`rounded-lg border p-4 ${card.color}`}>
            <p className="text-xs font-medium opacity-80">{card.label}</p>
            <p className="mt-1 text-xl font-bold">{card.count}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            id="infra-search"
            type="text"
            placeholder="Search equipment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm focus:border-campus-500 focus:outline-none focus:ring-1 focus:ring-campus-500"
          />
        </div>
        <select
          id="infra-status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-campus-500 focus:outline-none"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Infrastructure Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filtered.map((item) => (
          <div key={item.id} className="rounded-lg border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <p className="text-xs text-gray-500">{item.type} · {item.location}</p>
              </div>
              <StatusBadge status={item.status} />
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Health Score</span>
                <span className="font-medium">{item.health}%</span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-gray-100">
                <div
                  className={`h-2 rounded-full ${
                    item.health >= 80 ? 'bg-emerald-500' : item.health >= 60 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${item.health}%` }}
                />
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
              <div>
                <span className="font-medium">Last Maintenance:</span>
                <br />
                {new Date(item.lastMaintenance).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Next Maintenance:</span>
                <br />
                {new Date(item.nextMaintenance).toLocaleDateString()}
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500 italic">{item.notes}</p>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <EmptyState message="No equipment matches the current filters." />}
    </div>
  );
};

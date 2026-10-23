import React, { useCallback, useState } from 'react';
import { api } from '../services/api';
import { useApiData } from '../services/useApiData';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingState, ErrorState, EmptyState } from '../components/StatusStates';
import type { AlertItem } from '../types';

export const AlertsPage: React.FC = () => {
  const fetcher = useCallback(() => api.getAlerts(), []);
  const { data, loading, error, refetch } = useApiData<AlertItem[]>(fetcher);
  const [severityFilter, setSeverityFilter] = useState<string>('All');

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!data || data.length === 0) return <EmptyState message="No alerts." />;

  const filtered = severityFilter === 'All'
    ? data
    : data.filter((a) => a.severity === severityFilter);

  const severityIcon: Record<string, string> = {
    Critical: '🔴',
    Warning: '🟡',
    Info: '🔵',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Alerts</h2>
          <p className="text-sm text-gray-500">{data.length} total alerts</p>
        </div>
        <div className="flex gap-2">
          {['All', 'Critical', 'Warning', 'Info'].map((level) => (
            <button
              key={level}
              id={`filter-${level.toLowerCase()}`}
              onClick={() => setSeverityFilter(level)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                severityFilter === level
                  ? 'bg-campus-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
          <p className="text-2xl font-bold text-red-700">{data.filter((a) => a.severity === 'Critical').length}</p>
          <p className="text-xs font-medium text-red-600">Critical</p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-center">
          <p className="text-2xl font-bold text-amber-700">{data.filter((a) => a.severity === 'Warning').length}</p>
          <p className="text-xs font-medium text-amber-600">Warning</p>
        </div>
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-center">
          <p className="text-2xl font-bold text-blue-700">{data.filter((a) => a.severity === 'Info').length}</p>
          <p className="text-xs font-medium text-blue-600">Info</p>
        </div>
      </div>

      {/* Alert Cards */}
      <div className="space-y-3">
        {filtered.map((alert) => (
          <div
            key={alert.id}
            className={`rounded-lg border bg-white p-5 transition-shadow hover:shadow-md ${
              alert.severity === 'Critical'
                ? 'border-l-4 border-l-red-500 border-t-gray-200 border-r-gray-200 border-b-gray-200'
                : alert.severity === 'Warning'
                ? 'border-l-4 border-l-amber-500 border-t-gray-200 border-r-gray-200 border-b-gray-200'
                : 'border-l-4 border-l-blue-500 border-t-gray-200 border-r-gray-200 border-b-gray-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-lg">{severityIcon[alert.severity]}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{alert.description}</p>
                </div>
              </div>
              <StatusBadge status={alert.severity} />
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
              <span>📍 {alert.location}</span>
              <span>🕐 {new Date(alert.timestamp).toLocaleString()}</span>
              <span>👤 {alert.assignedTo}</span>
              <span>{alert.acknowledged ? '✅ Acknowledged' : '⏳ Pending'}</span>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <EmptyState message={`No ${severityFilter.toLowerCase()} alerts.`} />}
    </div>
  );
};

import React from 'react';

interface StatusBadgeProps {
  status: string;
}

const statusStyles: Record<string, string> = {
  Operational: 'bg-emerald-100 text-emerald-800',
  'In Service': 'bg-emerald-100 text-emerald-800',
  Warning: 'bg-amber-100 text-amber-800',
  'Under Maintenance': 'bg-amber-100 text-amber-800',
  Charging: 'bg-blue-100 text-blue-800',
  Fault: 'bg-red-100 text-red-800',
  'Out of Service': 'bg-red-100 text-red-800',
  Critical: 'bg-red-100 text-red-800',
  Info: 'bg-blue-100 text-blue-800',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const style = statusStyles[status] || 'bg-gray-100 text-gray-800';
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}
    >
      {status}
    </span>
  );
};

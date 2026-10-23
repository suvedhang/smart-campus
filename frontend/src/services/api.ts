import type {
  ApiResponse,
  DashboardSummary,
  Building,
  EnergyData,
  OccupancyData,
  InfrastructureItem,
  TransportationItem,
  AlertItem,
} from '../types';

/**
 * Determines the base URL for API calls.
 * - In development, Vite's proxy handles /api → localhost:5000.
 * - In production (Docker/Nginx), /api is proxied by Nginx.
 */
const BASE_URL = '/api';

async function fetchApi<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`);
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  const json: ApiResponse<T> = await res.json();
  if (!json.success) {
    throw new Error('API returned unsuccessful response');
  }
  return json.data;
}

export const api = {
  getDashboard: () => fetchApi<DashboardSummary>('/dashboard'),
  getBuildings: () => fetchApi<Building[]>('/buildings'),
  getEnergy: () => fetchApi<EnergyData>('/energy'),
  getOccupancy: () => fetchApi<OccupancyData>('/occupancy'),
  getInfrastructure: () => fetchApi<InfrastructureItem[]>('/infrastructure'),
  getTransportation: () => fetchApi<TransportationItem[]>('/transportation'),
  getAlerts: (severity?: string) => {
    const query = severity ? `?severity=${severity}` : '';
    return fetchApi<AlertItem[]>(`/alerts${query}`);
  },
  getHealth: () => fetch(`${BASE_URL}/health`).then((r) => r.json()),
};

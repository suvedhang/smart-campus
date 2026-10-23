// Frontend type definitions mirroring the backend API responses

export interface Building {
  id: string;
  name: string;
  type: string;
  floors: number;
  totalRooms: number;
  currentOccupancy: number;
  capacity: number;
  energyConsumption: number;
  energyUnit: string;
  status: string;
  location: { lat: number; lng: number };
  facilities: string[];
  lastInspection: string;
  buildYear: number;
}

export interface EnergyDaily {
  date: string;
  totalConsumption: number;
  unit: string;
  peakHour: number;
  peakConsumption: number;
}

export interface EnergyBuildingBreakdown {
  buildingId: string;
  buildingName: string;
  consumption: number;
  unit: string;
  efficiency: string;
}

export interface EnergyHourly {
  hour: number;
  consumption: number;
}

export interface EnergySummary {
  totalToday: number;
  averageDaily: number;
  percentChange: number;
  unit: string;
  solarGeneration: number;
  gridConsumption: number;
  carbonFootprint: number;
  carbonUnit: string;
}

export interface EnergyData {
  daily: EnergyDaily[];
  buildingBreakdown: EnergyBuildingBreakdown[];
  hourly: EnergyHourly[];
  summary: EnergySummary;
  note: string;
}

export interface OccupancyBuilding {
  buildingId: string;
  buildingName: string;
  currentOccupancy: number;
  capacity: number;
  utilizationPercent: number;
}

export interface OccupancyHourlyTrend {
  hour: string;
  occupancy: number;
}

export interface OccupancyData {
  campusTotal: {
    currentOccupancy: number;
    totalCapacity: number;
    utilizationPercent: number;
    timestamp: string;
  };
  buildings: OccupancyBuilding[];
  hourlyTrend: OccupancyHourlyTrend[];
  note: string;
}

export interface InfrastructureItem {
  id: string;
  name: string;
  type: string;
  location: string;
  status: string;
  health: number;
  lastMaintenance: string;
  nextMaintenance: string;
  installedDate: string;
  notes: string;
}

export interface TransportationItem {
  id: string;
  name: string;
  route: string;
  status: string;
  currentLocation: string;
  capacity: number;
  currentPassengers: number;
  driver: string;
  nextStop: string;
  estimatedArrival: string;
  lastUpdated: string;
}

export interface AlertItem {
  id: string;
  severity: 'Critical' | 'Warning' | 'Info';
  title: string;
  description: string;
  location: string;
  equipmentId: string | null;
  timestamp: string;
  acknowledged: boolean;
  resolvedAt: string | null;
  assignedTo: string;
}

export interface DashboardSummary {
  totalBuildings: number;
  currentOccupancy: number;
  totalCapacity: number;
  occupancyPercent: number;
  totalEnergyConsumption: number;
  energyUnit: string;
  activeAlerts: number;
  criticalAlerts: number;
  warningAlerts: number;
  infoAlerts: number;
  totalShuttles: number;
  shuttlesInService: number;
  infrastructureItems: number;
  infrastructureFaults: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  note?: string;
}

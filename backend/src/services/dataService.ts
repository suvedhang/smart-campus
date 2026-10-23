import fs from 'fs';
import path from 'path';
import {
  Building,
  EnergyData,
  OccupancyData,
  InfrastructureItem,
  TransportationItem,
  AlertItem,
  DashboardSummary,
} from '../types';

/**
 * DataService provides methods to load and query simulated campus data
 * from local JSON files. It includes a simple simulation mechanism that
 * applies small random variations to occupancy and energy values on each
 * read, mimicking live sensor updates.
 */
class DataService {
  private dataDir: string;

  constructor() {
    this.dataDir = path.join(__dirname, '..', 'data');
  }

  /** Read and parse a JSON data file from the data directory. */
  private readJsonFile<T>(filename: string): T {
    const filePath = path.join(this.dataDir, filename);
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  }

  /** Apply a small random variation (±percent) to a number. */
  private applyVariation(value: number, percent: number = 5): number {
    const factor = 1 + (Math.random() * 2 - 1) * (percent / 100);
    return Math.round(value * factor);
  }

  /** Get all buildings with simulated occupancy variation. */
  getBuildings(): Building[] {
    const buildings = this.readJsonFile<Building[]>('buildings.json');
    return buildings.map((b) => ({
      ...b,
      currentOccupancy: Math.min(
        this.applyVariation(b.currentOccupancy, 8),
        b.capacity
      ),
    }));
  }

  /** Get energy data with simulated consumption variations. */
  getEnergy(): EnergyData {
    const energy = this.readJsonFile<EnergyData>('energy.json');
    return {
      ...energy,
      summary: {
        ...energy.summary,
        totalToday: this.applyVariation(energy.summary.totalToday, 3),
        solarGeneration: this.applyVariation(energy.summary.solarGeneration, 5),
      },
      hourly: energy.hourly.map((h) => ({
        ...h,
        consumption: Math.round(
          this.applyVariation(h.consumption, 4) * 10
        ) / 10,
      })),
    };
  }

  /** Get occupancy data with simulated variation. */
  getOccupancy(): OccupancyData {
    const occupancy = this.readJsonFile<OccupancyData>('occupancy.json');
    const buildings = occupancy.buildings.map((b) => {
      const newOcc = Math.min(
        this.applyVariation(b.currentOccupancy, 8),
        b.capacity
      );
      return {
        ...b,
        currentOccupancy: newOcc,
        utilizationPercent: Math.round((newOcc / b.capacity) * 1000) / 10,
      };
    });
    const totalOcc = buildings.reduce(
      (sum, b) => sum + b.currentOccupancy,
      0
    );
    return {
      ...occupancy,
      campusTotal: {
        ...occupancy.campusTotal,
        currentOccupancy: totalOcc,
        utilizationPercent:
          Math.round(
            (totalOcc / occupancy.campusTotal.totalCapacity) * 1000
          ) / 10,
        timestamp: new Date().toISOString(),
      },
      buildings,
    };
  }

  /** Get infrastructure items (status is relatively stable). */
  getInfrastructure(): InfrastructureItem[] {
    return this.readJsonFile<InfrastructureItem[]>('infrastructure.json');
  }

  /** Get transportation data with simulated passenger variations. */
  getTransportation(): TransportationItem[] {
    const shuttles = this.readJsonFile<TransportationItem[]>(
      'transportation.json'
    );
    return shuttles.map((s) => ({
      ...s,
      currentPassengers:
        s.status === 'In Service'
          ? Math.min(this.applyVariation(s.currentPassengers, 15), s.capacity)
          : s.currentPassengers,
      lastUpdated: new Date().toISOString(),
    }));
  }

  /** Get all alerts. */
  getAlerts(): AlertItem[] {
    return this.readJsonFile<AlertItem[]>('alerts.json');
  }

  /** Get a summary of all campus data for the dashboard overview. */
  getDashboardSummary(): DashboardSummary {
    const buildings = this.getBuildings();
    const energy = this.getEnergy();
    const alerts = this.getAlerts();
    const shuttles = this.getTransportation();
    const infrastructure = this.getInfrastructure();

    const totalOcc = buildings.reduce(
      (sum, b) => sum + b.currentOccupancy,
      0
    );
    const totalCap = buildings.reduce((sum, b) => sum + b.capacity, 0);
    const activeAlerts = alerts.filter((a) => !a.resolvedAt);

    return {
      totalBuildings: buildings.length,
      currentOccupancy: totalOcc,
      totalCapacity: totalCap,
      occupancyPercent: Math.round((totalOcc / totalCap) * 1000) / 10,
      totalEnergyConsumption: energy.summary.totalToday,
      energyUnit: energy.summary.unit,
      activeAlerts: activeAlerts.length,
      criticalAlerts: activeAlerts.filter((a) => a.severity === 'Critical')
        .length,
      warningAlerts: activeAlerts.filter((a) => a.severity === 'Warning')
        .length,
      infoAlerts: activeAlerts.filter((a) => a.severity === 'Info').length,
      totalShuttles: shuttles.length,
      shuttlesInService: shuttles.filter((s) => s.status === 'In Service')
        .length,
      infrastructureItems: infrastructure.length,
      infrastructureFaults: infrastructure.filter(
        (i) => i.status === 'Fault'
      ).length,
    };
  }
}

export default new DataService();

import request from 'supertest';
import app from '../src/app';

describe('Smart Campus API', () => {
  // -----------------------------------------------------------------------
  // Health Check
  // -----------------------------------------------------------------------
  describe('GET /api/health', () => {
    it('should return healthy status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body.service).toBeDefined();
      expect(res.body.timestamp).toBeDefined();
    });
  });

  // -----------------------------------------------------------------------
  // Dashboard
  // -----------------------------------------------------------------------
  describe('GET /api/dashboard', () => {
    it('should return dashboard summary', async () => {
      const res = await request(app).get('/api/dashboard');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.totalBuildings).toBeGreaterThan(0);
      expect(res.body.data.currentOccupancy).toBeDefined();
      expect(res.body.data.totalEnergyConsumption).toBeDefined();
      expect(res.body.data.activeAlerts).toBeDefined();
    });
  });

  // -----------------------------------------------------------------------
  // Buildings
  // -----------------------------------------------------------------------
  describe('GET /api/buildings', () => {
    it('should return an array of buildings', async () => {
      const res = await request(app).get('/api/buildings');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      // Verify shape of a building object
      const building = res.body.data[0];
      expect(building.id).toBeDefined();
      expect(building.name).toBeDefined();
      expect(building.currentOccupancy).toBeDefined();
      expect(building.capacity).toBeDefined();
    });
  });

  describe('GET /api/buildings/:id', () => {
    it('should return a single building by ID', async () => {
      const res = await request(app).get('/api/buildings/BLD-001');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('BLD-001');
    });

    it('should return 404 for unknown building ID', async () => {
      const res = await request(app).get('/api/buildings/UNKNOWN');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  // -----------------------------------------------------------------------
  // Energy
  // -----------------------------------------------------------------------
  describe('GET /api/energy', () => {
    it('should return energy data', async () => {
      const res = await request(app).get('/api/energy');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.summary).toBeDefined();
      expect(res.body.data.daily).toBeDefined();
      expect(res.body.data.hourly).toBeDefined();
      expect(res.body.data.buildingBreakdown).toBeDefined();
    });
  });

  // -----------------------------------------------------------------------
  // Occupancy
  // -----------------------------------------------------------------------
  describe('GET /api/occupancy', () => {
    it('should return occupancy data', async () => {
      const res = await request(app).get('/api/occupancy');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.campusTotal).toBeDefined();
      expect(res.body.data.buildings).toBeDefined();
      expect(res.body.data.hourlyTrend).toBeDefined();
    });
  });

  // -----------------------------------------------------------------------
  // Infrastructure
  // -----------------------------------------------------------------------
  describe('GET /api/infrastructure', () => {
    it('should return infrastructure items', async () => {
      const res = await request(app).get('/api/infrastructure');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  // -----------------------------------------------------------------------
  // Transportation
  // -----------------------------------------------------------------------
  describe('GET /api/transportation', () => {
    it('should return transportation data', async () => {
      const res = await request(app).get('/api/transportation');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  // -----------------------------------------------------------------------
  // Alerts
  // -----------------------------------------------------------------------
  describe('GET /api/alerts', () => {
    it('should return all alerts', async () => {
      const res = await request(app).get('/api/alerts');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should filter alerts by severity', async () => {
      const res = await request(app).get('/api/alerts?severity=Critical');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      res.body.data.forEach((alert: any) => {
        expect(alert.severity).toBe('Critical');
      });
    });

    it('should reject invalid severity filter', async () => {
      const res = await request(app).get('/api/alerts?severity=Invalid');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // -----------------------------------------------------------------------
  // 404 handling
  // -----------------------------------------------------------------------
  describe('Unknown routes', () => {
    it('should return 404 for unknown routes', async () => {
      const res = await request(app).get('/api/nonexistent');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});

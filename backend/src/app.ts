import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dashboardRoutes from './routes/dashboard';
import buildingsRoutes from './routes/buildings';
import energyRoutes from './routes/energy';
import occupancyRoutes from './routes/occupancy';
import infrastructureRoutes from './routes/infrastructure';
import transportationRoutes from './routes/transportation';
import alertsRoutes from './routes/alerts';

const app = express();

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'Smart Campus Digital Twin API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ---------------------------------------------------------------------------
// API Routes
// ---------------------------------------------------------------------------
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/buildings', buildingsRoutes);
app.use('/api/energy', energyRoutes);
app.use('/api/occupancy', occupancyRoutes);
app.use('/api/infrastructure', infrastructureRoutes);
app.use('/api/transportation', transportationRoutes);
app.use('/api/alerts', alertsRoutes);

// ---------------------------------------------------------------------------
// 404 handler – unmatched routes
// ---------------------------------------------------------------------------
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    timestamp: new Date().toISOString(),
  });
});

// ---------------------------------------------------------------------------
// Global error handler
// ---------------------------------------------------------------------------
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    timestamp: new Date().toISOString(),
  });
});

export default app;

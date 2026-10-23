import { Router, Request, Response } from 'express';
import dataService from '../services/dataService';

const router = Router();

/** GET /api/dashboard - Returns aggregated campus overview metrics. */
router.get('/', (_req: Request, res: Response) => {
  try {
    const summary = dataService.getDashboardSummary();
    res.json({
      success: true,
      data: summary,
      timestamp: new Date().toISOString(),
      note: 'Dashboard metrics are derived from simulated data.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      timestamp: new Date().toISOString(),
      error: 'Failed to load dashboard summary.',
    });
  }
});

export default router;

import { Router, Request, Response } from 'express';
import dataService from '../services/dataService';

const router = Router();

/** GET /api/infrastructure - Returns infrastructure equipment data. */
router.get('/', (_req: Request, res: Response) => {
  try {
    const infrastructure = dataService.getInfrastructure();
    res.json({
      success: true,
      data: infrastructure,
      timestamp: new Date().toISOString(),
      note: 'Infrastructure data is simulated. No real monitoring systems connected.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      timestamp: new Date().toISOString(),
      error: 'Failed to load infrastructure data.',
    });
  }
});

export default router;

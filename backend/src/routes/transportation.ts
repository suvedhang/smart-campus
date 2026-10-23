import { Router, Request, Response } from 'express';
import dataService from '../services/dataService';

const router = Router();

/** GET /api/transportation - Returns shuttle and transport data. */
router.get('/', (_req: Request, res: Response) => {
  try {
    const transportation = dataService.getTransportation();
    res.json({
      success: true,
      data: transportation,
      timestamp: new Date().toISOString(),
      note: 'Transportation data is simulated. No real GPS tracking connected.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      timestamp: new Date().toISOString(),
      error: 'Failed to load transportation data.',
    });
  }
});

export default router;

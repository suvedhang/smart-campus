import { Router, Request, Response } from 'express';
import dataService from '../services/dataService';

const router = Router();

/** GET /api/occupancy - Returns occupancy data. */
router.get('/', (_req: Request, res: Response) => {
  try {
    const occupancy = dataService.getOccupancy();
    res.json({
      success: true,
      data: occupancy,
      timestamp: new Date().toISOString(),
      note: occupancy.note,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      timestamp: new Date().toISOString(),
      error: 'Failed to load occupancy data.',
    });
  }
});

export default router;

import { Router, Request, Response } from 'express';
import dataService from '../services/dataService';

const router = Router();

/** GET /api/energy - Returns energy consumption data. */
router.get('/', (_req: Request, res: Response) => {
  try {
    const energy = dataService.getEnergy();
    res.json({
      success: true,
      data: energy,
      timestamp: new Date().toISOString(),
      note: energy.note,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      timestamp: new Date().toISOString(),
      error: 'Failed to load energy data.',
    });
  }
});

export default router;

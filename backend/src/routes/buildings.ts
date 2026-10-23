import { Router, Request, Response } from 'express';
import dataService from '../services/dataService';

const router = Router();

/** GET /api/buildings - Returns all campus buildings. */
router.get('/', (_req: Request, res: Response) => {
  try {
    const buildings = dataService.getBuildings();
    res.json({
      success: true,
      data: buildings,
      timestamp: new Date().toISOString(),
      note: 'Building occupancy values include simulated variation.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      timestamp: new Date().toISOString(),
      error: 'Failed to load buildings data.',
    });
  }
});

/** GET /api/buildings/:id - Returns a single building by ID. */
router.get('/:id', (req: Request, res: Response) => {
  try {
    const buildings = dataService.getBuildings();
    const building = buildings.find(
      (b) => b.id.toLowerCase() === req.params.id.toLowerCase()
    );
    if (!building) {
      res.status(404).json({
        success: false,
        data: null,
        timestamp: new Date().toISOString(),
        error: `Building with ID "${req.params.id}" not found.`,
      });
      return;
    }
    res.json({
      success: true,
      data: building,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      timestamp: new Date().toISOString(),
      error: 'Failed to load building data.',
    });
  }
});

export default router;

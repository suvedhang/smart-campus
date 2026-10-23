import { Router, Request, Response } from 'express';
import dataService from '../services/dataService';

const router = Router();

/** GET /api/alerts - Returns all alerts, optionally filtered by severity. */
router.get('/', (req: Request, res: Response) => {
  try {
    let alerts = dataService.getAlerts();

    // Optional query-parameter filter: ?severity=Critical
    const severity = req.query.severity as string | undefined;
    if (severity) {
      const validSeverities = ['Critical', 'Warning', 'Info'];
      if (!validSeverities.includes(severity)) {
        res.status(400).json({
          success: false,
          data: null,
          timestamp: new Date().toISOString(),
          error: `Invalid severity filter. Must be one of: ${validSeverities.join(', ')}`,
        });
        return;
      }
      alerts = alerts.filter(
        (a) => a.severity.toLowerCase() === severity.toLowerCase()
      );
    }

    res.json({
      success: true,
      data: alerts,
      timestamp: new Date().toISOString(),
      note: 'Alert data is simulated for demonstration.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      timestamp: new Date().toISOString(),
      error: 'Failed to load alerts data.',
    });
  }
});

export default router;

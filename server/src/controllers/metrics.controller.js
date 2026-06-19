import * as dbService from '../services/db.service.js';

export async function getMetricsHistory(req, res) {
  try {
    const metrics = await dbService.getMetrics();
    res.json(metrics);
  } catch (err) {
    console.error('Error in GET /api/metrics:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

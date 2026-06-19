import * as dbService from '../services/db.service.js';

export async function getSettings(req, res) {
  try {
    const settings = await dbService.getSettings();
    res.json(settings);
  } catch (err) {
    console.error('Error in GET /api/settings:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateSettings(req, res) {
  try {
    const settings = await dbService.updateSettings(req.body);
    res.json(settings);
  } catch (err) {
    console.error('Error in PUT /api/settings:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

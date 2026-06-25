import * as dbService from '../services/db.service.js';

export async function getWebsites(req, res) {
  try {
    const websites = await dbService.getWebsites();
    res.json(websites);
  } catch (err) {
    console.error('Error in GET /api/websites:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createWebsite(req, res) {
  try {
    let targetUrl = req.body.url ? req.body.url.trim() : '';
    if (targetUrl && !/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
    }
    const newSite = {
      id: Date.now(),
      name: req.body.name || 'Unnamed Site',
      url: targetUrl,
      status: 'active',
      lastStatus: 'success',
      lastCapture: '-',
      error: null,
      lastCaptureImage: null,
      alertEmail: req.body.alertEmail || null,
      emailStatus: req.body.emailStatus || 'No Alert',
      lastAlertSentAt: req.body.lastAlertSentAt || null,
      domainEmailStatus: req.body.domainEmailStatus || 'No Alert',
      lastDomainAlertSentAt: req.body.lastDomainAlertSentAt || null
    };
    await dbService.createWebsite(newSite);
    res.status(201).json(newSite);
  } catch (err) {
    console.error('Error in POST /api/websites:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateWebsite(req, res) {
  try {
    const siteId = req.params.id;
    const existingSite = await dbService.getWebsiteById(siteId);
    if (!existingSite) {
      return res.status(404).json({ error: 'Website not found' });
    }
    
    let targetUrl = req.body.url ? req.body.url.trim() : '';
    if (targetUrl && !/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
    }

    const fieldsToUpdate = {
      ...req.body,
      ...(targetUrl ? { url: targetUrl } : {})
    };

    const updatedSite = await dbService.updateWebsite(siteId, fieldsToUpdate);
    res.json(updatedSite);
  } catch (err) {
    console.error('Error in PUT /api/websites/:id:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteAllWebsites(req, res) {
  try {
    await dbService.deleteAllWebsites();
    res.json({ message: 'All websites deleted successfully' });
  } catch (err) {
    console.error('Error in DELETE /api/websites:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteWebsite(req, res) {
  try {
    const siteId = req.params.id;
    await dbService.deleteWebsite(siteId);
    res.json({ message: 'Website deleted successfully' });
  } catch (err) {
    console.error('Error in DELETE /api/websites/:id:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function bulkInsertWebsites(req, res) {
  try {
    const incoming = Array.isArray(req.body) ? req.body : [];
    const newSites = incoming.map((site, index) => {
      let targetUrl = site.url ? site.url.trim() : '';
      if (targetUrl && !/^https?:\/\//i.test(targetUrl)) {
        targetUrl = 'https://' + targetUrl;
      }
      return {
        id: Date.now() + index,
        name: site.name || 'Unnamed Site',
        url: targetUrl,
        status: 'active',
        lastStatus: 'success',
        lastCapture: '-',
        error: null,
        lastCaptureImage: null,
        alertEmail: site.alertEmail || null,
        emailStatus: site.emailStatus || 'No Alert',
        lastAlertSentAt: site.lastAlertSentAt || null,
        domainEmailStatus: site.domainEmailStatus || 'No Alert',
        lastDomainAlertSentAt: site.lastDomainAlertSentAt || null
      };
    });
    await dbService.bulkInsertWebsites(newSites);
    res.status(201).json(newSites);
  } catch (err) {
    console.error('Error in POST /api/websites/bulk:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

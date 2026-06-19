import { captureProgress, runCaptureSession } from '../services/capture.service.js';

export function getCaptureProgress(req, res) {
  res.json(captureProgress);
}

export async function triggerCapture(req, res) {
  if (captureProgress.active) {
    return res.status(409).json({ error: 'A capture session is already in progress' });
  }
  
  // Start the capture pipeline asynchronously
  runCaptureSession().catch(err => {
    console.error('Async capture session failed:', err);
    // Note: captureProgress state is reset inside runCaptureSession's finally/catch block
  });
  
  res.status(202).json({ message: 'Capture session started' });
}

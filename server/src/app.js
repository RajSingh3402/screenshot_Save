import express from 'express';
import cors from 'cors';
import apiRouter from './routes/index.js';
import { screenshotsDir, reportsDir } from './services/capture.service.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve screenshots and PDF reports statically
app.use('/screenshots', express.static(screenshotsDir));
app.use('/reports', express.static(reportsDir));

// API routes mounted at /api
app.use('/api', apiRouter);

export default app;

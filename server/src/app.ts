import express from 'express';
import previewRouter from './routes/preview.route';
import limiter from './middlewares/rateLimiter';

const app = express();

app.use(express.json());
app.use(limiter);
app.use('/preview', previewRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

export default app;

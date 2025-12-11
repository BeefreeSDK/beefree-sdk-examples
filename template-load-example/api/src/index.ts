import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { apiKeyMiddleware } from './middleware/auth';
import healthRoutes from './routes/health';
import versionRoutes from './routes/version';
import templatesRoutes from './routes/templates';
import authRoutes from './routes/auth';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(express.json({ limit: '5mb' })); // JSON body parser with 5MB limit
app.use(
  cors({
    origin: [
      'http://localhost:8002', // Frontend Vite dev port (8000 + example #2)
      'http://localhost:4173', // Vite preview server port (default)
      'http://localhost:4174', // Vite preview server port (fallback)
    ],
    credentials: true,
  })
);

// Apply API key middleware to all routes
app.use(apiKeyMiddleware);

// Routes
app.use('/health', healthRoutes);
app.use('/version', versionRoutes);
app.use('/templates', templatesRoutes);
app.use('/auth', authRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📋 Version: http://localhost:${PORT}/version`);
  console.log(
    `🔑 API Key required: ${process.env.API_KEY ? 'Yes' : 'No (demo mode)'}`
  );
});

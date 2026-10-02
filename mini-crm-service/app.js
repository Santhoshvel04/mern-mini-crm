const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const env = require('./config/env');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(helmet());

const BASE_ALLOWED_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173'];
const allowedOrigins = [...new Set([...BASE_ALLOWED_ORIGINS, ...(env.corsOrigins || [])])];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(env.isProd ? 'combined' : 'dev', { stream: { write: (m) => logger.info(m.trim()) } }));

app.get('/health', async (req, res) => {
  const db = mongoose.connection.readyState === 1;
  res.json({ success: true, data: { status: 'ok', db, service: 'mini-crm-service', env: env.nodeEnv } });
});

app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/leads', require('./routes/leadRoutes'));
app.use('/api/v1/companies', require('./routes/companyRoutes'));
app.use('/api/v1/tasks', require('./routes/taskRoutes'));

app.use((req, res) => res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Route not found' } }));
app.use(errorHandler);

module.exports = app;

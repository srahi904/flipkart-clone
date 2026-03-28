require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const routes = require('./routes');
const logger = require('./middleware/logger');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL?.split(',').map((value) => value.trim()) || '*',
    credentials: true,
  }),
);
app.use(helmet());
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Flipkart Clone API is running',
  });
});

app.use('/api/v1', routes);

if (process.env.NODE_ENV === 'production') {
  const frontendDistPath = path.join(__dirname, '../../frontend/dist');
  
  // Serve static files from the React dist folder
  app.use(express.static(frontendDistPath));

  // Catch-all route to serve React's index.html for SPA routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

app.use(errorHandler);

module.exports = app;

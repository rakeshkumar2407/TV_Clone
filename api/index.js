const express = require('express');
const cors = require('cors');
const channelsHandler = require('./channels');
const countriesHandler = require('./countries');
const filterHandler = require('./filter');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/channels', channelsHandler);
app.get('/api/countries', countriesHandler);
app.get('/api/filter', filterHandler);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`API server is running on http://localhost:${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`  - GET /api/channels`);
  console.log(`  - GET /api/countries`);
  console.log(`  - GET /api/filter?country=US&size=100`);
});

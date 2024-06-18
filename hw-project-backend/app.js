const express = require('express');
const countriesRouter = require('./routes/countries');
const racesRouter = require('./routes/races');
const raceInfoRouter = require('./routes/raceInfo');
const statusRouter = require('./routes/status');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());  // Basic CORS configuration

// Mount routes
app.use('/api/countries', countriesRouter);
app.use('/api/races', racesRouter);
app.use('/api/race-info', raceInfoRouter);
app.use('/api/status', statusRouter);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
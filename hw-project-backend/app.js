// app.js

const express = require('express');
const countriesRouter = require('./routes/countries');
const racesRouter = require('./routes/races');
const raceInfoRouter = require('./routes/raceInfo');
const status = require('./routes/status')
require('dotenv').config();

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Mount route modules
app.use('/api/countries', countriesRouter);
app.use('/api/races', racesRouter);
app.use('/api/race-info', raceInfoRouter);
app.use('/api/status', status);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


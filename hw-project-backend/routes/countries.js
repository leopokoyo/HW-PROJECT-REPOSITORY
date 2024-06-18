// routes/countries.js

const express = require('express');
const db = require('../db/db');

const router = express.Router();

// Route to fetch all countries
router.get('/', async (req, res) => {
    try {
        const countries = await db.any('SELECT * FROM big_mac_data.countries');
        res.json(countries);
    } catch (error) {
        console.error('Error fetching countries:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
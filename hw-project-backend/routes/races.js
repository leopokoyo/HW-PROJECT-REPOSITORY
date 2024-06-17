// routes/races.js

const express = require('express');
const db = require('../db/db');

const router = express.Router();

// Route to fetch all races
router.get('/', async (req, res) => {
    try {
        const races = await db.any('SELECT * FROM big_mac_data.races');
        res.json(races);
    } catch (error) {
        console.error('Error fetching races:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;

// routes/raceInfo.js

const express = require('express');
const db = require('../db/db');

const router = express.Router();

// Route to fetch race info for a specific race ID
router.get('/:raceId', async (req, res) => {
    const { raceId } = req.params;
    try {
        const raceInfo = await db.one('SELECT * FROM big_mac_data.race_info WHERE race_id = $1', [raceId]);
        res.json(raceInfo);
    } catch (error) {
        console.error('Error fetching race info:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;

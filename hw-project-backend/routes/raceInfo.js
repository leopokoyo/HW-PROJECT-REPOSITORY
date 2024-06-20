// routes/raceInfo.js

const express = require('express');
const db = require('../db/db');

const router = express.Router();

// Route to fetch race info for a specific race ID
router.get('/:raceId', async (req, res) => {
    const {raceId} = req.params;
    try {
        const raceInfo = await db.one('SELECT * FROM big_mac_data.races WHERE id = $1', [raceId]);
        res.json(raceInfo);
    } catch (error) {
        console.error('Error fetching race info:', error);
        res.status(500).json({message: 'Internal server error'});
    }
});

// Route to fetch races a specific country participated in
router.get('/country/:countryId', async (req, res) => {
    const {countryId} = req.params;
    try {
        const races = await db.any(
            `SELECT DISTINCT r.* 
             FROM big_mac_data.races r
             JOIN big_mac_data.participates p ON p.rid = r.id
             WHERE r.p1 = $1 OR r.p2 = $1 OR r.p3 = $1 OR r.p4 = $1`,
            [countryId]
        );
        res.json(races);
    } catch (error) {
        console.error('Error fetching races:', error);
        res.status(500).json({message: 'Internal server error'});
    }
});
router.get('/country/:countryId/winner', async (req, res) => {
    const {countryId} = req.params;

    try {
        const races = await db.any(
            `SELECT r.*
            FROM big_mac_data.races r
            WHERE r.p1 = $1`,
            [countryId]
        );
        res.json(races);
    } catch (error) {
        console.error('Error fetching races:', error);
        res.status(500).json({message: 'Internal server error'});
    }
});

module.exports = router;

// routes/races.js

const express = require('express');
const db = require('../db/db');
const {parse} = require("dotenv");

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

router.get('/test', async (req, res) => {
    try {
        const races = await db.any('SELECT * FROM big_mac_data.races r WHERE r.type = $1', ['Test']);

        res.json(races);
    } catch (error) {
        console.error('Error fetching races:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/:c1/:c2/:c3/:c4', async (req, res) => {
    const { c1, c2, c3, c4 } = req.params;

    try {
        await db.tx(async t => {
            // Fetch the last inserted race ID and increment it for the new race
            const lastRaceIdQuery = 'SELECT id FROM big_mac_data.races ORDER BY id DESC LIMIT 1';
            const lastRaceResult = await t.oneOrNone(lastRaceIdQuery);
            const newRaceId = lastRaceResult ? parseInt(lastRaceResult.id) + 1 : 1;

            // Insert a new race into the races table
            const insertRaceQuery = `
                INSERT INTO big_mac_data.races (id, p1, p2, p3, p4, type)
                VALUES ($1, $2, $3, $4, $5, $6)
            `;
            await t.none(insertRaceQuery, [newRaceId, c1, c2, c3, c4, 'Test']); // Adjust type if needed

            // Insert participants into the participates table
            const insertParticipatesQuery = `
                INSERT INTO big_mac_data.participates (cid, rid, place)
                VALUES ($1, $2, 1), ($3, $4, 2), ($5, $6, 3), ($7, $8, 4)
            `;
            await t.none(insertParticipatesQuery, [c1, newRaceId, c2, newRaceId, c3, newRaceId, c4, newRaceId]);
        });

        res.status(201).json({ message: 'Race and participants inserted successfully' });
    } catch (error) {
        console.error('Error in the inserting process:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Functions

const getLastRaceId = async () => {
    try {
        const result = await db.one('SELECT id FROM big_mac_data.races ORDER BY id DESC LIMIT 1');
        console.log('Last race ID:', result.id);
        return result.id;
    } catch (error) {
        console.error('Error fetching last race ID:', error);
        return 1;
    }
}

module.exports = router;

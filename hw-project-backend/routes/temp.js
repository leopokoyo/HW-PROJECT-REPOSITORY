const express = require('express');
const db = require('../db/db');

const router = express.Router();

router.put('/participants/:p1/:p2/:p3/:p4/:raceSeed', async (req, res) => {
    const {p1, p2, p3, p4, raceSeed} = req.params;

    try {
        await db.tx(async t => {
            const updateQuery = `
                UPDATE big_mac_data.temp_participants
                SET p1 = $1, p2 = $2, p3 = $3, p4 = $4, rid=$5
            `;
            await t.none(updateQuery, [p1, p2, p3, p4, raceSeed]);
        });

        res.status(200).json({message: 'Row updated successfully'});
    } catch (error) {
        console.error('Error updating row:', error);
        res.status(500).json({message: 'Internal Server Error'});
    }
});
module.exports = router;

router.get('/participants/', async (req, res) => {
    try {
        const countries_data = await db.any(
            `
            SELECT c.id, c.nr_monthly_bm 
            FROM big_mac_data.countries c, big_mac_data.temp_participants t 
            WHERE c.id = t.p1 OR c.id = t.p2 OR c.id = t.p3 OR c.id = t.p4
        `);
        res.json(countries_data);
    } catch (error) {
        console.error('Error fetching countries data:', error);
        res.status(500).json({message: 'Internal server error'});
    }
});

router.put('/betting/:p1/:p2/:p3/:p4/', async (req, res) => {
    const {p1, p2, p3, p4} = req.params;

    try {
        await db.tx(async t => {
            const updateQuery =`
                UPDATE big_mac_data.temp_betting
                SET p1 = $1, p2 = $2, p3 =$3, p4=$4
            `;
            await t.none(updateQuery, [p1,p2,p3,p4])
            res.status(200).json({message: 'Row updated successfully'});
        });
    } catch (error) {
        console.error('Error updating temp betting:', error);
        res.status(500).json({message:'Internal Server Error'});
    }
})

router.get('/betting/', async (req, res) => {
    try {
        const betting_data = await db.any(
            `
            SELECT * 
            FROM big_mac_data.temp_betting 
        `);
        res.json(betting_data);
    } catch (error) {
        console.error('Error fetching betting data:', error);
        res.status(500).json({message: 'Internal server error'});
    }
});


module.exports = router;
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

router.get('/:countryId', async (req, res) => {

    const { countryId } = req.params;

    try {
        const countries = await db.any('SELECT * FROM big_mac_data.countries WHERE id = $1',
            [countryId]);
        res.json(countries);
    } catch (error) {
        console.error('Error fetching countries:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('', async (req, res) => {


});



module.exports = router;
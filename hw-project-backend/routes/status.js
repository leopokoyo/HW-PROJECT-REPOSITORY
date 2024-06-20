// routes/status.js

const express = require('express');
const db = require('../db/db');

const router = express.Router();

const status = {
    'Status': 'ALIVE'
}

// Route to fetch API status
router.get('/', async (req, res) => {
    try {
        res.json(status);
    } catch (error) {
        console.error('Error: API DISCONNECTED', error);
        res.status(500).json({message: 'Internal server error'});
    }
});

module.exports = router;
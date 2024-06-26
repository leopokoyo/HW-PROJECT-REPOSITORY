const express = require('express');
const db = require('../db/db');

const router = express.Router();

router.put('/participants/:p1/:p2/:p3/:p4/:raceSeed/', async (req, res) => {
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
    const {p1, p2, p3, p4, p1c, p2c, p3c, p4c} = req.params;
    const rid = await get_current_rid();
    console.log(rid)
    try {
        await db.tx(async t => {
            const updateQuery =`
                UPDATE big_mac_data.temp_betting
                SET p1 = $1, p2 = $2, p3 =$3, p4=$4, rid=$5
            `;
            await t.none(updateQuery, [p1,p2,p3,p4, rid])
            res.status(200).json({message: 'Row updated successfully'});
        });
    } catch (error) {
        console.error('Error updating temp betting:', error);
        res.status(500).json({message:'Internal Server Error'});
    }
});

router.put('/betting/countries/:p1c/:p2c/:p3c/:p4c/', async (req, res) => {
    const {p1c, p2c, p3c, p4c} = req.params;
    const rid = await get_current_rid();
    console.log(rid)
    try {
        await db.tx(async t => {
            const updateQuery =`
                UPDATE big_mac_data.temp_selected
                SET p1 = $1, p2 = $2, p3 =$3, p4=$4, rid=$5
            `;
            await t.none(updateQuery, [p1c,p2c,p3c,p4c, rid])
            res.status(200).json({message: 'Row updated successfully'});
        });
    } catch (error) {
        console.error('Error updating temp betting:', error);
        res.status(500).json({message:'Internal Server Error'});
    }
});

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

const getCountryData = async (countryId) => {
    try {
        const countryQuery = `
            SELECT nr_monthly_bm
            FROM big_mac_data.countries
            WHERE id = $1
        `;
        const countryData = await db.oneOrNone(countryQuery, [countryId]);
        return countryData ? countryData.nr_monthly_bm : null;
    } catch (error) {
        console.error('Error fetching country data:', error);
        throw error;
    }
}
const getBettingData = async () => {
    try {
        const bettingDataQuery = `
            SELECT tb.p1 AS bet_p1, tb.p2 AS bet_p2, tb.p3 AS bet_p3, tb.p4 AS bet_p4
            FROM big_mac_data.temp_betting tb
        `;
        const bettingData = await db.oneOrNone(bettingDataQuery);
        return bettingData;
    } catch (error) {
        console.error('Error fetching betting data:', error);
        throw error;
    }
}
const get_current_rid = async () => {
    try {
        const result = await db.one('SELECT rid FROM big_mac_data.temp_participants ORDER BY rid DESC LIMIT 1');
        console.log('Last race ID:', result.rid);
        return result.rid;
    } catch (error) {
        console.error('Error fetching last race ID:', error);
        throw error;
    }
}

const getRaceData = async (raceId) => {
    try {
        const raceQuery = `
            SELECT p1, p2, p3, p4, type
            FROM big_mac_data.races
            WHERE id = $1
        `;
        const raceData = await db.oneOrNone(raceQuery, [raceId]);
        return raceData;
    } catch (error) {
        console.error('Error fetching race data:', error);
        throw error;
    }
}

const calculateBetResults = async (bettingData, winningCountryId) => {
    const result = {
        p1: 0,
        p2: 0,
        p3: 0,
        p4: 0
    };

    // Determine the bet amounts for the winning country
    const nrMonthlyBm = await getCountryData(winningCountryId);
    const participants = await getTempParticipants();

    if (nrMonthlyBm) {
        if (winningCountryId == participants.p1 ) {
            console.log(bettingData.bet_p1)
            result.p1 = bettingData.bet_p1 * (1 + (1 / (nrMonthlyBm / (31 * 24))));
        }
        if (winningCountryId == participants.p2) {
            result.p2 = bettingData.bet_p2 * (1 + (1 / (nrMonthlyBm / (31 * 24))));
        }
        if (winningCountryId == participants.p3) {
            result.p3 = bettingData.bet_p3 * (1 + (1 / (nrMonthlyBm / (31 * 24))));
        }
        if (winningCountryId == participants.p4) {
            result.p4 = bettingData.bet_p4 * (1 + (1 / (nrMonthlyBm / (31 * 24))));
        }
    }
    return result;
}

const getTempParticipants = async () => {
    try {
        const tempData = await db.oneOrNone(`SELECT * FROM big_mac_data.temp_participants`);
        console.log(`ID's:`, tempData.p1, tempData.p2, tempData.p3, tempData.p4);
        return tempData;
    } catch (error) {

    }
}

const getWinnerFromParticipants = async (raceId) => {
    try {
        const winnerQuery = `
            SELECT p1 AS winner
            FROM big_mac_data.races
            WHERE id = $1
            ORDER BY id ASC
            LIMIT 1
        `;
        const winnerData = await db.oneOrNone(winnerQuery, [raceId]);
        console.log(`Winner:`, winnerData.winner);
        return winnerData ? winnerData.winner : null;
    } catch (error) {
        console.error('Error fetching winner from participants:', error);
        throw error;
    }
}
router.get('/bet-summary', async (req, res) => {
    try {
        // Get the current race ID
        const currentRid = await get_current_rid();

        // Fetch the winner from temp_participants
        const winningCountryId = await getWinnerFromParticipants(currentRid);

        if (!winningCountryId) {
            return res.status(404).json({ message: 'No winner found for the current race' });
        }

        // Fetch the betting data
        const bettingData = await getBettingData();

        if (!bettingData) {
            return res.status(404).json({ message: 'No betting data found' });
        }

        // Calculate the betting results
        const result = await calculateBetResults(bettingData, winningCountryId);

        res.json(result);
    } catch (error) {
        console.error('Error fetching bet summary:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;

module.exports = router;
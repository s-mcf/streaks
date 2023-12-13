import express from 'express';
import { Pool } from 'pg';

const app = express();
const cors = require('cors');
const port = 3000;
const pool = new Pool({
    database: 'streaks'
});

app.use(express.json());
app.use(cors());

app.post('/press', async (req, res) => {
    try {
        const client = await pool.connect();
        // Ensure that the date is in the correct time zone
        const currentDate = new Date().toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles' });

        const checkPressResult = await client.query('SELECT * FROM presses WHERE DATE(press_time) = $1', [currentDate]);

        if (checkPressResult.rowCount && checkPressResult.rowCount > 0) {
            res.status(400).json({ message: 'Button has already been pressed today.' });
        } else {
            await client.query('INSERT INTO presses (press_time) VALUES (NOW())');
            res.status(200).json({ message: 'Press recorded successfully.' });
        }

        client.release();
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
});

// The current status query is returned in this format
type StreakInfo = {
    current_streak: number;
    longest_streak: number;
    points: number;
    is_current: boolean;
    has_live_streak: boolean;
};

app.get('/info', async (req, res) => {
    try {
        const client = await pool.connect();

        // Combined call to all stored procedures
        const combinedResult = await client.query<StreakInfo>(`
            SELECT getMostRecentStreakLength() AS current_streak,
                   getLongestStreakLength() AS longest_streak,
                   hasLiveStreak() AS has_live_streak,
                   calculateTotalPoints() AS points,
                   EXISTS (
                    SELECT 1 FROM presses
                    WHERE press_time::date = CURRENT_DATE
                ) AS is_current;
        `);

        // Extract values from the combined result
        const result = combinedResult.rows[0];

        client.release();

        // Send response
        res.status(200).json({
            currentStreak: result.current_streak,
            longestStreak: result.longest_streak,
            points: result.points,
            isCurrent: result.is_current,
            isLive: result.has_live_streak,
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


import express from 'express';
import { Pool } from 'pg';

const app = express();
const port = 3000;
const pool = new Pool({
    database: 'streaks'
});

app.use(express.json());

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

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


DELETE FROM presses;

WITH streak_data (start_date, streak_length, gap_after) AS (
    VALUES
    (CURRENT_DATE - INTERVAL '24 days', 8),
    (CURRENT_DATE - INTERVAL '10 days', 10)
)
INSERT INTO presses (press_time)
SELECT sd.start_date + gs.day * INTERVAL '1 day' + INTERVAL '14 hours' AS press_time
FROM streak_data sd
CROSS JOIN LATERAL generate_series(0, sd.streak_length - 1) AS gs(day)
ORDER BY press_time;


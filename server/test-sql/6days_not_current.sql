DELETE FROM presses;

INSERT INTO presses (press_time)
SELECT
  generate_series(
    CURRENT_DATE - INTERVAL '6 days', -- start 6 days ago
    CURRENT_DATE - INTERVAL '1 day', -- end yesterday
    '1 day' -- 1 day interval
  ) + INTERVAL '14 hours'; -- Set the time to 2pm


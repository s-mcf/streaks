DELETE FROM presses;

INSERT INTO presses (press_time)
SELECT
  generate_series(
    CURRENT_DATE - INTERVAL '22 day', -- start date
    CURRENT_DATE, -- end date
    '1 day' -- interval
  ) + INTERVAL '14 hour' -- add 14 hours to make it 2pm


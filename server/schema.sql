CREATE TABLE IF NOT EXISTS presses (
    id SERIAL PRIMARY KEY,
    press_time TIMESTAMP NOT NULL
);


CREATE OR REPLACE FUNCTION calculateTotalPoints() RETURNS INTEGER AS $$
DECLARE
    total_points INTEGER := 0;
    streak_count INTEGER := 0;
    previous_press DATE := NULL;
    current_press RECORD;
BEGIN
    -- Loop through all presses ordered by press_time
    FOR current_press IN SELECT press_time::DATE FROM presses ORDER BY press_time
    LOOP
        -- Initialize streak count or increment if presses are consecutive
        IF previous_press IS NULL OR previous_press + INTERVAL '1 day' = current_press.press_time THEN
            streak_count := streak_count + 1;
        ELSE
            streak_count := 1; -- Reset streak count if not consecutive
        END IF;

        -- Add points for each press
        total_points := total_points + 1;

        -- Check for every 7 day streak and add bonus points
        IF streak_count = 7 THEN
            total_points := total_points + 5; -- Add bonus points
            streak_count := 0; -- Reset streak count after applying bonus
        END IF;

        previous_press := current_press.press_time; -- Set previous_press for the next iteration
    END LOOP;

    RETURN total_points;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION getCurrentStreakLength() RETURNS INTEGER AS $$
DECLARE
    streak INTEGER := 0; -- Initialize the streak counter
    last_press DATE; -- Keep track of the date of the last press
    press_date DATE; -- Variable to iterate over the press dates
BEGIN
    -- Get the date of the last press
    SELECT press_time::DATE INTO last_press FROM presses ORDER BY press_time DESC LIMIT 1;

    -- If there was no press at all, return 0
    IF last_press IS NULL THEN
        RETURN 0;
    END IF;

    -- If the last press is before today, check if the streak is broken
    IF last_press < CURRENT_DATE THEN
        -- Check if the last press was yesterday; if not, the streak has ended
        IF CURRENT_DATE - last_press > 1 THEN
            RETURN 0; -- The streak is broken
        ELSE
            streak := 1; -- Start streak since the last press was yesterday
        END IF;
    ELSE
        streak := 1; -- The last press is today, so the streak starts
    END IF;

    -- Iterate over the presses in descending order starting with the day before the last press
    FOR press_date IN SELECT press_time::DATE FROM presses WHERE press_time::DATE < last_press ORDER BY press_time DESC
    LOOP
        -- Check if the press is consecutive with respect to the last press
        IF last_press - press_date = 1 THEN
            streak := streak + 1; -- Increment streak as days are consecutive
        ELSE
            EXIT; -- Exit the loop as we found a day that breaks the streak
        END IF;
        last_press := press_date; -- Set the current press_date as last_press for next iteration
    END LOOP;

    RETURN streak; -- Return the total streak count
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION getLastStreakLength() RETURNS INTEGER AS $$
DECLARE
    streak INTEGER := 0;
    last_streak INTEGER := 0;
    previous_date DATE := NULL;
    press_date DATE;
BEGIN
    FOR press_date IN SELECT press_time::DATE FROM presses ORDER BY press_time DESC
    LOOP
        IF previous_date IS NULL THEN
            streak := 1;
        ELSIF previous_date - INTERVAL '1 day' = press_date THEN
            streak := streak + 1;
        ELSE
            -- When a gap is found and it's the first gap since a streak
            IF last_streak = 0 AND streak > 1 THEN
                last_streak := streak;
            END IF;
            streak := 1;
        END IF;
        previous_date := press_date;
    END LOOP;

    -- Check if the current date is part of the ongoing streak
    IF previous_date = CURRENT_DATE - INTERVAL '1 day' THEN
        RETURN last_streak;
    ELSE
        -- If the current date is not part of the streak, then the ongoing streak is actually the last streak
        RETURN streak;
    END IF;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION getLongestStreakLength() RETURNS INTEGER AS $$
DECLARE
    longest_streak INTEGER := 0;
    current_streak INTEGER := 0;
    prev_press DATE;
    curr_press DATE;
BEGIN
    FOR curr_press IN SELECT press_time::DATE FROM presses ORDER BY press_time DESC
    LOOP
        IF prev_press IS NOT NULL AND prev_press - INTERVAL '1 day' = curr_press THEN
            current_streak := current_streak + 1;
        ELSE
            current_streak := 1;
        END IF;
        longest_streak := GREATEST(longest_streak, current_streak);
        prev_press := curr_press;
    END LOOP;
    RETURN longest_streak;
END;
$$ LANGUAGE plpgsql;


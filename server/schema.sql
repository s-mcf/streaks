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
    streak INTEGER := 0;
    prev_press DATE;
    curr_press DATE;
BEGIN
    FOR curr_press IN SELECT press_time::DATE FROM presses ORDER BY press_time DESC
    LOOP
        IF prev_press IS NULL THEN
            streak := 1;
        ELSIF prev_press - INTERVAL '1 day' = curr_press THEN
            streak := streak + 1;
        ELSE
            RETURN streak;
        END IF;
        prev_press := curr_press;
    END LOOP;
    RETURN streak;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION getLastStreakLength() RETURNS INTEGER AS $$
DECLARE
    streak INTEGER := 0;
    prev_press DATE;
    curr_press DATE;
    is_current_streak BOOLEAN := TRUE;
BEGIN
    FOR curr_press IN SELECT press_time::DATE FROM presses ORDER BY press_time DESC
    LOOP
        IF is_current_streak THEN
            IF prev_press IS NOT NULL AND prev_press - INTERVAL '1 day' != curr_press THEN
                is_current_streak := FALSE;
                streak := 0;
            END IF;
        ELSE
            IF prev_press IS NOT NULL AND prev_press - INTERVAL '1 day' = curr_press THEN
                streak := streak + 1;
            ELSEIF prev_press IS NOT NULL THEN
                RETURN streak;
            END IF;
        END IF;
        prev_press := curr_press;
    END LOOP;
    RETURN streak;
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


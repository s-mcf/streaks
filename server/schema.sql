CREATE TABLE IF NOT EXISTS presses (
    id SERIAL PRIMARY KEY,
    press_time TIMESTAMP NOT NULL
);

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


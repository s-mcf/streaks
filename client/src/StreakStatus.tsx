import React, { useEffect, useState } from 'react';

type StreakStatusProps = {
    currentStreak: number;
    lastStreak: number;
    longestStreak: number;
};

const StreakStatus: React.FC<StreakStatusProps> = ({ currentStreak, lastStreak, longestStreak }) => {
    const [animatedValue, setAnimatedValue] = useState({ currentStreak, lastStreak, longestStreak });

    useEffect(() => {
        // Trigger the roll-in animation by updating state
        setAnimatedValue({ currentStreak, lastStreak, longestStreak });
    }, [currentStreak, lastStreak, longestStreak]);

    return (
        <div className="flex justify-around my-4">
            <StreakNumber title="Current Streak" value={animatedValue.currentStreak} />
            <StreakNumber title="Last Streak" value={animatedValue.lastStreak} />
            <StreakNumber title="Longest Streak" value={animatedValue.longestStreak} />
        </div>
    );
};

const StreakNumber: React.FC<{ title: string; value: number }> = ({ title, value }) => {
    return (
        <div className="text-center">
            <div className="text-4xl md:text-6xl font-bold">
                {value}
            </div>
            <div className="text-lg md:text-xl mt-2">
                {title}
            </div>
        </div>
    );
};

export default StreakStatus;

import React from 'react';

type StreakGridProps = {
    currentStreak: number;
};

const StreakGrid: React.FC<StreakGridProps> = ({ currentStreak }) => {
    // Calculate the number of weeks (rows)
    const weeks = Math.ceil(currentStreak / 7);

    // Generate the grid
    const grid = [];
    for (let week = 0; week < weeks; week++) {
        const days = [];
        for (let day = 0; day < 7; day++) {
            const isFilled = week * 7 + day < currentStreak;
            days.push(
                <div key={week * 7 + day} className={`circle ${isFilled ? 'filled' : ''}`}></div>
            );
        }
        grid.push(<div key={week} className="week">{days}</div>);
    }

    // Add an extra row if the current streak is a multiple of 7
    if (currentStreak % 7 === 0) {
        const emptyWeek = Array.from({ length: 7 }, (_, index) => (
            <div key={weeks * 7 + index} className="circle"></div>
        ));
        grid.push(<div key={weeks} className="week">{emptyWeek}</div>);
    }

    return (
        <div className="streak-grid">
            {grid}
        </div>
    );
};

export default StreakGrid;


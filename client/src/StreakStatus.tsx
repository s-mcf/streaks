type StreakStatusProps = {
    currentStreak: number;
    isLive: boolean;
    longestStreak: number;
};

const StreakStatus: React.FC<StreakStatusProps> = ({ currentStreak, isLive, longestStreak }) => {
    return (
        <div className="flex justify-around my-4 space-x-4 md:space-x-8">
            <StreakNumber title="Current Streak" value={isLive ? currentStreak : 0} />
            {!isLive && currentStreak > 0 && <StreakNumber title="Your Last Streak :(" value={currentStreak} />}
            <StreakNumber title="Longest Streak" value={longestStreak} />
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

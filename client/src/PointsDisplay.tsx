import React from 'react';

type PointsDisplayProps = {
    points: number;
};

const PointsDisplay: React.FC<PointsDisplayProps> = ({ points }) => {
    return (
        <div className="text-2xl">
            ${points}
        </div>
    );
};

export default PointsDisplay;

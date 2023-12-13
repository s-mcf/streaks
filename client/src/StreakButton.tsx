import React from 'react';

type StreakButtonProps = {
    isClicked: boolean;
    onClick: () => void;
};

const StreakButton: React.FC<StreakButtonProps> = ({ isClicked, onClick }) => {
    return (
        <button 
            onClick={onClick} 
            disabled={isClicked}
            className={`streak-button ${isClicked ? 'clicked' : ''}`}
        >
            {isClicked ? 'Clicked!' : 'Click Me'}
        </button>
    );
};

export default StreakButton;

import React from 'react';

type StreakButtonProps = {
    isClicked: boolean;
    onClick: () => void;
};

const StreakButton: React.FC<StreakButtonProps> = ({ isClicked, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`m-auto block h-32 w-32 md:h-48 md:w-48 rounded-full transition-all duration-300 ease-in-out ${
                isClicked ? 'bg-green-500 transform scale-110' : 'bg-gray-200 hover:bg-gray-300'
            }`}
            disabled={isClicked}
        >
            {/* Empty button, no text */}
        </button>
    );
};

export default StreakButton;

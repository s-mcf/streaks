import React, { useState, useEffect } from 'react';
import StreakGrid from './StreakGrid';
import StreakButton from './StreakButton';
import './App.css';

const API_URL = "http://localhost:3000";

const App: React.FC = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    // Fetch the streak information on component mount
    const fetchStreakInfo = async () => {
      try {
        const response = await fetch(`${API_URL}/info`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setIsClicked(data.currentStreak > 0);
        setCurrentStreak(data.currentStreak);
      } catch (error) {
        console.error('Failed to fetch streak information:', error);
      }
    };

    fetchStreakInfo();
  }, []);

  const handleButtonClick = async () => {
    try {
      const response = await fetch(`${API_URL}/press`, { method: 'POST' });
      if (response.ok) {
        setCurrentStreak(currentStreak + 1);
        setIsClicked(true);
      } else {
        console.error('Failed to record the button press');
      }
    } catch (error) {
      console.error('Error during button press:', error);
    }
  };

  return (
    <div>
      <StreakButton
        isClicked={isClicked}
        onClick={handleButtonClick}
      />
      <StreakGrid currentStreak={currentStreak} />
    </div>
  );
};

export default App;

import React, { useState, useEffect } from 'react';
import StreakGrid from './StreakGrid';
import StreakButton from './StreakButton';
import './App.css';
import StreakStatus from './StreakStatus';

const API_URL = "http://localhost:3000";

const App: React.FC = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [lastStreak, setLastStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  useEffect(() => {
    fetchStreakInfo();
  }, []);

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
      setLastStreak(data.lastStreak);
      setLongestStreak(data.longestStreak);
    } catch (error) {
      console.error('Failed to fetch streak information:', error);
    }
  };

  const handleButtonClick = async () => {
    try {
      const response = await fetch(`${API_URL}/press`, { method: 'POST' });
      if (response.ok) {
        fetchStreakInfo();
        setIsClicked(true);
      } else {
        console.error('Failed to record the button press');
      }
    } catch (error) {
      console.error('Error during button press:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-4 md:p-6">
        <StreakButton
          isClicked={isClicked}
          onClick={handleButtonClick}
        />
      </div>
      <div className="p-4 md:p-6">
        <StreakGrid currentStreak={currentStreak} />
      </div>
      <div className="p-4 md:p-6">
        <StreakStatus
          currentStreak={currentStreak}
          lastStreak={lastStreak}
          longestStreak={longestStreak}
        />
      </div>
    </div>
  );
};

export default App;

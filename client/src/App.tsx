import React, { useState, useEffect } from 'react';
import StreakGrid from './StreakGrid';
import StreakButton from './StreakButton';
import './App.css';
import StreakStatus from './StreakStatus';
import PointsDisplay from './PointsDisplay';

const API_URL = "http://localhost:3000";

const App: React.FC = () => {
  // Have we clicked the button today?
  const [isClicked, setIsClicked] = useState(false);
  // Do we currently have a streak?
  const [isLive, setIsLive] = useState(false);
  // How long is our most recent streak?
  const [currentStreak, setCurrentStreak] = useState(0);
  // Length of our longest ever streak
  const [longestStreak, setLongestStreak] = useState(0);
  // Coins we have
  const [points, setPoints] = useState(0);

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
      setIsClicked(data.isCurrent);
      setCurrentStreak(data.currentStreak);
      setIsLive(data.isLive);
      setLongestStreak(data.longestStreak);
      setPoints(data.points);
    } catch (error) {
      console.error('Failed to fetch streak information:', error);
    }
  };

  const handleButtonClick = async () => {
    try {
      const response = await fetch(`${API_URL}/press`, { method: 'POST' });
      if (response.ok) {
        setIsClicked(true);
        fetchStreakInfo();
      } else {
        console.error('Failed to record the button press');
      }
    } catch (error) {
      console.error('Error during button press:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex justify-end p-4 md:p-6 bg-gray-200">
        <PointsDisplay points={points} />
      </div>
      <div className="flex-grow flex flex-col items-center justify-center">
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
            longestStreak={longestStreak}
            isLive={isLive}
          />
        </div>
      </div>
    </div>
  );
};

export default App;

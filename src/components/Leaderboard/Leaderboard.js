import React, { useState, useEffect } from 'react';
import '../../styles/Leaderboard.css';

const Leaderboard = () => {
  const [difficulty, setDifficulty] = useState('Easy');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock leaderboard data - in a real app, this would come from an API
  const mockLeaderboard = {
    'Easy': [
      { username: 'sudokuMaster', best_time: 120 },
      { username: 'puzzleLover', best_time: 145 },
      { username: 'numberWizard', best_time: 180 },
      { username: 'logicFan', best_time: 210 },
      { username: 'brainTrainer', best_time: 240 },
    ],
    'Medium': [
      { username: 'sudokuMaster', best_time: 240 },
      { username: 'puzzleKing', best_time: 275 },
      { username: 'numberWizard', best_time: 310 },
      { username: 'logicQueen', best_time: 350 },
      { username: 'brainTrainer', best_time: 390 },
    ],
    'Hard': [
      { username: 'sudokuMaster', best_time: 420 },
      { username: 'puzzleKing', best_time: 450 },
      { username: 'logicQueen', best_time: 480 },
      { username: 'brainGenius', best_time: 510 },
      { username: 'numberWizard', best_time: 540 },
    ],
    'Expert': [
      { username: 'sudokuMaster', best_time: 600 },
      { username: 'puzzleKing', best_time: 650 },
      { username: 'logicQueen', best_time: 700 },
      { username: 'brainGenius', best_time: 750 },
      { username: 'numberWizard', best_time: 800 },
    ],
  };

  useEffect(() => {
    // Simulate API call to get leaderboard data
    setIsLoading(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      setLeaderboardData(mockLeaderboard[difficulty] || []);
      setIsLoading(false);
    }, 500);
  }, [difficulty, mockLeaderboard]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const difficultyOptions = ['Easy', 'Medium', 'Hard', 'Expert'];

  return (
    <div className="leaderboard" id="leaderboard">
      <h2>Leaderboard</h2>
      
      <div className="leaderboard-controls">
        <label htmlFor="leaderboard-difficulty">Difficulty:</label>
        <select 
          id="leaderboard-difficulty" 
          value={difficulty} 
          onChange={(e) => setDifficulty(e.target.value)}
        >
          {difficultyOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
      
      {isLoading ? (
        <div className="leaderboard-loading">Loading leaderboard...</div>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((entry, index) => (
              <tr key={index} className={index === 0 ? 'first-place' : ''}>
                <td>{index + 1}</td>
                <td>{entry.username}</td>
                <td>{formatTime(entry.best_time)}</td>
              </tr>
            ))}
            {leaderboardData.length === 0 && (
              <tr>
                <td colSpan="3">No records found for this difficulty</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Leaderboard; 
import React from 'react';
import '../../styles/SudokuBoard.css';

const Controls = ({ 
  onNewGame, 
  onHint, 
  onCheck, 
  onReset, 
  onSave,
  difficulty,
  setDifficulty,
  timer,
  hintsUsed,
  hintsAvailable
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const difficultyOptions = ['Easy', 'Medium', 'Hard', 'Expert'];

  return (
    <div className="sudoku-controls">
      <div className="controls-top">
        <div className="timer">
          <span className="timer-label">Time:</span>
          <span className="timer-value">{formatTime(timer)}</span>
        </div>
        
        <div className="hints">
          <span className="hints-label">Hints:</span>
          <span className="hints-value">{hintsAvailable - hintsUsed}/{hintsAvailable}</span>
        </div>
      </div>
      
      <div className="difficulty-selector">
        <label htmlFor="difficulty">Difficulty:</label>
        <select 
          id="difficulty" 
          value={difficulty} 
          onChange={(e) => setDifficulty(e.target.value)}
        >
          {difficultyOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
      
      <div className="control-buttons">
        <button onClick={onNewGame} className="control-button">
          New Game
        </button>
        
        <button 
          onClick={onHint} 
          className="control-button"
          disabled={hintsUsed >= hintsAvailable}
        >
          Hint
        </button>
        
        <button onClick={onCheck} className="control-button">
          Check
        </button>
        
        <button onClick={onReset} className="control-button">
          Reset
        </button>
        
        <button onClick={onSave} className="control-button">
          Save
        </button>
      </div>
    </div>
  );
};

export default Controls; 
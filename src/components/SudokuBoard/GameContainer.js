import React, { useState, useEffect, useCallback } from 'react';
import Board from './Board';
import Controls from './Controls';
import { listPuzzles, getUserProgress } from '../../api';
import '../../styles/SudokuBoard.css';

const GameContainer = ({ user }) => {
  const [puzzle, setPuzzle] = useState(null);
  const [currentBoard, setCurrentBoard] = useState([]);
  const [difficulty, setDifficulty] = useState('Easy');
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [solution, setSolution] = useState(null);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Max hints based on difficulty
  const hintsAvailable = {
    'Easy': 5,
    'Medium': 3,
    'Hard': 2,
    'Expert': 1
  }[difficulty] || 3;

  // Define fetchUserProgress outside useEffect so it can be included in dependencies
  const fetchUserProgress = useCallback(async () => {
    if (!user) return;
    
    try {
      const progress = await getUserProgress(user.id);
      // We'll use this data in future features
      console.log('User progress:', progress);
    } catch (error) {
      console.error('Error fetching user progress:', error);
    }
  }, [user]);

  // Fetch user progress when user changes
  useEffect(() => {
    if (user) {
      fetchUserProgress();
    }
  }, [user, fetchUserProgress]);

  // Start a new game
  const startNewGame = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch a puzzle with the selected difficulty
      const puzzles = await listPuzzles(difficulty);
      
      if (puzzles && puzzles.data && puzzles.data.length > 0) {
        // Select a random puzzle from the results
        const randomIndex = Math.floor(Math.random() * puzzles.data.length);
        const selectedPuzzle = puzzles.data[randomIndex];
        
        setPuzzle(selectedPuzzle);
        
        // Parse the puzzle and solution
        const puzzleData = JSON.parse(selectedPuzzle.puzzle_data);
        const solutionData = JSON.parse(selectedPuzzle.solution_data);
        
        setCurrentBoard(puzzleData.grid.map(row => [...row]));
        setSolution(solutionData.grid);
        
        // Reset game state
        setTimer(0);
        setHintsUsed(0);
        setIsGameComplete(false);
        
        // Start the timer
        if (timerInterval) {
          clearInterval(timerInterval);
        }
        
        const interval = setInterval(() => {
          setTimer(prevTimer => prevTimer + 1);
        }, 1000);
        
        setTimerInterval(interval);
      }
    } catch (error) {
      console.error('Error starting new game:', error);
      alert('Failed to load puzzle. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [difficulty, timerInterval]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  // Start a new game when difficulty changes
  useEffect(() => {
    startNewGame();
  }, [difficulty, startNewGame]);

  // Handle cell value change
  const handleCellValueChange = (row, col, value) => {
    const newBoard = currentBoard.map(r => [...r]);
    newBoard[row][col] = value;
    setCurrentBoard(newBoard);
    
    // Check if the game is complete
    checkGameCompletion(newBoard);
  };

  // Validate a move
  const validateMove = (row, col, value, board) => {
    if (value === 0) return true; // Empty cell is always valid
    
    // Check row
    for (let i = 0; i < 9; i++) {
      if (i !== col && board[row][i] === value) {
        return false;
      }
    }
    
    // Check column
    for (let i = 0; i < 9; i++) {
      if (i !== row && board[i][col] === value) {
        return false;
      }
    }
    
    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    
    for (let i = boxRow; i < boxRow + 3; i++) {
      for (let j = boxCol; j < boxCol + 3; j++) {
        if ((i !== row || j !== col) && board[i][j] === value) {
          return false;
        }
      }
    }
    
    return true;
  };

  // Check if the game is complete
  const checkGameCompletion = (board) => {
    if (!solution) return false;
    
    // Check if all cells are filled
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] === 0) {
          return false;
        }
      }
    }
    
    // Check if all cells match the solution
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] !== solution[i][j]) {
          return false;
        }
      }
    }
    
    // Game is complete
    setIsGameComplete(true);
    
    // Stop the timer
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    // Show completion message
    alert(`Congratulations! You completed the ${difficulty} puzzle in ${formatTime(timer)}!`);
    
    return true;
  };

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Provide a hint
  const handleHint = () => {
    if (hintsUsed >= hintsAvailable) {
      alert('No more hints available!');
      return;
    }
    
    if (!solution) {
      alert('Cannot provide hint at this time.');
      return;
    }
    
    // Find an empty or incorrect cell
    const emptyCells = [];
    
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (currentBoard[i][j] === 0 || currentBoard[i][j] !== solution[i][j]) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }
    
    if (emptyCells.length === 0) {
      alert('No cells need hints!');
      return;
    }
    
    // Select a random cell to give a hint for
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];
    
    // Update the board with the correct value
    const newBoard = currentBoard.map(r => [...r]);
    newBoard[row][col] = solution[row][col];
    setCurrentBoard(newBoard);
    
    // Increment hints used
    setHintsUsed(hintsUsed + 1);
    
    // Check if the game is complete
    checkGameCompletion(newBoard);
  };

  // Check the current board for errors
  const handleCheck = () => {
    if (!solution) {
      alert('Cannot check puzzle at this time.');
      return;
    }
    
    let errors = 0;
    
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (currentBoard[i][j] !== 0 && currentBoard[i][j] !== solution[i][j]) {
          errors++;
        }
      }
    }
    
    if (errors === 0) {
      alert('No errors found! Keep going!');
    } else {
      alert(`Found ${errors} error${errors === 1 ? '' : 's'}. Keep trying!`);
    }
  };

  // Reset the board to initial state
  const handleReset = () => {
    if (puzzle) {
      try {
        const puzzleData = JSON.parse(puzzle.puzzle_data);
        setCurrentBoard(puzzleData.grid.map(row => [...row]));
        setHintsUsed(0);
      } catch (error) {
        console.error('Error resetting board:', error);
        alert('Failed to reset the board. Please try again.');
      }
    }
  };

  // Save the current game progress
  const handleSave = () => {
    if (!user) {
      alert('Please log in to save your progress');
      return;
    }
    
    // Here you would call an API to save the game progress
    alert('Game progress saved!');
  };

  return (
    <div className="game-container">
      <h1>Sudoku</h1>
      
      {isGameComplete && (
        <div className="completion-message">
          Puzzle Completed!
        </div>
      )}
      
      <Controls
        onNewGame={startNewGame}
        onHint={handleHint}
        onCheck={handleCheck}
        onReset={handleReset}
        onSave={handleSave}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        timer={timer}
        hintsUsed={hintsUsed}
        hintsAvailable={hintsAvailable}
      />
      
      {isLoading ? (
        <div className="loading-message">Loading puzzle...</div>
      ) : puzzle ? (
        <Board
          puzzle={puzzle}
          onCellValueChange={handleCellValueChange}
          validateMove={validateMove}
        />
      ) : (
        <div className="loading-message">No puzzles available. Please try again.</div>
      )}
    </div>
  );
};

export default GameContainer; 
import React, { useState, useEffect, useCallback } from 'react';
import Cell from './Cell';
import '../../styles/SudokuBoard.css';

const Board = ({ puzzle, onCellValueChange, validateMove }) => {
  const [board, setBoard] = useState(Array(9).fill().map(() => Array(9).fill(0)));
  const [initialBoard, setInitialBoard] = useState(Array(9).fill().map(() => Array(9).fill(0)));
  const [selectedCell, setSelectedCell] = useState(null);
  const [invalidCells, setInvalidCells] = useState([]);

  // Initialize board when puzzle changes
  useEffect(() => {
    if (puzzle && puzzle.puzzle_data) {
      try {
        const parsedPuzzle = JSON.parse(puzzle.puzzle_data);
        if (parsedPuzzle && parsedPuzzle.grid) {
          setBoard(parsedPuzzle.grid.map(row => [...row]));
          setInitialBoard(parsedPuzzle.grid.map(row => [...row]));
          setSelectedCell(null);
          setInvalidCells([]);
        } else {
          console.error('Invalid puzzle data format');
        }
      } catch (error) {
        console.error('Error parsing puzzle data:', error);
      }
    }
  }, [puzzle]);

  const handleCellClick = (rowIndex, colIndex) => {
    // Can't select initial cells
    if (initialBoard[rowIndex][colIndex] !== 0) {
      return;
    }
    
    setSelectedCell({ row: rowIndex, col: colIndex });
  };

  // Use useCallback to memoize the handleKeyDown function
  const handleKeyDown = useCallback((e) => {
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    
    // Only allow numbers 1-9 and backspace/delete
    if ((e.key >= '1' && e.key <= '9') || e.key === 'Backspace' || e.key === 'Delete') {
      const newValue = e.key === 'Backspace' || e.key === 'Delete' ? 0 : parseInt(e.key, 10);
      
      // Create a new board with the updated value
      const newBoard = board.map(r => [...r]);
      newBoard[row][col] = newValue;
      
      // Validate the move
      const isValid = validateMove(row, col, newValue, board);
      
      // Update invalid cells
      if (!isValid && newValue !== 0) {
        setInvalidCells(prev => [...prev.filter(cell => !(cell.row === row && cell.col === col)), { row, col }]);
      } else {
        setInvalidCells(prev => prev.filter(cell => !(cell.row === row && cell.col === col)));
      }
      
      // Update the board
      setBoard(newBoard);
      
      // Notify parent component
      onCellValueChange(row, col, newValue);
    }
    
    // Arrow key navigation
    if (e.key === 'ArrowUp' && row > 0) {
      let newRow = row - 1;
      while (newRow >= 0 && initialBoard[newRow][col] !== 0) {
        newRow--;
      }
      if (newRow >= 0) {
        setSelectedCell({ row: newRow, col });
      }
    } else if (e.key === 'ArrowDown' && row < 8) {
      let newRow = row + 1;
      while (newRow < 9 && initialBoard[newRow][col] !== 0) {
        newRow++;
      }
      if (newRow < 9) {
        setSelectedCell({ row: newRow, col });
      }
    } else if (e.key === 'ArrowLeft' && col > 0) {
      let newCol = col - 1;
      while (newCol >= 0 && initialBoard[row][newCol] !== 0) {
        newCol--;
      }
      if (newCol >= 0) {
        setSelectedCell({ row, col: newCol });
      }
    } else if (e.key === 'ArrowRight' && col < 8) {
      let newCol = col + 1;
      while (newCol < 9 && initialBoard[row][newCol] !== 0) {
        newCol++;
      }
      if (newCol < 9) {
        setSelectedCell({ row, col: newCol });
      }
    }
  }, [selectedCell, board, initialBoard, validateMove, onCellValueChange]);

  // Set up keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Find related cells (same row, column, or 3x3 box)
  const getRelatedCells = (row, col) => {
    if (!selectedCell) return false;
    
    // Same row or column
    if (row === selectedCell.row || col === selectedCell.col) {
      return true;
    }
    
    // Same 3x3 box
    const boxRow = Math.floor(selectedCell.row / 3);
    const boxCol = Math.floor(selectedCell.col / 3);
    const cellBoxRow = Math.floor(row / 3);
    const cellBoxCol = Math.floor(col / 3);
    
    return boxRow === cellBoxRow && boxCol === cellBoxCol;
  };

  // Find cells with the same value as selected cell
  const getHighlightedCells = (row, col) => {
    if (!selectedCell || board[selectedCell.row][selectedCell.col] === 0) return false;
    
    return board[row][col] === board[selectedCell.row][selectedCell.col];
  };

  // Check if cell is invalid
  const isInvalidCell = (row, col) => {
    return invalidCells.some(cell => cell.row === row && cell.col === col);
  };

  return (
    <div className="sudoku-board" tabIndex="0">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="sudoku-row">
          {row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              value={cell}
              isInitial={initialBoard[rowIndex][colIndex] !== 0}
              isSelected={selectedCell && selectedCell.row === rowIndex && selectedCell.col === colIndex}
              isInvalid={isInvalidCell(rowIndex, colIndex)}
              isHighlighted={selectedCell && getHighlightedCells(rowIndex, colIndex)}
              isRelated={selectedCell && getRelatedCells(rowIndex, colIndex)}
              onClick={handleCellClick}
              rowIndex={rowIndex}
              colIndex={colIndex}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board; 
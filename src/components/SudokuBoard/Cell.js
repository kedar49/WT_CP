import React from 'react';
import '../../styles/SudokuBoard.css';

const Cell = ({ 
  value, 
  isInitial, 
  isSelected, 
  isInvalid,
  isHighlighted,
  isRelated,
  onClick,
  rowIndex,
  colIndex 
}) => {
  // Determine cell position for styling borders
  const isLeftBorder = colIndex % 3 === 0;
  const isRightBorder = colIndex % 3 === 2;
  const isTopBorder = rowIndex % 3 === 0;
  const isBottomBorder = rowIndex % 3 === 2;

  // Determine cell className based on props
  const cellClassName = `
    sudoku-cell
    ${isInitial ? 'initial' : ''}
    ${isSelected ? 'selected' : ''}
    ${isInvalid ? 'invalid' : ''}
    ${isHighlighted ? 'highlighted' : ''}
    ${isRelated ? 'related' : ''}
    ${isLeftBorder ? 'left-border' : ''}
    ${isRightBorder ? 'right-border' : ''}
    ${isTopBorder ? 'top-border' : ''}
    ${isBottomBorder ? 'bottom-border' : ''}
  `;

  return (
    <div 
      className={cellClassName}
      onClick={() => onClick(rowIndex, colIndex)}
    >
      {value !== 0 ? value : ''}
    </div>
  );
};

export default Cell; 
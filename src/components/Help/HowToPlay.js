import React from 'react';
import '../../styles/HowToPlay.css';

const HowToPlay = () => {
  return (
    <div className="how-to-play" id="help">
      <h2>How to Play Sudoku</h2>
      
      <div className="help-section">
        <h3>Basic Rules</h3>
        <ul>
          <li>Fill in the grid so that every row, column, and 3x3 box contains the numbers 1 through 9, without repetition.</li>
          <li>The puzzle comes with some cells already filled in. These are the "givens" and cannot be changed.</li>
          <li>Each puzzle has only one valid solution.</li>
        </ul>
      </div>
      
      <div className="help-section">
        <h3>Game Controls</h3>
        <ul>
          <li><strong>Click</strong> on an empty cell to select it.</li>
          <li>Press a <strong>number key (1-9)</strong> to fill the selected cell.</li>
          <li>Press <strong>Delete</strong> or <strong>Backspace</strong> to clear a cell.</li>
          <li>Use <strong>arrow keys</strong> to navigate between cells.</li>
        </ul>
      </div>
      
      <div className="help-section">
        <h3>Game Features</h3>
        <ul>
          <li><strong>New Game</strong>: Start a new puzzle with the selected difficulty.</li>
          <li><strong>Hint</strong>: Get help with a random cell (limited number available).</li>
          <li><strong>Check</strong>: Verify if your current solution has any errors.</li>
          <li><strong>Reset</strong>: Clear all your entries and return to the initial puzzle.</li>
          <li><strong>Save</strong>: Save your progress (requires login).</li>
        </ul>
      </div>
      
      <div className="help-section">
        <h3>Visual Indicators</h3>
        <ul>
          <li><strong>Red Cell</strong>: Indicates an invalid entry (conflicts with another cell).</li>
          <li><strong>Blue Background</strong>: Shows the selected cell.</li>
          <li><strong>Light Blue Background</strong>: Highlights cells in the same row, column, or 3x3 box as the selected cell.</li>
          <li><strong>Bold Numbers</strong>: These are the initial "given" numbers that cannot be changed.</li>
        </ul>
      </div>
      
      <div className="help-section">
        <h3>Difficulty Levels</h3>
        <ul>
          <li><strong>Easy</strong>: More initial numbers provided, suitable for beginners.</li>
          <li><strong>Medium</strong>: Balanced difficulty, good for regular players.</li>
          <li><strong>Hard</strong>: Fewer initial numbers, requires advanced techniques.</li>
          <li><strong>Expert</strong>: Minimal initial numbers, extremely challenging.</li>
        </ul>
      </div>
      
      <div className="help-section">
        <h3>Tips for Success</h3>
        <ul>
          <li>Look for rows, columns, or boxes that are almost complete.</li>
          <li>Use the process of elimination to determine possible values for each cell.</li>
          <li>When stuck, try the "pencil marks" technique - mentally note all possible values for each empty cell.</li>
          <li>Look for "hidden singles" - cells that can only contain one specific number.</li>
          <li>Practice regularly to improve your solving skills!</li>
        </ul>
      </div>
    </div>
  );
};

export default HowToPlay; 
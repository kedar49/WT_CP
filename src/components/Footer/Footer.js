import React from 'react';
import '../../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Sudoku Master</h4>
          <p>Challenge your brain with our collection of Sudoku puzzles.</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#game">Play Game</a></li>
            <li><a href="#leaderboard">Leaderboard</a></li>
            <li><a href="#help">How to Play</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} Sudoku Master. All rights reserved.</p>
        <p>This project is made by TY-74 Group for Web Technology</p>
      </div>
    </footer>
  );
};

export default Footer; 
import React from 'react';
import '../../styles/Header.css';

const Header = ({ user, onLogout }) => {
  return (
    <header className="app-header">
      <div className="header-logo">
        <h1>Sudoku Master</h1>
      </div>
      
      <div className="header-nav">
        <nav>
          <ul>
            <li><a href="#game">Play</a></li>
            <li><a href="#leaderboard">Leaderboard</a></li>
            <li><a href="#help">How to Play</a></li>
          </ul>
        </nav>
      </div>
      
      <div className="header-user">
        {user ? (
          <div className="user-info">
            <span className="username">Welcome, {user.username}!</span>
            <button onClick={onLogout} className="logout-button">Logout</button>
          </div>
        ) : (
          <div className="login-prompt">
            <span>Login to save your progress</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 
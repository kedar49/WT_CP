import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import AuthContainer from './components/Auth/AuthContainer';
import GameContainer from './components/SudokuBoard/GameContainer';
import Leaderboard from './components/Leaderboard/Leaderboard';
import HowToPlay from './components/Help/HowToPlay';
import Footer from './components/Footer/Footer';
import './styles/App.css';

function App() {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Handle successful authentication
  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setShowAuth(false);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  // Toggle authentication modal
  const toggleAuth = () => {
    setShowAuth(!showAuth);
  };

  return (
    <div className="app">
      <Header 
        user={user} 
        onLogout={handleLogout} 
      />
      
      <main className="main-content">
        <section className="section" id="game">
          <div className="container">
            {showAuth ? (
              <AuthContainer onAuthSuccess={handleAuthSuccess} />
            ) : (
              <GameContainer user={user} />
            )}
            
            {!user && !showAuth && (
              <div className="text-center mt-4">
                <p>Login to save your progress and compete on the leaderboard!</p>
                <button onClick={toggleAuth} className="btn mt-2">
                  Login / Register
                </button>
              </div>
            )}
          </div>
        </section>
        
        <section className="section">
          <div className="container">
            <Leaderboard />
          </div>
        </section>
        
        <section className="section">
          <div className="container">
            <HowToPlay />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;

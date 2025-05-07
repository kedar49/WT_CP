import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const AuthContainer = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleLoginSuccess = (user) => {
    onAuthSuccess(user);
  };

  const handleRegisterSuccess = () => {
    // Show success message or redirect to login
    alert('Registration successful! Please login with your credentials.');
  };

  const switchToRegister = () => {
    setIsLogin(false);
  };

  const switchToLogin = () => {
    setIsLogin(true);
  };

  return isLogin ? (
    <Login 
      onLoginSuccess={handleLoginSuccess} 
      switchToRegister={switchToRegister} 
    />
  ) : (
    <Register 
      onRegisterSuccess={handleRegisterSuccess} 
      switchToLogin={switchToLogin} 
    />
  );
};

export default AuthContainer; 
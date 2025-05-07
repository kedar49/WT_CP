-- Sudoku App Database Schema

-- Drop tables if they exist to avoid errors
DROP TABLE IF EXISTS user_progress;
DROP TABLE IF EXISTS user_statistics;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS puzzles;

-- Create puzzles table to store Sudoku puzzles
CREATE TABLE puzzles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  puzzle_data TEXT NOT NULL COMMENT 'JSON representation of the puzzle grid',
  solution_data TEXT NOT NULL COMMENT 'JSON representation of the puzzle solution',
  difficulty VARCHAR(20) NOT NULL COMMENT 'Easy, Medium, Hard, Expert',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP
);

-- Create users table to store user information
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL
);

-- Create user_statistics table to store user game statistics
CREATE TABLE user_statistics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  puzzles_completed INT DEFAULT 0,
  easy_completed INT DEFAULT 0,
  medium_completed INT DEFAULT 0,
  hard_completed INT DEFAULT 0,
  expert_completed INT DEFAULT 0,
  best_time_easy INT NULL COMMENT 'Best time in seconds',
  best_time_medium INT NULL COMMENT 'Best time in seconds',
  best_time_hard INT NULL COMMENT 'Best time in seconds',
  best_time_expert INT NULL COMMENT 'Best time in seconds',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create user_progress table to track individual puzzle progress
CREATE TABLE user_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  puzzle_id INT NOT NULL,
  current_state TEXT COMMENT 'JSON representation of current puzzle state',
  is_completed BOOLEAN DEFAULT FALSE,
  time_spent INT DEFAULT 0 COMMENT 'Time spent in seconds',
  hints_used INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (puzzle_id) REFERENCES puzzles(id) ON DELETE CASCADE,
  UNIQUE KEY user_puzzle (user_id, puzzle_id)
); 
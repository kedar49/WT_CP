-- Sudoku App Sample Queries

-- Insert a new puzzle
INSERT INTO puzzles (puzzle_data, solution_data, difficulty) 
VALUES 
('{"grid":[[5,3,0,0,7,0,0,0,0],[6,0,0,1,9,5,0,0,0],[0,9,8,0,0,0,0,6,0],[8,0,0,0,6,0,0,0,3],[4,0,0,8,0,3,0,0,1],[7,0,0,0,2,0,0,0,6],[0,6,0,0,0,0,2,8,0],[0,0,0,4,1,9,0,0,5],[0,0,0,0,8,0,0,7,9]}', 
'{"grid":[[5,3,4,6,7,8,9,1,2],[6,7,2,1,9,5,3,4,8],[1,9,8,3,4,2,5,6,7],[8,5,9,7,6,1,4,2,3],[4,2,6,8,5,3,7,9,1],[7,1,3,9,2,4,8,5,6],[9,6,1,5,3,7,2,8,4],[2,8,7,4,1,9,6,3,5],[3,4,5,2,8,6,1,7,9]]}', 
'Easy');

-- Get all puzzles
SELECT * FROM puzzles;

-- Get puzzles by difficulty
SELECT * FROM puzzles WHERE difficulty = 'Easy';
SELECT * FROM puzzles WHERE difficulty = 'Medium';
SELECT * FROM puzzles WHERE difficulty = 'Hard';
SELECT * FROM puzzles WHERE difficulty = 'Expert';

-- Register a new user
INSERT INTO users (username, email, password_hash)
VALUES ('johndoe', 'john@example.com', '$2y$10$abcdefghijklmnopqrstuv');

-- User login query
SELECT id, username, password_hash FROM users WHERE username = 'johndoe' OR email = 'john@example.com';

-- Update user's last login time
UPDATE users SET last_login = NOW() WHERE id = 1;

-- Initialize user statistics when user registers
INSERT INTO user_statistics (user_id) VALUES (1);

-- Start a new puzzle (save initial progress)
INSERT INTO user_progress (user_id, puzzle_id, current_state)
VALUES (1, 1, '{"grid":[[5,3,0,0,7,0,0,0,0],[6,0,0,1,9,5,0,0,0],[0,9,8,0,0,0,0,6,0],[8,0,0,0,6,0,0,0,3],[4,0,0,8,0,3,0,0,1],[7,0,0,0,2,0,0,0,6],[0,6,0,0,0,0,2,8,0],[0,0,0,4,1,9,0,0,5],[0,0,0,0,8,0,0,7,9]]}');

-- Save puzzle progress
UPDATE user_progress 
SET 
  current_state = '{"grid":[[5,3,4,0,7,0,0,0,0],[6,0,0,1,9,5,0,0,0],[0,9,8,0,0,0,0,6,0],[8,0,0,0,6,0,0,0,3],[4,0,0,8,0,3,0,0,1],[7,0,0,0,2,0,0,0,6],[0,6,0,0,0,0,2,8,0],[0,0,0,4,1,9,0,0,5],[0,0,0,0,8,0,0,7,9]]}',
  time_spent = time_spent + 120,
  hints_used = hints_used + 1,
  updated_at = NOW()
WHERE user_id = 1 AND puzzle_id = 1;

-- Mark puzzle as completed
UPDATE user_progress 
SET 
  is_completed = TRUE,
  time_spent = 600,
  updated_at = NOW()
WHERE user_id = 1 AND puzzle_id = 1;

-- Update user statistics after completing a puzzle
UPDATE user_statistics 
SET 
  puzzles_completed = puzzles_completed + 1,
  easy_completed = easy_completed + 1
WHERE user_id = 1;

-- Update best time if current time is better (for Easy difficulty)
UPDATE user_statistics
SET best_time_easy = 600
WHERE user_id = 1 AND (best_time_easy IS NULL OR best_time_easy > 600);

-- Get user's puzzle progress
SELECT up.*, p.difficulty
FROM user_progress up
JOIN puzzles p ON up.puzzle_id = p.id
WHERE up.user_id = 1;

-- Get user's completed puzzles
SELECT up.*, p.difficulty
FROM user_progress up
JOIN puzzles p ON up.puzzle_id = p.id
WHERE up.user_id = 1 AND up.is_completed = TRUE;

-- Get user's statistics
SELECT * FROM user_statistics WHERE user_id = 1;

-- Get leaderboard (best times for Easy puzzles)
SELECT u.username, us.best_time_easy
FROM user_statistics us
JOIN users u ON us.user_id = u.id
WHERE us.best_time_easy IS NOT NULL
ORDER BY us.best_time_easy ASC
LIMIT 10;

-- Get puzzles that a user hasn't started yet
SELECT p.*
FROM puzzles p
LEFT JOIN user_progress up ON p.id = up.puzzle_id AND up.user_id = 1
WHERE up.id IS NULL;

-- Get puzzles that a user has started but not completed
SELECT p.*, up.current_state, up.time_spent
FROM puzzles p
JOIN user_progress up ON p.id = up.puzzle_id
WHERE up.user_id = 1 AND up.is_completed = FALSE;

-- Delete user account and all related data (cascading delete will handle related tables)
DELETE FROM users WHERE id = 1; 
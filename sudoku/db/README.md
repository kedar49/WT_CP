# Sudoku App Database Setup

This directory contains all the SQL files needed to set up the database for the Sudoku application.

## Files Overview

- `schema.sql`: Contains the table definitions
- `procedures_and_triggers.sql`: Contains stored procedures, functions, and triggers
- `sample_data.sql`: Contains sample data to populate the tables
- `queries.sql`: Contains example queries for common operations
- `install.sql`: Information about installation sequence

## Installation Instructions

1. **Start MySQL/MariaDB**
   - Make sure your MySQL or MariaDB server is running
   - For XAMPP users, start the MySQL service from the XAMPP Control Panel

2. **Create the Database**
   - Open phpMyAdmin (http://localhost/phpmyadmin)
   - Create a new database named `sudoku_app` if it doesn't already exist

3. **Import the SQL Files in Order**
   - **Important**: You must import the files in the correct order:
   
   - Step 1: Import schema.sql
     - Navigate to the `sudoku_app` database
     - Click on the "Import" tab
     - Browse to select `schema.sql`
     - Click "Go" to import
   
   - Step 2: Import procedures_and_triggers.sql
     - Again, click on the "Import" tab
     - Browse to select `procedures_and_triggers.sql`
     - Click "Go" to import
   
   - Step 3 (Optional): Import sample_data.sql
     - Again, click on the "Import" tab
     - Browse to select `sample_data.sql`
     - Click "Go" to import

   - Alternative: Using MySQL command line (if you have direct access)
     ```bash
     mysql -u root -p sudoku_app < schema.sql
     mysql -u root -p sudoku_app < procedures_and_triggers.sql
     mysql -u root -p sudoku_app < sample_data.sql
     ```

## Database Structure

### Tables

1. **puzzles**
   - Stores Sudoku puzzles with their solutions and difficulty levels
   - Fields: id, puzzle_data, solution_data, difficulty, created_at, updated_at

2. **users**
   - Stores user account information
   - Fields: id, username, email, password_hash, created_at, last_login

3. **user_statistics**
   - Stores aggregate statistics for each user
   - Fields: id, user_id, puzzles_completed, easy_completed, medium_completed, hard_completed, expert_completed, best_time_easy, best_time_medium, best_time_hard, best_time_expert

4. **user_progress**
   - Tracks user progress on individual puzzles
   - Fields: id, user_id, puzzle_id, current_state, is_completed, time_spent, hints_used, created_at, updated_at

### Stored Procedures

- `GetRandomPuzzle`: Returns a random puzzle of specified difficulty
- `GetUserProgressWithPuzzleDetails`: Returns user progress with puzzle details
- `UpdateUserStatsAfterCompletion`: Updates user statistics after completing a puzzle
- `GetLeaderboard`: Returns leaderboard for a specific difficulty

### Triggers

- `after_user_insert`: Initializes user statistics when a new user is created
- `after_puzzle_completion`: Updates statistics when a puzzle is marked as completed

### Functions

- `IsValidSolution`: Checks if a puzzle solution is valid

## Example Usage

### Getting a Random Puzzle

```sql
CALL GetRandomPuzzle('Easy');
```

### Getting User Progress

```sql
CALL GetUserProgressWithPuzzleDetails(1);
```

### Getting Leaderboard

```sql
CALL GetLeaderboard('Easy', 10);
```

## Data Format

Puzzles and solutions are stored as JSON strings with the following format:

```json
{
  "grid": [
    [5,3,0,0,7,0,0,0,0],
    [6,0,0,1,9,5,0,0,0],
    [0,9,8,0,0,0,0,6,0],
    [8,0,0,0,6,0,0,0,3],
    [4,0,0,8,0,3,0,0,1],
    [7,0,0,0,2,0,0,0,6],
    [0,6,0,0,0,0,2,8,0],
    [0,0,0,4,1,9,0,0,5],
    [0,0,0,0,8,0,0,7,9]
  ]
}
```

Where:
- Numbers 1-9 represent filled cells
- 0 represents empty cells that need to be filled by the player 
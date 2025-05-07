# Sudoku App Backend

This directory contains the PHP backend for the Sudoku application.

## Directory Structure

```
sudoku/
├── api/                # PHP API endpoints
│   ├── create.php     # Create new puzzles
│   ├── read.php       # Retrieve puzzles
│   ├── update.php     # Update existing puzzles
│   ├── delete.php     # Delete puzzles
│   ├── DbConnect.php  # Database connection class
│   └── user/          # User-related endpoints
│       ├── login.php
│       ├── register.php
│       └── progress.php
└── db/                # Database scripts
    ├── schema.sql     # Table definitions
    ├── procedures_and_triggers.sql  # Stored procedures and triggers
    ├── sample_data.sql  # Sample data for testing
    ├── queries.sql    # Example queries
    └── README.md      # Database documentation
```

## Setup Instructions

1. **Copy Files to XAMPP**
   - Copy this entire `sudoku` directory to your XAMPP htdocs folder:
     ```
     cp -r sudoku /path/to/xampp/htdocs/
     ```
   - For Windows users:
     ```
     xcopy /E /I sudoku C:\xampp\htdocs\sudoku
     ```

2. **Start XAMPP Services**
   - Start Apache and MySQL services from the XAMPP Control Panel

3. **Database Setup**
   - Open phpMyAdmin (http://localhost/phpmyadmin)
   - Create a new database named `sudoku_app`
   - Import the SQL files in this order:
     1. `db/schema.sql`
     2. `db/procedures_and_triggers.sql`
     3. `db/sample_data.sql` (optional)

4. **Configure Database Connection**
   - If needed, modify the database credentials in `api/DbConnect.php`
   - Default settings:
     - Host: localhost
     - Database: sudoku_app
     - Username: root
     - Password: (empty by default)

5. **Test API Endpoints**
   - After setup, you can test the API using a tool like Postman or by accessing:
     - http://localhost/sudoku/api/read.php

## API Endpoints

### Puzzles

- **GET /api/read.php** - Retrieve all puzzles or a specific puzzle by ID
  - Optional parameters:
    - `id`: Get puzzle by ID
    - `difficulty`: Filter puzzles by difficulty

- **POST /api/create.php** - Create a new puzzle
  - Required JSON body:
    ```json
    {
      "puzzle_data": "{\"grid\":[[...]]}",
      "solution_data": "{\"grid\":[[...]]}",
      "difficulty": "Easy"
    }
    ```

- **PUT /api/update.php** - Update an existing puzzle
  - Required JSON body:
    ```json
    {
      "id": 1,
      "puzzle_data": "{\"grid\":[[...]]}",
      "difficulty": "Medium"
    }
    ```

- **DELETE /api/delete.php** - Delete a puzzle
  - Required parameter:
    - `id`: ID of puzzle to delete

### User Management

- **POST /api/user/register.php** - Register a new user
  - Required JSON body:
    ```json
    {
      "username": "kedar",
      "email": "kedar@gmail.com",
      "password": "lmaoded"
    }
    ```

- **POST /api/user/login.php** - User login
  - Required JSON body:
    ```json
    {
      "username": "kedar",
      "password": "lmaoded"
    }
    ```

- **GET /api/user/progress.php** - Get user progress
  - Required parameter:
    - `user_id`: ID of user

## Frontend Integration

The React frontend communicates with these API endpoints through the service functions defined in `src/api.js`. 
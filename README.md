# Sudoku Application

A full-stack Sudoku game application with React frontend and PHP backend.

![Game Demo](/image.png)  
*Example of the game interface showing a red space due to an invalid input.*

## Project Structure

```
simple_sudoku/
├── public/                 # Public assets for React
├── src/                    # React frontend source code
│   ├── components/         # React components
│   ├── styles/             # CSS styles
│   ├── assets/             # Frontend assets
│   └── api.js              # API integration
├── sudoku/                 # Backend code
│   ├── api/                # PHP API endpoints
│   └── db/                 # Database scripts
└── package.json            # Node.js dependencies
```

## Prerequisites

- [XAMPP](https://www.apachefriends.org/download.html) (for Apache, MySQL, PHP)
- [Node.js](https://nodejs.org/) (v14 or higher)
- npm (comes with Node.js)

## Setup Instructions

### 1. Database Setup

1. **Start XAMPP Services**
   - Start Apache and MySQL services from the XAMPP Control Panel

2. **Create Database**
   - Open phpMyAdmin (http://localhost/phpmyadmin)
   - Create a new database named `sudoku_app`

3. **Import Database Structure**
   - Navigate to the `sudoku_app` database in phpMyAdmin
   - Import the SQL files in this order:
     1. `sudoku/db/schema.sql`
     2. `sudoku/db/procedures_and_triggers.sql`
     3. `sudoku/db/sample_data.sql` (optional - for sample puzzles)

### 2. Backend Setup

1. **Configure PHP Backend**
   - Copy the entire `sudoku` directory to your XAMPP htdocs folder:
     ```
     cp -r sudoku /path/to/xampp/htdocs/
     ```
   - For Windows users:
     ```
     xcopy /E /I sudoku C:\xampp\htdocs\sudoku
     ```

2. **Configure Database Connection**
   - If needed, modify the database credentials in `sudoku/api/DbConnect.php`
   - Default settings:
     - Host: localhost
     - Database: sudoku_app
     - Username: root
     - Password: (empty by default)

### 3. Frontend Setup

1. **Install Dependencies**
   - From the project root directory, run:
     ```
     npm install
     ```

2. **Configure API Endpoint**
   - Open `src/api.js` and ensure the API base URL points to your backend:
     ```javascript
     const API_BASE_URL = 'http://localhost/sudoku/api';
     ```

3. **Start the Application**
   - Run the development server:
     ```
     npm start
     ```
   - The game will open in your browser at http://localhost:3000

## How to Play

1. Select a difficulty level to start a new game
2. Click on an empty cell and enter a number from 1-9
3. The cell will turn red if the number is invalid for one of these reasons:
   - The number already exists in the same row, column, or 3x3 box
   - The number makes the puzzle unsolvable

## API Endpoints

- **GET /api/read.php** - Retrieve puzzles (all or by ID/difficulty)
- **POST /api/create.php** - Create a new puzzle
- **PUT /api/update.php** - Update an existing puzzle
- **DELETE /api/delete.php** - Delete a puzzle
- **GET /api/user/progress.php** - Get user progress
- **POST /api/user/register.php** - Register a new user
- **POST /api/user/login.php** - User login

## Development

- To build for production:
  ```
  npm run build
  ```

- To run tests:
  ```
  npm test
  ```

-- Sudoku App Database Installation Script

-- Create database if it doesn't exist
-- CREATE DATABASE IF NOT EXISTS sudoku_app;
-- USE sudoku_app;

-- Note: The database 'sudoku_app' has already been created manually

-- Instead of using SOURCE commands which don't work in phpMyAdmin,
-- you need to import each file separately in this order:
-- 1. schema.sql
-- 2. procedures_and_triggers.sql
-- 3. sample_data.sql

-- Display success message after importing all files
SELECT 'To complete Sudoku App database setup:' AS 'Installation Instructions';
SELECT '1. Import schema.sql first' AS 'Step 1';
SELECT '2. Import procedures_and_triggers.sql second' AS 'Step 2';
SELECT '3. Import sample_data.sql last (optional)' AS 'Step 3';

-- Show created tables
SHOW TABLES;

-- Display sample data from puzzles table
SELECT id, difficulty FROM puzzles; 
<?php
/**
 * Database Connection Class
 * Handles database connections for the Sudoku application
 */
class DbConnect {
    private $conn;
    
    /**
     * Connect to the database
     * @return mysqli|false Database connection object or false on failure
     */
    public function connect() {
        // Database configuration
        $host = 'localhost';
        $dbname = 'sudoku_app';
        $username = 'root';
        $password = 'kedar112';
        
        // Create connection
        $this->conn = new mysqli($host, $username, $password, $dbname);
        
        // Check connection
        if ($this->conn->connect_error) {
            die("Connection failed: " . $this->conn->connect_error);
        }
        
        // Set character set
        $this->conn->set_charset("utf8");
        
        return $this->conn;
    }
}
?> 
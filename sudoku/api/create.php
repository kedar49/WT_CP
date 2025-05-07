<?php
/**
 * Create API - Adds a new puzzle to the database
 * 
 * Expects JSON payload with puzzle data
 */

// Set CORS headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include database connection
include_once 'DbConnect.php';

// Only allow POST method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed. Please use POST."));
    exit();
}

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Validate data
if (empty($data->puzzle_data) || empty($data->difficulty)) {
    http_response_code(400);
    echo json_encode(array("message" => "Incomplete data. Puzzle data and difficulty are required."));
    exit();
}

try {
    // Create DB connection
    $dbConnection = new DbConnect();
    $conn = $dbConnection->connect();
    
    // Prepare SQL statement
    $sql = "INSERT INTO puzzles (puzzle_data, difficulty, created_at) VALUES (:puzzle_data, :difficulty, NOW())";
    $stmt = $conn->prepare($sql);
    
    // Sanitize and bind parameters
    $puzzle_data = $data->puzzle_data;
    $difficulty = htmlspecialchars(strip_tags($data->difficulty));
    
    $stmt->bindParam(':puzzle_data', $puzzle_data);
    $stmt->bindParam(':difficulty', $difficulty);
    
    // Execute query
    if ($stmt->execute()) {
        $lastId = $conn->lastInsertId();
        
        http_response_code(201);
        echo json_encode(array(
            "status" => true,
            "message" => "Puzzle created successfully",
            "id" => $lastId
        ));
    } else {
        http_response_code(503);
        echo json_encode(array(
            "status" => false,
            "message" => "Unable to create puzzle"
        ));
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array(
        "status" => false,
        "message" => "Database error: " . $e->getMessage()
    ));
}
?> 
<?php
/**
 * Update API - Updates an existing puzzle in the database
 * 
 * Expects JSON payload with puzzle data and ID
 */

// Set CORS headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include database connection
include_once 'DbConnect.php';

// Only allow PUT method
if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed. Please use PUT."));
    exit();
}

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Validate data
if (empty($data->id) || (empty($data->puzzle_data) && empty($data->difficulty))) {
    http_response_code(400);
    echo json_encode(array("message" => "Incomplete data. ID and at least one field to update are required."));
    exit();
}

try {
    // Create DB connection
    $dbConnection = new DbConnect();
    $conn = $dbConnection->connect();
    
    // Start building the SQL query
    $sql = "UPDATE puzzles SET ";
    $updateFields = array();
    $params = array();
    
    // Add fields to update
    if (!empty($data->puzzle_data)) {
        $updateFields[] = "puzzle_data = :puzzle_data";
        $params[':puzzle_data'] = $data->puzzle_data;
    }
    
    if (!empty($data->difficulty)) {
        $updateFields[] = "difficulty = :difficulty";
        $params[':difficulty'] = htmlspecialchars(strip_tags($data->difficulty));
    }
    
    // Add updated_at timestamp
    $updateFields[] = "updated_at = NOW()";
    
    // Complete the SQL statement
    $sql .= implode(", ", $updateFields);
    $sql .= " WHERE id = :id";
    $params[':id'] = intval($data->id);
    
    // Prepare and execute statement
    $stmt = $conn->prepare($sql);
    
    foreach ($params as $key => &$val) {
        $stmt->bindParam($key, $val);
    }
    
    // Execute query
    if ($stmt->execute()) {
        // Check if any rows were affected
        if ($stmt->rowCount() > 0) {
            http_response_code(200);
            echo json_encode(array(
                "status" => true,
                "message" => "Puzzle updated successfully"
            ));
        } else {
            http_response_code(404);
            echo json_encode(array(
                "status" => false,
                "message" => "No puzzle found with ID " . $data->id
            ));
        }
    } else {
        http_response_code(503);
        echo json_encode(array(
            "status" => false,
            "message" => "Unable to update puzzle"
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
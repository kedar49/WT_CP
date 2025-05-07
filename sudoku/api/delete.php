<?php
/**
 * Delete API - Removes a puzzle from the database
 * 
 * Expects ID as a query parameter
 */

// Set CORS headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include database connection
include_once 'DbConnect.php';

// Only allow DELETE method
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed. Please use DELETE."));
    exit();
}

// Get ID from query parameter
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

// Validate ID
if ($id <= 0) {
    http_response_code(400);
    echo json_encode(array("message" => "Invalid ID. Please provide a valid puzzle ID."));
    exit();
}

try {
    // Create DB connection
    $dbConnection = new DbConnect();
    $conn = $dbConnection->connect();
    
    // Prepare SQL statement
    $sql = "DELETE FROM puzzles WHERE id = :id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':id', $id);
    
    // Execute query
    if ($stmt->execute()) {
        // Check if any rows were affected
        if ($stmt->rowCount() > 0) {
            http_response_code(200);
            echo json_encode(array(
                "status" => true,
                "message" => "Puzzle deleted successfully"
            ));
        } else {
            http_response_code(404);
            echo json_encode(array(
                "status" => false,
                "message" => "No puzzle found with ID " . $id
            ));
        }
    } else {
        http_response_code(503);
        echo json_encode(array(
            "status" => false,
            "message" => "Unable to delete puzzle"
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
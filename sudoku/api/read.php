<?php
/**
 * Read API - Retrieves puzzles from the database
 * 
 * Supports both retrieving all puzzles and getting a specific puzzle by ID
 */

// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Include database connection
include_once 'DbConnect.php';

// Create DB connection instance
$db = new DbConnect();
$conn = $db->connect();

// Initialize response array
$response = array();
$response['status'] = true;

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Check if ID parameter is set
    if (isset($_GET['id'])) {
        $id = $_GET['id'];
        
        // Get puzzle by ID
        $stmt = $conn->prepare("SELECT * FROM puzzles WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $response['data'] = $result->fetch_assoc();
        } else {
            $response['status'] = false;
            $response['message'] = "No puzzle found with ID: $id";
        }
        
        $stmt->close();
    } 
    // Check if difficulty parameter is set
    else if (isset($_GET['difficulty'])) {
        $difficulty = $_GET['difficulty'];
        
        // Get puzzles by difficulty
        $stmt = $conn->prepare("SELECT * FROM puzzles WHERE difficulty = ?");
        $stmt->bind_param("s", $difficulty);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $puzzles = array();
            while ($row = $result->fetch_assoc()) {
                $puzzles[] = $row;
            }
            $response['data'] = $puzzles;
        } else {
            $response['status'] = false;
            $response['message'] = "No puzzles found with difficulty: $difficulty";
        }
        
        $stmt->close();
    } 
    // Get all puzzles
    else {
        $stmt = $conn->prepare("SELECT * FROM puzzles");
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $puzzles = array();
            while ($row = $result->fetch_assoc()) {
                $puzzles[] = $row;
            }
            $response['data'] = $puzzles;
        } else {
            $response['status'] = false;
            $response['message'] = "No puzzles found";
        }
        
        $stmt->close();
    }
} else {
    $response['status'] = false;
    $response['message'] = "Invalid request method";
}

// Close connection
$conn->close();

// Return response
echo json_encode($response);
?> 
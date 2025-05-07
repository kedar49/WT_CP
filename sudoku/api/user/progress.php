<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

// Include database connection
include_once '../DbConnect.php';

// Create DB connection instance
$db = new DbConnect();
$conn = $db->connect();

// Initialize response array
$response = array();

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

// GET - Retrieve user progress
if ($method === 'GET') {
    // Check if user_id is provided
    if (!isset($_GET['user_id'])) {
        $response['status'] = false;
        $response['message'] = "User ID is required";
    } else {
        $user_id = $_GET['user_id'];
        
        // Get user progress with puzzle details
        $stmt = $conn->prepare("
            SELECT 
                up.id,
                up.user_id,
                up.puzzle_id,
                p.difficulty,
                up.current_state,
                up.is_completed,
                up.time_spent,
                up.hints_used,
                up.created_at,
                up.updated_at
            FROM 
                user_progress up
            JOIN 
                puzzles p ON up.puzzle_id = p.id
            WHERE 
                up.user_id = ?
            ORDER BY 
                up.updated_at DESC
        ");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $progress = array();
            while ($row = $result->fetch_assoc()) {
                $progress[] = $row;
            }
            $response['status'] = true;
            $response['data'] = $progress;
        } else {
            $response['status'] = true;
            $response['data'] = array();
            $response['message'] = "No progress found for this user";
        }
        
        $stmt->close();
    }
} 
// POST - Save user progress
else if ($method === 'POST') {
    // Get posted data
    $data = json_decode(file_get_contents('php://input'));
    
    // Check if required fields are provided
    if (!isset($data->user_id) || !isset($data->puzzle_id)) {
        $response['status'] = false;
        $response['message'] = "User ID and Puzzle ID are required";
    } else {
        // Extract data
        $user_id = $data->user_id;
        $puzzle_id = $data->puzzle_id;
        $current_state = isset($data->current_state) ? $data->current_state : null;
        $is_completed = isset($data->is_completed) ? $data->is_completed : 0;
        $time_spent = isset($data->time_spent) ? $data->time_spent : 0;
        $hints_used = isset($data->hints_used) ? $data->hints_used : 0;
        
        // Check if progress already exists
        $stmt = $conn->prepare("SELECT id FROM user_progress WHERE user_id = ? AND puzzle_id = ?");
        $stmt->bind_param("ii", $user_id, $puzzle_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            // Update existing progress
            $progress = $result->fetch_assoc();
            $progress_id = $progress['id'];
            
            $stmt = $conn->prepare("
                UPDATE user_progress 
                SET current_state = ?, is_completed = ?, time_spent = ?, hints_used = ?, updated_at = NOW() 
                WHERE id = ?
            ");
            $stmt->bind_param("siiii", $current_state, $is_completed, $time_spent, $hints_used, $progress_id);
            
            if ($stmt->execute()) {
                $response['status'] = true;
                $response['message'] = "Progress updated successfully";
                $response['progress_id'] = $progress_id;
            } else {
                $response['status'] = false;
                $response['message'] = "Error updating progress: " . $stmt->error;
            }
        } else {
            // Create new progress
            $stmt = $conn->prepare("
                INSERT INTO user_progress (user_id, puzzle_id, current_state, is_completed, time_spent, hints_used) 
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $stmt->bind_param("iisiii", $user_id, $puzzle_id, $current_state, $is_completed, $time_spent, $hints_used);
            
            if ($stmt->execute()) {
                $response['status'] = true;
                $response['message'] = "Progress saved successfully";
                $response['progress_id'] = $conn->insert_id;
            } else {
                $response['status'] = false;
                $response['message'] = "Error saving progress: " . $stmt->error;
            }
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
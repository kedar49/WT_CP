<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
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

if ($method === 'POST') {
    // Get posted data
    $data = json_decode(file_get_contents('php://input'));
    
    // Check if required fields are provided
    if (!isset($data->username) || !isset($data->email) || !isset($data->password)) {
        $response['status'] = false;
        $response['message'] = "Username, email, and password are required";
    } else {
        // Sanitize input
        $username = $data->username;
        $email = $data->email;
        $password = $data->password;
        
        // Validate email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $response['status'] = false;
            $response['message'] = "Invalid email format";
        } 
        // Validate username length
        else if (strlen($username) < 3 || strlen($username) > 50) {
            $response['status'] = false;
            $response['message'] = "Username must be between 3 and 50 characters";
        }
        // Validate password length
        else if (strlen($password) < 6) {
            $response['status'] = false;
            $response['message'] = "Password must be at least 6 characters";
        } 
        else {
            // Check if username already exists
            $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
            $stmt->bind_param("s", $username);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows > 0) {
                $response['status'] = false;
                $response['message'] = "Username already exists";
                $stmt->close();
            } else {
                $stmt->close();
                
                // Check if email already exists
                $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
                $stmt->bind_param("s", $email);
                $stmt->execute();
                $result = $stmt->get_result();
                
                if ($result->num_rows > 0) {
                    $response['status'] = false;
                    $response['message'] = "Email already exists";
                    $stmt->close();
                } else {
                    $stmt->close();
                    
                    // Hash password
                    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
                    
                    // Insert new user
                    $stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
                    $stmt->bind_param("sss", $username, $email, $hashed_password);
                    
                    if ($stmt->execute()) {
                        $response['status'] = true;
                        $response['message'] = "User registered successfully";
                        $response['user_id'] = $conn->insert_id;
                    } else {
                        $response['status'] = false;
                        $response['message'] = "Error: " . $stmt->error;
                    }
                    
                    $stmt->close();
                }
            }
        }
    }
} else {
    $response['status'] = false;
    $response['message'] = "Invalid request method";
}

// Close connection
$conn->close();

// Return response
echo json_encode($response); 
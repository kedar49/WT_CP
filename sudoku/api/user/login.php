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
    if (!isset($data->username) || !isset($data->password)) {
        $response['status'] = false;
        $response['message'] = "Username and password are required";
    } else {
        // Sanitize input
        $username = $data->username;
        $password = $data->password;
        
        // Check if username is an email
        $isEmail = filter_var($username, FILTER_VALIDATE_EMAIL);
        
        // Prepare SQL statement based on input type
        if ($isEmail) {
            $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
            $stmt->bind_param("s", $username);
        } else {
            $stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
            $stmt->bind_param("s", $username);
        }
        
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            
            // Verify password
            if (password_verify($password, $user['password'])) {
                // Remove password from response
                unset($user['password']);
                
                // Generate a simple token (in a real app, use JWT or similar)
                $token = bin2hex(random_bytes(32));
                
                $response['status'] = true;
                $response['message'] = "Login successful";
                $response['user'] = $user;
                $response['token'] = $token;
            } else {
                $response['status'] = false;
                $response['message'] = "Invalid password";
            }
        } else {
            $response['status'] = false;
            $response['message'] = "User not found";
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
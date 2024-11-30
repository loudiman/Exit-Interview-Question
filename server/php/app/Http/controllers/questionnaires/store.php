<?php
// Get the raw data of post request
// Decode the JSON then access the values
// Save in the database

use Core\App;
use Core\Database;


// Set JSON response headers
header("Content-Type: application/json");

// Validate request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get and validate JSON input
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Validate JSON parsing
if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode([
        'error' => 'Invalid JSON data',
        'message' => json_last_error_msg()
    ]);
    exit();
}

// Validate required fields
if (!isset($data['username']) || !isset($data['survey_id']) || !isset($data['response_json'])) {
    http_response_code(400);
    echo json_encode([
        'error' => 'Missing required fields',
        'message' => 'username, survey_id, and response_json are required'
    ]);
    exit();
}

try {
    $db = App::resolve(Database::class);

    // Start transaction
    $db->beginTransaction();

    // Insert response
    $db->query(
        "INSERT INTO `responses` (`survey_id`, `response_json`, `submitted_at`) 
         VALUES (:survey_id, :response_json, CURRENT_TIMESTAMP)",
        [
            'survey_id' => $data['survey_id'],
            'response_json' => json_encode($data['response_json'])
        ]
    );

    // Get the response ID
    $responseId = $db->lastInsertId();

    // Update responder status
    $db->query(
        "INSERT INTO `responders` (`username`, `survey_id`, `responded`) 
         VALUES (:username, :survey_id, TRUE) 
         ON DUPLICATE KEY UPDATE `responded` = TRUE",
        [
            'username' => $data['username'],
            'survey_id' => $data['survey_id']
        ]
    );

    // Commit transaction
    $db->commit();

    // Send success response
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'message' => 'Survey response recorded successfully',
        'data' => [
            'response_id' => $responseId
        ]
    ]);

} catch (Exception $e) {
    // Rollback transaction if there was an error
    if (isset($db)) {
        $db->rollBack();
    }

    // Log the error (make sure error logging is enabled in your PHP configuration)
    error_log("Survey response error: " . $e->getMessage());

    // Send error response
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to save survey response',
        'message' => $e->getMessage(),
        'details' => [
            'username' => $data['username'] ?? null,
            'survey_id' => $data['survey_id'] ?? null,
            'response_count' => count($data['response_json'] ?? [])
        ]
    ]);
}
<?php

use Core\App;
use Core\Database;

header("Content-Type: application/json");

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

// Insert survey response into the database
App::resolve(Database::class)->query(
    "INSERT INTO `responses` (`survey_id`, `response_json`, `submitted_at`) 
        VALUES (?, ?, CURRENT_TIMESTAMP)",
    [
        $data['survey_id'], json_encode($data['response_json'])
    ]
);

App::resolve(Database::class)->query(
    "INSERT INTO `responders` (`username`, `survey_id`, `responded`) 
        VALUES (?, ?, TRUE) 
        ON DUPLICATE KEY UPDATE `responded` = TRUE",
    [
        $data['username'], $data['survey_id']
    ]
);

// Send success response
http_response_code(200);
echo json_encode([
    'status' => 'success',
    'message' => 'Survey response recorded successfully'
]);
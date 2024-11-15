<?php

use Core\App;
use Core\Database;

try {
    $surveys = App::resolve(Database::class)->query(
        'SELECT s.survey_id, s.survey_title 
         FROM survey as s 
         LEFT JOIN student as stud ON s.program_id = stud.program_id 
         WHERE stud.username = ? AND s.status = "published"', 
        ['2233672']
    )->get();

    echo json_encode(['status' => 'success', 'data' => $surveys]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}

echo json_encode($surveys);

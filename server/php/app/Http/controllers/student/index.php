<?php

use Core\App;
use Core\Database;

try {
    // Temporary solution???
    $surveys = App::resolve(Database::class)->query(
        'SELECT s.username, r.survey_id,  sur.survey_title, r.responded, sur.period_start, sur.period_end
            FROM student AS s
            JOIN responders AS r ON s.username = r.username
            JOIN survey AS sur ON sur.survey_id = r.survey_id
            WHERE s.username = ?
            AND CURRENT_DATE() >= sur.period_start;', [$_SESSION['user']['username']] 
    )->assoc_get();
    echo json_encode(['surveys' => $surveys]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}

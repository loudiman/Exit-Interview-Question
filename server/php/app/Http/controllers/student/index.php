<?php

use Core\App;
use Core\Database;

try {
    // Temporary solution???
    $surveys = App::resolve(Database::class)->query(
        'SELECT DISTINCT
            z.username,
            t.submitted_at, 
            z.survey_id, 
            x.survey_title, 
            z.responded, 
            x.period_start, 
            x.period_end 
        FROM survey x 
        INNER JOIN student y 
            ON JSON_SEARCH(x.program_id, "one", y.program_id) IS NOT NULL
        INNER JOIN (SELECT DISTINCT username, survey_id, responded FROM responders) z 
            ON z.survey_id = x.survey_id
        LEFT JOIN (
            SELECT survey_id, MAX(submitted_at) as submitted_at 
            FROM responses 
            GROUP BY survey_id
        ) t ON z.survey_id = t.survey_id 
        WHERE z.username = ?
            AND y.username = ?
            AND CURRENT_DATE() >= x.period_start;', [$_SESSION['user']['username'], $_SESSION['user']['username']] 
    )->assoc_get();
    echo json_encode(['surveys' => $surveys]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}

<?php

use Core\App;
use Core\Database;

try {
    $surveys = App::resolve(Database::class)->query(
        'SELECT t.submitted_at, z.survey_id, x.survey_title, z.responded, x.period_start, x.period_end 
        FROM survey x INNER JOIN student y 
        ON x.program_id = y.program_id 
        INNER JOIN (SELECT survey_id, responded FROM responders) z 
        ON z.survey_id = x.survey_id 
        LEFT JOIN (SELECT survey_id, submitted_at FROM responses) t 
        ON z.survey_id = t.survey_id 
        WHERE y.username = ? AND x.status = "published" 
        AND CURRENT_DATE() >= x.period_start;', [$_SESSION['user']['username']]

    )->assoc_get();
    echo json_encode(['surveys' => $surveys]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}

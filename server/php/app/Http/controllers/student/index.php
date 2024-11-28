<?php

use Core\App;
use Core\Database;

try {
    $surveys = App::resolve(Database::class)->query(
        'SELECT z.survey_id, x.survey_title, z.responded, x.period_start, x.period_end FROM survey x INNER JOIN student y ON x.program_id = y.program_id INNER JOIN (SELECT survey_id, responded FROM responders) z ON z.survey_id = x.survey_id WHERE y.username = ? and x.status = "published"', [$_SESSION['user']['username']] // To be replaced with [$_SESSION['user']['username']] when logout is implemented.
    )->assoc_get();

    // print_r($surveys);
    // print_r(count($surveys));
    // print_r($surveys[0]);
    // print_r(json_encode(['surveys' => $surveys]));
    echo json_encode(['surveys' => $surveys]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}

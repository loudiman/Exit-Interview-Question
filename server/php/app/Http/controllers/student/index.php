<?php

use Core\App;
use Core\Database;

try {
    $surveys = App::resolve(Database::class)->query(
        'SELECT z.survey_id, x.survey_title, z.responded, x.period_start, x.period_end FROM survey x INNER JOIN student y ON x.program_id = y.program_id INNER JOIN (SELECT survey_id, responded FROM responders) z ON z.survey_id = x.survey_id WHERE y.username = ? and x.status = "published"', [2233672] // To be replaced with [$_SESSION['user']['username']] when logout is implemented.
    )->get();
    
    $response = array();
    for ($i = 0; $i < count($surveys); $i++) {
        $keys = ['survey_id', 'survey_title', 'responded', 'period-start', 'period-end'];
        $values = [];
        for ($j = 0; $j < count($surveys[$i]) && count($keys); $j++) {
            array_push($values, $surveys[$i][$j]);
        }
        array_push($response, array_combine($keys, $values));
    }
    // var_dump(json_encode(['surveys' => $response]));
    echo json_encode(['surveys' => $response]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
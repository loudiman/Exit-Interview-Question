<?php

use Core\App;
use Core\Database;

$survey = App::resolve(Database::class)->query('SELECT q.question_id, q.question_json, q.question_type
FROM question AS q LEFT JOIN questionaire
ON q.question_id = questionaire.question_id
WHERE questionaire.survey_id = ?;', 
[
    $_GET['id']
])->get();

$result = [
    "questions" => $survey
];

echo json_encode($result);
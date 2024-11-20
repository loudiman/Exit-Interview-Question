<?php

use Core\App;
use Core\Database;

$survey = App::resolve(Database::class)->query('SELECT q.question_id, q.question_json, q.question_type
FROM question AS q LEFT JOIN questionaire
ON q.question_id = questionaire.question_id
WHERE questionaire.survey_id = :id;', [
    'id' => $_GET['id']
])->get();

// Decode question_json field for each question
foreach ($survey as &$question) {
    $question['question_json'] = json_decode($question['question_json'], true);
}

$result = [
    "questions" => $survey
];

// Encode to JSON and check for errors
$jsonResult = json_encode($result);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo "JSON Encoding Error: " . json_last_error_msg();
    exit;
}

echo $jsonResult;

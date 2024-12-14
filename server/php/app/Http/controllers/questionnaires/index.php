<?php

use Core\App;
use Core\Database;


// Run the query to fetch survey data and associated questions
$surveyData = App::resolve(Database::class)->query("
    SELECT 
        s.period_start,
        s.period_end,
        s.survey_id,
        s.survey_title,
        q.question_id,
        JSON_UNQUOTE(JSON_EXTRACT(q.question_json, '$.question')) AS question_text,
        q.question_type,
        JSON_EXTRACT(q.question_json, '$.options') AS options,
        JSON_EXTRACT(q.question_json, '$.scale') AS scale
    FROM 
        survey s
    JOIN 
        questionaire qa ON s.survey_id = qa.survey_id
    JOIN 
        question q ON qa.question_id = q.question_id
    WHERE 
        s.survey_id = ?
    ORDER BY 
        q.question_id;", [$_GET['id']]
        )->assoc_get();

// This is a bandaid fix to prevent users from accessing the survey after the end date
if (new DateTime($surveyData[0]['period_end']) < new DateTime()) {
    http_response_code(400);
    // redirect('/student/survey/closedsurvey');
    exit;
}

// Initialize the survey structure. These are the parent items
$survey = [
    'survey_id' => $surveyData[0]['survey_id'],
    'survey_title' => $surveyData[0]['survey_title'],
    'questions' => []
];

// Loop through each child item of the json to conform to the agreed upon format  for the questions
foreach ($surveyData as $question) {
    // Decode options and scale if they exist, otherwise keep null
    $options = $question['options'] ? json_decode($question['options'], true) : null;
    $scale = $question['scale'] ? json_decode($question['scale'], true) : null;

    // Add the question to the 'questions' array
    $survey['questions'][] = [
        'question_id' => $question['question_id'],
        'question_text' => $question['question_text'],
        'question_type' => $question['question_type'],
        'options' => $options,  // May be null if not available
        'scale' => $scale       // May be null if not available
    ];
}

// Encode to JSON and check for errors
$jsonResult = json_encode($survey);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo "JSON Encoding Error: " . json_last_error_msg();
    exit;
}

echo $jsonResult;

// $survey = App::resolve(Database::class)->query('SELECT q.question_id, q.question_json, q.question_type
// FROM survey s
// INNER JOIN questionaire qa ON s.survey_id = qa.survey_id
// INNER JOIN question q ON qa.question_id = q.question_id
// WHERE s.status = "published" AND s.survey_id = 1', 
// [
    // $_GET['id']
// ])->get();

// var_dump($survey[0]['question_json']);
// print_r(count($survey));
// for ($i = 0; $i < count($survey); $i++) {
    // print_r(json_decode($survey[$i]['question_json'], true)); 
    // $temp = json_decode($survey[$i]['question_json'], true);
    // print_r($temp['question'] ?? null);

    // if ($temp['options'] ?? null) {
        // print_r($temp['options']);
    // }

    // if ($temp['scale'] ?? null) {
        // print_r($temp['scale']);
    // }
//     print_r('counter: ' . $i);
// }
// print_r($survey[0]['question_json']);
// print_r(json_decode($survey[0]['question_json'], true));
// print_r(json_decode($survey[0]['question_json'], true));
// print_r(json_decode($survey[0]['question_json'], true)['question']);

// print_r($survey);
// print_r(json_encode(['questions' => $survey]));
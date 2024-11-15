<?php

use Core\App;
use Core\Database;

// Run the query to fetch survey data and associated questions
$surveyData = App::resolve(Database::class)->query("
    SELECT 
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
        s.survey_id = :id
    ORDER BY 
        q.question_id;", [
    'id' => $_GET['id']
])->get();

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

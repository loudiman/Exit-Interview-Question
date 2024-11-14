<?php

use Core\App;
use Core\Database;

// $surveys = App::resolve(Database::class)->query('SELECT s.survey_id, s.survey_title FROM survey as s LEFT JOIN student as stud ON s.program_id = stud.program_id WHERE stud.username = 2233672 AND s.status = "published";')->find();
view("student-homepage.html");
// $data = [
//     'surveys' => [
//         ['survey_id' => 1, 'survey_title' => 'IT Department Evaluation 2024', 'isComplete' => false],
//         ['survey_id' => 2, 'survey_title' => 'Customer Satisfaction Survey 2024', 'isComplete' => true],
//     ]
// ];

// echo json_encode($data);
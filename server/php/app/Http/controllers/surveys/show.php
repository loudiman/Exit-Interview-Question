<?php

use Core\App;
use Core\Database;

$survey = App::resolve(Database::class)->query('', 
[
    $_GET['id']
])->get();

$result = [
    "questions" => $survey
];

echo json_encode($result);
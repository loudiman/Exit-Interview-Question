<?php

use Core\App;
use Core\Database;
use Core\Authenticator;
use app\Http\Forms\LoginForm;

// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Methods: POST");
// header("Content-Type: application/json");

// Retrieve the raw POST data
$inputData = file_get_contents("php://input");

$data = json_decode($inputData, true);

$form = LoginForm::validate($attributes = [
    'username' => $data['username'],
    'password' => $data['password']
]);

$signedIn = (new Authenticator)->
    attempt($attributes['username'], $attributes['password']);

if(!$signedIn)
{
    $form->error(
        'username', 'No matching account for the username and password.'
        )->throw();
}

$surveys = App::resolve(Database::class)->query('SELECT s.survey_id, s.survey_title FROM survey as s LEFT JOIN student as stud ON s.program_id = stud.program_id WHERE stud.username = :username AND s.status = "published";', [
    'username' => $attributes['username']
])->find();

$_SESSION['user'] = array_merge($_SESSION['user'], [
    'surveys' => $surveys
]);


echo json_encode($_SESSION['user']);
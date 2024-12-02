<?php

use Core\Authenticator;
use app\Http\Forms\LoginForm;

// header("Content-Type: application/json");

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

echo json_encode($_SESSION['user']);
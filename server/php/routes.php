<?php

$router->get('/', 'session/create.php');
$router->post('/', 'session/store.php');

$router->get('/student', 'student/index.php');

$router->get('/student/surveys', 'surveys/index.php');
$router->get('/student/survey', 'surveys/show.php');
// $router->post('/student/survey', 'surveys/store.php');

$router->get('/student/survey/questionnaires', 'questionnaires/index.php');
$router->post('/student/survey/questionnaires', 'questionnaires/store.php');
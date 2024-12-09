<?php

$router->get('/', 'session/create.php')->only('guest');
$router->post('/', 'session/store.php')->only('guest');
$router->delete('/session/logout', 'session/destroy.php')->only('auth');

$router->get('/student', 'student/index.php')->only('auth');

$router->get('/student/surveys', 'surveys/index.php')->only('auth');

$router->get('/student/survey/viewsurvey', 'surveys/show.php')->only('auth');
$router->get('/student/survey/closedsurvey', 'surveys/update.php')->only('auth');
// $router->post('/student/survey', 'surveys/store.php');

$router->get('/student/survey/questionnaires', 'questionnaires/index.php')->only('auth');
$router->post('/student/survey/questionnaires', 'questionnaires/store.php')->only('auth');
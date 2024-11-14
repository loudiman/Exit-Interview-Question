<?php

use Core\Container;
use Core\App;
use Core\Database;


it('Check the database response for all published survey', function() {
    require __DIR__ . '/../Core/functions.php';

    $container = new Container();
    $container->bind('Core\Database', function() // Database Builder
    {
        $config = require (base_path('config.php'));

        return new Database($config['database']);
    });
    $container->resolve('Core\Database');
    App::setContainer($container);
    $response = App::resolve(Database::class)->query('SELECT s.survey_id, s.survey_title FROM survey as s LEFT JOIN student as stud ON s.program_id = stud.program_id WHERE stud.username = 2233672 AND s.status = "published";')->find();
    echo $response;
})->only();
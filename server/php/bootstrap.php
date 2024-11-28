<?php 

use Core\Container;
use Core\Database;
use Core\App;

$container = new Container();

$container->bind('Core\Database', function() // Database Builder
{
    $config = require (base_path('config.php'));

    return new Database($config['database']);
});

$container->resolve('Core\Database');

// $container->resolve('dasdakjqwh'); This result an error because key does not exist in container object

App::setContainer($container);
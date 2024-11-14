<?php

use Core\Session;
use Core\ValidationException;
use Core\Router;

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

/* This file is the entry point for all incoming request */
const BASE_PATH = __DIR__ . '/../'; // Points to the root of the project

require BASE_PATH . 'Core/functions.php';

require base_path('vendor/autoload.php');

require base_path('bootstrap.php');

session_start();

$router = new Core\Router;

$routes = require base_path('routes.php');

$uri = parse_url($_SERVER['REQUEST_URI'])['path'];  

$method = $_POST['_method'] ?? $_SERVER['REQUEST_METHOD'];

try {
    $router->route($uri, $method);
} catch(ValidationException $exception) {
    Session::put('errors', $exception->errors);
    Session::put('old', $exception->old);
    // $response = array(
    //     "errors" => 'validation exception'
    // );

    // echo json_encode($response);
    redirect(Router::previousUrl());
}

Session::unflash();
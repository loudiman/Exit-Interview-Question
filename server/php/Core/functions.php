<?php

use Core\Response;
use Core\Session;

function dd($value)
{
    echo "<pre>";
    var_dump($value);
    echo "</pre>";

    die();
}

function urlIs($value)
{
    return $_SERVER['REQUEST_URI'] === $value;
}

function abort($code = 404)
{
    http_response_code($code);

    require base_path("views/{$code}.php");

    die();
}

function authorize($condition, $status = Response::FORBIDDEN)
{
    if (! $condition) {
        abort($status);
    }

    return true;
}

function base_path($path)
{
    return BASE_PATH . $path;
}

function view($path, $attributes = [])
{
    // extract($attributes);

    require base_path('public/resources/views/' . $path);
}

function logout()
{
    Session::destroy();
}

function login($user)
{
    $_SESSION['user'] = [
        'userType' => $user['userType'],
        'username' => $user['username']
    ];

    session_regenerate_id(true);
}

function redirect($path)
{
    header("location: {$path}");
    exit();
}
<?php

namespace Core;

use Core\Middleware\Middleware;

class Router
{
    protected $routes = [];

    public function add($method, $uri, $route)
    {
        $this->routes[] = [
            'uri' => $uri,
            'controller' => $route,
            'method' => $method,
            'middleware' => null
        ];

        return $this;
    }

    public function get($uri, $routes)
    {
        return $this->add('GET', $uri, $routes);
    }

    public function post($uri, $routes)
    {
        return $this->add('POST', $uri, $routes);
    }

    public function delete($uri, $routes)
    {
        return $this->add('DELETE', $uri, $routes);
    }

    public function patch($uri, $routes)
    {
        return $this->add('PATCH', $uri, $routes);
    }

    public function put($uri, $routes)
    {
        return $this->add('PUT', $uri, $routes);
    }

    public function only($key)
    {
        $this->routes[array_key_last($this->routes)]['middleware'] = $key;

        return $this;
    }

    public static function previousUrl()
    {
        return $_SERVER['HTTP_REFERER'];
    }

    public function route($uri, $method)
    {
        foreach($this->routes as $route){
            if($route['uri'] == $uri && $route['method'] == strtoupper($method))
            {
                Middleware::resolve($route['middleware']);
                
                return require base_path('app/Http/controllers/' . $route['controller']);
            };
        }
        abort('404');
    }
}




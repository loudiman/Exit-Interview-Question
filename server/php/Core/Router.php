<?php

namespace Core;

class Router
{
    protected $routes = [];

    public function add($method, $uri, $route)
    {
        $this->routes[] = [
            'uri' => $uri,
            'controller' => $route,
            'method' => $method
        ];
    }

    public function get($uri, $routes)
    {
        $this->add('GET', $uri, $routes);
    }

    public function post($uri, $routes)
    {
        $this->add('POST', $uri, $routes);
    }

    public function delete($uri, $routes)
    {
        $this->add('DELETE', $uri, $routes);
    }

    public function patch($uri, $routes)
    {
        $this->add('PATCH', $uri, $routes);
    }

    public function put($uri, $routes)
    {
        $this->add('PUT', $uri, $routes);
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
                return require base_path('app/Http/controllers/' . $route['controller']);
            };
        }
        abort('404');
    }
}




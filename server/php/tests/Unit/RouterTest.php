<?php

//it('Check if the Router class exist', function() {
//    var_dump(class_exists('server\php\Core\Router'));
//    var_dump(file_exists('server\php\vendor\autoload.php'));
//    // expect($router)->toBeClass();
//});
namespace Tests\Unit;

use Core\Router;
use PHPUnit\Framework\TestCase;
use ReflectionClass;

class RouterTest extends TestCase
{
    protected $router;

    protected function setUp(): void
    {
        $this->router = new Router();
    }

    public function testRouteRegistration()
    {
        // Register routes
        $this->router->get('/home', 'HomeController@index');
        $this->router->post('/home', 'HomeController@store');

        // Access protected property to inspect routes (use reflection or make property public for test)
        $reflection = new ReflectionClass($this->router);
        $routesProperty = $reflection->getProperty('routes');
        $routesProperty->setAccessible(true);
        $routes = $routesProperty->getValue($this->router);

        // Assert the routes were added
        $this->assertCount(2, $routes);
        $this->assertEquals('GET', $routes[0]['method']);
        $this->assertEquals('/home', $routes[0]['uri']);
        $this->assertEquals('HomeController@index', $routes[0]['controller']);
        $this->assertEquals('POST', $routes[1]['method']);
        $this->assertEquals('/home', $routes[1]['uri']);
        $this->assertEquals('HomeController@store', $routes[1]['controller']);
    }

    public function testRouteMatching()
    {
        $this->router->get('/home', 'HomeController@index');

        // Mock base_path function
        function base_path($path) {
            return __DIR__ . '/' . $path;
        }

        // Prepare the route file
        file_put_contents(base_path('app/Http/controllers/HomeController.php'), '<?php return "HomeController@index";');

        $output = $this->router->route('/home', 'GET');

        $this->assertEquals('HomeController@index', $output);

        // Clean up
        unlink(base_path('app/Http/controllers/HomeController.php'));
    }

    public function testRouteNotFound()
    {
        $this->expectExceptionMessage('404');
        $this->router->route('/invalid', 'GET');
    }

    public function testPreviousUrl()
    {
        // Simulate the referer in server superglobal
        $_SERVER['HTTP_REFERER'] = 'http://example.com/previous';

        $previousUrl = Router::previousUrl();

        $this->assertEquals('http://example.com/previous', $previousUrl);
    }
}

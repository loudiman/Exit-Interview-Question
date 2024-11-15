<?php

namespace app\Http\Forms;

use Core\Validator;
use Core\ValidationException;

class LoginForm
{
    protected $errors = [];

    public function __construct(public array $attributes)
    {
        // if(!Validator::email($attributes['email']))
        // {
        //     $this->errors['email'] = 'Please provide a valid email address.';
        // }

        // if(!Validator::string($attributes['password'], 7, 100)) 
        // {
        //     $this->errors['password'] = 'Please provide a password of atleast seven characters';
        // }
    }

    public static function validate($attributes)
    {
        $instance = new static($attributes);

        if($instance->failed()) {
            $instance->throw();
        }

        return $instance;
    }

    public function throw()
    {
        return ValidationException::throw($this->errors(), $this->attributes);
    }

    public function failed() 
    {
        return count($this->errors);
    }

    public function errors()
    {
        return $this->errors;
    }

    public function error($key, $message)
    {
        $this->errors[$key] = $message;
        
        return $this;
    }
}
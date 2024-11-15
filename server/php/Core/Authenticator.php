<?php

namespace Core;

use Core\App;
use Core\Database;

class Authenticator 
{

    public function attempt($username, $password)
    {
        $user = App::resolve(Database::class)->query("SELECT * from user WHERE username = :username",
        [
            'username' => $username
        ])->find();

        if ($user) 
        {
            // if (password_verify($password, $user['hashed_password']))
            if ($password == $user['hashed_password'])
            {
                login([
                    'userType' => $user['type'],
                    'username' => $username
                ]);

                return true;
            }
        } 

        return false;
    }
}
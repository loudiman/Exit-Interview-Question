<?php

namespace Core;

use Core\App;
use Core\Database;

class Authenticator 
{

    public function attempt($username, $password)
    {
        $user = App::resolve(Database::class)->query("SELECT * from user WHERE username = ?",
        [
            $username
        ])->find();

        if ($user) 
        {
            // if (password_verify($password, $user['hashed_password']))
            if ($password == $user['hashed_password'])
            {
                login([
                    'userType' => $user['type'],
                    'username' => $user['username'],
                    'fname' => $user['given_name'],
                ]);

                return true;
            }
        } 

        return false;
    }
}
<?php

namespace Core;

use mysqli;

class Database
{
    public $connection;
    public $statement;

    public function __construct($config, $username = 'root', $password = '')
    {
        // $dsn = 'mysql:' . http_build_query($config, '', ';');

        $this->connection = new mysqli($config['host'], $username, $password, $config['dbname'], $config['port']);


        // $this->connection = new PDO($dsn, $username, $password, [
        //    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        // ]);
    }

    public function query($query, $params = [])
    {
        $this->statement = $this->connection->prepare($query);

        $this->statement->execute($params);

        return $this;
    }

    // Returns associative array having column names as keys
    public function assoc_get()
    {
        // return $this->statement->fetchAll();
        return $this->statement->get_result()->fetch_all(MYSQLI_ASSOC);
        // return $this->statement->get_result()->fetch_all();
    }

    // Returns an array of arrays, where each sub-array is indexed numerically (i.e., by column number).
    public function get()
    {
        // return $this->statement->fetchAll();
        return $this->statement->get_result()->fetch_all();
    }

    public function find()
    {
        // return $this->statement->fetch();
        return $this->statement->get_result()->fetch_assoc();
    }

    public function findOrFail()
    {
        $result = $this->find();

        if (! $result) {
            abort();
        }

        return $result;
    }
}
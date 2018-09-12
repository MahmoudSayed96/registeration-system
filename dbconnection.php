<?php
    //Database Attributes
    $server_name = 'localhost';
    $username = 'root';
    $password = '';
    $dbname = 'web_pro2';

    $conn = new mysqli($server_name,$username,$password,$dbname);
    if($conn->connect_error) {
        die($conn->connect_error);
    }
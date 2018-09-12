<?php
    require 'dbconnection.php';

    //Store Users Data
    if(isset($_POST['person'])) {
        //Convert the person object string to associative array
        $person = json_decode($_POST['person'],true);
        $username = $person['username'];
        $password = md5($person['password']);//encrypt the password
        $email = $person['email'];

        //Store person data in database
        $sql = "INSERT INTO `person` VALUES('$username','$password','$email')";
        $conn->query($sql);
        if($conn->affected_rows > 0) {
            echo "Data Sotred Correctaly:)";
        } else {
            echo "There's an error, Tray again):";
        }

    }
    //Stor Event Data
    if(isset($_POST['event'])) {
        $events = json_decode($_POST['event'],true);
        for($i = 0; $i < count($events); $i++) {

            $type = $events[$i]['type'];
            $target = $events[$i]['target'];
            $time = $events[$i]['time'];

            $sql = "INSERT INTO `event` VALUES('$type','$target','$time')";
            $conn->query($sql);
        }
    }
    //Restrieve Events Data
    if(isset($_GET['events'])) {
        $sql = "SELECT * FROM `event`";
        $result = $conn->query($sql);
        $event_data = array();
        while($row = $result->fetch_assoc()) {
            array_push($event_data,$row);
        }
        echo json_encode($event_data);
    }
    //Retrieve Users
    if(isset($_GET['users'])) {
        $sql = "SELECT * FROM `person`";
        $result = $conn->query($sql);
        $user_data = array();
        while($row = $result->fetch_assoc()){
            //Store all rows in array
            array_push($user_data,$row);
        }
        echo json_encode($user_data);
    }
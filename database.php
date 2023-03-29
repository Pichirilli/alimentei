<?php

    $conn = new PDO("mysql:host=HOST; dbname=feeded; charset=utf8", "USER", "PASSWORD"); 
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 
    $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

?>
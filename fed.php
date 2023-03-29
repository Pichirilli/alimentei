<?php
    date_default_timezone_set('America/Sao_Paulo');
    session_start();
    
    function fed_register($conn) {
        $date = date('Y-m-d H:i:s');
        $nickname = $_SESSION['nickname'];
        $avatar_src = $_SESSION['avatar_src'];
        $ip = $_SERVER['REMOTE_ADDR'];
        $user_agent = $_SERVER['HTTP_USER_AGENT'];
    
        $stmt = $conn->prepare('INSERT INTO fed (fed_at, nickname, avatar_src, ip, user_agent) VALUES (:date_now, :nickname, :avatar_src, :ip, :user_agent)');
        $stmt->bindValue(':date_now', $date);
        $stmt->bindValue(':nickname', $nickname);
        $stmt->bindValue(':avatar_src', $avatar_src);
        $stmt->bindValue(':ip', $ip);
        $stmt->bindValue(':user_agent', $user_agent);
        $stmt->execute();

        setcookie('button_disabled', $date);
        setcookie('day', $date);

        header("Location: index.php?conn=success");
    }

    try {
        $date = new DateTime();
        $conn = new PDO("mysql:host=HOST; dbname=feeded; charset=utf8", "USER", "PASSWORD"); 
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 
        $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

        $table_name = 'fed';
        $sql = "SELECT * FROM $table_name";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        if (count($results) > 0) {
            $last_result = array_pop($results);
            $last_result_date = new DateTime($last_result['fed_at']);
    
            $minutes_interval = 5;
            $interval = date_diff($date, $last_result_date);
    
            if ($minutes_interval <= $interval->i) {
                fed_register($conn);
            } else {
                header('Location: index.php?conn=fed_recently');
            }
        } else {
            fed_register($conn);
        }
    } catch (PDOException $exception) {
        // die('error:' . $exception->getMessage());
        header("Location: index.php?conn=failed");
    }
?>
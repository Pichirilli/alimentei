<?php
    session_start();
    $_SESSION['nickname'] = $_POST['nickname'];
    $_SESSION['avatar_src'] = $_POST['avatar_src'];

    header('Location: index.php');
?>
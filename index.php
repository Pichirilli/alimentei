<?php
    session_start();

    date_default_timezone_set('America/Sao_Paulo');
    setlocale(LC_TIME, 'pt_BR.utf-8');

    $today = date('Y-m-d H:i:s');
    $today = new DateTime($today);

    if (isset($_GET['config'])) {
        if ($_GET['config'] == true) {
            $config_modal = true;
        }
    } else {
        if (isset($_GET['login'])) {
            if ($_GET['login'] == 'required') {
                $login_modal = true;
            }
        } elseif (!isset($_SESSION['nickname'])) {
            header('Location: index.php?login=required');
        }
    }

    try {
        include('database.php');

        $table_name = 'fed';
        $sql = "SELECT * FROM $table_name";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $results_per_day = [];

        foreach ($results as $result) {
            $day = date('Y-m-d', strtotime($result['fed_at']));
            if (!isset($results_per_day[$day])) {
                $results_per_day[$day] = [];
            }
            $results_per_day[$day][] = $result;
        }

        setcookie('results', json_encode($results_per_day));

    } catch (PDOexception $exception){
        echo "";
    }
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css"
        integrity="sha512-SzlrxWUlpfuzQ+pcUCosxcglQRNAq/DZjVsC0lE40xsADsfeQoEypE+enwcOiGjk/bSuGGKHEyjSoQ1zVisanQ=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="./public/css/style.css">
    <link rel="stylesheet" href="./public/css/index.css">
    <title>Document</title>
</head>

<body>
    <?php
        function buildModal($title, $exit) {
            $exit ? $exit = "<span class='content-top__close'><i class='fa-solid fa-xmark'></i></span>" : $exit = '';
            isset($_SESSION['avatar_src']) ? $avatar = "<p id='currentAvatar' style='display: none;'>{$_SESSION['avatar_src']}</p>" : $avatar = ''; 
            isset($_SESSION['nickname']) ? $nickname = $_SESSION['nickname'] : $nickname = '';
            return "<div id='loginModal' class='login-modal'>
                    {$avatar}
                    <div class='login-modal__content'>
                        <div class='login-modal__content-top'>
                            <h3 class='content-top__title'>{$title}</h3>
                            {$exit}
                        </div>
                        <div class='login-modal__content-main'>
                            <form method='POST' class='modal__content-main__form' id='loginForm'>
                                <div class='modal__content-main__form-nickname'>
                                    <label class='content-main__form-label' for='nickname'>Apelido:</label>
                                    <input name='nickname' id='nickname' value='{$nickname}' class='content-main__form-input' placeholder='Apelido' required>
                                </div>
                                <div class='content-main__form-avatar'>
                                    <label class='content-main__form-label'>Avatar:</label>
                                    <div class='content-main__form-image__container' id='avatarContainer'>
                                        <img src='./public/img/lion.jpg' alt='Usuário' class='content-main__form-avatar'>
                                        <img src='./public/img/eagle.png' alt='Usuário' class='content-main__form-avatar'>
                                        <img src='./public/img/giraffe.jpg' alt='Usuário' class='content-main__form-avatar'>
                                        <img src='./public/img/turtle.jpg' alt='Usuário' class='content-main__form-avatar'>
                                    </div>
                                </div>
                                <button class='content-main__form-submit' type='submit'>Salvar</button>
                            </form>
                        </div>
                    </div>
                </div>";
        }
        if (isset($login_modal)) {
            if ($login_modal) {
                $modal = buildModal("Login", false);
                echo $modal;
            }
        }
        if (isset($config_modal)) {
            if ($config_modal) {
                $modal = buildModal("Configurações", true);
                echo $modal;
            }
        }
    ?>
    <header class="header">
        <h1 class="header-title">Alimentei</h1>
        <button class="header-config"><i class="fa-solid fa-gear"></i></button>
    </header>
    <main class="main">
        <button class="main-fed" id="mainFed"></button>
        <section class="main-register">
            <div class="register-top">
                <button class="register-top__controller-left previous"><i class="fa-solid fa-arrow-left"></i></button>
                <h2 class="register-top__title">Registro</h2>
                <button class="register-top__controller-right next"><i class="fa-solid fa-arrow-right"></i></button>
            </div>
            <div class="register-bottom">
                <p class="register-bottom__day"></p>
            </div>
        </section>
        <section class="main-feeded">
        </section>
    </main>
    <footer class="footer">
        <div class="feedings">
            <?php
            
                $current_year = date("Y");

                $sql = "SELECT * FROM fed WHERE YEAR(fed_at) = :current_year";
                $stmt = $conn->prepare($sql);
                $stmt->execute(["current_year" => $current_year]);
                
                $results_in_current_year = $stmt->fetchAll();
            
            ?>
            <p class="feedings-info">Registros em <span number-style><?=$current_year?></span>:
                <span number-style><?=count($results_in_current_year)?></span>
            </p>
        </div>
        <p class="copyright">&copy; Copyright Alimentei <span number-style>2023</span></p>
    </footer>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.4/jquery.min.js"
        integrity="sha512-pumBsjNRGGqkPzKHndZMaAG+bir374sORyzM3uulLV14lN5LyykqNk8eEeUlUkB3U0M4FApyaHraT65ihJhDpQ=="
        crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="./public/js/index.js" type="text/javascript"></script>
    <script src="./public/js/modal_login.js" type="text/javascript"></script>
</body>

</html>
<?php

if (!empty($_POST)) {

    $servidor = "localhost:3306"; // 'localhost:3306' no xampp | 'db' no docker
    $usuario = "root";
    $senha = "";

    $conn = new PDO("mysql:host=$servidor;dbname=bdestoque", $usuario, $senha);

    // Se o usuário está tentando cadastrar
    if (isset($_POST['name'])) {
        $nome = $_POST['name'];
        $email = $_POST['email'];
        $senha = password_hash($_POST['password'], PASSWORD_DEFAULT);

        try {
            $stmt = $conn->prepare("INSERT INTO usuarios(nome, senha, email) VALUES (:nome, :senha, :email)");
            $stmt->bindParam(':nome', $nome);
            $stmt->bindParam(':senha', $senha);
            $stmt->bindParam(':email', $email);
            $stmt->execute();

            echo "
                <h2 class='mb-4' style='text-align: center; margin-top: 25px'>Cadastrado com sucesso, agora faça login</h2>
                <!-- sweetalert to show key -->
                <script>
                    document.addEventListener('DOMContentLoaded', function() {
                        Swal.fire({
                            title: 'Cadastro bem-sucedido!',
                            html: 'Agora você pode fazer login no aplicativo.',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        });
                    });
                </script>
            ";
        } catch (PDOException $e) {
            echo "<h2 class='pagetitle text-white text-center title titleshadow'>Falha no cadastro</h2>";
        }
    }
    // Se o usuário está tentando logar
    else if (isset($_POST['email']) && isset($_POST['password'])) {
        $email = $_POST['email'];
        $senha = $_POST['password'];

        // Get the user by email
        $loginStmt = $conn->prepare("SELECT * FROM usuarios WHERE email = :email");
        $loginStmt->bindParam(':email', $email);
        $loginStmt->execute();
        $user = $loginStmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($senha, $user['senha'])) {
            header('Location: sobre.html');
            exit();
        } else {
            echo "<h2 class='pagetitle text-white text-center title titleshadow'>Login inválido</h2>";
        }
    }

    $conn = null;
}

?>


<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro - Estoque Inteligente</title>
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/form.css">
</head>

<body>
    <header>
        <nav class="navbar">
            <div class="logo-container">
                <img src="imagens/logo.jpg" alt="Logo Estoque Inteligente" class="logo">
                <span class="brand-name">Estoque Inteligente</span>
            </div>
            <div class="menu">
                <a href="index.html" class="nav-item">Início</a>
                <a href="sobre.html" class="nav-item">Sobre Nós</a>
                <a href="manual.html" class="nav-item">Manual</a>
                <a href="cadastro.html" class="btn btn-primary">Login/Cadastro</a>
            </div>
        </nav>
    </header>
    <main class="container">
        <section class="form-section">

            <div id="success-message" class="success-message hidden">
                <p class="message-text"></p>
                <p class="message-key"></p>
                <button class="close-btn">&times;</button>
            </div>
            <div class="form-content">
                <div class="form-header">
                    <h2>Bem-vindo(a) de volta!</h2>
                    <p>Faça login para gerenciar seu estoque.</p>
                </div>

                <div class="form-box login-box active" id="login-form">
                    <form action="" method="POST">
                        <div class="form-group">
                            <label for="login-email">E-mail</label>
                            <input type="email" id="login-email" name="email" placeholder="Seu e-mail" required>
                        </div>
                        <div class="form-group">
                            <label for="login-password">Senha</label>
                            <input type="password" id="login-password" name="password" placeholder="Sua senha" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Entrar</button>
                    </form>
                    <p class="form-footer">Não tem uma conta? <a href="#" id="show-cadastro">Cadastre-se</a></p>
                </div>

                <div class="form-box cadastro-box" id="cadastro-form">
                    <form action="" method="POST">
                        <div class="form-group">
                            <label for="cadastro-name">Nome completo</label>
                            <input type="text" id="cadastro-name" name="name" placeholder="Seu nome" required>
                        </div>
                        <div class="form-group">
                            <label for="cadastro-email">E-mail</label>
                            <input type="email" id="cadastro-email" name="email" placeholder="Seu e-mail" required>
                        </div>
                        <div class="form-group">
                            <label for="cadastro-password">Senha</label>
                            <input type="password" id="cadastro-password" name="password" placeholder="Crie uma senha"
                                required>
                        </div>
                        <button type="submit" class="btn btn-primary">Cadastrar</button>
                    </form>
                    <p class="form-footer">Já tem uma conta? <a href="#" id="show-login">Faça Login</a></p>
                </div>
            </div>
        </section>
    </main>

    <footer>
        <p>&copy; 2025 Estoque Inteligente. Todos os direitos reservados.</p>
    </footer>

    <script src="js/main.js"></script>
    <script src="js/cadastro.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11" defer></script>
</body>

</html>
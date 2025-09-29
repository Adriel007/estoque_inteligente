<?php

$servername = "localhost:3306";
$username = "root";
$password = "";
$dbname = "estoque";
try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);

    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "CREATE TABLE usuarios (
  id_usuario int(11) NOT NULL,
  nome varchar(100) NOT NULL,
  email varchar(100) NOT NULL,
  senha varchar(255) NOT NULL,
  tipo_usuario enum('admin','funcionario') NOT NULL DEFAULT 'funcionario',
  data_criacao datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;";

$conn->exec($sql);
echo "Tabela Usuário criada com sucesso";
} catch(PDOException $e) {
echo $sql . "<br>" . $e->getMessage();
}

$conn = null;
?>
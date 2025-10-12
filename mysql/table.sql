-- Garante que você está usando o banco de dados 'estoque'
USE estoque;

-- Estrutura da tabela `usuarios`
CREATE TABLE `usuarios` (
  `id_usuario` INT(11) NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `senha` VARCHAR(255) NOT NULL,
  `tipo_usuario` ENUM('admin','funcionario') NOT NULL DEFAULT 'funcionario',
  `chave_ativacao` VARCHAR(10) DEFAULT NULL,
  `data_criacao` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `email_unico` (`email`),
  UNIQUE KEY `chave_unica` (`chave_ativacao`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci, AUTO_INCREMENT=1 ;

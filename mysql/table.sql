-- Garante que você está usando o banco de dados 'estoque'
USE estoque;

--
-- Estrutura da tabela `usuarios`
--
CREATE TABLE `usuarios` (
  `id_usuario` INT(11) NOT NULL,
  `nome` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `senha` VARCHAR(255) NOT NULL,
  `tipo_usuario` ENUM('admin','funcionario') NOT NULL DEFAULT 'funcionario',
  `data_criacao` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para a tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email_unico` (`email`); -- É uma boa prática ter um índice único para o email

--
-- AUTO_INCREMENT para a tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;

--
-- Exemplo de inserção de um usuário (opcional)
--
/*
INSERT INTO `usuarios` (`nome`, `email`, `senha`, `tipo_usuario`) VALUES
('Admin Padrão', 'admin@estoque.com', 'SUA_SENHA_HASH', 'admin');
*/
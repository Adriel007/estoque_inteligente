-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 15/10/2025 às 23:30
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `bdestoque`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `fornecedores`
--

CREATE TABLE `fornecedores` (
  `id_fornecedor` int(11) NOT NULL,
  `empresa` varchar(40) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `cnpj` varchar(25) NOT NULL,
  `nome_repre` varchar(50) NOT NULL,
  `telefone` varchar(15) NOT NULL,
  `categoria` varchar(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  `cep` varchar(12) NOT NULL,
  `prazodeentrega` varchar(20) NOT NULL,
  `financeiro` float NOT NULL,
  `condicoesdepag` varchar(20) NOT NULL,
  `uf` varchar(25) NOT NULL,
  `bairro` varchar(25) NOT NULL,
  `numero` int(11) NOT NULL,
  `status` varchar(20) NOT NULL,
  `cidade` varchar(30) NOT NULL,
  `endereco` varchar(50) NOT NULL,
  `complemento` varchar(100) NOT NULL,
  `obs` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `fornecedores`
--

INSERT INTO `fornecedores` (`id_fornecedor`, `empresa`, `id_usuario`, `cnpj`, `nome_repre`, `telefone`, `categoria`, `email`, `cep`, `prazodeentrega`, `financeiro`, `condicoesdepag`, `uf`, `bairro`, `numero`, `status`, `cidade`, `endereco`, `complemento`, `obs`) VALUES
(0, 'Fortec', 1, '443097769', 'Rose', '(55) 13 99146-4', 'higiene', 'Gustavorsmelo@gmail.com', '113732857', '3 meses', 15000, 'boleto', 'São Paulo', 'catiapoa', 56, 'acordo fechado', 'Sao paulo', 'sfasfasfasfsaf', '56', 'fasfasfasfas');

-- --------------------------------------------------------

--
-- Estrutura para tabela `funcionários`
--

CREATE TABLE `funcionários` (
  `id_funcionarios` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `nome` varchar(40) NOT NULL,
  `cargo` varchar(40) NOT NULL,
  `salario` float NOT NULL,
  `data_nascimento` date NOT NULL,
  `email` varchar(40) NOT NULL,
  `data_admissao` date NOT NULL,
  `cpf` varchar(15) NOT NULL,
  `telefone` varchar(15) NOT NULL,
  `cep` varchar(13) NOT NULL,
  `rg` varchar(30) NOT NULL,
  `uf` varchar(20) NOT NULL,
  `bairro` varchar(20) NOT NULL,
  `endereco` varchar(50) NOT NULL,
  `numero` int(11) NOT NULL,
  `complemento` varchar(100) NOT NULL,
  `obs` varchar(500) NOT NULL,
  `cidade` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `funcionários`
--

INSERT INTO `funcionários` (`id_funcionarios`, `id_usuario`, `nome`, `cargo`, `salario`, `data_nascimento`, `email`, `data_admissao`, `cpf`, `telefone`, `cep`, `rg`, `uf`, `bairro`, `endereco`, `numero`, `complemento`, `obs`, `cidade`) VALUES
(1, 1, 'Leandro', 'programador', 3000, '1980-02-20', 'leandro@gmail.com', '2025-10-14', '55582072802', '(12) 920-3579', '11370480', '14678765', 'São Paulo', 'Catiapoa', 'Rua vitoria de santos antao', 56, '56', 'sdnfsdnbgjksdkjgkjdfsbg', 'Sao vicente'),
(2, 1, 'gilmar', 'programador', 1324120000, '2000-10-12', 'sfvfdsgdfvd', '2020-10-21', '2131313', '(13) 123-1231', '123213123', '31231231', 'São Paulo', 'sddsfsd', 'dfsd', 312, '123123', 'sdfsdf', 'dvdfgd');

-- --------------------------------------------------------

--
-- Estrutura para tabela `movimentacoes`
--

CREATE TABLE `movimentacoes` (
  `id_mov` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `id_produto` int(11) NOT NULL,
  `tipo` enum('entrada','saida') NOT NULL,
  `quantidade` int(11) NOT NULL,
  `data_mov` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `movimentacoes`
--

INSERT INTO `movimentacoes` (`id_mov`, `id_usuario`, `id_produto`, `tipo`, `quantidade`, `data_mov`) VALUES
(1, 1, 1, 'entrada', 10, '2025-09-27 09:00:00');

-- --------------------------------------------------------

--
-- Estrutura para tabela `produtos`
--

CREATE TABLE `produtos` (
  `id_produto` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `nome` varchar(100) NOT NULL,
  `quantidade` int(11) DEFAULT NULL,
  `preco` decimal(10,2) NOT NULL,
  `data_validade` datetime DEFAULT current_timestamp(),
  `descricao` varchar(255) NOT NULL,
  `categoria` varchar(50) NOT NULL DEFAULT '''Geral''',
  `data_cadastro` datetime NOT NULL DEFAULT current_timestamp(),
  `condicao` varchar(20) DEFAULT NULL,
  `atributo` varchar(30) DEFAULT NULL,
  `caracteristica` varchar(30) DEFAULT NULL,
  `fornecedores` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `transacoes`
--

CREATE TABLE `transacoes` (
  `id_usuarios` int(11) NOT NULL,
  `id_produtos` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuários`
--

CREATE TABLE `usuários` (
  `id_usuario` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `tipo_usuario` enum('admin','funcionario') NOT NULL DEFAULT 'funcionario',
  `data_criacao` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuários`
--

INSERT INTO `usuários` (`id_usuario`, `nome`, `email`, `senha`, `tipo_usuario`, `data_criacao`) VALUES
(1, 'Glória Kristina Ferreira Lagerstrom', 'gloria@gmail.com', '1234567', 'admin', '2025-09-27 13:14:24'),
(2, 'alefer silva marinho', 'gustavorsmelo@gmail.com', '123', 'funcionario', '2025-10-12 20:44:01');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `fornecedores`
--
ALTER TABLE `fornecedores`
  ADD PRIMARY KEY (`id_fornecedor`,`empresa`),
  ADD UNIQUE KEY `empresa` (`empresa`),
  ADD KEY `fk_fornecedor_usuario` (`id_usuario`);

--
-- Índices de tabela `funcionários`
--
ALTER TABLE `funcionários`
  ADD PRIMARY KEY (`id_funcionarios`),
  ADD KEY `fk_id_usuario` (`id_usuario`);

--
-- Índices de tabela `movimentacoes`
--
ALTER TABLE `movimentacoes`
  ADD PRIMARY KEY (`id_mov`),
  ADD KEY `id_produto` (`id_produto`),
  ADD KEY `fk_movimentacoes_usuarios` (`id_usuario`);

--
-- Índices de tabela `produtos`
--
ALTER TABLE `produtos`
  ADD PRIMARY KEY (`id_produto`),
  ADD KEY `fk_produtos_usuarios` (`id_usuario`),
  ADD KEY `fk_fornecedor_empresa` (`fornecedores`);

--
-- Índices de tabela `transacoes`
--
ALTER TABLE `transacoes`
  ADD KEY `fk_id_produtos` (`id_produtos`),
  ADD KEY `fk_id_usuarios` (`id_usuarios`);

--
-- Índices de tabela `usuários`
--
ALTER TABLE `usuários`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `funcionários`
--
ALTER TABLE `funcionários`
  MODIFY `id_funcionarios` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `movimentacoes`
--
ALTER TABLE `movimentacoes`
  MODIFY `id_mov` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `produtos`
--
ALTER TABLE `produtos`
  MODIFY `id_produto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `usuários`
--
ALTER TABLE `usuários`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `fornecedores`
--
ALTER TABLE `fornecedores`
  ADD CONSTRAINT `fk_fornecedor_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuários` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `funcionários`
--
ALTER TABLE `funcionários`
  ADD CONSTRAINT `fk_id_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuários` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `movimentacoes`
--
ALTER TABLE `movimentacoes`
  ADD CONSTRAINT `fk_movimentacoes_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuários` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `produtos`
--
ALTER TABLE `produtos`
  ADD CONSTRAINT `fk_fornecedor_empresa` FOREIGN KEY (`fornecedores`) REFERENCES `fornecedores` (`empresa`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_produtos_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuários` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `transacoes`
--
ALTER TABLE `transacoes`
  ADD CONSTRAINT `fk_id_produtos` FOREIGN KEY (`id_produtos`) REFERENCES `produtos` (`id_produto`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_id_usuarios` FOREIGN KEY (`id_usuarios`) REFERENCES `usuários` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

--
-- Banco de dados: `bdestoque` - Esquema Otimizado
--

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios`
--
-- Tabela inalterada (essencial para autenticação)
--
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `tipo_usuario` enum('admin','funcionario') NOT NULL DEFAULT 'funcionario',
  `data_criacao` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuarios`
--
/*
-- NÃO FUNCIONAM POIS ESTÃO SEM HASH
INSERT INTO `usuarios` (`id_usuario`, `nome`, `email`, `senha`, `tipo_usuario`, `data_criacao`) VALUES
(1, 'Glória Kristina Ferreira Lagerstrom', 'gloria@gmail.com', '1234567', 'admin', '2025-09-27 13:14:24'),
(2, 'alefer silva marinho', 'gustavorsmelo@gmail.com', '123', 'funcionario', '2025-10-12 20:44:01'),
(3, 'Funcionário João', 'joao@estoque.com', '123456', 'funcionario', '2025-10-12 20:44:01');
*/

-- --------------------------------------------------------

--
-- Estrutura para tabela `fornecedores` (Simplificada)
--
-- Foco em informações de contato e condições comerciais
--
DROP TABLE IF EXISTS `fornecedores`;
CREATE TABLE `fornecedores` (
  `id_fornecedor` int(11) NOT NULL,
  `empresa` varchar(40) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `cnpj` varchar(25) NOT NULL,
  `nome_repre` varchar(50) NOT NULL,
  `telefone` varchar(15) NOT NULL,
  `categoria` varchar(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  `condicoesdepag` varchar(50) NOT NULL,
  `prazodeentrega` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `fornecedores`
--
INSERT INTO `fornecedores` (`id_fornecedor`, `empresa`, `id_usuario`, `cnpj`, `nome_repre`, `telefone`, `categoria`, `email`, `condicoesdepag`, `prazodeentrega`) VALUES
(1, 'Fortec Logística', 1, '44.309.776/0001-01', 'Rose Siqueira', '(13) 99146-4555', 'Higiene e Limpeza', 'contato@fortec.com', 'Boleto 30/60/90', '7 dias úteis'),
(2, 'TechSuprimentos LTDA', 1, '01.234.567/0001-10', 'Carlos Mendes', '(11) 98765-4321', 'Eletrônicos', 'vendas@techsup.com.br', 'Cartão de Crédito', '2 dias úteis'),
(3, 'Alimentos Frescos SA', 2, '88.999.000/0001-50', 'Ana Clara Lima', '(21) 55555-1234', 'Perecíveis', 'sac@frescos.com', 'À Vista', '1 dia útil');


-- --------------------------------------------------------

--
-- Estrutura para tabela `produtos` (Simplificada)
--
-- Campos como 'condicao', 'atributo', 'caracteristica' foram removidos.
-- O campo 'fornecedores' (empresa) é mantido para manter a FK original.
--
DROP TABLE IF EXISTS `produtos`;
CREATE TABLE `produtos` (
  `id_produto` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `nome` varchar(100) NOT NULL,
  `quantidade` int(11) DEFAULT 0,
  `preco` decimal(10,2) NOT NULL,
  `data_validade` date DEFAULT NULL,
  `descricao` varchar(255) NOT NULL,
  `categoria` varchar(50) NOT NULL DEFAULT 'Geral',
  `fornecedores` varchar(40) NOT NULL,
  `imagem` varchar(100) DEFAULT NULL,
  `data_cadastro` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `produtos`
--
INSERT INTO `produtos` (`id_produto`, `id_usuario`, `nome`, `quantidade`, `preco`, `data_validade`, `descricao`, `categoria`, `fornecedores`, `imagem`, `data_cadastro`) VALUES
(1, 1, 'Notebook Gamer X900', 5, 4500.00, '2030-12-31', 'Notebook de alta performance com 16GB RAM e SSD de 1TB.', 'Eletrônicos', 'TechSuprimentos LTDA', NULL, '2025-10-15 23:00:00'),
(2, 1, 'Detergente Concentrado (5L)', 50, 25.50, '2026-06-01', 'Detergente multiuso para limpeza pesada, alta concentração.', 'Higiene e Limpeza', 'Fortec Logística', NULL, '2025-10-15 23:01:00'),
(3, 2, 'Câmera de Segurança IP', 12, 189.90, '2030-12-31', 'Câmera IP Wi-Fi com visão noturna e armazenamento em nuvem.', 'Eletrônicos', 'TechSuprimentos LTDA', NULL, '2025-10-15 23:02:00'),
(4, 2, 'Maçã Fuji (Caixa 10kg)', 30, 85.00, '2025-10-30', 'Caixa de maçãs Fuji frescas, categoria extra.', 'Perecíveis', 'Alimentos Frescos SA', NULL, '2025-10-15 23:03:00');

-- --------------------------------------------------------

--
-- Estrutura para tabela `movimentacoes`
--
-- Tabela para rastrear entradas e saídas de estoque
--
DROP TABLE IF EXISTS `movimentacoes`;
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
(1, 1, 1, 'entrada', 10, '2025-10-15 09:00:00'), -- Entrada inicial do Notebook
(2, 1, 2, 'entrada', 60, '2025-10-15 10:30:00'), -- Entrada inicial do Detergente
(3, 2, 1, 'saida', 5, '2025-10-15 11:45:00'),  -- Saída de 5 Notebooks
(4, 2, 2, 'saida', 10, '2025-10-15 12:15:00'),  -- Saída de 10 Detergentes
(5, 1, 4, 'entrada', 30, '2025-10-15 14:00:00'); -- Entrada de Maçãs

-- --------------------------------------------------------

--
-- Estrutura para tabela `funcionarios` (Simplificada)
--
-- Foco em dados de RH e contato
--
DROP TABLE IF EXISTS `funcionarios`;
CREATE TABLE `funcionarios` (
  `id_funcionarios` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `nome` varchar(40) NOT NULL,
  `cargo` varchar(40) NOT NULL,
  `salario` float NOT NULL,
  `data_nascimento` date NOT NULL,
  `email` varchar(40) NOT NULL,
  `data_admissao` date NOT NULL,
  `cpf` varchar(15) NOT NULL,
  `telefone` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `funcionarios`
--
INSERT INTO `funcionarios` (`id_funcionarios`, `id_usuario`, `nome`, `cargo`, `salario`, `data_nascimento`, `email`, `data_admissao`, `cpf`, `telefone`) VALUES
(1, 1, 'Leandro Silva', 'Gerente de Estoque', 4500.00, '1980-02-20', 'leandro@empresa.com.br', '2025-10-14', '555.820.728-02', '(12) 99203-5790'),
(2, 2, 'Gilmar Souza', 'Assistente de Logística', 2800.00, '2000-10-12', 'gilmar@empresa.com.br', '2024-05-01', '213.131.313-13', '(13) 12345-6789');


--
-- Índices para tabelas
--

--
-- Índices de tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Índices de tabela `fornecedores`
--
ALTER TABLE `fornecedores`
  ADD PRIMARY KEY (`id_fornecedor`,`empresa`),
  ADD UNIQUE KEY `empresa` (`empresa`),
  ADD KEY `fk_fornecedor_usuario` (`id_usuario`);

--
-- Índices de tabela `produtos`
--
ALTER TABLE `produtos`
  ADD PRIMARY KEY (`id_produto`),
  ADD KEY `fk_produtos_usuarios` (`id_usuario`),
  ADD KEY `fk_fornecedor_empresa` (`fornecedores`);

--
-- Índices de tabela `movimentacoes`
--
ALTER TABLE `movimentacoes`
  ADD PRIMARY KEY (`id_mov`),
  ADD KEY `id_produto` (`id_produto`),
  ADD KEY `fk_movimentacoes_usuarios` (`id_usuario`);

--
-- Índices de tabela `funcionarios`
--
ALTER TABLE `funcionarios`
  ADD PRIMARY KEY (`id_funcionarios`),
  ADD KEY `fk_id_usuario` (`id_usuario`);

--
-- AUTO_INCREMENT para tabelas
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `fornecedores`
  MODIFY `id_fornecedor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `produtos`
  MODIFY `id_produto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

ALTER TABLE `movimentacoes`
  MODIFY `id_mov` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

ALTER TABLE `funcionarios`
  MODIFY `id_funcionarios` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;


--
-- Restrições para tabelas
--

--
-- Restrições para tabela `fornecedores`
--
ALTER TABLE `fornecedores`
  ADD CONSTRAINT `fk_fornecedor_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabela `produtos`
--
ALTER TABLE `produtos`
  ADD CONSTRAINT `fk_fornecedor_empresa` FOREIGN KEY (`fornecedores`) REFERENCES `fornecedores` (`empresa`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_produtos_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabela `movimentacoes`
--
ALTER TABLE `movimentacoes`
  ADD CONSTRAINT `fk_movimentacoes_produtos` FOREIGN KEY (`id_produto`) REFERENCES `produtos` (`id_produto`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_movimentacoes_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabela `funcionarios`
--
ALTER TABLE `funcionarios`
  ADD CONSTRAINT `fk_funcionarios_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- 🚀 POPULAÇÃO EXTRA PARA DASHBOARDS

-- ==============================
-- 1️⃣  NOVOS USUÁRIOS
-- ==============================
/*
-- NÃO FUNCIONAM POIS ESTÃO SEM HASH
INSERT INTO usuarios (nome, email, senha, tipo_usuario, data_criacao) VALUES
('Mariana Duarte', 'mariana@empresa.com', '123456', 'funcionario', NOW()),
('Roberto Lima', 'roberto@empresa.com', '123456', 'funcionario', NOW()),
('Patrícia Gomes', 'patricia@empresa.com', '123456', 'admin', NOW()),
('Felipe Rocha', 'felipe@empresa.com', '123456', 'funcionario', NOW());
*/

-- ==============================
-- 2️⃣  NOVOS FORNECEDORES
-- ==============================
INSERT INTO fornecedores (empresa, id_usuario, cnpj, nome_repre, telefone, categoria, email, condicoesdepag, prazodeentrega) VALUES
('OfficeMax Distribuidora', 3, '12.345.678/0001-22', 'Luciana Prado', '(11) 98541-2222', 'Papelaria', 'vendas@officemax.com', '30 dias', '5 dias úteis'),
('MegaBebidas LTDA', 2, '98.765.432/0001-99', 'Paulo Souza', '(21) 97777-8888', 'Bebidas', 'contato@megabebidas.com', 'Boleto 15 dias', '3 dias úteis'),
('Construmais Materiais', 1, '11.222.333/0001-55', 'Rogério Tavares', '(31) 98888-9999', 'Materiais de Construção', 'rogerio@construmais.com', 'À vista', '2 dias úteis'),
('Moda & Estilo Confecções', 4, '44.555.666/0001-77', 'Carla Silva', '(85) 98877-4455', 'Vestuário', 'sac@modaestilo.com', 'Cartão de Crédito', '5 dias úteis'),
('PetMais Suprimentos', 5, '77.888.999/0001-12', 'João Batista', '(19) 97766-5544', 'Pet Shop', 'contato@petmais.com', 'Boleto 30 dias', '4 dias úteis');

-- ==============================
-- 3️⃣  NOVOS PRODUTOS
-- ==============================
INSERT INTO produtos (id_usuario, nome, quantidade, preco, data_validade, descricao, categoria, fornecedores, imagem, data_cadastro) VALUES
(3, 'Caneta Esferográfica Azul (CX c/ 50)', 100, 35.00, '2030-01-01', 'Canetas de alta durabilidade e tinta suave.', 'Papelaria', 'OfficeMax Distribuidora', NULL, NOW()),
(3, 'Caderno Universitário 200 folhas', 80, 15.90, '2030-01-01', 'Caderno com capa dura e folhas pautadas.', 'Papelaria', 'OfficeMax Distribuidora', NULL, NOW()),
(2, 'Refrigerante Cola 2L', 200, 8.50, '2026-12-01', 'Refrigerante sabor cola, garrafa de 2 litros.', 'Bebidas', 'MegaBebidas LTDA', NULL, NOW()),
(2, 'Água Mineral 500ml', 300, 2.20, '2027-05-10', 'Água mineral natural sem gás.', 'Bebidas', 'MegaBebidas LTDA', NULL, NOW()),
(1, 'Cimento CP-II 50kg', 60, 39.90, '2030-12-31', 'Saco de cimento de alta resistência.', 'Materiais de Construção', 'Construmais Materiais', NULL, NOW()),
(4, 'Blusa Feminina Algodão M', 40, 59.90, '2030-12-31', 'Blusa confortável 100% algodão.', 'Vestuário', 'Moda & Estilo Confecções', NULL, NOW()),
(4, 'Calça Jeans Masculina 42', 35, 129.90, '2030-12-31', 'Calça jeans azul escuro com elastano.', 'Vestuário', 'Moda & Estilo Confecções', NULL, NOW()),
(5, 'Ração Premium Cães Adultos 15kg', 25, 199.90, '2026-11-20', 'Ração rica em proteínas e vitaminas.', 'Pet Shop', 'PetMais Suprimentos', NULL, NOW()),
(5, 'Areia Sanitária para Gatos 4kg', 45, 22.90, '2027-02-15', 'Areia higiênica com controle de odor.', 'Pet Shop', 'PetMais Suprimentos', NULL, NOW());

-- ==============================
-- 4️⃣  FUNCIONÁRIOS ADICIONAIS
-- ==============================
INSERT INTO funcionarios (id_usuario, nome, cargo, salario, data_nascimento, email, data_admissao, cpf, telefone) VALUES
(3, 'Carlos Alberto', 'Supervisor de Estoque', 3800.00, '1985-07-09', 'carlos@empresa.com', '2023-02-15', '222.333.444-55', '(11) 99999-1111'),
(4, 'Tatiane Ramos', 'Analista de Compras', 4200.00, '1990-03-22', 'tatiane@empresa.com', '2022-06-01', '333.444.555-66', '(21) 91234-5678'),
(5, 'Fernanda Castro', 'Atendente de Vendas', 2500.00, '1998-08-17', 'fernanda@empresa.com', '2024-01-20', '444.555.666-77', '(31) 92345-6789');

-- ==============================
-- 5️⃣  MOVIMENTAÇÕES DIVERSIFICADAS
-- ==============================
INSERT INTO movimentacoes (id_usuario, id_produto, tipo, quantidade, data_mov) VALUES
-- Papelaria
(3, 5, 'entrada', 150, '2025-09-01 09:00:00'),
(3, 5, 'saida', 30, '2025-09-10 11:30:00'),
(3, 6, 'entrada', 200, '2025-09-05 10:00:00'),
(3, 6, 'saida', 50, '2025-09-15 15:00:00'),

-- Bebidas
(2, 7, 'entrada', 500, '2025-10-01 08:00:00'),
(2, 7, 'saida', 120, '2025-10-05 14:00:00'),
(2, 8, 'entrada', 800, '2025-10-02 09:00:00'),
(2, 8, 'saida', 300, '2025-10-10 10:30:00'),

-- Materiais de Construção
(1, 9, 'entrada', 100, '2025-10-03 13:00:00'),
(1, 9, 'saida', 20, '2025-10-05 17:45:00'),

-- Vestuário
(4, 10, 'entrada', 80, '2025-09-25 09:15:00'),
(4, 11, 'entrada', 60, '2025-09-26 09:20:00'),
(4, 10, 'saida', 25, '2025-10-10 11:00:00'),
(4, 11, 'saida', 15, '2025-10-12 15:45:00'),

-- Pet Shop
(5, 12, 'entrada', 50, '2025-10-01 08:10:00'),
(5, 13, 'entrada', 90, '2025-10-03 08:10:00'),
(5, 12, 'saida', 10, '2025-10-08 12:20:00'),
(5, 13, 'saida', 20, '2025-10-09 09:30:00');

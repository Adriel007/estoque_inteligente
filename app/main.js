const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const mysql = require("mysql2/promise");
const fs = require("fs/promises");
const bcrypt = require("bcryptjs");

// 🧩 Configuração do banco de dados (Ajuste a senha se necessário)
const dbConfig = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "", // Garanta que a senha está correta
  database: "bdestoque",
};

let mainWindow;

// 🪟 Criação da janela principal
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // Para comunicação segura
      // Recomenda-se manter contextIsolation: true para apps de produção,
      // mas mantive false para compatibilidade com o boilerplate anterior.
      nodeIntegration: true,
      contextIsolation: false,
    },
    autoHideMenuBar: true,
  });

  mainWindow.loadFile(path.join(__dirname, "view", "login.html"));
  // mainWindow.webContents.openDevTools(); // Útil para debug
  mainWindow.on("closed", () => (mainWindow = null));
}

// 🚀 Inicialização do app
app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// 🧠 Função auxiliar para criar conexão segura
async function getConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log(`[DB] ✅ Conexão bem-sucedida com ${dbConfig.database}`);
    return connection;
  } catch (error) {
    // Diagnóstico detalhado para o desenvolvedor
    let msg = "[DB] ❌ Erro ao conectar ao banco de dados: ";
    if (error.code === "ECONNREFUSED") {
      msg +=
        "Conexão recusada. Verifique se o MySQL/MariaDB está rodando (XAMPP/WAMP).";
    } else if (error.code === "ER_ACCESS_DENIED_ERROR") {
      msg += "Usuário ou senha incorretos no 'dbConfig'.";
    } else {
      msg += error.message;
    }

    console.error(`${msg}\nDetalhes:`, error);
    // Lançamos um erro genérico para a camada de visualização
    throw new Error("Falha ao conectar ao serviço de dados.");
  }
}

// 🧾 Função utilitária para log de erros SQL
function logSQLError(action, error, query = null) {
  const timestamp = new Date().toISOString();
  console.error(`\n[${timestamp}] ❌ ERRO (${action})`);
  if (query) console.error(`🧮 Query: ${query}`);
  console.error(`📄 Código: ${error.code || "N/A"}`);
  console.error(`📜 Mensagem: ${error.message}`);
  console.error(`📦 Stack: ${error.stack}\n`);
}

// ----------------------- GESTÃO DE ARQUIVOS (Imagens) -----------------------

// 📸 Função para garantir que o diretório de imagens existe
async function ensureImageDirectory() {
  const imageDir = path.join(app.getPath("userData"), "product_images");
  try {
    await fs.access(imageDir);
  } catch {
    await fs.mkdir(imageDir, { recursive: true });
  }
  return imageDir;
}

// 🖼️ Função para salvar imagem
async function saveProductImage(imageBuffer, originalName) {
  const imageDir = await ensureImageDirectory();
  const extension = path.extname(originalName);
  const uniqueName = `${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}${extension}`;
  const imagePath = path.join(imageDir, uniqueName);

  await fs.writeFile(imagePath, imageBuffer);
  return uniqueName; // Retorna apenas o nome do arquivo para salvar no DB
}

// 🗑️ Função para deletar imagem localmente
async function deleteProductImage(imageName) {
  if (!imageName) return;
  const imagePath = path.join(
    app.getPath("userData"),
    "product_images",
    imageName
  );
  try {
    await fs.unlink(imagePath);
    console.log(`[File] Imagem ${imageName} removida com sucesso.`);
  } catch (error) {
    if (error.code !== "ENOENT") {
      // Ignora se o arquivo não existir
      console.error(`[File] Erro ao remover imagem ${imageName}:`, error);
    }
  }
}

// ----------------------- HANDLERS IPC (Lógica de Negócio) -----------------------

// 🔐 LOGIN: Autenticação de Usuário
ipcMain.handle("login", async (event, credentials) => {
  try {
    const connection = await getConnection();
    const query =
      "SELECT id_usuario, nome, email, senha, tipo_usuario FROM usuarios WHERE email = ?";
    const [rows] = await connection.execute(query, [credentials.email]);
    await connection.end();

    if (rows.length === 0) {
      return { success: false, message: "E-mail ou senha incorretos." };
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.senha
    );

    if (!isPasswordValid) {
      return { success: false, message: "E-mail ou senha incorretos." };
    }

    // Remove a senha antes de retornar
    delete user.senha;
    return { success: true, user };
  } catch (error) {
    logSQLError("Login", error);
    return { success: false, error: error.message };
  }
});

// 🏭 GET SUPPLIERS: Obtém lista de fornecedores para usar em formulários
ipcMain.handle("get-suppliers", async () => {
  try {
    const connection = await getConnection();
    // Retorna nome da empresa e ID, importantes para seleção
    const query =
      "SELECT id_fornecedor, empresa FROM fornecedores ORDER BY empresa ASC";
    const [rows] = await connection.execute(query);
    await connection.end();
    return { success: true, suppliers: rows };
  } catch (error) {
    logSQLError(
      "Get Suppliers",
      error,
      "SELECT id_fornecedor, empresa FROM fornecedores"
    );
    return { success: false, error: error.message };
  }
});

// main.js (ADICIONE ESTES NOVOS HANDLERS)

// ➕ ADD SUPPLIER: Insere um novo fornecedor
ipcMain.handle("add-supplier", async (event, supplierData) => {
  let connection;
  try {
    connection = await getConnection();
    const query =
      "INSERT INTO fornecedores (empresa, cnpj, nome_repre, telefone, categoria, email, condicoesdepag, prazodeentrega) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const [result] = await connection.execute(query, [
      supplierData.empresa,
      supplierData.cnpj,
      supplierData.nome_repre,
      supplierData.telefone,
      supplierData.categoria,
      supplierData.email,
      supplierData.condicoesdepag,
      supplierData.prazodeentrega,
    ]);
    await connection.end();
    return { success: true, id: result.insertId };
  } catch (error) {
    if (connection) await connection.end();
    logSQLError("Add Supplier", error);
    return { success: false, error: error.message };
  }
});

// ❌ DELETE SUPPLIER: Remove um fornecedor
ipcMain.handle("delete-supplier", async (event, supplierId) => {
  let connection;
  try {
    connection = await getConnection();
    const query = "DELETE FROM fornecedores WHERE id_fornecedor = ?";
    await connection.execute(query, [supplierId]);
    await connection.end();
    return { success: true };
  } catch (error) {
    if (connection) await connection.end();
    logSQLError("Delete Supplier", error);
    return { success: false, error: error.message };
  }
});

// 👨‍💼 GET EMPLOYEES: Obtém lista completa de funcionários
ipcMain.handle("get-employees", async () => {
  try {
    const connection = await getConnection();
    const query = "SELECT * FROM funcionarios ORDER BY nome ASC";
    const [rows] = await connection.execute(query);
    await connection.end();
    return { success: true, employees: rows };
  } catch (error) {
    logSQLError("Get Employees", error);
    return { success: false, error: error.message };
  }
});

// ➕ ADD EMPLOYEE: Insere um novo funcionário
ipcMain.handle("add-employee", async (event, employeeData) => {
  let connection;
  try {
    connection = await getConnection();
    // Supondo que o id_usuario virá do front-end (ex: usuário admin que está cadastrando)
    const query =
      "INSERT INTO funcionarios (id_usuario, nome, cargo, salario, data_nascimento, email, data_admissao, cpf, telefone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const [result] = await connection.execute(query, [
      employeeData.id_usuario,
      employeeData.nome,
      employeeData.cargo,
      employeeData.salario,
      employeeData.data_nascimento,
      employeeData.email,
      employeeData.data_admissao,
      employeeData.cpf,
      employeeData.telefone,
    ]);
    await connection.end();
    return { success: true, id: result.insertId };
  } catch (error) {
    if (connection) await connection.end();
    logSQLError("Add Employee", error);
    return { success: false, error: error.message };
  }
});

// ❌ DELETE EMPLOYEE: Remove um funcionário
ipcMain.handle("delete-employee", async (event, employeeId) => {
  let connection;
  try {
    connection = await getConnection();
    const query = "DELETE FROM funcionarios WHERE id_funcionarios = ?";
    await connection.execute(query, [employeeId]);
    await connection.end();
    return { success: true };
  } catch (error) {
    if (connection) await connection.end();
    logSQLError("Delete Employee", error);
    return { success: false, error: error.message };
  }
});

// 📦 GET PRODUCTS: Obtém lista completa de produtos
ipcMain.handle("get-products", async () => {
  try {
    const connection = await getConnection();
    // Junta com a tabela de fornecedores para mostrar o nome completo da empresa
    const query = `
        SELECT p.*, f.empresa as nome_fornecedor
        FROM produtos p
        JOIN fornecedores f ON p.fornecedores = f.empresa
        ORDER BY p.nome ASC
    `;
    const [rows] = await connection.execute(query);
    await connection.end();
    return { success: true, products: rows };
  } catch (error) {
    logSQLError(
      "Get Products",
      error,
      "SELECT * FROM produtos JOIN fornecedores..."
    );
    return { success: false, error: error.message };
  }
});

// ➕ ADD PRODUCT: Insere um novo produto
ipcMain.handle("add-product", async (event, productData) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.beginTransaction(); // Inicia transação

    // Processa a imagem se existir
    let imageName = null;
    if (productData.image) {
      const imageBuffer = Buffer.from(
        productData.image.split(",")[1],
        "base64"
      );
      // Salva a imagem localmente e obtém o nome do arquivo
      imageName = await saveProductImage(imageBuffer, productData.imageName);
    }

    // A query foi expandida para incluir campos importantes como 'fornecedores' e 'data_validade'
    const query =
      "INSERT INTO produtos (id_usuario, nome, quantidade, preco, data_validade, descricao, categoria, fornecedores, imagem) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    const [result] = await connection.execute(query, [
      productData.userId, // id_usuario (do usuário logado)
      productData.nome,
      productData.quantidade || 0, // Garante que a quantidade inicial é 0 se não for fornecida
      productData.preco,
      productData.data_validade || null, // data_validade
      productData.descricao,
      productData.categoria || "Geral",
      productData.fornecedorEmpresa, // 'fornecedores' é o nome da empresa
      imageName,
    ]);

    await connection.commit(); // Confirma transação
    await connection.end();

    return { success: true, id: result.insertId, imageName };
  } catch (error) {
    if (connection) {
      await connection.rollback(); // Desfaz se houver erro
      await connection.end();
    }
    // Tenta reverter o arquivo de imagem se foi salvo antes do erro do DB
    if (imageName) await deleteProductImage(imageName);

    logSQLError("Add Product (Transaction Failed)", error);
    return { success: false, error: error.message };
  }
});

// ✏️ UPDATE PRODUCT: Atualiza detalhes do produto
ipcMain.handle("update-product", async (event, product) => {
  try {
    const connection = await getConnection();
    // Adicionei mais campos para uma atualização útil
    const query =
      "UPDATE produtos SET nome = ?, quantidade = ?, preco = ?, data_validade = ?, descricao = ?, categoria = ?, fornecedores = ? WHERE id_produto = ?";
    await connection.execute(query, [
      product.nome,
      product.quantidade,
      product.preco,
      product.data_validade || null,
      product.descricao,
      product.categoria,
      product.fornecedorEmpresa,
      product.id_produto,
    ]);
    await connection.end();
    return { success: true };
  } catch (error) {
    logSQLError("Update Product", error);
    return { success: false, error: error.message };
  }
});

// ❌ DELETE PRODUCT: Remove um produto
ipcMain.handle("delete-product", async (event, productId, imageName) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.beginTransaction(); // Inicia transação

    // 1. Remove o registro do banco de dados (as movimentações relacionadas
    //    serão deletadas automaticamente devido ao ON DELETE CASCADE)
    const query = "DELETE FROM produtos WHERE id_produto = ?";
    const [result] = await connection.execute(query, [productId]);

    if (result.affectedRows === 0) {
      throw new Error("Produto não encontrado.");
    }

    // 2. Remove o arquivo de imagem localmente (processo de arquivo, fora do DB)
    await deleteProductImage(imageName);

    await connection.commit(); // Confirma transação
    await connection.end();

    return { success: true };
  } catch (error) {
    if (connection) {
      await connection.rollback(); // Desfaz se houver erro
      await connection.end();
    }
    logSQLError("Delete Product (Transaction Failed)", error);
    return { success: false, error: error.message };
  }
});

// 📈 ADD MOVEMENT: Gerencia entrada e saída de estoque (CRÍTICO: Usa Transação)
ipcMain.handle("add-movement", async (event, movementData) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.beginTransaction();

    // 1. Atualiza a quantidade na tabela PRODUTOS
    const type = movementData.tipo; // 'entrada' ou 'saida'
    const quantity = parseInt(movementData.quantidade);
    const productId = movementData.id_produto;

    // A query usa um operador condicional para aumentar (entrada) ou diminuir (saida)
    const updateQuery = `
        UPDATE produtos
        SET quantidade = quantidade ${type === "entrada" ? "+" : "-"} ?
        WHERE id_produto = ?
    `;
    const [updateResult] = await connection.execute(updateQuery, [
      quantity,
      productId,
    ]);

    if (updateResult.affectedRows === 0) {
      throw new Error("Produto não encontrado para atualização.");
    }

    // 2. Insere o registro na tabela MOVIMENTACOES
    const insertQuery =
      "INSERT INTO movimentacoes (id_usuario, id_produto, tipo, quantidade) VALUES (?, ?, ?, ?)";
    await connection.execute(insertQuery, [
      movementData.id_usuario,
      productId,
      type,
      quantity,
    ]);

    await connection.commit(); // Sucesso: Confirma ambas as operações
    await connection.end();
    return { success: true };
  } catch (error) {
    if (connection) {
      await connection.rollback(); // Falha: Desfaz ambas as operações
      await connection.end();
    }
    // ER_SIGNAL_EXCEPTION pode ocorrer se a quantidade for negativa (trigger ou regra de negócio)
    logSQLError("Add Movement (Transaction Failed)", error);

    let userMessage = "Erro ao registrar movimentação.";
    if (error.message.includes("quantidade")) {
      userMessage = "Estoque insuficiente para a movimentação de saída.";
    }

    return { success: false, error: userMessage };
  }
});

// Adiciona um handler para servir as imagens estáticas
ipcMain.handle("get-image-path", (event, imageName) => {
  if (!imageName) return null;
  // Retorna o caminho absoluto para o Renderer process
  return path.join(app.getPath("userData"), "product_images", imageName);
});

ipcMain.handle("get-dashboard-data", async () => {
  let connection;
  try {
    connection = await getConnection();
    const today = "2025-10-15"; // DATA FIXA PARA TESTE - REMOVA OU ALTERE PARA CURDATE() EM PRODUÇÃO

    // Query 1: Vendidos Hoje (Quantidade)
    const [soldTodayRows] = await connection.execute(
      `SELECT SUM(quantidade) AS total FROM movimentacoes WHERE tipo = 'saida' AND DATE(data_mov) = ?`,
      [today]
    );

    // Query 2: Total de Vendas (Quantidade total de itens vendidos na história)
    const [totalSalesRows] = await connection.execute(
      "SELECT SUM(quantidade) AS total FROM movimentacoes WHERE tipo = 'saida'"
    );

    // Query 3: Faturamento do Dia (Receita, não lucro)
    const [revenueTodayRows] = await connection.execute(
      `SELECT SUM(m.quantidade * p.preco) AS total FROM movimentacoes m JOIN produtos p ON m.id_produto = p.id_produto WHERE m.tipo = 'saida' AND DATE(m.data_mov) = ?`,
      [today]
    );

    // Query 4: Ticket Médio do Dia (Faturamento do Dia / Nº de Saídas no Dia)
    const [salesCountTodayRows] = await connection.execute(
      `SELECT COUNT(*) as count FROM movimentacoes WHERE tipo = 'saida' AND DATE(data_mov) = ?`,
      [today]
    );
    const revenueToday = revenueTodayRows[0].total || 0;
    const salesCountToday = salesCountTodayRows[0].count || 0;
    const averageTicketToday =
      salesCountToday > 0 ? revenueToday / salesCountToday : 0;

    // Query 5: Produto com Maior Faturamento DO DIA (CORRIGIDO)
    const [topProductRows] = await connection.execute(
      `SELECT p.nome FROM movimentacoes m JOIN produtos p ON m.id_produto = p.id_produto WHERE m.tipo = 'saida' AND DATE(m.data_mov) = ? GROUP BY p.id_produto, p.nome ORDER BY SUM(m.quantidade * p.preco) DESC LIMIT 1`,
      [today]
    );

    // Query 6: Vendas por Categoria (para o gráfico de pizza)
    const [salesByCategoryRows] = await connection.execute(
      `SELECT p.categoria, SUM(m.quantidade) AS total_vendido FROM movimentacoes m JOIN produtos p ON m.id_produto = p.id_produto WHERE m.tipo = 'saida' GROUP BY p.categoria ORDER BY total_vendido DESC`
    );

    // Query 7: Produtos Mais Vendidos (para o gráfico de barras)
    const [topSellingProductsRows] = await connection.execute(
      `SELECT p.nome, SUM(m.quantidade) AS total_vendido FROM movimentacoes m JOIN produtos p ON m.id_produto = p.id_produto WHERE m.tipo = 'saida' GROUP BY p.id_produto, p.nome ORDER BY total_vendido DESC LIMIT 5`
    );

    // Query 8: Saídas diárias nos últimos 7 dias (para o gráfico de linha)
    const [stockTurnoverRows] = await connection.execute(
      `SELECT DATE_FORMAT(data_mov, '%d/%m') AS dia, SUM(quantidade) AS total_saidas FROM movimentacoes WHERE tipo = 'saida' AND data_mov >= ? - INTERVAL 7 DAY GROUP BY DATE(data_mov) ORDER BY DATE(data_mov) ASC`,
      [today]
    );

    const dashboardData = {
      soldToday: soldTodayRows[0].total || 0,
      totalSales: totalSalesRows[0].total || 0,
      revenueToday: revenueToday,
      averageTicketToday: averageTicketToday,
      // CORRIGIDO: Agora busca o produto mais lucrativo do dia
      topProduct:
        topProductRows.length > 0
          ? topProductRows[0].nome
          : "Nenhuma venda hoje",
      pendingOrders: "N/A",
      newCustomers: "N/A",
      salesGoal: "N/A",
      salesByCategory: {
        labels: salesByCategoryRows.map((row) => row.categoria),
        data: salesByCategoryRows.map((row) => row.total_vendido),
      },
      topSellingProducts: {
        labels: topSellingProductsRows.map((row) => row.nome).reverse(),
        data: topSellingProductsRows.map((row) => row.total_vendido).reverse(),
      },
      stockTurnover: {
        labels: stockTurnoverRows.map((row) => row.dia),
        data: stockTurnoverRows.map((row) => row.total_saidas),
      },
      salesFunnel: {
        labels: salesByCategoryRows.map((row) => row.categoria),
        data: salesByCategoryRows.map((row) => row.total_vendido),
      },
    };

    await connection.end();
    return { success: true, data: dashboardData };
  } catch (error) {
    if (connection) await connection.end();
    logSQLError("Get Dashboard Data", error);
    return { success: false, error: error.message };
  }
});

// main.js (substitua esta função)

// NOVO HANDLER PARA O DASHBOARD DO MENU
ipcMain.handle("get-menu-dashboard-data", async () => {
  let connection;
  try {
    connection = await getConnection();

    // Query 1: Saldo (Valor total do estoque)
    const [balanceRows] = await connection.execute(
      "SELECT SUM(quantidade * preco) AS total FROM produtos"
    );

    // Query 2: Vendas (Número total de transações de saída)
    const [salesCountRows] = await connection.execute(
      "SELECT COUNT(*) AS total FROM movimentacoes WHERE tipo = 'saida'"
    );

    // Query 3: Crescimento (Variação de itens vendidos entre os últimos 30 dias e os 30 dias anteriores)
    const [salesLast30DaysRows] = await connection.execute(
      "SELECT SUM(quantidade) as total FROM movimentacoes WHERE tipo = 'saida' AND data_mov >= CURDATE() - INTERVAL 30 DAY"
    );
    const [salesPrevious30DaysRows] = await connection.execute(
      "SELECT SUM(quantidade) as total FROM movimentacoes WHERE tipo = 'saida' AND data_mov >= CURDATE() - INTERVAL 60 DAY AND data_mov < CURDATE() - INTERVAL 30 DAY"
    );

    const last30 = salesLast30DaysRows[0].total || 0;
    const previous30 = salesPrevious30DaysRows[0].total || 1; // Evitar divisão por zero
    const growth = ((last30 - previous30) / previous30) * 100;

    // Query 4: Ranking (Média de itens por transação de saída)
    const [avgItemsPerSaleRows] = await connection.execute(
      "SELECT AVG(quantidade) AS media FROM movimentacoes WHERE tipo = 'saida'"
    );

    // Query 5: Dados para Gráficos de Linha e Barra (Saídas nos últimos 8 dias)
    const [dailySalesRows] = await connection.execute(
      `SELECT DATE_FORMAT(data_mov, '%d/%m') AS dia, SUM(quantidade) AS total_saidas 
             FROM movimentacoes 
             WHERE tipo = 'saida' AND data_mov >= CURDATE() - INTERVAL 8 DAY 
             GROUP BY DATE(data_mov) 
             ORDER BY DATE(data_mov) ASC`
    );

    // Query 6: Dados para Gráfico de Funil (Distribuição de produtos em estoque por categoria)
    const [stockByCategoryRows] = await connection.execute(
      `SELECT categoria, SUM(quantidade) as total 
             FROM produtos 
             GROUP BY categoria 
             ORDER BY total DESC`
    );

    const dashboardData = {
      balance: balanceRows[0].total || 0,
      salesCount: salesCountRows[0].total || 0,
      growth: growth.toFixed(0),
      // ✅ CORREÇÃO APLICADA AQUI
      ranking: (parseFloat(avgItemsPerSaleRows[0].media) || 0).toFixed(1),
      dailySales: {
        labels: dailySalesRows.map((r) => r.dia),
        data: dailySalesRows.map((r) => r.total_saidas),
      },
      stockByCategory: {
        labels: stockByCategoryRows.map((r) => r.categoria),
        data: stockByCategoryRows.map((r) => r.total),
      },
    };

    await connection.end();
    return { success: true, data: dashboardData };
  } catch (error) {
    if (connection) await connection.end();
    logSQLError("Get Menu Dashboard Data", error);
    return { success: false, error: error.message };
  }
});

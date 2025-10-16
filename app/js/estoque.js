// view/js/estoque.js

// Permite a comunicação com o main.js
const { ipcRenderer } = require("electron");

document.addEventListener("DOMContentLoaded", () => {
  // --- SELETORES DE ELEMENTOS ---
  const mainContent = document.querySelector(".main-content");
  const searchInput = document.querySelector('input[type="text"]');
  const categoryFilter = document.querySelector(
    ".filter-selects select:nth-of-type(1)"
  );
  const supplierFilter = document.querySelector(
    ".filter-selects select:nth-of-type(2)"
  );
  const statusFilter = document.querySelector(
    ".filter-selects select:nth-of-type(3)"
  );
  const applyFilterBtn = document.querySelector(".btn-principal");
  const clearFilterBtn = document.querySelector(".btn-limpar");
  const insightSpan = document.querySelector(".insight-text span");

  let allProducts = []; // Cache local para evitar buscas repetidas no DB

  // --- FUNÇÕES PRINCIPAIS ---

  /** 🚀 Inicializa a página buscando dados e configurando eventos */
  async function initialize() {
    try {
      const productsResponse = await ipcRenderer.invoke("get-products");
      if (productsResponse.success) {
        allProducts = productsResponse.products;
        populateFilters();
        renderData(allProducts);
      } else {
        showError("Falha ao carregar produtos do banco de dados.");
      }
    } catch (error) {
      console.error("Erro fatal ao inicializar:", error);
      showError("Erro de comunicação com o processo principal.");
    }

    // Configura os eventos dos botões
    applyFilterBtn.addEventListener("click", applyFilters);
    clearFilterBtn.addEventListener("click", clearFilters);
    searchInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") applyFilters();
    });
  }

  /** 📝 Renderiza a tabela de produtos na tela */
  function renderData(products) {
    mainContent.innerHTML = ""; // Limpa a área principal

    if (products.length === 0) {
      mainContent.innerHTML = `<p class="text-muted">Nenhum produto encontrado.</p>`;
      updateInsight([]);
      return;
    }

    const tableHTML = `
      <table class="table table-hover table-striped">
        <thead class="table-dark">
          <tr>
            <th>Produto</th>
            <th>Categoria</th>
            <th>Fornecedor</th>
            <th class="text-center">Qtd.</th>
            <th>Preço Unit.</th>
            <th>Valor Total</th>
            <th class="text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          ${products
            .map(
              (p) => `
            <tr>
              <td>${p.nome}</td>
              <td>${p.categoria}</td>
              <td>${p.nome_fornecedor}</td>
              <td class="text-center">${p.quantidade}</td>
              <td>${formatCurrency(p.preco)}</td>
              <td>${formatCurrency(p.quantidade * p.preco)}</td>
              <td class="text-center">
                <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${
                  p.id_produto
                }" data-image="${p.imagem || ""}" title="Excluir">
                  <i class="bi bi-trash3-fill"></i>
                </button>
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>`;

    mainContent.innerHTML = tableHTML;
    updateInsight(products);

    // Adiciona evento de clique para os novos botões de deletar
    document.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", handleDeleteProduct);
    });
  }

  /** 💡 Atualiza o span de insight com uma informação aleatória sobre os dados */
  function updateInsight(products) {
    if (products.length === 0) {
      insightSpan.innerHTML =
        "<strong>Insight:</strong> Sem dados para analisar.";
      return;
    }
    const insights = [];
    const totalValue = products.reduce(
      (sum, p) => sum + p.quantidade * p.preco,
      0
    );
    insights.push(
      `O valor total dos itens exibidos é <strong>${formatCurrency(
        totalValue
      )}</strong>.`
    );

    const lowStockCount = products.filter(
      (p) => p.quantidade > 0 && p.quantidade < 10
    ).length;
    if (lowStockCount > 0) {
      insights.push(
        `Existem <strong>${lowStockCount}</strong> produto(s) com estoque baixo.`
      );
    }

    const outOfStockCount = products.filter((p) => p.quantidade === 0).length;
    if (outOfStockCount > 0) {
      insights.push(
        `<strong>${outOfStockCount}</strong> produto(s) estão fora de estoque.`
      );
    }

    // Escolhe um insight aleatório para exibir
    insightSpan.innerHTML = `<strong>Insight:</strong> ${
      insights[Math.floor(Math.random() * insights.length)]
    }`;
  }

  // --- LÓGICA DE FILTROS ---

  /** 🚦 Aplica os filtros selecionados e re-renderiza a tabela */
  function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    const supplier = supplierFilter.value;
    const status = statusFilter.value;

    const filteredProducts = allProducts.filter((p) => {
      const searchMatch =
        p.nome.toLowerCase().includes(searchTerm) ||
        p.nome_fornecedor.toLowerCase().includes(searchTerm);
      const categoryMatch = !category || p.categoria === category;
      const supplierMatch = !supplier || p.nome_fornecedor === supplier;

      let statusMatch = true;
      if (status === "1") statusMatch = p.quantidade > 0;
      else if (status === "2")
        statusMatch = p.quantidade > 0 && p.quantidade < 10;
      else if (status === "3") statusMatch = p.quantidade === 0;

      return searchMatch && categoryMatch && supplierMatch && statusMatch;
    });

    renderData(filteredProducts);
  }

  /** 🔄 Limpa todos os filtros e mostra todos os produtos */
  function clearFilters() {
    searchInput.value = "";
    categoryFilter.value = "";
    supplierFilter.value = "";
    statusFilter.selectedIndex = 0; // Reseta para a opção "Status"
    renderData(allProducts);
  }

  /** 📚 Popula os filtros de Categoria e Fornecedor dinamicamente */
  async function populateFilters() {
    // Categorias (baseado nos produtos carregados)
    const categories = [...new Set(allProducts.map((p) => p.categoria))].sort();
    categoryFilter.innerHTML = '<option value="">Categoria</option>';
    categories.forEach(
      (cat) =>
        (categoryFilter.innerHTML += `<option value="${cat}">${cat}</option>`)
    );

    // Fornecedores (buscado do DB)
    const suppliersResponse = await ipcRenderer.invoke("get-suppliers");
    supplierFilter.innerHTML = '<option value="">Fornecedor</option>';
    if (suppliersResponse.success) {
      suppliersResponse.suppliers.forEach(
        (sup) =>
          (supplierFilter.innerHTML += `<option value="${sup.empresa}">${sup.empresa}</option>`)
      );
    }
  }

  // --- MANIPULAÇÃO DE DADOS ---

  /** 🗑️ Lida com o clique para deletar um produto */
  async function handleDeleteProduct(event) {
    const button = event.currentTarget;
    const productId = button.dataset.id;
    const imageName = button.dataset.image;

    if (
      confirm(
        "Tem certeza que deseja excluir este produto? A ação não pode ser desfeita."
      )
    ) {
      const response = await ipcRenderer.invoke(
        "delete-product",
        productId,
        imageName
      );
      if (response.success) {
        // Remove da lista local e atualiza a tela
        allProducts = allProducts.filter((p) => p.id_produto != productId);
        applyFilters(); // Re-aplica filtros para a visualização continuar consistente
      } else {
        alert(`Erro ao excluir produto: ${response.error}`);
      }
    }
  }

  // --- FUNÇÕES UTILITÁRIAS ---

  /** 💰 Formata um número para moeda BRL */
  function formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  /** ⚠️ Exibe uma mensagem de erro na tela */
  function showError(message) {
    mainContent.innerHTML = `<div class="alert alert-danger">${message}</div>`;
  }

  // Inicia a aplicação
  initialize();
});

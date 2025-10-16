// ../js/crud.js
const { ipcRenderer } = require("electron");

document.addEventListener("DOMContentLoaded", function () {
  // --- Estado da Aplicação ---
  let editMode = { type: null, id: null };
  let imagemProdutoBase64 = null;
  let nomeImagemProduto = null;

  // --- Seletores de Elementos ---
  const sidebarLinks = document.querySelectorAll(".sidebar-link");
  const contentSections = document.querySelectorAll(".content-section");
  const sidebarItems = document.querySelectorAll(".sidebar-container ul li");

  // --- Formulários ---
  const formProduto = document.getElementById("form-produtos");
  const formFornecedor = document.getElementById("form-fornecedores");
  const formFuncionario = document.getElementById("form-funcionarios");
  const produtoFornecedorSelect = document.getElementById("produtoFornecedor");

  // --- Upload de Imagem ---
  const produtoFotoInput = document.getElementById("produtoFotoInput");
  const imagePreview = document.getElementById("imagePreview");
  const previewIcon = document.getElementById("previewIcon");

  // --- Listagem ---
  const filtroTipoListagem = document.getElementById("filtroTipoListagem");
  const tabelaCorpo = document.querySelector("#listagem .table tbody");

  // --- Funções de Navegação e Inicialização ---
  function setupSidebarNavigation() {
    sidebarLinks.forEach((link) => {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        const targetId = this.getAttribute("data-target");
        navigateTo(targetId);
      });
    });
  }

  function navigateTo(targetId) {
    contentSections.forEach((section) => section.classList.add("d-none"));
    const targetSection = document.getElementById(targetId);
    if (targetSection) targetSection.classList.remove("d-none");

    sidebarItems.forEach((item) => item.classList.remove("active"));
    document
      .querySelector(`[data-target='${targetId}']`)
      .parentElement.classList.add("active");

    if (targetId === "listagem" && filtroTipoListagem.value) {
      carregarListagem(filtroTipoListagem.value);
    } else if (targetId === "listagem") {
      carregarListagem("produtos"); // Padrão
    }

    resetAllForms();
  }

  // --- Lógica de Formulários ---

  function setupFormListeners() {
    formProduto.addEventListener("submit", handleProductSubmit);
    formFornecedor.addEventListener("submit", handleSupplierSubmit);
    formFuncionario.addEventListener("submit", handleEmployeeSubmit);

    produtoFotoInput.addEventListener("change", handleImagePreview);
  }

  async function handleProductSubmit(event) {
    event.preventDefault();
    const productData = {
      userId: 1, // Placeholder para o ID do usuário logado
      nome: document.getElementById("produtoNome").value,
      preco: document.getElementById("produtoPreco").value,
      categoria: document.getElementById("produtoCategoria").value,
      descricao: document.getElementById("produtoDescricao").value,
      quantidade: document.getElementById("produtoQuantidade").value || 0,
      fornecedorEmpresa: document.getElementById("produtoFornecedor").value,
      data_validade: document.getElementById("produtoValidade").value,
      image: imagemProdutoBase64,
      imageName: nomeImagemProduto,
    };

    const response = await ipcRenderer.invoke("add-product", productData);
    if (response.success) {
      alert("Produto cadastrado com sucesso!");
      resetAllForms();
    } else {
      alert(`Erro: ${response.error}`);
    }
  }

  async function handleSupplierSubmit(event) {
    event.preventDefault();
    const supplierData = {
      empresa: document.getElementById("fornecedorEmpresa").value,
      cnpj: document.getElementById("fornecedorCnpj").value,
      nome_repre: document.getElementById("fornecedorRepre").value,
      telefone: document.getElementById("fornecedorTelefone").value,
      categoria: document.getElementById("fornecedorCategoria").value,
      email: document.getElementById("fornecedorEmail").value,
      condicoesdepag: document.getElementById("fornecedorPagamento").value,
      prazodeentrega:
        document.getElementById("fornecedorPrazo").value + " dias",
    };
    const response = await ipcRenderer.invoke("add-supplier", supplierData);
    if (response.success) {
      alert("Fornecedor cadastrado com sucesso!");
      resetAllForms();
    } else {
      alert(`Erro: ${response.error}`);
    }
  }

  async function handleEmployeeSubmit(event) {
    event.preventDefault();
    const employeeData = {
      id_usuario: 2, // Placeholder
      nome: document.getElementById("funcNome").value,
      cargo: document.getElementById("funcCargo").value,
      salario: document.getElementById("funcSalario").value,
      data_nascimento: "1990-01-01", // Placeholder, adicione um campo no HTML se necessário
      email: document.getElementById("funcEmail").value,
      data_admissao: document.getElementById("funcAdmissao").value,
      cpf: document.getElementById("funcCpf").value,
      telefone: "(00) 00000-0000", // Placeholder
    };
    const response = await ipcRenderer.invoke("add-employee", employeeData);
    if (response.success) {
      alert("Funcionário cadastrado com sucesso!");
      resetAllForms();
    } else {
      alert(`Erro: ${response.error}`);
    }
  }

  function resetAllForms() {
    formProduto.reset();
    formFornecedor.reset();
    formFuncionario.reset();
    // Reseta a pré-visualização da imagem
    imagePreview.src = "";
    imagePreview.classList.add("d-none");
    previewIcon.classList.remove("d-none");
    imagemProdutoBase64 = null;
    nomeImagemProduto = null;
  }

  function handleImagePreview(event) {
    const file = event.target.files[0];
    if (file) {
      nomeImagemProduto = file.name;
      const reader = new FileReader();
      reader.onload = (e) => {
        imagemProdutoBase64 = e.target.result;
        imagePreview.src = e.target.result;
        imagePreview.classList.remove("d-none");
        previewIcon.classList.add("d-none");
      };
      reader.readAsDataURL(file);
    }
  }

  async function popularFornecedoresSelect() {
    const response = await ipcRenderer.invoke("get-suppliers");
    if (response.success) {
      produtoFornecedorSelect.innerHTML =
        "<option selected value=''>Selecione...</option>";
      response.suppliers.forEach((s) => {
        produtoFornecedorSelect.innerHTML += `<option value="${s.empresa}">${s.empresa}</option>`;
      });
    }
  }

  // --- Lógica da Listagem ---
  function setupListingListeners() {
    filtroTipoListagem.addEventListener("change", () =>
      carregarListagem(filtroTipoListagem.value)
    );
    tabelaCorpo.addEventListener("click", handleTableActions);
  }

  async function carregarListagem(tipo) {
    tabelaCorpo.innerHTML =
      '<tr><td colspan="6" class="text-center">Carregando...</td></tr>';
    let response;
    switch (tipo) {
      case "produtos":
        response = await ipcRenderer.invoke("get-products");
        if (response.success) renderListing(response.products, "produtos");
        break;
      case "fornecedores":
        response = await ipcRenderer.invoke("get-suppliers");
        if (response.success) renderListing(response.suppliers, "fornecedores");
        break;
      case "funcionarios":
        response = await ipcRenderer.invoke("get-employees");
        if (response.success) renderListing(response.employees, "funcionarios");
        break;
    }
  }

  function renderListing(data, tipo) {
    let html = "";
    if (!data || data.length === 0) {
      tabelaCorpo.innerHTML =
        '<tr><td colspan="6" class="text-center">Nenhum dado encontrado.</td></tr>';
      return;
    }

    switch (tipo) {
      case "produtos":
        html = data
          .map(
            (p) => `
          <tr>
            <th scope="row">${p.id_produto}</th>
            <td>${p.nome}</td>
            <td>Produto</td>
            <td>${new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(p.preco)}</td>
            <td>${p.quantidade} em estoque</td>
            <td>
              <button class="btn btn-sm btn-danger btn-delete" data-id="${
                p.id_produto
              }" data-tipo="produto" data-image="${
              p.imagem || ""
            }"><i class="bi bi-trash"></i></button>
            </td>
          </tr>`
          )
          .join("");
        break;
      case "fornecedores":
        html = data
          .map(
            (f) => `
          <tr>
            <th scope="row">${f.id_fornecedor}</th>
            <td>${f.empresa}</td>
            <td>Fornecedor</td>
            <td>${f.telefone || "N/A"}</td>
            <td>${f.categoria || "N/A"}</td>
            <td>
              <button class="btn btn-sm btn-danger btn-delete" data-id="${
                f.id_fornecedor
              }" data-tipo="fornecedor"><i class="bi bi-trash"></i></button>
            </td>
          </tr>`
          )
          .join("");
        break;
      case "funcionarios":
        html = data
          .map(
            (e) => `
          <tr>
            <th scope="row">${e.id_funcionarios}</th>
            <td>${e.nome}</td>
            <td>Funcionário</td>
            <td>${e.cargo}</td>
            <td>${new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(e.salario)}</td>
            <td>
              <button class="btn btn-sm btn-danger btn-delete" data-id="${
                e.id_funcionarios
              }" data-tipo="funcionario"><i class="bi bi-trash"></i></button>
            </td>
          </tr>`
          )
          .join("");
        break;
    }
    tabelaCorpo.innerHTML = html;
  }

  async function handleTableActions(event) {
    const button = event.target.closest("button.btn-delete");
    if (!button) return;

    const id = button.dataset.id;
    const tipo = button.dataset.tipo;
    const imageName = button.dataset.image;

    if (confirm(`Tem certeza que deseja excluir o item #${id}?`)) {
      let response;
      switch (tipo) {
        case "produto":
          response = await ipcRenderer.invoke("delete-product", id, imageName);
          break;
        case "fornecedor":
          response = await ipcRenderer.invoke("delete-supplier", id);
          break;
        case "funcionario":
          response = await ipcRenderer.invoke("delete-employee", id);
          break;
      }

      if (response && response.success) {
        alert("Item excluído com sucesso!");
        carregarListagem(filtroTipoListagem.value); // Recarrega
      } else {
        alert(`Erro ao excluir: ${response.error}`);
      }
    }
  }

  // --- INICIALIZAÇÃO GERAL ---
  function init() {
    setupSidebarNavigation();
    setupFormListeners();
    setupListingListeners();
    popularFornecedoresSelect();
    // Força o carregamento da aba de produtos ao iniciar
    navigateTo("produtos");
    filtroTipoListagem.value = "produtos";
  }

  init();
}); // <-- ESTA CHAVE ESTAVA FALTANDO

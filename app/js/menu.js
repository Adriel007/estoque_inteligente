const { ipcRenderer } = require("electron");

// Função auxiliar para formatar valores monetários
const formatCurrency = (value) => {
  return (value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  // 1. REQUISITA OS DADOS DO DASHBOARD AO PROCESSO PRINCIPAL
  const response = await ipcRenderer.invoke("get-menu-dashboard-data");

  if (!response.success) {
    console.error("Falha ao carregar dados do menu:", response.error);
    document.querySelector(
      ".main-content"
    ).innerHTML = `<div class="alert alert-danger">Erro ao carregar dados: ${response.error}</div>`;
    return;
  }

  const data = response.data;

  // 2. PREENCHE OS CARTÕES DE ESTATÍSTICAS
  const statCards = document.querySelectorAll(".stat-card .card-value");
  statCards[0].textContent = formatCurrency(data.balance);
  statCards[1].textContent = data.salesCount;
  statCards[2].textContent = `${data.growth}%`;
  statCards[3].textContent = data.ranking;

  // 3. INICIALIZA OS GRÁFICOS COM DADOS DINÂMICOS

  // --- Gráfico de Linha (Saídas Diárias) ---
  const lineCtx = document.getElementById("lineChart").getContext("2d");
  new Chart(lineCtx, {
    type: "line",
    data: {
      labels: data.dailySales.labels,
      datasets: [
        {
          label: "Vendas por Dia",
          data: data.dailySales.data,
          borderColor: "#4e73df",
          tension: 0.4,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "top", align: "end" } },
      scales: { y: { beginAtZero: true } },
    },
  });

  // --- Gráfico de Barras (Saídas Diárias) ---
  const barCtx = document.getElementById("barChart").getContext("2d");
  new Chart(barCtx, {
    type: "bar",
    data: {
      labels: data.dailySales.labels,
      datasets: [
        {
          label: "Vendas por Dia",
          data: data.dailySales.data,
          backgroundColor: "#1cc88a",
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "top", align: "end" } },
      scales: { y: { beginAtZero: true } },
    },
  });

  // --- Gráfico de Funil (Estoque por Categoria) ---
  const funnelCtx = document.getElementById("funnelChart").getContext("2d");
  new Chart(funnelCtx, {
    type: "funnel",
    data: {
      labels: data.stockByCategory.labels,
      datasets: [
        {
          data: data.stockByCategory.data,
          backgroundColor: [
            "#4e73df",
            "#1cc88a",
            "#36b9cc",
            "#f6c23e",
            "#e74a3b",
            "#858796",
          ],
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "right" } },
    },
  });
});

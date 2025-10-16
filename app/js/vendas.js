// vendas.js

const { ipcRenderer } = require("electron");

const formatCurrency = (value) => {
  if (typeof value !== "number") {
    return "R$ 0,00";
  }
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  const response = await ipcRenderer.invoke("get-dashboard-data");

  if (!response.success) {
    console.error("Falha ao carregar os dados do dashboard:", response.error);
    const container = document.querySelector(".container-fluid");
    container.innerHTML = `<div class="alert alert-danger">Erro ao carregar os dados do dashboard: ${response.error}</div>`;
    return;
  }

  const data = response.data;

  // Preenche os cartões
  const statCards = document.querySelectorAll(".stat-card");
  statCards[0].querySelector(".card-value").textContent = data.soldToday || 0;
  statCards[1].querySelector(".card-value").textContent = data.totalSales || 0;
  statCards[2].querySelector(".card-value").textContent = formatCurrency(
    data.revenueToday
  );
  statCards[3].querySelector(".card-value-small").textContent = formatCurrency(
    data.averageTicketToday
  );
  statCards[4].querySelector(".card-value-small").textContent =
    data.pendingOrders;
  statCards[5].querySelector(".card-value-small").textContent = data.topProduct;
  statCards[6].querySelector(".card-value-small").textContent =
    data.newCustomers;
  statCards[7].querySelector(".card-value-small").textContent = data.salesGoal;

  const chartColors = [
    "#4e73df",
    "#1cc88a",
    "#36b9cc",
    "#f6c23e",
    "#e74a3b",
    "#858796",
    "#f8f9fc",
    "#5a5c69",
  ];

  // GRÁFICO DE PIZZA
  const pieCtx = document.getElementById("pieChart").getContext("2d");
  new Chart(pieCtx, {
    type: "pie",
    data: {
      labels: data.salesByCategory.labels,
      datasets: [
        { data: data.salesByCategory.data, backgroundColor: chartColors },
      ],
    },
    options: {
      responsive: true,
      // maintainAspectRatio: false, // REMOVIDO
      plugins: { legend: { position: "right" } },
    },
  });

  // GRÁFICO DE BARRAS
  const barCtx = document.getElementById("barChart").getContext("2d");
  new Chart(barCtx, {
    type: "bar",
    data: {
      labels: data.topSellingProducts.labels,
      datasets: [
        {
          label: "Quantidade Vendida",
          data: data.topSellingProducts.data,
          backgroundColor: "#4e73df",
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      // maintainAspectRatio: false, // REMOVIDO
      plugins: { legend: { display: false } },
      scales: { x: { beginAtZero: true } },
    },
  });

  // GRÁFICO DE LINHA
  const lineCtx = document.getElementById("lineChart").getContext("2d");
  new Chart(lineCtx, {
    type: "line",
    data: {
      labels: data.stockTurnover.labels,
      datasets: [
        {
          label: "Itens Vendidos",
          data: data.stockTurnover.data,
          borderColor: "#4e73df",
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      // maintainAspectRatio: false, // REMOVIDO
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } },
    },
  });

  // GRÁFICO DE FUNIL
  const funnelCtx = document.getElementById("funnelChart").getContext("2d");
  new Chart(funnelCtx, {
    type: "funnel",
    data: {
      labels: data.salesFunnel.labels,
      datasets: [{ data: data.salesFunnel.data, backgroundColor: chartColors }],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      // maintainAspectRatio: false, // REMOVIDO
      plugins: { legend: { position: "right" } },
    },
  });
});

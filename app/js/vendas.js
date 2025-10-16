document.addEventListener("DOMContentLoaded", function () {
  // ========== 1. GRÁFICO DE PIZZA (Vendas por Categoria) ==========
  const pieCtx = document.getElementById("pieChart").getContext("2d");
  const pieChart = new Chart(pieCtx, {
    type: "pie",
    data: {
      labels: ["2", "3", "4", "5", "6", "7"],
      datasets: [
        {
          data: [15, 25, 20, 10, 10, 20],
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
      responsive: true,
      plugins: {
        legend: {
          position: "right",
        },
      },
    },
  });

  // ========== 2. GRÁFICO DE BARRAS (Produtos Mais Vendidos) ==========
  const barCtx = document.getElementById("barChart").getContext("2d");
  const barChart = new Chart(barCtx, {
    type: "bar",
    data: {
      labels: ["2", "3", "4", "5", "6", "7"],
      datasets: [
        {
          label: "Series1",
          data: [40, 65, 75, 50, 45, 70],
          backgroundColor: "#4e73df",
        },
      ],
    },
    options: {
      indexAxis: "y", // Deixa as barras na horizontal
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          beginAtZero: true,
        },
      },
    },
  });

  // ========== 3. GRÁFICO DE LINHA (Giro de Estoque) ==========
  const lineCtx = document.getElementById("lineChart").getContext("2d");
  const lineChart = new Chart(lineCtx, {
    type: "line",
    data: {
      labels: ["1", "3", "5", "7", "2", "4", "6", "8"],
      datasets: [
        {
          label: "Series1",
          data: [80, 60, 45, 50, 20, 40, 70, 90],
          borderColor: "#4e73df",
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  // ========== 4. GRÁFICO DE FUNIL (Vendas do Mês) ==========
  const funnelCtx = document.getElementById("funnelChart").getContext("2d");
  const funnelChart = new Chart(funnelCtx, {
    type: "funnel",
    data: {
      labels: ["7", "6", "5", "4", "3", "2"],
      datasets: [
        {
          data: [15, 20, 25, 30, 40, 50],
          backgroundColor: [
            "#e74a3b",
            "#f6c23e",
            "#36b9cc",
            "#1cc88a",
            "#4e73df",
            "#858796",
          ],
        },
      ],
    },
    options: {
      indexAxis: "y", // Deixa o funil na vertical (pirâmide)
      responsive: true,
      plugins: {
        legend: {
          position: "right",
        },
      },
    },
  });
});

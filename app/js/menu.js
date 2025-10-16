// Aguarda o conteúdo da página carregar para executar o script
document.addEventListener("DOMContentLoaded", function () {
  // --- Gráfico de Linha ---
  const lineCtx = document.getElementById("lineChart").getContext("2d");
  const lineChart = new Chart(lineCtx, {
    type: "line",
    data: {
      labels: ["1", "2", "3", "4", "5", "6", "7", "8"],
      datasets: [
        {
          label: "Series 1",
          data: [65, 80, 81, 75, 22, 85, 40, 60],
          borderColor: "#36A2EB",
          tension: 0.4, // Suaviza a linha
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
          align: "end",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
        },
      },
    },
  });

  // --- Gráfico de Barras ---
  const barCtx = document.getElementById("barChart").getContext("2d");
  const barChart = new Chart(barCtx, {
    type: "bar",
    data: {
      labels: ["1", "2", "3", "4", "5", "6", "7", "8"],
      datasets: [
        {
          label: "Series 1",
          data: [73, 82, 71, 20, 80, 40, 0],
          backgroundColor: "#36A2EB",
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
          align: "end",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
        },
      },
    },
  });

  // --- Gráfico de Funil ---
  const funnelCtx = document.getElementById("funnelChart").getContext("2d");
  const funnelChart = new Chart(funnelCtx, {
    type: "funnel", // Tipo de gráfico do plugin
    data: {
      labels: ["2", "3", "4", "5", "6", "7"],
      datasets: [
        {
          data: [90, 70, 50, 20, 10, 5],
          backgroundColor: [
            "#36A2EB",
            "#FFC107",
            "#DC3545",
            "#6c757d",
            "#20c997",
            "#191c38",
          ],
          hoverBackgroundColor: [
            "#36A2EB",
            "#FFC107",
            "#DC3545",
            "#6c757d",
            "#20c997",
            "#191c38",
          ],
        },
      ],
    },
    options: {
      // ADICIONE ESTA LINHA PARA DEIXAR O GRÁFICO NA VERTICAL
      indexAxis: "y",

      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
        },
      },
    },
  });
});

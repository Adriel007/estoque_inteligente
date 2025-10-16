document.addEventListener("DOMContentLoaded", function () {
  const sidebarLinks = document.querySelectorAll(".sidebar-link");
  const contentSections = document.querySelectorAll(".content-section");
  const sidebarItems = document.querySelectorAll(".sidebar-container ul li");

  sidebarLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      const targetId = this.getAttribute("data-target");

      // Oculta todas as seções
      contentSections.forEach((section) => {
        section.classList.add("d-none");
      });

      // Mostra a seção alvo
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.remove("d-none");
      }

      // Atualiza a classe 'active' no menu
      sidebarItems.forEach((item) => {
        item.classList.remove("active");
      });
      this.parentElement.classList.add("active");
    });
  });
});

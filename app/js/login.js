const { ipcRenderer } = require("electron");
document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("senha").value;
  const result = await ipcRenderer.invoke("login", { email, password });

  if (result.success) {
    window.location.href = "menu.html";
  } else {
    alert("Login failed. Please check your credentials.");
  }
});

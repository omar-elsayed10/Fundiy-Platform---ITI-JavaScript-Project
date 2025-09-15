document.querySelector(".menu").addEventListener("click", () => {
  document.querySelector(".nav-list").classList.toggle("active");
});

document.querySelector(".signup").addEventListener("click", () => {
  window.location.href = "register.html";
});

document.querySelector(".login").addEventListener("click", () => {
  window.location.href = "login.html";
});

document.querySelector(".get-started").addEventListener("click", () => {
  window.location.href = "register.html";
});

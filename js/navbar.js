const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const mobileActions = document.getElementById("mobileActions");

menuToggle.addEventListener("click", () => {
  mobileMenu.classList.toggle("active");
  mobileActions.classList.toggle("active");
});
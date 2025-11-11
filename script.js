const themeSwitch = document.querySelector(".theme-toggle");
const body = document.querySelector("body");

themeSwitch.addEventListener("click", () => {
  body.classList.toggle("dark-theme");
});

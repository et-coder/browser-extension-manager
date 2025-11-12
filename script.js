const themeSwitch = document.querySelector(".theme-toggle");
const body = document.querySelector("body");
const cards = document.querySelector(".cards");
const theme = localStorage.getItem("theme"); // Get current theme from local storage
// Set dark theme if present
if (theme == "dark") body.classList.add("dark-theme");

themeSwitch.addEventListener("click", () => {
  body.classList.toggle("dark-theme");
  body.classList.contains("dark-theme")
    ? localStorage.setItem("theme", "dark")
    : localStorage.setItem("theme", "light");
});

const getData = async () => {
  const res = await fetch("./data.json");
  const data = await res.json();
  return data;
};

const updateExtensions = async (data) => {
  const extensions = await Promise.resolve(data);
  extensions.forEach((extension) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
          <div class="top">
              <img src=${extension.logo} alt=${extension.name} />
              <div class="details">
                  <p class="name">${extension.name}</p>
                  <p class="description">
                  ${extension.description}
                  </p>
              </div>
          </div>
          <div class="bottom">
              <button class="remove">Remove</button>
              <div class="toggle">
                  <label for="toggle-${extension.name}">
                  <input type="checkbox" id="toggle-${extension.name}" ${extension.isActive ? "checked" : null}/>
                      <span class="slider"></span>
                  </label>
              </div>
          </div>
      `;
    cards.appendChild(card);
  });
};

updateExtensions(getData());

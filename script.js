const themeSwitch = document.querySelector(".theme-toggle");
const body = document.querySelector("body");
const cards = document.querySelector(".cards");
const theme = localStorage.getItem("theme"); // Get current theme from local storage

const buttons = document.querySelector(".buttons");
const allBtn = document.querySelector(".all");
const activeBtn = document.querySelector(".active");
const inactiveBtn = document.querySelector(".inactive");

// Set dark theme if present
if (theme == "dark") body.classList.add("dark-theme");

themeSwitch.addEventListener("click", () => {
  body.classList.toggle("dark-theme");
  body.classList.contains("dark-theme")
    ? localStorage.setItem("theme", "dark")
    : localStorage.setItem("theme", "light");
});

let extensions;

const getData = async () => {
  const res = await fetch("./data.json");
  return res.json();
};

const eventListeners = () => {
  const removeBtn = document.querySelectorAll(".remove");
  removeBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const card = e.target.parentElement.parentElement;
      const name = card.querySelector(".name").textContent;
      card.remove();
      extensions = extensions.filter((extension) => extension.name !== name);
      localStorage.setItem("extensions", JSON.stringify(extensions));
    });
  });
};

const updateExtensions = async (data) => {
  const extensions = await data;
  cards.innerHTML = "";
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
  eventListeners();
};

const init = async () => {
  localStorage.getItem("extensions") == null
    ? localStorage.setItem("extensions", JSON.stringify(await getData()))
    : null;
  extensions = JSON.parse(localStorage.getItem("extensions"));

  updateExtensions(extensions);
};

init();

const filterExtensions = async (value) => {
  const filteredData = extensions.filter(
    (extension) => extension.isActive == value,
  );
  updateExtensions(filteredData);
};

// Filter Extensions
allBtn.addEventListener("click", () => {
  updateExtensions(extensions);
  allBtn.classList.add("selected");
  activeBtn.classList.remove("selected");
  inactiveBtn.classList.remove("selected");
});
activeBtn.addEventListener("click", () => {
  filterExtensions(true);
  activeBtn.classList.add("selected");
  allBtn.classList.remove("selected");
  inactiveBtn.classList.remove("selected");
});
inactiveBtn.addEventListener("click", () => {
  filterExtensions(false);
  inactiveBtn.classList.add("selected");
  activeBtn.classList.remove("selected");
  allBtn.classList.remove("selected");
});

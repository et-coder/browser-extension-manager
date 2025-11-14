const themeSwitch = document.querySelector(".theme-toggle");
const body = document.querySelector("body");
const cards = document.querySelector(".cards");
const theme = localStorage.getItem("theme"); // Get current theme from local storage

const buttons = document.querySelectorAll(".buttons button");
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
  // Filter Extensions
  allBtn.addEventListener("click", () => {
    updateExtensions(extensions);
    buttons.forEach((button) => button.classList.remove("selected")); // Remove styling from unselected buttons
    allBtn.classList.add("selected");
  });
  activeBtn.addEventListener("click", () => {
    filterExtensions(true);
    buttons.forEach((button) => button.classList.remove("selected"));
    activeBtn.classList.add("selected");
  });
  inactiveBtn.addEventListener("click", () => {
    filterExtensions(false);
    buttons.forEach((button) => button.classList.remove("selected"));
    inactiveBtn.classList.add("selected");
  });

  // Remove Extension
  const removeBtn = document.querySelectorAll(".remove");
  removeBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const card = e.target.parentElement.parentElement;
      const name = card.querySelector(".name").textContent;
      card.remove();
      extensions = extensions.filter((extension) => extension.name !== name); // Remove extension from the array
      localStorage.setItem("extensions", JSON.stringify(extensions)); // Remove extension from local storage;
    });
  });

  const toggles = document.querySelectorAll(".toggle input");
  toggles.forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      const name = e.target.id;
      extensions.forEach((extension) => {
        if (extension.name == name) {
          extension.isActive = extension.isActive ? false : true; // Reverse the value
        }
      });
      localStorage.setItem("extensions", JSON.stringify(extensions)); // Update the local storage
      if (activeBtn.classList.contains("selected")) {
        if (!e.target.checked) filterExtensions(true); // Filter extensions when toggle is clicked on active tab
      } else if (inactiveBtn.classList.contains("selected")) {
        if (e.target.checked) filterExtensions(false); // Filter extensions when toggle is clicked on inactive tab
      }
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
                  <label for="${extension.name}">
                  <input type="checkbox" id="${extension.name}" ${extension.isActive ? "checked" : ""}/>
                      <span class="slider"></span>
                  </label>
              </div>
          </div>
      `;
    cards.appendChild(card);
  });
  eventListeners();
};

const filterExtensions = async (value) => {
  const filteredData = extensions.filter(
    (extension) => extension.isActive == value,
  );
  updateExtensions(filteredData);
};

// Initialize the page;
const init = async () => {
  if (localStorage.getItem("extensions") == null)
    localStorage.setItem("extensions", JSON.stringify(await getData()));
  extensions = JSON.parse(localStorage.getItem("extensions"));

  updateExtensions(extensions);
};

init();

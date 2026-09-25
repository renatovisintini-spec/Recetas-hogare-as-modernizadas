const state = {
  recipes: [],
  query: "",
  category: "Todas"
};

const grid = document.querySelector("#recipe-grid");
const filters = document.querySelector("#category-filters");
const count = document.querySelector("#result-count");
const empty = document.querySelector("#empty-state");
const search = document.querySelector("#search-input");
const dialog = document.querySelector("#recipe-dialog");

const categoryImages = {
  "Sopas": "assets/images/sopas.jpg",
  "Ensaladas": "assets/images/ensaladas.jpg",
  "Entradas": "assets/images/entradas.jpg",
  "Salsas y aderezos": "assets/images/salsas.jpg",
  "Platos principales": "assets/images/plato-caliente.jpg",
  "Postres y dulces": "assets/images/postre.jpg",
  "Otras recetas": "assets/images/verduras.jpg"
};

const normalizeText = (value) => value
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase();

const excerpt = (content) => {
  const text = content.replace(/\n/g, " ");
  return text.length > 150 ? `${text.slice(0, 147)}…` : text;
};

function filteredRecipes() {
  const query = normalizeText(state.query.trim());
  return state.recipes.filter((recipe) => {
    const categoryMatch = state.category === "Todas" || recipe.category === state.category;
    const textMatch = !query || normalizeText(`${recipe.title} ${recipe.content}`).includes(query);
    return categoryMatch && textMatch;
  });
}

function renderRecipes() {
  const visible = filteredRecipes();
  count.textContent = `${visible.length} ${visible.length === 1 ? "receta" : "recetas"}`;
  empty.hidden = visible.length !== 0;
  grid.hidden = visible.length === 0;
  grid.replaceChildren(...visible.map((recipe) => {
    const article = document.createElement("article");
    article.className = "recipe-card";
    article.innerHTML = `
      <img class="recipe-card-image" src="${categoryImages[recipe.category]}" alt="" loading="lazy">
      <div>
        <p class="eyebrow">${recipe.category}</p>
        <h3>${recipe.title}</h3>
        <p>${excerpt(recipe.content)}</p>
      </div>
      <button class="secondary-button" type="button">Ver receta</button>
    `;
    article.querySelector("button").addEventListener("click", () => openRecipe(recipe));
    return article;
  }));
}

function renderFilters() {
  const categories = ["Todas", ...new Set(state.recipes.map((recipe) => recipe.category))];
  filters.replaceChildren(...categories.map((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "filter-button";
    button.textContent = category;
    button.setAttribute("aria-pressed", String(category === state.category));
    button.addEventListener("click", () => {
      state.category = category;
      renderFilters();
      renderRecipes();
    });
    return button;
  }));
}

function openRecipe(recipe) {
  document.querySelector("#dialog-category").textContent = recipe.category;
  document.querySelector("#dialog-title").textContent = recipe.title;
  document.querySelector("#dialog-content").textContent = recipe.content;
  dialog.showModal();
  document.body.classList.add("dialog-open");
}

function closeRecipe() {
  dialog.close();
  document.body.classList.remove("dialog-open");
}

async function loadRecipes() {
  try {
    const response = await fetch("data/recipes.json");
    if (!response.ok) throw new Error("No se pudo cargar el recetario");
    const data = await response.json();
    state.recipes = data.recipes;
    renderFilters();
    renderRecipes();
  } catch {
    count.textContent = "No se pudo cargar el recetario";
    empty.hidden = false;
    empty.querySelector("h3").textContent = "El recetario no está disponible";
    empty.querySelector("p").textContent = "Vuelve a intentarlo después de recargar la página.";
  }
}

search.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderRecipes();
});

document.querySelector("#clear-filters").addEventListener("click", () => {
  state.query = "";
  state.category = "Todas";
  search.value = "";
  renderFilters();
  renderRecipes();
  search.focus();
});

document.querySelector("#dialog-close").addEventListener("click", closeRecipe);
document.querySelector("#dialog-close-bottom").addEventListener("click", closeRecipe);
document.querySelector("#print-recipe").addEventListener("click", () => window.print());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) closeRecipe();
});

const menuButton = document.querySelector("#menu-button");
const nav = document.querySelector("#site-nav");
menuButton.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(open));
});
nav.addEventListener("click", () => {
  nav.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
});

const form = document.querySelector("#contact-form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const fields = [...form.querySelectorAll("input, textarea")];
  let valid = true;
  fields.forEach((field) => {
    const error = form.querySelector(`[data-error-for="${field.id}"]`);
    error.textContent = "";
    field.removeAttribute("aria-invalid");
    if (!field.validity.valid) {
      valid = false;
      error.textContent = field.validity.typeMismatch ? "Introduce un correo válido." : "Este campo es obligatorio.";
      field.setAttribute("aria-invalid", "true");
    }
  });
  if (!valid) {
    form.querySelector("[aria-invalid='true']")?.focus();
    return;
  }
  const values = new FormData(form);
  const subject = encodeURIComponent(values.get("subject"));
  const body = encodeURIComponent(`Nombre: ${values.get("name")}\nCorreo: ${values.get("email")}\n\n${values.get("message")}`);
  document.querySelector("#form-status").textContent = "El mensaje está listo para abrirse en tu aplicación de correo.";
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
});

loadRecipes();

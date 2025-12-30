// Configuration de base pour l'API personnalisée USH (proxy PHP avec clés WooCommerce côté serveur)
// Cette API doit être créée dans WordPress (voir code PHP fourni)

const API_BASE = "https://shopushindi.com/wp-json/wc/store/v1/products";

const state = {
  page: 1,
  perPage: 12,
  search: "",
  orderBy: "default",
  totalPages: 1,
};

// Sélecteurs
const productsGrid = document.getElementById("products-grid");
const loaderEl = document.getElementById("loader");
const errorEl = document.getElementById("error");
const prevBtn = document.getElementById("prev-page");
const nextBtn = document.getElementById("next-page");
const pageInfoEl = document.getElementById("page-info");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const orderSelect = document.getElementById("order-select");
const perPageSelect = document.getElementById("per-page-select");

function showLoader(show) {
  loaderEl.classList.toggle("hidden", !show);
}

function showError(message) {
  if (!message) {
    errorEl.classList.add("hidden");
    errorEl.textContent = "";
    return;
  }
  errorEl.classList.remove("hidden");
  errorEl.textContent = message;
}

function buildProductsUrl() {
  const url = new URL(`${API_BASE}/products`);

  url.searchParams.set("page", state.page.toString());
  url.searchParams.set("per_page", state.perPage.toString());

  if (state.search.trim()) {
    url.searchParams.set("search", state.search.trim());
  }

  // Tri – WooCommerce Store API supporte certains ordres
  switch (state.orderBy) {
    case "price_asc":
      url.searchParams.set("orderby", "price");
      url.searchParams.set("order", "asc");
      break;
    case "price_desc":
      url.searchParams.set("orderby", "price");
      url.searchParams.set("order", "desc");
      break;
    case "date_desc":
      url.searchParams.set("orderby", "date");
      url.searchParams.set("order", "desc");
      break;
    default:
      // tri par défaut du site
      break;
  }

  return url.toString();
}

async function fetchProducts() {
  showError("");
  showLoader(true);
  productsGrid.innerHTML = "";

  try {
    const url = buildProductsUrl();
    console.log('Appel API:', url);
    
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });
    
    console.log('Réponse API:', res.status, res.statusText);

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Erreur API:', res.status, errorText);
      throw new Error(
        `Erreur API (${res.status}) – vérifiez que l'API WooCommerce Store est activée sur le site WordPress.`
      );
    }

    // Les produits sont dans le corps, et la pagination dans les en-têtes.
    const data = await res.json();
    
    // L'API Store peut retourner un tableau directement ou un objet
    const products = Array.isArray(data) ? data : (data.items || data.products || []);
    
    // Récupération de la pagination depuis les en-têtes
    const totalPagesHeader =
      res.headers.get("X-WP-TotalPages") ||
      res.headers.get("x-wp-totalpages") ||
      "1";
    const totalPages = parseInt(totalPagesHeader, 10);
    state.totalPages = Number.isFinite(totalPages) && totalPages > 0 ? totalPages : 1;

    console.log(`Produits chargés: ${products.length}, Page: ${state.page}/${state.totalPages}`);
    
    renderProducts(products);
    updatePaginationControls(products.length);
  } catch (err) {
    console.error(err);
    showError(
      "Impossible de charger les produits depuis l'API. " +
        "Vérifiez que le site WordPress (« shopushindi.com ») expose l'API WooCommerce Store " +
        "et que les requêtes externes (CORS) sont autorisées. " +
        "Erreur détaillée dans la console (F12)."
    );
  } finally {
    showLoader(false);
  }
}

function renderProducts(products) {
  if (!products || products.length === 0) {
    productsGrid.innerHTML =
      '<p>Aucun produit trouvé pour ces critères.</p>';
    return;
  }

  const fragment = document.createDocumentFragment();

  products.forEach((product) => {
    const article = document.createElement("article");
    article.className = "product-card";

    const isOnSale = product.on_sale;

    // Image
    const imageWrapper = document.createElement("div");
    imageWrapper.className = "product-image-wrapper";
    const img = document.createElement("img");
    img.className = "product-image";
    const firstImage = product.images && product.images[0];
    img.src =
      (firstImage && firstImage.thumbnail) ||
      (firstImage && firstImage.src) ||
      "https://via.placeholder.com/400x300?text=USH+Produit";
    img.alt = product.name || "Produit";
    imageWrapper.appendChild(img);

    // Catégorie principale (première)
    let categoryName = "";
    if (product.categories && product.categories.length > 0) {
      categoryName = product.categories[0].name;
    }

    const categoryEl = document.createElement("div");
    categoryEl.className = "product-category";
    categoryEl.textContent = categoryName || "Produit";

    // Titre
    const titleEl = document.createElement("h2");
    titleEl.className = "product-title";
    titleEl.textContent = product.name;

    // Prix
    const priceRow = document.createElement("div");
    priceRow.className = "product-price-row";

    const priceEl = document.createElement("div");
    priceEl.className = "product-price";
    priceEl.innerHTML = product.price_html || product.prices?.price || "";

    priceRow.appendChild(priceEl);

    if (isOnSale && product.price_html) {
      // WooCommerce inclus déjà l'ancien prix dans price_html,
      // mais pour un design plus propre, on peut afficher seulement les valeurs.
      if (
        product.prices &&
        product.prices.regular_price &&
        product.prices.price &&
        product.prices.regular_price !== product.prices.price
      ) {
        const regularEl = document.createElement("div");
        regularEl.className = "product-price-regular";
        regularEl.textContent = `${product.prices.regular_price} ${product.prices.currency_symbol || "$"}`;
        priceRow.appendChild(regularEl);
      }
    }

    // Badge promo
    if (isOnSale) {
      const badge = document.createElement("span");
      badge.className = "badge-sale";
      badge.textContent = "- Promo";
      article.appendChild(badge);
    }

    // Pied de carte : note + bouton
    const footer = document.createElement("div");
    footer.className = "product-footer";

    const ratingEl = document.createElement("div");
    ratingEl.className = "product-rating";
    const rating = product.average_rating
      ? parseFloat(product.average_rating)
      : 0;
    if (rating > 0) {
      ratingEl.textContent = "★".repeat(Math.round(rating));
    } else {
      ratingEl.textContent = "Nouveau";
      ratingEl.style.color = "#6b7280";
    }

    const button = document.createElement("button");
    button.className = "product-button";
    button.type = "button";
    button.textContent = "Voir sur USH";
    button.addEventListener("click", () => {
      if (product.permalink) {
        window.open(product.permalink, "_blank");
      }
    });

    footer.appendChild(ratingEl);
    footer.appendChild(button);

    article.appendChild(imageWrapper);
    article.appendChild(categoryEl);
    article.appendChild(titleEl);
    article.appendChild(priceRow);
    article.appendChild(footer);

    fragment.appendChild(article);
  });

  productsGrid.appendChild(fragment);
}

function updatePaginationControls(currentCount) {
  pageInfoEl.textContent = `Page ${state.page} / ${state.totalPages}`;
  prevBtn.disabled = state.page <= 1;
  nextBtn.disabled =
    state.page >= state.totalPages || currentCount < state.perPage;
}

// Gestion des événements
prevBtn.addEventListener("click", () => {
  if (state.page > 1) {
    state.page -= 1;
    fetchProducts();
  }
});

nextBtn.addEventListener("click", () => {
  if (state.page < state.totalPages) {
    state.page += 1;
    fetchProducts();
  }
});

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  state.search = searchInput.value;
  state.page = 1;
  fetchProducts();
});

orderSelect.addEventListener("change", () => {
  state.orderBy = orderSelect.value;
  state.page = 1;
  fetchProducts();
});

perPageSelect.addEventListener("change", () => {
  state.perPage = parseInt(perPageSelect.value, 10) || 12;
  state.page = 1;
  fetchProducts();
});

// Chargement initial
document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
});



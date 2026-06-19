// Use local proxy in development, direct URL in production
const API_BASE = import.meta.env.DEV ? "/api" : "https://shopushindi.com/wp-json/wc/store/v1";

export const fetchProducts = async (params = {}) => {
  const url = new URL(`${window.location.origin}${API_BASE}/products`);
  
  Object.keys(params).forEach(key => {
    if (params[key]) url.searchParams.append(key, params[key]);
  });

  const response = await fetch(url.toString(), {
    headers: {
      'Accept': 'application/json'
    }
  });
  
  if (!response.ok) throw new Error("Impossible de récupérer les produits");
  
  const data = await response.json();
  const totalPages = response.headers.get("X-WP-TotalPages") || response.headers.get("x-wp-totalpages");
  
  return {
    products: data,
    totalPages: parseInt(totalPages, 10) || 1
  };
};

export const fetchProductById = async (id) => {
  const response = await fetch(`${API_BASE}/products/${id}`, {
    headers: {
      'Accept': 'application/json'
    }
  });
  if (!response.ok) throw new Error("Impossible de récupérer le produit");
  return await response.json();
};

export const fetchCategories = async () => {
  const response = await fetch(`${API_BASE}/products/categories`, {
    headers: {
      'Accept': 'application/json'
    }
  });
  if (!response.ok) throw new Error("Impossible de récupérer les catégories");
  return await response.json();
};

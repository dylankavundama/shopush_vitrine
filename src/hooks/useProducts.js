import { useState, useEffect, useCallback } from 'react';
import { fetchProducts } from '../services/api';

export const useProducts = (initialParams = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({
    per_page: 24,
    page: 1,
    ...initialParams
  });
  const [totalPages, setTotalPages] = useState(1);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { products: data, totalPages: pages } = await fetchProducts(params);
      setProducts(data);
      setTotalPages(pages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const updateParams = (newParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  return { products, loading, error, params, totalPages, updateParams, refresh: loadProducts };
};

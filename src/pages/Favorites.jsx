import React, { useEffect, useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { useLanguage } from '../context/LanguageContext';
import { fetchProductById } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import { Heart } from 'lucide-react';
import './Favorites.css';

const Favorites = () => {
  const { favorites } = useFavorites();
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadFavorites = async () => {
      if (favorites.length === 0) {
        setProducts([]);
        return;
      }
      
      setLoading(true);
      try {
        const promises = favorites.map(id => fetchProductById(id));
        const data = await Promise.all(promises);
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadFavorites();
  }, [favorites]);

  return (
    <div className="favorites-page container">
      <div className="section-header-simple">
        <h1>{t('nav.favorites')}</h1>
        <p>Vos produits coups de cœur enregistrés</p>
      </div>

      {loading ? (
        <div className="loader-container"><div className="loader-spinner"></div></div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <Heart size={64} color="#e5e7eb" />
          <p>Vous n'avez pas encore de favoris.</p>
        </div>
      ) : (
        <div className="products-grid-mobile">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;

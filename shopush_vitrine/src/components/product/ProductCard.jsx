import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Flame } from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';
import { useLanguage } from '../../context/LanguageContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { t } = useLanguage();

  const isFav = isFavorite(product.id);

  const regularPrice = product.prices?.regular_price ? parseInt(product.prices.regular_price) / 100 : 0;
  const salePrice = product.prices?.price ? parseInt(product.prices.price) / 100 : 0;
  const onSale = regularPrice > salePrice && salePrice > 0;
  const discount = onSale ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) : 0;

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <Link to={`/product/${product.id}`} className="product-image-link">
          <img 
            src={product.images?.[0]?.src || 'https://via.placeholder.com/400x300?text=USH+Produit'} 
            alt={product.name} 
            className="product-image"
          />
        </Link>
        
        <button 
          className={`favorite-btn ${isFav ? 'active' : ''}`} 
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(product.id);
          }}
          aria-label={isFav ? t('remove.from.favorites') : t('add.to.favorites')}
        >
          <Heart size={18} fill={isFav ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="product-info">
        <div className="product-badges">
          <span className="badge-new">Dernières nouvelles de 2026</span>
        </div>
        
        <div className="product-meta">
          <span className="view-count">
            <Flame size={14} fill="currentColor" /> {Math.floor(Math.random() * 3000) + 500}
          </span>
        </div>

        <h3 className="product-title">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        
        <div className="product-price">
          {salePrice.toLocaleString()} {product.prices?.currency_code || 'USD'}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

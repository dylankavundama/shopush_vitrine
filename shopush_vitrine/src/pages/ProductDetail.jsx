import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Share2, Heart, ShoppingBag, Flame } from 'lucide-react';
import { fetchProductById } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useFavorites } from '../context/FavoritesContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (loading) return <div className="loader-container"><div className="loader-spinner"></div></div>;
  if (!product) return <div className="container">Produit non trouvé</div>;

  const isFav = isFavorite(product.id);
  const price = product.prices?.price ? parseInt(product.prices.price) / 100 : 0;

  return (
    <div className="product-detail-page">
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate(-1)}><ChevronLeft size={24} /></button>
        <div className="header-actions">
          <button className="action-btn"><Share2 size={20} /></button>
          <button className={`action-btn ${isFav ? 'active' : ''}`} onClick={() => toggleFavorite(product.id)}>
            <Heart size={20} fill={isFav ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      <div className="product-main-image">
        <img src={product.images?.[0]?.src} alt={product.name} />
      </div>

      <div className="product-content container">
        <div className="badge-row">
          <span className="badge-new">Dernières nouvelles de 2026</span>
          <span className="view-count"><Flame size={14} fill="currentColor" /> {Math.floor(Math.random() * 5000) + 1000}</span>
        </div>

        <h1 className="product-title">{product.name}</h1>
        
        <div className="price-section">
          <span className="product-price">{price.toLocaleString()} {product.prices?.currency_code}</span>
        </div>

        <div className="action-buttons">
          <a href={`https://wa.me/243866666630?text=Je suis intéressé par ${product.name}`} className="buy-btn">
            <ShoppingBag size={20} /> {t('buy.whatsapp')}
          </a>
        </div>

        <div className="product-description">
          <h2>{t('description')}</h2>
          <div dangerouslySetInnerHTML={{ __html: product.description }} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

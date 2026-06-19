import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/product/ProductCard';
import CategoryGrid from '../components/common/CategoryGrid';
import { ArrowRight, Search, Menu } from 'lucide-react';
import './Home.css';

const Home = () => {
  const { products, loading, error, updateParams } = useProducts();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    updateParams({ search: searchTerm });
  };

  return (
    <div className="home-page">
      {/* Mobile-like Header */}
      <div className="app-header">
        <Menu size={24} />
        <div className="app-logo">
           <img src="/vanilla-version/assets/logo.png" alt="Logo" />
           <div className="app-title">
             <span className="main-name">SHOPUSHINDI</span>
             <span className="slogan">VOTRE PARTENAIRE SHOPPING DE CONFIANCE</span>
           </div>
        </div>
        <div className="header-right">
          <a href="https://wa.me/243866666630" className="whatsapp-icon">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" width="24" height="24" />
          </a>
        </div>
      </div>

      <div className="container">
        {/* All/Recent filter buttons */}
        <div className="top-filters">
          <button className="filter-btn active">Tous les prochains</button>
        </div>

        {/* Categories Section */}
        <section className="home-section">
          <div className="section-header-simple">
            <h2>Catégories populaires</h2>
            <p>Découvrez nos meilleures sélections sur Shopushindi</p>
          </div>
          <CategoryGrid />
          <div className="center-btn">
            <button className="btn-outline">Toutes les catégories</button>
          </div>
        </section>

        {/* Featured Section */}
        <section className="home-section">
          <div className="section-header-simple">
            <h2>En vedette</h2>
            <p>Les dernières offres de Shopushindi</p>
          </div>
          
          {loading ? (
            <div className="loader-container">
              <div className="loader-spinner"></div>
            </div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <div className="products-grid-mobile">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;

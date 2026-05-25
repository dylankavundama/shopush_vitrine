import React, { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/product/ProductCard';
import { Search, X } from 'lucide-react';
import './SearchPage.css';

const SearchPage = () => {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const { products, loading, updateParams } = useProducts({ per_page: 50 });

  const handleSearch = (e) => {
    e.preventDefault();
    updateParams({ search: query });
  };

  const clearSearch = () => {
    setQuery('');
    updateParams({ search: '' });
  };

  return (
    <div className="search-page container">
      <div className="search-header-sticky">
        <form className="search-big-form" onSubmit={handleSearch}>
          <div className="input-wrapper">
            <Search size={20} className="search-icon" />
            <input 
              type="text" 
              placeholder={t('search.placeholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            {query && <button type="button" className="clear-btn" onClick={clearSearch}><X size={20} /></button>}
          </div>
        </form>
      </div>

      <div className="search-results">
        {loading ? (
          <div className="loader-container"><div className="loader-spinner"></div></div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <p>Aucun résultat pour "{query}"</p>
          </div>
        ) : (
          <div className="products-grid-mobile">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;

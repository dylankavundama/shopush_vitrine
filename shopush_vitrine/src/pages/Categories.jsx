import React, { useEffect, useState } from 'react';
import { fetchCategories, fetchProducts } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import { useLanguage } from '../context/LanguageContext';
import './Categories.css';

const Categories = () => {
  const { t } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch all products (max 100 for categories view)
        const { products } = await fetchProducts({ per_page: 100 });
        
        // Group products by category
        const grouped = products.reduce((acc, product) => {
          const catName = product.categories?.[0]?.name || 'Autres';
          if (!acc[catName]) acc[catName] = [];
          if (acc[catName].length < 8) acc[catName].push(product);
          return acc;
        }, {});

        setProductsByCategory(grouped);
        setCategories(Object.keys(grouped));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="loader-container"><div className="loader-spinner"></div></div>;

  return (
    <div className="categories-page container">
      <div className="section-header-simple">
        <h1>{t('nav.categories')}</h1>
        <p>Découvrez nos produits par univers</p>
      </div>

      {categories.map(catName => (
        <section key={catName} className="category-section">
          <div className="category-header">
            <h2 className="category-title">{catName}</h2>
            <span className="count-badge">{productsByCategory[catName].length} articles</span>
          </div>
          <div className="products-grid-mobile">
            {productsByCategory[catName].map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default Categories;

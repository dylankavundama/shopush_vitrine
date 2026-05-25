import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Brands.css';

const brands = [
  { id: 1, name: 'SAMSUNG', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg', count: 158, trend: '+14', rating: 3.7 },
  { id: 2, name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', count: 168, trend: '+13', rating: 3.8 },
  { id: 3, name: 'TECNO', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Tecno_Mobile_logo.svg', count: 10, rating: 3.6 },
  { id: 4, name: 'xiaomi', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg', count: 48, trend: '+6', rating: 4.1 },
  { id: 5, name: 'SONY', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg', count: 57, rating: 3.9 },
  { id: 6, name: 'Infinix', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Infinix_logo.svg', count: 14, trend: '+3', rating: 3.6 },
  { id: 7, name: 'JBL', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/JBL_logo.svg', count: 24, rating: 4.3 },
  { id: 8, name: 'HUAWEI', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Huawei_logo.svg', count: 32, rating: 4.0 },
];

const Brands = () => {
  const { t } = useLanguage();

  return (
    <div className="brands-page container">
      <div className="section-header-simple">
        <h1>Marques</h1>
        <p>Retrouvez vos marques préférées sur Shopushindi</p>
      </div>

      <div className="brands-grid">
        {brands.map((brand) => (
          <div key={brand.id} className="brand-card">
            <div className="brand-logo-wrapper">
              <img src={brand.logo} alt={brand.name} className="brand-logo" />
            </div>
            <div className="brand-stats">
              <div className="stat-item">
                <span className="stat-value">{brand.count} {brand.trend && <span className="trend-up">{brand.trend}</span>}</span>
                <span className="stat-label">Articles</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{brand.rating}</span>
                <span className="stat-label">Notation</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Brands;

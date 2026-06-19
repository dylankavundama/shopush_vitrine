import React from 'react';
import { Smartphone, Tv, Laptop, Tablet, Watch, Camera, Headphones, Speaker } from 'lucide-react';
import './CategoryGrid.css';

const categories = [
  { id: 1, name: 'Smartphones', count: 358, trend: '+23', icon: <Smartphone />, color: '#f87171' },
  { id: 2, name: 'téléviseurs', count: 88, icon: <Tv />, color: '#fb923c' },
  { id: 3, name: 'ordinateurs portables', count: 97, trend: '+2', icon: <Laptop />, color: '#fbbf24' },
  { id: 4, name: 'Comprimés', count: 83, trend: '+11', icon: <Tablet />, color: '#4ade80' },
  { id: 5, name: 'montres connectées', count: 61, trend: '+2', icon: <Watch />, color: '#22d3ee' },
  { id: 6, name: 'Caméras', count: 37, icon: <Camera />, color: '#818cf8' },
  { id: 7, name: 'Écouteurs', count: 56, icon: <Headphones />, color: '#a78bfa' },
  { id: 8, name: 'Enceintes Bluetooth', count: 39, trend: '+4', icon: <Speaker />, color: '#f472b6' },
];

const CategoryGrid = () => {
  return (
    <div className="category-grid-container">
      <div className="category-grid">
        {categories.map((cat) => (
          <div key={cat.id} className="category-item">
            <div className="category-icon-wrapper" style={{ '--bg-color': cat.color }}>
              {cat.icon}
            </div>
            <span className="category-name">{cat.name}</span>
            <div className="category-stats">
              <span className="cat-count">{cat.count}</span>
              {cat.trend && <span className="cat-trend">{cat.trend}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;

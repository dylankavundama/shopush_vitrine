import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Grid, LayoutGrid, Search, ListIcon } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import './BottomNav.css';

const BottomNav = () => {
  const { t } = useLanguage();

  return (
    <nav className="bottom-nav">
      <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Home size={22} />
        <span>{t('nav.home')}</span>
      </NavLink>
      <NavLink to="/brands" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Grid size={22} />
        <span>{t('nav.brands') || 'Marques'}</span>
      </NavLink>
      <NavLink to="/categories" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <LayoutGrid size={22} />
        <span>{t('nav.categories')}</span>
      </NavLink>
      <NavLink to="/search" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Search size={22} />
        <span>{t('nav.search')}</span>
      </NavLink>
      <NavLink to="/favorites" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <ListIcon size={22} />
        <span>{t('nav.favorites')}</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;

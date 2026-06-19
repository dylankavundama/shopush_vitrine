import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useFavorites } from '../../context/FavoritesContext';
import './Header.css';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const { language, t, toggleLanguage } = useLanguage();
  const { favorites } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real app, this would navigate to a search page or update a global state
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''} ${!visible ? 'hidden-header' : ''}`}>
      <div className="container header-inner">
        <nav className="header-nav">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            {t('nav.home')}
          </Link>
          <Link to="/categories" className={`nav-link ${location.pathname === '/categories' ? 'active' : ''}`}>
            {t('nav.categories')}
          </Link>
          <Link to="/services" className={`nav-link ${location.pathname === '/services' ? 'active' : ''}`}>
            {t('nav.services')}
          </Link>
          <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>
            {t('nav.about')}
          </Link>
        </nav>

        <div className="brand">
          <Link to="/" className="brand-link">
            <img src="/vanilla-version/assets/logo.png" alt="Shopushindi Logo" className="brand-logo" />
            {/* Christmas icon logic could go here */}
          </Link>
        </div>

        <div className="header-actions">
          <form className="search-form" onSubmit={handleSearch}>
            <input 
              type="search" 
              placeholder={t('search.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-button">
              <Search size={18} />
            </button>
          </form>

          <button className="language-toggle" onClick={toggleLanguage} title={language === 'fr' ? 'Switch to English' : 'Passer au Français'}>
            <span className="flag-icon">{language === 'fr' ? '🇫🇷' : '🇬🇧'}</span>
          </button>

          <Link to="/favorites" className="action-icon" aria-label={t('nav.favorites')}>
            <Heart size={22} />
            {favorites.length > 0 && <span className="badge">{favorites.length}</span>}
          </Link>

          <a href="https://wa.me/243866666630" className="action-icon" aria-label="Cart">
            <ShoppingBag size={22} />
            {/* In a real app, this would be the cart count */}
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;

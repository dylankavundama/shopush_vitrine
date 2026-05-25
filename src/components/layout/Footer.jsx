import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, MessageCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import './Footer.css';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <img src="/vanilla-version/assets/logo.png" alt="Shopushindi" className="footer-logo" />
          <p className="footer-desc">
            {t('footer.desc')}
          </p>
          <div className="social-links">
            <a href="#" className="social-icon"><Facebook size={20} /></a>
            <a href="#" className="social-icon"><Instagram size={20} /></a>
            <a href="https://wa.me/243866666630" className="social-icon"><MessageCircle size={20} /></a>
          </div>
        </div>

        <div className="footer-nav">
          <div className="footer-column">
            <h4>{t('nav.categories')}</h4>
            <ul>
              <li><Link to="/categories">Smartphones</Link></li>
              <li><Link to="/categories">Ordinateurs</Link></li>
              <li><Link to="/categories">TV & Audio</Link></li>
              <li><Link to="/categories">Accessoires</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>{t('contact.title')}</h4>
            <p>Butembo, Congo DRC</p>
            <p>Av. du Centre, CETRACA Bldg</p>
            <p>Tél : <a href="tel:+243866666630">+243 866 666 630</a></p>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; 2026 Shopushindi. All rights reserved.</p>
          <p>{t('footer.developed')} <a href="https://portfolio-dylan.vercel.app/" target="_blank" rel="noreferrer">Dylan Kavundama</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

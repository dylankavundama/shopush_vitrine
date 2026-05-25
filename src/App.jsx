import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { FavoritesProvider } from './context/FavoritesContext';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import Home from './pages/Home';
import Brands from './pages/Brands';
import Categories from './pages/Categories';
import ProductDetail from './pages/ProductDetail';
import Favorites from './pages/Favorites';
import SearchPage from './pages/SearchPage';
import Footer from './components/layout/Footer';
import './styles/GlobalStyles.css';

// Simple placeholders for missing pages
const AboutPlaceholder = () => <div className="container" style={{padding: '2rem'}}><h2>À propos</h2><p>Page en cours de développement...</p></div>;
const ServicesPlaceholder = () => <div className="container" style={{padding: '2rem'}}><h2>Services</h2><p>Page en cours de développement...</p></div>;

function App() {
  return (
    <LanguageProvider>
      <FavoritesProvider>
        <Router>
          <div className="app-container">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/brands" element={<Brands />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/about" element={<AboutPlaceholder />} />
                <Route path="/services" element={<ServicesPlaceholder />} />
                <Route path="/product/:id" element={<ProductDetail />} />
              </Routes>
            </main>
            <Footer />
            <BottomNav />
          </div>
        </Router>
      </FavoritesProvider>
    </LanguageProvider>
  );
}

export default App;

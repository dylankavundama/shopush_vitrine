import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('ush_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('ush_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      const isFav = prev.includes(productId);
      if (isFav) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
    return !favorites.includes(productId);
  };

  const isFavorite = (productId) => favorites.includes(productId);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

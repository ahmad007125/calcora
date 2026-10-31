import React, { createContext, useContext, useEffect, useState } from 'react';

interface FavoritesContextType {
  favorites: string[]; // calculator ids
  recent: string[]; // calculator ids
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  addRecent: (id: string) => void;
  clearRecent: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('omnicalc_favorites');
      return saved ? JSON.parse(saved) : ['bmi', 'loan-emi', 'universal-converter', 'currency-converter', 'color-contrast', 'word-counter'];
    } catch {
      return ['bmi', 'loan-emi', 'universal-converter', 'currency-converter', 'color-contrast', 'word-counter'];
    }
  });

  const [recent, setRecent] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('omnicalc_recent');
      return saved ? JSON.parse(saved) : ['currency-converter', 'bmi', 'loan-emi', 'universal-converter'];
    } catch {
      return ['currency-converter', 'bmi', 'loan-emi', 'universal-converter'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('omnicalc_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.warn('Failed saving favorites to localStorage', e);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('omnicalc_recent', JSON.stringify(recent));
    } catch (e) {
      console.warn('Failed saving recent to localStorage', e);
    }
  }, [recent]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const addRecent = (id: string) => {
    setRecent(prev => {
      const filtered = prev.filter(item => item !== id);
      return [id, ...filtered].slice(0, 8);
    });
  };

  const clearRecent = () => {
    setRecent([]);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, recent, toggleFavorite, isFavorite, addRecent, clearRecent }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}

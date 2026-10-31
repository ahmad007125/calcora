import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { SearchModal } from './components/common/SearchModal';
import { HomeView } from './components/views/HomeView';
import { CategoryView } from './components/views/CategoryView';
import { CalculatorView } from './components/views/CalculatorView';
import { CALCULATORS, CATEGORIES } from './data/registry';
import { CategoryId } from './types';
import { GridBackdrop } from './components/graphics/GridBackdrop';

type RouteState = 
  | { view: 'home' }
  | { view: 'category'; categoryId: CategoryId | 'all' }
  | { view: 'calculator'; calculatorId: string };

function parseHashRoute(): RouteState {
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (!hash) return { view: 'home' };

  const parts = hash.split('/');
  if (parts[0] === 'category' && parts[1]) {
    return { view: 'category', categoryId: parts[1] as CategoryId | 'all' };
  }
  if (parts[0] === 'calculator' && parts[1]) {
    return { view: 'calculator', calculatorId: parts[1] };
  }
  if (parts[0] === 'tools') {
    return { view: 'category', categoryId: 'all' };
  }

  // Check if hash matches a calculator id or slug directly
  const match = CALCULATORS.find(c => c.id === parts[0] || c.slug === parts[0]);
  if (match) {
    return { view: 'calculator', calculatorId: match.id };
  }

  return { view: 'home' };
}

export function AppContent() {
  const [route, setRoute] = useState<RouteState>(parseHashRoute);
  const [searchOpen, setSearchOpen] = useState(false);

  // Sync hash routing and browser Back/Forward
  useEffect(() => {
    const handleHashChange = () => {
      const newRoute = parseHashRoute();
      setRoute(newRoute);
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Sync page title
  useEffect(() => {
    if (route.view === 'calculator') {
      const calc = CALCULATORS.find(c => c.id === route.calculatorId);
      if (calc) {
        document.title = `${calc.title} — OmniCalc Precision Suite`;
        return;
      }
    } else if (route.view === 'category') {
      if (route.categoryId === 'all') {
        document.title = 'All 60+ Precision Calculators & Converters — OmniCalc';
      } else {
        const cat = CATEGORIES.find(c => c.id === route.categoryId);
        document.title = `${cat?.name || 'Calculators'} — OmniCalc`;
      }
      return;
    }
    document.title = 'OmniCalc - All-in-One Professional Calculator & Converter Suite';
  }, [route]);

  // Navigation actions
  const navigateHome = () => {
    window.location.hash = '#/';
    setRoute({ view: 'home' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateCategory = (cat: CategoryId | 'all') => {
    window.location.hash = `#/category/${cat}`;
    setRoute({ view: 'category', categoryId: cat });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateCalculator = (id: string) => {
    window.location.hash = `#/calculator/${id}`;
    setRoute({ view: 'calculator', calculatorId: id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getActiveCategory = () => {
    if (route.view === 'category') return route.categoryId;
    if (route.view === 'calculator') {
      const calc = CALCULATORS.find(c => c.id === route.calculatorId);
      return calc?.category;
    }
    return null;
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#fafafa] dark:bg-[#090a0f] text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
      <GridBackdrop />
      <Header
        onOpenSearch={() => setSearchOpen(true)}
        onNavigateHome={navigateHome}
        onNavigateCategory={navigateCategory}
        onNavigateAll={() => navigateCategory('all')}
        activeCategory={getActiveCategory()}
      />

      <main className="flex-1">
        {route.view === 'home' && (
          <HomeView
            onOpenSearch={() => setSearchOpen(true)}
            onSelectCalculator={navigateCalculator}
            onSelectCategory={navigateCategory}
          />
        )}

        {route.view === 'category' && (
          <CategoryView
            categoryId={route.categoryId}
            onNavigateHome={navigateHome}
            onNavigateCategory={navigateCategory}
            onSelectCalculator={navigateCalculator}
          />
        )}

        {route.view === 'calculator' && (
          <CalculatorView
            calculatorId={route.calculatorId}
            onNavigateHome={navigateHome}
            onNavigateCategory={navigateCategory}
            onNavigateCalculator={navigateCalculator}
          />
        )}
      </main>

      <Footer
        onNavigateHome={navigateHome}
        onNavigateCategory={navigateCategory}
        onNavigateCalculator={navigateCalculator}
      />

      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectCalculator={navigateCalculator}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <AppContent />
      </FavoritesProvider>
    </ThemeProvider>
  );
}

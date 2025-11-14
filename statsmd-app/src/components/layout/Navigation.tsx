import React from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { Button } from '../ui/Button';
import { Moon, Sun, Home, BookOpen, FlaskConical, GraduationCap } from 'lucide-react';

export const Navigation: React.FC = () => {
  const { darkMode, toggleDarkMode, currentView, setCurrentView } = useAppStore();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'test-selector', label: 'Test Selector', icon: FlaskConical },
    { id: 'learning', label: 'Learning', icon: GraduationCap },
    { id: 'glossary', label: 'Glossary', icon: BookOpen },
  ];

  return (
    <nav className="border-b bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <FlaskConical className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">StatsMD</h1>
          </div>

          {/* Navigation items */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? 'default' : 'ghost'}
                  onClick={() => setCurrentView(item.id)}
                  className="flex items-center space-x-2"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </div>

          {/* Dark mode toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile navigation */}
        <div className="md:hidden flex space-x-1 pb-3 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={currentView === item.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView(item.id)}
                className="flex items-center space-x-1 whitespace-nowrap"
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

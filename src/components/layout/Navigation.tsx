import React, { useState } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { Button } from '../ui/Button';
import {
  Moon,
  Sun,
  Home,
  BookOpen,
  FlaskConical,
  Brain,
  TrendingUp,
  FileText,
  Award,
  Menu,
  X
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const { darkMode, toggleDarkMode, currentView, setCurrentView } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'test-selector', label: 'Test Selector', icon: FlaskConical },
    { id: 'assumption-checker', label: 'Assumptions', icon: Brain },
    { id: 'regression-playground', label: 'Regression', icon: TrendingUp },
    { id: 'cases', label: 'Cases', icon: FileText },
    { id: 'assessment', label: 'Assessment', icon: Award },
    { id: 'glossary', label: 'Glossary', icon: BookOpen },
  ];

  const handleNavClick = (itemId: string) => {
    setCurrentView(itemId);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => handleNavClick('home')}
          >
            <FlaskConical className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">StatsMD</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleNavClick(item.id)}
                  className="flex items-center space-x-2"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? 'default' : 'ghost'}
                  onClick={() => handleNavClick(item.id)}
                  className="w-full justify-start"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
};

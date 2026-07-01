import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, Sun, Moon } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import { useTheme } from '../context/ThemeContext';
import { useScrollSpy } from '../hooks/use-scroll-spy';
import CVButton from './CVButton';

export default function Navigation() {
  const { language, toggleLanguage, t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isDark = theme === 'dark';

  const navItems = [
    { id: 'home', labelKey: 'nav-home' as const },
    { id: 'about', labelKey: 'nav-about' as const },
    { id: 'projects', labelKey: 'nav-projects' as const },
    { id: 'certificates', labelKey: 'nav-certificates' as const },
    { id: 'ai-assistant', labelKey: 'nav-ai-assistant' as const },
    { id: 'contact', labelKey: 'nav-contact' as const },
  ];

  const sectionIds = navItems.map((item) => item.id);
  const activeSection = useScrollSpy(sectionIds);

  // Handle sticky background blur on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of navigation bar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav
      id="main-navigation"
      className={`fixed left-4 right-4 z-40 transition-all duration-500 md:left-6 md:right-6 top-4 md:top-6 crystal-panel rounded-2xl shadow-2xl ${
        isScrolled 
          ? 'py-2.5' 
          : 'py-3.5'
      }`}
    >
      {/* Full screen dark backdrop behind the mobile menu when open */}
      <div
        id="mobile-menu-full-screen-overlay"
        onClick={() => setIsMobileMenuOpen(false)}
        className={`fixed inset-0 md:hidden transition-all duration-500 z-10 ${
          isMobileMenuOpen 
            ? 'opacity-100 pointer-events-auto bg-[#01060c]/96 backdrop-blur-md' 
            : 'opacity-0 pointer-events-none bg-transparent backdrop-blur-none'
        }`}
        style={{ width: '100vw', height: '100vh', left: 0, top: 0 }}
      />

      <div id="nav-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div id="nav-flex-wrapper" className="flex items-center justify-between h-14">
          {/* Brand Logo */}
          <a
            id="brand-logo"
            href="#home"
            onClick={(e) => handleNavClick(e, 'home')}
            className="flex items-center"
          >
            <span className="text-2xl font-black tracking-wider text-gradient-green hover:brightness-110 transition-all">
              LFCC
            </span>
          </a>

          {/* Desktop Menu */}
          <div id="desktop-menu" className="hidden md:flex items-center gap-8">
            <div id="desktop-nav-links" className="flex items-center gap-6">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`text-sm font-semibold transition-all duration-300 relative py-1.5 ${
                    activeSection === item.id
                      ? (isDark ? 'text-green-400' : 'text-blue-600')
                      : (isDark ? 'text-gray-300 hover:text-green-400' : 'text-slate-600 hover:text-blue-600')
                  }`}
                >
                  {t(item.labelKey)}
                  {activeSection === item.id && (
                    <span
                      id={`nav-active-indicator-${item.id}`}
                      className={`absolute bottom-0 left-0 w-full h-[2px] rounded-full ${
                        isDark ? 'bg-gradient-to-r from-green-500 to-green-400' : 'bg-gradient-to-r from-blue-600 to-indigo-500'
                      }`}
                    />
                  )}
                </a>
              ))}
            </div>

            <div id="desktop-nav-actions" className={`flex items-center gap-3 pl-4 border-l ${isDark ? 'border-green-500/10' : 'border-slate-200'}`}>
              {/* Theme Toggle */}
              <button
                id="theme-toggle-desktop"
                onClick={toggleTheme}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  isDark
                    ? 'bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/25'
                    : 'bg-blue-500/10 border border-blue-500/20 text-blue-600 hover:bg-blue-500/20'
                }`}
                title={isDark ? 'Cambiar a modo claro / Switch to light mode' : 'Cambiar a modo oscuro / Switch to dark mode'}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>

              {/* Language Selector */}
              <button
                id="lang-toggle-desktop"
                onClick={toggleLanguage}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all cursor-pointer text-xs font-bold ${
                  isDark
                    ? 'bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/25'
                    : 'bg-blue-500/10 border border-blue-500/20 text-blue-600 hover:bg-blue-500/20'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{language.toUpperCase()}</span>
              </button>

              {/* CV Button */}
              <CVButton id="nav-cv-desktop" />
            </div>
          </div>

          {/* Mobile Hamburguer Toggle */}
          <div id="mobile-menu-toggle-wrapper" className="flex items-center gap-2 md:hidden">
            {/* Quick Theme Toggle */}
            <button
              id="theme-toggle-mobile-header"
              onClick={toggleTheme}
              className={`p-1.5 rounded-full text-xs font-bold ${
                isDark
                  ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                  : 'bg-blue-500/10 border border-blue-500/20 text-blue-600'
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* Quick Language selector on mobile header */}
            <button
              id="lang-toggle-mobile-header"
              onClick={toggleLanguage}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold ${
                isDark
                  ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                  : 'bg-blue-500/10 border border-blue-500/20 text-blue-600'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language.toUpperCase()}</span>
            </button>

            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 focus:outline-none focus:ring-2 focus:ring-blue-400/50 rounded-lg transition-colors ${
                isDark ? 'text-gray-300 hover:text-green-400' : 'text-slate-700 hover:text-blue-600'
              }`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <div
        id="mobile-drawer-backdrop"
        className={`fixed inset-x-4 z-30 transition-all duration-300 md:hidden rounded-2xl shadow-2xl border backdrop-blur-2xl ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-4'
        } ${
          isDark 
            ? 'bg-[#04121f]/95 border-green-500/35 shadow-[0_15px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(16,185,129,0.15)]' 
            : 'bg-white/98 border-slate-200/90 shadow-[0_15px_50px_rgba(0,0,0,0.15),0_0_30px_rgba(37,99,235,0.05)]'
        }`}
        style={{ top: '85px', height: 'auto', maxHeight: 'calc(100vh - 110px)', overflowY: 'auto' }}
      >
        <div id="mobile-drawer-content" className="flex flex-col p-6 gap-6 justify-between">
          <div id="mobile-drawer-links" className="flex flex-col gap-4 mt-2">
            {navItems.map((item) => (
              <a
                key={item.id}
                id={`mobile-nav-link-${item.id}`}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`text-xl font-bold transition-all duration-300 py-2 border-b ${
                  isDark ? 'border-green-500/5' : 'border-slate-200'
                } ${
                  activeSection === item.id
                    ? (isDark ? 'text-green-400 pl-2 border-l-2 border-l-green-400' : 'text-blue-600 pl-2 border-l-2 border-l-blue-600')
                    : (isDark ? 'text-gray-300 hover:text-green-400' : 'text-slate-700 hover:text-blue-600')
                }`}
              >
                {t(item.labelKey)}
              </a>
            ))}
          </div>

          <div id="mobile-drawer-footer" className={`flex flex-col gap-4 border-t pt-4 mb-2 ${isDark ? 'border-green-500/10' : 'border-slate-200'}`}>
            <div id="mobile-drawer-toggles" className="flex items-center justify-between px-2">
              <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                {language === 'es' ? 'Ajustes' : 'Settings'}
              </span>
              
              <div className="flex items-center gap-2">
                {/* Theme toggle */}
                <button
                  id="theme-toggle-mobile-drawer"
                  onClick={toggleTheme}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                    isDark
                      ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                      : 'bg-blue-500/10 border border-blue-500/20 text-blue-600'
                  }`}
                >
                  {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                  <span>{isDark ? (language === 'es' ? 'Claro' : 'Light') : (language === 'es' ? 'Oscuro' : 'Dark')}</span>
                </button>

                {/* Lang toggle */}
                <button
                  id="lang-toggle-mobile-drawer"
                  onClick={toggleLanguage}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                    isDark
                      ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                      : 'bg-blue-500/10 border border-blue-500/20 text-blue-600'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{language === 'es' ? 'ES' : 'EN'}</span>
                </button>
              </div>
            </div>

            <CVButton id="nav-cv-mobile" className="w-full text-center" />
          </div>
        </div>
      </div>
    </nav>
  );
}
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Globe, Sun, Moon, ChevronDown } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import { useTheme } from '../context/ThemeContext';
import { useScrollSpy } from '../hooks/use-scroll-spy';
import CVButton from './CVButton';

// Flag SVG Components
const ColombiaFlag = () => (
  <svg viewBox="0 0 100 100" className="w-4 h-4 rounded-full overflow-hidden inline-block shrink-0 shadow-sm border border-slate-500/10">
    {/* Yellow stripe - 50% height */}
    <rect width="100" height="50" fill="#FCD116" />
    {/* Blue stripe - 25% height */}
    <rect y="50" width="100" height="25" fill="#003893" />
    {/* Red stripe - 25% height */}
    <rect y="75" width="100" height="25" fill="#CE1126" />
  </svg>
);

const USFlag = () => (
  <svg viewBox="0 0 100 100" className="w-4 h-4 rounded-full overflow-hidden inline-block shrink-0 shadow-sm border border-slate-500/10">
    <rect width="100" height="100" fill="#FFFFFF" />
    <rect y="0" width="100" height="7.69" fill="#B22234" />
    <rect y="15.38" width="100" height="7.69" fill="#B22234" />
    <rect y="30.76" width="100" height="7.69" fill="#B22234" />
    <rect y="46.15" width="100" height="7.69" fill="#B22234" />
    <rect y="61.53" width="100" height="7.69" fill="#B22234" />
    <rect y="76.92" width="100" height="7.69" fill="#B22234" />
    <rect y="92.30" width="100" height="7.69" fill="#B22234" />
    <rect width="50" height="53.85" fill="#3C3B6E" />
    <circle cx="8" cy="10" r="1.5" fill="#FFFFFF" />
    <circle cx="20" cy="10" r="1.5" fill="#FFFFFF" />
    <circle cx="32" cy="10" r="1.5" fill="#FFFFFF" />
    <circle cx="44" cy="10" r="1.5" fill="#FFFFFF" />
    <circle cx="14" cy="18" r="1.5" fill="#FFFFFF" />
    <circle cx="26" cy="18" r="1.5" fill="#FFFFFF" />
    <circle cx="38" cy="18" r="1.5" fill="#FFFFFF" />
    <circle cx="8" cy="26" r="1.5" fill="#FFFFFF" />
    <circle cx="20" cy="26" r="1.5" fill="#FFFFFF" />
    <circle cx="32" cy="26" r="1.5" fill="#FFFFFF" />
    <circle cx="44" cy="26" r="1.5" fill="#FFFFFF" />
    <circle cx="14" cy="34" r="1.5" fill="#FFFFFF" />
    <circle cx="26" cy="34" r="1.5" fill="#FFFFFF" />
    <circle cx="38" cy="34" r="1.5" fill="#FFFFFF" />
    <circle cx="8" cy="42" r="1.5" fill="#FFFFFF" />
    <circle cx="20" cy="42" r="1.5" fill="#FFFFFF" />
    <circle cx="32" cy="42" r="1.5" fill="#FFFFFF" />
    <circle cx="44" cy="42" r="1.5" fill="#FFFFFF" />
  </svg>
);

const languagesInfo = [
  { code: 'es' as const, label: 'ES', name: 'Español', flag: <ColombiaFlag /> },
  { code: 'en-US' as const, label: 'US', name: 'Inglés Americano', flag: <USFlag /> }
];

export default function Navigation() {
  const { language, setLanguage, toggleLanguage, t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isMobileHeaderLangOpen, setIsMobileHeaderLangOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const mobileHeaderLangRef = useRef<HTMLDivElement>(null);

  const isDark = theme === 'dark';

  const navItems = [
    { id: 'home', labelKey: 'nav-home' as const },
    { id: 'about', labelKey: 'nav-about' as const },
    { id: 'projects', labelKey: 'nav-projects' as const },
    { id: 'certificates', labelKey: 'nav-certificates' as const },
    { id: 'ai-assistant', labelKey: 'nav-ai' as const },
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

  // Handle click outside of language dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
      if (mobileHeaderLangRef.current && !mobileHeaderLangRef.current.contains(event.target as Node)) {
        setIsMobileHeaderLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
      className={`fixed left-4 right-4 z-40 transition-all duration-500 md:left-6 md:right-6 top-4 md:top-6 crystal-panel rounded-2xl shadow-2xl ${isScrolled
          ? 'py-2.5'
          : 'py-3.5'
        }`}
    >
      {/* Full screen dark backdrop behind the mobile menu when open */}
      <div
        id="mobile-menu-full-screen-overlay"
        onClick={() => setIsMobileMenuOpen(false)}
        className={`fixed inset-0 md:hidden transition-all duration-500 z-10 ${isMobileMenuOpen
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
                  className={`text-sm font-semibold transition-all duration-300 relative py-1.5 ${activeSection === item.id
                      ? (isDark ? 'text-green-400' : 'text-blue-600')
                      : (isDark ? 'text-gray-300 hover:text-green-400' : 'text-slate-600 hover:text-blue-600')
                    }`}
                >
                  {t(item.labelKey)}
                  {activeSection === item.id && (
                    <span
                      id={`nav-active-indicator-${item.id}`}
                      className={`absolute bottom-0 left-0 w-full h-[2px] rounded-full ${isDark ? 'bg-gradient-to-r from-green-500 to-green-400' : 'bg-gradient-to-r from-blue-600 to-indigo-500'
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
                className={`p-1.5 rounded-full transition-all cursor-pointer ${isDark
                    ? 'bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/25'
                    : 'bg-blue-500/10 border border-blue-500/20 text-blue-600 hover:bg-blue-500/20'
                  }`}
                title={isDark ? 'Cambiar a modo claro / Switch to light mode' : 'Cambiar a modo oscuro / Switch to dark mode'}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>

              {/* Language Selector Dropdown */}
              <div ref={langDropdownRef} className="relative inline-block text-left">
                <button
                  id="lang-dropdown-desktop-trigger"
                  onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all cursor-pointer text-xs font-bold select-none ${isDark
                      ? 'bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/25'
                      : 'bg-blue-500/10 border border-blue-500/20 text-blue-600 hover:bg-blue-500/20'
                    }`}
                  aria-haspopup="true"
                  aria-expanded={isLangDropdownOpen}
                >
                  {languagesInfo.find(l => l.code === language)?.flag}
                  <span>{languagesInfo.find(l => l.code === language)?.label}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isLangDropdownOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-44 rounded-xl shadow-xl border overflow-hidden z-50 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200 ${isDark
                        ? 'bg-[#030914]/95 border-green-500/20 text-gray-200'
                        : 'bg-white/95 border-slate-200 text-slate-700'
                      }`}
                  >
                    <div className="py-1">
                      {languagesInfo.map((langOption) => (
                        <button
                          key={langOption.code}
                          onClick={() => {
                            setLanguage(langOption.code);
                            setIsLangDropdownOpen(false);
                          }}
                          className={`flex items-center justify-between w-full px-4 py-2 text-left text-xs font-semibold transition-colors cursor-pointer ${language === langOption.code
                              ? isDark
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-blue-500/10 text-blue-600'
                              : isDark
                                ? 'hover:bg-slate-800/50 text-slate-300'
                                : 'hover:bg-slate-100 text-slate-600'
                            }`}
                        >
                          <div className="flex items-center gap-2">
                            {langOption.flag}
                            <span>{langOption.name}</span>
                          </div>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${language === langOption.code
                              ? isDark
                                ? 'bg-green-500/30'
                                : 'bg-blue-500/20'
                              : isDark
                                ? 'bg-slate-800 text-slate-400'
                                : 'bg-slate-100 text-slate-500'
                            }`}>
                            {langOption.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

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
              className={`p-1.5 rounded-full text-xs font-bold ${isDark
                  ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                  : 'bg-blue-500/10 border border-blue-500/20 text-blue-600'
                }`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* Quick Language selector on mobile header */}
            <div ref={mobileHeaderLangRef} className="relative inline-block text-left">
              <button
                id="lang-dropdown-mobile-header-trigger"
                onClick={() => setIsMobileHeaderLangOpen(!isMobileHeaderLangOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold select-none ${isDark
                    ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                    : 'bg-blue-500/10 border border-blue-500/20 text-blue-600'
                  }`}
              >
                {languagesInfo.find(l => l.code === language)?.flag}
                <span>{languagesInfo.find(l => l.code === language)?.label}</span>
                <ChevronDown className={`w-2.5 h-2.5 transition-transform duration-200 ${isMobileHeaderLangOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMobileHeaderLangOpen && (
                <div
                  className={`absolute right-0 mt-2 w-40 rounded-xl shadow-xl border overflow-hidden z-50 backdrop-blur-md ${isDark
                      ? 'bg-[#030914]/95 border-green-500/20 text-gray-200'
                      : 'bg-white/95 border-slate-200 text-slate-700'
                    }`}
                >
                  <div className="py-1">
                    {languagesInfo.map((langOption) => (
                      <button
                        key={langOption.code}
                        onClick={() => {
                          setLanguage(langOption.code);
                          setIsMobileHeaderLangOpen(false);
                        }}
                        className={`flex items-center justify-between w-full px-3.5 py-2 text-left text-xs font-semibold transition-colors cursor-pointer ${language === langOption.code
                            ? isDark
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-blue-500/10 text-blue-600'
                            : isDark
                              ? 'hover:bg-slate-800/50 text-slate-300'
                              : 'hover:bg-slate-100 text-slate-600'
                          }`}
                      >
                        <div className="flex items-center gap-1.5">
                          {langOption.flag}
                          <span>{langOption.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 focus:outline-none focus:ring-2 focus:ring-blue-400/50 rounded-lg transition-colors ${isDark ? 'text-gray-300 hover:text-green-400' : 'text-slate-700 hover:text-blue-600'
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
        className={`fixed inset-x-4 z-30 transition-all duration-300 md:hidden rounded-2xl shadow-2xl border backdrop-blur-2xl ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-4'
          } ${isDark
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
                className={`text-xl font-bold transition-all duration-300 py-2 border-b ${isDark ? 'border-green-500/5' : 'border-slate-200'
                  } ${activeSection === item.id
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${isDark
                      ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                      : 'bg-blue-500/10 border border-blue-500/20 text-blue-600'
                    }`}
                >
                  {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                  <span>{isDark ? (language === 'es' ? 'Claro' : 'Light') : (language === 'es' ? 'Oscuro' : 'Dark')}</span>
                </button>

                {/* Three-way Language Selector Bar in Mobile Drawer */}
                <div className={`flex items-center gap-1 p-1 rounded-full border ${isDark
                    ? 'bg-slate-900/50 border-green-500/15'
                    : 'bg-slate-100 border-slate-200'
                  }`}>
                  {languagesInfo.map((langOption) => (
                    <button
                      key={langOption.code}
                      onClick={() => {
                        setLanguage(langOption.code);
                      }}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${language === langOption.code
                          ? isDark
                            ? 'bg-green-500/20 border border-green-500/30 text-green-400 shadow-sm'
                            : 'bg-blue-500/15 border border-blue-500/25 text-blue-600 shadow-sm'
                          : 'border border-transparent text-slate-400 hover:text-slate-300'
                        }`}
                    >
                      {langOption.flag}
                      <span>{langOption.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <CVButton id="nav-cv-mobile" className="w-full text-center" />
          </div>
        </div>
      </div>
    </nav>
  );
}

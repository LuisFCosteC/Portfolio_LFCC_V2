import { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown, FileText } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import { useTheme } from '../context/ThemeContext';

interface CVButtonProps {
  className?: string;
  id?: string;
}

export default function CVButton({ className = '', id }: CVButtonProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isDark = theme === 'dark';

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div id={id || "cv-button-container"} ref={containerRef} className={`relative inline-block ${className}`}>
      <button
        id={id ? `${id}-toggle` : "cv-dropdown-toggle"}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 shadow-md active:scale-95 cursor-pointer ${
          isDark
            ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-[#051A2F] hover:shadow-green-500/20'
            : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:brightness-105 text-white hover:shadow-emerald-600/20'
        }`}
      >
        <Download id="cv-dl-icon" className="w-4 h-4" />
        <span>{t('nav-cv-btn')}</span>
        <ChevronDown id="cv-chevron-icon" className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          id="cv-dropdown-menu"
          className={`absolute right-0 mt-2 w-56 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 border ${
            isDark
              ? 'bg-[#0c253a] border-green-500/30'
              : 'bg-white border-slate-200'
          }`}
        >
          <a
            id="cv-download-es-link"
            href="/docs/CV_Luis_Coste_ES.pdf"
            download="CV_Luis_Coste_ES.pdf"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-all ${
              isDark
                ? 'text-gray-100 hover:bg-green-500/10 hover:text-green-400'
                : 'text-slate-800 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            <FileText className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-emerald-600'}`} />
            <span>{t('nav-cv-es')}</span>
          </a>
          <a
            id="cv-download-en-link"
            href="/docs/CV_Luis_Coste_EN.pdf"
            download="CV_Luis_Coste_EN.pdf"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-all border-t ${
              isDark
                ? 'text-gray-100 hover:bg-green-500/10 hover:text-green-400 border-green-500/10'
                : 'text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 border-slate-100'
            }`}
          >
            <FileText className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-emerald-600'}`} />
            <span>{t('nav-cv-en')}</span>
          </a>
        </div>
      )}
    </div>
  );
}

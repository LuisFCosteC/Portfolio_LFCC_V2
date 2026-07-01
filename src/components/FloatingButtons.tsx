import { useTranslation } from '../i18n/useTranslation';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'motion/react';

export default function FloatingButtons() {
  const { language } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const whatsappUrl = 'https://wa.me/573116463033';
  const gmailUrl = 'mailto:luisfcostec@gmail.com';

  const labels = {
    es: {
      whatsapp: 'Escríbeme por WhatsApp',
      gmail: 'Enviar un correo',
    },
    en: {
      whatsapp: 'Chat on WhatsApp',
      gmail: 'Send an email',
    },
  };

  const currentLabels = language === 'es' ? labels.es : labels.en;

  // Custom high-quality SVG for Gmail
  const gmailIcon = (
    <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-1.29 1.454-2.032 2.514-1.222L12 10.224l9.486-7.19c1.06-.81 2.514-.068 2.514 1.223z"/>
    </svg>
  );

  // Custom high-quality SVG for WhatsApp
  const whatsappIcon = (
    <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );

  return (
    <div
      id="floating-buttons-container"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 items-end pointer-events-none"
    >
      {/* Gmail Button Group */}
      <motion.div
        id="gmail-floating-group"
        className="flex items-center gap-3 pointer-events-auto group"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, type: 'spring', stiffness: 260, damping: 20 }}
      >
        {/* Tooltip */}
        <span
          id="gmail-floating-tooltip"
          className={`px-3 py-1.5 text-xs font-bold font-mono rounded-xl border opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-md ${
            isDark
              ? 'bg-slate-900/90 text-gray-200 border-green-500/20'
              : 'bg-white/95 text-slate-800 border-blue-500/20'
          }`}
        >
          {currentLabels.gmail}
        </span>

        {/* Floating Button */}
        <a
          id="gmail-floating-btn"
          href={gmailUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={currentLabels.gmail}
          className={`relative w-15 h-15 sm:w-16 sm:h-16 flex items-center justify-center rounded-full backdrop-blur-md border transition-all duration-300 hover:-translate-y-1 active:scale-95 ${
            isDark
              ? 'bg-slate-900/60 border-slate-800 text-gray-300 hover:text-green-400 hover:border-green-400/40 hover:shadow-[0_0_25px_rgba(34,197,94,0.25)]'
              : 'bg-white/60 border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-500/40 hover:shadow-[0_6px_25px_rgba(37,99,235,0.15)]'
          }`}
        >
          {/* Pulsing ring indicator to catch attention nicely in theme-matching color */}
          <span className={`absolute inset-0 rounded-full opacity-25 animate-ping -z-10 ${
            isDark ? 'bg-green-500' : 'bg-blue-500'
          }`} />
          {gmailIcon}
        </a>
      </motion.div>

      {/* WhatsApp Button Group */}
      <motion.div
        id="whatsapp-floating-group"
        className="flex items-center gap-3 pointer-events-auto group"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
      >
        {/* Tooltip */}
        <span
          id="whatsapp-floating-tooltip"
          className={`px-3 py-1.5 text-xs font-bold font-mono rounded-xl border opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-md ${
            isDark
              ? 'bg-slate-900/90 text-gray-200 border-green-500/20'
              : 'bg-white/95 text-slate-800 border-blue-500/20'
          }`}
        >
          {currentLabels.whatsapp}
        </span>

        {/* Floating Button */}
        <a
          id="whatsapp-floating-btn"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={currentLabels.whatsapp}
          className="relative w-15 h-15 sm:w-16 sm:h-16 flex items-center justify-center rounded-full text-white shadow-[0_6px_25px_rgba(37,211,102,0.3)] transition-all duration-300 hover:-translate-y-1 active:scale-95 bg-[#25D366] hover:bg-[#20ba59]"
        >
          {/* Pulsing ring indicator to catch attention nicely */}
          <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping -z-10" />
          {whatsappIcon}
        </a>
      </motion.div>
    </div>
  );
}
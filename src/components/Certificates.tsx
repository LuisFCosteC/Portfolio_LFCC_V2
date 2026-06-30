import { useState, useEffect } from 'react';
import { Award, ChevronDown, ChevronUp, ArrowRight, ExternalLink, X, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import { useTheme } from '../context/ThemeContext';
import { certificates, Certificate } from '../data/certificates';
import { useRevealOnScroll } from '../hooks/use-reveal-on-scroll';
import { motion, AnimatePresence } from 'motion/react';

export default function Certificates() {
  const { t, language } = useTranslation();
  const { theme } = useTheme();
  const [showAll, setShowAll] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [direction, setDirection] = useState<number>(0);
  const [containerRef, isVisible] = useRevealOnScroll<HTMLElement>({ threshold: 0.1 });

  const isDark = theme === 'dark';

  const visibleCertificates = showAll ? certificates : certificates.slice(0, 8);

  // Disable body scroll when modal is open
  useEffect(() => {
    const hasActiveModal = !!selectedCert;
    if (hasActiveModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedCert]);

  // Reset direction when opening a certificate from the main grid
  const handleSelectCert = (cert: Certificate) => {
    setDirection(0);
    setSelectedCert(cert);
  };

  const handlePrevCert = () => {
    setDirection(-1);
    setSelectedCert((prev) => {
      if (!prev) return null;
      const currentIndex = certificates.findIndex((c) => c.id === prev.id);
      const prevIndex = (currentIndex - 1 + certificates.length) % certificates.length;
      return certificates[prevIndex];
    });
  };

  const handleNextCert = () => {
    setDirection(1);
    setSelectedCert((prev) => {
      if (!prev) return null;
      const currentIndex = certificates.findIndex((c) => c.id === prev.id);
      const nextIndex = (currentIndex + 1) % certificates.length;
      return certificates[nextIndex];
    });
  };

  // Slide transition variants for certificate change inside modal
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : dir < 0 ? '-100%' : 0,
      opacity: 0,
      scale: dir !== 0 ? 0.98 : 1,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 280, damping: 28 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-100%' : dir < 0 ? '100%' : 0,
      opacity: 0,
      scale: dir !== 0 ? 0.98 : 1,
      transition: {
        x: { type: 'spring', stiffness: 280, damping: 28 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
      },
    }),
  };

  // Keyboard navigation
  useEffect(() => {
    if (!selectedCert) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevCert();
      } else if (e.key === 'ArrowRight') {
        handleNextCert();
      } else if (e.key === 'Escape') {
        setSelectedCert(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedCert]);

  const currentIndex = selectedCert ? certificates.findIndex((c) => c.id === selectedCert.id) : -1;
  const displayIndex = currentIndex + 1;
  const totalCount = certificates.length;

  return (
    <section
      id="certificates"
      key={`certificates-${language}`}
      ref={containerRef}
      className="py-24 bg-transparent"
    >
      <div id="certificates-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div
          id="certificates-header"
          className={`flex flex-col gap-2 mb-16 text-center transition-all duration-1000 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <span className={`font-bold tracking-widest text-xs uppercase flex items-center justify-center gap-1.5 transition-colors duration-500 ${
            isDark ? 'text-green-400' : 'text-emerald-600'
          }`}>
            <Award className="w-3.5 h-3.5" />
            {t('nav-certificates')}
          </span>
          <h2 id="certificates-title-h2" className="text-4xl sm:text-5xl font-black text-gradient-green py-1">
            {t('cert-title')}
          </h2>
          <p id="certificates-subtitle-p" className={`text-sm max-w-md mx-auto mt-1 transition-colors duration-500 ${
            isDark ? 'text-gray-400' : 'text-slate-600'
          }`}>
            {t('cert-subtitle')}
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-green-400 rounded-full mx-auto mt-3" />
        </div>

        {/* Certificate Cards Grid */}
        <div
          id="certificates-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {visibleCertificates.map((cert, idx) => (
            <button
              key={cert.id}
              id={`certificate-card-${cert.id}`}
              onClick={() => handleSelectCert(cert)}
              className={`relative flex flex-col justify-between p-6 rounded-3xl card-glass transition-all duration-500 group overflow-hidden min-h-[200px] h-auto text-left items-stretch w-full cursor-pointer transform hover:-translate-y-1.5 hover:shadow-xl ${
                isDark
                  ? 'hover:border-green-400/60 hover:shadow-green-400/15'
                  : 'hover:border-emerald-500/60 hover:shadow-emerald-500/15'
              } ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${(idx % 4) * 100}ms` }}
            >
              {/* Corner Ambient Glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-2xl group-hover:bg-green-500/10 transition-all duration-500" />

              {/* Floating Platform Badge */}
              <div id={`cert-badge-container-${cert.id}`} className="flex justify-between items-start gap-2">
                <div id={`cert-badge-${cert.id}`} className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-md shadow-sm transition-all duration-500 ${
                  isDark ? 'bg-green-400 text-[#051A2F]' : 'bg-emerald-600 text-white'
                }`}>
                  {t(cert.platformKey as any)}
                </div>
                <ExternalLink id={`cert-ext-link-${cert.id}`} className={`w-4 h-4 shrink-0 transition-colors ${
                  isDark ? 'text-gray-500 group-hover:text-green-400' : 'text-slate-400 group-hover:text-emerald-600'
                }`} />
              </div>

              {/* Title & Description */}
              <div id={`cert-title-desc-wrapper-${cert.id}`} className="flex flex-col gap-1.5 my-3 flex-grow">
                <h3 id={`cert-title-${cert.id}`} className={`text-sm font-bold line-clamp-2 pr-2 transition-colors duration-500 ${
                  isDark ? 'text-gray-100 group-hover:text-green-400/90' : 'text-slate-800 group-hover:text-emerald-600/90'
                }`}>
                  {t(cert.titleKey as any)}
                </h3>
                {cert.descKey && (
                  <p id={`cert-desc-${cert.id}`} className={`text-[11px] leading-snug line-clamp-3 transition-colors duration-500 ${
                    isDark ? 'text-gray-400 group-hover:text-gray-300' : 'text-slate-500 group-hover:text-slate-600'
                  }`}>
                    {t(cert.descKey as any)}
                  </p>
                )}
              </div>

              {/* Animated Date / Action text */}
              <div id={`cert-action-container-${cert.id}`} className="relative h-6 overflow-hidden shrink-0">
                {/* Date emission text (visible by default, slides down on hover) */}
                <div
                  id={`cert-date-${cert.id}`}
                  className={`text-xs font-medium transition-all duration-300 group-hover:opacity-0 group-hover:translate-y-4 ${
                    isDark ? 'text-gray-400' : 'text-slate-500'
                  }`}
                >
                  {t(cert.dateKey as any)}
                </div>

                {/* View link action (hidden by default, slides up on hover) */}
                <div
                  id={`cert-link-hover-${cert.id}`}
                  className={`absolute inset-0 flex items-center gap-1.5 text-xs font-black opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ${
                    isDark ? 'text-green-400' : 'text-emerald-600'
                  }`}
                >
                  <span>{t('cert-view')}</span>
                  <ArrowRight className="w-3.5 h-3.5 animate-pulse" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* View More / Show Less Toggle Button */}
        <div id="certificates-toggle-wrapper" className="flex justify-center mt-12">
          <button
            id="certificates-toggle-btn"
            onClick={() => setShowAll(!showAll)}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 shadow-md active:scale-95 cursor-pointer ${
              isDark
                ? 'bg-[#0c253a]/80 border border-green-500/20 text-green-400 hover:text-[#051A2F] hover:bg-green-400 hover:border-green-400 shadow-green-500/10'
                : 'bg-white border border-emerald-600/20 text-emerald-700 hover:text-white hover:bg-emerald-600 hover:border-emerald-600 shadow-emerald-500/10'
            }`}
          >
            <span>{showAll ? t('cert-show-less') : t('cert-show-more')}</span>
            {showAll ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

      </div>

      {/* Certificate Interactive Preview Modal */}
      <AnimatePresence>
        {selectedCert && (
          <div
            id="certificate-modal-overlay"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              id="certificate-modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className={`relative w-full max-w-3xl rounded-3xl p-1 shadow-2xl ${
                isDark ? 'bg-gradient-to-b from-[#0e2133] to-[#04121e]' : 'bg-gradient-to-b from-white to-[#f4f7f5]'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Index Indicator */}
              <div
                id="certificate-modal-index-indicator"
                className={`absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full text-xs font-mono font-bold border transition-all duration-300 ${
                  isDark 
                    ? 'bg-[#081827] border-green-500/15 text-green-400' 
                    : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}
              >
                {String(displayIndex).padStart(2, '0')} / {String(totalCount).padStart(2, '0')}
              </div>

              {/* Close Button inside Card */}
              <button
                id="certificate-modal-close-btn"
                onClick={() => setSelectedCert(null)}
                className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-all duration-300 cursor-pointer ${
                  isDark 
                    ? 'bg-[#081827] text-gray-400 hover:text-white hover:bg-red-500/10' 
                    : 'bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-red-500/10'
                }`}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Desktop Navigation Arrows (hidden on mobile, floats on the sides of the modal) */}
              <button
                onClick={(e) => { e.stopPropagation(); handlePrevCert(); }}
                className={`hidden lg:flex absolute -left-16 top-1/2 -translate-y-1/2 z-50 p-3.5 rounded-full transition-all duration-300 hover:scale-110 active:scale-90 shadow-lg border cursor-pointer hover:shadow-green-500/10 ${
                  isDark
                    ? 'bg-[#081827]/90 border border-green-500/30 text-green-400 hover:bg-green-400 hover:text-[#051A2F] hover:border-green-400'
                    : 'bg-white/90 border border-slate-200 text-slate-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600'
                }`}
                aria-label="Previous certificate"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); handleNextCert(); }}
                className={`hidden lg:flex absolute -right-16 top-1/2 -translate-y-1/2 z-50 p-3.5 rounded-full transition-all duration-300 hover:scale-110 active:scale-90 shadow-lg border cursor-pointer hover:shadow-green-500/10 ${
                  isDark
                    ? 'bg-[#081827]/90 border border-green-500/30 text-green-400 hover:bg-green-400 hover:text-[#051A2F] hover:border-green-400'
                    : 'bg-white/90 border border-slate-200 text-slate-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600'
                }`}
                aria-label="Next certificate"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <div className="p-4 sm:p-8 flex flex-col gap-6">
                
                {/* Visual Certificate Board Mockup with Slide Transition */}
                <div className="relative overflow-hidden w-full h-[510px] sm:h-[460px] md:h-[450px]">
                  <AnimatePresence mode="wait" initial={false} custom={direction}>
                    <motion.div
                      key={selectedCert.id}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className={`absolute inset-0 border-4 rounded-2xl p-4 sm:p-6 md:p-8 flex flex-col justify-between ${
                        isDark 
                          ? 'bg-[#04121e] border-green-500/20 text-gray-100' 
                          : 'bg-[#faf8f5] border-emerald-900/15 text-slate-800 shadow-inner'
                      }`}
                    >
                      {/* Corner decorative designs */}
                      <div className={`absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 ${isDark ? 'border-green-500/30' : 'border-emerald-800/30'}`} />
                      <div className={`absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 ${isDark ? 'border-green-500/30' : 'border-emerald-800/30'}`} />
                      <div className={`absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 ${isDark ? 'border-green-500/30' : 'border-emerald-800/30'}`} />
                      <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 ${isDark ? 'border-green-500/30' : 'border-emerald-800/30'}`} />

                      {/* Background Watermark/Grid */}
                      <div className="absolute inset-4 border border-dashed rounded-lg opacity-5 pointer-events-none" style={{ borderColor: isDark ? '#10b981' : '#065f46' }} />

                      {/* Header Section */}
                      <div className="text-center flex flex-col items-center gap-0.5 mb-2 sm:mb-4 shrink-0">
                        <span className={`text-[8px] sm:text-[9px] font-mono tracking-[0.25em] uppercase ${isDark ? 'text-green-400' : 'text-emerald-700 font-bold'}`}>
                          {isDark ? 'SECURE DIGITAL CREDENTIAL' : 'SISTEMA DE ACREDITACIÓN PROFESIONAL'}
                        </span>
                        <h4 className={`text-sm sm:text-lg md:text-xl font-serif tracking-wider uppercase font-black ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                          {language === 'es' ? 'Certificado de Finalización' : 'Certificate of Completion'}
                        </h4>
                        <div className={`w-16 h-[1.5px] mt-1 ${isDark ? 'bg-green-500/20' : 'bg-emerald-800/20'}`} />
                      </div>

                      {/* Recipient Statement */}
                      <div className="text-center mb-2 sm:mb-4 shrink-0">
                        <p className={`text-[9px] sm:text-[10px] md:text-xs italic ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                          {t('cert-modal-statement')}
                        </p>
                        
                        <div className="my-1.5 sm:my-3">
                          <h5 className={`text-lg sm:text-xl md:text-2xl font-serif py-0.5 tracking-wider ${
                            isDark 
                              ? 'text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-300 to-green-500 font-black' 
                              : 'text-emerald-950 font-black italic'
                          }`}>
                            Luis Fernando Coste Contreras
                          </h5>
                          <div className={`w-32 h-[1px] mx-auto mt-0.5 ${isDark ? 'bg-gradient-to-r from-transparent via-green-500/40 to-transparent' : 'bg-gradient-to-r from-transparent via-emerald-800/40 to-transparent'}`} />
                          <span className={`text-[8px] sm:text-[9px] uppercase tracking-widest font-mono ${isDark ? 'text-green-500/60' : 'text-emerald-600/70 font-semibold'}`}>
                            {t('cert-modal-recipient')}
                          </span>
                        </div>
                      </div>

                      {/* Course Details */}
                      <div className="text-center mb-3 sm:mb-4 max-w-xl mx-auto px-1 sm:px-2 flex-grow flex flex-col justify-center items-center">
                        <h6 className={`text-xs sm:text-sm md:text-base font-black tracking-wide leading-snug ${isDark ? 'text-white' : 'text-slate-800'}`}>
                          "{t(selectedCert.titleKey as any)}"
                        </h6>
                        {selectedCert.descKey ? (
                          <p className={`text-[9px] sm:text-[11px] md:text-xs mt-1 sm:mt-1.5 max-w-md mx-auto leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                            {t(selectedCert.descKey as any)}
                          </p>
                        ) : (
                          <div className="h-2 sm:h-3 mt-1" />
                        )}
                      </div>

                      {/* Footer with Badges, Seals, Signatures */}
                      <div className="grid grid-cols-3 gap-1 sm:gap-4 items-center pt-3 sm:pt-4 border-t border-dashed shrink-0" style={{ borderColor: isDark ? 'rgba(16,185,129,0.1)' : 'rgba(6,95,70,0.1)' }}>
                        {/* Left: Platform & Date */}
                        <div className="flex flex-col gap-1.5 text-left items-start">
                          <div>
                            <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-slate-400 block font-mono leading-none mb-0.5">{language === 'es' ? 'Plataforma' : 'Platform'}</span>
                            <span className={`text-[9px] sm:text-xs font-black uppercase tracking-tight block leading-tight ${isDark ? 'text-green-400' : 'text-emerald-800'}`}>
                              {t(selectedCert.platformKey as any)}
                            </span>
                          </div>
                          <div>
                            <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-slate-400 block font-mono leading-none mb-0.5">{t('cert-modal-date')}</span>
                            <span className={`text-[9px] sm:text-xs font-semibold block leading-tight ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                              {t(selectedCert.dateKey as any)}
                            </span>
                          </div>
                        </div>

                        {/* Center: Seal */}
                        <div className="flex justify-center">
                          {isDark ? (
                            /* Dark Mode Futuristic Seal */
                            <div className="relative flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 md:w-18 md:h-18">
                              <div className="absolute w-full h-full rounded-full border border-dashed border-green-500/20 animate-[spin_40s_linear_infinite]" />
                              <div className="absolute w-[85%] h-[85%] rounded-full border border-double border-emerald-500/40 animate-[spin_20s_linear_reverse_infinite]" />
                              <div className="absolute w-8 h-8 sm:w-11 sm:h-11 md:w-13 md:h-13 rounded-full bg-[#030d16] border border-green-500/30 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                <ShieldCheck className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-green-400 animate-pulse" />
                                <span className="text-[4px] sm:text-[6px] font-mono font-bold text-green-400 tracking-wider mt-0.5">SECURE</span>
                              </div>
                            </div>
                          ) : (
                            /* Light Mode Golden Seal */
                            <div className="relative flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 md:w-18 md:h-18">
                              <svg className="absolute w-full h-full text-amber-500/90 animate-[spin_120s_linear_infinite]" viewBox="0 0 100 100">
                                <path
                                  fill="currentColor"
                                  d="M50 0 L58 15 L74 8 L71 25 L87 23 L79 39 L93 43 L81 55 L91 67 L76 72 L80 88 L64 87 L61 100 L47 93 L38 100 L35 87 L19 88 L23 72 L8 67 L18 55 L6 43 L20 39 L12 23 L28 25 L25 8 L41 15 Z"
                                />
                              </svg>
                              <div className="absolute w-8 h-8 sm:w-11 sm:h-11 md:w-13 md:h-13 rounded-full bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-600 shadow-inner flex flex-col items-center justify-center border border-amber-200">
                                <ShieldCheck className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white drop-shadow" />
                                <span className="text-[4px] sm:text-[6px] font-bold text-amber-950 uppercase tracking-wider mt-0.5">VERIFIED</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Right: Signatures / Credentials */}
                        <div className="flex flex-col gap-1.5 text-right items-end">
                          <div>
                            <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-slate-400 block font-mono leading-none mb-0.5">{t('cert-modal-credential')}</span>
                            <span className={`text-[8px] sm:text-[10px] font-mono tracking-tighter block leading-tight ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                              LFCC-{selectedCert.id}
                            </span>
                          </div>
                          <div>
                            <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-slate-400 block font-mono leading-none mb-0.5">{language === 'es' ? 'Firma Digital' : 'Digital Signature'}</span>
                            <span className={`text-[9px] sm:text-xs font-serif italic font-bold tracking-tight block leading-tight ${isDark ? 'text-green-400/90' : 'text-emerald-800/90'}`}>
                              Luis F. Coste
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Mobile Navigation Controls */}
                <div className="flex lg:hidden items-center justify-between w-full pt-4 mt-2 border-t border-dashed" style={{ borderColor: isDark ? 'rgba(16,185,129,0.1)' : 'rgba(6,95,70,0.1)' }}>
                  <button
                    onClick={handlePrevCert}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 active:scale-95 border cursor-pointer ${
                      isDark 
                        ? 'bg-[#081827] border-green-500/20 text-green-400 hover:bg-green-500/10' 
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>{language === 'es' ? 'Anterior' : 'Previous'}</span>
                  </button>

                  <span className={`text-xs font-mono font-bold ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                    {displayIndex} / {totalCount}
                  </span>

                  <button
                    onClick={handleNextCert}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 active:scale-95 border cursor-pointer ${
                      isDark 
                        ? 'bg-[#081827] border-green-500/20 text-green-400 hover:bg-green-500/10' 
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{language === 'es' ? 'Siguiente' : 'Next'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Modal Actions */}
                <div id="certificate-modal-actions" className="flex flex-col sm:flex-row gap-3 sm:justify-end w-full">
                  <button
                    id="certificate-modal-close-action-btn"
                    onClick={() => setSelectedCert(null)}
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 shadow active:scale-95 cursor-pointer ${
                      isDark
                        ? 'bg-slate-800 text-gray-300 hover:bg-slate-700 hover:text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {t('cert-modal-close')}
                  </button>
                  <a
                    id="certificate-modal-open-link"
                    href={selectedCert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 shadow active:scale-95 cursor-pointer text-center ${
                      isDark
                        ? 'bg-green-400 text-[#051A2F] hover:bg-green-300 hover:shadow-green-500/20'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-emerald-500/20'
                    }`}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>
                      {selectedCert.url.endsWith('.pdf') 
                        ? t('cert-modal-open-pdf') 
                        : t('cert-modal-open-official')}
                    </span>
                  </a>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

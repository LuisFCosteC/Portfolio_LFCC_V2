import { useEffect, useState } from 'react';
import { Github, Linkedin, Mail, MessageSquare, MessageCircle, Terminal } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import { useTheme } from '../context/ThemeContext';
import { socialLinks } from '../data/social-links';

export default function Hero() {
  const { t, language } = useTranslation();
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  const isDark = theme === 'dark';

  useEffect(() => {
    // Small delay to trigger initial load animations
    const timer = setTimeout(() => setIsVisible(true), 150);
    return () => clearTimeout(timer);
  }, [language]); // Restart animations when language changes as requested

  // Helper to dynamically render Lucide icons without module namespace lookups
  const renderIcon = (iconName: string, className = "w-6 h-6") => {
    switch (iconName) {
      case 'Github':
        return <Github className={className} />;
      case 'Linkedin':
        return <Linkedin className={className} />;
      case 'Mail':
        return <Mail className={className} />;
      case 'MessageSquare':
        return <MessageSquare className={className} />;
      case 'MessageCircle':
        return <MessageCircle className={className} />;
      default:
        return <Terminal className={className} />;
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden bg-transparent"
    >
      {/* Decorative ambient blobs */}
      <div id="hero-ambient-blob-1" className="absolute -top-40 -right-40 w-96 h-96 bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div id="hero-ambient-blob-2" className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-400/5 rounded-full blur-[120px] pointer-events-none" />

      <div id="hero-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full mt-10 md:mt-14">
        <div className="crystal-panel rounded-[2.5rem] p-6 sm:p-12 relative overflow-hidden shadow-2xl">
          {/* Neon Glow element inside card */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#3FE03E]/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#3FE03E]/5 rounded-full blur-[100px] pointer-events-none" />

          <div id="hero-grid" className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center relative z-10">
            
            {/* Left Column (Text & Social) - taking 7 cols on desktop to align with col-span-7 */}
            <div
              id="hero-text-col"
              className={`md:col-span-7 flex flex-col gap-6 transition-all duration-1000 transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
            >
              <div id="hero-tag" className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold w-fit tracking-wider uppercase transition-all duration-500 ${
                isDark 
                  ? 'bg-green-500/10 border border-green-500/25 text-green-400' 
                  : 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-700'
              }`}>
                <span className={`w-2 h-2 rounded-full animate-pulse ${isDark ? 'bg-green-400' : 'bg-emerald-500'}`} />
                {t('hero-greeting')}
              </div>

              <h1 id="hero-main-heading" className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none transition-colors duration-500 ${isDark ? 'text-gray-100' : 'text-slate-900'}`}>
                {t('hero-name')}
              </h1>

              <h2 id="hero-sub-heading" className="text-2xl sm:text-3xl font-black text-gradient-green w-fit">
                {t('hero-title')}
              </h2>

              <p id="hero-paragraph" className={`text-sm sm:text-base leading-relaxed max-w-xl transition-colors duration-500 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                {t('hero-desc')}
              </p>

              {/* Social Icons */}
              <div id="hero-social-row" className="flex flex-row flex-nowrap items-center gap-2.5 sm:gap-4 mt-4 max-w-full justify-start">
                {socialLinks.map((link, idx) => (
                  <a
                    key={link.id}
                    id={`hero-social-${link.id}`}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2.5 sm:p-3 rounded-full card-glass transition-all duration-300 shadow-sm sm:shadow-md hover:-translate-y-1 flex-shrink-0 flex items-center justify-center ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-white hover:text-green-400 hover:border-green-400/60 hover:bg-green-400/10 hover:shadow-green-500/20'
                        : 'bg-white/80 border-slate-200/80 text-black hover:text-emerald-600 hover:border-emerald-400/80 hover:bg-emerald-50/60 hover:shadow-emerald-500/25'
                    }`}
                    aria-label={link.name}
                    style={{ transitionDelay: `${idx * 75}ms` }}
                  >
                    {renderIcon(link.icon, "w-5 h-5 sm:w-6 sm:h-6")}
                  </a>
                ))}
              </div>
            </div>

            {/* Right Column (Profile Image) - taking 5 cols on desktop */}
            <div
              id="hero-image-col"
              className={`md:col-span-5 flex justify-center transition-all duration-1000 delay-300 transform ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
              }`}
            >
              <div id="hero-avatar-wrapper" className="relative group">
                {/* Glowing Outer Frame Accent */}
                <div id="hero-avatar-glow" className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-green-500 to-green-400 opacity-20 group-hover:opacity-40 blur-xl transition duration-500" />
                
                <div id="hero-avatar-border" className={`relative p-2 rounded-[2rem] card-glass transition-all duration-500 overflow-hidden shadow-2xl ${
                  isDark ? 'bg-[#0c253a]/40 group-hover:border-green-400/50' : 'bg-white/60 group-hover:border-emerald-500/50'
                }`}>
                  <img
                    id="hero-profile-img"
                    src="/images/Imagen_1.png"
                    alt="Luis F. Coste C. Profile"
                    referrerPolicy="no-referrer"
                    className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 object-cover rounded-[1.75rem] transition-all duration-500 group-hover:scale-[1.02]"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

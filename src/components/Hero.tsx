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
      case 'Gmail':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-1.29 1.454-2.032 2.514-1.222L12 10.224l9.486-7.19c1.06-.81 2.514-.068 2.514 1.223z"/>
          </svg>
        );
      case 'MessageSquare':
        return <MessageSquare className={className} />;
      case 'MessageCircle':
        return <MessageCircle className={className} />;
      case 'Discord':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
          </svg>
        );
      case 'WhatsApp':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        );
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
      <div id="hero-ambient-blob-1" className={`absolute -top-40 -right-40 w-96 h-96 rounded-full blur-[120px] pointer-events-none ${isDark ? 'bg-green-500/10' : 'bg-blue-500/10'}`} />
      <div id="hero-ambient-blob-2" className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-[120px] pointer-events-none ${isDark ? 'bg-green-400/5' : 'bg-blue-400/5'}`} />

      <div id="hero-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full mt-10 md:mt-14">
        <div className="crystal-panel rounded-[2.5rem] p-6 sm:p-12 relative overflow-hidden shadow-2xl">
          {/* Neon Glow element inside card */}
          <div className={`absolute -top-24 -left-24 w-72 h-72 rounded-full blur-[100px] pointer-events-none ${isDark ? 'bg-[#3FE03E]/10' : 'bg-blue-500/10'}`} />
          <div className={`absolute -bottom-24 -right-24 w-72 h-72 rounded-full blur-[100px] pointer-events-none ${isDark ? 'bg-[#3FE03E]/5' : 'bg-blue-500/5'}`} />

          <div id="hero-grid" className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center relative z-10">
            
            {/* Left Column (Text & Social) - taking 7 cols on desktop to align with col-span-7 */}
            <div
              id="hero-text-col"
              className={`md:col-span-7 flex flex-col gap-6 transition-all duration-1000 transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
            >
              <div id="hero-tag" className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold w-fit tracking-wider uppercase transition-all duration-500 ${
                isDark 
                  ? 'bg-green-500/10 border border-green-500/25 text-green-400' 
                  : 'bg-blue-500/10 border border-blue-500/25 text-blue-700'
              }`}>
                <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${isDark ? 'bg-green-400' : 'bg-blue-600'}`} />
                {t('hero-greeting')}
              </div>

              <h1 id="hero-main-heading" className={`text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-none transition-colors duration-500 ${isDark ? 'text-gray-100' : 'text-slate-900'}`}>
                {t('hero-name')}
              </h1>

              <h2 id="hero-sub-heading" className="text-3xl sm:text-4xl font-black text-gradient-green w-fit">
                {t('hero-title')}
              </h2>

              <p id="hero-paragraph" className={`text-base sm:text-lg leading-relaxed max-w-xl transition-colors duration-500 ${isDark ? 'text-gray-100 font-medium' : 'text-slate-700'}`}>
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
                        : 'bg-white/80 border-slate-200/80 text-black hover:text-blue-600 hover:border-blue-400/80 hover:bg-blue-50/60 hover:shadow-blue-500/10'
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
                <div id="hero-avatar-glow" className={`absolute -inset-1 rounded-3xl opacity-20 group-hover:opacity-40 blur-xl transition duration-500 ${
                  isDark ? 'bg-gradient-to-r from-green-500 to-green-400' : 'bg-gradient-to-r from-blue-600 to-indigo-500'
                }`} />
                
                <div id="hero-avatar-border" className={`relative p-2 rounded-[2rem] card-glass transition-all duration-500 overflow-hidden shadow-2xl ${
                  isDark ? 'bg-[#0c253a]/40 group-hover:border-green-400/50' : 'bg-white/60 group-hover:border-blue-500/50'
                }`}>
                  <img
                    id="hero-profile-img"
                    src="/images/Imagen_1.png"
                    alt="Luis F. Coste C. Profile"
                    referrerPolicy="no-referrer"
                    className="w-72 h-72 sm:w-[22rem] sm:h-[22rem] md:w-[25rem] md:h-[25rem] lg:w-[29rem] lg:h-[29rem] object-cover rounded-[1.75rem] transition-all duration-500 group-hover:scale-[1.02]"
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
import { useTranslation } from '../i18n/useTranslation';
import { useTheme } from '../context/ThemeContext';
import { technologies } from '../data/technologies';
import { useRevealOnScroll } from '../hooks/use-reveal-on-scroll';

export default function Technologies() {
  const { t, language } = useTranslation();
  const { theme } = useTheme();
  const [sectionRef, isVisible] = useRevealOnScroll<HTMLDivElement>({ threshold: 0.1 });

  const isDark = theme === 'dark';

  const categories = [
    { id: 'frontend', titleKey: 'tech-frontend' as const },
    { id: 'backend', titleKey: 'tech-backend' as const },
    { id: 'extras', titleKey: 'tech-extras' as const },
  ];

  return (
    <div
      id="technologies-wrapper"
      key={`tech-${language}`}
      ref={sectionRef}
      className={`mt-16 p-8 rounded-3xl card-glass transition-all duration-500 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      <h3 id="tech-section-title" className="text-2xl font-black text-gradient-green mb-8 border-b border-green-500/10 pb-4 flex items-center gap-3">
        <span className={`w-1.5 h-6 rounded-full ${isDark ? 'bg-green-500' : 'bg-emerald-500'}`} />
        {t('tech-title')}
      </h3>

      <div id="tech-categories-grid" className="flex flex-col gap-10">
        {categories.map((cat, catIdx) => {
          const filteredTechs = technologies.filter((tech) => tech.category === cat.id);

          return (
            <div
              key={cat.id}
              id={`tech-category-${cat.id}`}
              className="flex flex-col gap-4"
            >
              <div id={`tech-cat-header-${cat.id}`} className="flex items-center gap-4">
                <h4 className={`text-sm font-black tracking-wider uppercase transition-colors duration-500 ${
                  isDark ? 'text-green-400' : 'text-emerald-700'
                }`}>
                  {t(cat.titleKey)}
                </h4>
                <div className={`flex-grow h-[1px] bg-gradient-to-r to-transparent ${
                  isDark ? 'from-green-500/30' : 'from-emerald-600/30'
                }`} />
              </div>

              {/* Technologies list container with responsive grid on mobile and flex on larger screens */}
              <div
                id={`tech-cards-list-${cat.id}`}
                className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-4 pb-2"
              >
                {filteredTechs.map((tech, idx) => (
                  <div
                    key={tech.name}
                    id={`tech-card-${tech.name.replace(/\s+/g, '-').toLowerCase()}`}
                    className={`flex items-center gap-2.5 sm:gap-3 px-4 py-3 sm:px-5 sm:py-3.5 rounded-xl card-glass transition-all duration-300 group cursor-default shadow-md hover:-translate-y-1 w-full sm:w-auto ${
                      isDark
                        ? 'hover:border-green-400/50 hover:bg-green-400/[0.05] hover:shadow-green-400/10'
                        : 'hover:border-emerald-500/50 hover:bg-emerald-500/[0.05] hover:shadow-emerald-500/10'
                    }`}
                    style={{ transitionDelay: `${(catIdx * 3 + idx) * 50}ms` }}
                  >
                    <img
                      src={tech.icon}
                      alt={`${tech.name} logo`}
                      className="w-6 h-6 sm:w-8 sm:h-8 transition-all duration-300 filter group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.3)] flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <span className={`text-xs sm:text-sm font-semibold transition-colors duration-300 leading-tight ${
                      isDark 
                        ? 'text-gray-200 group-hover:text-green-400' 
                        : 'text-slate-800 group-hover:text-emerald-600'
                    }`}>
                      {tech.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

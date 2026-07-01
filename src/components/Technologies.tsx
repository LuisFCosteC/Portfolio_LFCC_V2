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
      className={`mt-16 p-4 sm:p-8 rounded-3xl card-glass transition-all duration-500 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      <h3 id="tech-section-title" className={`text-3xl font-black text-gradient-green mb-8 pb-4 flex items-center gap-3 border-b ${
        isDark ? 'border-green-500/10' : 'border-blue-500/10'
      }`}>
        <span className={`w-1.5 h-7 rounded-full ${isDark ? 'bg-green-500' : 'bg-blue-600'}`} />
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
                <h4 className={`text-base font-black tracking-wider uppercase transition-colors duration-500 ${
                  isDark ? 'text-green-400' : 'text-blue-700'
                }`}>
                  {t(cat.titleKey)}
                </h4>
                <div className={`flex-grow h-[1px] bg-gradient-to-r to-transparent ${
                  isDark ? 'from-green-500/30' : 'from-blue-600/30'
                }`} />
              </div>

              {/* Technologies list container with responsive grid on mobile and flex on larger screens */}
              <div
                id={`tech-cards-list-${cat.id}`}
                className="grid grid-cols-2 gap-2 sm:gap-4 sm:flex sm:flex-wrap pb-2"
              >
                {filteredTechs.map((tech, idx) => (
                  <div
                    key={tech.name}
                    id={`tech-card-${tech.name.replace(/\s+/g, '-').toLowerCase()}`}
                    className={`flex items-center gap-2 sm:gap-3 px-2.5 py-2.5 sm:px-6 sm:py-4 rounded-xl card-glass transition-all duration-300 group cursor-default shadow-md hover:-translate-y-1 w-full sm:w-auto min-w-0 ${
                      isDark
                        ? 'hover:border-green-400/50 hover:bg-green-400/[0.05] hover:shadow-green-400/10'
                        : 'hover:border-blue-500/50 hover:bg-blue-500/[0.05] hover:shadow-blue-500/10'
                    }`}
                    style={{ transitionDelay: `${(catIdx * 3 + idx) * 50}ms` }}
                  >
                    <img
                      src={tech.icon}
                      alt={`${tech.name} logo`}
                      className="w-6 h-6 sm:w-9 sm:h-9 transition-all duration-300 filter group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(37,99,235,0.3)] flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <span className={`text-[11px] min-[360px]:text-xs sm:text-base font-bold transition-colors duration-300 leading-tight min-w-0 break-words ${
                      isDark 
                        ? 'text-gray-200 group-hover:text-green-400' 
                        : 'text-slate-800 group-hover:text-blue-600'
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
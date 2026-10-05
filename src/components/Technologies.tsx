import { useTranslation } from '../i18n/useTranslation';
import { useTheme } from '../context/ThemeContext';
import { technologies, Technology } from '../data/technologies';
import { useRevealOnScroll } from '../hooks/use-reveal-on-scroll';

export default function Technologies() {
  const { t, language } = useTranslation();
  const { theme } = useTheme();
  const [sectionRef, isVisible] = useRevealOnScroll<HTMLDivElement>({ threshold: 0.1 });

  const isDark = theme === 'dark';

  const categories = [
    { id: 'frontend', titleKey: 'tech-frontend' as const, reverse: false, speed: '34s' },
    { id: 'backend', titleKey: 'tech-backend' as const, reverse: true, speed: '32s' },
    { id: 'extras', titleKey: 'tech-extras' as const, reverse: false, speed: '36s' },
  ];

  const renderTechCard = (tech: Technology, isDark: boolean, isClone = false, keySuffix = 0) => {
    const cardId = isClone 
      ? undefined 
      : `tech-card-${tech.name.replace(/\s+/g, '-').toLowerCase()}`;

    return (
      <div
        key={`${tech.name}-${isClone ? 'clone' : 'orig'}-${keySuffix}`}
        id={cardId}
        className={`flex items-center gap-2 sm:gap-2.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl card-glass transition-all duration-300 group/card cursor-default shadow-md hover:-translate-y-1 shrink-0 w-auto select-none ${
          isDark
            ? 'hover:border-green-400/50 hover:bg-green-400/[0.05] hover:shadow-green-400/10'
            : 'hover:border-blue-500/50 hover:bg-blue-500/[0.05] hover:shadow-blue-500/10'
        }`}
        aria-hidden={isClone ? 'true' : undefined}
      >
        <img
          src={tech.icon}
          alt={`${tech.name} logo`}
          className="w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 filter group-hover/card:scale-110 group-hover/card:drop-shadow-[0_0_8px_rgba(37,99,235,0.3)] shrink-0"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <span
          className={`text-xs sm:text-sm font-bold transition-colors duration-300 leading-tight whitespace-nowrap ${
            isDark 
              ? 'text-gray-200 group-hover/card:text-green-400' 
              : 'text-slate-800 group-hover/card:text-blue-600'
          }`}
        >
          {tech.name}
        </span>
      </div>
    );
  };

  return (
    <div
      id="technologies-wrapper"
      key={`tech-${language}`}
      ref={sectionRef}
      className={`mt-16 scroll-mt-28 p-4 sm:p-6 rounded-3xl card-glass transition-all duration-500 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      <h3 id="tech-section-title" className={`text-2xl font-black text-gradient-green mb-5 pb-3 flex items-center gap-3 border-b ${
        isDark ? 'border-green-500/10' : 'border-blue-500/10'
      }`}>
        <span className={`w-1.5 h-7 rounded-full ${isDark ? 'bg-green-500' : 'bg-blue-600'}`} />
        {t('tech-title')}
      </h3>

      <div id="tech-categories-grid" className="flex flex-col gap-6">
        {categories.map((cat) => {
          const filteredTechs = technologies.filter((tech) => tech.category === cat.id);

          return (
            <div
              key={cat.id}
              id={`tech-category-${cat.id}`}
              className="flex flex-col gap-3"
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

              {/* Technologies continuous carousel in 1 single infinite marquee row */}
              <div
                id={`tech-cards-list-${cat.id}`}
                className="relative w-full overflow-hidden tech-marquee-mask py-1.5 group"
              >
                {/* Edge fade gradients for smooth visual transition */}
                <div className={`pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 z-10 transition-colors duration-500 bg-gradient-to-r ${
                  isDark ? 'from-[#05131f]/90 to-transparent' : 'from-slate-50/90 to-transparent'
                }`} />
                <div className={`pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 z-10 transition-colors duration-500 bg-gradient-to-l ${
                  isDark ? 'from-[#05131f]/90 to-transparent' : 'from-slate-50/90 to-transparent'
                }`} />

                {/* Marquee Track moving infinitely in 1 single line with pause on hover */}
                <div
                  className={`flex gap-2.5 sm:gap-3 w-max group-hover:[animation-play-state:paused] ${
                    cat.reverse ? 'animate-marquee-scroll-reverse' : 'animate-marquee-scroll'
                  }`}
                  style={{ animationDuration: cat.speed }}
                >
                  {/* Set 1: Original items */}
                  <div className="flex gap-2.5 sm:gap-3 shrink-0">
                    {filteredTechs.map((tech, idx) => renderTechCard(tech, isDark, false, idx))}
                  </div>

                  {/* Set 2: Duplicate for seamless loop */}
                  <div className="flex gap-2.5 sm:gap-3 shrink-0" aria-hidden="true">
                    {filteredTechs.map((tech, idx) => renderTechCard(tech, isDark, true, idx + 100))}
                  </div>

                  {/* Set 3: Duplicate for ultra-wide screen coverage */}
                  <div className="flex gap-2.5 sm:gap-3 shrink-0" aria-hidden="true">
                    {filteredTechs.map((tech, idx) => renderTechCard(tech, isDark, true, idx + 200))}
                  </div>

                  {/* Set 4: Duplicate ensuring seamless -50% reset */}
                  <div className="flex gap-2.5 sm:gap-3 shrink-0" aria-hidden="true">
                    {filteredTechs.map((tech, idx) => renderTechCard(tech, isDark, true, idx + 300))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
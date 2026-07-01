import { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import { useTheme } from '../context/ThemeContext';
import Technologies from './Technologies';
import { useRevealOnScroll } from '../hooks/use-reveal-on-scroll';

export default function AboutMe() {
  const { t, language } = useTranslation();
  const { theme } = useTheme();
  const [sectionRef, isVisible] = useRevealOnScroll<HTMLElement>({ threshold: 0.15 });

  const isDark = theme === 'dark';

  // Carousel State
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  const carouselImages = [
    { src: '/images/Imagen_Carrusel_1.jpeg', alt: 'Workspace Setup' },
    { src: '/images/Imagen_Carrusel_2.jpeg', alt: 'System Architecture' },
    { src: '/images/Imagen_Carrusel_3.jpeg', alt: 'Agile Board' },
    { src: '/images/Imagen_Carrusel_4.jpeg', alt: 'Clean Coding Code' },
  ];

  // Carousel functions
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Autoplay functionality with hover pause
  useEffect(() => {
    if (!emblaApi || isHovered) return;

    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000); // 4 seconds interval

    return () => clearInterval(autoplay);
  }, [emblaApi, isHovered]);

  return (
    <section
      id="about"
      key={`about-${language}`}
      ref={sectionRef}
      className="py-24 bg-transparent"
    >
      <div id="about-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div
          id="about-header"
          className={`flex flex-col gap-2 mb-16 text-center transition-all duration-1000 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <span className={`font-bold tracking-widest text-sm uppercase flex items-center justify-center gap-1.5 transition-colors duration-500 ${isDark ? 'text-green-400' : 'text-blue-600'}`}>
            <User className="w-4 h-4" />
            {t('nav-about')}
          </span>
          <h2 id="about-title" className="text-4xl sm:text-6xl font-black text-gradient-green py-1">
            {t('about-title')}
          </h2>
          <div className={`w-20 h-1 rounded-full mx-auto mt-2 ${isDark ? 'bg-gradient-to-r from-green-500 to-green-400' : 'bg-gradient-to-r from-blue-600 to-indigo-500'}`} />
        </div>

        {/* Two-Column Grid */}
        <div id="about-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Carousel */}
          <div
            id="about-carousel-col"
            className={`lg:col-span-5 transition-all duration-1000 delay-200 transform ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div id="about-carousel-outer" className="relative group rounded-3xl overflow-hidden shadow-2xl card-glass">
              {/* Embla Viewport */}
              <div id="embla-viewport" ref={emblaRef} className="overflow-hidden cursor-grab active:cursor-grabbing">
                <div id="embla-container" className="flex">
                  {carouselImages.map((image, index) => (
                    <div key={index} id={`embla-slide-${index}`} className="flex-[0_0_100%] min-w-0 relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3]">
                      <img
                        src={image.src}
                        alt={image.alt}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      {/* Ambient overlay vignette */}
                      <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent pointer-events-none transition-all duration-500 ${
                        isDark ? 'from-[#051A2F]/80' : 'from-slate-900/60'
                      }`} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                id="carousel-btn-prev"
                onClick={scrollPrev}
                className={`absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg cursor-pointer ${
                  isDark 
                    ? 'bg-[#051A2F]/80 border border-green-500/20 text-green-400 hover:bg-green-500 hover:text-[#051A2F]' 
                    : 'bg-white/85 border border-blue-500/20 text-blue-600 hover:bg-blue-600 hover:text-white'
                }`}
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                id="carousel-btn-next"
                onClick={scrollNext}
                className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg cursor-pointer ${
                  isDark 
                    ? 'bg-[#051A2F]/80 border border-green-500/20 text-green-400 hover:bg-green-500 hover:text-[#051A2F]' 
                    : 'bg-white/85 border border-blue-500/20 text-blue-600 hover:bg-blue-600 hover:text-white'
                }`}
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Dot Indicators */}
              <div id="carousel-dots-wrapper" className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {scrollSnaps.map((_, index) => (
                  <button
                    key={index}
                    id={`carousel-dot-${index}`}
                    onClick={() => scrollTo(index)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      index === selectedIndex 
                        ? (isDark ? 'w-6 bg-green-400' : 'w-6 bg-blue-600') 
                        : (isDark ? 'w-2 bg-gray-500/60 hover:bg-gray-400' : 'w-2 bg-slate-300 hover:bg-slate-400')
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Narrative Biography */}
          <div
            id="about-narrative-col"
            className={`lg:col-span-7 flex flex-col gap-6 transition-all duration-1000 delay-300 transform ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            <h3 id="about-narrative-subtitle" className="text-3xl font-black text-gradient-green italic tracking-tight">
              {t('about-subtitle')}
            </h3>
            
            <p id="about-narrative-p1" className={`text-lg leading-relaxed transition-colors duration-500 ${isDark ? 'text-gray-100' : 'text-slate-700'}`}>
              {t('about-text-1')}
            </p>

            <p id="about-narrative-p2" className={`text-lg leading-relaxed transition-colors duration-500 ${isDark ? 'text-gray-100' : 'text-slate-700'}`}>
              {t('about-text-2')}
            </p>
          </div>

        </div>

        {/* Technologies Nested Sub-component */}
        <Technologies />

      </div>
    </section>
  );
}
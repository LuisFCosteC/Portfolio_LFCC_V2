import { useState, useEffect, useLayoutEffect, useRef, MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { 
  Github, 
  ExternalLink, 
  Code, 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  ChevronLeft, 
  ChevronRight, 
  Terminal, 
  CheckCircle2, 
  PlayCircle,
  LayoutGrid,
  Layers,
  Sparkles
} from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import { useTheme } from '../context/ThemeContext';
import { projects, Project } from '../data/projects';
import { useRevealOnScroll } from '../hooks/use-reveal-on-scroll';
import { motion, AnimatePresence } from 'motion/react';

const techIconMap: { [key: string]: { name: string; url: string } } = {
  angular: { name: 'Angular', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg' },
  dotnetcore: { name: '.NET Core', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dotnetcore/dotnetcore-original.svg' },
  sqlserver: { name: 'SQL Server', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-original.svg' },
  react: { name: 'React', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  nodejs: { name: 'Node.js', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
  postgresql: { name: 'PostgreSQL', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
  firebase: { name: 'Firebase', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-original.svg' },
  tailwindcss: { name: 'Tailwind CSS', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg' },
  typescript: { name: 'TypeScript', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
  git: { name: 'Git', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
  mysql: { name: 'MySQL', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
  bootstrap: { name: 'Bootstrap', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg' },
  fastapi: { name: 'FastAPI', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg' },
  python: { name: 'Python', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  csharp: { name: 'C#', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg' },
  javascript: { name: 'JavaScript', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  html: { name: 'HTML5', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
  css: { name: 'CSS3', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
  axios: { name: 'Axios', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/axios/axios-plain.svg' },
  sweetalert2: { name: 'SweetAlert2', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="%23f8bb86" stroke-width="2"/><path d="M12 7v6M12 16h.01" stroke="%23f8bb86" stroke-width="2" stroke-linecap="round"/></svg>' },
  nextjs: { name: 'Next.js', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
  socketio: { name: 'Socket.io', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg' },
  sqlite: { name: 'SQLite', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg' },
  shadcn: { name: 'Shadcn UI', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>' },
  genkit: { name: 'Genkit', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FF6F00"><path d="M12 2L2 22h20L12 2z"/></svg>' },
  gemini: {
    name: 'Gemini AI',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><linearGradient id="gemini-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%234285F4" /><stop offset="50%" stop-color="%239B51E0" /><stop offset="100%" stop-color="%23EA4335" /></linearGradient></defs><path d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81" fill="url(%23gemini-grad)"/></svg>'
  },
  vite: {
    name: 'Vite',
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg'
  },
  lucide: {
    name: 'Lucide',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23f43f5e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 2 18 2 18 6 6 6 6 2"/><polygon points="3 6 21 6 21 10 3 10 3 6"/><polygon points="6 10 18 10 18 14 6 14 6 10"/><polygon points="3 14 21 14 21 18 3 18 3 14"/><polygon points="6 18 18 18 18 22 6 22 6 18"/></svg>'
  },
};

const AUTO_PLAY_MS = 15000; // 15 seconds
// Height covered by the fixed navbar: content under it does not count as visible
const NAV_OFFSET = 120;

export default function Projects() {
  const { t, language } = useTranslation();
  const { theme } = useTheme();
  const [containerRef, isVisible] = useRevealOnScroll<HTMLElement>({ threshold: 0.1 });

  // View Mode: 'carousel' or 'grid'
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [carouselDirection, setCarouselDirection] = useState(1);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);

  // Modal details state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [direction, setDirection] = useState<number>(0);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  const isDark = theme === 'dark';

  // 15-Second Autoplay Timer for Carousel
  useEffect(() => {
    if (viewMode !== 'carousel' || isCarouselHovered || selectedProject !== null) {
      return;
    }

    const timer = setInterval(() => {
      setCarouselDirection(1);
      setCarouselIndex((curr) => (curr + 1) % projects.length);
    }, AUTO_PLAY_MS);

    return () => clearInterval(timer);
  }, [viewMode, isCarouselHovered, selectedProject, projects.length]);

  // Disable body scroll when project modal is open
  useEffect(() => {
    const hasActiveModal = !!selectedProject;
    if (hasActiveModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProject]);

  // Video controller sync when modal project changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
      setProgress(0);
    }
  }, [selectedProject]);

  // Track whether the section is on screen so arrow keys only drive the carousel there.
  // When the section leaves the viewport entirely, the grid collapses back to the carousel.
  const isSectionInViewRef = useRef(false);
  const viewModeRef = useRef(viewMode);
  viewModeRef.current = viewMode;
  const scrollAnchorRef = useRef<{ el: Element; top: number } | null>(null);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      isSectionInViewRef.current = entry.isIntersecting;
      if (!entry.isIntersecting) {
        // Si la seccion queda arriba del viewport, al encogerse moveria todo el
        // contenido siguiente: se guarda un ancla para compensar el scroll.
        const next = el.nextElementSibling;
        if (next && viewModeRef.current === 'grid' && entry.boundingClientRect.bottom < NAV_OFFSET) {
          scrollAnchorRef.current = { el: next, top: next.getBoundingClientRect().top };
        }
        setViewMode('carousel');
      }
    }, { threshold: 0, rootMargin: `-${NAV_OFFSET}px 0px 0px 0px` });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Keep the section the user is reading in place after the grid collapses
  useLayoutEffect(() => {
    const anchor = scrollAnchorRef.current;
    if (!anchor || viewMode !== 'carousel') return;
    scrollAnchorRef.current = null;
    const delta = anchor.el.getBoundingClientRect().top - anchor.top;
    if (Math.abs(delta) > 1) {
      window.scrollBy({ top: delta, behavior: 'instant' });
    }
  }, [viewMode]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // No interceptar las flechas mientras el usuario escribe (p. ej. en el chat).
      const target = e.target as HTMLElement | null;
      if (target && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))) {
        return;
      }
      if (selectedProject) {
        if (e.key === 'Escape') {
          if (isMaximized) {
            setIsMaximized(false);
          } else {
            setSelectedProject(null);
          }
        } else if (e.key === 'ArrowLeft' && !isMaximized) {
          handlePrevProject();
        } else if (e.key === 'ArrowRight' && !isMaximized) {
          handleNextProject();
        }
      } else if (viewMode === 'carousel' && isSectionInViewRef.current) {
        if (e.key === 'ArrowLeft') {
          handleCarouselPrev();
        } else if (e.key === 'ArrowRight') {
          handleCarouselNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, isMaximized, viewMode, carouselIndex]);

  // Modal navigation
  const handleSelectProject = (project: Project) => {
    setDirection(0);
    setSelectedProject(project);
  };

  const handlePrevProject = () => {
    setDirection(-1);
    setSelectedProject((prev) => {
      if (!prev) return null;
      const currentIndex = projects.findIndex((p) => p.id === prev.id);
      const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
      return projects[prevIndex];
    });
  };

  const handleNextProject = () => {
    setDirection(1);
    setSelectedProject((prev) => {
      if (!prev) return null;
      const currentIndex = projects.findIndex((p) => p.id === prev.id);
      const nextIndex = (currentIndex + 1) % projects.length;
      return projects[nextIndex];
    });
  };

  // Carousel navigation
  const handleCarouselNext = () => {
    setCarouselDirection(1);
    setCarouselIndex((prev) => (prev + 1) % projects.length);
  };

  const handleCarouselPrev = () => {
    setCarouselDirection(-1);
    setCarouselIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  // Video controls in modal
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration;
    if (duration > 0) {
      setProgress((current / duration) * 100);
    }
  };

  const handleProgressBarClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newPercentage = clickX / width;
    const duration = videoRef.current.duration;
    if (duration > 0) {
      videoRef.current.currentTime = newPercentage * duration;
      setProgress(newPercentage * 100);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Render individual project card (reused by both Carousel and Grid views)
  const renderProjectCard = (project: Project, idx: number, inCarousel: boolean = false) => {
    const hasDemo = project.demo !== null;

    if (project.isEmpty) {
      return (
        <div
          key={project.id}
          id={`project-card-empty-${project.id}`}
          onClick={() => handleSelectProject(project)}
          className={`flex flex-col justify-between p-8 rounded-3xl border-2 border-dashed transition-all duration-500 min-h-[440px] text-center relative group transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer ${
            isDark
              ? 'border-green-500/20 bg-[#05131f]/30 hover:border-green-400/50 hover:bg-[#05131f]/50 hover:shadow-green-400/5 text-gray-200'
              : 'border-slate-300 bg-slate-50/50 hover:border-blue-500/50 hover:bg-slate-50 hover:shadow-blue-500/5 text-slate-700'
          } ${!inCarousel && (isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12')}`}
          style={!inCarousel ? { transitionDelay: `${idx * 150}ms` } : undefined}
        >
          <div className="flex flex-col items-center justify-center flex-grow gap-5 my-auto">
            <div className={`p-4 rounded-2xl transition-all duration-500 ${
              isDark ? 'bg-green-500/5 text-green-400 group-hover:bg-green-500/10' : 'bg-blue-50 text-blue-600'
            }`}>
              <Code className="w-9 h-9 animate-pulse" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gradient-green mb-2 tracking-wide uppercase">
                {t(project.titleKey as any)}
              </h3>
              <p className={`text-base max-w-xs leading-relaxed transition-colors duration-500 ${
                isDark ? 'text-gray-300' : 'text-slate-600'
              }`}>
                {t(project.descKey as any)}
              </p>
            </div>
          </div>
          
          <div className="flex justify-center mt-auto pt-4">
            <div className={`px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase border transition-all duration-500 ${
              isDark 
                ? 'bg-[#05131f] border-green-500/15 text-green-400 group-hover:border-green-400/30' 
                : 'bg-white border-blue-100 text-blue-600 group-hover:border-blue-500/30'
            }`}>
              {language === 'es' ? 'En Desarrollo' : 'In Development'}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        key={project.id}
        id={`project-card-${project.id}`}
        className={`rounded-3xl card-glass transition-all duration-500 overflow-hidden group transform hover:-translate-y-2 hover:shadow-2xl ${
          inCarousel
            ? 'flex flex-col md:flex-row w-full max-w-xl md:max-w-4xl lg:max-w-5xl shadow-2xl border border-green-500/20'
            : 'flex flex-col'
        } ${
          isDark
            ? 'hover:border-green-400/60 hover:shadow-green-400/15'
            : 'hover:border-blue-500/40 hover:shadow-blue-500/10'
        } ${!inCarousel ? (isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12') : ''}`}
        style={!inCarousel ? { transitionDelay: `${idx * 150}ms` } : undefined}
      >
        {/* Visual Preview Frame (Left Column in Carousel Mode) */}
        <div 
          id={`project-img-frame-${project.id}`} 
          onClick={() => handleSelectProject(project)}
          className={`relative overflow-hidden cursor-pointer flex flex-col group/frame ${
            inCarousel 
              ? 'w-full md:w-1/2 lg:w-[48%] shrink-0 border-b md:border-b-0 md:border-r aspect-[16/10] md:aspect-auto md:min-h-full' 
              : 'aspect-[16/10] border-b'
          } ${
            isDark ? 'bg-[#05131f] border-green-500/15' : 'bg-slate-100 border-slate-200'
          }`}
        >
          {/* Browser Header Mockup */}
          <div className={`flex items-center justify-between px-4 py-2.5 border-b shrink-0 select-none ${
            isDark ? 'bg-[#020b12] border-green-500/10' : 'bg-slate-50 border-slate-200'
          }`}>
            {/* Window Control Buttons */}
            <div className="flex gap-1.5 items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/90 shadow-[0_0_4px_rgba(239,68,68,0.3)]" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/90 shadow-[0_0_4px_rgba(234,179,8,0.3)]" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/90 shadow-[0_0_4px_rgba(34,197,94,0.3)]" />
            </div>
            {/* Mock URL / Domain Bar */}
            <div className={`text-xs font-mono px-3.5 py-0.5 rounded-lg truncate max-w-[150px] sm:max-w-[200px] text-center transition-colors duration-500 ${
              isDark ? 'bg-[#041624] text-green-400/70 border border-green-500/5' : 'bg-slate-200/50 text-slate-500 border border-slate-300/20'
            }`}>
              {project.id === 8
                ? 'akinoai.com'
                : project.id === 7
                ? 'www.2code.com.co'
                : project.id === 6 
                ? 'www.ecokraf.com.co' 
                : project.id === 5
                ? 'ventas-corp.local'
                : project.id === 4
                ? 'ws-chat-calc.local'
                : project.id === 3
                ? 'pokedex-api.dev'
                : project.id === 2
                ? 'med-dashboard.local'
                : 'rick-and-morty-api-with-react.vercel.app'}
            </div>
            {/* Balanced spacing */}
            <div className="w-12 text-right">
              {inCarousel && (
                <span className="text-[10px] font-mono text-slate-500">
                  {idx + 1}/{projects.length}
                </span>
              )}
            </div>
          </div>

          {/* Screenshot Container */}
          <div className={`relative flex-grow overflow-hidden w-full h-full bg-[#05131f] ${inCarousel ? 'min-h-[220px] sm:min-h-[260px] md:min-h-[300px]' : ''}`}>
            <img
              src={project.image}
              alt={t(project.titleKey as any)}
              width={600}
              height={375}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top transition-all duration-700 group-hover:scale-105"
            />
            {/* Hover visual overlay with instructions */}
            <div className="absolute inset-0 bg-[#051a2f]/85 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 p-4 text-center">
              <div className={`p-3 rounded-full shadow-lg mb-2 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ${
                isDark ? 'bg-green-500 text-slate-950 shadow-green-500/20' : 'bg-blue-600 text-white shadow-blue-500/20'
              }`}>
                <PlayCircle className="w-7 h-7 fill-current animate-pulse" />
              </div>
              <span className="text-white text-xs font-mono font-bold tracking-wider uppercase">
                {t('proj-view-preview')}
              </span>
              <span className={`text-[11px] font-mono mt-1 opacity-80 ${isDark ? 'text-green-400' : 'text-blue-300'}`}>
                {language === 'es' ? 'Especificaciones & Video' : 'Specs & Video'}
              </span>
            </div>
          </div>
        </div>

        {/* Card Content (Right Column in Carousel Mode) */}
        <div 
          id={`project-content-${project.id}`} 
          className={`flex flex-col flex-grow justify-between ${
            inCarousel 
              ? 'p-6 sm:p-7 gap-4 md:w-1/2 lg:w-[52%]' 
              : 'p-7 gap-5'
          }`}
        >
          
          {/* Upper Text */}
          <div className="flex flex-col gap-2.5">
            <h3 
              id={`project-title-${project.id}`} 
              onClick={() => handleSelectProject(project)}
              className={`font-black text-gradient-green w-fit cursor-pointer hover:underline ${
                inCarousel ? 'text-2xl sm:text-3xl' : 'text-2xl'
              }`}
            >
              {t(project.titleKey as any)}
            </h3>
            <p id={`project-desc-${project.id}`} className={`text-base leading-relaxed transition-colors duration-500 ${
              inCarousel ? 'line-clamp-4 md:line-clamp-5 text-sm sm:text-base' : 'line-clamp-4'
            } ${
              isDark ? 'text-gray-300' : 'text-slate-600'
            }`}>
              {t(project.descKey as any)}
            </p>
          </div>

          {/* Tech stack row */}
          <div id={`project-techs-${project.id}`} className="flex flex-wrap items-center gap-2 py-2">
            {project.techs.map((techKey) => {
              const iconData = techIconMap[techKey];
              if (!iconData) return null;
              return (
                <div
                  key={techKey}
                  id={`project-${project.id}-tech-${techKey}`}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-500 border ${
                    isDark
                      ? 'bg-[#05131f]/60 border-green-500/20 hover:border-green-400/40 text-gray-200'
                      : 'bg-slate-100/85 border-blue-500/10 hover:border-blue-500/30 text-slate-700'
                  }`}
                  title={iconData.name}
                >
                  <img
                    src={iconData.url}
                    alt={iconData.name}
                    width={16}
                    height={16}
                    loading="lazy"
                    className="w-4 h-4"
                    referrerPolicy="no-referrer"
                  />
                  <span className={`font-bold text-xs uppercase tracking-wider ${
                    isDark ? 'text-green-400' : 'text-blue-700'
                  }`}>{iconData.name}</span>
                </div>
              );
            })}
          </div>

          {/* Actions Row */}
          <div id={`project-actions-${project.id}`} className={`flex items-center gap-3 border-t pt-4 mt-2 ${
            isDark ? 'border-green-500/5' : 'border-slate-200/60'
          }`}>
            
            {/* GitHub Code Link */}
            {project.github ? (
              <a
                id={`project-code-btn-${project.id}`}
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t('projects-code')}: ${t(project.titleKey as any)}`}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-bold transition-all duration-300 shadow-sm ${
                  isDark
                    ? 'border-green-500/20 text-green-400 hover:bg-green-500/10 hover:border-green-400'
                    : 'border-blue-600/20 text-blue-700 hover:bg-blue-50 hover:border-blue-600'
                }`}
              >
                <Github className="w-4 h-4" />
                <span>{t('projects-code')}</span>
              </a>
            ) : (
              <button
                id={`project-code-btn-disabled-${project.id}`}
                disabled
                aria-label={`${t('projects-code')}: ${t(project.titleKey as any)}`}
                className={`flex-grow flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-bold cursor-not-allowed opacity-40 ${
                  isDark
                    ? 'border-green-500/10 bg-[#0c253a] text-gray-300 font-bold'
                    : 'border-slate-200 bg-slate-50 text-slate-400'
                }`}
              >
                <Github className="w-4 h-4" />
                <span>{t('projects-code')}</span>
              </button>
            )}

            {/* Live Demo Link */}
            {hasDemo ? (
              <a
                id={`project-demo-btn-${project.id}`}
                href={project.demo!}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t('projects-demo')}: ${t(project.titleKey as any)}`}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold hover:brightness-110 active:scale-95 transition-all duration-300 shadow-md ${
                  isDark
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-[#051A2F] shadow-green-500/10 hover:shadow-green-500/20'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-600/10 hover:shadow-blue-600/20'
                }`}
              >
                <ExternalLink className="w-4 h-4" />
                <span>{t('projects-demo')}</span>
              </a>
            ) : (
              <button
                id={`project-demo-btn-disabled-${project.id}`}
                disabled
                className={`flex-grow flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold cursor-not-allowed opacity-40 ${
                  isDark
                    ? 'bg-[#0c253a] border border-green-500/10 text-gray-300 font-bold'
                    : 'bg-slate-100 border border-slate-200 text-slate-400'
                }`}
              >
                <ExternalLink className="w-4 h-4" />
                <span>{t('projects-demo')}</span>
              </button>
            )}

          </div>

        </div>
      </div>
    );
  };

  return (
    <section
      id="projects"
      ref={containerRef}
      className="py-10 bg-transparent"
    >
      <div id="projects-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div
          id="projects-header"
          className={`flex flex-col gap-2 mb-6 text-center transition-all duration-1000 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <span className={`font-bold tracking-widest text-sm uppercase flex items-center justify-center gap-1.5 transition-colors duration-500 ${
            isDark ? 'text-green-400' : 'text-blue-600'
          }`}>
            <Code className="w-4 h-4" />
            {t('nav-projects')}
          </span>
          <h2 id="projects-title-h2" className="text-4xl sm:text-5xl font-black text-gradient-green py-1">
            {t('projects-title')}
          </h2>
          <div className={`w-20 h-1 rounded-full mx-auto mt-2 ${
            isDark ? 'bg-gradient-to-r from-green-500 to-green-400' : 'bg-gradient-to-r from-blue-600 to-indigo-500'
          }`} />
        </div>

        {/* View Switcher and Stats Toolbar */}
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-2.5 mb-5 rounded-2xl border backdrop-blur-md transition-all duration-500 ${
          isDark 
            ? 'bg-[#041624]/60 border-green-500/20 shadow-lg shadow-black/20' 
            : 'bg-white/70 border-slate-200 shadow-md shadow-slate-200/50'
        }`}>
          
          {/* Left: View Mode Segmented Switcher */}
          <div className={`flex items-center gap-1 p-1 rounded-xl border ${
            isDark ? 'bg-[#020b12] border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setViewMode('carousel')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer ${
                viewMode === 'carousel'
                  ? isDark
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-slate-950 shadow-md shadow-green-500/20'
                    : 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title={language === 'es' ? 'Ver en formato carrusel' : 'Carousel view'}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{t('projects-carousel-btn')}</span>
            </button>

            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer ${
                viewMode === 'grid'
                  ? isDark
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-slate-950 shadow-md shadow-green-500/20'
                    : 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title={language === 'es' ? 'Ver todas las tarjetas en cuadrícula' : 'View all cards in a grid'}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{t('projects-grid-btn')}</span>
            </button>
          </div>

          {/* Right: Total Projects Badge ("8 proyectos en total") */}
          <div className="flex items-center gap-2.5">
            <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all duration-300 ${
              isDark 
                ? 'bg-green-500/10 border-green-500/30 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.15)]' 
                : 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm'
            }`}>
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>{language === 'es' ? `${projects.length} proyectos en total` : `${projects.length} projects in total`}</span>
            </div>
          </div>

        </div>

        {/* MAIN DISPLAY: CAROUSEL MODE */}
        {viewMode === 'carousel' && (
          <div className="relative flex flex-col items-center">
            
            {/* Carousel Viewport with Floating Navigation Arrows */}
            <div className="relative w-full flex items-center justify-center min-h-[520px] md:min-h-[460px]">
              
              {/* Previous Slide Button */}
              <button
                onClick={handleCarouselPrev}
                aria-label={language === 'es' ? 'Proyecto anterior' : 'Previous project'}
                className={`absolute left-0 sm:left-2 lg:-left-6 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center border shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer ${
                  isDark
                    ? 'bg-[#030d16]/90 border-green-500/30 text-green-400 hover:bg-[#05131f] hover:border-green-400 shadow-green-500/10'
                    : 'bg-white/90 border-slate-300 text-blue-600 hover:bg-white hover:border-blue-500 shadow-blue-500/10'
                }`}
                title={language === 'es' ? 'Ver proyecto anterior' : 'View previous project'}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Animated Card Container with Hover-Pause */}
              <div
                className="w-full flex justify-center px-4 sm:px-14 lg:px-16"
                onMouseEnter={() => setIsCarouselHovered(true)}
                onMouseLeave={() => setIsCarouselHovered(false)}
              >
                <AnimatePresence mode="wait" custom={carouselDirection}>
                  <motion.div
                    key={projects[carouselIndex].id}
                    custom={carouselDirection}
                    variants={{
                      enter: (dir: number) => ({
                        x: dir > 0 ? 80 : -80,
                        opacity: 0,
                        scale: 0.96,
                      }),
                      center: {
                        x: 0,
                        opacity: 1,
                        scale: 1,
                      },
                      exit: (dir: number) => ({
                        x: dir > 0 ? -80 : 80,
                        opacity: 0,
                        scale: 0.96,
                      }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full flex justify-center"
                  >
                    {renderProjectCard(projects[carouselIndex], carouselIndex, true)}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Next Slide Button */}
              <button
                onClick={handleCarouselNext}
                aria-label={language === 'es' ? 'Siguiente proyecto' : 'Next project'}
                className={`absolute right-0 sm:right-2 lg:-right-6 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center border shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer ${
                  isDark
                    ? 'bg-[#030d16]/90 border-green-500/30 text-green-400 hover:bg-[#05131f] hover:border-green-400 shadow-green-500/10'
                    : 'bg-white/90 border-slate-300 text-blue-600 hover:bg-white hover:border-blue-500 shadow-blue-500/10'
                }`}
                title={language === 'es' ? 'Ver siguiente proyecto' : 'View next project'}
              >
                <ChevronRight className="w-6 h-6" />
              </button>

            </div>

          </div>
        )}

        {/* MAIN DISPLAY: GRID MODE (ALL 8 PROJECTS) */}
        {viewMode === 'grid' && (
          <div
            id="projects-grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {projects.map((project, idx) => renderProjectCard(project, idx, false))}
          </div>
        )}

      </div>

      {/* Project Preview Modal: se monta en document.body porque <main> (relative z-10)
          crea un contexto de apilamiento que dejaba el modal detras del navbar (z-40). */}
      {createPortal(<>
      <AnimatePresence>
        {selectedProject && (
          <div
            id="project-modal-overlay"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-4 bg-slate-950/80 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              id="project-modal-card"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-5xl lg:max-w-7xl lg:w-[94vw] h-[82vh] sm:h-[85vh] lg:h-[96vh] lg:max-h-[980px] lg:min-h-[640px] rounded-3xl overflow-hidden border shadow-2xl transition-all duration-300 ${
                isDark 
                  ? 'bg-[#030d16] border-green-500/25 text-gray-100 shadow-slate-950/40' 
                  : 'bg-white border-slate-200 text-slate-800 shadow-blue-100/40'
              }`}
            >
              {/* Header Controls (Close button) */}
              <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
                <button
                  id="project-modal-close-btn"
                  onClick={() => setSelectedProject(null)}
                  className={`p-2.5 rounded-full border transition-all cursor-pointer ${
                    isDark
                      ? 'bg-black/60 border-slate-800 text-gray-400 hover:text-white hover:bg-black/90'
                      : 'bg-white/80 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-white'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Body */}
              <div className="flex flex-col lg:flex-row h-full overflow-hidden">
                
                {/* Left Area: Video Player */}
                <div className={`w-full lg:w-[50%] xl:w-[52%] h-[40%] lg:h-full p-4 sm:p-6 lg:p-7 flex flex-col justify-between border-b lg:border-b-0 lg:border-r relative ${
                  isDark ? 'border-green-500/10 bg-[#020b12]' : 'border-slate-200 bg-slate-50'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Terminal className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-blue-600'}`} />
                    <span className={`text-xs font-mono tracking-wider font-bold uppercase ${isDark ? 'text-green-400' : 'text-blue-700'}`}>
                      {language === 'es' ? 'VISTA DE SISTEMA // DEMO INTERACTIVA' : 'DEVELOPER PREVIEW // LIVE SIMULATION'}
                    </span>
                  </div>

                  {/* Video Console Box */}
                  <div className={`relative aspect-[16/10] lg:max-h-[380px] xl:max-h-[440px] w-full rounded-2xl overflow-hidden border shadow-inner flex flex-col justify-center bg-black ${
                    isDark ? 'border-green-500/10' : 'border-slate-300'
                  }`}>
                    {/* Subtle Scanline Overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none z-10 opacity-30" />
                    
                    {/* Digital status pill */}
                    <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg border border-red-500/30">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                      <span className="text-[8px] font-mono font-bold text-red-400 uppercase tracking-widest">CONSOLE // ON</span>
                    </div>

                    {/* Video Element */}
                    <video
                      ref={videoRef}
                      src={selectedProject.videoUrl}
                      className="absolute inset-0 w-full h-full object-cover"
                      loop
                      muted={isMuted}
                      playsInline
                      onTimeUpdate={handleTimeUpdate}
                      onClick={togglePlay}
                    />

                    {/* Play Indicator overlay when paused */}
                    {!isPlaying && (
                      <button 
                         onClick={togglePlay} 
                        className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition-colors z-20 group"
                      >
                        <div className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white transform group-hover:scale-110 transition-transform shadow-2xl">
                          <Play className="w-8 h-8 fill-current ml-1" />
                        </div>
                      </button>
                    )}

                    {/* Compact Interactive HUD Controls */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 pt-6 z-20 flex flex-col gap-1.5">
                      
                      {/* Timeline track */}
                      <div 
                        className="w-full h-1 bg-white/20 hover:h-1.5 rounded-full cursor-pointer relative overflow-hidden transition-all"
                        onClick={handleProgressBarClick}
                      >
                        <div 
                          className="h-full bg-green-400 rounded-full" 
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-white text-[11px] font-mono pt-1">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={togglePlay} 
                            className="hover:text-green-400 transition-colors cursor-pointer"
                          >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                          </button>
                          <button 
                            onClick={toggleMute} 
                            className="hover:text-green-400 transition-colors cursor-pointer"
                          >
                            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                          </button>
                          <span>
                            {videoRef.current ? formatTime(videoRef.current.currentTime) : '0:00'} / {videoRef.current ? formatTime(videoRef.current.duration) : '0:00'}
                          </span>
                        </div>

                        {/* Fullscreen Button */}
                        <button
                          onClick={() => setIsMaximized(true)}
                          className="hover:text-green-400 transition-colors cursor-pointer flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded text-[10px]"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{t('proj-video-expand')}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Arrows for Next/Previous project in modal */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={handlePrevProject}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                        isDark 
                          ? 'border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 bg-slate-900/50' 
                          : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>{language === 'es' ? 'Anterior' : 'Previous'}</span>
                    </button>

                    <span className="text-[11px] font-mono text-slate-400">
                      {projects.findIndex((p) => p.id === selectedProject.id) + 1} / {projects.length}
                    </span>

                    <button
                      onClick={handleNextProject}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                        isDark 
                          ? 'border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 bg-slate-900/50' 
                          : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <span>{language === 'es' ? 'Siguiente' : 'Next'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Right Area: Technical Specifications Sheet */}
                <div className="w-full lg:w-[50%] xl:w-[48%] h-[60%] lg:h-full p-4 sm:p-6 lg:p-7 overflow-y-auto flex flex-col justify-between scrollbar-thin">
                  
                  <div className="flex flex-col gap-3.5">
                    {/* Header: Title & Category */}
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded border ${
                          isDark ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-blue-50 border-blue-200 text-blue-700'
                        }`}>
                          SPECS // v2.0
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-gradient-green">
                        {t(selectedProject.titleKey as any)}
                      </h3>
                      <p className={`text-xs leading-relaxed mt-2 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                        {t(selectedProject.descKey as any)}
                      </p>
                    </div>

                    {/* Role in Project */}
                    {selectedProject.roleKey && (
                      <div className={`px-3.5 py-2.5 rounded-xl border flex flex-col gap-0.5 ${
                        isDark ? 'bg-[#05131f] border-green-500/10' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <span className={`text-[10px] font-mono uppercase tracking-wider font-bold ${
                          isDark ? 'text-gray-400' : 'text-slate-500'
                        }`}>
                          {t('proj-role-label')}
                        </span>
                        <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {t(selectedProject.roleKey as any)}
                        </span>
                      </div>
                    )}

                    {/* Key Technical Features checklist */}
                    <div className="flex flex-col gap-2">
                      <span className={`text-xs font-mono font-bold tracking-wider uppercase ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                        {t('proj-features-label')}
                      </span>
                      <div className="flex flex-col gap-1.5">
                        {selectedProject.featuresKey && t(selectedProject.featuresKey as any).split(',').map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs">
                            <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${isDark ? 'text-green-400' : 'text-blue-600'}`} />
                            <span className={isDark ? 'text-gray-300' : 'text-slate-700'}>
                              {feat.trim()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tech Stack Row */}
                    <div className="flex flex-col gap-2 pt-1">
                      <span className={`text-xs font-mono font-bold tracking-wider uppercase ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                        {t('proj-techs-label')}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedProject.techs.map((techKey) => {
                          const iconData = techIconMap[techKey];
                          if (!iconData) return null;
                          return (
                            <div
                              key={techKey}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold ${
                                isDark
                                  ? 'bg-[#05131f] border-green-500/10 text-green-400'
                                  : 'bg-slate-50 border-blue-500/10 text-blue-800'
                              }`}
                            >
                              <img src={iconData.url} alt={iconData.name} className="w-3.5 h-3.5" />
                              <span>{iconData.name}</span>
                            </div>
                          );
                        })}
                        {selectedProject.techs.length === 0 && (
                          <span className={`text-sm italic ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                            {language === 'es' ? 'No requiere stack específico' : 'No specific stack required'}
                          </span>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Modal Footer CTAs */}
                  <div className={`flex items-center gap-3 pt-4 border-t mt-4 ${
                    isDark ? 'border-slate-800' : 'border-slate-200'
                  }`}>
                    {selectedProject.github && (
                      <a
                        href={selectedProject.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                          isDark 
                            ? 'border-green-500/20 text-green-400 hover:bg-green-500/10 hover:border-green-400' 
                            : 'border-blue-600/20 text-blue-700 hover:bg-blue-50'
                        }`}
                      >
                        <Github className="w-4 h-4" />
                        <span>{t('projects-code')}</span>
                      </a>
                    )}
                    {selectedProject.demo && (
                      <a
                        href={selectedProject.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          isDark
                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-slate-950 hover:brightness-110 shadow-lg shadow-green-500/20'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:brightness-110 shadow-lg shadow-blue-500/20'
                        }`}
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>{t('projects-demo')}</span>
                      </a>
                    )}
                  </div>

                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Maximized Video Overlay */}
      <AnimatePresence>
        {isMaximized && selectedProject && (
          <div
            id="video-fullscreen-overlay"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-8"
            onClick={() => setIsMaximized(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-6xl aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black flex items-center justify-center"
            >
              <button
                onClick={() => setIsMaximized(false)}
                className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/10 transition-all cursor-pointer"
              >
                <Minimize2 className="w-5 h-5" />
              </button>

              <video
                src={selectedProject.videoUrl}
                className="w-full h-full object-contain"
                autoPlay
                loop
                muted={isMuted}
                playsInline
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </>, document.body)}
    </section>
  );
}

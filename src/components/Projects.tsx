import { useState, useEffect, useRef, MouseEvent } from 'react';
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
  PlayCircle 
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
  genkit: { name: 'Genkit', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FF6F00"><path d="M12 2L2 22h20L12 2z"/></svg>' }
};

export default function Projects() {
  const { t, language } = useTranslation();
  const { theme } = useTheme();
  const [containerRef, isVisible] = useRevealOnScroll<HTMLElement>({ threshold: 0.1 });

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [direction, setDirection] = useState<number>(0);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  const isDark = theme === 'dark';

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

  // Video controller sync when project changes
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

  // Keyboard ESC key and arrow keys navigation
  useEffect(() => {
    if (!selectedProject) return;

    const handleKeyDown = (e: KeyboardEvent) => {
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
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, isMaximized]);

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

  const handleProgressClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickPercent = clickX / width;
    videoRef.current.currentTime = clickPercent * videoRef.current.duration;
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : dir < 0 ? '-100%' : 0,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-100%' : dir < 0 ? '100%' : 0,
      opacity: 0,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  return (
    <section
      id="projects"
      key={`projects-${language}`}
      ref={containerRef}
      className="py-24 bg-transparent"
    >
      <div id="projects-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div
          id="projects-header"
          className={`flex flex-col gap-2 mb-16 text-center transition-all duration-1000 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <span className={`font-bold tracking-widest text-xs uppercase flex items-center justify-center gap-1.5 transition-colors duration-500 ${
            isDark ? 'text-green-400' : 'text-emerald-600'
          }`}>
            <Code className="w-3.5 h-3.5" />
            {t('nav-projects')}
          </span>
          <h2 id="projects-title-h2" className="text-4xl sm:text-5xl font-black text-gradient-green py-1">
            {t('projects-title')}
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-green-400 rounded-full mx-auto mt-2" />
        </div>

        {/* Responsive Grid */}
        <div
          id="projects-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project, idx) => {
            const hasDemo = project.demo !== null;

            if (project.isEmpty) {
              return (
                <div
                  key={project.id}
                  id={`project-card-empty-${project.id}`}
                  onClick={() => handleSelectProject(project)}
                  className={`flex flex-col justify-between p-6 rounded-3xl border-2 border-dashed transition-all duration-500 min-h-[420px] text-center relative group transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer ${
                    isDark
                      ? 'border-green-500/20 bg-[#05131f]/30 hover:border-green-400/50 hover:bg-[#05131f]/50 hover:shadow-green-400/5 text-gray-300'
                      : 'border-slate-300 bg-slate-50/50 hover:border-emerald-500/50 hover:bg-slate-50 hover:shadow-emerald-500/5 text-slate-600'
                  } ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                  }`}
                  style={{ transitionDelay: `${idx * 150}ms` }}
                >
                  <div className="flex flex-col items-center justify-center flex-grow gap-4 my-auto">
                    <div className={`p-4 rounded-2xl transition-all duration-500 ${
                      isDark ? 'bg-green-500/5 text-green-400 group-hover:bg-green-500/10' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      <Code className="w-8 h-8 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gradient-green mb-2 tracking-wide uppercase">
                        {t(project.titleKey as any)}
                      </h3>
                      <p className={`text-sm max-w-xs leading-relaxed transition-colors duration-500 ${
                        isDark ? 'text-gray-400' : 'text-slate-500'
                      }`}>
                        {t(project.descKey as any)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-center mt-auto pt-4">
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase border transition-all duration-500 ${
                      isDark 
                        ? 'bg-[#05131f] border-green-500/15 text-green-400 group-hover:border-green-400/30' 
                        : 'bg-white border-emerald-100 text-emerald-600 group-hover:border-emerald-500/30'
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
                className={`flex flex-col rounded-3xl card-glass transition-all duration-500 overflow-hidden group transform hover:-translate-y-2 hover:shadow-2xl ${
                  isDark
                    ? 'hover:border-green-400/60 hover:shadow-green-400/15'
                    : 'hover:border-emerald-500/60 hover:shadow-emerald-500/15'
                } ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${idx * 150}ms` }}
              >
                {/* Visual Preview Frame */}
                <div 
                  id={`project-img-frame-${project.id}`} 
                  onClick={() => handleSelectProject(project)}
                  className={`relative aspect-[16/10] overflow-hidden cursor-pointer flex flex-col group/frame ${
                    isDark ? 'bg-[#05131f] border-b border-green-500/15' : 'bg-slate-100 border-b border-slate-200'
                  }`}
                >
                  {/* Browser Header Mockup */}
                  <div className={`flex items-center justify-between px-4 py-2 border-b shrink-0 select-none ${
                    isDark ? 'bg-[#020b12] border-green-500/10' : 'bg-slate-50 border-slate-200'
                  }`}>
                    {/* Window Control Buttons */}
                    <div className="flex gap-1.5 items-center">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/90 shadow-[0_0_4px_rgba(239,68,68,0.3)]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/90 shadow-[0_0_4px_rgba(234,179,8,0.3)]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500/90 shadow-[0_0_4px_rgba(34,197,94,0.3)]" />
                    </div>
                    {/* Mock URL / Domain Bar */}
                    <div className={`text-[10px] font-mono px-3 py-0.5 rounded-lg truncate max-w-[150px] sm:max-w-[200px] text-center transition-colors duration-500 ${
                      isDark ? 'bg-[#041624] text-green-400/70 border border-green-500/5' : 'bg-slate-200/50 text-slate-500 border border-slate-300/20'
                    }`}>
                      {project.id === 6 
                        ? 'ecokraf.vercel.app' 
                        : project.id === 5
                        ? 'ventas-corp.local'
                        : project.id === 4
                        ? 'ws-chat-calc.local'
                        : project.id === 3
                        ? 'pokedex-api.dev'
                        : project.id === 2
                        ? 'med-dashboard.local'
                        : 'rickandmorty-api.dev'}
                    </div>
                    {/* Balanced spacing */}
                    <div className="w-12" />
                  </div>

                  {/* Screenshot Container */}
                  <div className="relative flex-grow overflow-hidden w-full h-full bg-[#05131f]">
                    <img
                      src={project.image}
                      alt={t(project.titleKey as any)}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top transition-all duration-700 group-hover:scale-105"
                    />
                    {/* Hover visual overlay with instructions */}
                    <div className="absolute inset-0 bg-[#051a2f]/85 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 p-4 text-center">
                      <div className="p-3 rounded-full bg-green-500 text-slate-950 shadow-lg shadow-green-500/20 mb-2 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                        <PlayCircle className="w-6 h-6 fill-current animate-pulse" />
                      </div>
                      <span className="text-white text-xs font-mono font-bold tracking-wider uppercase">
                        {t('proj-view-preview')}
                      </span>
                      <span className="text-green-400 text-[10px] font-mono mt-1 opacity-80">
                        {language === 'es' ? 'Especificaciones & Video' : 'Specs & Video'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div id={`project-content-${project.id}`} className="flex flex-col flex-grow p-6 gap-4 justify-between">
                  
                  {/* Upper Text */}
                  <div className="flex flex-col gap-2">
                    <h3 
                      id={`project-title-${project.id}`} 
                      onClick={() => handleSelectProject(project)}
                      className="text-xl font-black text-gradient-green w-fit cursor-pointer hover:underline"
                    >
                      {t(project.titleKey as any)}
                    </h3>
                    <p id={`project-desc-${project.id}`} className={`text-sm leading-relaxed line-clamp-4 transition-colors duration-500 ${
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
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-500 border ${
                            isDark
                              ? 'bg-[#05131f]/60 border-green-500/20 hover:border-green-400/40 text-gray-200'
                              : 'bg-slate-100/85 border-emerald-500/10 hover:border-emerald-500/30 text-slate-700'
                          }`}
                          title={iconData.name}
                        >
                          <img
                            src={iconData.url}
                            alt={iconData.name}
                            className="w-4 h-4"
                            referrerPolicy="no-referrer"
                          />
                          <span className={`font-semibold text-[10px] uppercase tracking-wider ${
                            isDark ? 'text-green-400' : 'text-emerald-700'
                          }`}>{iconData.name}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Actions Row */}
                  <div id={`project-actions-${project.id}`} className={`flex items-center gap-3 border-t pt-4 mt-2 ${
                    isDark ? 'border-green-500/5' : 'border-slate-100'
                  }`}>
                    
                    {/* GitHub Code Link */}
                    {project.github ? (
                      <a
                        id={`project-code-btn-${project.id}`}
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all duration-300 shadow-sm ${
                          isDark
                            ? 'border-green-500/20 text-green-400 hover:bg-green-500/10 hover:border-green-400'
                            : 'border-emerald-600/20 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-600'
                        }`}
                      >
                        <Github className="w-4 h-4" />
                        <span>{t('projects-code')}</span>
                      </a>
                    ) : (
                      <button
                        id={`project-code-btn-disabled-${project.id}`}
                        disabled
                        className={`flex-grow flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold cursor-not-allowed opacity-40 ${
                          isDark
                            ? 'border-green-500/5 bg-[#0c253a] text-gray-500'
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
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold hover:brightness-110 active:scale-95 transition-all duration-300 shadow-md ${
                          isDark
                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-[#051A2F] shadow-green-500/10 hover:shadow-green-500/20'
                            : 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-emerald-600/10 hover:shadow-emerald-600/20'
                        }`}
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>{t('projects-demo')}</span>
                      </a>
                    ) : (
                      <button
                        id={`project-demo-btn-disabled-${project.id}`}
                        disabled
                        className={`flex-grow flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold cursor-not-allowed opacity-40 ${
                          isDark
                            ? 'bg-[#0c253a] border border-green-500/5 text-gray-500'
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
          })}
        </div>

      </div>

      {/* Project Preview Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div
            id="project-modal-overlay"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-slate-950/80 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              id="project-modal-card"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-5xl lg:max-w-7xl lg:w-[94vw] h-[82vh] sm:h-[85vh] lg:h-[88vh] lg:max-h-[850px] lg:min-h-[640px] rounded-3xl overflow-hidden border shadow-2xl transition-all duration-300 ${
                isDark 
                  ? 'bg-[#030d16] border-green-500/25 text-gray-100 shadow-green-950/20' 
                  : 'bg-white border-slate-200 text-slate-800 shadow-slate-300'
              }`}
            >
              {/* Header Controls (Close button) */}
              <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
                <button
                  id="project-modal-close-btn"
                  onClick={() => setSelectedProject(null)}
                  className={`p-2 rounded-xl transition-all duration-300 border cursor-pointer hover:scale-105 active:scale-95 ${
                    isDark 
                      ? 'bg-[#081827] border-green-500/15 text-green-400 hover:bg-green-500/10 hover:border-green-500/30' 
                      : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                  }`}
                  aria-label="Close project preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Grid Content inside Animation Viewport */}
              <div className="relative w-full h-full lg:h-[calc(100%-0px)] overflow-hidden">
                <AnimatePresence mode="wait" initial={false} custom={direction}>
                  <motion.div
                    key={selectedProject.id}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto lg:overflow-hidden h-full w-full"
                  >
                
                {/* Left Column: Interactive Video Player Terminal (7/12) */}
                <div className="lg:col-span-7 p-5 sm:p-6 lg:p-7 flex flex-col justify-between">
                  <div className="flex flex-col gap-3.5 h-full">
                    {/* Title badge & label */}
                    <div className="flex items-center gap-2">
                      <Terminal className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-emerald-700'}`} />
                      <span className={`text-[10px] font-mono tracking-wider font-bold uppercase ${isDark ? 'text-green-400' : 'text-emerald-700'}`}>
                        {isDark ? 'DEVELOPER PREVIEW // LIVE SIMULATION' : 'VISTA DE SISTEMA // DEMO INTERACTIVA'}
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
                          <div className="p-4 rounded-full bg-green-500 text-slate-950 shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform">
                            <Play className="w-8 h-8 fill-current" />
                          </div>
                        </button>
                      )}

                      {/* Customized HUD Controls Bar */}
                      <div className="absolute bottom-0 left-0 right-0 z-20 p-3 bg-gradient-to-t from-black/90 via-black/70 to-transparent flex flex-col gap-2">
                        {/* Progress Bar */}
                        <div 
                          className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden cursor-pointer hover:h-2 transition-all"
                          onClick={handleProgressClick}
                        >
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" 
                            style={{ width: `${progress}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Left: Play/Pause/Mute */}
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={togglePlay}
                              className="text-white hover:text-green-400 transition-colors cursor-pointer"
                              title={isPlaying ? 'Pause' : 'Play'}
                            >
                              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                            </button>

                            <button 
                              onClick={toggleMute}
                              className="text-white hover:text-green-400 transition-colors cursor-pointer"
                              title={isMuted ? 'Unmute' : 'Mute'}
                            >
                              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            </button>
                          </div>

                          {/* Right: Maximize/Enlarge */}
                          <button 
                            onClick={() => setIsMaximized(true)}
                            className="flex items-center gap-1 bg-green-500 hover:bg-green-400 text-slate-950 font-mono font-black text-[9px] sm:text-[10px] px-2.5 py-1 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-md shadow-green-500/15 cursor-pointer uppercase"
                            title={t('proj-video-expand')}
                          >
                            <Maximize2 className="w-3 h-3" />
                            <span>{t('proj-video-expand')}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Info Tip */}
                    <p className={`text-[11px] leading-relaxed italic ${isDark ? 'text-gray-400' : 'text-slate-500'} mt-1`}>
                      {language === 'es' 
                        ? '* El video representa una simulación interactiva de las funcionalidades y flujos de datos del sistema.' 
                        : '* The video displays an interactive simulation of the systems features and data flows.'}
                    </p>
                  </div>

                  {/* Desktop Prev/Next inline selectors in Left Col */}
                  <div className="hidden lg:flex items-center justify-between mt-6 pt-4">
                    <button
                      onClick={handlePrevProject}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 active:scale-95 border cursor-pointer ${
                        isDark 
                          ? 'bg-[#081827] border-green-500/20 text-green-400 hover:bg-green-500/10 hover:border-green-400' 
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>{language === 'es' ? 'Proyecto Anterior' : 'Previous Project'}</span>
                    </button>

                    <span className={`text-xs font-mono font-bold ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                      {String(projects.findIndex(p => p.id === selectedProject.id) + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                    </span>

                    <button
                      onClick={handleNextProject}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 active:scale-95 border cursor-pointer ${
                        isDark 
                          ? 'bg-[#081827] border-green-500/20 text-green-400 hover:bg-green-500/10 hover:border-green-400' 
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{language === 'es' ? 'Siguiente Proyecto' : 'Next Project'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Right Column: Specifications & Information (5/12) */}
                <div className="lg:col-span-5 p-5 sm:p-6 lg:p-7 flex flex-col justify-between bg-gradient-to-br from-transparent to-slate-500/5 lg:h-full lg:overflow-y-auto">
                  <div className="flex flex-col gap-4">
                    
                    {/* Meta details and project tag */}
                    <div className="flex flex-wrap items-center gap-2 pt-4 sm:pt-0">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-mono tracking-widest uppercase border ${
                        isDark ? 'bg-green-500/5 border-green-500/15 text-green-400' : 'bg-emerald-50 border-emerald-100 text-emerald-800'
                      }`}>
                        {t(selectedProject.roleKey as any)}
                      </span>
                      {selectedProject.isEmpty && (
                        <span className="px-2.5 py-1 rounded-full text-[9px] font-mono tracking-widest uppercase border bg-amber-500/5 border-amber-500/20 text-amber-500">
                          {language === 'es' ? 'PLANIFICACIÓN' : 'ROADMAP'}
                        </span>
                      )}
                    </div>

                    {/* Project Title */}
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-black text-gradient-green tracking-tight leading-tight">
                        {t(selectedProject.titleKey as any)}
                      </h3>
                      <div className={`w-12 h-1 mt-2.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-400`} />
                    </div>

                    {/* Fully Explained Description */}
                    <div className="flex flex-col gap-1.5">
                      <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                        {t(selectedProject.descKey as any)}
                      </p>
                    </div>

                    {/* Key Technical Features checklist */}
                    <div className="flex flex-col gap-2">
                      <span className={`text-[10px] font-mono font-bold tracking-wider uppercase ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                        {t('proj-features-label')}
                      </span>
                      <div className="flex flex-col gap-2">
                        {t(selectedProject.featuresKey as any).split(',').map((feature, fIdx) => (
                          <div key={fIdx} className="flex items-start gap-2.5">
                            <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${isDark ? 'text-green-400' : 'text-emerald-600'}`} />
                            <span className={`text-[11px] sm:text-xs leading-snug font-medium ${isDark ? 'text-gray-200' : 'text-slate-700'}`}>
                              {feature.trim()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tech Stack Row */}
                    <div className="flex flex-col gap-2 pt-1">
                      <span className={`text-[10px] font-mono font-bold tracking-wider uppercase ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                        {t('proj-techs-label')}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedProject.techs.map((techKey) => {
                          const iconData = techIconMap[techKey];
                          if (!iconData) return null;
                          return (
                            <div
                              key={techKey}
                              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] font-bold ${
                                isDark
                                  ? 'bg-[#05131f] border-green-500/10 text-green-400'
                                  : 'bg-slate-50 border-emerald-500/10 text-emerald-800'
                              }`}
                            >
                              <img
                                src={iconData.url}
                                alt={iconData.name}
                                className="w-3.5 h-3.5"
                                referrerPolicy="no-referrer"
                              />
                              <span>{iconData.name}</span>
                            </div>
                          );
                        })}
                        {selectedProject.techs.length === 0 && (
                          <span className={`text-xs italic ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
                            {language === 'es' ? 'No requiere stack específico' : 'No specific stack required'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions row + Mobile Prev/Next controls */}
                  <div className="flex flex-col gap-3 mt-5 pt-4">
                    {/* The buttons you already had inside the card */}
                    <div className="flex items-center gap-3">
                      {/* GitHub Code Link */}
                      {selectedProject.github ? (
                        <a
                          href={selectedProject.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm ${
                            isDark
                              ? 'border-green-500/20 text-green-400 bg-green-500/5 hover:bg-green-500/10 hover:border-green-400'
                              : 'border-emerald-600/20 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-600'
                          }`}
                        >
                          <Github className="w-4 h-4" />
                          <span>{t('projects-code')}</span>
                        </a>
                      ) : (
                        <button
                          disabled
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold cursor-not-allowed opacity-40 ${
                            isDark
                              ? 'border-green-500/5 bg-[#0c253a] text-gray-500'
                              : 'border-slate-200 bg-slate-50 text-slate-400'
                          }`}
                        >
                          <Github className="w-4 h-4" />
                          <span>{t('projects-code')}</span>
                        </button>
                      )}

                      {/* Live Demo Link */}
                      {selectedProject.demo ? (
                        <a
                          href={selectedProject.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold hover:brightness-110 active:scale-95 transition-all duration-300 shadow-md ${
                            isDark
                              ? 'bg-gradient-to-r from-green-500 to-green-600 text-[#051A2F] shadow-green-500/10'
                              : 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-emerald-600/10'
                          }`}
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>{t('projects-demo')}</span>
                        </a>
                      ) : (
                        <button
                          disabled
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold cursor-not-allowed opacity-40 ${
                            isDark
                              ? 'bg-[#0c253a] border border-green-500/5 text-gray-500'
                              : 'bg-slate-100 border border-slate-200 text-slate-400'
                          }`}
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>{t('projects-demo')}</span>
                        </button>
                      )}
                    </div>

                    {/* Mobile Navigation Controls inside Right Col */}
                    <div className="flex lg:hidden items-center justify-between pt-2">
                      <button
                        onClick={handlePrevProject}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 active:scale-95 border cursor-pointer ${
                          isDark 
                            ? 'bg-[#081827] border-green-500/20 text-green-400 hover:bg-green-500/10' 
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>{language === 'es' ? 'Anterior' : 'Prev'}</span>
                      </button>

                      <span className={`text-xs font-mono font-bold ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                        {projects.findIndex(p => p.id === selectedProject.id) + 1} / {projects.length}
                      </span>

                      <button
                        onClick={handleNextProject}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 active:scale-95 border cursor-pointer ${
                          isDark 
                            ? 'bg-[#081827] border-green-500/20 text-green-400 hover:bg-green-500/10' 
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>{language === 'es' ? 'Siguiente' : 'Next'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>

                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Immersive Maximized/Enlarged Video Lightbox Overlay */}
      <AnimatePresence>
        {selectedProject && isMaximized && (
          <div
            id="project-video-maximized-overlay"
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-slate-950/95"
            onClick={() => setIsMaximized(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl aspect-[16/10] bg-black rounded-3xl overflow-hidden border border-green-500/30 shadow-[0_0_50px_rgba(16,185,129,0.15)] flex items-center justify-center"
            >
              {/* Subtle Scanline Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none z-10 opacity-30" />

              <video
                src={selectedProject.videoUrl}
                className="w-full h-full object-contain"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                onClick={togglePlay}
              />

              {/* Close / Minimize button */}
              <button
                onClick={() => setIsMaximized(false)}
                className="absolute top-4 right-4 z-50 p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-green-500/30 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-lg flex items-center gap-1.5 text-xs font-mono font-bold"
                aria-label="Minimize video"
              >
                <Minimize2 className="w-4 h-4" />
                <span>{language === 'es' ? 'Cerrar Video' : 'Minimize'}</span>
              </button>

              {/* Info Status Indicator overlay */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-green-500/30">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-mono font-bold text-green-400 uppercase tracking-widest">
                  {t(selectedProject.titleKey as any)} // MAX PREVIEW
                </span>
              </div>

              {/* Controls overlay */}
              <div className="absolute bottom-4 left-4 right-4 z-20 p-4 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-green-500/20 flex flex-col gap-2.5">
                <div className="flex items-center gap-3 justify-between">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={togglePlay}
                      className="text-white hover:text-green-400 transition-colors cursor-pointer flex items-center gap-1 text-xs font-mono"
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                      <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
                    </button>

                    <button 
                      onClick={toggleMute}
                      className="text-white hover:text-green-400 transition-colors cursor-pointer flex items-center gap-1 text-xs font-mono"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      <span>{isMuted ? 'UNMUTE' : 'MUTE'}</span>
                    </button>
                  </div>

                  <div className="text-[10px] font-mono text-green-400">
                    {language === 'es' ? 'Presione ESC o haga clic afuera para salir' : 'Press ESC or click outside to exit'}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
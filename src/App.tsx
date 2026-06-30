import { LanguageProvider } from './i18n/useTranslation';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import AboutMe from './components/AboutMe';
import Projects from './components/Projects';
import Certificates from './components/Certificates';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import ParticleCanvas from './components/ParticleCanvas';

function PortfolioAppContent() {
  const { theme } = useTheme();

  return (
    <div
      id="portfolio-root-layout"
      className={`min-h-screen transition-all duration-500 font-sans selection:bg-green-500/20 selection:text-green-300 overflow-x-hidden relative ${
        theme === 'dark' ? 'bg-gradient-dark text-gray-100' : 'bg-gradient-light text-slate-800'
      }`}
    >
      {/* Comet constellation background */}
      <ParticleCanvas />

      {/* Subtle overlay to slightly dim the background canvas/gradients and make content pop */}
      <div 
        id="bg-dim-overlay"
        className={`fixed inset-0 pointer-events-none z-0 transition-colors duration-500 ${
          theme === 'dark' ? 'bg-[#00050a]/20' : 'bg-slate-950/[0.04]'
        }`} 
      />

      {/* Navigation Header */}
      <Navigation />

      {/* Hero Intro */}
      <Hero />

      {/* Narrative & Technologies */}
      <AboutMe />

      {/* Grid Projects */}
      <Projects />

      {/* Certifications Accordion */}
      <Certificates />

      {/* Project inquiry / WhatsApp submit Form */}
      <ContactForm />

      {/* App Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <PortfolioAppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}


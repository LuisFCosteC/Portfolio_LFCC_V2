import React, { useState, useEffect } from 'react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  MessageSquare, 
  MessageCircle, 
  Terminal, 
  X, 
  Check, 
  Shield, 
  Info, 
  Lock, 
  Sliders 
} from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import { useTheme } from '../context/ThemeContext';
import { socialLinks } from '../data/social-links';
import { motion, AnimatePresence } from 'motion/react';

export default function Footer() {
  const { t, language } = useTranslation();
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();

  const isDark = theme === 'dark';

  // Active modal state
  const [activeModal, setActiveModal] = useState<'terms' | 'privacy' | 'cookies' | 'data' | 'cookie-config' | null>(null);

  // Cookie settings state
  const [cookieSettings, setCookieSettings] = useState({
    essential: true,
    analytical: true,
    marketing: false,
  });

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  // Load cookie configuration on mount
  useEffect(() => {
    const saved = localStorage.getItem('lfcc-cookie-preferences');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCookieSettings({
          essential: true,
          analytical: parsed.analytical ?? true,
          marketing: parsed.marketing ?? false,
        });
      } catch (e) {
        // Fallback
      }
    } else {
      // Show the cookie configuration banner if not saved before
      setShowBanner(true);
    }
  }, []);

  // Lock background scroll when modal is active
  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeModal]);

  // Handle Escape key to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSaveCookies = () => {
    localStorage.setItem('lfcc-cookie-preferences', JSON.stringify(cookieSettings));
    setSaveSuccess(true);
    setShowBanner(false);
    setTimeout(() => {
      setSaveSuccess(false);
      setActiveModal(null);
    }, 1500);
  };

  const handleAcceptAllCookies = () => {
    const allCookies = { essential: true, analytical: true, marketing: true };
    setCookieSettings(allCookies);
    localStorage.setItem('lfcc-cookie-preferences', JSON.stringify(allCookies));
    setShowBanner(false);
  };

  const handleRejectAllCookies = () => {
    const essentialOnly = { essential: true, analytical: false, marketing: false };
    setCookieSettings(essentialOnly);
    localStorage.setItem('lfcc-cookie-preferences', JSON.stringify(essentialOnly));
    setShowBanner(false);
  };

  const handleConfigureCookies = () => {
    setActiveModal('cookie-config');
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Github':
        return <Github className="w-5 h-5" />;
      case 'Linkedin':
        return <Linkedin className="w-5 h-5" />;
      case 'Mail':
        return <Mail className="w-5 h-5" />;
      case 'Gmail':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-1.29 1.454-2.032 2.514-1.222L12 10.224l9.486-7.19c1.06-.81 2.514-.068 2.514 1.223z"/>
          </svg>
        );
      case 'MessageSquare':
        return <MessageSquare className="w-5 h-5" />;
      case 'MessageCircle':
        return <MessageCircle className="w-5 h-5" />;
      case 'Discord':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
          </svg>
        );
      case 'WhatsApp':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        );
      default:
        return <Terminal className="w-5 h-5" />;
    }
  };

  const handleScrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Modal Dynamic Content Helpers
  const getTermsContent = () => {
    if (language === 'es') {
      return (
        <div id="terms-content-es" className="space-y-4">
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-1 text-emerald-600 dark:text-green-400">1. Aceptación de Términos</h4>
            <p className="text-xs leading-relaxed">Al acceder y utilizar este portafolio web de Luis F. Coste C. (LFCC), usted acepta cumplir con estos Términos y Condiciones en su totalidad. Si no está de acuerdo, le solicitamos abstenerse de usar el sitio.</p>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-1 text-emerald-600 dark:text-green-400">2. Propiedad Intelectual</h4>
            <p className="text-xs leading-relaxed">Todo el código fuente, diseños, logos, textos, imágenes, videos y marcas mostrados en este portafolio son de propiedad exclusiva de Luis F. Coste C. o cuentan con las licencias correspondientes. Queda prohibida su reproducción parcial o total con fines comerciales sin autorización previa por escrito.</p>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-1 text-emerald-600 dark:text-green-400">3. Uso Permitido</h4>
            <p className="text-xs leading-relaxed">Se concede permiso para visualizar el contenido del sitio web con fines informativos y profesionales. No se permite realizar ingeniería inversa, raspado de datos (scraping) o cualquier actividad que comprometa la integridad de la infraestructura de este sitio.</p>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-1 text-emerald-600 dark:text-green-400">4. Limitación de Responsabilidad</h4>
            <p className="text-xs leading-relaxed">El desarrollador realiza sus mejores esfuerzos para garantizar la precisión del contenido, pero no asume responsabilidad por errores u omisiones en la información del sitio, ni por daños derivados de interrupciones técnicas.</p>
          </div>
        </div>
      );
    } else {
      return (
        <div id="terms-content-en" className="space-y-4">
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-1 text-emerald-600 dark:text-green-400">1. Acceptance of Terms</h4>
            <p className="text-xs leading-relaxed">By accessing and using this web portfolio of Luis F. Coste C. (LFCC), you agree to comply with these Terms and Conditions in full. If you do not agree, please refrain from using the site.</p>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-1 text-emerald-600 dark:text-green-400">2. Intellectual Property</h4>
            <p className="text-xs leading-relaxed">All source code, designs, logos, texts, images, videos, and trademarks shown in this portfolio are the exclusive property of Luis F. Coste C. or have the corresponding licenses. Partial or total reproduction for commercial purposes is prohibited without prior written authorization.</p>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-1 text-emerald-600 dark:text-green-400">3. Permitted Use</h4>
            <p className="text-xs leading-relaxed">Permission is granted to view the website content for informational and professional purposes. You are not allowed to perform reverse engineering, data scraping, or any activity that compromises the integrity of this site's infrastructure.</p>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-1 text-emerald-600 dark:text-green-400">4. Limitation of Liability</h4>
            <p className="text-xs leading-relaxed">The developer makes their best efforts to ensure content accuracy, but assumes no responsibility for errors or omissions in the site information, nor for damages resulting from technical interruptions.</p>
          </div>
        </div>
      );
    }
  };

  const getPrivacyContent = () => {
    if (language === 'es') {
      return (
        <div id="privacy-content-es" className="space-y-4">
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-1 text-emerald-600 dark:text-green-400">1. Recopilación de Datos</h4>
            <p className="text-xs leading-relaxed">Este sitio web no almacena de forma permanente información de carácter personal de los usuarios visitantes. Los únicos datos procesados son aquellos que el usuario decide proporcionar voluntariamente a través del formulario de contacto.</p>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-1 text-emerald-600 dark:text-green-400">2. Uso de la Información</h4>
            <p className="text-xs leading-relaxed">La información ingresada en el formulario de contacto (como Nombre, Correo, Teléfono y Detalle del proyecto) se utiliza exclusivamente para componer el mensaje seguro de WhatsApp o Correo que se envía directamente a Luis F. Coste C. No comercializamos bases de datos.</p>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-1 text-emerald-600 dark:text-green-400">3. Terceros y Seguridad</h4>
            <p className="text-xs leading-relaxed">Sus datos nunca serán vendidos, alquilados, distribuidos ni compartidos con empresas externas. Contamos con protocolos seguros HTTPS y cifrado de extremo a extremo en la transmisión de mensajes por WhatsApp.</p>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-1 text-emerald-600 dark:text-green-400">4. Derechos del Titular</h4>
            <p className="text-xs leading-relaxed">En cualquier momento, usted puede solicitar la eliminación de cualquier conversación o información de contacto escribiendo a los canales oficiales listados en este sitio web.</p>
          </div>
        </div>
      );
    } else {
      return (
        <div id="privacy-content-en" className="space-y-4">
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-1 text-emerald-600 dark:text-green-400">1. Data Collection</h4>
            <p className="text-xs leading-relaxed">This website does not permanently store personal information of visiting users. The only data processed is what the user voluntarily provides through the contact form.</p>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-1 text-emerald-600 dark:text-green-400">2. Use of Information</h4>
            <p className="text-xs leading-relaxed">The information entered in the contact form (such as Name, Email, Phone, and Project Details) is used exclusively to compose the secure WhatsApp or Email message sent directly to Luis F. Coste C. We do not sell databases.</p>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-1 text-emerald-600 dark:text-green-400">3. Third Parties & Security</h4>
            <p className="text-xs leading-relaxed">Your data will never be sold, rented, distributed, or shared with external companies. We count on HTTPS secure protocols and end-to-end encryption for WhatsApp messaging transmission.</p>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-1 text-emerald-600 dark:text-green-400">4. Owner Rights</h4>
            <p className="text-xs leading-relaxed">At any time, you can request the deletion of any conversation or contact information by writing to the official channels listed on this website.</p>
          </div>
        </div>
      );
    }
  };

  const getCookiesContent = () => {
    if (language === 'es') {
      return (
        <div id="cookies-content-es" className="space-y-4">
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-1 text-emerald-600 dark:text-green-400">1. ¿Qué son las cookies?</h4>
            <p className="text-xs leading-relaxed">Las cookies y el almacenamiento local (localStorage) son pequeños archivos de texto que los sitios web almacenan en su navegador para recordar información sobre sus visitas y preferencias.</p>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-1 text-emerald-600 dark:text-green-400">2. Cookies Técnicas y Esenciales</h4>
            <p className="text-xs leading-relaxed">Utilizamos almacenamiento local puramente técnico para guardar su selección de idioma (<code className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-red-500 font-mono text-[10px]">lfcc-portfolio-lang</code>) y su preferencia de tema oscuro/claro, de modo que su experiencia de usuario sea consistente y fluida.</p>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-1 text-emerald-600 dark:text-green-400">3. Cookies de Rendimiento</h4>
            <p className="text-xs leading-relaxed">Permiten realizar un seguimiento estadístico anónimo del volumen de visitas y secciones más visitadas con el fin de optimizar el rendimiento técnico del portafolio.</p>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-1 text-emerald-600 dark:text-green-400">4. Cómo Administrarlas</h4>
            <p className="text-xs leading-relaxed">Usted puede desactivar todas las cookies de manera global configurando la privacidad de su navegador de internet, o personalizar las cookies del sitio web desde el enlace <strong>Configurar cookies</strong> en el footer.</p>
          </div>
        </div>
      );
    } else {
      return (
        <div id="cookies-content-en" className="space-y-4">
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-1 text-emerald-600 dark:text-green-400">1. What are cookies?</h4>
            <p className="text-xs leading-relaxed">Cookies and local storage (localStorage) are small text files stored by websites on your browser to remember information about your visits and preferences.</p>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-1 text-emerald-600 dark:text-green-400">2. Technical & Essential Cookies</h4>
            <p className="text-xs leading-relaxed">We use purely technical local storage to save your language selection (<code className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-red-500 font-mono text-[10px]">lfcc-portfolio-lang</code>) and visual theme, ensuring your user experience is consistent and seamless.</p>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-1 text-emerald-600 dark:text-green-400">3. Performance Cookies</h4>
            <p className="text-xs leading-relaxed">These allow anonymous statistical tracking of user traffic and most visited sections in order to optimize the technical performance of our portfolio.</p>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-1 text-emerald-600 dark:text-green-400">4. How to Manage Them</h4>
            <p className="text-xs leading-relaxed">You can deactivate all cookies globally by configuring your internet browser's privacy settings, or customize your preferences directly on this site via the <strong>Configure cookies</strong> link in the footer.</p>
          </div>
        </div>
      );
    }
  };

  const getDataContent = () => {
    if (language === 'es') {
      return (
        <div id="data-content-es" className="space-y-4">
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-1 text-emerald-600 dark:text-green-400">1. Cumplimiento Legal (Ley 1581 de 2012)</h4>
            <p className="text-xs leading-relaxed">De acuerdo con las regulaciones de Habeas Data y la Ley de Protección de Datos Personales en Colombia (Ley 1581 de 2012), informamos que cualquier dato suministrado voluntariamente será manejado con el máximo nivel de confidencialidad.</p>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-1 text-emerald-600 dark:text-green-400">2. Finalidad de la Recopilación</h4>
            <p className="text-xs leading-relaxed">La información capturada a través de canales directos de contacto (WhatsApp, correo) tiene el único propósito de estructurar propuestas comerciales de servicios tecnológicos, agendar consultorías o responder inquietudes técnicas.</p>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-1 text-emerald-600 dark:text-green-400">3. Canales de Ejercicio de Derechos</h4>
            <p className="text-xs leading-relaxed">Usted puede consultar de manera gratuita sus datos personales almacenados, actualizarlos, rectificarlos o solicitar la supresión de estos enviando una comunicación mediante el formulario de contacto o el enlace directo de correo electrónico.</p>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-1 text-emerald-600 dark:text-green-400">4. Medidas de Seguridad</h4>
            <p className="text-xs leading-relaxed">Contamos con estrictos estándares de seguridad digital, cifrado SSL/TLS, de tal forma que se imposibilite la alteración, pérdida o acceso no autorizado de terceros a la información suministrada.</p>
          </div>
        </div>
      );
    } else {
      return (
        <div id="data-content-en" className="space-y-4">
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-1 text-emerald-600 dark:text-green-400">1. Legal Compliance (Law 1581 of 2012)</h4>
            <p className="text-xs leading-relaxed">In accordance with Habeas Data regulations and the Personal Data Protection Act in Colombia (Law 1581 of 2012), we inform you that any data voluntarily provided will be handled with the highest level of confidentiality.</p>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-1 text-emerald-600 dark:text-green-400">2. Purpose of Collection</h4>
            <p className="text-xs leading-relaxed">The information captured through direct contact channels (WhatsApp, email) serves the sole purpose of structuring business proposals for technology services, scheduling consultations, or answering technical questions.</p>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-1 text-emerald-600 dark:text-green-400">3. Channels to Exercise Your Rights</h4>
            <p className="text-xs leading-relaxed">You can consult your stored personal data free of charge, update it, rectify it, or request its deletion by sending a communication through the contact form or direct email link.</p>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-1 text-emerald-600 dark:text-green-400">4. Security Measures</h4>
            <p className="text-xs leading-relaxed">We employ strict digital security standards, SSL/TLS encryption, making it virtually impossible for unauthorized third parties to alter, lose, or access the provided information.</p>
          </div>
        </div>
      );
    }
  };

  return (
    <footer id="app-footer" className={`py-12 transition-all duration-500 border-t ${
      isDark 
        ? 'bg-[#05131f] border-green-500/10 text-gray-400' 
        : 'bg-slate-100 border-slate-200 text-slate-500'
    }`}>
      <div id="footer-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Upper Row */}
        <div id="footer-upper-row" className={`flex flex-col sm:flex-row items-center justify-between gap-8 pb-8 border-b ${
          isDark ? 'border-green-500/5' : 'border-slate-200'
        }`}>
          
          {/* Logo & Small Intro */}
          <div id="footer-logo-wrapper" className="flex flex-col items-center sm:items-start gap-2">
            <a
              id="footer-logo"
              href="#home"
              onClick={handleScrollToTop}
              className="text-2xl font-black text-gradient-green tracking-wider"
            >
              LFCC
            </a>
            <p className={`text-xs font-semibold uppercase tracking-widest mt-1 ${
              isDark ? 'text-gray-500' : 'text-slate-400'
            }`}>
              {t('hero-title')}
            </p>
          </div>

          {/* Social Links Row */}
          <div id="footer-social-wrapper" className="flex flex-col items-center sm:items-end gap-3">
            <span id="footer-social-label" className={`text-xs font-bold uppercase tracking-widest ${
              isDark ? 'text-gray-500' : 'text-slate-400'
            }`}>
              {t('footer-contact')}
            </span>
            <div id="footer-social-icons" className="flex items-center gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  id={`footer-social-${link.id}`}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2.5 rounded-full card-glass transition-all duration-300 hover:-translate-y-0.5 ${
                    isDark
                      ? 'bg-[#0c253a]/40 text-gray-400 hover:text-green-400'
                      : 'bg-white text-slate-600 hover:text-emerald-600 hover:shadow-sm'
                  }`}
                  aria-label={link.name}
                >
                  {renderIcon(link.icon)}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Middle Row (Policies & Cookie Configuration) */}
        <div id="footer-policies-row" className={`flex flex-col md:flex-row items-center justify-between gap-4 py-6 border-b text-xs font-medium ${
          isDark ? 'border-green-500/5' : 'border-slate-200'
        }`}>
          <div id="footer-policies-links-wrapper" className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2">
            <span id="footer-policies-label" className={`text-xs font-bold uppercase tracking-widest ${
              isDark ? 'text-gray-500' : 'text-slate-400'
            }`}>
              {language === 'es' ? 'Políticas:' : 'Policies:'}
            </span>
            <button
              id="footer-link-terms"
              onClick={() => setActiveModal('terms')}
              className={`hover:underline cursor-pointer transition-colors ${
                isDark ? 'hover:text-green-400 text-gray-400' : 'hover:text-emerald-600 text-slate-600'
              }`}
            >
              {language === 'es' ? 'Términos y Condiciones' : 'Terms & Conditions'}
            </button>
            <span id="footer-policy-dot-1" className="opacity-30 text-slate-400 dark:text-gray-600">•</span>
            <button
              id="footer-link-privacy"
              onClick={() => setActiveModal('privacy')}
              className={`hover:underline cursor-pointer transition-colors ${
                isDark ? 'hover:text-green-400 text-gray-400' : 'hover:text-emerald-600 text-slate-600'
              }`}
            >
              {language === 'es' ? 'Política de Privacidad' : 'Privacy Policy'}
            </button>
            <span id="footer-policy-dot-2" className="opacity-30 text-slate-400 dark:text-gray-600">•</span>
            <button
              id="footer-link-cookies"
              onClick={() => setActiveModal('cookies')}
              className={`hover:underline cursor-pointer transition-colors ${
                isDark ? 'hover:text-green-400 text-gray-400' : 'hover:text-emerald-600 text-slate-600'
              }`}
            >
              {language === 'es' ? 'Política de Cookies' : 'Cookie Policy'}
            </button>
            <span id="footer-policy-dot-3" className="opacity-30 text-slate-400 dark:text-gray-600">•</span>
            <button
              id="footer-link-data"
              onClick={() => setActiveModal('data')}
              className={`hover:underline cursor-pointer transition-colors ${
                isDark ? 'hover:text-green-400 text-gray-400' : 'hover:text-emerald-600 text-slate-600'
              }`}
            >
              {language === 'es' ? 'Tratamiento de Datos' : 'Data Treatment'}
            </button>
          </div>

          <div id="footer-cookie-config-wrapper">
            <button
              id="footer-link-cookie-config"
              onClick={() => setActiveModal('cookie-config')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${
                isDark 
                  ? 'bg-green-500/5 border border-green-500/10 text-green-400 hover:bg-green-500/10' 
                  : 'bg-emerald-50 border border-emerald-100 text-emerald-600 hover:bg-emerald-100/50'
              }`}
            >
              <Sliders id="cookie-config-icon" className="w-3.5 h-3.5" />
              {language === 'es' ? 'Configurar cookies' : 'Cookie Settings'}
            </button>
          </div>
        </div>

        {/* Lower Row */}
        <div id="footer-lower-row" className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs font-medium">
          
          {/* Copyright */}
          <div id="footer-copyright" className="text-center sm:text-left">
            <span>© {currentYear} LFCC. {t('footer-rights')}</span>
          </div>

          {/* Author Credits */}
          <div id="footer-credits" className="text-center sm:text-right">
            <span>
              {t('footer-developed')}{' '}
              <span className={`font-bold hover:underline cursor-pointer transition-colors ${
                isDark ? 'text-green-400' : 'text-emerald-600'
              }`} onClick={handleScrollToTop}>
                Luis F. Coste C.
              </span>
            </span>
          </div>

        </div>

      </div>

      {/* Policy and Cookie Modals Overlay */}
      {activeModal && (
        <div 
          id="modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div 
            id="modal-card"
            className={`relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl shadow-2xl border transition-all duration-300 scale-100 animate-slide-up ${
              isDark 
                ? 'bg-[#061826] border-green-500/20 text-gray-200 shadow-green-950/10' 
                : 'bg-white border-slate-200 text-slate-700 shadow-slate-400/20'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div 
              id="modal-header"
              className={`flex items-center justify-between p-5 border-b ${
                isDark ? 'border-green-500/10 bg-[#071d2e]' : 'border-slate-100 bg-slate-50/50'
              } rounded-t-2xl`}
            >
              <div id="modal-title-wrapper" className="flex items-center gap-2.5">
                {activeModal === 'terms' && <Lock id="modal-title-icon" className="w-5 h-5 text-emerald-600 dark:text-green-400" />}
                {activeModal === 'privacy' && <Shield id="modal-title-icon" className="w-5 h-5 text-emerald-600 dark:text-green-400" />}
                {activeModal === 'cookies' && <Info id="modal-title-icon" className="w-5 h-5 text-emerald-600 dark:text-green-400" />}
                {activeModal === 'data' && <Info id="modal-title-icon" className="w-5 h-5 text-emerald-600 dark:text-green-400" />}
                {activeModal === 'cookie-config' && <Sliders id="modal-title-icon" className="w-5 h-5 text-emerald-600 dark:text-green-400" />}
                
                <h3 id="modal-title-text" className="font-extrabold text-base tracking-wide uppercase text-slate-900 dark:text-white">
                  {activeModal === 'terms' && (language === 'es' ? 'Términos y Condiciones' : 'Terms & Conditions')}
                  {activeModal === 'privacy' && (language === 'es' ? 'Política de Privacidad' : 'Privacy Policy')}
                  {activeModal === 'cookies' && (language === 'es' ? 'Política de Cookies' : 'Cookie Policy')}
                  {activeModal === 'data' && (language === 'es' ? 'Tratamiento de Datos' : 'Data Treatment')}
                  {activeModal === 'cookie-config' && (language === 'es' ? 'Configurar cookies' : 'Cookie Settings')}
                </h3>
              </div>
              <button 
                id="modal-close-btn"
                onClick={() => setActiveModal(null)}
                className={`p-1.5 rounded-lg transition-colors ${
                  isDark ? 'text-gray-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
                }`}
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body Content */}
            <div id="modal-body-container" className="flex-1 overflow-y-auto p-6 text-sm">
              {activeModal === 'terms' && getTermsContent()}
              {activeModal === 'privacy' && getPrivacyContent()}
              {activeModal === 'cookies' && getCookiesContent()}
              {activeModal === 'data' && getDataContent()}
              {activeModal === 'cookie-config' && (
                <div id="cookie-config-body" className="space-y-6">
                  <p id="cookie-config-desc" className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed">
                    {language === 'es' 
                      ? 'Administre sus preferencias sobre qué cookies se pueden almacenar en su dispositivo. Las cookies esenciales no se pueden desactivar ya que son necesarias para el correcto funcionamiento del portafolio.'
                      : 'Manage your preferences regarding which cookies can be stored on your device. Essential cookies cannot be disabled as they are required for the correct functioning of the portfolio.'}
                  </p>

                  <div id="cookie-options-list" className="space-y-4">
                    {/* Essential Cookies Row */}
                    <div id="cookie-option-essential" className={`p-4 rounded-xl border flex items-start justify-between gap-4 ${
                      isDark ? 'bg-slate-900/40 border-green-500/5' : 'bg-slate-50/50 border-slate-100'
                    }`}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {language === 'es' ? 'Cookies Esenciales' : 'Essential Cookies'}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:bg-green-500/10 dark:text-green-400">
                            {language === 'es' ? 'Obligatorio' : 'Required'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-gray-400 leading-normal">
                          {language === 'es' 
                            ? 'Almacenan sus preferencias del tema claro/oscuro y selección de idioma. No recopilan información de identificación personal.'
                            : 'Stores your light/dark theme preference and language selection. They do not collect personally identifiable information.'}
                        </p>
                      </div>
                      <div className="flex-shrink-0 flex items-center justify-center">
                        <div className="w-10 h-6 bg-emerald-600 dark:bg-green-500 rounded-full flex items-center p-1 cursor-not-allowed opacity-80">
                          <div className="w-4 h-4 bg-white rounded-full transform translate-x-4"></div>
                        </div>
                      </div>
                    </div>

                    {/* Analytical Cookies Row */}
                    <div id="cookie-option-analytical" className={`p-4 rounded-xl border flex items-start justify-between gap-4 ${
                      isDark ? 'bg-slate-900/40 border-green-500/5' : 'bg-slate-50/50 border-slate-100'
                    }`}>
                      <div className="flex-1">
                        <span className="font-bold text-sm text-slate-900 dark:text-white block mb-1">
                          {language === 'es' ? 'Cookies Analíticas' : 'Analytical Cookies'}
                        </span>
                        <p className="text-xs text-slate-500 dark:text-gray-400 leading-normal">
                          {language === 'es' 
                            ? 'Nos ayudan a analizar el volumen de tráfico, comprender qué secciones se visitan con más frecuencia y cómo se navega por el sitio de forma totalmente anónima.'
                            : 'Helps us analyze traffic volume, understand which sections are visited most frequently, and see how the site is navigated, completely anonymously.'}
                        </p>
                      </div>
                      <div className="flex-shrink-0 flex items-center justify-center pt-1">
                        <button 
                          onClick={() => setCookieSettings(prev => ({ ...prev, analytical: !prev.analytical }))}
                          className={`relative w-10 h-6 transition-colors duration-300 rounded-full flex items-center p-1 focus:outline-none ${
                            cookieSettings.analytical ? 'bg-emerald-600 dark:bg-green-500' : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 transform ${
                            cookieSettings.analytical ? 'translate-x-4' : 'translate-x-0'
                          }`}></div>
                        </button>
                      </div>
                    </div>

                    {/* Marketing Cookies Row */}
                    <div id="cookie-option-marketing" className={`p-4 rounded-xl border flex items-start justify-between gap-4 ${
                      isDark ? 'bg-slate-900/40 border-green-500/5' : 'bg-slate-50/50 border-slate-100'
                    }`}>
                      <div className="flex-1">
                        <span className="font-bold text-sm text-slate-900 dark:text-white block mb-1">
                          {language === 'es' ? 'Cookies de Marketing' : 'Marketing Cookies'}
                        </span>
                        <p className="text-xs text-slate-500 dark:text-gray-400 leading-normal">
                          {language === 'es' 
                            ? 'Utilizadas para realizar un seguimiento de los visitantes en las páginas web externas y para poder ofrecer anuncios relevantes y personalizados.'
                            : 'Used to track visitors across external web pages to display relevant and personalized advertisements.'}
                        </p>
                      </div>
                      <div className="flex-shrink-0 flex items-center justify-center pt-1">
                        <button 
                          onClick={() => setCookieSettings(prev => ({ ...prev, marketing: !prev.marketing }))}
                          className={`relative w-10 h-6 transition-colors duration-300 rounded-full flex items-center p-1 focus:outline-none ${
                            cookieSettings.marketing ? 'bg-emerald-600 dark:bg-green-500' : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 transform ${
                            cookieSettings.marketing ? 'translate-x-4' : 'translate-x-0'
                          }`}></div>
                        </button>
                      </div>
                    </div>
                  </div>

                  {saveSuccess && (
                    <div id="cookie-save-success-alert" className="flex items-center gap-2 p-3 bg-green-500/10 dark:bg-green-500/15 border border-green-500/20 text-emerald-600 dark:text-green-400 rounded-xl text-xs font-bold animate-[pulse_1s_infinite]">
                      <Check className="w-4 h-4" />
                      <span>
                        {language === 'es' 
                          ? '¡Preferencias de cookies guardadas de forma segura!' 
                          : 'Cookie preferences saved securely!'}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div 
              id="modal-footer-actions"
              className={`p-4 border-t flex items-center justify-end gap-3 ${
                isDark ? 'border-green-500/10 bg-[#071d2e]/50' : 'border-slate-100 bg-slate-50/30'
              } rounded-b-2xl`}
            >
              {activeModal === 'cookie-config' ? (
                <>
                  <button 
                    id="modal-cancel-btn"
                    onClick={() => setActiveModal(null)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide uppercase transition-colors ${
                      isDark ? 'text-gray-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    {language === 'es' ? 'Cancelar' : 'Cancel'}
                  </button>
                  <button 
                    id="modal-save-btn"
                    onClick={handleSaveCookies}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold tracking-wide uppercase shadow-md transition-all duration-300 active:scale-95 ${
                      isDark 
                        ? 'bg-green-500 hover:bg-green-400 text-[#05131f] hover:shadow-green-500/20' 
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white hover:shadow-emerald-600/25'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    {language === 'es' ? 'Guardar' : 'Save'}
                  </button>
                </>
              ) : (
                <button 
                  id="modal-gotit-btn"
                  onClick={() => setActiveModal(null)}
                  className={`px-5 py-2 rounded-xl text-xs font-bold tracking-wide uppercase shadow-sm transition-all duration-300 active:scale-95 ${
                    isDark 
                      ? 'bg-slate-800 hover:bg-slate-750 text-gray-200 border border-slate-700' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
                >
                  {language === 'es' ? 'Entendido' : 'Got it'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showBanner && (
          <motion.div
            id="cookie-consent-banner"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className={`fixed bottom-6 right-6 left-6 md:left-auto md:max-w-md z-50 p-5 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-300 ${
              isDark 
                ? 'bg-[#030d16]/95 border-green-500/20 text-gray-100 shadow-green-950/40 shadow-[0_15px_50px_rgba(0,0,0,0.8)]' 
                : 'bg-white/95 border-slate-200 text-slate-800 shadow-slate-300/40 shadow-[0_15px_50px_rgba(0,0,0,0.15)]'
            }`}
          >
            <div id="cookie-banner-content-row" className="flex items-start gap-4">
              <div 
                id="cookie-banner-icon-bg"
                className={`p-2.5 rounded-xl border shrink-0 ${
                  isDark ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                }`}
              >
                <Shield className="w-5 h-5" />
              </div>
              <div id="cookie-banner-text-col" className="flex-1 min-w-0">
                <div id="cookie-banner-title-flex" className="flex items-center gap-2 mb-1.5">
                  <h4 id="cookie-banner-title" className="text-sm font-bold tracking-tight">
                    {language === 'es' ? 'Preferencia de Cookies' : 'Cookie Preferences'}
                  </h4>
                  <span id="cookie-ping-container" className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
                <p id="cookie-banner-text" className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                  {language === 'es' 
                    ? 'Utilizamos cookies para optimizar su experiencia y analizar nuestro tráfico. Puede configurar sus preferencias o aceptar todas.'
                    : 'We use cookies to optimize your experience and analyze our traffic. You can customize your preferences or accept all.'}
                </p>
              </div>
            </div>

            <div id="cookie-banner-buttons" className="flex flex-col sm:flex-row gap-2 mt-5">
              <button
                id="cookie-banner-accept-btn"
                onClick={handleAcceptAllCookies}
                className={`flex-1 px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 active:scale-95 shadow-sm cursor-pointer ${
                  isDark 
                    ? 'bg-green-500 hover:bg-green-400 text-[#05131f] hover:shadow-green-500/20' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white hover:shadow-emerald-600/25'
                }`}
              >
                {language === 'es' ? 'Aceptar todas' : 'Accept all'}
              </button>
              
              <button
                id="cookie-banner-config-btn"
                onClick={handleConfigureCookies}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300 active:scale-95 border cursor-pointer ${
                  isDark 
                    ? 'bg-transparent border-green-500/20 text-green-400 hover:bg-green-500/10 hover:border-green-400' 
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                {language === 'es' ? 'Configurar' : 'Configure'}
              </button>

              <button
                id="cookie-banner-reject-btn"
                onClick={handleRejectAllCookies}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300 active:scale-95 border cursor-pointer ${
                  isDark 
                    ? 'bg-transparent border-red-500/10 text-red-400 hover:bg-red-500/5' 
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                }`}
              >
                {language === 'es' ? 'Rechazar' : 'Reject'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
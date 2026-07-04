import React, { useState } from 'react';
import { MessageSquareText, Send, Calendar, AlertCircle } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import { useTheme } from '../context/ThemeContext';
import { useRevealOnScroll } from '../hooks/use-reveal-on-scroll';
import { motion, AnimatePresence } from 'motion/react';

const COUNTRIES = [
    { code: 'CO', name: 'Colombia', dial: '+57', flag: '🇨🇴' },
    { code: 'US', name: 'Estados Unidos', dial: '+1', flag: '🇺🇸' },
    { code: 'ES', name: 'España', dial: '+34', flag: '🇪🇸' },
    { code: 'MX', name: 'México', dial: '+52', flag: '🇲🇽' },
    { code: 'AR', name: 'Argentina', dial: '+54', flag: '🇦🇷' },
    { code: 'VE', name: 'Venezuela', dial: '+58', flag: '🇻🇪' },
    { code: 'PE', name: 'Perú', dial: '+51', flag: '🇵🇪' },
    { code: 'CL', name: 'Chile', dial: '+56', flag: '🇨🇱' },
    { code: 'EC', name: 'Ecuador', dial: '+593', flag: '🇪🇨' },
    { code: 'BO', name: 'Bolivia', dial: '+591', flag: '🇧🇴' },
    { code: 'BR', name: 'Brasil', dial: '+55', flag: '🇧🇷' },
    { code: 'UY', name: 'Uruguay', dial: '+598', flag: '🇺🇾' },
    { code: 'PY', name: 'Paraguay', dial: '+595', flag: '🇵🇾' },
    { code: 'PA', name: 'Panamá', dial: '+507', flag: '🇵🇦' },
    { code: 'CR', name: 'Costa Rica', dial: '+506', flag: '🇨🇷' },
    { code: 'GT', name: 'Guatemala', dial: '+502', flag: '🇬🇹' },
    { code: 'HN', name: 'Honduras', dial: '+504', flag: '🇭🇳' },
    { code: 'SV', name: 'El Salvador', dial: '+503', flag: '🇸🇻' },
    { code: 'NI', name: 'Nicaragua', dial: '+505', flag: '🇳🇮' },
    { code: 'DO', name: 'República Dominicana', dial: '+1', flag: '🇩🇴' },
    { code: 'PR', name: 'Puerto Rico', dial: '+1', flag: '🇵🇷' },
    { code: 'CA', name: 'Canadá', dial: '+1', flag: '🇨🇦' },
    { code: 'GB', name: 'Reino Unido', dial: '+44', flag: '🇬🇧' },
    { code: 'FR', name: 'Francia', dial: '+33', flag: '🇫🇷' },
    { code: 'DE', name: 'Alemania', dial: '+49', flag: '🇩🇪' },
    { code: 'IT', name: 'Italia', dial: '+39', flag: '🇮🇹' },
    { code: 'PT', name: 'Portugal', dial: '+351', flag: '🇵🇹' },
    { code: 'CN', name: 'China', dial: '+86', flag: '🇨🇳' },
    { code: 'JP', name: 'Japón', dial: '+81', flag: '🇯🇵' },
    { code: 'IN', name: 'India', dial: '+91', flag: '🇮🇳' },
    { code: 'AU', name: 'Australia', dial: '+61', flag: '🇦🇺' },
    { code: 'NZ', name: 'Nueva Zelanda', dial: '+64', flag: '🇳🇿' },
    { code: 'CH', name: 'Suiza', dial: '+41', flag: '🇨🇭' },
    { code: 'NL', name: 'Países Bajos', dial: '+31', flag: '🇳🇱' },
    { code: 'BE', name: 'Bélgica', dial: '+32', flag: '🇧🇪' },
    { code: 'SE', name: 'Suecia', dial: '+46', flag: '🇸🇪' },
    { code: 'NO', name: 'Noruega', dial: '+47', flag: '🇳🇴' },
    { code: 'DK', name: 'Dinamarca', dial: '+45', flag: '🇩🇰' },
    { code: 'FI', name: 'Finlandia', dial: '+358', flag: '🇫🇮' },
    { code: 'IE', name: 'Irlanda', dial: '+353', flag: '🇮🇪' },
    { code: 'RU', name: 'Rusia', dial: '+7', flag: '🇷🇺' },
    { code: 'ZA', name: 'Sudáfrica', dial: '+27', flag: '🇿🇦' },
    { code: 'KR', name: 'Corea del Sur', dial: '+82', flag: '🇰🇷' },
    { code: 'SG', name: 'Singapur', dial: '+65', flag: '🇸🇬' },
    { code: 'IL', name: 'Israel', dial: '+972', flag: '🇮🇱' },
    { code: 'TR', name: 'Turquía', dial: '+90', flag: '🇹🇷' },
    { code: 'SA', name: 'Arabia Saudita', dial: '+966', flag: '🇸🇦' },
    { code: 'UA', name: 'Ucrania', dial: '+380', flag: '🇺🇦' },
    { code: 'PL', name: 'Polonia', dial: '+48', flag: '🇵🇱' },
    { code: 'GR', name: 'Grecia', dial: '+30', flag: '🇬🇷' },
    { code: 'RO', name: 'Rumania', dial: '+40', flag: '🇷🇴' },
    { code: 'HU', name: 'Hungría', dial: '+36', flag: '🇭🇺' },
    { code: 'CZ', name: 'Chequia', dial: '+420', flag: '🇨🇿' },
    { code: 'AT', name: 'Austria', dial: '+43', flag: '🇦🇹' },
    { code: 'TH', name: 'Tailandia', dial: '+66', flag: '🇹🇭' },
    { code: 'MY', name: 'Malasia', dial: '+60', flag: '🇲🇾' },
    { code: 'ID', name: 'Indonesia', dial: '+62', flag: '🇮🇩' },
    { code: 'PH', name: 'Filipinas', dial: '+63', flag: '🇵🇭' },
    { code: 'VN', name: 'Vietnam', dial: '+84', flag: '🇻🇳' },
    { code: 'EG', name: 'Egipto', dial: '+20', flag: '🇪🇬' },
    { code: 'MA', name: 'Marruecos', dial: '+212', flag: '🇲🇦' },
    { code: 'NG', name: 'Nigeria', dial: '+234', flag: '🇳🇬' },
    { code: 'KE', name: 'Kenia', dial: '+254', flag: '🇰🇪' }
];

export default function ContactForm() {
  const { t, language } = useTranslation();
  const { theme } = useTheme();
  const [containerRef, isVisible] = useRevealOnScroll<HTMLElement>({ threshold: 0.1 });

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState('CO');
  const [service, setService] = useState('');
  const [deadline, setDeadline] = useState('');
  const [details, setDetails] = useState('');

  // Custom Alert states
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const isDark = theme === 'dark';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate main required fields
    if (!name.trim() || !email.trim() || !details.trim()) {
      setAlertMessage(language === 'es' ? 'Por favor completa los campos requeridos.' : 'Please fill in all required fields.');
      setAlertOpen(true);
      return;
    }

    // Format the message body for WhatsApp
    const intro = language === 'es' 
      ? `¡Hola Luis! Te escribo desde tu portafolio personal.` 
      : `Hi Luis! I am writing to you from your personal portfolio.`;

    const serviceLabel = language === 'es' ? 'Servicio de interés' : 'Service of interest';
    const deadlineLabel = language === 'es' ? 'Plazo estimado' : 'Estimated deadline';
    const emailLabel = language === 'es' ? 'Correo' : 'Email';
    const phoneLabel = language === 'es' ? 'Teléfono' : 'Phone';
    const detailsLabel = language === 'es' ? 'Detalles del proyecto' : 'Project details';

    const countryObj = COUNTRIES.find(c => c.code === selectedCountryCode);
    const dialCode = countryObj ? countryObj.dial : '';
    const fullPhone = phone ? `${dialCode} ${phone.trim()}` : '';

    const message = `${intro}
 
*${language === 'es' ? 'Nombre' : 'Name'}:* ${name}
*${emailLabel}:* ${email}
*${phoneLabel}:* ${fullPhone || 'N/A'}
*${serviceLabel}:* ${service || 'N/A'}
*${deadlineLabel}:* ${deadline || 'N/A'}
 
*${detailsLabel}:*
${details}`;

    // Encode message and open WhatsApp link
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/+573042042752?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section
      id="contact"
      key={`contact-${language}`}
      ref={containerRef}
      className="py-24 bg-transparent"
    >
      <div id="contact-container" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div
          id="contact-header"
          className={`flex flex-col gap-2 mb-16 text-center transition-all duration-1000 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <span className={`font-bold tracking-widest text-sm uppercase flex items-center justify-center gap-1.5 transition-colors duration-500 ${
            isDark ? 'text-green-400' : 'text-blue-600'
          }`}>
            <MessageSquareText className="w-4 h-4" />
            {t('nav-contact')}
          </span>
          <h2 id="contact-title-h2" className="text-4xl sm:text-6xl font-black text-gradient-green py-1">
            {t('contact-title')}
          </h2>
          <p id="contact-subtitle-p" className={`text-base max-w-md mx-auto mt-1 transition-colors duration-500 ${
            isDark ? 'text-gray-300 font-medium' : 'text-slate-600'
          }`}>
            {t('contact-subtitle')}
          </p>
          <div className={`w-20 h-1 rounded-full mx-auto mt-3 ${
            isDark ? 'bg-gradient-to-r from-green-500 to-green-400' : 'bg-gradient-to-r from-blue-600 to-indigo-500'
          }`} />
        </div>

        {/* Contact Form Wrapper */}
        <div
          id="contact-form-wrapper"
          className={`p-8 sm:p-10 rounded-3xl crystal-panel shadow-2xl transition-all duration-1000 delay-200 transform ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <form id="portfolio-contact-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* 2-Column Grid for fields */}
            <div id="form-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Full Name */}
              <div id="field-name-container" className="flex flex-col gap-2">
                <label htmlFor="input-name" className={`text-sm font-bold uppercase tracking-wider pl-1 transition-colors duration-500 ${
                  isDark ? 'text-gray-200' : 'text-slate-600'
                }`}>
                  {t('contact-name')} <span className={isDark ? 'text-green-500' : 'text-blue-600'}>*</span>
                </label>
                <input
                  type="text"
                  id="input-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('contact-name-ph')}
                  required
                  className={`w-full px-4 py-3 rounded-xl border transition-all text-base font-semibold placeholder-slate-400 focus:outline-none focus:ring-1 ${
                    isDark
                      ? 'bg-[#051926]/80 border-green-500/10 text-gray-200 focus:border-green-400 focus:ring-green-400'
                      : 'bg-slate-50 border-blue-500/15 text-slate-800 focus:border-blue-600 focus:ring-blue-600'
                  }`}
                />
              </div>

              {/* Email Address */}
              <div id="field-email-container" className="flex flex-col gap-2">
                <label htmlFor="input-email" className={`text-sm font-bold uppercase tracking-wider pl-1 transition-colors duration-500 ${
                  isDark ? 'text-gray-200' : 'text-slate-600'
                }`}>
                  {t('contact-email')} <span className={isDark ? 'text-green-500' : 'text-blue-600'}>*</span>
                </label>
                <input
                  type="email"
                  id="input-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('contact-email-ph')}
                  required
                  className={`w-full px-4 py-3 rounded-xl border transition-all text-base font-semibold placeholder-slate-400 focus:outline-none focus:ring-1 ${
                    isDark
                      ? 'bg-[#051926]/80 border-green-500/10 text-gray-200 focus:border-green-400 focus:ring-green-400'
                      : 'bg-slate-50 border-blue-500/15 text-slate-800 focus:border-blue-600 focus:ring-blue-600'
                  }`}
                />
              </div>

              {/* Phone Number */}
              <div id="field-phone-container" className="flex flex-col gap-2 md:col-span-2">
                <label htmlFor="input-phone" className={`text-sm font-bold uppercase tracking-wider pl-1 transition-colors duration-500 ${
                  isDark ? 'text-gray-200' : 'text-slate-600'
                }`}>
                  {t('contact-phone')}
                </label>
                <div className={`flex rounded-xl overflow-hidden border transition-all duration-200 focus-within:ring-1 ${
                  isDark
                    ? 'bg-[#051926]/80 border-green-500/10 focus-within:border-green-400 focus-within:ring-green-400 text-gray-200'
                    : 'bg-slate-50 border-blue-500/15 focus-within:border-blue-600 focus-within:ring-blue-600 text-slate-800'
                }`}>
                  <div className={`relative shrink-0 flex items-center border-r transition-all ${
                    isDark ? 'border-green-500/10' : 'border-blue-500/15'
                  }`}>
                    <select
                      value={selectedCountryCode}
                      onChange={(e) => setSelectedCountryCode(e.target.value)}
                      className={`pl-3.5 pr-8 py-3 text-sm bg-transparent outline-none cursor-pointer font-bold appearance-none ${
                        isDark 
                          ? 'text-gray-200 bg-[#051926]' 
                          : 'text-slate-800 bg-slate-50'
                      }`}
                      style={{ minWidth: '95px' }}
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code} className={isDark ? 'bg-slate-900 text-gray-200' : 'bg-white text-slate-800'}>
                          {c.flag} {c.dial} ({c.name})
                        </option>
                      ))}
                    </select>
                    <span className={`absolute right-2.5 pointer-events-none ${isDark ? 'text-green-500/60' : 'text-blue-500/60'}`}>
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </span>
                  </div>
                  <input
                    type="tel"
                    id="input-phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t('contact-phone-ph')}
                    className="flex-1 px-4 py-3 bg-transparent outline-none transition-all text-base font-semibold placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Service of Interest (Select) */}
              <div id="field-service-container" className="flex flex-col gap-2">
                <label htmlFor="select-service" className={`text-sm font-bold uppercase tracking-wider pl-1 transition-colors duration-500 ${
                  isDark ? 'text-gray-200' : 'text-slate-600'
                }`}>
                  {t('contact-service')}
                </label>
                <select
                  id="select-service"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border transition-all text-base font-semibold appearance-none cursor-pointer focus:outline-none focus:ring-1 ${
                    isDark
                      ? 'bg-[#051926]/80 border-green-500/10 text-gray-200 focus:border-green-400 focus:ring-green-400'
                      : 'bg-slate-50 border-blue-500/15 text-slate-800 focus:border-blue-600 focus:ring-blue-600'
                  }`}
                  style={{ 
                    backgroundImage: isDark
                      ? `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%233FE03E'><path d='M8 10L4 6h8z'/></svg>")`
                      : `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%232563EB'><path d='M8 10L4 6h8z'/></svg>")`, 
                    backgroundPosition: 'right 16px center', 
                    backgroundRepeat: 'no-repeat' 
                  }}
                >
                  <option value="" className={isDark ? "bg-[#0c253a] text-gray-300" : "bg-white text-slate-700"} disabled>{t('contact-service-ph')}</option>
                  <option value={t('service-web')} className={isDark ? "bg-[#0c253a]" : "bg-white"}>{t('service-web')}</option>
                  <option value={t('service-mobile')} className={isDark ? "bg-[#0c253a]" : "bg-white"}>{t('service-mobile')}</option>
                  <option value={t('service-other')} className={isDark ? "bg-[#0c253a]" : "bg-white"}>{t('service-other')}</option>
                </select>
              </div>

              {/* Estimated Deadline (Select) */}
              <div id="field-deadline-container" className="flex flex-col gap-2">
                <label htmlFor="select-deadline" className={`text-sm font-bold uppercase tracking-wider pl-1 transition-colors duration-500 ${
                  isDark ? 'text-gray-200' : 'text-slate-600'
                }`}>
                  {t('contact-deadline')}
                </label>
                <select
                  id="select-deadline"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border transition-all text-base font-semibold appearance-none cursor-pointer focus:outline-none focus:ring-1 ${
                    isDark
                      ? 'bg-[#051926]/80 border-green-500/10 text-gray-200 focus:border-green-400 focus:ring-green-400'
                      : 'bg-slate-50 border-blue-500/15 text-slate-800 focus:border-blue-600 focus:ring-blue-600'
                  }`}
                  style={{ 
                    backgroundImage: isDark
                      ? `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%233FE03E'><path d='M8 10L4 6h8z'/></svg>")`
                      : `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%232563EB'><path d='M8 10L4 6h8z'/></svg>")`, 
                    backgroundPosition: 'right 16px center', 
                    backgroundRepeat: 'no-repeat' 
                  }}
                >
                  <option value="" className={isDark ? "bg-[#0c253a] text-gray-300" : "bg-white text-slate-700"} disabled>{t('contact-deadline-ph')}</option>
                  <option value={t('deadline-urgent')} className={isDark ? "bg-[#0c253a]" : "bg-white"}>{t('deadline-urgent')}</option>
                  <option value={t('deadline-normal')} className={isDark ? "bg-[#0c253a]" : "bg-white"}>{t('deadline-normal')}</option>
                  <option value={t('deadline-long')} className={isDark ? "bg-[#0c253a]" : "bg-white"}>{t('deadline-long')}</option>
                </select>
              </div>

              {/* Project Details (Textarea - spans full row) */}
              <div id="field-details-container" className="flex flex-col gap-2 md:col-span-2">
                <label htmlFor="textarea-details" className={`text-sm font-bold uppercase tracking-wider pl-1 transition-colors duration-500 ${
                  isDark ? 'text-gray-200' : 'text-slate-600'
                }`}>
                  {t('contact-details')} <span className={isDark ? 'text-green-500' : 'text-blue-600'}>*</span>
                </label>
                <textarea
                  id="textarea-details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder={t('contact-details-ph')}
                  rows={5}
                  required
                  className={`w-full px-4 py-3 rounded-xl border transition-all text-base font-semibold placeholder-slate-400 resize-y focus:outline-none focus:ring-1 ${
                    isDark
                      ? 'bg-[#051926]/80 border-green-500/10 text-gray-200 focus:border-green-400 focus:ring-green-400'
                      : 'bg-slate-50 border-blue-500/15 text-slate-800 focus:border-blue-600 focus:ring-blue-600'
                  }`}
                />
              </div>

            </div>

            {/* Action Buttons Grid */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {/* Submit Button */}
              <button
                id="submit-contact-form"
                type="submit"
                className={`w-full flex items-center justify-center gap-3.5 py-4.5 px-6 rounded-2xl text-lg font-black transition-all duration-300 shadow-lg active:scale-95 cursor-pointer ${
                  isDark
                    ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-[#051A2F] shadow-green-500/10 hover:shadow-green-500/30 hover:-translate-y-0.5'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-105 text-white shadow-blue-600/10 hover:shadow-blue-600/25 hover:-translate-y-0.5'
                }`}
              >
                <Send className="w-5 h-5" />
                <span>{t('contact-submit')}</span>
              </button>

              {/* Schedule Button */}
              <button
                type="button"
                onClick={() => {
                  if (!name.trim() || !email.trim() || !phone.trim()) {
                    setAlertMessage(language === 'es' 
                      ? 'Por favor completa Nombre, Correo y Teléfono en el formulario de contacto para agendar la reunión.' 
                      : 'Please fill in your Name, Email, and Phone in the contact form first.');
                    setAlertOpen(true);
                    return;
                  }

                  const countryObj = COUNTRIES.find(c => c.code === selectedCountryCode);
                  const dialCode = countryObj ? countryObj.dial : '';
                  const fullPhone = `${dialCode} ${phone.trim()}`;

                  window.dispatchEvent(new CustomEvent('open-ai-chat-only', {
                    detail: { name: name.trim(), email: email.trim(), phone: fullPhone.trim() }
                  }));
                }}
                className={`w-full flex items-center justify-center gap-3.5 py-4.5 px-6 rounded-2xl text-lg font-black transition-all duration-300 shadow-lg active:scale-95 cursor-pointer border ${
                  isDark
                    ? 'bg-transparent border-green-500/30 text-green-400 hover:bg-green-500/10 shadow-green-500/5 hover:-translate-y-0.5'
                    : 'bg-transparent border-blue-600/20 text-blue-600 hover:bg-blue-50 shadow-blue-600/5 hover:-translate-y-0.5'
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span>{language === 'es' ? 'Agendar Reunión' : 'Schedule Meeting'}</span>
              </button>
            </div>

          </form>
        </div>

        <AnimatePresence>
          {alertOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setAlertOpen(false)}
                className="fixed inset-0 bg-[#00050a]/40 backdrop-blur-sm"
              />

              {/* Content Box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className={`relative w-full max-w-sm p-6 rounded-2xl border shadow-xl backdrop-blur-xl text-center space-y-4 ${
                  isDark
                    ? 'bg-[#030914]/95 border-slate-800 text-white shadow-emerald-950/20'
                    : 'bg-white/95 border-slate-200 text-slate-800 shadow-slate-200/50'
                }`}
              >
                <div className="flex justify-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${
                    isDark
                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                      : 'bg-amber-50 border-amber-200 text-amber-600'
                  }`}>
                    <AlertCircle className="w-6 h-6" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold uppercase tracking-wider">
                    {language === 'es' ? 'Atención' : 'Attention'}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                    {alertMessage}
                  </p>
                </div>
                <button
                  onClick={() => setAlertOpen(false)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-md ${
                    isDark
                      ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {language === 'es' ? 'Entendido' : 'Got it'}
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
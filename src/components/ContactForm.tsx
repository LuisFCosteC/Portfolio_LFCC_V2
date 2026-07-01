import React, { useState } from 'react';
import { MessageSquareText, Send } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import { useTheme } from '../context/ThemeContext';
import { useRevealOnScroll } from '../hooks/use-reveal-on-scroll';

export default function ContactForm() {
  const { t, language } = useTranslation();
  const { theme } = useTheme();
  const [containerRef, isVisible] = useRevealOnScroll<HTMLElement>({ threshold: 0.1 });

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('');
  const [deadline, setDeadline] = useState('');
  const [details, setDetails] = useState('');

  const isDark = theme === 'dark';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate main required fields
    if (!name || !email || !details) {
      alert(language === 'es' ? 'Por favor completa los campos requeridos.' : 'Please fill in all required fields.');
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

    const message = `${intro}
 
*${language === 'es' ? 'Nombre' : 'Name'}:* ${name}
*${emailLabel}:* ${email}
*${phoneLabel}:* ${phone || 'N/A'}
*${serviceLabel}:* ${service || 'N/A'}
*${deadlineLabel}:* ${deadline || 'N/A'}
 
*${detailsLabel}:*
${details}`;

    // Encode message and open WhatsApp link
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/573116463033?text=${encodedMessage}`;
    
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
                  {t('contact-name')} <span className="text-green-500">*</span>
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
                  {t('contact-email')} <span className="text-green-500">*</span>
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
              <div id="field-phone-container" className="flex flex-col gap-2">
                <label htmlFor="input-phone" className={`text-sm font-bold uppercase tracking-wider pl-1 transition-colors duration-500 ${
                  isDark ? 'text-gray-200' : 'text-slate-600'
                }`}>
                  {t('contact-phone')}
                </label>
                <input
                  type="tel"
                  id="input-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t('contact-phone-ph')}
                  className={`w-full px-4 py-3 rounded-xl border transition-all text-base font-semibold placeholder-slate-400 focus:outline-none focus:ring-1 ${
                    isDark
                      ? 'bg-[#051926]/80 border-green-500/10 text-gray-200 focus:border-green-400 focus:ring-green-400'
                      : 'bg-slate-50 border-blue-500/15 text-slate-800 focus:border-blue-600 focus:ring-blue-600'
                  }`}
                />
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
              <div id="field-deadline-container" className="flex flex-col gap-2 md:col-span-2">
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
                  {t('contact-details')} <span className="text-green-500">*</span>
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

            {/* Submit Button */}
            <button
              id="submit-contact-form"
              type="submit"
              className={`mt-4 flex items-center justify-center gap-3.5 py-4.5 px-6 rounded-2xl text-lg font-black transition-all duration-300 shadow-lg active:scale-95 cursor-pointer ${
                isDark
                  ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-[#051A2F] shadow-green-500/10 hover:shadow-green-500/30 hover:-translate-y-0.5'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-105 text-white shadow-blue-600/10 hover:shadow-blue-600/25 hover:-translate-y-0.5'
              }`}
            >
              <Send className="w-5 h-5" />
              <span>{t('contact-submit')}</span>
            </button>

          </form>
        </div>

      </div>
    </section>
  );
}
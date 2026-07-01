import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { useTheme } from '../context/ThemeContext';
import { Send, Bot, User, Sparkles, MessageSquare, CornerDownLeft, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export default function AiChatSection() {
  const { t, language } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-msg',
      sender: 'bot',
      text: t('ai-initial-msg'),
      timestamp: new Date()
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update initial message text when language changes
  useEffect(() => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === 'init-msg' 
          ? { ...msg, text: t('ai-initial-msg') } 
          : msg
      )
    );
  }, [language, t]);

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const suggestedQuestions = [
    t('ai-suggested-1'),
    t('ai-suggested-2'),
    t('ai-suggested-3'),
    t('ai-suggested-4'),
  ];

  // Simulated AI Knowledge Base
  const getSimulatedAiResponse = (query: string, lang: 'es' | 'en'): string => {
    const q = query.toLowerCase().trim();

    // 1. Technologies / Skills
    if (
      q.includes('tecnología') || q.includes('tecnologia') || q.includes('stack') ||
      q.includes('habilidad') || q.includes('programar') || q.includes('lenguaje') ||
      q.includes('conoce') || q.includes('domina') || q.includes('sabe') ||
      q.includes('technology') || q.includes('skill') || q.includes('program') ||
      q.includes('framework') || q.includes('database') || q.includes('base de datos')
    ) {
      if (lang === 'es') {
        return `Luis Fernando domina un Stack Tecnológico robusto y moderno:
• **Frontend**: React (con Vite), Angular (arquitectura modular), TypeScript, HTML5, CSS3, Tailwind CSS y animaciones fluidas con Motion.
• **Backend**: ASP.NET Core (arquitectura limpia en capas con C#), Node.js (con Express), Python (con FastAPI para procesamiento concurrente asíncrono).
• **Bases de Datos & Persistencia**: SQL Server, MySQL, LibSQL y SQLite.
• **Herramientas & Entornos**: Git, GitHub, Docker, APIs RESTful, WebSockets, inyección de dependencias y patrones de repositorio genérico.`;
      } else {
        return `Luis Fernando is highly proficient in a robust, modern Technical Stack:
• **Frontend**: React (Vite), Angular (modular components), TypeScript, HTML5, CSS3, Tailwind CSS, and fluid animations using Motion.
• **Backend**: ASP.NET Core (clean architecture in C#), Node.js (Express), Python (FastAPI for asynchronous concurrent task processing).
• **Databases & Persistence**: SQL Server, MySQL, LibSQL, and SQLite.
• **Tools & Ecosystem**: Git, GitHub, Docker, RESTful APIs, WebSockets, Dependency Injection, and Generic Repository patterns.`;
      }
    }

    // 2. Excel Certification / Intermediate Excel / Certifications
    if (
      q.includes('excel') || q.includes('certificado') || q.includes('certificacion') ||
      q.includes('cisco') || q.includes('meta') || q.includes('udemy') ||
      q.includes('certificate') || q.includes('certification') || q.includes('credentials')
    ) {
      if (lang === 'es') {
        return `Luis cuenta con múltiples certificaciones destacadas:
• **Excel Intermedio**: Emitido por *Compensar & EDU* el 03 de junio de 2023. El certificado oficial está cargado directamente en esta plataforma como PDF.
• **Desarrollo Android**: *Meta* (Introducción al Desarrollo de Apps Móviles Android).
• **Fundamentos de JavaScript 1**: *Cisco Networking Academy*.
• **Python Essentials 1**: *Cisco Networking Academy*.
• **C# TOTAL**: Programador Experto en 28 días (*Udemy*).
• **Fundamentos Profesionales de Desarrollo de Software & Análisis de Datos**: *Microsoft y LinkedIn*.
• **SQL con MySQL 8**: *Udemy*.`;
      } else {
        return `Luis has achieved several prominent professional certifications:
• **Intermediate Excel**: Issued by *Compensar & EDU* on June 03, 2023. The official PDF credential is directly viewable on this platform.
• **Android Development**: *Meta* (Introduction to Android Mobile App Development).
• **JavaScript Essentials 1**: *Cisco Networking Academy*.
• **Python Essentials 1**: *Cisco Networking Academy*.
• **C# TOTAL**: Expert Programmer in 28 Days (*Udemy*).
• **Professional Career Essentials in Software Development & Data Analysis**: *Microsoft and LinkedIn*.
• **SQL with MySQL 8**: *Udemy*.`;
      }
    }

    // 3. Projects
    if (
      q.includes('proyecto') || q.includes('desarrollado') || q.includes('trabajo') ||
      q.includes('creado') || q.includes('hecho') || q.includes('aplicacion') ||
      q.includes('project') || q.includes('portfolio') || q.includes('built') ||
      q.includes('app') || q.includes('developed') || q.includes('ecokraft') ||
      q.includes('erp') || q.includes('pokedex') || q.includes('rick')
    ) {
      if (lang === 'es') {
        return `Luis Fernando ha desarrollado varios proyectos de gran envergadura técnica, entre ellos:
1. **EcoKraft Solutions**: Plataforma híbrida de empaque sostenible desarrollada con Next.js App Router, componentes de servidor (RSC) y automatizaciones de IA con Genkit.
2. **Sistema ERP Decoupled de Ventas e Inventario**: Arquitectura en capas desacopladas con un backend robusto en ASP.NET Core (C#) y un frontend reactivo en Angular.
3. **Enterprise Real-Time Socket Interconnection Engine**: Servidor Express de baja latencia con WebSockets full-duplex y persistencia atómica con LibSQL.
4. **Sistema Asíncrono de Consulta Pokédex**: BFF de alto rendimiento desarrollado en Python y FastAPI para llamadas concurrentes eficientes.
5. **Sistema de Gestión de Empleados**: Aplicación Full-Stack con Node.js, Express y base de datos relacional MySQL.

Puedes explorar las vistas previas en video de cada proyecto en la sección **Proyectos** más arriba.`;
      } else {
        return `Luis Fernando has developed several high-profile technical projects, including:
1. **EcoKraft Solutions**: Hybrid sustainability platform utilizing Next.js App Router, React Server Components (RSC), and native AI pipelines with Genkit.
2. **Enterprise Decoupled ERP (Sales & Inventory)**: Decoupled layered architecture with a robust C# ASP.NET Core backend and a reactive Angular frontend.
3. **Enterprise Real-Time Socket Interconnection Engine**: Low-latency event-driven WebSockets server with atomic auditing on LibSQL.
4. **Asynchronous Pokédex Discovery Engine**: Highly concurrent Python FastAPI BFF designed for parallelized API orchestration.
5. **Full-Stack Employee Management System**: Full-stack application built with React, Node.js, Express, and a MySQL relational database.

You can watch high-fidelity video walkthroughs of these projects in the **Projects** section above.`;
      }
    }

    // 4. Contact / How to get in touch
    if (
      q.includes('contact') || q.includes('correo') || q.includes('whatsapp') ||
      q.includes('telefono') || q.includes('teléfono') || q.includes('escribir') ||
      q.includes('llamar') || q.includes('email') || q.includes('phone') ||
      q.includes('get in touch') || q.includes('social') || q.includes('redes')
    ) {
      if (lang === 'es') {
        return `¡Ponerse en contacto con Luis Fernando es muy sencillo! Aquí tienes sus datos directos:
• **WhatsApp**: [+57 311 6463033](https://wa.me/573116463033) (¡o haz clic en el botón flotante abajo a la derecha!)
• **Correo Electrónico**: [luisfcostec@gmail.com](mailto:luisfcostec@gmail.com)
• **LinkedIn**: [linkedin.com/in/luisfcostec](https://linkedin.com/in/luisfcostec)
• **GitHub**: [github.com/luisfcostec](https://github.com/luisfcostec)

También puedes dejar un mensaje detallado rellenando el **Formulario de Contacto** al final de la página.`;
      } else {
        return `Getting in touch with Luis Fernando is quick and easy! Here are his contact details:
• **WhatsApp**: [+57 311 6463033](https://wa.me/573116463033) (or just click the green WhatsApp icon in the bottom right!)
• **Email**: [luisfcostec@gmail.com](mailto:luisfcostec@gmail.com)
• **LinkedIn**: [linkedin.com/in/luisfcostec](https://linkedin.com/in/luisfcostec)
• **GitHub**: [github.com/luisfcostec](https://github.com/luisfcostec)

You can also submit a detailed project inquiry by filling out the **Contact Form** at the bottom of the page.`;
      }
    }

    // 5. General Profile / Who is he
    if (lang === 'es') {
      return `Luis Fernando Coste Contreras es un Desarrollador de Software enfocado en la excelencia técnica, la separación de conceptos (SoC) y las arquitecturas limpias y escalables. 

Tiene gran habilidad combinando backend estructurado (ASP.NET Core C#, Python, Node) con frontend pulido (React, Angular). Su perfil se destaca por optimizar bases de datos, implementar sockets en tiempo real y diseñar experiencias de usuario altamente accesibles.

¿Te gustaría saber más sobre algún aspecto en específico? Prueba preguntando por sus **tecnologías**, **certificaciones** o sus **proyectos**.`;
    } else {
      return `Luis Fernando Coste Contreras is a Software Developer dedicated to technical excellence, separation of concerns (SoC), and clean, scalable architectures.

He is highly skilled in bridging structured backend layers (ASP.NET Core C#, Python, Node) with pixel-perfect, interactive frontends (React, Angular). His professional focus centers on database optimization, real-time WebSocket communication, and responsive UI accessibility.

Would you like to know more about a specific topic? Try asking about his **technologies**, **certifications**, or **projects**!`;
    }
  };

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputVal('');
    setIsTyping(true);

    // Simulate AI thinking and responding
    setTimeout(() => {
      /* 
         DEVELOPER NOTE:
         When you build your real backend API, you can replace the simulation code below with an actual fetch request:
         
         try {
           const response = await fetch('/api/chat', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ message: textToSend, language })
           });
           const data = await response.json();
           const botText = data.reply;
           ...
         } catch(e) { ... }
      */
      const botReplyText = getSimulatedAiResponse(textToSend, language);
      const botMessage: Message = {
        id: `msg-${Date.now()}-bot`,
        sender: 'bot',
        text: botReplyText,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputVal);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <section
      id="ai-assistant"
      className={`py-20 sm:py-28 relative overflow-hidden transition-colors duration-500 border-t ${
        isDark 
          ? 'bg-[#010a15] border-green-500/10' 
          : 'bg-slate-50 border-slate-200'
      }`}
    >
      {/* Background radial gradient accent */}
      <div 
        id="ai-radial-accent"
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none opacity-20 -z-10 ${
          isDark ? 'bg-green-500/30' : 'bg-blue-400/30'
        }`}
      />

      <div id="ai-container" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div id="ai-header" className="text-center mb-10 sm:mb-14">
          <motion.div
            id="ai-badge"
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase mb-4 border ${
              isDark
                ? 'bg-green-500/10 border-green-500/20 text-green-400 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                : 'bg-blue-500/10 border-blue-500/20 text-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.05)]'
            }`}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>AI CO-PILOT</span>
          </motion.div>

          <motion.h2
            id="ai-title-h2"
            className={`text-3xl sm:text-4xl font-black tracking-tight mb-4 transition-colors duration-500 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {t('ai-title')}
          </motion.h2>

          <motion.p
            id="ai-subtitle-p"
            className={`text-sm sm:text-base max-w-2xl mx-auto leading-relaxed transition-colors duration-500 ${
              isDark ? 'text-gray-400' : 'text-slate-600'
            }`}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t('ai-subtitle')}
          </motion.p>
        </div>

        {/* Chat UI Frame */}
        <motion.div
          id="ai-chat-card"
          className={`rounded-3xl border shadow-2xl overflow-hidden backdrop-blur-md flex flex-col h-[520px] transition-all duration-500 ${
            isDark
              ? 'bg-[#031122]/85 border-green-500/25 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(16,185,129,0.05)]'
              : 'bg-white border-slate-200 shadow-[0_20px_50px_rgba(37,99,235,0.06),0_4px_12px_rgba(0,0,0,0.03)]'
          }`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Card Header Status */}
          <div
            id="ai-chat-header-status"
            className={`px-6 py-4 border-b flex items-center justify-between transition-colors duration-500 ${
              isDark ? 'border-green-500/10 bg-[#04162e]/40' : 'border-slate-100 bg-slate-50/50'
            }`}
          >
            <div id="ai-header-profile" className="flex items-center gap-3">
              <div
                id="ai-bot-avatar"
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                  isDark ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-600'
                }`}
              >
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`text-sm font-bold transition-colors ${isDark ? 'text-gray-100' : 'text-slate-800'}`}>
                  Luis's Advisor AI
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full animate-ping ${isDark ? 'bg-green-400' : 'bg-blue-500'}`} />
                  <span className={`text-[10px] font-mono uppercase tracking-widest font-semibold ${
                    isDark ? 'text-green-400' : 'text-blue-600'
                  }`}>
                    {language === 'es' ? 'EN LÍNEA' : 'ONLINE'}
                  </span>
                </div>
              </div>
            </div>

            <span className={`text-[10px] font-mono font-bold transition-colors ${
              isDark ? 'text-gray-500' : 'text-slate-400'
            }`}>
              MODEL: PROTOTYPE-V1
            </span>
          </div>

          {/* Chat Messages Body */}
          <div
            id="ai-chat-body"
            className={`flex-1 overflow-y-auto p-6 flex flex-col gap-4 scrollbar-thin ${
              isDark ? 'scrollbar-thumb-slate-800 scrollbar-track-transparent' : 'scrollbar-thumb-slate-200 scrollbar-track-transparent'
            }`}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                id={`chat-wrapper-${msg.id}`}
                className={`flex gap-3 max-w-[85%] ${
                  msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'
                }`}
              >
                {/* Avatar icon */}
                <div
                  id={`avatar-wrapper-${msg.id}`}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                    msg.sender === 'user'
                      ? (isDark ? 'bg-slate-800 border-slate-700 text-gray-300' : 'bg-slate-100 border-slate-200 text-slate-700')
                      : (isDark ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-600')
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div id={`bubble-wrapper-${msg.id}`} className="flex flex-col gap-1">
                  <div
                    id={`bubble-${msg.id}`}
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap transition-all shadow-sm ${
                      msg.sender === 'user'
                        ? (isDark 
                            ? 'bg-slate-800 text-gray-100 rounded-tr-none border border-slate-700' 
                            : 'bg-slate-100 text-slate-800 rounded-tr-none border border-slate-200')
                        : (isDark 
                            ? 'bg-[#041d33]/50 text-gray-200 rounded-tl-none border border-green-500/15' 
                            : 'bg-blue-500/[0.03] text-slate-800 rounded-tl-none border border-blue-500/15')
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className={`text-[9px] font-mono self-end pr-1 transition-colors ${
                    isDark ? 'text-gray-600' : 'text-slate-400'
                  }`}>
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div id="ai-typing-indicator" className="flex gap-3 max-w-[80%] self-start">
                <div
                  id="ai-typing-avatar"
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                    isDark ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-600'
                  }`}
                >
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
                <div
                  id="ai-typing-bubble"
                  className={`px-4 py-3 rounded-2xl rounded-tl-none border flex items-center gap-1.5 ${
                    isDark ? 'bg-[#041d33]/40 border-green-500/15' : 'bg-blue-500/[0.03] border-blue-500/15'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${isDark ? 'bg-green-400' : 'bg-blue-600'}`} style={{ animationDelay: '0ms' }} />
                  <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${isDark ? 'bg-green-400' : 'bg-blue-600'}`} style={{ animationDelay: '150ms' }} />
                  <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${isDark ? 'bg-green-400' : 'bg-blue-600'}`} style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div id="ai-chat-bottom-anchor" ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Questions */}
          <div
            id="ai-quick-suggestions"
            className={`px-6 py-3 border-t transition-colors ${
              isDark ? 'border-green-500/10 bg-[#030e1c]/50' : 'border-slate-100 bg-slate-50/30'
            }`}
          >
            <span className={`text-[10px] font-mono uppercase tracking-widest font-bold block mb-2 transition-colors ${
              isDark ? 'text-gray-500' : 'text-slate-400'
            }`}>
              {t('ai-suggested-title')}
            </span>
            <div id="ai-suggestions-list" className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  id={`suggested-btn-${idx}`}
                  onClick={() => handleSendMessage(q)}
                  disabled={isTyping}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                    isDark
                      ? 'bg-green-500/5 border-green-500/10 text-green-400 hover:bg-green-500/15 hover:border-green-500/30'
                      : 'bg-blue-500/[0.04] border-blue-500/10 text-blue-600 hover:bg-blue-500/10 hover:border-blue-500/30'
                  } disabled:opacity-50 disabled:pointer-events-none`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Message Input Form */}
          <form
            id="ai-chat-input-form"
            onSubmit={handleFormSubmit}
            className={`p-4 border-t flex gap-3 transition-colors ${
              isDark ? 'border-green-500/10 bg-[#030e1c]' : 'border-slate-100 bg-white'
            }`}
          >
            <input
              type="text"
              id="ai-chat-input-text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={t('ai-placeholder')}
              disabled={isTyping}
              className={`flex-1 px-5 py-3 rounded-2xl text-sm font-semibold transition-all focus:outline-none focus:ring-2 border ${
                isDark
                  ? 'bg-[#041326] border-slate-800 text-gray-100 focus:ring-green-500/30 focus:border-green-500/40 focus:bg-[#051830]'
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-blue-500/20 focus:border-blue-500/40 focus:bg-white'
              } disabled:opacity-60`}
            />

            <button
              type="submit"
              id="ai-chat-submit-btn"
              disabled={!inputVal.trim() || isTyping}
              className={`px-5 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50 disabled:pointer-events-none ${
                isDark
                  ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-[#051A2F]'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white'
              }`}
            >
              <span>{t('ai-send')}</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>

        {/* Informative Note */}
        <div id="ai-chat-disclaimer" className="text-center mt-4">
          <p className={`text-[10px] font-mono transition-colors ${
            isDark ? 'text-gray-600' : 'text-slate-400'
          }`}>
            {t('ai-api-note')}
          </p>
        </div>

      </div>
    </section>
  );
}
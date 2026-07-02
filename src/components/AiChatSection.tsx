import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Sparkles, ClipboardList, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import { useTheme } from '../context/ThemeContext';

interface Message {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    timestamp: Date;
}

export default function AiChatSection() {
    const { language, t } = useTranslation();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputVal, setInputVal] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showQuoteForm, setShowQuoteForm] = useState(false);

    // Form Fields for Lead Capture
    const [formName, setFormName] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [formDesc, setFormDesc] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formError, setFormError] = useState('');

    const chatEndRef = useRef<HTMLDivElement>(null);

    // Set initial welcome message based on language
    useEffect(() => {
        setMessages([
            {
                id: 'init-msg',
                sender: 'bot',
                text: t('ai-welcome'),
                timestamp: new Date()
            }
        ]);
    }, [language]);

    // Scroll to bottom on new messages or typing state change
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping, showQuoteForm, formSubmitted]);

    const handleSendMessage = (textToSend: string) => {
        if (!textToSend.trim() || isTyping) return;

        const userMessage: Message = {
            id: `msg-${Date.now()}-user`,
            sender: 'user',
            text: textToSend,
            timestamp: new Date()
        };

        // 1. Añadimos el mensaje del usuario en pantalla inmediatamente
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInputVal('');
        setIsTyping(true);

        // 2. ESTRUCTURA DISPONIBLE: Así es como viajarán tus datos a tu futura API intermedia
        const payloadParaTuFuturaAPI = {
            message: textToSend,
            history: updatedMessages
                .filter((msg) => msg.id !== 'init-msg') // Limpiamos el mensaje de bienvenida
                .map((msg) => ({
                    role: msg.sender === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.text }] // Estructura exacta que exige el SDK oficial
                }))
        };

        // Imprime en consola para que verifiques que el contrato de datos está listo
        console.log("Payload listo para tu futura API Intermedia:", payloadParaTuFuturaAPI);

        // 3. Simulación temporal local adaptada al Prompt de Robotino
        setTimeout(() => {
            const lowerInput = textToSend.toLowerCase();
            const isEnglish = language !== 'es' || lowerInput.match(/(hello|hi|quote|website|app|developer|portfolio|english|uk|us)/);

            let botResponse = '';

            if (isEnglish) {
                botResponse = `[Robotino - UI Ready]: I have received your message: "${textToSend}". Once you connect your intermediate API, I will process this in real-time with Google AI Studio.`;

                if (
                    lowerInput.includes('quote') ||
                    lowerInput.includes('price') ||
                    lowerInput.includes('budget') ||
                    lowerInput.includes('website') ||
                    lowerInput.includes('app') ||
                    lowerInput.includes('software') ||
                    lowerInput.includes('develop') ||
                    lowerInput.includes('zapatos') ||
                    lowerInput.includes('shoes') ||
                    lowerInput.includes('cotizar')
                ) {
                    botResponse = `Excellent choice! I would love to help you bring your software idea to life. To provide you with a formal quote, tailor your project, and offer the best technical consulting, please share your details in the interactive form that will appear below.`;
                }
            } else {
                botResponse = `[Robotino - UI Lista]: He recibido tu mensaje: "${textToSend}". Cuando conectes tu API intermedia, procesaré esta información en tiempo real con Google AI Studio.`;

                if (
                    lowerInput.includes('cotizar') ||
                    lowerInput.includes('zapatos') ||
                    lowerInput.includes('pagina web') ||
                    lowerInput.includes('app') ||
                    lowerInput.includes('aplicacion') ||
                    lowerInput.includes('presupuesto') ||
                    lowerInput.includes('desarrollo') ||
                    lowerInput.includes('precio')
                ) {
                    botResponse = `¡Excelente elección! Me encantaría ayudarte a dar vida a tu idea de software. Para poder brindarte una cotización formal, detallar tu proyecto y darte la mejor asesoría técnica, por favor comparte tus datos en el formulario que se activará a continuación.`;
                }
            }

            setMessages((prev) => [...prev, {
                id: `msg-${Date.now()}-bot`,
                sender: 'bot',
                text: botResponse,
                timestamp: new Date()
            }]);
            setIsTyping(false);

            // El Front reacciona al token exacto del Prompt de Google AI Studio
            if (botResponse.includes('brindarte una cotización') || botResponse.includes('provide you with a formal quote')) {
                setShowQuoteForm(true);
            }
        }, 1200);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSendMessage(inputVal);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');

        if (!formName.trim() || !formEmail.trim() || !formDesc.trim()) {
            setFormError(language === 'es' ? 'Por favor completa todos los campos obligatorios.' : 'Please fill out all required fields.');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(formEmail)) {
            setFormError(language === 'es' ? 'Por favor introduce un correo válido.' : 'Please enter a valid email address.');
            return;
        }

        // Capture the lead
        const newLead = {
            name: formName,
            email: formEmail,
            description: formDesc,
            timestamp: new Date().toISOString()
        };

        console.log("¡Nuevo Lead capturado por el Consultor IA!", newLead);

        // Save lead locally to simulate state persistence
        const existingLeads = JSON.parse(localStorage.getItem('lfcc-portfolio-leads') || '[]');
        existingLeads.push(newLead);
        localStorage.setItem('lfcc-portfolio-leads', JSON.stringify(existingLeads));

        setFormSubmitted(true);

        setTimeout(() => {
            // Add success message in chat from the assistant
            const successText = language === 'es'
                ? `¡Muchas gracias, ${formName}! He registrado tus datos correctamente. He guardado tu descripción: "${formDesc.substring(0, 80)}...". Luis se pondrá en contacto contigo muy pronto a tu correo (${formEmail}) para enviarte la propuesta.`
                : `Thank you very much, ${formName}! I have successfully registered your details. I saved your description: "${formDesc.substring(0, 80)}...". Luis will contact you very soon at your email address (${formEmail}) to coordinate a proposal.`;

            setMessages((prev) => [...prev, {
                id: `msg-${Date.now()}-bot-success`,
                sender: 'bot',
                text: successText,
                timestamp: new Date()
            }]);

            // Reset form states
            setFormName('');
            setFormEmail('');
            setFormDesc('');
            setFormSubmitted(false);
            setShowQuoteForm(false);
        }, 1500);
    };

    return (
        <section id="ai-assistant" className="py-20 relative z-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Heading */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-3 backdrop-blur-md border shadow-sm select-none bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    >
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                        <span>AI Studio Integration</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className={`text-3xl sm:text-4xl font-sans font-bold tracking-tight mb-4 ${isDark ? 'text-white' : 'text-slate-900'
                            }`}
                    >
                        {t('ai-title')}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-sm max-w-lg mx-auto text-slate-400"
                    >
                        {t('ai-subtitle')}
                    </motion.p>
                </div>

                {/* Chat Widget Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className={`w-full rounded-2xl border overflow-hidden backdrop-blur-xl shadow-2xl flex flex-col h-[550px] sm:h-[600px] transition-all duration-300 ${isDark
                            ? 'bg-[#030914]/75 border-slate-800/80 shadow-emerald-950/20'
                            : 'bg-white/80 border-slate-200 shadow-slate-200/50'
                        }`}
                >
                    {/* Widget Header */}
                    <div className={`p-4 flex items-center justify-between border-b shrink-0 ${isDark ? 'border-slate-800/80 bg-slate-950/50' : 'border-slate-200 bg-slate-50/50'
                        }`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border relative ${isDark
                                    ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-400'
                                    : 'bg-blue-500/10 border-blue-500/35 text-blue-600'
                                }`}>
                                <Bot className="w-5.5 h-5.5" />
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 rounded-full border-slate-950 animate-ping" />
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 rounded-full border-slate-950" />
                            </div>
                            <div>
                                <h4 className={`text-sm font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    Asistente para Luis
                                </h4>
                                <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                    {language === 'es' ? 'En línea // Listo para simular API' : 'Online // Ready to simulate API'}
                                </p>
                            </div>
                        </div>

                        <div className={`text-[10px] font-mono px-2 py-1 rounded border hidden sm:block ${isDark
                                ? 'bg-slate-900/60 border-slate-800 text-emerald-400'
                                : 'bg-slate-100 border-slate-200 text-blue-600'
                            }`}>
                            SYSTEM: ACTIVE
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 min-h-0 scrollbar-thin">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                                    }`}
                            >
                                {/* Avatar */}
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs border ${msg.sender === 'user'
                                        ? isDark
                                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                                            : 'bg-blue-500/15 border-blue-500/30 text-blue-600'
                                        : isDark
                                            ? 'bg-slate-800 border-slate-700 text-slate-300'
                                            : 'bg-slate-100 border-slate-200 text-slate-600'
                                    }`}>
                                    {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                </div>

                                {/* Bubble */}
                                <div className="space-y-1">
                                    <div className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${msg.sender === 'user'
                                            ? isDark
                                                ? 'bg-emerald-600/15 text-emerald-100 rounded-tr-none border border-emerald-500/25'
                                                : 'bg-blue-600/10 text-slate-900 rounded-tr-none border border-blue-500/20'
                                            : isDark
                                                ? 'bg-slate-900/80 text-slate-100 rounded-tl-none border border-slate-800/80'
                                                : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-200'
                                        }`}>
                                        {msg.text}
                                    </div>
                                    <span className="text-[9px] text-slate-400 block px-1">
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {/* Is Typing Indicator */}
                        {isTyping && (
                            <div className="flex gap-3 max-w-[80%] mr-auto">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'
                                    }`}>
                                    <Bot className="w-4 h-4" />
                                </div>
                                <div className={`p-3.5 rounded-2xl rounded-tl-none border flex items-center gap-1.5 ${isDark ? 'bg-slate-900/80 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                                    }`}>
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        )}

                        {/* Simulated Lead Capture Form overlaying or positioned next inside Chat */}
                        <AnimatePresence>
                            {showQuoteForm && (
                                <motion.div
                                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -15, scale: 0.98 }}
                                    transition={{ duration: 0.4 }}
                                    className={`p-5 rounded-2xl border ${isDark
                                            ? 'bg-emerald-950/20 border-emerald-500/25 shadow-xl shadow-emerald-950/10'
                                            : 'bg-blue-50/70 border-blue-200 shadow-xl'
                                        }`}
                                >
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className={`p-2 rounded-lg shrink-0 ${isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-600'
                                            }`}>
                                            <ClipboardList className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h5 className={`text-sm font-bold ${isDark ? 'text-emerald-300' : 'text-blue-900'}`}>
                                                {t('ai-form-title')}
                                            </h5>
                                            <p className={`text-xs mt-1 ${isDark ? 'text-emerald-200/70' : 'text-slate-600'}`}>
                                                {t('ai-form-desc')}
                                            </p>
                                        </div>
                                    </div>

                                    {formSubmitted ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="py-6 flex flex-col items-center justify-center text-center space-y-3"
                                        >
                                            <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
                                            <p className="text-xs font-semibold text-emerald-300">
                                                {t('ai-form-success')}
                                            </p>
                                        </motion.div>
                                    ) : (
                                        <form onSubmit={handleFormSubmit} className="space-y-3.5">
                                            {formError && (
                                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                                    <span>{formError}</span>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                        {t('ai-form-name')} <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formName}
                                                        onChange={(e) => setFormName(e.target.value)}
                                                        className={`w-full px-3 py-2 text-xs rounded-lg outline-none border transition-all ${isDark
                                                                ? 'bg-slate-950/60 border-slate-800 text-white focus:border-emerald-500/50'
                                                                : 'bg-white border-slate-200 text-slate-800 focus:border-blue-500'
                                                            }`}
                                                        placeholder="John Doe"
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                        {t('ai-form-email')} <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="email"
                                                        value={formEmail}
                                                        onChange={(e) => setFormEmail(e.target.value)}
                                                        className={`w-full px-3 py-2 text-xs rounded-lg outline-none border transition-all ${isDark
                                                                ? 'bg-slate-950/60 border-slate-800 text-white focus:border-emerald-500/50'
                                                                : 'bg-white border-slate-200 text-slate-800 focus:border-blue-500'
                                                            }`}
                                                        placeholder="johndoe@example.com"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                    {t('ai-form-project')} <span className="text-red-500">*</span>
                                                </label>
                                                <textarea
                                                    rows={3}
                                                    value={formDesc}
                                                    onChange={(e) => setFormDesc(e.target.value)}
                                                    className={`w-full px-3 py-2 text-xs rounded-lg outline-none border resize-none transition-all ${isDark
                                                            ? 'bg-slate-950/60 border-slate-800 text-white focus:border-emerald-500/50'
                                                            : 'bg-white border-slate-200 text-slate-800 focus:border-blue-500'
                                                        }`}
                                                    placeholder={language === 'es' ? 'Quiero desarrollar una landing page corporativa...' : 'I want to build a secure e-commerce application...'}
                                                />
                                            </div>

                                            <div className="flex gap-2.5 justify-end pt-1">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowQuoteForm(false)}
                                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border transition-colors ${isDark
                                                            ? 'border-slate-800 text-slate-400 hover:bg-slate-800/40 hover:text-white'
                                                            : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                                                        }`}
                                                >
                                                    {language === 'es' ? 'Cancelar' : 'Cancel'}
                                                </button>
                                                <button
                                                    type="submit"
                                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all shadow-md flex items-center gap-1.5 ${isDark
                                                            ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 active:scale-95'
                                                            : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                                                        }`}
                                                >
                                                    <span>{t('ai-form-submit')}</span>
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div ref={chatEndRef} />
                    </div>

                    {/* Regular Input Bar - Disabled when form is open to focus attention */}
                    <div className={`p-4 border-t flex items-center gap-2 shrink-0 ${isDark ? 'border-slate-800/80 bg-slate-950/40' : 'border-slate-200 bg-slate-50/40'
                        }`}>
                        <input
                            type="text"
                            value={inputVal}
                            onChange={(e) => setInputVal(e.target.value)}
                            onKeyDown={handleKeyPress}
                            disabled={showQuoteForm || isTyping}
                            className={`flex-1 px-4 py-3 rounded-xl text-xs sm:text-sm outline-none border transition-all ${isDark
                                    ? 'bg-slate-950/70 border-slate-800 text-white focus:border-emerald-500/40 placeholder:text-slate-500'
                                    : 'bg-white border-slate-200 text-slate-800 focus:border-blue-500 placeholder:text-slate-400'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                            placeholder={showQuoteForm ? (language === 'es' ? 'Por favor completa el formulario...' : 'Please complete the form...') : t('ai-input-placeholder')}
                        />

                        <button
                            onClick={() => handleSendMessage(inputVal)}
                            disabled={showQuoteForm || isTyping || !inputVal.trim()}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all select-none cursor-pointer border ${isDark
                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 disabled:bg-slate-900 disabled:border-slate-800 disabled:text-slate-600'
                                    : 'bg-blue-500/10 border-blue-500/20 text-blue-600 hover:bg-blue-500/20 disabled:bg-slate-100 disabled:border-slate-200 disabled:text-slate-400'
                                } disabled:cursor-not-allowed`}
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Sparkles, ClipboardList, AlertCircle, LogOut } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import { useTheme } from '../context/ThemeContext';

interface Message {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    timestamp: Date;
}
const getApiUrl = (endpoint: string) => {
  // 1. Intentamos leer la variable inyectada por Vercel/Vite en producción
  const productionUrl = import.meta.env.VITE_APP_URL;
  
  // 2. Si no existe (desarrollo local sin .env), recurrimos al fallback por defecto
  const baseUrl = productionUrl || 'http://localhost:8000';
  
  // Limpieza de slashes para evitar URLs mal formadas como //api/chat
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  return `${cleanBase}${cleanEndpoint}`;
};

// Lightweight Markdown Parser to render beautiful API responses
function parseMarkdownToReact(text: string, isDark: boolean) {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    
    let inCodeBlock = false;
    let codeLanguage = '';
    let codeLines: string[] = [];
    
    // Helper to parse inline styles (**bold**, __bold__, `code`)
    const parseInline = (content: string) => {
        const inlineRegex = /(\*\*.*?\*\*|`.*?`|__.*?__)/g;
        const tokens = content.split(inlineRegex);
        return tokens.map((token, tokenIndex) => {
            if (token.startsWith('**') && token.endsWith('**')) {
                return (
                    <strong key={tokenIndex} className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {token.slice(2, -2)}
                    </strong>
                );
            }
            if (token.startsWith('__') && token.endsWith('__')) {
                return (
                    <strong key={tokenIndex} className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {token.slice(2, -2)}
                    </strong>
                );
            }
            if (token.startsWith('`') && token.endsWith('`')) {
                return (
                    <code key={tokenIndex} className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-semibold ${
                        isDark 
                            ? 'bg-slate-800 text-emerald-400' 
                            : 'bg-slate-100 text-blue-600'
                    }`}>
                        {token.slice(1, -1)}
                    </code>
                );
            }
            return token;
        });
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Code block detection
        if (line.trim().startsWith('```')) {
            if (inCodeBlock) {
                // End code block
                const codeText = codeLines.join('\n');
                elements.push(
                    <pre key={`code-${i}`} className={`p-3 rounded-lg font-mono text-[11px] sm:text-xs overflow-x-auto my-2 border ${
                        isDark 
                            ? 'bg-slate-950/80 border-slate-800 text-slate-200' 
                            : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}>
                        {codeLanguage && (
                            <div className={`text-[9px] uppercase tracking-wider font-bold mb-1 select-none ${
                                isDark ? 'text-slate-500' : 'text-slate-400'
                            }`}>
                                {codeLanguage}
                            </div>
                        )}
                        <code>{codeText}</code>
                    </pre>
                );
                inCodeBlock = false;
                codeLines = [];
                codeLanguage = '';
            } else {
                // Start code block
                inCodeBlock = true;
                codeLanguage = line.trim().slice(3).trim();
            }
            continue;
        }
        
        if (inCodeBlock) {
            codeLines.push(line);
            continue;
        }
        
        const trimmed = line.trim();
        if (!trimmed) {
            elements.push(<div key={`space-${i}`} className="h-2" />);
            continue;
        }

        const headerMatch = trimmed.match(/^(#{1,6})\s+(.*)/);
        const bulletMatch = trimmed.match(/^[\*\-]\s+(.*)/);
        const numberMatch = trimmed.match(/^(\d+)\.\s+(.*)/);

        if (headerMatch) {
            const level = headerMatch[1].length;
            const headingContent = headerMatch[2];
            const classes = level === 1 ? `text-base font-extrabold mt-4 mb-2 ${isDark ? 'text-white' : 'text-slate-900'}` 
                          : level === 2 ? `text-sm font-bold mt-3 mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`
                          : `text-xs font-bold mt-2.5 mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`;
            elements.push(<div key={`header-${i}`} className={classes}>{parseInline(headingContent)}</div>);
            continue;
        }

        // List indentation calculation
        const leadingSpaces = line.length - line.trimStart().length;
        const indentClass = leadingSpaces >= 6 ? 'pl-8' : leadingSpaces >= 4 ? 'pl-6' : leadingSpaces >= 2 ? 'pl-4' : 'pl-2';

        if (bulletMatch) {
            elements.push(
                <div key={`bullet-${i}`} className={`flex gap-2 py-0.5 items-start ${indentClass}`}>
                    <span className={`select-none mt-[6px] shrink-0 w-1.5 h-1.5 rounded-full ${
                        isDark ? 'bg-emerald-400 shadow-sm shadow-emerald-500/50' : 'bg-blue-500 shadow-sm'
                    }`} />
                    <span className="flex-1">{parseInline(bulletMatch[1])}</span>
                </div>
            );
            continue;
        }

        if (numberMatch) {
            elements.push(
                <div key={`number-${i}`} className={`flex gap-2 py-0.5 items-start ${indentClass}`}>
                    <span className={`font-bold select-none text-xs shrink-0 mt-[2px] ${
                        isDark ? 'text-emerald-400' : 'text-blue-600'
                    }`}>{numberMatch[1]}.</span>
                    <span className="flex-1">{parseInline(numberMatch[2])}</span>
                </div>
            );
            continue;
        }

        elements.push(
            <p key={`p-${i}`} className="mb-1.5 last:mb-0 leading-relaxed">
                {parseInline(line)}
            </p>
        );
    }

    return elements;
}

export default function AiChatSection() {
    const { language, t } = useTranslation();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputVal, setInputVal] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // Form Fields for Lead Capture (Gatekeeper)
    const [formName, setFormName] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [formDesc, setFormDesc] = useState('');
    const [formError, setFormError] = useState('');

    // Gatekeeper States
    const [isLeadCaptured, setIsLeadCaptured] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('lfcc-portfolio-active-lead') !== null;
        }
        return false;
    });

    const [activeLead, setActiveLead] = useState<{ name: string; email: string; description: string } | null>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('lfcc-portfolio-active-lead');
            return saved ? JSON.parse(saved) : null;
        }
        return null;
    });

    const [isApiConnected, setIsApiConnected] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Check API connection on load
    useEffect(() => {
        const checkApiConnection = async () => {
            try {
                const res = await fetch(getApiUrl('/api/health'), { method: 'GET' });
                const contentType = res.headers.get('content-type');
                if (res.ok && contentType && contentType.includes('application/json')) {
                    setIsApiConnected(true);
                } else {
                    setIsApiConnected(false);
                }
            } catch (err) {
                setIsApiConnected(false);
            }
        };
        checkApiConnection();
    }, []);

    // Initialize the conversation when a lead is active
    useEffect(() => {
        if (isLeadCaptured && activeLead) {
            setMessages([
                {
                    id: 'lead-user-msg',
                    sender: 'user',
                    text: language === 'es'
                        ? `Hola, mi nombre es ${activeLead.name} (${activeLead.email}). Mi idea de proyecto es: "${activeLead.description}"`
                        : `Hello, my name is ${activeLead.name} (${activeLead.email}). My project idea is: "${activeLead.description}"`,
                    timestamp: new Date()
                },
                {
                    id: 'lead-bot-msg',
                    sender: 'bot',
                    text: language === 'es'
                        ? `¡Mucho gusto, ${activeLead.name}! Es un placer saludarte. He recibido y analizado tu idea de proyecto: "${activeLead.description}". Como Asistente de Luis, estoy listo para guiarte técnicamente y responder cualquier duda que tengas sobre su stack de tecnologías, proyectos previos o currículum. ¿Qué te gustaría discutir primero?`
                        : `Nice to meet you, ${activeLead.name}! It's a pleasure to greet you. I have received and analyzed your project idea: "${activeLead.description}". As Luis's Assistant, I am ready to guide you technically and answer any doubts you have about his technology stack, previous projects or resume. What would you like to discuss first?`,
                    timestamp: new Date()
                }
            ]);
        } else {
            setMessages([]);
        }
    }, [isLeadCaptured, activeLead, language]);

    // Scroll to bottom on messages/typing change
    useEffect(() => {
        if (messages.length <= 1) return;
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages, isTyping]);

    const handleSendMessage = async (textToSend: string) => {
        if (!textToSend.trim() || isTyping) return;

        const userMessage: Message = {
            id: `msg-${Date.now()}-user`,
            sender: 'user',
            text: textToSend,
            timestamp: new Date()
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInputVal('');
        setIsTyping(true);

        try {
            if (!activeLead) {
                throw new Error("No active lead details found");
            }

            const historyPayload = updatedMessages.slice(-6).map((msg) => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                text: msg.text
            }));

            const payload = {
                name: activeLead.name,
                email: activeLead.email,
                message: textToSend,
                history: historyPayload
            };

            const response = await fetch(getApiUrl('/api/chat'), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Server returned HTTP ${response.status}`);
            }

            const data = await response.json();
            const botReply = data.response;

            setMessages((prev) => [...prev, {
                id: `msg-${Date.now()}-bot`,
                sender: 'bot',
                text: botReply,
                timestamp: new Date()
            }]);
        } catch (error) {
            console.error("Error calling API chat endpoint:", error);
            const botResponse = language === 'es'
                ? "No pudimos conectarnos con el Asistente de Luis"
                : "We couldn't connect to Luis's Assistant";

            setMessages((prev) => [...prev, {
                id: `msg-${Date.now()}-bot`,
                sender: 'bot',
                text: botResponse,
                timestamp: new Date()
            }]);
        } finally {
            setIsTyping(false);
        }
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

        const newLead = {
            name: formName,
            email: formEmail,
            description: formDesc,
            timestamp: new Date().toISOString()
        };

        console.log("¡Nuevo Lead capturado por el Consultor IA!", newLead);

        // Save lead locally to simulate state persistence
        localStorage.setItem('lfcc-portfolio-active-lead', JSON.stringify(newLead));

        const existingLeads = JSON.parse(localStorage.getItem('lfcc-portfolio-leads') || '[]');
        existingLeads.push(newLead);
        localStorage.setItem('lfcc-portfolio-leads', JSON.stringify(existingLeads));

        // Clear inputs and set states
        setActiveLead(newLead);
        setIsLeadCaptured(true);
        setFormName('');
        setFormEmail('');
        setFormDesc('');
    };

    const handleResetChat = async () => {
        if (activeLead && messages.length > 0) {
            try {
                const historyPayload = messages.map((msg) => ({
                    role: msg.sender === 'user' ? 'user' : 'model',
                    text: msg.text
                }));

                // Call terminate in background
                fetch(getApiUrl('/api/terminate'), {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: activeLead.email,
                        history: historyPayload
                    })
                }).catch(err => console.error("API Terminate error:", err));
            } catch (err) {
                console.error("Error during session reset termination:", err);
            }
        }

        localStorage.removeItem('lfcc-portfolio-active-lead');
        setIsLeadCaptured(false);
        setActiveLead(null);
        setMessages([]);
        setFormName('');
        setFormEmail('');
        setFormDesc('');
        setFormError('');
    };

    // Inactivity and Unload event listeners
    useEffect(() => {
        if (!isLeadCaptured || !activeLead) return;

        let inactivityTimeout: number;

        const resetInactivityTimer = () => {
            clearTimeout(inactivityTimeout);
            inactivityTimeout = window.setTimeout(() => {
                console.log("Inactivity of 3 minutes detected. Terminating session...");
                handleResetChat();
            }, 3 * 60 * 1000); // 3 minutes
        };

        const activityEvents = ['mousedown', 'keydown', 'touchstart'];
        activityEvents.forEach(event => {
            window.addEventListener(event, resetInactivityTimer);
        });

        resetInactivityTimer();

        // Handle page close / tab unload
        const handleBeforeUnload = () => {
            const historyPayload = messages.map((msg) => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                text: msg.text
            }));

            fetch(getApiUrl('/api/terminate'), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: activeLead.email,
                    history: historyPayload
                }),
                keepalive: true
            }).catch(err => console.error("Unload terminate error:", err));
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            clearTimeout(inactivityTimeout);
            activityEvents.forEach(event => {
                window.removeEventListener(event, resetInactivityTimer);
            });
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isLeadCaptured, activeLead, messages]);

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
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-3 backdrop-blur-md border shadow-sm select-none ${isDark
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                : 'bg-blue-500/10 border-blue-500/20 text-blue-600'
                            }`}
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
                                {isApiConnected ? (
                                    <>
                                        <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 rounded-full animate-ping ${isDark ? 'bg-green-500 border-slate-950' : 'bg-blue-500 border-white'}`} />
                                        <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 rounded-full ${isDark ? 'bg-green-500 border-slate-950' : 'bg-blue-500 border-white'}`} />
                                    </>
                                ) : (
                                    <>
                                        <span className={`absolute bottom-0 right-0 w-3 h-3 bg-rose-500 border-2 rounded-full animate-pulse ${isDark ? 'border-slate-950' : 'border-white'}`} />
                                    </>
                                )}
                            </div>
                            <div>
                                <h4 className={`text-sm font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {language === 'es' ? 'Asistente de Luis' : 'Luis\'s Assistant'}
                                </h4>
                                <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                    <span className={`w-1.5 h-1.5 rounded-full ${isApiConnected
                                            ? isDark ? 'bg-green-500' : 'bg-blue-500'
                                            : 'bg-rose-500'
                                        }`} />
                                    {isApiConnected
                                        ? (language === 'es' ? 'En línea' : 'Online')
                                        : (language === 'es' ? 'Desconectado' : 'Offline')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {isLeadCaptured && (
                                <button
                                    onClick={handleResetChat}
                                    className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${isDark
                                            ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300'
                                            : 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100 hover:text-rose-700'
                                        }`}
                                >
                                    <LogOut className="w-3.5 h-3.5" />
                                    <span>{language === 'es' ? 'Finalizar Conversación' : 'End Conversation'}</span>
                                </button>
                            )}

                            <div className={`text-[10px] font-mono px-2 py-1 rounded border hidden sm:block ${isApiConnected
                                    ? isDark
                                        ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                                        : 'bg-blue-50 border-blue-200 text-blue-600 font-bold'
                                    : isDark
                                        ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 font-bold'
                                        : 'bg-rose-50 border-rose-200 text-rose-600 font-bold shadow-sm'
                                }`}>
                                {isApiConnected ? 'SYSTEM: ACTIVE' : 'SYSTEM: OFFLINE'}
                            </div>
                        </div>
                    </div>

                    {isLeadCaptured ? (
                        <>
                            {/* Messages Area */}
                            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 min-h-0 scrollbar-thin">
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
                                                {parseMarkdownToReact(msg.text, isDark)}
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
                            </div>

                            {/* Input Bar */}
                            <div className={`p-4 border-t flex items-center gap-2 shrink-0 ${isDark ? 'border-slate-800/80 bg-slate-950/40' : 'border-slate-200 bg-slate-50/40'
                                }`}>
                                <input
                                    type="text"
                                    value={inputVal}
                                    onChange={(e) => setInputVal(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    disabled={isTyping}
                                    className={`flex-1 px-4 py-3 rounded-xl text-xs sm:text-sm outline-none border transition-all ${isDark
                                            ? 'bg-slate-950/70 border-slate-800 text-white focus:border-emerald-500/40 placeholder:text-slate-500'
                                            : 'bg-white border-slate-200 text-slate-800 focus:border-blue-500 placeholder:text-slate-400'
                                        } disabled:opacity-50`}
                                    placeholder={language === 'es' ? 'Pregúntame sobre el stack de Luis o sus proyectos...' : 'Ask me about Luis\'s stack or projects...'}
                                />

                                <button
                                    onClick={() => handleSendMessage(inputVal)}
                                    disabled={isTyping || !inputVal.trim()}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all select-none cursor-pointer border ${isDark
                                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 disabled:bg-slate-900 disabled:border-slate-800 disabled:text-slate-600'
                                            : 'bg-blue-500/10 border-blue-500/20 text-blue-600 hover:bg-blue-500/20 disabled:bg-slate-100 disabled:border-slate-200 disabled:text-slate-400'
                                        } disabled:cursor-not-allowed`}
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </>
                    ) : (
                        /* Beautiful Centered Gatekeeper Form */
                        <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-8 overflow-y-auto scrollbar-none">
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="w-full max-w-md mx-auto space-y-6"
                            >
                                <div className="text-center space-y-2">
                                    <div className={`mx-auto w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm ${isDark
                                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-emerald-950/20'
                                            : 'bg-blue-500/10 border-blue-500/20 text-blue-600 shadow-blue-500/5'
                                        }`}>
                                        <ClipboardList className="w-6 h-6" />
                                    </div>
                                    <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {language === 'es' ? 'Identificación de Consultoría' : 'Consulting Registration'}
                                    </h3>
                                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                                        {language === 'es'
                                            ? 'Rellena tus datos iniciales para habilitar el chat con el Asistente Técnico y Consultor de Software de Luis Fernando.'
                                            : 'Fill in your details to enable chat with Luis Fernando\'s Technical Assistant and Software Consultant.'}
                                    </p>
                                </div>

                                <form onSubmit={handleFormSubmit} className="space-y-4">
                                    {formError && (
                                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 shrink-0" />
                                            <span>{formError}</span>
                                        </div>
                                    )}

                                    <div className="space-y-1.5">
                                        <label className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                            {language === 'es' ? 'Nombre Completo' : 'Full Name'} <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formName}
                                            onChange={(e) => setFormName(e.target.value)}
                                            className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl outline-none border transition-all ${isDark
                                                    ? 'bg-slate-950/60 border-slate-800 text-white focus:border-emerald-500/50 placeholder:text-slate-600'
                                                    : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 placeholder:text-slate-400'
                                                }`}
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                            {language === 'es' ? 'Correo Electrónico' : 'Email Address'} <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={formEmail}
                                            onChange={(e) => setFormEmail(e.target.value)}
                                            className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl outline-none border transition-all ${isDark
                                                    ? 'bg-slate-950/60 border-slate-800 text-white focus:border-emerald-500/50 placeholder:text-slate-600'
                                                    : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 placeholder:text-slate-400'
                                                }`}
                                            placeholder="johndoe@example.com"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                            {language === 'es' ? 'Idea de Software / Necesidad Inicial' : 'Software Idea / Initial Need'} <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={formDesc}
                                            onChange={(e) => setFormDesc(e.target.value)}
                                            className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl outline-none border resize-none transition-all ${isDark
                                                    ? 'bg-slate-950/60 border-slate-800 text-white focus:border-emerald-500/50 placeholder:text-slate-600'
                                                    : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 placeholder:text-slate-400'
                                                }`}
                                            placeholder={language === 'es' ? 'Quiero desarrollar una aplicación web de comercio electrónico...' : 'I want to build an e-commerce web application...'}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className={`w-full py-3 rounded-xl text-xs sm:text-sm font-bold cursor-pointer transition-all shadow-md flex items-center justify-center gap-2 ${isDark
                                                ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 active:scale-98'
                                                : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-98'
                                            }`}
                                    >
                                        <Bot className="w-4 h-4" />
                                        <span>{language === 'es' ? 'Comenzar Consulta' : 'Start Consultation'}</span>
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </motion.div>

            </div>
        </section>
    );
}
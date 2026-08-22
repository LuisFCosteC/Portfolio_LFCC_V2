import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Sparkles, ClipboardList, AlertCircle, LogOut, X, Calendar, Loader2 } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import { useTheme } from '../context/ThemeContext';
import { getApiUrl } from '../lib/utils';

interface Message {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    timestamp: Date;
}

// Lightweight Markdown Parser to render beautiful API responses
function parseMarkdownToReact(text: string, isDark: boolean) {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];

    let inCodeBlock = false;
    let codeLanguage = '';
    let codeLines: string[] = [];

    // Helper to parse inline styles (**bold**, __bold__, `code`, links)
    const parseInline = (content: string) => {
        const inlineRegex = /(\*\*.*?\*\*|`.*?`|__.*?__|\[.*?\]\(.*?\)|https?:\/\/[^\s]+)/g;
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
                    <code key={tokenIndex} className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-semibold ${isDark
                            ? 'bg-slate-800 text-emerald-400'
                            : 'bg-slate-100 text-blue-600'
                        }`}>
                        {token.slice(1, -1)}
                    </code>
                );
            }
            if (token.startsWith('[') && token.includes('](')) {
                const match = token.match(/^\[(.*?)\]\((.*?)\)$/);
                if (match) {
                    const [, linkText, linkUrl] = match;
                    return (
                        <a
                            key={tokenIndex}
                            href={linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`underline font-bold transition-all ${isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-blue-600 hover:text-blue-800'
                                }`}
                        >
                            {linkText}
                        </a>
                    );
                }
            }
            if (token.startsWith('http://') || token.startsWith('https://')) {
                return (
                    <a
                        key={tokenIndex}
                        href={token}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`underline font-bold transition-all ${isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-blue-600 hover:text-blue-800'
                            }`}
                    >
                        {token}
                    </a>
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
                    <pre key={`code-${i}`} className={`p-3 rounded-lg font-mono text-[11px] sm:text-xs overflow-x-auto my-2 border ${isDark
                            ? 'bg-slate-950/80 border-slate-800 text-slate-200'
                            : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}>
                        {codeLanguage && (
                            <div className={`text-[9px] uppercase tracking-wider font-bold mb-1 select-none ${isDark ? 'text-slate-500' : 'text-slate-400'
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
                    <span className={`select-none mt-[6px] shrink-0 w-1.5 h-1.5 rounded-full ${isDark ? 'bg-emerald-400 shadow-sm shadow-emerald-500/50' : 'bg-blue-500 shadow-sm'
                        }`} />
                    <span className="flex-1">{parseInline(bulletMatch[1])}</span>
                </div>
            );
            continue;
        }

        if (numberMatch) {
            elements.push(
                <div key={`number-${i}`} className={`flex gap-2 py-0.5 items-start ${indentClass}`}>
                    <span className={`font-bold select-none text-xs shrink-0 mt-[2px] ${isDark ? 'text-emerald-400' : 'text-blue-600'
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

const getDayName = (date: Date, lang: string) => {
    const daysEs = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const daysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return lang === 'es' ? daysEs[date.getDay()] : daysEn[date.getDay()];
};

const getMonthName = (date: Date, lang: string) => {
    const monthsEs = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return lang === 'es' ? monthsEs[date.getMonth()] : monthsEn[date.getMonth()];
};

const TIME_SLOTS = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
];

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
    const [formPhone, setFormPhone] = useState('');
    const [selectedCountryCode, setSelectedCountryCode] = useState('CO');
    const [formDesc, setFormDesc] = useState('');
    const [formError, setFormError] = useState('');

    // Calendar Scheduling States
    const [showCalendarMode, setShowCalendarMode] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [isScheduling, setIsScheduling] = useState(false);
    const [schedulingError, setSchedulingError] = useState('');
    const [occupiedSlots, setOccupiedSlots] = useState<string[]>([]);

    const fetchOccupiedSlots = async () => {
        try {
            const url = getApiUrl('/api/occupied-slots');
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                if (data.status === 'success') {
                    setOccupiedSlots(data.occupied_slots || []);
                }
            }
        } catch (err) {
            console.error("Error fetching occupied slots:", err);
        }
    };

    useEffect(() => {
        if (showCalendarMode) {
            fetchOccupiedSlots();
        }
    }, [showCalendarMode]);

    const isSlotOccupiedInList = (date: Date, slot: string) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const formatted = `${yyyy}-${mm}-${dd}T${slot}:00`;
        return occupiedSlots.includes(formatted);
    };

    // Calculate weekdays for this week and the next two weeks (excluding weekends, exactly 15 business days)
    const getThreeWeeksWeekdays = () => {
        const weekdaysList: Date[] = [];
        const today = new Date();
        let daysOffset = 0;
        while (weekdaysList.length < 15) {
            const d = new Date();
            d.setDate(today.getDate() + daysOffset);
            const day = d.getDay();
            if (day !== 0 && day !== 6) { // 0 = Sunday, 6 = Saturday
                weekdaysList.push(d);
            }
            daysOffset++;
        }
        return weekdaysList;
    };

    const weekdays = getThreeWeeksWeekdays();

    // Set default selectedDate to the first weekday if not set
    useEffect(() => {
        if (showCalendarMode && !selectedDate && weekdays.length > 0) {
            setSelectedDate(weekdays[0]);
        }
    }, [showCalendarMode, selectedDate, weekdays]);

    const getAvailableSlots = (date: Date) => {
        const today = new Date();
        const isTodayDate = date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();

        if (!isTodayDate) return TIME_SLOTS;

        const currentHour = today.getHours();
        const currentMinute = today.getMinutes();

        return TIME_SLOTS.filter(slot => {
            const [hourStr, minuteStr] = slot.split(':');
            const slotHour = parseInt(hourStr, 10);
            const slotMinute = parseInt(minuteStr, 10);
            if (slotHour > currentHour) return true;
            if (slotHour === currentHour && slotMinute > currentMinute) return true;
            return false;
        });
    };

    // Gatekeeper States
    const [isLeadCaptured, setIsLeadCaptured] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('lfcc-portfolio-active-lead') !== null;
        }
        return false;
    });

    const [activeLead, setActiveLead] = useState<{ name: string; email: string; phone?: string; description: string } | null>(() => {
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

    // Listen to external custom events to trigger scheduling calendar overlay
    useEffect(() => {
        const handleExternalScheduling = (e: Event) => {
            const customEvent = e as CustomEvent;
            const detail = customEvent.detail;
            
            // Smoothly scroll to the AI chat widget
            const chatElement = document.getElementById('ai-assistant');
            if (chatElement) {
                chatElement.scrollIntoView({ behavior: 'smooth' });
            }

            if (detail && detail.name && detail.email) {
                // Pre-fill active lead with info passed from ContactForm
                const newLead = {
                    name: detail.name,
                    email: detail.email,
                    phone: detail.phone || '',
                    description: detail.description || (language === 'es' ? 'Reunión agendada desde el Formulario de Contacto' : 'Meeting scheduled from Contact Form'),
                    timestamp: new Date().toISOString()
                };
                
                // Save locally
                localStorage.setItem('lfcc-portfolio-active-lead', JSON.stringify(newLead));
                const existingLeads = JSON.parse(localStorage.getItem('lfcc-portfolio-leads') || '[]');
                existingLeads.push(newLead);
                localStorage.setItem('lfcc-portfolio-leads', JSON.stringify(existingLeads));
                
                // Update state and immediately show calendar
                setActiveLead(newLead);
                setIsLeadCaptured(true);
                setShowCalendarMode(false);
            } else {
                // Triggered from FloatingButtons or without detail
                if (isLeadCaptured) {
                    setShowCalendarMode(false);
                } else {
                    // Highlight or focus the first input of lead form
                    setTimeout(() => {
                        const firstInput = document.querySelector('input[placeholder="John Doe"]') as HTMLInputElement;
                        if (firstInput) {
                            firstInput.focus();
                        }
                    }, 500);
                }
            }
        };

        window.addEventListener('open-calendar-scheduling', handleExternalScheduling);
        return () => {
            window.removeEventListener('open-calendar-scheduling', handleExternalScheduling);
        };
    }, [isLeadCaptured, language]);

    // Listen to open-ai-chat-only event (from Contact Form) to just register and enter chat without scheduling trigger
    useEffect(() => {
        const handleEnterChatOnly = (e: Event) => {
            const customEvent = e as CustomEvent;
            const detail = customEvent.detail;
            
            const chatElement = document.getElementById('ai-assistant');
            if (chatElement) {
                chatElement.scrollIntoView({ behavior: 'smooth' });
            }

            if (detail && detail.name && detail.email) {
                const newLead = {
                    name: detail.name,
                    email: detail.email,
                    phone: detail.phone || '',
                    description: detail.description || (language === 'es' ? 'Consulta iniciada desde el Formulario de Contacto' : 'Consultation started from Contact Form'),
                    timestamp: new Date().toISOString()
                };
                
                localStorage.setItem('lfcc-portfolio-active-lead', JSON.stringify(newLead));
                const existingLeads = JSON.parse(localStorage.getItem('lfcc-portfolio-leads') || '[]');
                existingLeads.push(newLead);
                localStorage.setItem('lfcc-portfolio-leads', JSON.stringify(existingLeads));
                
                setActiveLead(newLead);
                setIsLeadCaptured(true);
                setShowCalendarMode(false); // Explicitly ensure calendar is NOT triggered
            }
        };

        window.addEventListener('open-ai-chat-only', handleEnterChatOnly);
        return () => {
            window.removeEventListener('open-ai-chat-only', handleEnterChatOnly);
        };
    }, [language]);

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

            if (botReply.includes("[TRIGGER_CALENDAR_INTERFACE]")) {
                console.log("🎯 Flag detectado con éxito.");
                const cleanBotReply = botReply.replace("[TRIGGER_CALENDAR_INTERFACE]", "").trim();
                const finalReply = cleanBotReply || (language === 'es' ? 'Por favor selecciona una fecha y hora para agendar la reunión:' : 'Please select a date and time to schedule the meeting:');

                setMessages((prev) => [...prev, {
                    id: `msg-${Date.now()}-bot`,
                    sender: 'bot',
                    text: finalReply,
                    timestamp: new Date()
                }]);
            } else {
                setMessages((prev) => [...prev, {
                    id: `msg-${Date.now()}-bot`,
                    sender: 'bot',
                    text: botReply,
                    timestamp: new Date()
                }]);
            }
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

    const handleScheduleMeeting = async (timeSlot: string) => {
        if (!selectedDate || isScheduling) return;
        setSchedulingError('');
        setIsScheduling(true);

        const yyyy = selectedDate.getFullYear();
        const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const dd = String(selectedDate.getDate()).padStart(2, '0');
        const formattedDatetime = `${yyyy}-${mm}-${dd}T${timeSlot}:00`;

        const currentLeadEmail = activeLead?.email || '';
        const currentLeadName = activeLead?.name || '';
        const currentLeadPhone = activeLead?.phone || '';

        try {
            const url = getApiUrl('/api/schedule-meeting');

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: currentLeadEmail,
                    name: currentLeadName,
                    phone: currentLeadPhone,
                    slot_datetime: formattedDatetime
                })
            });

            if (!response.ok) {
                let errorMsg = language === 'es' ? `Error del servidor: HTTP ${response.status}` : `Server error: HTTP ${response.status}`;
                try {
                    const errData = await response.json();
                    if (errData && errData.detail) {
                        errorMsg = errData.detail;
                    }
                } catch (e) { }
                throw new Error(errorMsg);
            }

            const data = await response.json();

            // Destroy the calendar
            setShowCalendarMode(false);
            setSelectedDate(null);
            setSelectedTime(null);

            // Extract Google Meet link
            const meetLink = data.meet_link || data.google_meet || data.link || 'https://meet.google.com';

            // Print confirmation message
            const dayName = getDayName(selectedDate, language);
            const monthName = getMonthName(selectedDate, language);
            const displayDateStr = `${dayName} ${dd} ${monthName} ${yyyy}`;

            const confirmText = language === 'es'
                ? `¡Reunión agendada con éxito! 🎉 Nos reuniremos el **${displayDateStr}** a las **${timeSlot}**. Aquí tienes el enlace de Google Meet para unirte: ${meetLink}`
                : `Meeting scheduled successfully! 🎉 We will meet on **${displayDateStr}** at **${timeSlot}**. Here is the Google Meet link to join: ${meetLink}`;

            setMessages((prev) => [...prev, {
                id: `msg-${Date.now()}-bot-confirm`,
                sender: 'bot',
                text: confirmText,
                timestamp: new Date()
            }]);
        } catch (error: any) {
            console.error("Error scheduling meeting:", error);
            setSchedulingError(error.message || (language === 'es' ? 'No se pudo agendar la reunión. Por favor intenta de nuevo.' : 'Failed to schedule meeting. Please try again.'));
            // Re-fetch occupied slots on error so the conflict slot updates in the UI
            fetchOccupiedSlots();
        } finally {
            setIsScheduling(false);
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

        if (!formName.trim() || !formEmail.trim() || !formPhone.trim() || !formDesc.trim()) {
            setFormError(language === 'es' ? 'Por favor completa todos los campos obligatorios.' : 'Please fill out all required fields.');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(formEmail)) {
            setFormError(language === 'es' ? 'Por favor introduce un correo válido.' : 'Please enter a valid email address.');
            return;
        }

        const countryObj = COUNTRIES.find(c => c.code === selectedCountryCode);
        const dialCode = countryObj ? countryObj.dial : '';
        const fullPhone = `${dialCode} ${formPhone.trim()}`;

        const newLead = {
            name: formName,
            email: formEmail,
            phone: fullPhone,
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
        setFormPhone('');
        setSelectedCountryCode('CO');
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
                        name: activeLead.name,
                        phone: activeLead.phone,
                        description: activeLead.description,
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
        setFormPhone('');
        setSelectedCountryCode('CO');
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

            try {
                fetch(getApiUrl('/api/terminate'), {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: activeLead.email,
                        name: activeLead.name,
                        phone: activeLead.phone,
                        description: activeLead.description,
                        history: historyPayload
                    }),
                    keepalive: true
                }).catch(err => console.error("Unload terminate error:", err));
            } catch (err) {
                console.error("Unload terminate error:", err);
            }
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

    // Custom Event Listener for cross-component Scheduling Trigger
    useEffect(() => {
        const handleOpenCalendar = () => {
            setShowCalendarMode(false);
            const assistantEl = document.getElementById('ai-assistant');
            if (assistantEl) {
                assistantEl.scrollIntoView({ behavior: 'smooth' });
            }
        };
        window.addEventListener('open-calendar-scheduling', handleOpenCalendar);
        return () => {
            window.removeEventListener('open-calendar-scheduling', handleOpenCalendar);
        };
    }, []);

    return (
        <section id="ai-assistant" className="py-20 relative z-10">
            <div className="max-w-5xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

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
                    className={`w-full rounded-2xl border overflow-hidden backdrop-blur-xl shadow-2xl flex flex-col h-[580px] sm:h-[750px] md:h-[800px] transition-all duration-300 relative ${isDark
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
                                    <span className="hidden sm:inline">{language === 'es' ? 'Finalizar Conversación' : 'End Conversation'}</span>
                                    <span className="sm:hidden">{language === 'es' ? 'Salir' : 'End'}</span>
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
                                            <span className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-emerald-400' : 'bg-blue-500'}`} style={{ animationDelay: '0ms' }} />
                                            <span className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-emerald-400' : 'bg-blue-500'}`} style={{ animationDelay: '150ms' }} />
                                            <span className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-emerald-400' : 'bg-blue-500'}`} style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Calendar Overlay (Integrated Glassmorphism Modal with 2 Columns) */}
                            {showCalendarMode && (
                                <div className={`absolute inset-x-0 bottom-0 top-[73px] z-20 flex flex-col backdrop-blur-xl ${isDark ? 'bg-[#030914]/90 border-t border-slate-800/80 shadow-emerald-950/20' : 'bg-white/90 border-t border-slate-200 shadow-slate-200/20'
                                    }`}>
                                    {/* Loading Overlay */}
                                    {isScheduling && (
                                        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/75 backdrop-blur-md">
                                            <Loader2 className={`w-10 h-10 animate-spin mb-3 ${isDark ? 'text-emerald-400' : 'text-blue-600'}`} />
                                            <span className="text-sm font-bold text-slate-200 animate-pulse">
                                                {language === 'es' ? 'Agendando espacio con Luis...' : 'Scheduling spot with Luis...'}
                                            </span>
                                        </div>
                                    )}

                                    {/* Header */}
                                    <div className={`px-4 py-3 flex items-center justify-between border-b shrink-0 ${isDark ? 'border-slate-800/80 bg-slate-950/40' : 'border-slate-200 bg-slate-50/40'
                                        }`}>
                                        <div className="flex items-center gap-2">
                                            <Calendar className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-blue-600'}`} />
                                            <h5 className={`text-xs sm:text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                {language === 'es' ? 'Agendar Reunión con Luis' : 'Schedule Meeting with Luis'}
                                            </h5>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setShowCalendarMode(false);
                                                setSelectedDate(null);
                                                setSelectedTime(null);
                                                setSchedulingError('');
                                            }}
                                            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${isDark
                                                    ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                                                    : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                                                }`}
                                            title={language === 'es' ? 'Volver al chat' : 'Back to chat'}
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Error Alert */}
                                    {schedulingError && (
                                        <div className="mx-4 mt-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center justify-between shrink-0">
                                            <div className="flex items-center gap-2">
                                                <AlertCircle className="w-4 h-4 shrink-0" />
                                                <span>{schedulingError}</span>
                                            </div>
                                            <button onClick={() => setSchedulingError('')} className="p-1 hover:bg-rose-500/20 rounded-lg">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )}

                                    {/* Responsive Calendar Content */}
                                    <div className="flex-1 overflow-y-auto sm:overflow-hidden p-4 sm:p-5 flex flex-col sm:flex-row gap-4 min-h-0">
                                        {/* Left Panel - Days */}
                                        <div className="w-full sm:w-[170px] shrink-0 flex flex-row sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto pb-2 sm:pb-0 pr-0 sm:pr-1 scrollbar-none sm:scrollbar-thin">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 select-none shrink-0 self-center sm:self-start sm:block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                {language === 'es' ? 'Días' : 'Days'}
                                            </span>
                                            {weekdays.map((date) => {
                                                const isSel = selectedDate &&
                                                    date.getDate() === selectedDate.getDate() &&
                                                    date.getMonth() === selectedDate.getMonth() &&
                                                    date.getFullYear() === selectedDate.getFullYear();
                                                const dName = getDayName(date, language);
                                                const mName = getMonthName(date, language);
                                                const dNum = date.getDate();
                                                return (
                                                    <button
                                                        key={date.toISOString()}
                                                        onClick={() => {
                                                            setSelectedDate(date);
                                                            setSelectedTime(null);
                                                        }}
                                                        className={`flex flex-col sm:flex-row items-center sm:justify-start gap-1 sm:gap-3 px-3 py-2 sm:py-2.5 rounded-xl border transition-all text-left shrink-0 cursor-pointer ${isSel
                                                                ? isDark
                                                                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 font-bold shadow-md shadow-emerald-950/20'
                                                                    : 'bg-blue-500/15 border-blue-500 text-blue-600 font-bold shadow-md shadow-blue-500/10'
                                                                : isDark
                                                                    ? 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                                                                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                                                            }`}
                                                    >
                                                        <span className="text-sm font-black leading-none">{dNum}</span>
                                                        <div className="flex flex-col items-center sm:items-start leading-none">
                                                            <span className="text-[9px] uppercase tracking-wider font-semibold">{dName}</span>
                                                            <span className="text-[8px] opacity-75 mt-0.5 hidden sm:inline">{mName}</span>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Divider */}
                                        <div className={`h-[1px] w-full sm:h-auto sm:w-[1px] shrink-0 self-stretch ${isDark ? 'bg-slate-800/85' : 'bg-slate-200'}`} />

                                        {/* Right Panel - Hours */}
                                        <div className="flex-1 flex flex-col gap-2 overflow-hidden min-h-[220px] sm:min-h-0">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 select-none ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                {language === 'es' ? 'Horas Disponibles' : 'Available Hours'}
                                            </span>
                                            {selectedDate && getAvailableSlots(selectedDate).length > 0 ? (
                                                <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin">
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                                        {getAvailableSlots(selectedDate).map((slot) => {
                                                            const yyyy = selectedDate.getFullYear();
                                                            const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
                                                            const dd = String(selectedDate.getDate()).padStart(2, '0');
                                                            const currentSlotIso = `${yyyy}-${mm}-${dd}T${slot}:00`;
                                                            const isOccupied = occupiedSlots.includes(currentSlotIso);
                                                            const isSel = selectedTime === slot;
                                                            return (
                                                                <button
                                                                    key={slot}
                                                                    disabled={isOccupied || isScheduling}
                                                                    onClick={() => {
                                                                        setSelectedTime(slot);
                                                                        handleScheduleMeeting(slot);
                                                                    }}
                                                                    className={`py-2.5 px-1 rounded-xl text-xs font-bold border transition-all text-center ${isOccupied
                                                                            ? isDark
                                                                                ? 'bg-slate-950/40 border-slate-900/60 text-slate-600 cursor-not-allowed line-through'
                                                                                : 'bg-slate-100 border-slate-200 text-slate-400/50 cursor-not-allowed line-through'
                                                                            : isSel
                                                                                ? isDark
                                                                                    ? 'bg-emerald-500 text-slate-950 border-emerald-500 cursor-pointer'
                                                                                    : 'bg-blue-600 text-white border-blue-600 cursor-pointer'
                                                                                : isDark
                                                                                    ? 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/60 hover:text-white cursor-pointer'
                                                                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer'
                                                                        }`}
                                                                >
                                                                    {slot}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex-1 flex flex-col items-center justify-center border border-dashed rounded-xl p-4 border-slate-800/40 text-center text-xs text-slate-400">
                                                    {language === 'es' ? 'No hay horarios disponibles para hoy. Selecciona otra fecha.' : 'No slots available for today. Select another date.'}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Input Container */}
                            {!showCalendarMode && (
                                <div className={`p-4 border-t shrink-0 relative transition-all duration-300 ${isDark
                                        ? 'border-slate-800/80 bg-slate-950/40'
                                        : 'border-slate-200 bg-slate-50/40'
                                    }`}>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowCalendarMode(true)}
                                            className={`px-3.5 py-3 rounded-xl flex items-center gap-2 shrink-0 border transition-all select-none cursor-pointer text-xs sm:text-sm font-bold ${isDark
                                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                                                    : 'bg-blue-500/10 border-blue-500/20 text-blue-600 hover:bg-blue-500/20'
                                                }`}
                                        >
                                            <Calendar className="w-4 h-4" />
                                            <span className="hidden sm:inline">{language === 'es' ? 'Agendar Reunión' : 'Schedule Meeting'}</span>
                                        </button>

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
                                </div>
                            )}
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
                                            className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl outline-none border transition-all duration-200 ${isDark
                                                ? 'bg-slate-950/40 border-slate-800 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 text-white placeholder:text-slate-600'
                                                : 'bg-slate-50/50 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 text-slate-800 placeholder:text-slate-400'
                                                }`}
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                            {language === 'es' ? 'Teléfono de Contacto' : 'Contact Phone'} <span className="text-red-500">*</span>
                                        </label>
                                        <div className={`flex rounded-xl overflow-hidden border transition-all duration-200 ${isDark
                                                ? 'bg-slate-950/40 border-slate-800 focus-within:border-emerald-500/50 focus-within:ring-2 focus-within:ring-emerald-500/10 shadow-sm'
                                                : 'bg-slate-50/50 border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 shadow-sm'
                                            }`}>
                                            <div className={`relative shrink-0 flex items-center border-r transition-all ${isDark ? 'border-slate-800' : 'border-slate-200'
                                                }`}>
                                                <select
                                                    value={selectedCountryCode}
                                                    onChange={(e) => setSelectedCountryCode(e.target.value)}
                                                    className={`pl-3 pr-8 py-2.5 text-xs sm:text-sm bg-transparent outline-none cursor-pointer font-bold appearance-none ${isDark
                                                            ? 'text-white bg-[#030914]'
                                                            : 'text-slate-800 bg-white'
                                                        }`}
                                                    style={{ minWidth: '95px' }}
                                                >
                                                    {COUNTRIES.map((c) => (
                                                        <option key={c.code} value={c.code} className={isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-800'}>
                                                            {c.flag} {c.dial} ({c.name})
                                                        </option>
                                                    ))}
                                                </select>
                                                <span className={`absolute right-2 pointer-events-none ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                                                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                                    </svg>
                                                </span>
                                            </div>
                                            <input
                                                type="tel"
                                                value={formPhone}
                                                onChange={(e) => setFormPhone(e.target.value)}
                                                className={`flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-transparent outline-none transition-all ${isDark ? 'text-white placeholder:text-slate-650' : 'text-slate-800 placeholder:text-slate-400'
                                                    }`}
                                                placeholder="300 123 4567"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                            {language === 'es' ? 'Correo Electrónico' : 'Email Address'} <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={formEmail}
                                            onChange={(e) => setFormEmail(e.target.value)}
                                            className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl outline-none border transition-all duration-200 ${isDark
                                                ? 'bg-slate-950/40 border-slate-800 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 text-white placeholder:text-slate-600'
                                                : 'bg-slate-50/50 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 text-slate-800 placeholder:text-slate-400'
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
                                            className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl outline-none border resize-none transition-all duration-200 ${isDark
                                                ? 'bg-slate-950/40 border-slate-800 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 text-white placeholder:text-slate-650'
                                                : 'bg-slate-50/50 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 text-slate-800 placeholder:text-slate-400'
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
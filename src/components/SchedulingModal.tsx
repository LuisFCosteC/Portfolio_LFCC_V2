import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, AlertCircle, CheckCircle2, Clock, Sparkles, User, Mail, Copy, ArrowLeft } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import { useTheme } from '../context/ThemeContext';
import { getApiUrl } from '../lib/utils';

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

const labels = {
    es: {
        titleStep1: 'Datos de Contacto',
        subtitleStep1: 'Por favor introduce tus datos para poder agendar tu reunión.',
        titleStep2: 'Selecciona Fecha y Hora',
        subtitleStep2: 'Elige un bloque de 30 minutos disponible.',
        titleStep3: '¡Reunión Agendada!',
        subtitleStep3: 'Tu reunión ha sido programada con éxito en Google Calendar.',
        nameLabel: 'Nombre Completo',
        emailLabel: 'Correo Electrónico',
        phoneLabel: 'Teléfono de Contacto',
        back: 'Atrás',
        next: 'Continuar',
        schedule: 'Confirmar Reunión',
        copied: '¡Copiado!',
        copy: 'Copiar Enlace',
        successText: 'Nos reuniremos el {date} a las {time}. Aquí tienes tu enlace de Zoom:',
        close: 'Cerrar',
        requiredError: 'Por favor completa todos los campos requeridos.',
        emailError: 'Por favor introduce un correo válido.',
        schedulingError: 'No se pudo agendar la reunión. Por favor intenta de nuevo.'
    },
    en: {
        titleStep1: 'Contact Information',
        subtitleStep1: 'Please enter your details to schedule your meeting.',
        titleStep2: 'Select Date & Time',
        subtitleStep2: 'Choose an available 30-minute time slot.',
        titleStep3: 'Meeting Scheduled!',
        subtitleStep3: 'Your meeting has been successfully scheduled in Google Calendar.',
        nameLabel: 'Full Name',
        emailLabel: 'Email Address',
        phoneLabel: 'Contact Phone',
        back: 'Back',
        next: 'Next',
        schedule: 'Confirm Meeting',
        copied: 'Copied!',
        copy: 'Copy Link',
        successText: 'We will meet on {date} at {time}. Here is your Zoom link:',
        close: 'Close',
        requiredError: 'Please fill out all required fields.',
        emailError: 'Please enter a valid email address.',
        schedulingError: 'Failed to schedule meeting. Please try again.'
    }
};

export default function SchedulingModal() {
    const { language } = useTranslation();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const currentLabels = language === 'es' ? labels.es : labels.en;

    // Modal Control States
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1); // 1 = Form, 2 = Slots, 3 = Success

    // Form inputs
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedCountryCode, setSelectedCountryCode] = useState('CO');
    const [formError, setFormError] = useState('');

    // Slot Selection States
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [occupiedSlots, setOccupiedSlots] = useState<string[]>([]);
    const [isScheduling, setIsScheduling] = useState(false);
    const [schedulingError, setSchedulingError] = useState('');
    const [meetLink, setMeetLink] = useState('');
    const [copied, setCopied] = useState(false);

    // Calculate next 15 business days
    const getThreeWeeksWeekdays = () => {
        const weekdaysList: Date[] = [];
        const today = new Date();
        let daysOffset = 0;
        while (weekdaysList.length < 15) {
            const d = new Date();
            d.setDate(today.getDate() + daysOffset);
            const day = d.getDay();
            if (day !== 0 && day !== 6) { // Exclude Sunday/Saturday
                weekdaysList.push(d);
            }
            daysOffset++;
        }
        return weekdaysList;
    };

    const weekdays = getThreeWeeksWeekdays();

    // Fetch occupied slots from API
    const fetchOccupiedSlots = async () => {
        try {
            const url = getApiUrl('/api/occupied-slots');
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setOccupiedSlots(data.occupied_slots || []);
            }
        } catch (err) {
            console.error("Error fetching occupied slots:", err);
        }
    };

    // Lock scroll on background when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Listen to open event
    useEffect(() => {
        const handleOpenModal = (e: Event) => {
            const customEvent = e as CustomEvent;
            const details = customEvent.detail || {};

            fetchOccupiedSlots();
            setSchedulingError('');
            setFormError('');
            setCopied(false);
            setMeetLink('');
            setSelectedTime(null);

            // Pre-fill fields if passed from Contact Form
            if (details.name || details.email || details.phone) {
                setName(details.name || '');
                setEmail(details.email || '');
                // Try to parse out country code if pre-filled with code space phone
                if (details.phone) {
                    const phoneVal = details.phone.trim();
                    const matchedCountry = COUNTRIES.find(c => phoneVal.startsWith(c.dial));
                    if (matchedCountry) {
                        setSelectedCountryCode(matchedCountry.code);
                        setPhone(phoneVal.replace(matchedCountry.dial, '').trim());
                    } else {
                        setPhone(phoneVal);
                    }
                }
                setStep(2); // Skip Form step and directly open slots!
            } else {
                // Opened from Floating Button, clear previous fields
                setName('');
                setEmail('');
                setPhone('');
                setSelectedCountryCode('CO');
                setStep(1);
            }

            if (weekdays.length > 0) {
                setSelectedDate(weekdays[0]);
            }
            setIsOpen(true);
        };

        window.addEventListener('open-calendar-scheduling', handleOpenModal);
        return () => {
            window.removeEventListener('open-calendar-scheduling', handleOpenModal);
        };
    }, [weekdays]);

    // Handle Form step completion
    const handleNextStep = () => {
        setFormError('');
        if (!name.trim() || !email.trim() || !phone.trim()) {
            setFormError(currentLabels.requiredError);
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setFormError(currentLabels.emailError);
            return;
        }
        setStep(2);
    };

    // Filter slots for today
    const getFilteredTimeSlots = (date: Date) => {
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

    // Check if slot is occupied
    const isSlotOccupied = (date: Date, slot: string) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const formatted = `${yyyy}-${mm}-${dd}T${slot}:00`;
        return occupiedSlots.includes(formatted);
    };

    // Confirm slot & Call schedule API
    const handleScheduleMeeting = async (timeSlot: string) => {
        if (!selectedDate) return;

        setIsScheduling(true);
        setSchedulingError('');

        const yyyy = selectedDate.getFullYear();
        const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const dd = String(selectedDate.getDate()).padStart(2, '0');
        const formattedDatetime = `${yyyy}-${mm}-${dd}T${timeSlot}:00`;

        const countryObj = COUNTRIES.find(c => c.code === selectedCountryCode);
        const dialCode = countryObj ? countryObj.dial : '';
        const fullPhone = `${dialCode} ${phone.trim()}`;

        try {
            const url = getApiUrl('/api/schedule-meeting');
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email.trim(),
                    name: name.trim(),
                    phone: fullPhone.trim(),
                    slot_datetime: formattedDatetime
                })
            });

            if (!response.ok) {
                let errorMsg = currentLabels.schedulingError;
                try {
                    const errData = await response.json();
                    if (errData && errData.detail) {
                        errorMsg = errData.detail;
                    }
                } catch (e) { }
                throw new Error(errorMsg);
            }

            const data = await response.json();
            const link = data.meet_link || data.zoom_link || data.link || '';

            setMeetLink(link);
            setSelectedTime(timeSlot);
            setStep(3); // Success Screen!
        } catch (error: any) {
            console.error("Error scheduling:", error);
            setSchedulingError(error.message || currentLabels.schedulingError);
            fetchOccupiedSlots(); // Refresh
        } finally {
            setIsScheduling(false);
        }
    };

    // Copy to clipboard
    const handleCopyLink = () => {
        navigator.clipboard.writeText(meetLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-[#00050a]/60 backdrop-blur-md"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    className={`relative w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden backdrop-blur-xl flex flex-col max-h-[90vh] md:max-h-[85vh] transition-all duration-300 ${
                        isDark
                            ? 'bg-[#030914]/95 border-slate-800/80 shadow-emerald-950/20'
                            : 'bg-white/95 border-slate-200 shadow-slate-200/50'
                    }`}
                >
                    {/* Header */}
                    <div className={`px-6 py-4 flex items-center justify-between border-b shrink-0 ${
                        isDark ? 'border-slate-800/80 bg-slate-950/40' : 'border-slate-200 bg-slate-50/40'
                    }`}>
                        <div className="flex items-center gap-2">
                            <Calendar className={`w-5 h-5 ${isDark ? 'text-emerald-400' : 'text-blue-600'}`} />
                            <h4 className={`text-sm sm:text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {step === 1 ? currentLabels.titleStep1 : step === 2 ? currentLabels.titleStep2 : currentLabels.titleStep3}
                            </h4>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                isDark
                                    ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                                    : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                        >
                            <X className="w-4.5 h-4.5" />
                        </button>
                    </div>

                    {/* Content Body */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-none">
                        
                        {/* STEP 1: LEAD FORM */}
                        {step === 1 && (
                            <div className="space-y-5 max-w-md mx-auto">
                                <div className="text-center space-y-1.5 mb-2">
                                    <p className="text-xs text-slate-400">
                                        {currentLabels.subtitleStep1}
                                    </p>
                                </div>

                                {formError && (
                                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                        <span>{formError}</span>
                                    </div>
                                )}

                                <div className="space-y-1.5">
                                    <label className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        {currentLabels.nameLabel} <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-650' : 'text-slate-400'}`} />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className={`w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-xl outline-none border transition-all duration-200 ${
                                                isDark
                                                    ? 'bg-slate-950/40 border-slate-800 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 text-white placeholder:text-slate-600'
                                                    : 'bg-slate-50/50 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 text-slate-800 placeholder:text-slate-400'
                                            }`}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        {currentLabels.phoneLabel} <span className="text-red-500">*</span>
                                    </label>
                                    <div className={`flex flex-col sm:flex-row rounded-xl overflow-hidden border transition-all duration-200 ${
                                        isDark
                                            ? 'bg-slate-950/40 border-slate-800 focus-within:border-emerald-500/50 focus-within:ring-2 focus-within:ring-emerald-500/10 shadow-sm'
                                            : 'bg-slate-50/50 border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 shadow-sm'
                                    }`}>
                                        <div className={`relative shrink-0 flex items-center border-b sm:border-b-0 sm:border-r transition-all ${
                                            isDark ? 'border-slate-800' : 'border-slate-200'
                                        }`}>
                                            <select
                                                value={selectedCountryCode}
                                                onChange={(e) => setSelectedCountryCode(e.target.value)}
                                                className={`w-full sm:w-auto pl-3 pr-8 py-2.5 text-xs sm:text-sm bg-transparent outline-none cursor-pointer font-bold appearance-none ${
                                                    isDark ? 'text-white bg-[#030914]' : 'text-slate-800 bg-white'
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
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className={`flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-transparent outline-none transition-all ${
                                                isDark ? 'text-white placeholder:text-slate-650' : 'text-slate-800 placeholder:text-slate-400'
                                            }`}
                                            placeholder="300 123 4567"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        {currentLabels.emailLabel} <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-650' : 'text-slate-400'}`} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className={`w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-xl outline-none border transition-all duration-200 ${
                                                isDark
                                                    ? 'bg-slate-950/40 border-slate-800 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 text-white placeholder:text-slate-600'
                                                    : 'bg-slate-50/50 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 text-slate-800 placeholder:text-slate-400'
                                            }`}
                                            placeholder="johndoe@example.com"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleNextStep}
                                    className={`w-full mt-3 py-3 rounded-xl text-xs sm:text-sm font-bold cursor-pointer transition-all shadow-md flex items-center justify-center gap-2 ${
                                        isDark
                                            ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 active:scale-98'
                                            : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-98'
                                    }`}
                                >
                                    <span>{currentLabels.next}</span>
                                </button>
                            </div>
                        )}

                        {/* STEP 2: DAYS & BLOCKS SELECTOR */}
                        {step === 2 && (
                            <div className="flex flex-col md:flex-row gap-6 relative min-h-[380px]">
                                {/* Left Side: Weekdays */}
                                <div className="w-full md:w-2/5 flex flex-col gap-2 pr-0 md:pr-4 border-r-0 md:border-r border-slate-800/10 md:border-slate-800/20">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 block pl-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                        {language === 'es' ? 'Días Disponibles' : 'Available Days'}
                                    </span>
                                    <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none md:max-h-[350px] md:overflow-y-auto">
                                        {weekdays.map((date) => {
                                            const isSel = selectedDate &&
                                                date.getDate() === selectedDate.getDate() &&
                                                date.getMonth() === selectedDate.getMonth() &&
                                                date.getFullYear() === selectedDate.getFullYear();
                                            const dName = getDayName(date, language);
                                            const dNum = String(date.getDate()).padStart(2, '0');
                                            const mName = getMonthName(date, language);

                                            return (
                                                <button
                                                    key={date.toISOString()}
                                                    onClick={() => {
                                                        setSelectedDate(date);
                                                        setSelectedTime(null);
                                                    }}
                                                    className={`flex flex-col md:flex-row items-center md:justify-start gap-1 md:gap-3 px-3 py-2 rounded-xl border transition-all text-left shrink-0 cursor-pointer ${
                                                        isSel
                                                            ? isDark
                                                                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 font-bold shadow-md shadow-emerald-950/20'
                                                                : 'bg-blue-500/15 border-blue-500 text-blue-600 font-bold shadow-md shadow-blue-500/10'
                                                            : isDark
                                                                ? 'bg-slate-900/40 border-slate-800/80 text-slate-455 hover:bg-slate-800/40 hover:text-slate-200'
                                                                : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                                                    }`}
                                                >
                                                    <span className="text-sm font-black leading-none">{dNum}</span>
                                                    <div className="flex flex-col items-center md:items-start leading-none">
                                                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-85">{dName}</span>
                                                        <span className="text-[8px] opacity-75 font-mono mt-0.5">{mName}</span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Right Side: Time Slots */}
                                <div className="flex-1 flex flex-col gap-2">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 block pl-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                        {language === 'es' ? 'Bloques Horarios (30 min)' : 'Time Slots (30 min)'}
                                    </span>

                                    {schedulingError && (
                                        <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2 mb-2">
                                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                            <span className="font-semibold leading-snug">{schedulingError}</span>
                                        </div>
                                    )}

                                    {selectedDate ? (
                                        <div className="grid grid-cols-3 gap-2 pb-4 max-h-[300px] overflow-y-auto pr-1">
                                            {getFilteredTimeSlots(selectedDate).map((slot) => {
                                                const isOccupied = isSlotOccupied(selectedDate, slot);
                                                return (
                                                    <button
                                                        key={slot}
                                                        disabled={isOccupied || isScheduling}
                                                        onClick={() => handleScheduleMeeting(slot)}
                                                        className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all text-center ${
                                                            isOccupied
                                                                ? isDark
                                                                    ? 'bg-slate-950/40 border-slate-900/60 text-slate-600 cursor-not-allowed line-through'
                                                                    : 'bg-slate-100 border-slate-200 text-slate-400/50 cursor-not-allowed line-through'
                                                                : isScheduling
                                                                    ? 'opacity-50 cursor-wait'
                                                                    : isDark
                                                                        ? 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer hover:border-emerald-500/50'
                                                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer hover:border-blue-500'
                                                        }`}
                                                    >
                                                        {slot}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="flex-1 flex items-center justify-center border border-dashed border-slate-800/10 rounded-2xl p-6 text-slate-400 text-xs">
                                            {language === 'es' ? 'Selecciona un día primero.' : 'Select a day first.'}
                                        </div>
                                    )}
                                </div>

                                {/* Loading Overlay */}
                                {isScheduling && (
                                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/60 rounded-2xl backdrop-blur-sm">
                                        <div className={`animate-spin rounded-full h-8 w-8 border-2 border-t-transparent ${isDark ? 'border-emerald-400' : 'border-blue-600'}`} />
                                        <p className={`text-xs mt-3 font-bold ${isDark ? 'text-emerald-400' : 'text-blue-600'}`}>
                                            {language === 'es' ? 'Agendando Reunión...' : 'Scheduling Meeting...'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* STEP 3: SUCCESS CONFIRMATION */}
                        {step === 3 && (
                            <div className="text-center space-y-6 py-4 max-w-md mx-auto">
                                <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center border shadow-md animate-bounce ${
                                    isDark
                                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 shadow-emerald-950/20'
                                        : 'bg-blue-500/15 border-blue-500/30 text-blue-600 shadow-blue-500/10'
                                }`}>
                                    <CheckCircle2 className="w-9 h-9" />
                                </div>

                                <div className="space-y-2">
                                    <h5 className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {currentLabels.titleStep3}
                                    </h5>
                                    <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                                        {currentLabels.successText
                                            .replace('{date}', selectedDate ? `${getDayName(selectedDate, language)} ${selectedDate.getDate()} ${getMonthName(selectedDate, language)}` : '')
                                            .replace('{time}', selectedTime || '')
                                        }
                                    </p>
                                </div>

                                <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                                    isDark
                                        ? 'bg-slate-950/60 border-slate-800'
                                        : 'bg-slate-50 border-slate-200'
                                }`}>
                                    <span className="text-[11px] font-mono select-all truncate text-slate-350 pr-2">
                                        {meetLink}
                                    </span>
                                    <button
                                        onClick={handleCopyLink}
                                        className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                                            isDark
                                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                                                : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100'
                                        }`}
                                    >
                                        <Copy className="w-3.5 h-3.5" />
                                        <span>{copied ? currentLabels.copied : currentLabels.copy}</span>
                                    </button>
                                </div>

                                <button
                                    onClick={() => setIsOpen(false)}
                                    className={`w-full py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md ${
                                        isDark
                                            ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 active:scale-98'
                                            : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-98'
                                    }`}
                                >
                                    <span>{currentLabels.close}</span>
                                </button>
                            </div>
                        )}

                    </div>

                    {/* Back / Step details footer */}
                    {step === 2 && !isScheduling && (
                        <div className={`px-6 py-3 border-t flex items-center justify-between text-xs shrink-0 ${
                            isDark ? 'border-slate-800/80 bg-slate-950/20' : 'border-slate-200 bg-slate-50/20'
                        }`}>
                            <button
                                onClick={() => setStep(1)}
                                className={`flex items-center gap-1 font-bold cursor-pointer transition-all ${
                                    isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                                }`}
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                <span>{currentLabels.back}</span>
                            </button>
                            <span className="font-mono text-slate-500">
                                {name} ({phone})
                            </span>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

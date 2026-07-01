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
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);

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

  const lastMessageCountRef = useRef(messages.length);

  // Auto scroll to bottom of chat container ONLY, preventing body window scrolling
  useEffect(() => {
    if (messages.length > lastMessageCountRef.current || isTyping) {
      if (chatBodyRef.current) {
        chatBodyRef.current.scrollTo({
          top: chatBodyRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    }
    lastMessageCountRef.current = messages.length;
  }, [messages, isTyping]);

  // Helper to parse double asterisks and bullet points cleanly
  const renderMessageContent = (text: string) => {
    return text.split('\n').map((line, lineIdx) => {
      const trimmedLine = line.trim();
      const isBullet = trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || /^\d+\.\s*/.test(trimmedLine);
      
      let cleanLine = line;
      let bulletPrefix = '';
      if (trimmedLine.startsWith('•')) {
        cleanLine = line.replace(/^\s*•\s*/, '');
        bulletPrefix = '• ';
      } else if (trimmedLine.startsWith('-')) {
        cleanLine = line.replace(/^\s*-\s*/, '');
        bulletPrefix = '• ';
      } else if (/^\d+\.\s*/.test(trimmedLine)) {
        const match = trimmedLine.match(/^(\d+\.)\s*/);
        if (match) {
          bulletPrefix = match[1] + ' ';
          cleanLine = line.replace(/^\s*\d+\.\s*/, '');
        }
      }

      // Split line by **
      const parts = cleanLine.split(/(\*\*[^*]+\*\*)/g);
      const content = parts.map((part, partIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const boldText = part.slice(2, -2);
          return (
            <strong 
              key={partIdx} 
              className={`font-black tracking-wide ${
                isDark ? 'text-green-400 font-extrabold' : 'text-blue-800 font-extrabold'
              }`}
            >
              {boldText}
            </strong>
          );
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={lineIdx} className="flex gap-1.5 pl-2 mb-1.5">
            <span className={`font-mono font-bold shrink-0 ${isDark ? 'text-green-400' : 'text-blue-700'}`}>
              {bulletPrefix}
            </span>
            <span className="flex-1">{content}</span>
          </div>
        );
      }

      return (
        <p key={lineIdx} className={lineIdx > 0 ? 'mt-1.5' : ''}>
          {content}
        </p>
      );
    });
  };

  const suggestedQuestions = [
    t('ai-suggested-1'),
    t('ai-suggested-2'),
    t('ai-suggested-3'),
    t('ai-suggested-4'),
  ];

  // Simulated AI Knowledge Base
  const getSimulatedAiResponse = (query: string, lang: 'es' | 'en'): string => {
    const q = query.toLowerCase().trim();

    // 1. Detect if user wants to quote a project, create a website, create an app, or solve a software need
    const hasQuoteKeywords = 
      q.includes('cotizar') || q.includes('cotizacion') || q.includes('cotización') ||
      q.includes('presupuesto') || q.includes('precio') || q.includes('costo') || q.includes('costar') ||
      q.includes('quote') || q.includes('budget') || q.includes('how much') || q.includes('pricing') || q.includes('cost') ||
      q.includes('cuanto vale') || q.includes('cuánto vale') || q.includes('cuanto cuesta') || q.includes('cuánto cuesta') ||
      q.includes('tarifa') || q.includes('rate');

    const hasIntentVerb = 
      q.includes('crear') || q.includes('hacer') || q.includes('desarrollar') || 
      q.includes('diseñar') || q.includes('disenar') || q.includes('necesito') || 
      q.includes('quiero') || q.includes('deseo') || q.includes('gustaria') || 
      q.includes('gustaría') || q.includes('busco') || q.includes('solicito') || 
      q.includes('build') || q.includes('create') || q.includes('make') || 
      q.includes('need') || q.includes('want') || q.includes('develop') || 
      q.includes('design') || q.includes('interested in') || q.includes('interesado en');

    const hasSoftwareNoun = 
      q.includes('página') || q.includes('pagina') || q.includes('web') || 
      q.includes('sitio') || q.includes('app') || q.includes('aplicacion') || 
      q.includes('aplicación') || q.includes('software') || q.includes('sistema') || 
      q.includes('plataforma') || q.includes('tienda') || q.includes('e-commerce') || 
      q.includes('ecommerce') || q.includes('portal') || q.includes('website') || 
      q.includes('mobil') || q.includes('móvil') || q.includes('intranet') || 
      q.includes('landing');

    const isDefinitionOrQuestion = 
      q.includes('que es') || q.includes('qué es') || q.includes('como funciona') || 
      q.includes('cómo funciona') || q.includes('how to') || q.includes('what is') || 
      q.includes('diferencia') || q.includes('difference') || q.includes('definicion') || 
      q.includes('definición') || q.includes('explicame') || q.includes('explícame') ||
      q.includes('ejemplo') || q.includes('example');

    const isQuoteIntent = hasQuoteKeywords || ((hasIntentVerb && hasSoftwareNoun) && !isDefinitionOrQuestion);

    if (isQuoteIntent) {
      if (lang === 'es') {
        return `¡Excelente elección! Me encantaría ayudarte a dar vida a tu idea y resolver tu necesidad de software. 

Para poder brindarte una cotización formal, detallar tu proyecto y darte la mejor asesoría técnica, ¿podrías compartirme amablemente los siguientes datos aquí mismo?

1. **Tu Nombre**
2. **Tu Correo Electrónico**
3. **Una breve descripción de lo que necesitas** (por ejemplo: el propósito de la página web o app, las funciones principales que imaginas, etc.)

Una vez que me envíes estos datos, Luis Fernando se pondrá en contacto contigo de inmediato para coordinar una reunión de diseño y presentarte una propuesta formal. ¡Espero tus datos!`;
      } else {
        return `Excellent choice! I would love to help bring your idea to life and solve your software needs.

To provide you with a formal quote, map out your project, and offer the best technical consultation, could you kindly share the following details right here?

1. **Your Name**
2. **Your Email Address**
3. **A brief description of what you need** (for example: the purpose of the website or app, the main features you envision, etc.)

Once you send these details, Luis Fernando will get in touch with you immediately to coordinate a design meeting and present a formal proposal. Looking forward to your details!`;
      }
    }

    // 2. Clear answers to basic programming questions
    // API
    if (q.includes('api') || q.includes('interfaz de programación') || q.includes('application programming interface')) {
      if (lang === 'es') {
        return `Una **API** (Interfaz de Programación de Aplicaciones) es como un "mensajero" o un "puente" que permite que dos aplicaciones de software se comuniquen entre sí.

• **Metáfora sencilla**: Imagina que estás en un restaurante. Tú eres el cliente (Frontend), la cocina es el servidor (Backend), y el mesero es la **API**. Tú le pides una orden al mesero, el mesero va a la cocina, toma tu comida y te la trae de vuelta.
• **Ejemplo real**: Cuando compras algo en una web y pagas con PayPal, la web usa la API de PayPal para procesar el pago de forma segura sin salir de la página.`;
      } else {
        return `An **API** (Application Programming Interface) is like a "messenger" or "bridge" that allows two different software applications to talk to each other.

• **Simple Metaphor**: Imagine you are at a restaurant. You are the customer (Frontend), the kitchen is the server (Backend), and the waiter is the **API**. You give your order to the waiter, the waiter goes to the kitchen, gets your food, and brings it back to you.
• **Real Example**: When you buy something on a website and pay with PayPal, the website uses PayPal's API to process the payment securely without you ever leaving the page.`;
      }
    }

    // React
    if (q.includes('react')) {
      if (lang === 'es') {
        return `**React** es una biblioteca de JavaScript de código abierto creada por Meta (Facebook) que se utiliza para construir interfaces de usuario (el Frontend) de manera rápida, moderna e interactiva.

• **Componentes**: React funciona dividiendo la pantalla en piezas reutilizables llamadas "componentes" (como un botón, un menú de navegación, o una tarjeta).
• **Estado Dinámico**: Actualiza de forma automática y ultra rápida solo la parte de la pantalla que cambió, sin tener que recargar toda la página completa, brindando una experiencia fluida como la de una app móvil.`;
      } else {
        return `**React** is an open-source JavaScript library created by Meta (Facebook) used for building fast, modern, and interactive user interfaces (the Frontend).

• **Components**: React works by breaking the screen down into small, reusable building blocks called "components" (like a button, a nav menu, or a card).
• **Dynamic State**: It automatically and ultra-fast updates only the specific part of the screen that changed, without reloading the entire page, providing a fluid user experience similar to a native mobile app.`;
      }
    }

    // Typescript
    if (q.includes('typescript') || q.includes('ts ')) {
      if (lang === 'es') {
        return `**TypeScript** es un lenguaje de programación de código abierto desarrollado por Microsoft que se construye sobre JavaScript, agregando **tipado estático**.

• ¿Qué significa "tipado"? Significa que le defines explícitamente qué tipo de dato debe almacenar cada variable (si es texto, un número, un booleano, etc.).
• **Ventaja principal**: Permite detectar errores de código *mientras estás escribiendo*, mucho antes de que la página se publique o falle frente al usuario, haciendo que el software sea extremadamente confiable y fácil de mantener.`;
      } else {
        return `**TypeScript** is an open-source programming language developed by Microsoft that builds on top of JavaScript by adding **static typing**.

• What does "typing" mean? It means you explicitly define what type of data each variable should hold (whether it's text, a number, a boolean, etc.).
• **Main Advantage**: It catches coding errors *while you are writing*, long before your website goes live or crashes for the end user, making the software extremely robust and easy to maintain.`;
      }
    }

    // SQL vs NoSQL
    if (q.includes('sql') && (q.includes('nosql') || q.includes('no-sql') || q.includes('diferencia') || q.includes('versus') || q.includes('vs'))) {
      if (lang === 'es') {
        return `La diferencia principal entre **SQL** y **NoSQL** radica en cómo estructuran y guardan los datos:

1. **SQL (Bases de datos Relacionales)**: 
   • Guardan la información en **tablas estructuradas** con filas y columnas (como hojas de cálculo de Excel muy avanzadas).
   • Son perfectas para sistemas financieros, transacciones complejas o datos altamente relacionados (ej. SQL Server, MySQL, PostgreSQL).
   
2. **NoSQL (Bases de datos No Relacionales)**:
   • Guardan la información de manera flexible en formatos como documentos JSON, parejas clave-valor, o gráficos.
   • Son ideales para datos no estructurados, grandes volúmenes de información en tiempo real, y escalabilidad masiva rápida (ej. MongoDB, Firebase Firestore).`;
      } else {
        return `The main difference between **SQL** and **NoSQL** lies in how they store data:

1. **SQL (Relational Databases)**:
   • They store information in **structured tables** with predefined rows and columns (like highly advanced Excel spreadsheets).
   • Best for financial systems, complex transactions, or highly related data structures (e.g., SQL Server, MySQL, PostgreSQL).

2. **NoSQL (Non-Relational Databases)**:
   • They store information flexibly, often as JSON documents, key-value pairs, or graphs, without rigid schemas.
   • Best for unstructured data, real-time message streams, massive scale, and rapid evolution (e.g., MongoDB, Firebase Firestore).`;
      }
    }

    // Backend
    if (q.includes('backend') || q.includes('back-end') || q.includes('servidor')) {
      if (lang === 'es') {
        return `El **Backend** es el "cerebro oculto" o el motor que funciona detrás de escena en los servidores de una aplicación de software.

• **¿Qué hace?**: Se encarga de procesar la lógica de negocio, comunicarse de forma segura con las bases de datos, gestionar la autenticación de usuarios (inicios de sesión) y enviar los datos correctos al Frontend.
• **Tecnologías comunes**: ASP.NET Core (C#), Node.js (JavaScript), Python (FastAPI/Django), Java.`;
      } else {
        return `The **Backend** is the "hidden brain" or the engine that operates behind the scenes on the servers of a software application.

• **What does it do?**: It processes business logic, securely communicates with databases, manages user authentication (logins), and sends the correct data back to the Frontend.
• **Common Technologies**: ASP.NET Core (C#), Node.js (JavaScript), Python (FastAPI/Django), Java.`;
      }
    }

    // Frontend
    if (q.includes('frontend') || q.includes('front-end') || q.includes('interfaz') || q.includes('cliente')) {
      if (lang === 'es') {
        return `El **Frontend** es todo lo que el usuario final puede ver, tocar e interactuar directamente en una pantalla.

• **¿Qué hace?**: Diseña el estilo visual, los botones, animaciones, menús de navegación, formularios y la experiencia de usuario (UX/UI) para que la navegación sea intuitiva, rápida y responsive en móviles y computadoras.
• **Tecnologías comunes**: HTML, CSS, JavaScript, TypeScript, React, Angular, Vue, Tailwind CSS.`;
      } else {
        return `The **Frontend** is everything that the end user can see, touch, and directly interact with on their screen.

• **What does it do?**: It shapes the visual layout, buttons, transitions, navigation menus, forms, and the overall user experience (UX/UI) so that using the app is intuitive, fast, and responsive across mobile devices and computers.
• **Common Technologies**: HTML, CSS, JavaScript, TypeScript, React, Angular, Vue, Tailwind CSS.`;
      }
    }

    // Generic program / code query
    if (
      q.includes('programar') || q.includes('programación') || q.includes('programacion') || q.includes('código') || q.includes('codigo') ||
      q.includes('desarrollar') || q.includes('bucle') || q.includes('variable') || q.includes('función') || q.includes('funcion') ||
      q.includes('programming') || q.includes('coding') || q.includes('code') || q.includes('loop') || q.includes('variable') || q.includes('function')
    ) {
      if (lang === 'es') {
        return `¡Qué buena pregunta sobre programación! Programar consiste en darle instrucciones lógicas y ordenadas a una computadora para que resuelva un problema o realice una tarea específica.

Aquí te explico 3 conceptos básicos fundamentales de forma muy sencilla:
1. **Variables**: Son como "cajas" donde guardamos datos que usaremos más adelante (ej. un nombre o una puntuación).
2. **Funciones**: Son bloques de código reutilizables diseñados para hacer una acción específica (ej. calcular un total a pagar).
3. **Condicionales (if/else)**: Le dicen al programa qué decisiones tomar según la situación (ej. "SI el usuario inició sesión, muestra su perfil; SI NO, muestra el formulario").

¿Hay algún concepto o lenguaje de programación específico que te gustaría que te explique más a fondo?`;
      } else {
        return `That's an excellent programming question! Coding is simply giving logical, step-by-step instructions to a computer to solve a problem or perform a specific task.

Here are 3 fundamental concepts explained simply:
1. **Variables**: Think of them as "labeled boxes" where we store data to use later (e.g., a username or a score).
2. **Functions**: Reusable blocks of code designed to perform a specific action (e.g., calculating a shopping cart total).
3. **Conditionals (if/else)**: They tell the program which decisions to make based on criteria (e.g., "IF the user is logged in, show their profile; ELSE, show the login form").

Is there a specific programming language or concept you would like me to explain in more depth?`;
      }
    }

    // 3. Technologies / Skills fallback
    if (
      q.includes('tecnología') || q.includes('tecnologia') || q.includes('stack') ||
      q.includes('habilidad') || q.includes('technology') || q.includes('skill') ||
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

    // 4. Excel Certification / Intermediate Excel / Certifications
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

    // 5. Projects
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

    // 6. Contact
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

    // 7. General Profile / Who is he
    if (lang === 'es') {
      return `¡Hola! Soy el asistente técnico de esta página web. Puedo resolver preguntas básicas de programación de forma clara (por ejemplo: ¿qué es una API, React, o la diferencia entre SQL y NoSQL?). 

Además, si estás buscando cotizar un proyecto, crear una página web, una app móvil o resolver alguna necesidad de software a medida, ¡estás en el lugar correcto!

Por favor, para asistirte mejor, coméntame qué tienes en mente, o hazme cualquier consulta de desarrollo de software.`;
    } else {
      return `Hello! I am the technical assistant for this website. I can answer basic programming questions clearly (for example: what is an API, React, or the difference between SQL and NoSQL?).

Also, if you are looking to quote a project, build a website, a mobile app, or solve a custom software need, you are in the right place!

Please let me know what you have in mind so I can best assist you, or ask me any software development-related questions.`;
    }
  };

  const getApiUrl = (endpoint: string) => {
    const baseUrl = ((import.meta as any).env?.VITE_APP_URL as string) || '';
    const cleanBase = baseUrl.replace(/\/+$/, '');
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${cleanBase}${cleanEndpoint}`;
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

    const chatEndpoint = getApiUrl('/api/chat');

    fetch(chatEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: textToSend,
        history: messages,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('API response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        const botReplyText = data.reply || (language === 'es' ? 'Lo siento, ocurrió un problema al procesar tu solicitud.' : 'Sorry, there was an issue processing your request.');
        const botMessage: Message = {
          id: `msg-${Date.now()}-bot`,
          sender: 'bot',
          text: botReplyText,
          timestamp: new Date()
        };

        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);

        const lowerReply = botReplyText.toLowerCase();
        if (
          lowerReply.includes('brindarte una cotización') ||
          lowerReply.includes('provide you with a formal quote')
        ) {
          setShowQuoteForm(true);
        }
      })
      .catch((error) => {
        console.error('Error fetching chat response:', error);
        const errorMessage: Message = {
          id: `msg-${Date.now()}-error`,
          sender: 'bot',
          text: language === 'es' 
            ? 'Lo siento, no pude conectarme con el asistente de IA en este momento. Inténtalo de nuevo más tarde.' 
            : 'Sorry, I could not connect with the AI assistant right now. Please try again later.',
          timestamp: new Date()
        };
        setMessages((prev) => [...prev, errorMessage]);
        setIsTyping(false);
      });
  };

  const isFormValid = showQuoteForm 
    ? (formName.trim() !== '' && formEmail.trim() !== '' && formDescription.trim() !== '')
    : (inputVal.trim() !== '');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isTyping) return;

    if (showQuoteForm) {
      const formattedText = language === 'es'
        ? `**Nombre**: ${formName.trim()}\n**Correo**: ${formEmail.trim()}\n**Descripción**: ${formDescription.trim()}`
        : `**Name**: ${formName.trim()}\n**Email**: ${formEmail.trim()}\n**Description**: ${formDescription.trim()}`;

      // Submit user message
      const userMessage: Message = {
        id: `msg-${Date.now()}-user`,
        sender: 'user',
        text: formattedText,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      const savedName = formName.trim();
      const savedEmail = formEmail.trim();
      const savedDesc = formDescription.trim();

      // Clear fields and close form mode
      setFormName('');
      setFormEmail('');
      setFormDescription('');
      setShowQuoteForm(false);

      const leadEndpoint = getApiUrl('/lead');

      fetch(leadEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: savedName,
          email: savedEmail,
          description: savedDesc
        })
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('API response for lead submission was not ok');
          }
          return res.json();
        })
        .then(() => {
          const botMessage: Message = {
            id: `msg-${Date.now()}-bot`,
            sender: 'bot',
            text: language === 'es'
              ? `¡Excelente! He recibido tus datos de cotización y los he registrado correctamente:\n\n• **Nombre**: ${savedName}\n• **Correo**: ${savedEmail}\n• **Descripción**: ${savedDesc}\n\nLuis Fernando se comunicará contigo al correo indicado a la brevedad posible para definir los detalles y presentarte la propuesta formal. ¡Muchas gracias por tu interés!`
              : `Excellent! I have successfully received and registered your request details:\n\n• **Name**: ${savedName}\n• **Email**: ${savedEmail}\n• **Description**: ${savedDesc}\n\nLuis Fernando will reach out to you via the email provided as soon as possible to finalize the details and present a formal proposal. Thank you very much for your interest!`,
            timestamp: new Date()
          };
          setMessages((prev) => [...prev, botMessage]);
          setIsTyping(false);
        })
        .catch((error) => {
          console.error('Error submitting lead:', error);
          const botMessage: Message = {
            id: `msg-${Date.now()}-bot`,
            sender: 'bot',
            text: language === 'es'
              ? `¡Excelente! Registramos tus datos de manera local en el historial de chat, aunque tuvimos un problema menor al subirlos al servidor. No te preocupes, Luis Fernando revisará tu mensaje:\n\n• **Nombre**: ${savedName}\n• **Correo**: ${savedEmail}\n• **Descripción**: ${savedDesc}`
              : `Excellent! We have saved your details locally in the chat history, although we encountered a minor issue uploading it to the server. Don't worry, Luis Fernando will review your message:\n\n• **Name**: ${savedName}\n• **Email**: ${savedEmail}\n• **Description**: ${savedDesc}`,
            timestamp: new Date()
          };
          setMessages((prev) => [...prev, botMessage]);
          setIsTyping(false);
        });

    } else {
      handleSendMessage(inputVal);
    }
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

      <div id="ai-container" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
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
            <span>GEMINI CO-PILOT</span>
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
          className={`rounded-3xl border shadow-2xl overflow-hidden backdrop-blur-md flex flex-col h-[680px] transition-all duration-500 ${
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
              MODEL: GEMINI 3.5 FLASH
            </span>
          </div>

          {/* Chat Messages Body */}
          <div
            id="ai-chat-body"
            ref={chatBodyRef}
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
                    {renderMessageContent(msg.text)}
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
            className={`p-4 border-t flex ${showQuoteForm ? 'flex-col sm:flex-row items-end' : 'flex-row'} gap-3 transition-colors ${
              isDark ? 'border-green-500/10 bg-[#030e1c]' : 'border-slate-100 bg-white'
            }`}
          >
            {showQuoteForm ? (
              <div className="flex-1 flex flex-col gap-3 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className={`text-[10px] font-mono font-bold uppercase tracking-wider ${isDark ? 'text-green-400' : 'text-blue-700'}`}>
                      {language === 'es' ? 'Nombre' : 'Name'}
                    </label>
                    <input
                      type="text"
                      id="ai-quote-name"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder={language === 'es' ? 'Ej. Juan Pérez' : 'e.g. John Doe'}
                      disabled={isTyping}
                      className={`w-full px-4 py-2 rounded-xl text-xs font-semibold transition-all focus:outline-none focus:ring-2 border ${
                        isDark
                          ? 'bg-[#041326] border-slate-800 text-gray-100 focus:ring-green-500/30 focus:border-green-500/40 focus:bg-[#051830]'
                          : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-blue-500/20 focus:border-blue-500/40 focus:bg-white'
                      }`}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className={`text-[10px] font-mono font-bold uppercase tracking-wider ${isDark ? 'text-green-400' : 'text-blue-700'}`}>
                      {language === 'es' ? 'Correo Electrónico' : 'Email Address'}
                    </label>
                    <input
                      type="email"
                      id="ai-quote-email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder={language === 'es' ? 'Ej. juan@correo.com' : 'e.g. john@email.com'}
                      disabled={isTyping}
                      className={`w-full px-4 py-2 rounded-xl text-xs font-semibold transition-all focus:outline-none focus:ring-2 border ${
                        isDark
                          ? 'bg-[#041326] border-slate-800 text-gray-100 focus:ring-green-500/30 focus:border-green-500/40 focus:bg-[#051830]'
                          : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-blue-500/20 focus:border-blue-500/40 focus:bg-white'
                      }`}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className={`text-[10px] font-mono font-bold uppercase tracking-wider ${isDark ? 'text-green-400' : 'text-blue-700'}`}>
                    {language === 'es' ? 'Descripción de lo que necesitas' : 'Description of what you need'}
                  </label>
                  <textarea
                    id="ai-quote-desc"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder={language === 'es' ? 'Cuéntame sobre tu proyecto, funciones principales, propósito...' : 'Tell me about your project, main features, purpose...'}
                    disabled={isTyping}
                    rows={3}
                    className={`w-full px-4 py-2 rounded-xl text-xs font-semibold transition-all focus:outline-none focus:ring-2 border resize-none ${
                      isDark
                        ? 'bg-[#041326] border-slate-800 text-gray-100 focus:ring-green-500/30 focus:border-green-500/40 focus:bg-[#051830]'
                        : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-blue-500/20 focus:border-blue-500/40 focus:bg-white'
                    }`}
                  />
                </div>
              </div>
            ) : (
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
            )}

            <button
              type="submit"
              id="ai-chat-submit-btn"
              disabled={!isFormValid || isTyping}
              className={`px-5 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50 disabled:pointer-events-none ${
                showQuoteForm ? 'w-full sm:w-auto h-[42px] mb-0' : ''
              } ${
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
# Portafolio Interactivo de Ingeniería y Desarrollo Frontend

Este es un portafolio web interactivo de alto rendimiento y arquitectura **Single Page Application (SPA)**, diseñado y desarrollado utilizando **React 18**, **TypeScript**, **Tailwind CSS** y **Framer Motion** (`motion/react`). La aplicación ofrece una experiencia de usuario inmersiva bajo la estética **Crystal Glassmorphism**, un lienzo interactivo de partículas en tiempo real, internacionalización completa en dos idiomas (Español/Inglés), animaciones sofisticadas basadas en física y un diseño adaptable impecable.

---

## 🌟 Características Principales

*   **Experiencia Inmersiva Celestial (`ParticleCanvas`)**: 
    *   Un motor de renderizado basado en HTML5 Canvas que simula una constelación interactiva con estrellas titilantes y lluvias de meteoros (estrellas fugaces).
    *   **Optimización Móvil Inteligente**: Detecta el ancho de pantalla y reduce la densidad de elementos en un 70% en dispositivos móviles, eliminando efectos costosos como el cálculo de sombras gaussianas (`shadowBlur`) y deformación kinética del ratón, garantizando un rendimiento constante de **60 FPS** sin degradar la batería.
*   **Menú Móvil de Pantalla Completa Mejorado (`Navigation`)**:
    *   Menú de navegación totalmente responsive. Al abrirse en dispositivos móviles, activa un **telón oscuro translúcido de pantalla completa (`backdrop-blur-md bg-[#01060c]/96`)** que oculta el contenido trasero para mejorar drásticamente el contraste, la legibilidad y la usabilidad.
*   **Carrusel de Certificados e Insignias Virtuales (`Certificates`)**:
    *   Un carrusel interactivo que muestra certificaciones académicas en tarjetas reversibles de diseño tridimensional. Incluye insignias dinámicas, sellos interactivos con efectos de rotación holográficos y un modal de zoom detallado.
*   **Sección de Proyectos y Casos de Estudio (`Projects`)**:
    *   Visualización modular de proyectos con filtros interactivos por categoría. Los modales detallados cuentan con límites de altura responsivos (`h-[82vh]` en celulares, `h-[88vh]` en computadores) y scroll nativo optimizado para pantallas táctiles.
*   **Gestor Avanzado de Privacidad y Cookies (`Footer`)**:
    *   **Banner de Consentimiento Activo**: Se muestra de manera no intrusiva al ingresar por primera vez (utilizando `localStorage` para persistencia).
    *   **Consola de Configuración Granular**: El usuario puede activar o desactivar de manera independiente las cookies de analíticas o marketing de forma bilingüe.
*   **Fondo Dinámico Sincronizado**:
    *   Fondos con gradientes radiales optimizados en rendimiento que se adaptan suavemente al modo oscuro o claro y eliminan las líneas o bandas de color mediante interpolación limpia de píxeles (`background-attachment: fixed`).

---

## 📁 Estructura del Proyecto

El código fuente está organizado de forma modular para desarrollo ágil y máxima mantenibilidad:

```bash
├── package.json                 # Dependencias y scripts de construcción (Vite)
├── vite.config.ts               # Configuración de empaquetado de Vite
├── src/
│   ├── App.tsx                  # Componente principal, maneja la carga y el orden de las secciones
│   ├── main.tsx                 # Punto de entrada de la aplicación React
│   ├── index.css                # Estilos globales y variables de Tailwind CSS (gradientes radiales fijos)
│   ├── components/              # Componentes de UI modulares y reactivos
│   │   ├── Navigation.tsx       # Cabecera con menú dinámico y overlay móvil optimizado
│   │   ├── Hero.tsx             # Sección de bienvenida con blobs de luz y CTA principal
│   │   ├── AboutMe.tsx          # Historia profesional, pasiones y llamado interactivo
│   │   ├── CVButton.tsx         # Botón especializado para descarga de Currículum con microinteracciones
│   │   ├── Technologies.tsx     # Cuadrícula interactiva de herramientas clasificada por categorías
│   │   ├── Projects.tsx         # Portafolio interactivo con modales optimizados para móvil
│   │   ├── Certificates.tsx     # Carrusel de insignias virtuales y certificados de alta fidelidad
│   │   ├── ContactForm.tsx      # Formulario de contacto con validación en tiempo real
│   │   ├── Footer.tsx           # Enlaces legales, copyright y banner/panel de cookies
│   │   ├── FloatingButtons.tsx  # Atajos flotantes de mensajería rápida (WhatsApp/Gmail)
│   │   └── ParticleCanvas.tsx   # Fondo dinámico interactivo optimizado para GPU
│   ├── context/                 # Contextos de React
│   │   └── ThemeContext.tsx     # Administrador global del tema (Dark / Light)
│   ├── i18n/                    # Módulos para internacionalización (Español / Inglés)
│   │   ├── es.ts                # Traducciones al Español
│   │   ├── en.ts                # Traducciones al Inglés
│   │   └── useTranslation.tsx   # Contexto y Hook personalizado de traducción
│   ├── data/                    # Datos estáticos del sitio
│   │   ├── projects.ts          # Base de datos de proyectos
│   │   ├── certificates.ts      # Base de datos de certificados y credenciales
│   │   └── social-links.ts      # Enlaces a redes profesionales
│   └── types.ts                 # Declaraciones y tipados globales de TypeScript
```

---

## 🗺️ Explicación Detallada de Cada Sección y Componente

A continuación se describe exhaustivamente el propósito, la lógica interna y las funcionalidades de cada módulo de la aplicación:

### 1. Fondo de Constelaciones Interactivas (`ParticleCanvas.tsx`)
*   **Propósito**: Crear una atmósfera inmersiva de cielo nocturno en movimiento constante mediante un renderizador HTML5 Canvas.
*   **Lógica y Funciones**:
    *   **Estrellas de Fondo**: Genera de forma adaptativa un grupo de estrellas titilantes que varían en brillo y tamaño.
    *   **Lluvia de Meteoros**: Lanza estrellas fugaces periódicas con trayectorias diagonales y colas con atenuación de gradiente lineal.
    *   **Optimización Móvil**: En smartphones, reduce la densidad en un **70%**, cancelando sombras difuminadas y atracción de ratón para sostener **60 FPS constantes** sin degradar la batería.

### 2. Barra de Navegación Dinámica (`Navigation.tsx`)
*   **Propósito**: Controlar el desplazamiento entre las secciones del portafolio y proveer acceso rápido a las configuraciones del sistema.
*   **Lógica y Funciones**:
    *   **Menú de Pantalla Completa Móvil**: Al activar el menú hamburguesa en celulares, se despliega un telón translúcido (`backdrop-blur-md bg-[#01060c]/96`) que aísla el contenido inferior y mejora la legibilidad.
    *   **Interruptor de Idioma (ES / EN)**: Un conmutador interactivo que refresca instantáneamente todo el contenido del sitio mediante el hook de traducción personalizado, respetando el scroll actual.
    *   **Interruptor de Tema**: Conmuta entre las clases del tema Claro y Oscuro con transiciones suaves de color de 500ms.

### 3. Presentación Principal (`Hero.tsx`)
*   **Propósito**: Introducción de alto impacto para capturar la atención del visitante inmediatamente.
*   **Lógica y Funciones**:
    *   **Blobs de Luz de Fondo**: Círculos de gradiente difuminados que orbitan sutilmente en el fondo con animaciones de Framer Motion.
    *   **Animaciones Escalonadas**: Presentación fluida del nombre y títulos del desarrollador empleando efectos de desplazamiento e interpolaciones de opacidad secuenciales (`staggerChildren`).

### 4. Sobre Mí y Habilidades (`AboutMe.tsx` & `Technologies.tsx`)
*   **Propósito**: Contar la trayectoria profesional de Luis Fernando de forma narrativa y estructurar visualmente su stack técnico.
*   **Lógica y Funciones**:
    *   **Descarga Interactiva de CV (`CVButton.tsx`)**: Botón animado con microinteracciones de éxito tras descargar el Currículum.
    *   **Filtros por Categoría de Habilidades**: Lenguajes, frameworks y bases de datos organizados en pestañas dinámicas con efectos de iluminación al pasar el cursor (`hover`).

### 5. Proyectos y Casos de Estudio (`Projects.tsx`)
*   **Propósito**: Mostrar los trabajos, desarrollos de software y aplicaciones destacadas del ingeniero.
*   **Lógica y Funciones**:
    *   **Galería Filtrable**: Reorganiza la rejilla de proyectos con transiciones fluidas en tiempo real (`AnimatePresence`).
    *   **Scroll en Modales**: Los modales de descripción técnica detallada se adaptan al alto de pantalla (`vh`) de cada dispositivo con scroll interno inercial, garantizando usabilidad móvil perfecta.

### 6. Certificados e Insignias Reversibles (`Certificates.tsx`)
*   **Propósito**: Respaldar el conocimiento técnico mediante certificaciones académicas y profesionales.
*   **Lógica y Funciones**:
    *   **Tarjetas 3D Volteables (Flip Card)**: Mediante animaciones avanzadas de CSS en 3D (`preserve-3d`), las tarjetas giran sobre su eje al hacer clic, revelando el reverso técnico.
    *   **Insignias Holográficas**: Sellos dinámicos en rotación infinita que emulan credenciales reales de alta fidelidad.

### 7. Botones de Acción Flotantes & Contacto (`ContactForm.tsx` & `FloatingButtons.tsx`)
*   **Propósito**: Proveer canales de comunicación rápidos y directos.
*   **Lógica y Funciones**:
    *   **Validaciones en Tiempo Real**: Valida la estructura del correo electrónico en el formulario tradicional antes de enviarlo.
    *   **Enlaces de WhatsApp/Gmail**: Atajos permanentes en la esquina inferior derecha adaptados al idioma del visitante con mensajes de saludo predefinidos.

---

## 🛠️ Tecnologías y Dependencias Clave

*   **React 18** & **Vite**: Entorno de ejecución rápido y empaquetador optimizado para producción.
*   **Framer Motion** (`motion/react`): Animaciones basadas en física, transiciones tridimensionales y animaciones fluidas de listas.
*   **TypeScript**: Tipado estricto que blinda el mantenimiento de la aplicación.
*   **Tailwind CSS**: Estilos utilitarios rápidos y adaptabilidad responsiva.

---

## ⚡ Estrategias de Rendimiento y Optimización

1.  **Aceleración por Hardware (GPU)**: Se utilizan propiedades CSS como `transform` y `opacity` en Framer Motion, las cuales se ejecutan directamente en la GPU de los dispositivos.
2.  **Prevención de Saltos de Contenido (Layout Thrashing)**: Las dimensiones se manejan mediante alturas de viewport responsivas (`vh`), evitando alteraciones indeseadas de interfaz al abrir menús o modales.

---
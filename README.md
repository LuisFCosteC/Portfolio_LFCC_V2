# Portafolio Interactivo de Ingeniería y Desarrollo Frontend

Este es un portafolio web interactivo de alto rendimiento, diseñado y desarrollado con **React**, **TypeScript**, **Tailwind CSS** y **framer-motion** (`motion/react`). Cuenta con un diseño contemporáneo inmersivo de estilo "Crystal Glassmorphism", efectos celestiales en tiempo real mediante un lienzo interactivo de HTML5 Canvas optimizado para dispositivos móviles y una completa gama de secciones profesionales.

---

## 🌟 Características Principales

*   **Experiencia Inmersiva Celestial (`ParticleCanvas`)**: 
    *   Un motor de renderizado basado en HTML5 Canvas que simula una constelación interactiva con estrellas titilantes y lluvias de meteoros (estrellas fugaces).
    *   **Optimización Móvil Inteligente**: Detecta el ancho de pantalla y reduce la densidad de elementos en un 70% en dispositivos móviles, eliminando efectos costosos como el cálculo de sombras gaussianas (`shadowBlur`) y deformación kinética del ratón, garantizando un rendimiento constante de **60 FPS** sin degradar la batería.
    *   Efecto de interacción suave del cursor en pantallas de escritorio.
*   **Menú Móvil de Pantalla Completa Mejorado (`Navigation`)**:
    *   Menú de navegación totalmente responsive.
    *   Al abrirse en dispositivos móviles, activa un **telón oscuro translúcido de pantalla completa (`backdrop-blur-md bg-[#01060c]/96`)** que oculta el contenido trasero para mejorar drásticamente el contraste, la legibilidad y la usabilidad.
*   **Carrusel de Certificados e Insignias Virtuales (`Certificates`)**:
    *   Un carrusel interactivo que muestra certificaciones académicas en tarjetas reversibles de diseño tridimensional.
    *   Incluye insignias dinámicas, sellos interactivos con efectos de rotación holográficos y un modal de zoom detallado.
*   **Sección de Proyectos y Casos de Estudio (`Projects`)**:
    *   Visualización modular de proyectos con filtros interactivos por categoría.
    *   **Optimización de Scroll en Modales**: Los modales detallados de proyectos cuentan con límites de altura responsivos (`h-[82vh]` en celulares, `h-[88vh]` en computadores) y scroll nativo optimizado para una lectura cómoda desde cualquier pantalla táctil.
*   **Gestor Avanzado de Privacidad y Cookies (`Footer`)**:
    *   **Banner de Consentimiento Activo**: Se muestra de manera no intrusiva al ingresar por primera vez (utilizando `localStorage` para persistencia).
    *   **Consola de Configuración Granular**: El usuario puede activar o desactivar de manera independiente las cookies de analíticas o marketing.
    *   Sistema bilingüe con soporte completo en Español e Inglés.
*   **Fondo Dinámico Sincronizado**:
    *   Fondos con gradientes radiales optimizados en rendimiento que se adaptan suavemente al modo oscuro o claro y eliminan las líneas o bandas de color mediante interpolación limpia de píxeles (`background-attachment: fixed`).

---

## 📁 Estructura del Proyecto

El código fuente está organizado de forma modular, facilitando el mantenimiento y la escalabilidad del portafolio:

```bash
├── src/
│   ├── App.tsx                  # Componente principal, maneja la carga y el orden de las secciones
│   ├── main.tsx                 # Punto de entrada de la aplicación React
│   ├── index.css                # Estilos globales y variables de Tailwind CSS (gradientes radiales fijos)
│   ├── components/              # Componentes de UI modulares y reactivos
│   │   ├── Navigation.tsx       # Cabecera con menú dinámico y overlay móvil optimizado
│   │   ├── Hero.tsx             # Sección de bienvenida con blobs de luz y CTA principal
│   │   ├── AboutMe.tsx          # Historia profesional, pasiones y llamado interactivo
│   │   ├── Technologies.tsx     # Cuadrícula interactiva de herramientas clasificada por categorías
│   │   ├── Projects.tsx         # Portafolio interactivo con modales optimizados para móvil
│   │   ├── Certificates.tsx     # Carrusel de insignias virtuales y certificados de alta fidelidad
│   │   ├── ContactForm.tsx      # Formulario de contacto con validación en tiempo real
│   │   ├── Footer.tsx           # Enlaces legales, copyright y banner/panel de cookies
│   │   └── ParticleCanvas.tsx   # Fondo dinámico interactivo optimizado para GPU
│   ├── context/                 # Contextos de React
│   │   └── ThemeContext.tsx     # Administrador global del tema (Dark / Light)
│   ├── i18n/                    # Módulos para internacionalización (Español / Inglés)
│   │   ├── es.ts                # Traducciones al Español
│   │   ├── en.ts                # Traducciones al Inglés
│   │   └── useTranslation.ts    # Hook personalizado de traducción
│   ├── data/                    # Datos estáticos del sitio
│   │   ├── projects.ts          # Base de datos de proyectos
│   │   ├── certificates.ts      # Base de datos de certificados y credenciales
│   │   └── social-links.ts      # Enlaces a redes profesionales
│   └── types.ts                 # Declaraciones y tipados globales de TypeScript
```

---

## 🛠️ Tecnologías Utilizadas

*   **React 18** & **Vite**: Entorno de ejecución rápido y empaquetado ultra-liviano.
*   **TypeScript**: Tipado estricto para asegurar la robustez del código.
*   **Tailwind CSS**: Maquetación responsiva moderna con estilos utilitarios rápidos y eficientes.
*   **framer-motion** (`motion/react`): Animaciones elegantes basadas en física física real, gestos interactivos y transiciones de entrada escalonadas.
*   **Lucide React**: Biblioteca de iconos de alta calidad, vectorizados e integrados uniformemente.

---

## ⚡ Optimización y Rendimiento

1.  **Reducción de Carga Computacional**: 
    El archivo `ParticleCanvas.tsx` adapta la simulación celesta según el hardware. En móviles, se desactivan los bucles anidados de renderizado de sombras complejas de Canvas, lo que reduce drásticamente el uso de CPU.
2.  **Prevención de Saltos de Contenido (Layout Thrashing)**: 
    Los menús dinámicos y los modales utilizan contenedores con tamaños fijos expresados en altura de viewport responsivo (`vh`), de modo que el teclado virtual de los móviles o el redimensionado de pantallas no mueva ni altere la experiencia del usuario.
3.  **Gradientes Sin Bandas de Color**: 
    La propiedad `background-attachment: fixed` en los gradientes radiales de `index.css` elimina el efecto visual de "escalonamiento" o líneas de diferencia de color al hacer scroll.
4.  **Backdrop Blurs Optimizados**: 
    Los filtros CSS de desenfoque (`backdrop-blur`) se aplican utilizando aceleración por hardware mediante combinaciones con la propiedad `z-index` y contenedores fijos.
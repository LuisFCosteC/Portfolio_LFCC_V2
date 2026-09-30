import {StrictMode} from 'react';
import {flushSync} from 'react-dom';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Mantiene la posicion de scroll al refrescar. La restauracion nativa del
// navegador falla en esta SPA porque el contenido se monta despues de que el
// navegador intenta restaurar, asi que se guarda y reaplica manualmente.
const SCROLL_KEY = 'lfcc-scroll-y';
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.addEventListener('pagehide', () => {
  try {
    sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
  } catch {}
});

let savedY = 0;
try {
  savedY = Number(sessionStorage.getItem(SCROLL_KEY)) || 0;
} catch {}
const shouldRestore = savedY > 0 && !window.location.hash;

// Salto sin animacion: se anula temporalmente el `scroll-behavior: smooth` del CSS.
const jumpTo = (y: number) => {
  const html = document.documentElement;
  const prev = html.style.scrollBehavior;
  html.style.scrollBehavior = 'auto';
  window.scrollTo({ top: y, behavior: 'instant' });
  html.style.scrollBehavior = prev;
};

// Render sincrono para que el DOM exista ya y la posicion se aplique antes del
// primer pintado: asi no se ve la pagina arrancar arriba y desplazarse.
const root = createRoot(document.getElementById('root')!);
flushSync(() => {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});

if (shouldRestore) {
  jumpTo(savedY);

  // Respaldo por si el layout aun crece (imagenes, fuentes): reintenta sin
  // animacion hasta llegar o hasta que el usuario haga scroll por su cuenta.
  if (Math.abs(window.scrollY - savedY) > 2) {
    let cancelled = false;
    const cancel = () => { cancelled = true; };
    const userEvents = ['wheel', 'touchstart', 'keydown', 'mousedown'];
    userEvents.forEach((ev) => window.addEventListener(ev, cancel, { once: true, passive: true }));

    const deadline = performance.now() + 2500;
    const tick = () => {
      if (cancelled) return;
      jumpTo(savedY);
      if (Math.abs(window.scrollY - savedY) > 2 && performance.now() < deadline) {
        setTimeout(tick, 50);
      } else {
        userEvents.forEach((ev) => window.removeEventListener(ev, cancel));
      }
    };
    setTimeout(tick, 0);
  }
}

import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Mouse coordinates relative to the canvas
    const mouse = {
      x: null as number | null,
      y: null as number | null,
      targetX: null as number | null,
      targetY: null as number | null,
    };

    // Particles/Stars
    interface Star {
      x: number;
      y: number;
      size: number;
      alpha: number;
      twinkleSpeed: number;
      twinkleDir: number;
      baseX: number;
      baseY: number;
      color: string;
      parallaxFactor: number;
    }

    // Comets
    interface Comet {
      x: number;
      y: number;
      vx: number;
      vy: number;
      length: number;
      width: number;
      speed: number;
      alpha: number;
      color: string;
      colorBase: string;
      active: boolean;
      life: number;
      maxLife: number;
    }

    let stars: Star[] = [];
    let comets: Comet[] = [];

    const getStarColor = () => {
      if (isDark) {
        return Math.random() > 0.4 ? 'rgba(74, 222, 128, ' : 'rgba(56, 189, 248, '; // green or cyan
      } else {
        return Math.random() > 0.4 ? 'rgba(16, 185, 129, ' : 'rgba(14, 165, 233, '; // emerald or sky-blue
      }
    };

    const getCometColor = () => {
      const rand = Math.random();
      if (isDark) {
        if (rand < 0.4) {
          // Vivid Neon Green
          return {
            head: 'rgba(74, 222, 128, 1)',
            headBase: 'rgba(74, 222, 128, '
          };
        } else if (rand < 0.8) {
          // Cyber Cyan / Electric Blue
          return {
            head: 'rgba(56, 189, 248, 1)',
            headBase: 'rgba(56, 189, 248, '
          };
        } else {
          // Hyper White
          return {
            head: 'rgba(255, 255, 255, 1)',
            headBase: 'rgba(255, 255, 255, '
          };
        }
      } else {
        if (rand < 0.4) {
          // Emerald Green
          return {
            head: 'rgba(16, 185, 129, 1)',
            headBase: 'rgba(16, 185, 129, '
          };
        } else if (rand < 0.8) {
          // Futuristic Sky Blue
          return {
            head: 'rgba(14, 165, 233, 1)',
            headBase: 'rgba(14, 165, 233, '
          };
        } else {
          // Steel Silver / Pure White
          return {
            head: 'rgba(59, 130, 246, 1)',
            headBase: 'rgba(59, 130, 246, '
          };
        }
      }
    };

    const initScene = (w: number, h: number) => {
      stars = [];
      comets = [];

      const isMobile = w < 768;

      // Create stable celestial stars
      const starCount = Math.min(Math.floor((w * h) / (isMobile ? 22000 : 10000)), isMobile ? 45 : 160);
      for (let i = 0; i < starCount; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        stars.push({
          x,
          y,
          baseX: x,
          baseY: y,
          size: Math.random() * (isMobile ? 1.0 : 1.5) + 0.5,
          alpha: Math.random() * 0.6 + 0.1,
          twinkleSpeed: Math.random() * 0.015 + 0.005,
          twinkleDir: Math.random() > 0.5 ? 1 : -1,
          color: getStarColor(),
          parallaxFactor: Math.random() * 15 + 5, // higher = moves less, lower = moves more
        });
      }

      // Pre-populate many more comets (lush meteor shower effect, capped on mobile)
      const initialCometCount = isMobile ? 5 : Math.max(12, Math.min(Math.floor(w / 100), 24));
      for (let i = 0; i < initialCometCount; i++) {
        comets.push(createComet(w, h, true));
      }
    };

    const createComet = (w: number, h: number, randomStart = false): Comet => {
      const angle = (135 + Math.random() * 35) * (Math.PI / 180); // Diagonal path (down & left)
      const speed = Math.random() * 4.5 + 3.5; // Faster, dynamic comets
      const isMobile = w < 768;

      // Start position
      let startX = 0;
      let startY = 0;

      if (randomStart) {
        startX = Math.random() * w;
        startY = Math.random() * h;
      } else {
        // Start from top or right edges
        if (Math.random() > 0.5) {
          startX = Math.random() * w * 1.2;
          startY = -100;
        } else {
          startX = w + 100;
          startY = Math.random() * h * 0.8 - 100;
        }
      }

      const colors = getCometColor();
      const maxLife = Math.random() * 120 + 80;

      return {
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: Math.random() * (isMobile ? 35 : 100) + (isMobile ? 25 : 70),
        width: Math.random() * (isMobile ? 1.2 : 1.8) + (isMobile ? 0.6 : 1),
        speed,
        alpha: Math.random() * 0.75 + 0.25,
        color: colors.head,
        colorBase: colors.headBase,
        active: true,
        life: randomStart ? Math.floor(Math.random() * (maxLife - 20)) : 0, // Stagger existing comets
        maxLife,
      };
    };

    // Update dimensions on container resize
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: entryWidth, height: entryHeight } = entry.contentRect;
        width = entryWidth;
        height = entryHeight;
        canvas.width = width;
        canvas.height = height;
        initScene(width, height);
      }
    });

    resizeObserver.observe(container);

    // Mouse coordinates interpolation for fluid inertia
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.targetX = null;
      mouse.targetY = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Main animation loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse coordinates interpolation
      if (mouse.targetX !== null && mouse.targetY !== null) {
        if (mouse.x === null) mouse.x = mouse.targetX;
        if (mouse.y === null) mouse.y = mouse.targetY;
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;
      } else {
        mouse.x = null;
        mouse.y = null;
      }

      // 1. Draw and update stars
      for (const s of stars) {
        // Twinkle effect
        s.alpha += s.twinkleSpeed * s.twinkleDir;
        if (s.alpha >= 0.8) {
          s.alpha = 0.8;
          s.twinkleDir = -1;
        } else if (s.alpha <= 0.1) {
          s.alpha = 0.1;
          s.twinkleDir = 1;
        }

        // Parallax depth based on mouse position
        let offsetX = 0;
        let offsetY = 0;
        if (mouse.x !== null && mouse.y !== null) {
          offsetX = (mouse.x - width / 2) / s.parallaxFactor;
          offsetY = (mouse.y - height / 2) / s.parallaxFactor;
        }

        s.x = s.baseX + offsetX;
        s.y = s.baseY + offsetY;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = s.color + s.alpha + ')';
        ctx.fill();
      }

      // 2. Draw and update comets
      const isMobile = width < 768;
      for (let i = 0; i < comets.length; i++) {
        const c = comets[i];
        if (!c.active) {
          // Respawn a new comet
          comets[i] = createComet(width, height);
          continue;
        }

        // Mouse kinetic warp: if mouse is close, deviate / bend path slightly to feel responsive (disabled on mobile)
        let forceX = 0;
        let forceY = 0;
        if (!isMobile && mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - c.x;
          const dy = mouse.y - c.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 180) {
            const pull = (180 - dist) / 180;
            const angle = Math.atan2(dy, dx);
            forceX = Math.cos(angle) * pull * 0.45;
            forceY = Math.sin(angle) * pull * 0.45;
          }
        }

        // Update position
        c.x += c.vx + forceX;
        c.y += c.vy + forceY;
        c.life++;

        // Fade in/out depending on life
        let currentAlpha = c.alpha;
        if (c.life < 20) {
          currentAlpha *= (c.life / 20); // Fade-in
        } else if (c.life > c.maxLife - 20) {
          currentAlpha *= ((c.maxLife - c.life) / 20); // Fade-out
        }

        if (c.life >= c.maxLife || c.x < -100 || c.y > height + 100 || c.x > width + 100) {
          c.active = false;
        }

        // Draw the comet trail (line with gradient)
        if (currentAlpha > 0) {
          const trailX = c.x - (c.vx * (c.length / c.speed));
          const trailY = c.y - (c.vy * (c.length / c.speed));

          const grad = ctx.createLinearGradient(c.x, c.y, trailX, trailY);
          grad.addColorStop(0, c.colorBase + `${currentAlpha})`);
          grad.addColorStop(0.2, c.colorBase + `${currentAlpha * 0.6})`);
          grad.addColorStop(1, isDark ? 'rgba(16, 185, 129, 0)' : 'rgba(4, 120, 87, 0)');

          ctx.beginPath();
          ctx.moveTo(c.x, c.y);
          ctx.lineTo(trailX, trailY);
          ctx.lineWidth = c.width;
          ctx.lineCap = 'round';
          ctx.strokeStyle = grad;

          // Bloom effect in dark mode (Only enabled on desktop with a reduced radius to avoid GPU stall)
          if (!isMobile) {
            ctx.shadowBlur = isDark ? 6 : 2;
            ctx.shadowColor = c.color;
          } else {
            ctx.shadowBlur = 0;
          }

          ctx.stroke();

          // Draw the comet core head
          if (isMobile) {
            // Draw a simple core on mobile - runs extremely fast and looks gorgeous
            ctx.beginPath();
            ctx.arc(c.x, c.y, Math.max(2.5, c.width * 2.2), 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
          } else {
            // Draw the comet core head as a beautiful shining 4-pointed star
            ctx.beginPath();
            const starRadius = Math.max(7, c.width * 5); // beautiful star flare size
            ctx.moveTo(c.x, c.y - starRadius);
            ctx.quadraticCurveTo(c.x, c.y, c.x + starRadius, c.y);
            ctx.quadraticCurveTo(c.x, c.y, c.x, c.y + starRadius);
            ctx.quadraticCurveTo(c.x, c.y, c.x - starRadius, c.y);
            ctx.quadraticCurveTo(c.x, c.y, c.x, c.y - starRadius);
            ctx.fillStyle = '#ffffff';
            ctx.fill();

            // Draw a small bright central core circle inside
            ctx.beginPath();
            ctx.arc(c.x, c.y, c.width * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
          }

          // Reset shadow
          ctx.shadowBlur = 0;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isDark]);

  return (
    <div
      ref={containerRef}
      id="particle-bg-container"
      className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0"
    >
      <canvas
        ref={canvasRef}
        id="particle-bg-canvas"
        className="block w-full h-full opacity-65 mix-blend-screen dark:mix-blend-lighten"
      />
    </div>
  );
}

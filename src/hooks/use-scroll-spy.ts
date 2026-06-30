import { useEffect, useState, useRef } from 'react';

export function useScrollSpy(sectionIds: string[], options?: IntersectionObserverInit) {
  const [activeId, setActiveId] = useState<string>('');
  const observers = useRef<{ [key: string]: IntersectionObserverEntry }>({});

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        observers.current[entry.target.id] = entry;
      });

      // Find the section that is currently intersecting the most or highest on screen
      const visibleSections = (Object.values(observers.current) as IntersectionObserverEntry[]).filter(
        (entry) => entry.isIntersecting
      );

      if (visibleSections.length > 0) {
        // Sort by bounding client rect top or intersection ratio
        const sorted = visibleSections.sort((a, b) => {
          return a.boundingClientRect.top - b.boundingClientRect.top;
        });
        setActiveId(sorted[0].target.id);
      }
    };

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: '-20% 0px -60% 0px', // focused in the upper-middle region of viewport
      threshold: 0,
      ...options,
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // Also watch general scroll to highlight "home" if we are right at the top
    const handleScrollAtTop = () => {
      if (window.scrollY < 50 && sectionIds.length > 0) {
        setActiveId(sectionIds[0]);
      }
    };

    window.addEventListener('scroll', handleScrollAtTop);
    handleScrollAtTop();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScrollAtTop);
    };
  }, [sectionIds, options]);

  return activeId;
}

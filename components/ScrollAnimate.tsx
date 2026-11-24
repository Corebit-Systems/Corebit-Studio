// File: C:\dev\Corebit-Studio\components\ScrollAnimate.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollAnimateProps {
  children: React.ReactNode;
}

export default function ScrollAnimate({ children }: ScrollAnimateProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -40px 0px', // triggers slightly before elements fully enter
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={isVisible ? 'section-enter' : undefined}
    >
      {children}
    </div>
  );
}

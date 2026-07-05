// File: C:\dev\Corebit-Studio\components\BentoCard.tsx
'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';

interface BentoCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  visual?: React.ReactNode;
  className?: string;
  delay?: number;
  href?: string;
}

export default function BentoCard({
  title,
  description,
  icon,
  visual,
  className = '',
  delay = 0,
  href,
}: BentoCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const CardContent = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      // ФИКС: p-8 → p-5 sm:p-8, rounded-3xl уменьшен до rounded-2xl sm:rounded-3xl
      className={`relative group rounded-2xl sm:rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-2xl p-5 sm:p-8 flex flex-col h-full overflow-hidden ${className} ${href ? 'cursor-pointer hover:border-emerald-500/50 transition-colors' : ''}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div style={{ transform: 'translateZ(30px)' }} className="flex flex-col h-full">
        {visual && (
          // ФИКС: h-48 → h-36 sm:h-48 — уменьшаем высоту визуала на мобиле
          <div className="w-full h-36 sm:h-48 mb-4 sm:mb-6 rounded-xl sm:rounded-2xl overflow-hidden relative border border-white/5">
            {visual}
          </div>
        )}

        {icon && !visual && (
          <div className="p-3 bg-white/5 rounded-xl sm:rounded-2xl w-fit border border-white/10 text-neutral-300 mb-3 sm:mb-4">
            {icon}
          </div>
        )}

        <div className="flex flex-col flex-grow gap-2">
          <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-white">{title}</h3>
          <p className="text-sm text-neutral-400 leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );

  // ФИКС: Link обёртка — добавлен min-h-0 чтобы Link не ломал flex-контейнеры
  return href ? (
    <Link href={href} className="block h-full min-h-0">
      {CardContent}
    </Link>
  ) : (
    CardContent
  );
}

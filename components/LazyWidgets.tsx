'use client';

import dynamic from 'next/dynamic';

export const AiSalesWidget = dynamic(() => import('./AiSalesWidget'), { ssr: false });
export const SpeedCheckWidget = dynamic(() => import('./SpeedCheckWidget'), { ssr: false });

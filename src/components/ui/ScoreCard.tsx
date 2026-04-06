'use client';

import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useEffect } from 'react';

interface ScoreCardProps {
  name: string;
  score: number;
  rank: number;
  isFirst: boolean;
  pointsAdded?: number;
  layoutId?: string;
}

export default function ScoreCard({
  name,
  score,
  rank,
  isFirst,
  pointsAdded,
  layoutId,
}: ScoreCardProps) {
  // Score rolling: spring-based counter that animates to the new value
  const rawScore = useMotionValue(score);
  const springScore = useSpring(rawScore, { stiffness: 75, damping: 18, mass: 0.8 });
  const displayScore = useTransform(springScore, (v) =>
    Math.round(v).toLocaleString()
  );

  useEffect(() => {
    rawScore.set(score);
  }, [score, rawScore]);

  return (
    <motion.div
      layout
      layoutId={layoutId}
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.96 }}
      transition={{
        layout: { type: 'spring', stiffness: 380, damping: 38 },
        opacity: { duration: 0.22 },
        scale: { duration: 0.22 },
      }}
      style={{ 
        backgroundColor: 'rgba(22, 27, 34, 0.85)', 
        borderColor: isFirst ? 'rgba(251, 191, 36, 0.5)' : 'rgba(255, 255, 255, 0.1)',
        borderWidth: '2px',
        color: '#fafafa'
      }}
      className={`p-10 flex items-center justify-between relative overflow-hidden rounded-[2.5rem] ${
        isFirst ? 'shimmer-gold shadow-2xl shadow-amber-400/10' : ''
      }`}
    >
      <div className="flex items-center gap-10 z-10">
        <motion.div
          layout="position"
          style={{ 
            backgroundColor: isFirst ? '#fbbf24' : 'rgba(255, 255, 255, 0.1)',
            color: isFirst ? '#0b0e14' : '#ffffff'
          }}
          className="text-4xl font-black w-20 h-20 flex items-center justify-center rounded-3xl shadow-xl"
        >
          {rank}
        </motion.div>
        <div>
          <h2 className="text-5xl font-black text-white tracking-tighter italic uppercase leading-tight">{name}</h2>
          <div className="flex items-center gap-3 mt-2">
            <div 
              style={{ backgroundColor: isFirst ? '#fbbf24' : '#f43f5e' }}
              className="h-1.5 w-12 rounded-full" 
            />
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">
              {isFirst ? "Current Leader" : "Contender Team"}
            </span>
          </div>
        </div>
      </div>

      <div className="text-right z-10">
        <div className="relative">
          <AnimatePresence>
            {pointsAdded && pointsAdded > 0 && (
              <motion.span
                key={`pts-${pointsAdded}`}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -80 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="absolute -top-12 right-0 text-4xl font-black text-emerald-400 pointer-events-none italic"
              >
                +{pointsAdded}
              </motion.span>
            )}
          </AnimatePresence>

          <motion.div
            style={{ color: isFirst ? '#fbbf24' : '#f43f5e' }}
            className="text-8xl font-black italic tracking-tighter tabular-nums leading-none"
          >
            {displayScore}
          </motion.div>
        </div>
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-3 opacity-60">TOTAL SCORE</p>
      </div>

      {/* Decorative background glow */}
      <div
        style={{ 
          backgroundColor: isFirst ? 'rgba(251, 191, 36, 0.15)' : 'rgba(244, 63, 94, 0.15)',
          filter: 'blur(80px)'
        }}
        className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full opacity-30 pointer-events-none"
      />
    </motion.div>
  );
}

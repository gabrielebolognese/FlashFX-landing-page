'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-yellow-500/[0.15]",
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate: rotate }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{ width, height }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-yellow-500/[0.15]",
            "shadow-[0_8px_32px_0_rgba(234,179,8,0.1)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

export function ElegantShapesBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-fx-accent-yellow/[0.05] via-transparent to-orange-500/[0.05] blur-3xl" />
      <ElegantShape
        delay={0.3}
        width={300}
        height={70}
        rotate={12}
        gradient="from-yellow-500/[0.15]"
        className="left-[-5%] top-[15%]"
      />
      <ElegantShape
        delay={0.5}
        width={250}
        height={60}
        rotate={-15}
        gradient="from-amber-500/[0.15]"
        className="right-[-3%] top-[65%]"
      />
      <ElegantShape
        delay={0.4}
        width={160}
        height={40}
        rotate={-8}
        gradient="from-yellow-400/[0.15]"
        className="left-[8%] bottom-[8%]"
      />
      <ElegantShape
        delay={0.6}
        width={120}
        height={35}
        rotate={20}
        gradient="from-amber-600/[0.15]"
        className="right-[18%] top-[10%]"
      />
      <ElegantShape
        delay={0.7}
        width={90}
        height={25}
        rotate={-25}
        gradient="from-yellow-300/[0.15]"
        className="left-[22%] top-[5%]"
      />
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AmbientProvider, useAmbient, useAmbientActive, loop, ease, duration } from '@/lib/motion';

/*
 * Five shapes per group. `VideoPlaceholder` renders a group seven times on the
 * homepage and `LoadTime` renders five loose shapes of its own — 40 elements,
 * each running an infinite float.
 *
 * P6 stopped those loops when off screen. I1 goes further: the float now runs
 * only while the governor grants a slot, so eight groups visible at once on a
 * tall monitor cannot all animate. The group holds the slot and the shapes
 * inside read it, which is why `ElegantShape` consumes context rather than
 * registering — 40 registrations against a cap of 6 would leave most of them
 * frozen at random.
 *
 * A shape without a grant is still placed and still visible. It just does not
 * move.
 */

export function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = 'from-yellow-500/[0.15]',
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  const active = useAmbientActive();

  return (
    <motion.div
      initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true, amount: 0 }}
      transition={{
        duration: 2.4,
        delay,
        ease: ease.entrance,
        opacity: { duration: duration.reveal },
      }}
      className={cn('absolute', className)}
    >
      <motion.div
        animate={active ? { y: [0, 15, 0] } : { y: 0 }}
        transition={
          active
            ? { duration: loop.drift, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }
            : { duration: 0 }
        }
        style={{ width, height }}
        className="relative"
      >
        <div
          className={cn(
            'absolute inset-0 rounded-full',
            'bg-gradient-to-r to-transparent',
            gradient,
            'backdrop-blur-[2px] border-2 border-yellow-500/[0.15]',
            'shadow-[0_8px_32px_0_rgba(234,179,8,0.1)]'
          )}
        />
      </motion.div>
    </motion.div>
  );
}

/**
 * Wrap loose `ElegantShape`s in this to give them a shared grant.
 *
 * `LoadTime` renders its five shapes directly rather than through
 * `ElegantShapesBackground`, and without a scope around them they would read
 * `false` from the context default and never move.
 */
export function ElegantShapeScope({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { ref, active } = useAmbient<HTMLDivElement>();

  return (
    <div ref={ref} className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      <AmbientProvider active={active}>{children}</AmbientProvider>
    </div>
  );
}

export function ElegantShapesBackground() {
  return (
    <ElegantShapeScope>
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
    </ElegantShapeScope>
  );
}

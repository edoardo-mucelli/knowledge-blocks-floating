import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Position {
  x: number;
  y: number;
}

interface FloatingObjectProps {
  children: React.ReactNode;
  size?: number;
  speed?: number;
  floatIntensity?: number;
  rotationIntensity?: number;
  opacity?: number;
  anchorX?: number;
  anchorY?: number;
  isBatchHovered?: boolean;
}

export const FloatingObject: React.FC<FloatingObjectProps> = ({ 
  children, 
  size = 100,
  speed = 1,
  floatIntensity = 10,
  rotationIntensity = 5,
  opacity = 1,
  anchorX = 0,
  anchorY = 0,
  isBatchHovered = false
}) => {
  const [offset, setOffset] = useState<Position>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  
  const timeRef = useRef(Math.random() * 100);
  const boostRef = useRef(1);
  const requestRef = useRef<number | undefined>(undefined);
  const isBatchHoveredRef = useRef(isBatchHovered);

  // Sync ref with prop
  useEffect(() => {
    isBatchHoveredRef.current = isBatchHovered;
  }, [isBatchHovered]);

  const update = () => {
    // Target boost 2.5x for clear visibility when hovered with nervous jitter
    const targetBoost = isBatchHoveredRef.current ? 2.5 : 1.0;
    // Faster ramp up (0.1), much slower decay (0.008) for "lingering" feel
    const lerpFactor = isBatchHoveredRef.current ? 0.1 : 0.008; 
    
    boostRef.current += (targetBoost - boostRef.current) * lerpFactor;
    
    timeRef.current += (0.01 * speed) * boostRef.current;

    // High frequency component that kicks in with boost
    const jitter = Math.sin(timeRef.current * 15) * (boostRef.current - 1) * 2;
    
    const dx = (Math.sin(timeRef.current) * (floatIntensity * boostRef.current)) + jitter;
    const dy = (Math.cos(timeRef.current * 0.8) * (floatIntensity * 0.7 * boostRef.current)) + jitter * 0.5;
    const dr = (Math.sin(timeRef.current * 0.5) * (rotationIntensity * boostRef.current)) + jitter;

    setOffset({ x: dx, y: dy });
    setRotation(dr);

    requestRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [speed, floatIntensity, rotationIntensity]); // Don't restart loop on isBatchHovered

  return (
    <motion.div
      className="floating-object"
      style={{
        left: `calc(50% + ${anchorX}px)`,
        top: `calc(50% + ${anchorY}px)`,
        width: size,
        height: size,
        x: '-50%',
        y: '-50%',
        translateX: offset.x,
        translateY: offset.y,
        rotate: rotation,
        opacity: opacity,
      }}
    >
      <div style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
        {children}
      </div>
    </motion.div>
  );
};

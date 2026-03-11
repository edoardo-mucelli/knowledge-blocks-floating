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
}

export const FloatingObject: React.FC<FloatingObjectProps> = ({ 
  children, 
  size = 100,
  speed = 1,
  floatIntensity = 10,
  rotationIntensity = 5,
  opacity = 1,
  anchorX = 0,
  anchorY = 0
}) => {
  const [offset, setOffset] = useState<Position>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  
  const timeRef = useRef(Math.random() * 100);
  const requestRef = useRef<number | undefined>(undefined);

  const update = () => {
    timeRef.current += 0.01 * speed;

    const dx = Math.sin(timeRef.current) * floatIntensity;
    const dy = Math.cos(timeRef.current * 0.8) * (floatIntensity * 0.7);
    const dr = Math.sin(timeRef.current * 0.5) * rotationIntensity;

    setOffset({ x: dx, y: dy });
    setRotation(dr);

    requestRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [speed, floatIntensity, rotationIntensity]);

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

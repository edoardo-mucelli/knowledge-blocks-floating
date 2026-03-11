import { useMemo } from 'react';
import { FloatingStage } from './components/FloatingStage';
import { FloatingObject } from './components/FloatingObject';
import kbIcon from './assets/svgs/KB icon.svg';

const App = () => {
  const baseSize = 120;
  
  const instances = useMemo(() => {
    const rawConfigs = [
      // 3 new: double of mid (30 * 2 = 60), 100% opacity
      ...Array(3).fill({ size: baseSize / 2, opacity: 1, float: 14 }),
      // 5 mid: 1/4 of original (30px), 60% opacity
      ...Array(5).fill({ size: baseSize / 4, opacity: 0.6, float: 9 }),
      // 5 small: 1/8 of original (15px), 20% opacity
      ...Array(5).fill({ size: baseSize / 8, opacity: 0.2, float: 6 }),
    ];

    const placed: { size: number; opacity: number; float: number; anchorX: number; anchorY: number }[] = [];
    const minPadding = 35; // Bumped padding for wider sway

    for (const config of rawConfigs) {
      let attempts = 0;
      let found = false;

      while (attempts < 800 && !found) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.sqrt(Math.random()) * 150; // Increased spread for 13 icons
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        const overlap = placed.some(other => {
          const dx = other.anchorX - x;
          const dy = other.anchorY - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const threshold = (config.size / 2) + (other.size / 2) + config.float + other.float + minPadding;
          return distance < threshold;
        });

        if (!overlap) {
          placed.push({ ...config, anchorX: x, anchorY: y });
          found = true;
        }
        attempts++;
      }
    }
    return placed;
  }, []);

  return (
    <FloatingStage>
      {instances.map((config: any, i: number) => (
        <FloatingObject 
          key={i}
          size={config.size} 
          opacity={config.opacity}
          anchorX={config.anchorX}
          anchorY={config.anchorY}
          floatIntensity={config.float}
          speed={(0.5 + Math.random() * 0.3) * 1.05} // 5% faster overall
          rotationIntensity={8 + Math.random() * 4} // Faster/wider rotation
        >
          <img 
            src={kbIcon} 
            alt="KB Icon" 
            style={{ width: '100%', height: '100%' }} 
          />
        </FloatingObject>
      ))}
    </FloatingStage>
  );
}

export default App;

import { useRef, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  intensity?: number; // 1–20, default 12
}

/**
 * Wraps any card in a 3-D perspective tilt that follows the mouse.
 * On touch/mobile it simply shows a subtle scale.
 */
export default function TiltCard({ children, className = '', intensity = 12 }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width  / 2); // -1 to 1
    const dy = (e.clientY - cy) / (rect.height / 2); // -1 to 1
    card.style.transform = `perspective(800px) rotateY(${dx * intensity}deg) rotateX(${-dy * intensity}deg) scale3d(1.03,1.03,1.03)`;
    card.style.transition = 'transform 0.05s linear';
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)';
    card.style.transition = 'transform 0.4s cubic-bezier(0.23,1,0.32,1)';
  };

  return (
    <div
      ref={cardRef}
      className={`will-change-transform ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

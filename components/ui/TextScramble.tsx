'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface TextScrambleProps {
  text: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

const CHARS = '!<>-_\\\\/[]{}—=+*^?#________';

export default function TextScramble({ text, className = '' }: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });
  const animating = useRef(false);

  useEffect(() => {
    if (inView && !animating.current) {
      animating.current = true;
      let frame = 0;
      const length = text.length;
      
      const scramble = () => {
        let output = '';
        for (let i = 0; i < length; i++) {
          if (frame >= i * 2) {
            output += text[i];
          } else {
            output += CHARS[Math.floor(Math.random() * CHARS.length)];
          }
        }
        setDisplayText(output);
        
        if (frame < length * 2) {
          frame++;
          requestAnimationFrame(scramble);
        }
      };
      
      scramble();
    }
  }, [inView, text]);

  return (
    <span ref={ref} className={className}>
      {displayText}
    </span>
  );
}

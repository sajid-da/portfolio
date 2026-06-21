import { useState, useEffect } from 'react';

export const BootSequence = ({ onComplete }: { onComplete: () => void }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    // Blinking cursor
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 400);

    const sequence = [
      { text: 'INITIALIZING SAJID.OS', delay: 200 },
      { text: 'Loading Neural Core...', delay: 600 },
      { text: 'Loading Projects...', delay: 1000 },
      { text: 'Loading Systems...', delay: 1400 },
      { text: 'BOOT COMPLETE', delay: 1800 },
    ];

    sequence.forEach(({ text, delay }) => {
      setTimeout(() => {
        setLines(prev => [...prev, text]);
      }, delay);
    });

    const completionTimer = setTimeout(() => {
      onComplete();
    }, 2200);

    return () => {
      clearInterval(cursorInterval);
      clearTimeout(completionTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] flex items-center justify-center p-6 pointer-events-none">
      <div className="w-full max-w-4xl font-mono text-sm md:text-base">
        {lines.map((line, i) => (
          <div 
            key={i} 
            className={`mb-2 ${
              line === 'INITIALIZING SAJID.OS' ? 'text-primary font-bold text-lg md:text-xl mb-4' : 
              line === 'BOOT COMPLETE' ? 'text-green-400 mt-4' : 'text-gray-400'
            }`}
          >
            {line !== 'INITIALIZING SAJID.OS' && '> '}{line}
          </div>
        ))}
        <div className={`mt-2 w-3 h-5 bg-primary inline-block ${showCursor ? 'opacity-100' : 'opacity-0'}`}></div>
      </div>
    </div>
  );
};

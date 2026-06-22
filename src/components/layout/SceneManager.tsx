import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react';

interface SceneContextType {
  currentScene: number;
  direction: number; // 1 for forward, -1 for backward
  goToScene: (index: number) => void;
  nextScene: () => void;
  prevScene: () => void;
  totalScenes: number;
}

const SceneContext = createContext<SceneContextType | null>(null);

export const useScene = () => {
  const context = useContext(SceneContext);
  if (!context) throw new Error("useScene must be used within SceneProvider");
  return context;
};

interface SceneProviderProps {
  children: ReactNode;
  totalScenes: number;
}

export const SceneProvider = ({ children, totalScenes }: SceneProviderProps) => {
  const [currentScene, setCurrentScene] = useState(0);
  const [direction, setDirection] = useState(1);
  const isTransitioning = useRef(false);

  const goToScene = (index: number) => {
    if (isTransitioning.current) return;
    if (index < 0 || index >= totalScenes) return;
    
    setDirection(index > currentScene ? 1 : -1);
    setCurrentScene(index);
    
    isTransitioning.current = true;
    setTimeout(() => {
      isTransitioning.current = false;
    }, 1200); // Debounce duration to prevent rapid scrolling through scenes
  };

  const nextScene = () => goToScene(currentScene + 1);
  const prevScene = () => goToScene(currentScene - 1);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Allow vertical scrolling inside designated content zones
      const path = e.composedPath() as HTMLElement[];
      const scrollableEl = path.find(el => el.classList && el.classList.contains('content-scroll'));
      
      if (scrollableEl) {
        const isAtTop = scrollableEl.scrollTop === 0;
        const isAtBottom = Math.abs(scrollableEl.scrollHeight - scrollableEl.scrollTop - scrollableEl.clientHeight) < 2;
        
        if (e.deltaY > 0 && !isAtBottom) return; // Allow native scroll down
        if (e.deltaY < 0 && !isAtTop) return;    // Allow native scroll up
      }

      // Intercept and change scene
      e.preventDefault();
      
      if (isTransitioning.current) return;

      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        if (e.deltaX > 30) nextScene();
        else if (e.deltaX < -30) prevScene();
      } else {
        if (e.deltaY > 30) nextScene();
        else if (e.deltaY < -30) prevScene();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [currentScene, totalScenes]);

  const touchStart = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      const path = e.composedPath() as HTMLElement[];
      const scrollableEl = path.find(el => el.classList && el.classList.contains('content-scroll'));
      
      const touchEnd = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      const deltaX = touchStart.current.x - touchEnd.x;
      const deltaY = touchStart.current.y - touchEnd.y;

      if (scrollableEl) {
        if (Math.abs(deltaY) > Math.abs(deltaX)) return;
      }

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (isTransitioning.current) return;
        if (deltaX > 0) nextScene();
        else prevScene();
        touchStart.current = touchEnd; 
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [currentScene, totalScenes]);

  return (
    <SceneContext.Provider value={{ currentScene, direction, goToScene, nextScene, prevScene, totalScenes }}>
      {children}
    </SceneContext.Provider>
  );
};

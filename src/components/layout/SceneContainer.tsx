import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useScene } from './SceneManager';

interface SceneProps {
  index: number;
  children: ReactNode;
  id?: string;
}

export const SceneContainer = ({ index, children, id }: SceneProps) => {
  const { currentScene, direction } = useScene();

  // Only render if it's the current scene
  if (currentScene !== index) return null;

  // Variants for a cinematic dissolve + slight horizontal drift
  const variants = {
    enter: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? 50 : -50,
      scale: 0.98,
      filter: 'blur(10px)',
    }),
    center: {
      zIndex: 1,
      opacity: 1,
      x: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        opacity: { duration: 0.8 },
        x: { duration: 0.8 },
        scale: { duration: 0.8 },
        filter: { duration: 0.8 },
      }
    },
    exit: (direction: number) => ({
      zIndex: 0,
      opacity: 0,
      x: direction < 0 ? 50 : -50,
      scale: 1.02,
      filter: 'blur(10px)',
      transition: {
        opacity: { duration: 0.8 },
        x: { duration: 0.8 },
        scale: { duration: 0.8 },
        filter: { duration: 0.8 },
      }
    })
  };

  return (
    <motion.div
      key={index}
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      className="absolute inset-0 w-full h-full flex flex-col items-center justify-center overflow-hidden"
      id={id}
    >
      {children}
    </motion.div>
  );
};

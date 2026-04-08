import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { Sparkles, Crosshair } from "lucide-react";
import { useTheme } from "next-themes";

export default function CustomCursor() {
  const { resolvedTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const isDark = resolvedTheme === "dark";
  
  // Theme adjusts physics:
  // Dark: Fast, snappy, hard tracking
  // Light: Soft, slow trailing sparkle
  const springConfig = isDark ? 
    { damping: 15, stiffness: 400, mass: 0.2 } : 
    { damping: 25, stiffness: 300, mass: 0.5 };  
    
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    setMounted(true);
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
      if (!isVisible) setIsVisible(true);
    };
    
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!mounted || (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches)) {
    return null;
  }

  return (
    <motion.div
      className="fixed top-0 left-0 z-[100] pointer-events-none mix-blend-difference hidden md:block"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        opacity: isVisible ? 1 : 0,
      }}
    >
      {isDark ? (
        <div className="relative flex items-center justify-center w-8 h-8 rounded-full border-2 border-primary shadow-[0_0_15px_var(--primary)] backdrop-blur-sm animate-spin-slow">
           <Crosshair className="w-5 h-5 text-secondary animate-pulse" />
        </div>
      ) : (
        <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-primary/80 blur-[2px]">
          <Sparkles className="w-5 h-5 text-white animate-pulse" />
        </div>
      )}
    </motion.div>
  );
}

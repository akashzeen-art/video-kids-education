import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const ITEMS = [
  { emoji: "📚", x: -45,  y: -35,  rotate: -45, exitX: 45,   exitY: 35,   exitR: 45   },
  { emoji: "✏️", x: 45,   y: -35,  rotate: 45,  exitX: -45,  exitY: 35,   exitR: -45  },
  { emoji: "🎒", x: -45,  y: 35,   rotate: 45,  exitX: 45,   exitY: -35,  exitR: -45  },
  { emoji: "📖", x: 45,   y: 35,   rotate: -45, exitX: -45,  exitY: -35,  exitR: 45   },
  { emoji: "✏️", x: 0,    y: -45,  rotate: 0,   exitX: 0,    exitY: 45,   exitR: 180  },
  { emoji: "📚", x: 0,    y: 45,   rotate: 0,   exitX: 0,    exitY: -45,  exitR: -180 },
  { emoji: "⭐", x: -45,  y: 0,    rotate: 0,   exitX: 45,   exitY: 0,    exitR: 360  },
  { emoji: "🌟", x: 45,   y: 0,    rotate: 0,   exitX: -45,  exitY: 0,    exitR: -360 },
  { emoji: "🎨", x: -30,  y: -45,  rotate: -30, exitX: 30,   exitY: 45,   exitR: 30   },
  { emoji: "🔢", x: 30,   y: -45,  rotate: 30,  exitX: -30,  exitY: 45,   exitR: -30  },
  { emoji: "🎵", x: -45,  y: 20,   rotate: -20, exitX: 45,   exitY: -20,  exitR: 20   },
  { emoji: "💡", x: 45,   y: 20,   rotate: 20,  exitX: -45,  exitY: -20,  exitR: -20  },
].map(item => ({
  ...item,
  x: `${50 + item.x}vw`,
  y: `${50 + item.y}vh`,
  exitX: `${50 + item.exitX}vw`,
  exitY: `${50 + item.exitY}vh`,
}));

interface Props {
  show: boolean;
  onDone: () => void;
}

export default function ThemeTransition({ show, onDone }: Props) {
  const [phase, setPhase] = useState<"in" | "cross" | "out">("in");

  useEffect(() => {
    if (!show) { setPhase("in"); return; }
    const t1 = setTimeout(() => setPhase("cross"), 400);
    const t2 = setTimeout(() => setPhase("out"), 900);
    const t3 = setTimeout(() => onDone(), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Flash overlay */}
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "cross" ? 0.6 : 0 }}
            transition={{ duration: 0.25 }}
          />

          {/* Criss-cross items */}
          {ITEMS.map((item, i) => (
            <motion.div
              key={i}
              className="absolute text-5xl sm:text-7xl select-none"
              style={{
                filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.25))",
                left: phase === "out" ? item.exitX : item.x,
                top: phase === "out" ? item.exitY : item.y,
              }}
              initial={{ left: item.x, top: item.y, rotate: item.rotate, opacity: 0, scale: 0.3 }}
              animate={
                phase === "in"
                  ? { rotate: item.rotate, opacity: 1, scale: 1 }
                  : phase === "cross"
                  ? { rotate: item.exitR * 0.5, opacity: 1, scale: 1.3,
                      left: `calc(${item.x} + (${item.exitX} - ${item.x}) * 0.4)`,
                      top: `calc(${item.y} + (${item.exitY} - ${item.y}) * 0.4)` }
                  : { rotate: item.exitR, opacity: 0, scale: 0.3, left: item.exitX, top: item.exitY }
              }
              transition={{
                duration: phase === "in" ? 0.45 : 0.5,
                delay: phase === "in" ? i * 0.04 : 0,
                ease: phase === "cross" ? "easeInOut" : "backOut",
              }}
            >
              {item.emoji}
            </motion.div>
          ))}

          {/* Center burst */}
          <motion.div
            className="absolute"
            initial={{ scale: 0, opacity: 0 }}
            animate={
              phase === "cross"
                ? { scale: [0, 1.5, 0], opacity: [0, 1, 0] }
                : { scale: 0, opacity: 0 }
            }
            transition={{ duration: 0.5 }}
          >
            <div className="text-7xl">✨</div>
          </motion.div>

          {/* Sparkle ring - full screen burst */}
          {phase === "cross" && Array.from({ length: 16 }).map((_, i) => {
            const angle = (i / 16) * 360;
            const rad = (angle * Math.PI) / 180;
            return (
              <motion.div
                key={`spark-${i}`}
                className="absolute w-4 h-4 rounded-full"
                style={{
                  backgroundColor: ["#3b82f6","#ec4899","#f97316","#10b981","#8b5cf6","#eab308","#06b6d4","#ef4444"][i % 8],
                  boxShadow: `0 0 12px ${["#3b82f6","#ec4899","#f97316","#10b981","#8b5cf6","#eab308","#06b6d4","#ef4444"][i % 8]}`,
                }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: Math.cos(rad) * (window.innerWidth * 0.45),
                  y: Math.sin(rad) * (window.innerHeight * 0.45),
                  opacity: 0,
                  scale: 0,
                }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

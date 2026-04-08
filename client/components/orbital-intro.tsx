import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ORBIT_ITEMS = [
  { emoji: "📚", radius: 110, duration: 3.5, startAngle: 0 },
  { emoji: "✏️", radius: 110, duration: 3.5, startAngle: 60 },
  { emoji: "🎒", radius: 110, duration: 3.5, startAngle: 120 },
  { emoji: "🌟", radius: 110, duration: 3.5, startAngle: 180 },
  { emoji: "🎨", radius: 110, duration: 3.5, startAngle: 240 },
  { emoji: "🔢", radius: 110, duration: 3.5, startAngle: 300 },
  { emoji: "A",  radius: 170, duration: 5,   startAngle: 30,  isText: true },
  { emoji: "B",  radius: 170, duration: 5,   startAngle: 90,  isText: true },
  { emoji: "C",  radius: 170, duration: 5,   startAngle: 150, isText: true },
  { emoji: "1",  radius: 170, duration: 5,   startAngle: 210, isText: true },
  { emoji: "2",  radius: 170, duration: 5,   startAngle: 270, isText: true },
  { emoji: "3",  radius: 170, duration: 5,   startAngle: 330, isText: true },
];

const SPARKLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: 50 + Math.cos((i / 12) * Math.PI * 2) * (60 + Math.random() * 80),
  y: 50 + Math.sin((i / 12) * Math.PI * 2) * (60 + Math.random() * 80),
  color: ["#3b82f6", "#ec4899", "#f97316", "#eab308", "#10b981"][i % 5],
  delay: i * 0.15,
}));

interface Props {
  onDone: () => void;
}

export default function OrbitalIntro({ onDone }: Props) {
  const [phase, setPhase] = useState<"orbit" | "merge" | "done">("orbit");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("merge"), 2400);
    const t2 = setTimeout(() => { setPhase("done"); onDone(); }, 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[2900] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Blurred backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          />

          <div className="relative flex items-center justify-center w-[420px] h-[420px]">

            {/* Sparkle burst */}
            {SPARKLES.map((s) => (
              <motion.div
                key={s.id}
                className="absolute w-2 h-2 rounded-full pointer-events-none"
                style={{
                  left: `${s.x}%`, top: `${s.y}%`,
                  backgroundColor: s.color,
                  boxShadow: `0 0 8px ${s.color}, 0 0 16px ${s.color}60`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={phase === "merge"
                  ? { scale: 0, opacity: 0, x: 0, y: 0 }
                  : { scale: [0, 1.5, 1], opacity: [0, 1, 0.7] }
                }
                transition={{ duration: 0.6, delay: s.delay, repeat: phase === "orbit" ? Infinity : 0, repeatDelay: 1 }}
              />
            ))}

            {/* Outer glow ring */}
            <motion.div
              className="absolute rounded-full"
              style={{ width: 360, height: 360, border: "2px solid rgba(255,255,255,0.15)", boxShadow: "0 0 30px rgba(99,102,241,0.3)" }}
              animate={phase === "merge" ? { scale: 0, opacity: 0 } : { scale: [1, 1.04, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute rounded-full"
              style={{ width: 240, height: 240, border: "1.5px solid rgba(255,255,255,0.1)" }}
              animate={phase === "merge" ? { scale: 0, opacity: 0 } : { rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />

            {/* Orbiting items */}
            {ORBIT_ITEMS.map((item, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{ width: item.radius * 2, height: item.radius * 2 }}
                animate={phase === "merge"
                  ? { scale: 0, opacity: 0, rotate: 0 }
                  : { rotate: [item.startAngle, item.startAngle + 360] }
                }
                transition={phase === "merge"
                  ? { duration: 0.5, ease: "easeIn" }
                  : { duration: item.duration, repeat: Infinity, ease: "linear" }
                }
              >
                <motion.div
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  animate={phase === "merge"
                    ? { scale: 0 }
                    : { rotate: [-(item.startAngle), -(item.startAngle + 360)], y: [0, -6, 0] }
                  }
                  transition={phase === "merge"
                    ? { duration: 0.4 }
                    : { rotate: { duration: item.duration, repeat: Infinity, ease: "linear" }, y: { duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 } }
                  }
                >
                  {item.isText ? (
                    <span
                      className="text-2xl font-black select-none"
                      style={{
                        color: ["#3b82f6", "#ec4899", "#f97316", "#eab308", "#10b981", "#8b5cf6"][i % 6],
                        textShadow: `0 0 12px ${["#3b82f6", "#ec4899", "#f97316", "#eab308", "#10b981", "#8b5cf6"][i % 6]}`,
                        WebkitTextStroke: `1px ${["#3b82f6", "#ec4899", "#f97316", "#eab308", "#10b981", "#8b5cf6"][i % 6]}`,
                      }}
                    >
                      {item.emoji}
                    </span>
                  ) : (
                    <span
                      className="text-3xl select-none"
                      style={{ filter: `drop-shadow(0 0 8px rgba(255,255,255,0.6))` }}
                    >
                      {item.emoji}
                    </span>
                  )}
                </motion.div>
              </motion.div>
            ))}

            {/* Center star burst */}
            <motion.div
              className="relative flex items-center justify-center"
              animate={phase === "merge"
                ? { scale: 2.5, opacity: 0 }
                : { scale: [1, 1.15, 1], rotate: [0, 360] }
              }
              transition={phase === "merge"
                ? { duration: 0.5, ease: "easeOut" }
                : { scale: { duration: 1.5, repeat: Infinity }, rotate: { duration: 4, repeat: Infinity, ease: "linear" } }
              }
            >
              {/* Glow behind center */}
              <div className="absolute w-24 h-24 rounded-full bg-gradient-to-r from-blue-500/40 via-pink-500/40 to-orange-500/40 blur-xl" />
              <motion.span
                className="text-6xl relative z-10 select-none"
                style={{ filter: "drop-shadow(0 0 16px rgba(255,255,255,0.9))" }}
                animate={phase === "merge" ? { scale: 0 } : { scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ⭐
              </motion.span>
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

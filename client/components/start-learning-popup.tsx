import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ITEMS = [
  { emoji: "📚", angle: 0 },
  { emoji: "✏️", angle: 60 },
  { emoji: "🎒", angle: 120 },
  { emoji: "🌟", angle: 180 },
  { emoji: "🎨", angle: 240 },
  { emoji: "🔢", angle: 300 },
];

const SPARKLES = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  x: `${10 + Math.random() * 80}%`,
  y: `${10 + Math.random() * 80}%`,
  size: Math.random() * 10 + 6,
  delay: Math.random() * 1.5,
  color: ["#60a5fa", "#f472b6", "#fb923c", "#facc15", "#34d399"][i % 5],
}));

type Step = "items" | "character" | "text";

interface Props {
  onClose: () => void;
}

export default function StartLearningPopup({ onClose }: Props) {
  const [step, setStep] = useState<Step>("items");
  const navigate = useNavigate();

  useEffect(() => {
    const t1 = setTimeout(() => setStep("character"), 2500);
    const t2 = setTimeout(() => setStep("text"), 4500);
    const t3 = setTimeout(() => { onClose(); navigate("/browse"); }, 7000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  function handleContinue() {
    onClose();
    navigate("/browse");
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[3000] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Backdrop — fades in with blur */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          onClick={onClose}
        />

        {/* Popup card — storybook / magic pop entrance */}
        <motion.div
          className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl z-10"
          style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #db2777 100%)" }}
          initial={{ scale: 0, opacity: 0, rotate: -8, y: 80 }}
          animate={[
            { scale: 0,    opacity: 0, rotate: -8,  y: 80,  transition: { duration: 0 } },
            { scale: 1.12, opacity: 1, rotate:  4,  y: -10, transition: { duration: 0.45, ease: "easeOut" } },
            { scale: 0.96, opacity: 1, rotate: -2,  y:   4, transition: { duration: 0.2,  ease: "easeInOut" } },
            { scale: 1,    opacity: 1, rotate:  0,  y:   0, transition: { duration: 0.2,  ease: "easeOut" } },
          ]}
          exit={{
            scale: 0.6,
            opacity: 0,
            rotate: 6,
            y: 60,
            transition: { duration: 0.35, ease: "easeIn" },
          }}
        >
          {/* Glow ring around popup */}
          <motion.div
            className="absolute -inset-1 rounded-3xl pointer-events-none"
            style={{ background: "linear-gradient(135deg, #facc15, #f472b6, #60a5fa, #34d399)", zIndex: -1 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0.4, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />

          {/* Burst particles on entry */}
          {[...Array(12)].map((_, i) => {
            const angle = (i / 12) * 360;
            return (
              <motion.div
                key={`burst-${i}`}
                className="absolute w-3 h-3 rounded-full pointer-events-none"
                style={{
                  top: "50%", left: "50%",
                  backgroundColor: ["#facc15","#f472b6","#60a5fa","#34d399","#fb923c"][i % 5],
                  boxShadow: `0 0 6px ${["#facc15","#f472b6","#60a5fa","#34d399","#fb923c"][i % 5]}`,
                }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: Math.cos((angle * Math.PI) / 180) * 120,
                  y: Math.sin((angle * Math.PI) / 180) * 120,
                  opacity: 0,
                  scale: 0,
                }}
                transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              />
            );
          })}
          {/* Sparkles */}
          {SPARKLES.map((s) => (
            <motion.div
              key={s.id}
              className="absolute rounded-full pointer-events-none"
              style={{ left: s.x, top: s.y, width: s.size, height: s.size, backgroundColor: s.color, boxShadow: `0 0 8px ${s.color}` }}
              animate={{ scale: [0, 1.4, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
            />
          ))}

          <div className="relative px-8 py-10 flex flex-col items-center min-h-[380px] justify-center">

            {/* ── Step 1: Orbiting school items ── */}
            <AnimatePresence>
              {step === "items" && (
                <motion.div
                  key="items"
                  className="flex flex-col items-center gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="relative w-48 h-48">
                    {/* Center glow */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-white/10"
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    {/* Orbiting items */}
                    {ITEMS.map((item, i) => (
                      <motion.div
                        key={i}
                        className="absolute text-3xl"
                        style={{ top: "50%", left: "50%", transformOrigin: "0 0" }}
                        animate={{ rotate: [item.angle, item.angle + 360] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      >
                        <motion.span
                          style={{
                            display: "block",
                            transform: `translateX(70px) translateY(-50%)`,
                          }}
                          animate={{ rotate: [0, -360] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                          {item.emoji}
                        </motion.span>
                      </motion.div>
                    ))}
                    {/* Center star */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center text-5xl"
                      animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      ⭐
                    </motion.div>
                  </div>

                  <motion.p
                    className="text-white/80 font-bold text-lg tracking-wide"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    Prêt à apprendre ? ✨
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Step 2: Character entry ── */}
            <AnimatePresence>
              {step === "character" && (
                <motion.div
                  key="character"
                  className="flex flex-col items-center gap-4"
                  initial={{ opacity: 0, y: 80, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 180, damping: 16 }}
                >
                  {/* Girl character using emoji art */}
                  <motion.div
                    className="relative"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="text-center">
                      <div className="text-8xl">👧</div>
                      <motion.div
                        className="text-5xl -mt-4"
                        animate={{ rotate: [-5, 5, -5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        📖
                      </motion.div>
                    </div>
                    {/* Glow ring */}
                    <motion.div
                      className="absolute -inset-4 rounded-full border-4 border-yellow-400/40"
                      animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </motion.div>

                  <motion.p
                    className="text-white font-black text-xl text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    Bonjour ! Je suis là pour t'aider ! 🌟
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Step 3: Text + Continue ── */}
            <AnimatePresence>
              {step === "text" && (
                <motion.div
                  key="text"
                  className="flex flex-col items-center gap-6 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Bouncing letters */}
                  <div className="flex flex-wrap justify-center gap-1">
                    {"Commençons à apprendre !".split("").map((char, i) => (
                      <motion.span
                        key={i}
                        className="text-2xl sm:text-3xl font-black text-white"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04, type: "spring", stiffness: 300 }}
                      >
                        {char === " " ? "\u00a0" : char}
                      </motion.span>
                    ))}
                  </div>

                  <motion.p
                    className="text-white/70 font-medium text-base"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    Des vidéos, jeux et quiz t'attendent ! 🎉
                  </motion.p>

                  {/* Floating emojis row */}
                  <motion.div
                    className="flex gap-4 text-3xl"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.5, type: "spring" }}
                  >
                    {["🎬", "🎮", "🏆", "📚"].map((e, i) => (
                      <motion.span
                        key={i}
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      >
                        {e}
                      </motion.span>
                    ))}
                  </motion.div>


                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Bottom French flag stripe */}
          <div className="h-2 w-full flex">
            <div className="flex-1 bg-blue-600" />
            <div className="flex-1 bg-white" />
            <div className="flex-1 bg-red-500" />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

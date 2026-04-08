import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const VIDEO_URL =
  "https://vz-2c7aef55-281.b-cdn.net/231da1ed-81a9-438d-9e98-f38acda188d1/play_480p.mp4";

const DURATION = 8000;

const PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: `${Math.random() * 100}%`,
  size: Math.random() * 10 + 4,
  delay: Math.random() * 5,
  duration: Math.random() * 2.5 + 2,
  color: ["#3b82f6", "#ec4899", "#f97316", "#eab308", "#10b981", "#8b5cf6"][i % 6],
}));

const LETTERS = ["U", "n", "i", "v", "e", "r", "s", " ", "d", "e", "s", " ", "E", "n", "f", "a", "n", "t", "s"];
const LETTER_COLORS = ["#3b82f6", "#ec4899", "#f97316", "#10b981", "#8b5cf6", "#eab308", "#3b82f6", "#ec4899", "#f97316", "#10b981", "#8b5cf6", "#eab308", "#3b82f6", "#ec4899", "#f97316", "#10b981", "#8b5cf6", "#eab308", "#3b82f6"];
const EMOJIS = ["🇫🇷", "⭐", "📚", "🎨", "🎵", "✏️", "🌟", "🎯", "🏆", "💫"];

const STARS = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  top: `${Math.random() * 70}%`,
  delay: Math.random() * 3,
  duration: Math.random() * 1 + 0.6,
  width: Math.random() * 120 + 60,
}));

export default function WelcomeOverlay() {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);
  const [glitch, setGlitch] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const glitchRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const navType = (performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming)?.type;
    if (navType === "reload") {
      sessionStorage.removeItem("eduvid_navigated");
      sessionStorage.removeItem("eduvid_video_time");
    }

    const navigated = sessionStorage.getItem("eduvid_navigated");
    if (navigated) return;

    setShow(true);
    document.body.style.overflow = "hidden";

    const step = 100 / (DURATION / 80);
    intervalRef.current = setInterval(() => setProgress(p => Math.min(p + step, 100)), 80);

    glitchRef.current = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 120);
    }, 2000);

    timerRef.current = setTimeout(() => {
      clearInterval(intervalRef.current!);
      clearInterval(glitchRef.current!);
      if (videoRef.current) {
        sessionStorage.setItem("eduvid_video_time", String(videoRef.current.currentTime));
      }
      sessionStorage.setItem("eduvid_navigated", "true");
      document.body.style.overflow = "";
      setShow(false);
    }, DURATION);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (glitchRef.current) clearInterval(glitchRef.current);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[2000] overflow-hidden flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.06 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          {/* Full-screen video */}
          <video ref={videoRef} src={VIDEO_URL} autoPlay muted playsInline className="absolute inset-0 w-full h-full object-cover" />

          {/* Sharp dark vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_35%,_rgba(0,0,0,0.75)_100%)]" />

          {/* ── Top progress bar (thicker, sharper) ── */}
          <motion.div
            className="absolute top-0 left-0 rounded-r-full"
            style={{ height: "5px", background: "linear-gradient(to right, #3b82f6, #ec4899, #f97316)", boxShadow: "0 0 12px #ec4899, 0 0 24px #3b82f680" }}
            animate={{ width: `${progress}%` }}
          />
          {/* ── Bottom progress bar ── */}
          <motion.div
            className="absolute bottom-0 right-0 rounded-l-full"
            style={{ height: "5px", background: "linear-gradient(to left, #3b82f6, #ec4899, #f97316)", boxShadow: "0 0 12px #3b82f6, 0 0 24px #ec489980" }}
            animate={{ width: `${progress}%` }}
          />

          {/* ── Left border line ── */}
          <motion.div
            className="absolute left-0 top-0"
            style={{ width: "4px", background: "linear-gradient(to bottom, #3b82f6, #ec4899, transparent)", boxShadow: "2px 0 12px #3b82f680" }}
            initial={{ height: "0%" }} animate={{ height: "100%" }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          />
          {/* ── Right border line ── */}
          <motion.div
            className="absolute right-0 bottom-0"
            style={{ width: "4px", background: "linear-gradient(to top, #3b82f6, #ec4899, transparent)", boxShadow: "-2px 0 12px #ec489980" }}
            initial={{ height: "0%" }} animate={{ height: "100%" }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          />

          {/* ── Corner brackets (bigger, sharper) ── */}
          {[
            "top-4 left-4 border-t-[3px] border-l-[3px] rounded-tl-lg",
            "top-4 right-4 border-t-[3px] border-r-[3px] rounded-tr-lg",
            "bottom-4 left-4 border-b-[3px] border-l-[3px] rounded-bl-lg",
            "bottom-4 right-4 border-b-[3px] border-r-[3px] rounded-br-lg",
          ].map((cls, i) => (
            <motion.div
              key={i}
              className={`absolute w-14 h-14 border-white ${cls}`}
              style={{ filter: "drop-shadow(0 0 6px white)" }}
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: [1, 0.6, 1], scale: 1 }}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.4, type: "spring", opacity: { duration: 2.5, repeat: Infinity, delay: 1 } }}
            />
          ))}

          {/* ── Floating particles (brighter glow) ── */}
          {PARTICLES.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: p.x, width: p.size, height: p.size,
                backgroundColor: p.color,
                boxShadow: `0 0 ${p.size * 2}px ${p.color}, 0 0 ${p.size * 4}px ${p.color}60`,
              }}
              initial={{ bottom: "-5%", opacity: 0 }}
              animate={{ bottom: "110%", opacity: [0, 1, 1, 0] }}
              transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeOut" }}
            />
          ))}

          {/* ── Floating emojis ── */}
          {EMOJIS.map((emoji, i) => (
            <motion.span
              key={i}
              className="absolute text-3xl pointer-events-none select-none"
              style={{ left: `${4 + i * 9.5}%`, filter: "drop-shadow(0 0 8px rgba(255,255,255,0.6))" }}
              initial={{ bottom: "-5%", opacity: 0, rotate: 0 }}
              animate={{ bottom: "108%", opacity: [0, 1, 1, 0], rotate: (i % 2 === 0 ? 20 : -20) }}
              transition={{ duration: 4.5 + i * 0.3, delay: i * 0.6, repeat: Infinity, ease: "easeOut" }}
            >
              {emoji}
            </motion.span>
          ))}

          {/* ── Pulse rings (sharper border) ── */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full pointer-events-none"
              style={{ border: "2px solid rgba(255,255,255,0.2)", boxShadow: "0 0 20px rgba(255,255,255,0.1)" }}
              initial={{ width: 80, height: 80, opacity: 0.8 }}
              animate={{ width: 700, height: 700, opacity: 0 }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: i * 0.9 }}
            />
          ))}

          {/* ── Orbiting dots (sharper glow) ── */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={`orbit-${i}`}
              className="absolute pointer-events-none"
              style={{ width: 220 + i * 80, height: 220 + i * 80 }}
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{ duration: 3.5 + i * 1.5, repeat: Infinity, ease: "linear" }}
            >
              <div
                className="absolute w-4 h-4 rounded-full top-0 left-1/2 -translate-x-1/2"
                style={{
                  backgroundColor: ["#3b82f6", "#ec4899", "#f97316"][i],
                  boxShadow: `0 0 16px ${["#3b82f6", "#ec4899", "#f97316"][i]}, 0 0 32px ${["#3b82f6", "#ec4899", "#f97316"][i]}80`,
                }}
              />
              <div
                className="absolute w-3 h-3 rounded-full bottom-0 left-1/2 -translate-x-1/2"
                style={{
                  backgroundColor: ["#ec4899", "#f97316", "#3b82f6"][i],
                  boxShadow: `0 0 12px ${["#ec4899", "#f97316", "#3b82f6"][i]}, 0 0 24px ${["#ec4899", "#f97316", "#3b82f6"][i]}80`,
                }}
              />
            </motion.div>
          ))}

          {/* ── Wave bar (taller, sharper) ── */}
          <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-[3px] pointer-events-none">
            {Array.from({ length: 24 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-[3px] rounded-full"
                style={{
                  backgroundColor: LETTER_COLORS[i % LETTER_COLORS.length],
                  boxShadow: `0 0 6px ${LETTER_COLORS[i % LETTER_COLORS.length]}`,
                }}
                animate={{ height: [4, 28 + Math.random() * 24, 4] }}
                transition={{ duration: 0.6 + Math.random() * 0.3, repeat: Infinity, delay: i * 0.06, ease: "easeInOut" }}
              />
            ))}
          </div>

          {/* ── Top center content ── */}
          <div className="absolute top-6 left-0 right-0 z-10 flex flex-col items-center gap-3 text-center px-6">

            {/* Logo letters — bigger, sharper glow */}
            <motion.div className="flex items-center gap-0.5 sm:gap-1 flex-wrap justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              {LETTERS.map((char, i) => (
                <motion.span
                  key={i}
                  className={`${char === " " ? "w-2 sm:w-4" : "text-4xl sm:text-6xl"} font-black`}
                  style={{
                    color: char === " " ? "transparent" : LETTER_COLORS[i],
                    textShadow: char === " " ? "none" : glitch
                      ? `4px 0 #ec4899, -4px 0 #3b82f6, 0 0 40px ${LETTER_COLORS[i]}`
                      : `0 0 20px ${LETTER_COLORS[i]}, 0 0 40px ${LETTER_COLORS[i]}80, 0 0 60px ${LETTER_COLORS[i]}40`,
                    transform: glitch ? `translateX(${i % 2 === 0 ? 4 : -4}px) skewX(${i % 2 === 0 ? 2 : -2}deg)` : "none",
                    WebkitTextStroke: char === " " ? "none" : `1px ${LETTER_COLORS[i]}`,
                  }}
                  initial={{ y: -100, opacity: 0, rotate: -25, scale: 0.5 }}
                  animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.3 + i * 0.08 }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>

            {/* Tagline — sharper */}
            <motion.p
              className="text-white text-sm sm:text-lg font-black tracking-[0.25em] uppercase"
              style={{ textShadow: "0 0 20px rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.5)" }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              Apprends le français en{" "}
              <motion.span
                className="text-orange-400"
                style={{ textShadow: "0 0 20px #f97316, 0 0 40px #f9731680" }}
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                t'amusant !
              </motion.span>
            </motion.p>

            {/* French flag — thicker, sharper */}
            <motion.div
              className="flex rounded-full overflow-hidden"
              style={{ height: "4px", boxShadow: "0 0 12px rgba(255,255,255,0.4)" }}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 220, opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.5 }}
            >
              <div className="flex-1 bg-blue-600" style={{ boxShadow: "inset 0 0 8px rgba(0,0,0,0.3)" }} />
              <div className="flex-1 bg-white" />
              <div className="flex-1 bg-red-500" style={{ boxShadow: "inset 0 0 8px rgba(0,0,0,0.3)" }} />
            </motion.div>

            {/* Loading dots — sharper */}
            <motion.div className="flex gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor: LETTER_COLORS[i % LETTER_COLORS.length],
                    boxShadow: `0 0 8px ${LETTER_COLORS[i % LETTER_COLORS.length]}, 0 0 16px ${LETTER_COLORS[i % LETTER_COLORS.length]}80`,
                  }}
                  animate={{ y: [0, -12, 0], scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.12 }}
                />
              ))}
            </motion.div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";

const VIDEO_URL =
  "https://vz-2c7aef55-281.b-cdn.net/231da1ed-81a9-438d-9e98-f38acda188d1/play_480p.mp4";

// Kid-friendly floating elements for light mode
const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const NUMBERS = ["1", "2", "3", "4", "5", "6", "7", "8"];
const EMOJIS  = ["⭐", "🌈", "📚", "✏️", "🎨", "🔢", "🎵", "🌟", "💡", "🎯", "🏆", "🦋"];

const FLOATERS = Array.from({ length: 32 }, (_, i) => {
  const all = [...LETTERS, ...NUMBERS, ...EMOJIS];
  return {
    id: i,
    content: all[i % all.length],
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 18 + 14,
    duration: Math.random() * 12 + 10,
    delay: Math.random() * 8,
    color: [
      "#3b82f6", "#ec4899", "#f97316", "#10b981",
      "#8b5cf6", "#eab308", "#06b6d4", "#ef4444",
    ][i % 8],
    isEmoji: i % 3 === 0,
  };
});

const BUBBLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  size: Math.random() * 60 + 30,
  duration: Math.random() * 8 + 6,
  delay: Math.random() * 6,
  color: [
    "rgba(59,130,246,0.12)",
    "rgba(236,72,153,0.10)",
    "rgba(249,115,22,0.10)",
    "rgba(16,185,129,0.10)",
    "rgba(139,92,246,0.10)",
  ][i % 5],
}));

export default function AnimatedBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const bgVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!bgVideoRef.current) return;
    const saved = sessionStorage.getItem("eduvid_video_time");
    if (saved) {
      bgVideoRef.current.currentTime = parseFloat(saved);
      sessionStorage.removeItem("eduvid_video_time");
    }
  }, [mounted]);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  if (isDark) {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <video ref={bgVideoRef} src={VIDEO_URL} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-[#020918]/80" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle at center, transparent 0%, #020918 80%), linear-gradient(#0d1f4a 1px, transparent 1px), linear-gradient(90deg, #0d1f4a 1px, transparent 1px)",
            backgroundSize: "100% 100%, 40px 40px, 40px 40px",
          }}
        />
        <motion.div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/25 rounded-full blur-[100px]" animate={{ x: [0, 100, 0], y: [0, 50, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} />
        <motion.div className="absolute bottom-10 right-20 w-[30rem] h-[30rem] bg-secondary/15 rounded-full blur-[120px]" animate={{ x: [0, -100, 0], y: [0, -50, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
        <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-accent/8 rounded-full blur-[150px]" animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} />
        {Array.from({ length: 35 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{ width: Math.random() * 4 + 1 + "px", height: Math.random() * 4 + 1 + "px", backgroundColor: ["#1d6fe8", "#e8186c", "#f59200"][i % 3], boxShadow: `0 0 10px ${["#1d6fe8", "#e8186c", "#f59200"][i % 3]}` }}
            initial={{ x: `${Math.random() * 100}vw`, y: `${Math.random() * 100}vh`, opacity: Math.random() * 0.5 + 0.3 }}
            animate={{ y: [null, `${-10 - Math.random() * 20}vh`], opacity: [null, 0] }}
            transition={{ duration: Math.random() * 5 + 3, repeat: Infinity, ease: "easeIn" }}
          />
        ))}
        <motion.div className="absolute w-1 h-32 bg-primary/50 blur-sm rounded-full" initial={{ top: "-10%", left: "30%", opacity: 0 }} animate={{ top: "110%", opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 1, ease: "linear" }} />
        <motion.div className="absolute w-1 h-48 bg-secondary/50 blur-sm rounded-full" initial={{ top: "-10%", left: "55%", opacity: 0 }} animate={{ top: "110%", opacity: [0, 1, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 2.5, ease: "linear" }} />
        <motion.div className="absolute w-1 h-36 bg-accent/50 blur-sm rounded-full" initial={{ top: "-10%", left: "75%", opacity: 0 }} animate={{ top: "110%", opacity: [0, 1, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: 4, ease: "linear" }} />
      </div>
    );
  }

  // ── Light Mode: Kid-friendly animated background ──
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">

      {/* Soft gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/80 to-pink-50/70" />

      {/* Soft color blobs */}
      <motion.div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-blue-200/40 blur-[80px]" animate={{ x: [0, 40, 0], y: [0, 30, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute bottom-[-10%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-pink-200/40 blur-[80px]" animate={{ x: [0, -40, 0], y: [0, -30, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute top-[30%] right-[10%] w-[30vw] h-[30vw] rounded-full bg-purple-200/30 blur-[60px]" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute top-[10%] right-[30%] w-[20vw] h-[20vw] rounded-full bg-yellow-200/30 blur-[50px]" animate={{ x: [0, 20, 0], y: [0, 20, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute bottom-[20%] left-[10%] w-[25vw] h-[25vw] rounded-full bg-green-200/30 blur-[60px]" animate={{ x: [0, 30, 0] }} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }} />

      {/* Rising bubbles */}
      {BUBBLES.map((b) => (
        <motion.div
          key={`bubble-${b.id}`}
          className="absolute rounded-full border border-white/60"
          style={{ left: `${b.x}%`, width: b.size, height: b.size, background: b.color }}
          initial={{ bottom: "-10%", opacity: 0 }}
          animate={{ bottom: "110%", opacity: [0, 0.8, 0.8, 0] }}
          transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: "easeOut" }}
        />
      ))}

      {/* Floating letters, numbers & emojis */}
      {FLOATERS.map((f) => (
        <motion.div
          key={`floater-${f.id}`}
          className="absolute select-none pointer-events-none font-black"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            fontSize: f.size,
            color: f.isEmoji ? undefined : f.color,
            opacity: 0.55,
            filter: f.isEmoji ? "none" : `drop-shadow(0 2px 4px ${f.color}40)`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() > 0.5 ? 15 : -15, 0],
            rotate: [0, Math.random() > 0.5 ? 15 : -15, 0],
            opacity: [0.4, 0.65, 0.4],
          }}
          transition={{ duration: f.duration, delay: f.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          {f.content}
        </motion.div>
      ))}

      {/* Twinkling stars */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: Math.random() * 6 + 3,
            height: Math.random() * 6 + 3,
            backgroundColor: ["#3b82f6", "#ec4899", "#f97316", "#10b981", "#8b5cf6"][i % 5],
          }}
          animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
          transition={{ duration: Math.random() * 2 + 1.5, delay: Math.random() * 5, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

    </div>
  );
}

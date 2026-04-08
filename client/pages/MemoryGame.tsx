import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/header";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Trophy, Timer, ArrowLeft } from "lucide-react";

const PAIRS = [
  { id: "chat",    emoji: "🐱", french: "Chat",    english: "Cat" },
  { id: "chien",   emoji: "🐶", french: "Chien",   english: "Dog" },
  { id: "pomme",   emoji: "🍎", french: "Pomme",   english: "Apple" },
  { id: "maison",  emoji: "🏠", french: "Maison",  english: "House" },
  { id: "livre",   emoji: "📚", french: "Livre",   english: "Book" },
  { id: "fleur",   emoji: "🌸", french: "Fleur",   english: "Flower" },
  { id: "soleil",  emoji: "☀️", french: "Soleil",  english: "Sun" },
  { id: "poisson", emoji: "🐟", french: "Poisson", english: "Fish" },
];

interface Card {
  uid: string;
  pairId: string;
  type: "emoji" | "word";
  content: string;
  matched: boolean;
}

function buildDeck(): Card[] {
  const cards: Card[] = [];
  PAIRS.forEach((p) => {
    cards.push({ uid: p.id + "-emoji", pairId: p.id, type: "emoji", content: p.emoji, matched: false });
    cards.push({ uid: p.id + "-word", pairId: p.id, type: "word", content: p.french, matched: false });
  });
  return cards.sort(() => Math.random() - 0.5);
}

export default function MemoryGame() {
  const navigate = useNavigate();
  const [deck, setDeck] = useState<Card[]>(buildDeck);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [won, setWon] = useState(false);

  useEffect(() => {
    if (!running || won) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [running, won]);

  useEffect(() => {
    if (flipped.length !== 2) return;
    const [a, b] = flipped.map((uid) => deck.find((c) => c.uid === uid)!);
    if (a.pairId === b.pairId) {
      setDeck((d) => d.map((c) => c.pairId === a.pairId ? { ...c, matched: true } : c));
      setFlipped([]);
    } else {
      const t = setTimeout(() => setFlipped([]), 900);
      return () => clearTimeout(t);
    }
  }, [flipped]);

  useEffect(() => {
    if (deck.length && deck.every((c) => c.matched)) {
      setWon(true);
      setRunning(false);
    }
  }, [deck]);

  function flip(uid: string) {
    const card = deck.find((c) => c.uid === uid)!;
    if (card.matched || flipped.includes(uid) || flipped.length === 2) return;
    if (!running) setRunning(true);
    setFlipped((f) => [...f, uid]);
    if (flipped.length === 1) setMoves((m) => m + 1);
  }

  function reset() {
    setDeck(buildDeck());
    setFlipped([]);
    setMoves(0);
    setSeconds(0);
    setRunning(false);
    setWon(false);
  }

  const isVisible = (uid: string) =>
    flipped.includes(uid) || deck.find((c) => c.uid === uid)?.matched;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/40 to-rose-50/30">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-10">
        {/* Title */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-bold text-foreground/60 hover:text-primary transition-colors mb-4 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
          <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-2">
            Memory <span className="text-primary">Match</span> 🃏
          </h1>
          <p className="text-foreground/60 font-medium">Associe chaque mot français à son emoji !</p>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-6 mb-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/10 border border-primary/20">
            <Trophy className="w-4 h-4 text-primary" />
            <span className="font-bold text-foreground">{moves} coups</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-secondary/10 border border-secondary/20">
            <Timer className="w-4 h-4 text-secondary" />
            <span className="font-bold text-foreground">{seconds}s</span>
          </div>
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-accent/10 border border-accent/20 hover:bg-accent/20 transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-accent" />
            <span className="font-bold text-foreground">Réinitialiser</span>
          </button>
        </div>

        {/* Win Banner */}
        <AnimatePresence>
          {won && (
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-6 p-5 rounded-3xl bg-gradient-to-r from-primary to-secondary text-white text-center shadow-xl"
            >
              <p className="text-2xl font-black">🎉 Bravo ! Tu as gagné en {moves} coups et {seconds}s !</p>
              <button onClick={reset} className="mt-3 px-6 py-2 rounded-full bg-white text-primary font-bold hover:scale-105 transition-transform">
                Rejouer
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid */}
        <div className="grid grid-cols-4 gap-3">
          {deck.map((card) => {
            const visible = isVisible(card.uid);
            return (
              <motion.button
                key={card.uid}
                onClick={() => flip(card.uid)}
                whileHover={!visible && !card.matched ? { scale: 1.05 } : {}}
                whileTap={!visible && !card.matched ? { scale: 0.95 } : {}}
                className={`aspect-square rounded-2xl text-2xl font-black flex items-center justify-center border-2 transition-all duration-300 shadow-md
                  ${card.matched
                    ? "bg-green-500/20 border-green-400 text-green-400 scale-95"
                    : visible
                    ? card.type === "emoji"
                      ? "bg-primary/20 border-primary text-3xl text-foreground"
                      : "bg-secondary/20 border-secondary text-base text-foreground"
                    : "bg-primary text-white cursor-pointer hover:shadow-lg"
                  }`}
              >
                {visible ? card.content : "?"}
              </motion.button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-8 p-4 rounded-2xl bg-muted border border-primary/10">
          <p className="text-center text-sm font-bold text-foreground/60 mb-3">Mots français à associer</p>
          <div className="flex flex-wrap justify-center gap-3">
            {PAIRS.map((p) => (
              <span key={p.id} className="px-3 py-1 rounded-full bg-primary/10 text-sm font-bold text-primary">
                {p.emoji} {p.french} = {p.english}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

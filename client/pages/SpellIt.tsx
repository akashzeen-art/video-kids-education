import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/header";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Trophy, CheckCircle, XCircle, ArrowLeft } from "lucide-react";

const WORDS = [
  { french: "chat",    english: "Cat",    emoji: "🐱" },
  { french: "chien",   english: "Dog",    emoji: "🐶" },
  { french: "pomme",   english: "Apple",  emoji: "🍎" },
  { french: "soleil",  english: "Sun",    emoji: "☀️" },
  { french: "livre",   english: "Book",   emoji: "📚" },
  { french: "fleur",   english: "Flower", emoji: "🌸" },
  { french: "maison",  english: "House",  emoji: "🏠" },
  { french: "lapin",   english: "Rabbit", emoji: "🐰" },
  { french: "rouge",   english: "Red",    emoji: "🔴" },
  { french: "bleu",    english: "Blue",   emoji: "🔵" },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function SpellIt() {
  const navigate = useNavigate();
  const [questions] = useState(() => shuffle(WORDS).slice(0, 8));
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const q = questions[current];

  useEffect(() => {
    setInput("");
    setStatus("idle");
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [current]);

  function check() {
    if (!input.trim() || status !== "idle") return;
    const correct = input.trim().toLowerCase() === q.french.toLowerCase();
    setStatus(correct ? "correct" : "wrong");
    if (correct) setScore((s) => s + 1);
    else setShake(true);
    setTimeout(() => {
      setShake(false);
      if (current + 1 >= questions.length) setFinished(true);
      else setCurrent((c) => c + 1);
    }, 1100);
  }

  function restart() {
    setCurrent(0);
    setScore(0);
    setFinished(false);
  }

  const grade = score >= 7 ? "⭐ Excellent !" : score >= 5 ? "😊 Très bien !" : "💪 Continue à pratiquer !";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/40 to-rose-50/30">
      <Header />
      <main className="max-w-lg mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-bold text-foreground/60 hover:text-primary transition-colors mb-4 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
          <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-2">
            Épelle <span className="text-secondary">le mot !</span> ✏️
          </h1>
          <p className="text-foreground/60 font-medium">Regarde l’emoji — écris le mot français !</p>
        </div>

        <AnimatePresence mode="wait">
          {finished ? (
            <motion.div
              key="result"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center p-8 rounded-3xl bg-card border-2 border-secondary/20 shadow-xl"
            >
              <div className="text-7xl mb-4">{score >= 6 ? "🏆" : "📚"}</div>
              <h2 className="text-3xl font-black text-foreground mb-2">{grade}</h2>
              <p className="text-xl font-bold text-foreground/70 mb-6">
                Tu as réussi <span className="text-secondary">{score}</span> / {questions.length} correct !
              </p>
              <button
                onClick={restart}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-secondary to-primary text-white font-bold hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
              >
                <RefreshCw className="w-4 h-4" /> Rejouer
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={current}
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -60, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Progress */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-foreground/60">Mot {current + 1} / {questions.length}</span>
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-secondary" />
                  <span className="font-bold text-foreground">{score}</span>
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full mb-6 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-secondary to-primary rounded-full"
                  animate={{ width: `${(current / questions.length) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              {/* Emoji card */}
              <div className="text-center p-8 rounded-3xl bg-card border-2 border-secondary/20 shadow-lg mb-6">
                <div className="text-8xl mb-4">{q.emoji}</div>
                <p className="text-sm font-bold text-foreground/50">
                  C'est un(e) <span className="text-foreground font-black">"{q.english}"</span>
                </p>
                <p className="text-xs text-foreground/40 mt-1">Comment dit-on en français ?</p>
              </div>

              {/* Hint: first letter */}
              <p className="text-center text-xs font-bold text-foreground/40 mb-3">
                Indice : commence par <span className="text-secondary font-black uppercase">{q.french[0]}</span> · {q.french.length} lettres
              </p>

              {/* Input */}
              <motion.div
                animate={shake ? { x: [-8, 8, -6, 6, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="relative mb-4"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => status === "idle" && setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && check()}
                  placeholder="Écris en français..."
                  className={`w-full text-center text-xl font-black py-4 px-6 rounded-2xl border-2 outline-none transition-all
                    ${status === "correct" ? "border-green-400 bg-green-500/20 text-green-400" : ""}
                    ${status === "wrong" ? "border-red-400 bg-red-500/20 text-red-400" : ""}
                    ${status === "idle" ? "border-secondary/30 bg-card focus:border-secondary text-foreground" : ""}
                  `}
                />
                {status === "correct" && <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-green-500" />}
                {status === "wrong" && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <XCircle className="w-6 h-6 text-red-400" />
                  </div>
                )}
              </motion.div>

              {status === "wrong" && (
                <p className="text-center text-sm font-bold text-red-500 mb-3">
                  La réponse était <span className="uppercase">{q.french}</span> 😊
                </p>
              )}

              <button
                onClick={check}
                disabled={!input.trim() || status !== "idle"}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-secondary to-primary text-white font-bold text-lg hover:scale-105 transition-transform disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Vérifier ✓
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

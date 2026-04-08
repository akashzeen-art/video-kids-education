import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/header";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Trophy, CheckCircle, XCircle, ArrowLeft } from "lucide-react";

const WORDS = [
  { french: "CHAT",    english: "Cat",    emoji: "🐱" },
  { french: "CHIEN",   english: "Dog",    emoji: "🐶" },
  { french: "POMME",   english: "Apple",  emoji: "🍎" },
  { french: "SOLEIL",  english: "Sun",    emoji: "☀️" },
  { french: "LIVRE",   english: "Book",   emoji: "📚" },
  { french: "FLEUR",   english: "Flower", emoji: "🌸" },
  { french: "MAISON",  english: "House",  emoji: "🏠" },
  { french: "ROUGE",   english: "Red",    emoji: "🔴" },
  { french: "BLEU",    english: "Blue",   emoji: "🔵" },
  { french: "LAPIN",   english: "Rabbit", emoji: "🐰" },
];

function scramble(word: string): string[] {
  const arr = word.split("");
  do { arr.sort(() => Math.random() - 0.5); } while (arr.join("") === word);
  return arr;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function WordScramble() {
  const navigate = useNavigate();
  const [questions] = useState(() => shuffle(WORDS).slice(0, 8));
  const [current, setCurrent] = useState(0);
  const [letters, setLetters] = useState<string[]>([]);
  const [picked, setPicked] = useState<{ letter: string; idx: number }[]>([]);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[current];

  useEffect(() => {
    setLetters(scramble(q.french));
    setPicked([]);
    setStatus("idle");
  }, [current]);

  function pickLetter(letter: string, idx: number) {
    if (status !== "idle") return;
    if (picked.find((p) => p.idx === idx)) return;
    const next = [...picked, { letter, idx }];
    setPicked(next);
    if (next.length === q.french.length) {
      const attempt = next.map((p) => p.letter).join("");
      if (attempt === q.french) {
        setStatus("correct");
        setScore((s) => s + 1);
      } else {
        setStatus("wrong");
      }
      setTimeout(() => {
        if (current + 1 >= questions.length) setFinished(true);
        else setCurrent((c) => c + 1);
      }, 1000);
    }
  }

  function removeLast() {
    if (status !== "idle" || picked.length === 0) return;
    setPicked((p) => p.slice(0, -1));
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
            Mots <span className="text-accent">Mêlés</span> 🔀
          </h1>
          <p className="text-foreground/60 font-medium">Appuie sur les lettres dans le bon ordre !</p>
        </div>

        <AnimatePresence mode="wait">
          {finished ? (
            <motion.div
              key="result"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center p-8 rounded-3xl bg-card border-2 border-accent/20 shadow-xl"
            >
              <div className="text-7xl mb-4">{score >= 6 ? "🏆" : "📚"}</div>
              <h2 className="text-3xl font-black text-foreground mb-2">{grade}</h2>
              <p className="text-xl font-bold text-foreground/70 mb-6">
                Tu as réussi <span className="text-accent">{score}</span> / {questions.length} correct !
              </p>
              <button
                onClick={restart}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-accent to-primary text-white font-bold hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
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
                  <Trophy className="w-4 h-4 text-accent" />
                  <span className="font-bold text-foreground">{score}</span>
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full mb-6 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-accent to-primary rounded-full"
                  animate={{ width: `${(current / questions.length) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              {/* Emoji + hint */}
              <div className="text-center p-6 rounded-3xl bg-card border-2 border-accent/20 shadow-lg mb-6">
                <div className="text-7xl mb-3">{q.emoji}</div>
                <p className="text-sm font-bold text-foreground/50">
                  Cela signifie <span className="text-foreground font-black">"{q.english}"</span> en anglais
                </p>
                <p className="text-xs text-foreground/40 mt-1">Épelle le mot français !</p>
              </div>

              {/* Answer slots */}
              <div className="flex justify-center gap-2 mb-6">
                {Array.from({ length: q.french.length }).map((_, i) => {
                  const p = picked[i];
                  return (
                    <div
                      key={i}
                      className={`w-11 h-11 rounded-xl border-2 flex items-center justify-center font-black text-lg transition-all
                        ${status === "correct" ? "bg-green-100 border-green-400 text-green-700" : ""}
                        ${status === "wrong" ? "bg-red-100 border-red-400 text-red-600" : ""}
                        ${status === "idle" ? (p ? "bg-primary/10 border-primary text-primary" : "bg-muted border-muted-foreground/20 text-transparent") : ""}
                      `}
                    >
                      {p?.letter ?? ""}
                    </div>
                  );
                })}
                {status === "correct" && <CheckCircle className="w-6 h-6 text-green-500 self-center ml-1" />}
                {status === "wrong" && <XCircle className="w-6 h-6 text-red-400 self-center ml-1" />}
              </div>

              {/* Scrambled letters */}
              <div className="flex flex-wrap justify-center gap-3 mb-4">
                {letters.map((letter, idx) => {
                  const used = !!picked.find((p) => p.idx === idx);
                  return (
                    <motion.button
                      key={idx}
                      onClick={() => pickLetter(letter, idx)}
                      whileHover={!used ? { scale: 1.1 } : {}}
                      whileTap={!used ? { scale: 0.9 } : {}}
                      disabled={used || status !== "idle"}
                      className={`w-12 h-12 rounded-2xl font-black text-xl border-2 shadow transition-all
                        ${used ? "bg-muted border-muted text-muted-foreground opacity-30" : "bg-card border-accent/40 text-foreground hover:border-accent hover:bg-accent/10 cursor-pointer"}
                      `}
                    >
                      {letter}
                    </motion.button>
                  );
                })}
              </div>

              {/* Undo */}
              <div className="text-center">
                <button
                  onClick={removeLast}
                  className="text-sm font-bold text-foreground/50 hover:text-foreground transition-colors px-4 py-2 rounded-xl hover:bg-muted"
                >
                  ← Annuler
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

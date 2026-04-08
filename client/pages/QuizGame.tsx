import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/header";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Star, CheckCircle, XCircle, ArrowLeft } from "lucide-react";

const QUESTIONS = [
  { question: "Que signifie 'Bonjour' ?",    options: ["Au revoir","Bonjour","Merci","S'il vous plaît"], answer: "Bonjour" },
  { question: "Que signifie 'Chat' ?",        options: ["Chien","Oiseau","Chat","Poisson"],            answer: "Chat" },
  { question: "Que signifie 'Rouge' ?",       options: ["Bleu","Vert","Jaune","Rouge"],                answer: "Rouge" },
  { question: "Que signifie 'Merci' ?",       options: ["Désolé","S'il vous plaît","Merci","Bienvenue"],  answer: "Merci" },
  { question: "Que signifie 'Un' ?",          options: ["Deux","Trois","Un","Quatre"],                  answer: "Un" },
  { question: "Que signifie 'Pomme' ?",       options: ["Orange","Banane","Raisin","Pomme"],            answer: "Pomme" },
  { question: "Que signifie 'Maison' ?",      options: ["École","Maison","Jardin","Parc"],              answer: "Maison" },
  { question: "Que signifie 'Lundi' ?",       options: ["Mardi","Mercredi","Lundi","Vendredi"],         answer: "Lundi" },
  { question: "Que signifie 'Bleu' ?",        options: ["Vert","Rouge","Jaune","Bleu"],                 answer: "Bleu" },
  { question: "Que signifie 'Au revoir' ?",   options: ["Bonjour","Bonne nuit","Au revoir","Oui"],      answer: "Au revoir" },
  { question: "Que signifie 'Chien' ?",       options: ["Chat","Oiseau","Cheval","Chien"],              answer: "Chien" },
  { question: "Que signifie 'École' ?",       options: ["Bibliothèque","Hôpital","École","Parc"],         answer: "École" },
  { question: "Que signifie 'Soleil' ?",      options: ["Lune","Étoile","Nuage","Soleil"],              answer: "Soleil" },
  { question: "Que signifie 'Livre' ?",       options: ["Stylo","Livre","Table","Chaise"],              answer: "Livre" },
  { question: "Que signifie 'Cinq' ?",        options: ["Six","Trois","Cinq","Huit"],                   answer: "Cinq" },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function QuizGame() {
  const navigate = useNavigate();
  const [questions] = useState(() => shuffle(QUESTIONS).slice(0, 10));
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [key, setKey] = useState(0);

  const q = questions[current];

  function pick(option: string) {
    if (selected) return;
    setSelected(option);
    if (option === q.answer) setScore((s) => s + 1);
    setTimeout(() => {
      if (current + 1 >= questions.length) {
        setFinished(true);
      } else {
        setCurrent((c) => c + 1);
        setSelected(null);
      }
    }, 1000);
  }

  function restart() {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setKey((k) => k + 1);
  }

  const grade = score >= 9 ? "⭐ Excellent !" : score >= 7 ? "😊 Très bien !" : score >= 5 ? "👍 Bon effort !" : "💪 Continue à pratiquer !";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/40 to-rose-50/30">
      <Header />
      <main className="max-w-xl mx-auto px-4 py-10">
        {/* Title */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-bold text-foreground/60 hover:text-primary transition-colors mb-4 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
          <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-2">
            Quiz <span className="text-secondary">Français</span>
          </h1>
          <p className="text-foreground/60 font-medium">Teste ton vocabulaire français !</p>
        </div>

        <AnimatePresence mode="wait">
          {finished ? (
            <motion.div
              key="result"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center p-8 rounded-3xl bg-card border-2 border-primary/20 shadow-xl"
            >
              <div className="text-7xl mb-4">{score >= 7 ? "🏆" : score >= 5 ? "🎉" : "📚"}</div>
              <h2 className="text-3xl font-black text-foreground mb-2">{grade}</h2>
              <p className="text-xl font-bold text-foreground/70 mb-6">
                Tu as obtenu <span className="text-primary">{score}</span> / {questions.length}
              </p>
              <div className="flex justify-center gap-2 mb-6">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${i < score ? "bg-green-500" : "bg-red-300"}`}
                  />
                ))}
              </div>
              <button
                onClick={restart}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
              >
                <RefreshCw className="w-4 h-4" /> Rejouer
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={key + "-" + current}
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -60, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Progress */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-foreground/60">Question {current + 1} / {questions.length}</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-accent fill-accent" />
                  <span className="font-bold text-foreground">{score}</span>
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full mb-6 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                  animate={{ width: `${((current) / questions.length) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              {/* Question */}
              <div className="p-6 rounded-3xl bg-card border-2 border-primary/20 shadow-lg mb-6">
                <p className="text-xl font-black text-foreground text-center">{q.question}</p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-3">
                {q.options.map((opt) => {
                  const isCorrect = opt === q.answer;
                  const isSelected = opt === selected;
                  let style = "bg-card border-2 border-primary/20 text-foreground hover:border-primary hover:bg-primary/5";
                  if (selected) {
                    if (isCorrect) style = "bg-green-500/20 border-green-500 text-green-400";
                    else if (isSelected) style = "bg-red-500/20 border-red-400 text-red-400";
                    else style = "bg-card border-primary/10 text-foreground/40";
                  }
                  return (
                    <motion.button
                      key={opt}
                      onClick={() => pick(opt)}
                      whileHover={!selected ? { scale: 1.03 } : {}}
                      whileTap={!selected ? { scale: 0.97 } : {}}
                      className={`p-4 rounded-2xl font-bold text-base transition-all duration-200 shadow-sm flex items-center justify-between gap-2 ${style}`}
                    >
                      <span>{opt}</span>
                      {selected && isCorrect && <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />}
                      {selected && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

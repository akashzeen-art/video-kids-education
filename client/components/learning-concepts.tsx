import { Link } from "react-router-dom";
import { Play } from "lucide-react";

const FEATURED = [
  {
    thumbnail: "/thumnails/greetings-french.jpg",
    title: "Les salutations en français",
    tag: "Vocabulaire",
    duration: "7 min",
    color: "from-primary/20 to-blue-100/40",
    border: "border-primary/30 hover:border-primary/60",
    tagColor: "bg-primary/10 text-primary",
    href: "/browse",
  },
  {
    thumbnail: "/thumnails/numbers-french.jpg",
    title: "Les chiffres 1–10 en français",
    tag: "Vocabulaire",
    duration: "6 min",
    color: "from-secondary/20 to-pink-100/40",
    border: "border-secondary/30 hover:border-secondary/60",
    tagColor: "bg-secondary/10 text-secondary",
    href: "/browse",
  },
  {
    thumbnail: "/thumnails/colours-french.jpg",
    title: "Les couleurs en français",
    tag: "Vocabulaire",
    duration: "7 min",
    color: "from-accent/20 to-orange-100/40",
    border: "border-accent/30 hover:border-accent/60",
    tagColor: "bg-accent/10 text-accent",
    href: "/browse",
  },
  {
    thumbnail: "/thumnails/lou-ep1.jpg",
    title: "Lou ! Épisode 1 — Dessin animé",
    tag: "Dessins animés",
    duration: "11 min",
    color: "from-green-100/40 to-emerald-100/30",
    border: "border-green-400/30 hover:border-green-500/60",
    tagColor: "bg-green-100 text-green-700",
    href: "/browse",
  },
  {
    thumbnail: "/thumnails/memory-game.jpg",
    title: "Jeu de Mémoire",
    tag: "Jeu",
    duration: "Jouer maintenant",
    color: "from-secondary/20 to-rose-100/40",
    border: "border-secondary/30 hover:border-secondary/60",
    tagColor: "bg-secondary/10 text-secondary",
    href: "/memory-game",
  },
  {
    thumbnail: "/thumnails/french-family-song.jpg",
    title: "Chanson de la famille française",
    tag: "Chansons",
    duration: "4 min",
    color: "from-purple-100/40 to-pink-100/30",
    border: "border-purple-300/40 hover:border-purple-400/60",
    tagColor: "bg-purple-100 text-purple-700",
    href: "/browse",
  },
];

export default function LearningConcepts() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-4 animate-slide-in-left">
            Vois l’Apprentissage <span className="text-primary animate-bounce-rotate">Prendre Vie</span>
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto font-medium animate-slide-in-right">
            Vidéos réelles, jeux et chansons — tout ce dont ton enfant a besoin pour commencer à parler français aujourd’hui !
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURED.map((item, idx) => (
            <Link
              key={idx}
              to={item.href}
              className={`group rounded-3xl bg-gradient-to-br ${item.color} border-4 ${item.border} hover:scale-105 transition-all shadow-md hover:shadow-xl overflow-hidden animate-scale-in flex flex-col`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Thumbnail */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/45 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 text-primary fill-primary ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/70 text-white text-xs font-bold">
                  {item.duration}
                </span>
              </div>

              {/* Info */}
              <div className="p-5 flex flex-col gap-2 flex-1">
                <span className={`text-xs font-bold px-3 py-1 rounded-full w-fit ${item.tagColor}`}>
                  {item.tag}
                </span>
                <h3 className="text-base font-black text-foreground group-hover:text-primary transition-colors leading-snug">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-primary/20 to-secondary/20 border-4 border-primary/40 text-center animate-fade-in">
          <h3 className="text-2xl font-black text-foreground mb-2">Prêt à explorer ? 🚀</h3>
          <p className="text-foreground/60 font-medium mb-6">
            Plonge dans les vidéos, jeux et quiz — et commence à parler français aujourd’hui !
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/memory-game" className="px-7 py-3 rounded-2xl bg-white border-2 border-secondary text-secondary font-bold hover:bg-secondary/5 hover:scale-105 transition-all shadow">
              Mémoire 🃏
            </Link>
            <Link to="/quiz" className="px-7 py-3 rounded-2xl bg-white border-2 border-accent text-accent font-bold hover:bg-accent/5 hover:scale-105 transition-all shadow">
              Quiz ✏️
            </Link>
            <Link to="/word-scramble" className="px-7 py-3 rounded-2xl bg-white border-2 border-primary text-primary font-bold hover:bg-primary/5 hover:scale-105 transition-all shadow">
              Mots Mêlés 🔀
            </Link>
            <Link to="/spell-it" className="px-7 py-3 rounded-2xl bg-white border-2 border-green-500 text-green-600 font-bold hover:bg-green-50 hover:scale-105 transition-all shadow">
              Épelle-le ! 💬
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

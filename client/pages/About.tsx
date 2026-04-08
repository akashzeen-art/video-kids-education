import Header from "@/components/header";
import AnimatedBackground from "@/components/animated-background";
import { motion } from "framer-motion";
import { Heart, Sparkles, Play, Gamepad2, Trophy, BookOpen, Star, Users, Video } from "lucide-react";

const STEPS = [
  { icon: Play,     step: "01", title: "Regarde des Vidéos",  desc: "Commence par des vidéos françaises colorées — salutations, chiffres, couleurs, chansons, dessins animés et plus encore.", color: "from-primary to-blue-400",    border: "border-primary/30" },
  { icon: Gamepad2, step: "02", title: "Joue aux Jeux",       desc: "Renforce ce que tu as appris avec Mémoire, Mots Mêlés et Épelle-le ! — des jeux interactifs qui font retenir le vocabulaire.", color: "from-secondary to-rose-400", border: "border-secondary/30" },
  { icon: Trophy,   step: "03", title: "Fais le Quiz",        desc: "Teste tes connaissances en français avec 10 questions aléatoires. Suis ton score et vois tes progrès !", color: "from-accent to-orange-400",   border: "border-accent/30" },
];

const STATS = [
  { icon: Video,    value: "31+",  label: "Vidéos françaises", color: "text-primary" },
  { icon: Users,    value: "50K+", label: "Élèves heureux",    color: "text-secondary" },
  { icon: Gamepad2, value: "4",    label: "Jeux amusants",     color: "text-accent" },
  { icon: Star,     value: "100%", label: "Gratuit pour toujours", color: "text-green-500" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50/60 to-pink-50/50 relative overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10">
        <Header />

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">

          {/* Hero */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-primary">À propos d'Univers des Enfants</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-foreground mb-4 leading-tight">
              Le français, <span className="text-primary">amusant</span> pour chaque enfant
            </h1>
            <p className="text-lg text-foreground/60 font-medium max-w-2xl mx-auto">
              Nous croyons que chaque enfant mérite d'apprendre une nouvelle langue comme si c'était un jeu — pas des devoirs.
            </p>
          </motion.div>

          {/* Our Mission */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-secondary to-rose-400 flex items-center justify-center shadow">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-3xl font-black text-foreground">Notre Mission</h2>
                </div>
                <div className="space-y-4 text-foreground/70 font-medium leading-relaxed">
                  <p>
                    Univers des Enfants a été créé avec un seul objectif — offrir aux enfants une façon joyeuse et sans pression de découvrir la langue française.
                  </p>
                  <p>
                    L'apprentissage traditionnel des langues peut sembler ennuyeux et stressant pour les jeunes apprenants. Nous avons voulu changer cela en combinant ce que les enfants aiment déjà : dessins animés, chansons, jeux et visuels colorés.
                  </p>
                  <p>
                    Chaque vidéo, jeu et quiz sur Univers des Enfants est soigneusement choisi pour être adapté à l'âge, engageant et vraiment éducatif — pour que les parents soient rassurés et les enfants s'amusent.
                  </p>
                  <p className="font-bold text-foreground">
                    Et le meilleur ? C'est 100% gratuit. Sans inscription, sans abonnement, sans barrières.
                  </p>
                </div>
              </div>

              {/* Mission visual */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { emoji: "🎬", label: "Vidéos Amusantes",   bg: "bg-primary/10 border-primary/20" },
                  { emoji: "🎮", label: "Jeux Interactifs",   bg: "bg-secondary/10 border-secondary/20" },
                  { emoji: "🇫🇷", label: "Vrai Français",     bg: "bg-accent/10 border-accent/20" },
                  { emoji: "❤️", label: "Fait avec Amour",   bg: "bg-green-100/60 border-green-300/30" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className={`p-6 rounded-3xl border-2 ${item.bg} text-center`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-4xl mb-2">{item.emoji}</div>
                    <p className="text-sm font-black text-foreground">{item.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Stats */}
          <motion.section
            className="grid grid-cols-2 sm:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {STATS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={i}
                  className="glass-card rounded-3xl p-6 text-center border border-primary/10"
                  whileHover={{ scale: 1.05 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${s.color}`} />
                  <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-xs font-bold text-foreground/60 mt-1">{s.label}</p>
                </motion.div>
              );
            })}
          </motion.section>

          {/* How It Works */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <div className="flex items-center gap-3 justify-center mb-4">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-3xl font-black text-foreground">Comment ça marche</h2>
              </div>
              <p className="text-foreground/60 font-medium max-w-xl mx-auto">
                Un parcours d'apprentissage en 3 étapes pour emmener les enfants de zéro à un niveau de français confiant.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-8 relative">
              {/* Connector line */}
              <div className="hidden sm:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent opacity-30" />

              {STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={i}
                    className={`glass-card rounded-3xl p-8 border-2 ${step.border} text-center relative`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15, duration: 0.5 }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <span className="absolute top-4 right-4 text-xs font-black text-foreground/20">{step.step}</span>
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-5 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-black text-foreground mb-3">{step.title}</h3>
                    <p className="text-sm text-foreground/60 font-medium leading-relaxed">{step.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* CTA */}
          <motion.div
            className="text-center p-10 rounded-3xl bg-gradient-to-r from-primary/20 to-secondary/20 border-2 border-primary/20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-black text-foreground mb-3">Prêt à commencer ? 🚀</h3>
            <p className="text-foreground/60 font-medium mb-6">Lance-toi — c'est gratuit, amusant et ton premier mot en français est à un clic !</p>
            <a
              href="/browse"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold hover:scale-105 transition-transform shadow-lg"
            >
              <Sparkles className="w-5 h-5" /> Commencer
            </a>
          </motion.div>

        </main>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { Play, Star, Users, Zap, Sparkles, Heart, BookOpen, X } from "lucide-react";
import Header from "@/components/header";
import AnimatedBackground from "@/components/animated-background";
import FloatingMascots from "@/components/floating-mascots";
import LearningConcepts from "@/components/learning-concepts";
import AchievementBadges from "@/components/achievement-badges";
import Hero3D from "@/components/hero-3d";
import Marquee from "@/components/marquee";
import CustomCursor from "@/components/custom-cursor";
import WelcomeOverlay from "@/components/welcome-overlay";
import StartLearningPopup from "@/components/start-learning-popup";
import OrbitalIntro from "@/components/orbital-intro";
import { useState, useEffect } from "react";
import { videos, categories, type Video } from "@/data/videos";
import { motion, AnimatePresence } from "framer-motion";

const PRELOADER_KEY = "eduvid_visited";

const VideoModal = ({ video, onClose }: { video: Video; onClose: () => void }) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl bg-black"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 flex items-center justify-center hover:bg-black transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <video
            src={video.videoUrl}
            controls
            autoPlay
            className="w-full aspect-video"
            controlsList="nodownload"
          />
          <div className="p-4 bg-background">
            <h3 className="font-bold text-foreground text-lg">{video.title}</h3>
            <div className="flex items-center gap-3 mt-1 text-sm text-foreground/60">
              <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-accent text-accent" />{video.rating}</span>
              <span className="flex items-center gap-1"><Users className="w-3 h-3" />{(video.students / 1000).toFixed(1)}k élèves</span>
              <span>{video.duration}</span>
              <span className="px-2 py-0.5 rounded-full bg-secondary/20 text-secondary font-semibold">{video.level === "Beginner" ? "Débutant" : video.level === "Intermediate" ? "Intermédiaire" : "Avancé"}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const VideoCard = ({ video, delay, onClick }: { video: Video; delay: number; onClick: () => void }) => (
  <div
    className="group cursor-pointer h-full animate-scale-in"
    style={{ animationDelay: `${delay * 50}ms` }}
    onClick={onClick}
  >
    <div className="relative overflow-hidden rounded-3xl glass-card h-56 mb-4 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-secondary/20 group-hover:border-primary/40 group-hover:scale-105">
      <img
        src={video.thumbnail}
        alt={video.title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform animate-bounce">
          <Play className="w-8 h-8 text-white fill-white ml-1" />
        </div>
      </div>
      <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold animate-wiggle-continuous">
        {video.duration}
      </div>
    </div>
    <div>
      <h3 className="font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors text-sm">
        {video.title}
      </h3>
      <p className="text-xs text-foreground/50 mb-3 line-clamp-1">{video.category}</p>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-accent text-accent animate-bounce" style={{ animationDelay: '0.2s' }} />
          <span className="font-bold text-foreground">{video.rating}</span>
        </div>
        <span className="text-xs text-foreground/60 flex items-center gap-1">
          <Users className="w-3 h-3" />
          {(video.students / 1000).toFixed(1)}k
        </span>
      </div>
      <div className="mt-2 px-2 py-1 rounded-full bg-secondary/20 w-fit">
        <span className="text-xs font-semibold text-secondary">{video.level === "Beginner" ? "Débutant" : video.level === "Intermediate" ? "Intermédiaire" : "Avancé"}</span>
      </div>
    </div>
  </div>
);

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("tout");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showOrbital, setShowOrbital] = useState(false);

  useEffect(() => {
    // On refresh, clear flag so preloader shows
    const navType = (performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming)?.type;
    if (navType === "reload") {
      sessionStorage.removeItem("eduvid_navigated");
    }
    // Skip preloader if navigating back within the app
    const navigated = sessionStorage.getItem("eduvid_navigated");
    if (navigated) {
      setPreloaderDone(true);
      return;
    }
    const t = setTimeout(() => setPreloaderDone(true), 8800);
    return () => clearTimeout(t);
  }, []);

  const filteredVideos = videos.filter((video) => {
    if (selectedCategory === "tout") return true;
    return video.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50/60 to-pink-50/50 relative overflow-hidden font-sans">
      {selectedVideo && <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
      {showOrbital && <OrbitalIntro onDone={() => { setShowOrbital(false); setShowPopup(true); }} />}
      {showPopup && <StartLearningPopup onClose={() => setShowPopup(false)} />}
      <WelcomeOverlay />
      {preloaderDone && (
        <>
          <CustomCursor />
          <AnimatedBackground />
          <FloatingMascots />
        </>
      )}
      <motion.div
        className="relative z-10"
        initial={false}
        animate={{ opacity: preloaderDone ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      >
        <Header />

        {/* Hero Section */}
        <section className="relative overflow-hidden py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Content */}
              <div className="animate-fade-in">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border-2 border-primary/30 mb-6 w-fit animate-slide-in-left">
                  <Sparkles className="w-5 h-5 text-primary animate-bounce-rotate" />
                  <span className="text-sm font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Vidéos pour apprendre le français
                  </span>
                </div>

                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-foreground mb-6 leading-tight animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
                  Apprends le français en{" "}
                  <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-rainbow">
                    t’amusant !
                  </span>
                </h1>

                <p className="text-lg sm:text-xl text-foreground/70 mb-8 leading-relaxed font-medium animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
                  Chansons, dessins animés, jeux et vocabulaire — tout ce dont les enfants ont besoin pour parler français avec confiance !
                </p>

                <div className="flex flex-col sm:flex-row gap-4 animate-slide-in-left" style={{ animationDelay: '0.3s' }}>
                  <Link
                    to="/browse"
                    onClick={(e) => { e.preventDefault(); setShowOrbital(true); }}
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2 text-lg hover:animate-pulse-glow"
                  >
                    <Sparkles className="w-6 h-6 animate-bounce" />
                    Commencer 🚀
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 pt-10 sm:mt-12 sm:pt-12 border-t-4 border-secondary/30 animate-fade-in text-center sm:text-left" style={{ animationDelay: '0.4s' }}>
                  <div className="hover:scale-110 transition-transform">
                    <div className="text-3xl sm:text-4xl font-black text-primary animate-bounce-up">31+</div>
                    <p className="text-sm font-bold text-foreground/60 mt-1">Vidéos</p>
                  </div>
                  <div className="hover:scale-110 transition-transform">
                    <div className="text-3xl sm:text-4xl font-black text-secondary animate-bounce-up" style={{ animationDelay: '0.2s' }}>50K+</div>
                    <p className="text-sm font-bold text-foreground/60 mt-1">Élèves</p>
                  </div>
                  <div className="hover:scale-110 transition-transform">
                    <div className="text-3xl sm:text-4xl font-black text-accent animate-bounce-up" style={{ animationDelay: '0.4s' }}>7</div>
                    <p className="text-sm font-bold text-foreground/60 mt-1">Catégories</p>
                  </div>
                </div>
              </div>

              {/* Right - Hero 3D Component */}
              <div className="relative hidden md:block animate-slide-in-right h-[400px] md:h-[500px] lg:h-[600px]">
                <Hero3D />
              </div>
            </div>
          </div>
        </section>

        {/* Infinite Marquee Section */}
        <Marquee speed="normal">
          <span className="text-2xl font-black text-primary flex items-center gap-2"><Sparkles className="text-accent" /> Apprendre le français</span>
          <span className="text-2xl font-black text-secondary flex items-center gap-2"><Star className="text-primary" /> Dessins Lou !</span>
          <span className="text-2xl font-black text-accent flex items-center gap-2"><Heart className="text-secondary" /> Chansons françaises</span>
          <span className="text-2xl font-black text-primary flex items-center gap-2"><Zap className="text-accent" /> Jeux de vocabulaire</span>
          <span className="text-2xl font-black text-secondary flex items-center gap-2"><BookOpen className="text-primary" /> Labo de français</span>
        </Marquee>

        {/* Videos Section */}
        <motion.section 
          id="videos" 
          className="py-10 sm:py-16 lg:py-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-12 animate-fade-in">
              <h2 className="text-3xl sm:text-5xl font-black text-foreground mb-4 animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
                Explorez nos <span className="text-primary animate-glow">Vidéos</span>
              </h2>
              <p className="text-lg text-foreground/60 max-w-2xl mx-auto font-medium animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
                Choisissez votre catégorie préférée et commencez à apprendre avec nos animations colorées !
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-3 justify-center mb-12">
              {categories.map((cat, idx) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-6 py-2 rounded-full font-bold transition-all text-sm sm:text-base animate-scale-in hover:animate-bounce-rotate ${
                    selectedCategory === cat.id
                      ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg scale-105 animate-pulse-glow"
                      : "bg-background border-2 border-primary/30 text-foreground hover:bg-primary/5 hover:border-primary/60 hover:shadow-md"
                  }`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Videos Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {filteredVideos.map((video, idx) => (
                <VideoCard key={video.id} video={video} delay={idx} onClick={() => setSelectedVideo(video)} />
              ))}
            </div>

            {filteredVideos.length === 0 && (
              <div className="text-center py-12 animate-fade-in">
                <p className="text-lg text-foreground/60 font-medium">
                  Aucune vidéo trouvée dans cette catégorie. Essayez-en une autre !
                </p>
              </div>
            )}
          </div>
        </motion.section>

        {/* Learning Interactive Sections */}
        <LearningConcepts />

        {/* Features Section */}
        <motion.section 
          className="py-10 sm:py-16 lg:py-20 bg-gradient-to-r from-blue-50/60 via-rose-50/40 to-orange-50/50 rounded-3xl mx-2 sm:mx-6 lg:mx-8 border border-primary/10"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-5xl font-black text-foreground text-center mb-10 sm:mb-12 animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
              Pourquoi les enfants adorent <span className="text-primary animate-bounce-rotate">Univers des Enfants</span>
            </h2>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                { icon: Play, title: "Coloré & Amusant", desc: "Des vidéos lumineuses et animées qui captivent l’imagination des enfants !", color: "from-primary to-secondary" },
                { icon: Heart, title: "Sûr & Fiable", desc: "Contenu sélectionné par des éducateurs pour la tranquillité des parents.", color: "from-secondary to-accent" },
                { icon: Zap, title: "Apprends Vite", desc: "Des vidéos courtes et engageantes qui gardent les enfants concentrés !", color: "from-accent to-primary" },
                { icon: Sparkles, title: "100% Gratuit", desc: "Toutes les vidéos, jeux et quiz sont totalement gratuits — sans inscription !", color: "from-primary to-accent" }
              ].map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={idx}
                    className="text-center p-8 glass-card rounded-3xl shadow-lg border-2 hover:shadow-xl transition-all hover:scale-105 animate-scale-in"
                    style={{ animationDelay: `${(idx + 2) * 100}ms` }}
                  >
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center mx-auto mb-4 animate-bounce`} style={{ animationDelay: `${idx * 0.2}s` }}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-foreground mb-2">{feature.title}</h3>
                    <p className="text-foreground/60 font-medium">
                      {feature.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Achievements Section integrated here */}
            <div className="mt-20">
              <h2 className="text-3xl sm:text-4xl font-black text-center mb-8 animate-fade-in">
                Débloquer des <span className="text-primary">Super-Pouvoirs</span>
              </h2>
              <AchievementBadges />
            </div>

          </div>
        </motion.section>

        {/* Learning Path Section */}
        <motion.section
          className="py-10 sm:py-20 px-4 sm:px-6 lg:px-8 relative z-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-black text-foreground text-center mb-4 animate-slide-in-left">
              Ton Parcours d’Apprentissage <span className="text-primary">du Français</span>
            </h2>
            <p className="text-center text-foreground/60 font-medium mb-12 text-lg animate-slide-in-right">
              Suis ces étapes et parle français comme un pro !
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* Step 01 — Watch a Video */}
              <motion.div
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0 }}
                className="relative glass-card rounded-3xl overflow-hidden border-2 border-primary/15 hover:border-primary/50 hover:scale-105 transition-all shadow-md hover:shadow-xl flex flex-col"
              >
                <span className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center shadow-md">01</span>
                <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-background border-2 border-primary/30 items-center justify-center text-primary font-black text-lg shadow">›</div>
                <div
                  className="relative h-36 overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedVideo(videos[10])}
                >
                  <img src="/thumnails/greetings-french.jpg" alt="Greetings in French" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/70 text-white text-xs font-bold">7 min</span>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-base font-black text-foreground mb-1">Regarde des Vidéos</h3>
                  <p className="text-xs text-foreground/60 font-medium leading-relaxed mb-3 flex-1">Commence par les salutations, les couleurs, les chiffres et les jours de la semaine.</p>
                  <Link to="/browse" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">Voir toutes les vidéos <span>→</span></Link>
                </div>
              </motion.div>

              {/* Step 02 — Memory Game */}
              <motion.div
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.15 }}
                className="relative glass-card rounded-3xl overflow-hidden border-2 border-secondary/15 hover:border-secondary/50 hover:scale-105 transition-all shadow-md hover:shadow-xl flex flex-col"
              >
                <span className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-secondary text-white text-xs font-black flex items-center justify-center shadow-md">02</span>
                <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-background border-2 border-secondary/30 items-center justify-center text-secondary font-black text-lg shadow">›</div>
                <div className="h-36 bg-gradient-to-br from-secondary/10 to-pink-50/60 p-3 flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-1.5 w-full">
                    {[
                      { show: true,  type: "emoji", content: "🐱" },
                      { show: false, type: "back",  content: "?" },
                      { show: true,  type: "word",  content: "Chat" },
                      { show: true,  type: "emoji", content: "🍎" },
                      { show: true,  type: "word",  content: "Pomme" },
                      { show: false, type: "back",  content: "?" },
                    ].map((c, i) => (
                      <div key={i} className={`aspect-square rounded-xl flex items-center justify-center text-xs font-black shadow-sm border-2
                        ${c.show && c.type === "emoji" ? "bg-blue-100 border-primary/40 text-base" : ""}
                        ${c.show && c.type === "word"  ? "bg-rose-100 border-secondary/40 text-secondary" : ""}
                        ${!c.show ? "bg-primary border-primary text-white" : ""}
                      `}>{c.content}</div>
                    ))}
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-base font-black text-foreground mb-1">Jeu de Mémoire</h3>
                  <p className="text-xs text-foreground/60 font-medium leading-relaxed mb-3 flex-1">Associe les mots français à leurs images emoji pour mémoriser le vocabulaire.</p>
                  <Link to="/memory-game" className="text-xs font-bold text-secondary hover:underline flex items-center gap-1">Jouer maintenant <span>→</span></Link>
                </div>
              </motion.div>

              {/* Step 03 — Quiz */}
              <motion.div
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.3 }}
                className="relative glass-card rounded-3xl overflow-hidden border-2 border-accent/15 hover:border-accent/50 hover:scale-105 transition-all shadow-md hover:shadow-xl flex flex-col"
              >
                <span className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-accent text-white text-xs font-black flex items-center justify-center shadow-md">03</span>
                <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-background border-2 border-accent/30 items-center justify-center text-accent font-black text-lg shadow">›</div>
                <div className="h-36 bg-gradient-to-br from-accent/10 to-orange-50/60 dark:from-accent/20 dark:to-orange-900/20 p-3 flex flex-col justify-center gap-1.5">
                  <p className="text-xs font-black text-foreground/80 text-center mb-1">Que signifie "Chat" ?</p>
                  <div className="grid grid-cols-2 gap-1">
                    {[
                      { label: "Chien",  style: "bg-white dark:bg-muted border-foreground/10 dark:border-foreground/20 text-foreground/40 dark:text-foreground/50" },
                      { label: "Chat ✓", style: "bg-green-100 dark:bg-green-900/40 border-green-400 dark:border-green-500 text-green-700 dark:text-green-400" },
                      { label: "Oiseau", style: "bg-white dark:bg-muted border-foreground/10 dark:border-foreground/20 text-foreground/40 dark:text-foreground/50" },
                      { label: "Poisson", style: "bg-white dark:bg-muted border-foreground/10 dark:border-foreground/20 text-foreground/40 dark:text-foreground/50" },
                    ].map((o) => (
                      <div key={o.label} className={`text-center py-1 rounded-lg border-2 text-xs font-bold ${o.style}`}>{o.label}</div>
                    ))}
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-base font-black text-foreground mb-1">Fais le Quiz</h3>
                  <p className="text-xs text-foreground/60 font-medium leading-relaxed mb-3 flex-1">10 questions par manche — teste ce que tu as appris et suis ton score.</p>
                  <Link to="/quiz" className="text-xs font-bold text-accent hover:underline flex items-center gap-1">Démarrer le quiz <span>→</span></Link>
                </div>
              </motion.div>

              {/* Step 04 — Lou! Cartoons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.45 }}
                className="relative glass-card rounded-3xl overflow-hidden border-2 border-green-400/20 hover:border-green-500/50 hover:scale-105 transition-all shadow-md hover:shadow-xl flex flex-col"
              >
                <span className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-green-500 text-white text-xs font-black flex items-center justify-center shadow-md">04</span>
                <div
                  className="relative h-36 overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedVideo(videos[23])}
                >
                  <img src="/thumnails/lou-ep1.jpg" alt="Lou! Cartoon" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-green-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/70 text-white text-xs font-bold">11 min</span>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-base font-black text-foreground mb-1">Dessins Lou !</h3>
                  <p className="text-xs text-foreground/60 font-medium leading-relaxed mb-3 flex-1">Progresse avec des histoires en français — 8 épisodes, du vrai français parlé !</p>
                  <Link to="/browse" className="text-xs font-bold text-green-600 hover:underline flex items-center gap-1">Voir les épisodes <span>→</span></Link>
                </div>
              </motion.div>

            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="border-t-4 border-primary/20 bg-gradient-to-br from-white via-blue-50/40 to-rose-50/30 backdrop-blur pt-12 pb-8 animate-fade-in">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Top row: logo + tagline + nav links */}
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 mb-10">

              {/* Brand */}
              <div className="text-center md:text-left max-w-xs">
                <div className="flex items-center gap-3 justify-center md:justify-start mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-2xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Univers des Enfants</span>
                </div>
                <p className="text-sm text-foreground/60 font-medium leading-relaxed">
                  Des vidéos, jeux et activités en français conçus pour les enfants curieux qui adorent apprendre !
                </p>
              </div>

              {/* Quick links */}
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  { label: "Accueil", path: "/" },
                  { label: "Vidéos", path: "/browse" },
                  { label: "À propos", path: "/about" },
                  { label: "Jeu de Mémoire", path: "/memory-game" },
                  { label: "Quiz", path: "/quiz" },
                  { label: "Mots Mêlés", path: "/word-scramble" },
                  { label: "Épelle-le !", path: "/spell-it" },
                ].map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="px-4 py-2 rounded-full border-2 border-primary/20 text-sm font-bold text-foreground/70 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>


            </div>

            {/* French flag divider */}
            <div className="h-1 french-stripe w-full rounded-full mb-6" />

            {/* Bottom copyright */}
            <p className="text-center text-sm text-foreground/50 font-medium">
              © 2026 Univers des Enfants. Rendre l’apprentissage amusant pour chaque enfant !
            </p>
          </div>
        </footer>
      </motion.div>
    </div>
  );
}

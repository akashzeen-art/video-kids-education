import { useState } from "react";
import { Play, Star, Users, Search } from "lucide-react";
import Header from "@/components/header";
import { videos, categories, type Video } from "@/data/videos";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedBackground from "@/components/animated-background";

interface VideoModalProps { video: Video; onClose: () => void; }

function VideoModal({ video, onClose }: VideoModalProps) {
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
            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 flex items-center justify-center hover:bg-black transition-colors text-white font-bold text-lg"
          >
            ✕
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
}

export default function Browse() {
  const [selectedCategory, setSelectedCategory] = useState("tout");
  const [search, setSearch] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const filtered = videos.filter((v) => {
    const matchCat = selectedCategory === "tout" || v.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchSearch = v.title.toLowerCase().includes(search.toLowerCase()) || v.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50/60 to-pink-50/50 relative overflow-hidden">
      {selectedVideo && <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
      <AnimatedBackground />
      <div className="relative z-10">
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Page header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-3">
              Vidéos françaises <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">en français</span>
            </h1>
            <p className="text-foreground/60 font-medium text-lg">
              Vidéos pour apprendre le français — choisis une catégorie et commence à regarder !
            </p>
          </div>

          {/* Search bar */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
            <input
              type="text"
              placeholder="Rechercher des vidéos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-primary/20 bg-white dark:bg-muted text-foreground font-medium focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {categories.map((cat, idx) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2 rounded-full font-bold text-sm transition-all animate-scale-in ${
                  selectedCategory === cat.id
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-105"
                    : "bg-white dark:bg-muted border-2 border-primary/20 text-foreground hover:border-primary hover:bg-primary/5"
                }`}
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Video grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((video, idx) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                onClick={() => setSelectedVideo(video)}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-3xl glass-card h-48 mb-3 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-secondary/10 group-hover:border-primary/40 group-hover:scale-105">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg">
                      <Play className="w-7 h-7 text-white fill-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-primary text-white text-xs font-bold">
                    {video.duration}
                  </div>
                </div>
                <h3 className="font-bold text-foreground text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                  {video.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-foreground/50">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-accent text-accent" />{video.rating}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-secondary/15 text-secondary font-semibold">{video.level === "Beginner" ? "Débutant" : video.level === "Intermediate" ? "Intermédiaire" : "Avancé"}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-foreground/60 font-medium text-lg">Aucune vidéo trouvée. Essaie une autre recherche ou catégorie.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

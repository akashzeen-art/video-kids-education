import { motion } from "framer-motion";

export const achievements = [
  { icon: "🏆", label: "Maître des Vidéos",  desc: "Regarde 5 vidéos",         color: "from-yellow-400 to-yellow-500" },
  { icon: "🧠", label: "Puissance Cerveau", desc: "Termine 10 leçons",        color: "from-purple-400 to-purple-500" },
  { icon: "⚡", label: "Ultra Rapide",      desc: "Réponds en 30 sec",         color: "from-blue-400 to-cyan-500" },
  { icon: "🎯", label: "Score Parfait",    desc: "100% de réussite",         color: "from-green-400 to-emerald-500" },
  { icon: "🔥", label: "En Feu",           desc: "7 jours d’affilée",         color: "from-red-400 to-orange-500" },
  { icon: "🌟", label: "Superstar",        desc: "Gagne 100 �toiles",         color: "from-pink-400 to-rose-500" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { scale: 0, opacity: 0, y: 50 },
  show: { scale: 1, opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } },
};

export default function AchievementBadges() {
  return (
    <motion.div 
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
    >
      {achievements.map((badge, idx) => (
        <motion.div
          key={idx}
          variants={itemVariants}
          whileHover={{ scale: 1.1, rotate: [-2, 2, -2, 0] }}
          className="text-center p-4 rounded-2xl bg-white dark:bg-muted border-4 border-primary/20 hover:border-primary hover:shadow-xl transition-all cursor-pointer group"
        >
          <motion.div 
            className="text-5xl mb-3"
            whileHover={{ scale: 1.2 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {badge.icon}
          </motion.div>
          <h4 className="font-black text-sm text-foreground group-hover:text-primary transition-colors">
            {badge.label}
          </h4>
          <p className="text-xs text-foreground/60 mt-1 font-bold">{badge.desc}</p>
          <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
            <div className={`h-full bg-gradient-to-r ${badge.color} w-3/4 rounded-full animate-pulse`} />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

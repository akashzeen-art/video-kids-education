import { motion } from "framer-motion";

export default function FloatingMascots() {
  const floatTransition: any = {
    duration: 6,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut",
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      <motion.div
        className="absolute top-40 left-10 text-6xl"
        animate={{ y: [-20, 20], rotate: [-10, 10] }}
        transition={{ ...floatTransition, duration: 5 }}
      >
        🚀
      </motion.div>

      <motion.div
        className="absolute top-32 right-20 text-5xl"
        animate={{ y: [-15, 15], rotate: [5, -5] }}
        transition={{ ...floatTransition, duration: 4.5, delay: 1 }}
      >
        🎨
      </motion.div>

      <motion.div
        className="absolute top-1/2 left-5 text-5xl"
        animate={{ y: [-25, 25], x: [-10, 10] }}
        transition={{ ...floatTransition, duration: 7, delay: 2 }}
      >
        🧬
      </motion.div>

      <motion.div
        className="absolute top-1/3 right-10 text-6xl"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      >
        🌟
      </motion.div>

      <motion.div
        className="absolute bottom-40 left-1/3 text-5xl"
        animate={{ y: [0, -30, 0], rotate: [-5, 5, -5] }}
        transition={{ ...floatTransition, duration: 4, delay: 1.5 }}
      >
        📚
      </motion.div>

      <motion.div
        className="absolute bottom-32 right-1/4 text-6xl"
        animate={{ y: [-20, 20], x: [10, -10] }}
        transition={{ ...floatTransition, duration: 6.5, delay: 0.5 }}
      >
        🧪
      </motion.div>

      <motion.div
        className="absolute top-1/4 right-1/3 text-4xl"
        animate={{ rotate: [-15, 15], scale: [0.9, 1.1] }}
        transition={{ ...floatTransition, duration: 3, delay: 2.5 }}
      >
        💡
      </motion.div>

      <motion.div
        className="absolute bottom-1/4 left-1/4 text-4xl"
        animate={{ y: [0, -50, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        🎯
      </motion.div>

      <motion.div
        className="absolute top-2/3 right-1/2 text-3xl opacity-60"
        animate={{ rotate: 360, scale: [1, 1.5, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      >
        ⭐
      </motion.div>

      <motion.div
        className="absolute top-1/3 left-1/2 w-3 h-3 bg-primary rounded-full"
        animate={{ y: [-20, 20], scale: [1, 1.5, 1] }}
        transition={{ ...floatTransition, duration: 3 }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/3 w-4 h-4 bg-secondary rounded-full"
        animate={{ y: [0, -40, 0], x: [-20, 20, -20] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/3 w-2.5 h-2.5 bg-accent rounded-full"
        animate={{ scale: [1, 2, 1], rotate: [0, 90, 0] }}
        transition={{ ...floatTransition, duration: 2 }}
      />
    </div>
  );
}

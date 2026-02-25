import { motion } from "framer-motion";

export const GrassBlade = ({ index }: { index: number }) => (
    <motion.div
        initial={{ rotate: -5 }}
        animate={{ rotate: 5 }}
        transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: Math.random() * 2
        }}
        className="absolute bottom-0 w-[2px] bg-gradient-to-t from-green-900/40 to-emerald-500/20 origin-bottom"
        style={{
            left: `${(index / 120) * 100}%`,
            height: `${15 + Math.random() * 25}px`
        }}
    />
);

export const CharacterSilhouette = ({ delay = 0, scale = 1 }: { delay?: number, scale?: number }) => (
    <motion.div
        animate={{
            y: [0, -8, 0],
            rotate: [0, -2, 2, 0]
        }}
        transition={{
            duration: 0.8,
            repeat: Infinity,
            delay
        }}
        className="relative flex flex-col items-center opacity-80"
        style={{ transform: `scale(${scale})` }}
    >
        {/* Simple Head & Body Silhouette */}
        <div className="w-8 h-8 bg-black rounded-full mb-[-4px]" />
        <div className="w-10 h-16 bg-black rounded-t-xl" />
        {/* Animated Legs */}
        <div className="flex gap-2">
            <motion.div animate={{ height: [12, 18, 12] }} transition={{ duration: 0.4, repeat: Infinity, delay }} className="w-3 bg-black rounded-b-md" />
            <motion.div animate={{ height: [18, 12, 18] }} transition={{ duration: 0.4, repeat: Infinity, delay }} className="w-3 bg-black rounded-b-md" />
        </div>
    </motion.div>
);

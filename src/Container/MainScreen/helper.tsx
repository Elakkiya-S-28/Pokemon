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
        style={{ left: `${(index / 120) * 100}%`, height: `${15 + Math.random() * 25}px` }}
    />
);

// High-quality transparent walking GIFs (Standard Pokémon Game Sprites)
const SPRITES = {
    ash: "https://projectpokemon.org/images/sprites-models/pkm-extras/ash_walking.gif", // If this link expires, use a local ash_walk.gif
    misty: "https://www.pokestadium.com/sprites/trainers/misty-walk.gif",
    brock: "https://www.pokestadium.com/sprites/trainers/brock-walk.gif",
    pikachu: "https://projectpokemon.org/images/sprites-models/normal-back/pikachu.gif"
};

export const WalkingSprite = ({ type, delay = 0, scale = 1 }: { type: 'ash' | 'misty' | 'brock' | 'pikachu', delay?: number, scale?: number }) => {
    return (
        <div className="relative flex flex-col items-center" style={{ transform: `scale(${scale})` }}>
            {/* The Actual Walking GIF */}
            <motion.img
                src={SPRITES[type]}
                alt={type}
                initial={{ x: -5 }}
                animate={{ x: 5 }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                    delay: delay
                }}
                className={`${type === 'pikachu' ? 'h-10' : 'h-32 md:h-44'} object-contain z-10 select-none pointer-events-none pixelated`}
                style={{
                    imageRendering: 'pixelated', // Keeps the "Game" look sharp
                    filter: "drop-shadow(0px 5px 10px rgba(0,0,0,0.3))"
                }}
            />

            {/* Ground Shadow */}
            <motion.div
                animate={{ scaleX: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
                transition={{ duration: 0.75, repeat: Infinity, delay }}
                className="absolute -bottom-2 w-12 h-2 bg-black/40 rounded-[100%] blur-sm z-0"
            />
        </div>
    );
};
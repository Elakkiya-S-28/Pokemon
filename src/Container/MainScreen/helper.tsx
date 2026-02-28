'use client';
import React, { useMemo } from 'react';
import { motion } from "framer-motion";
import { Home, Beaker, Zap, BarChart2, Library } from 'lucide-react';

// --- HELPERS ---

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


interface WalkingSpriteProps {
    type: 'ash' | 'pikachu' | 'misty' | 'brock';
    delay?: number;
    speed?: number;
    scale?: number;
}

const CHAR_THEMES = {
    ash: {
        skin: '#ffdbac', hair: '#333', hat: '#ff4444', shirt: '#3b82f6',
        pants: '#444', accent: '#fff', size: 64
    },
    misty: {
        skin: '#ffdbac', hair: '#ff8c00', shirt: '#fde047',
        pants: '#2563eb', suspenders: '#ef4444', size: 60
    },
    brock: {
        skin: '#c68642', hair: '#4b2c20', shirt: '#f97316',
        vest: '#65a30d', pants: '#78350f', size: 68
    },
    pikachu: {
        skin: '#fde047', ears: '#fde047', cheeks: '#ef4444',
        tail: '#fde047', size: 32
    }
};

export const WalkingSprite = ({
    type = 'ash',
    delay = 0,
    speed = 15,
    scale = 2,
}: WalkingSpriteProps) => {
    const theme = CHAR_THEMES[type];
    const isPika = type === 'pikachu';

    // Animation variants for stepping
    const legVariants = {
        walk: (d: number) => ({
            rotate: [15, -15, 15],
            transition: { duration: 0.6, repeat: Infinity, delay: d }
        })
    };

    const bodyBob = {
        y: [0, -2, 0],
        transition: { duration: 0.3, repeat: Infinity, ease: "linear" }
    };

    return (
        <motion.div
            className="absolute bottom-12 left-0"
            initial={{ x: "-20vw" }}
            animate={{ x: "110vw" }}
            transition={{ duration: speed, repeat: Infinity, ease: "linear", delay }}
            style={{ zIndex: isPika ? 40 : 30 }}
        >
            <motion.svg
                width={theme.size}
                height={theme.size}
                viewBox="0 0 64 64"
                style={{ transform: `scale(${scale})`, transformOrigin: 'bottom' }}
                animate={bodyBob}
            >
                {/* Shadow */}
                <ellipse cx="32" cy="60" rx="14" ry="3" fill="black" fillOpacity="0.2" />

                {/* --- LEGS --- */}
                {!isPika && (
                    <g>
                        <motion.rect x="26" y="45" width="4" height="12" fill={theme.pants} variants={legVariants} custom={0} animate="walk" />
                        <motion.rect x="34" y="45" width="4" height="12" fill={theme.pants} variants={legVariants} custom={0.3} animate="walk" />
                    </g>
                )}

                {/* --- BODY --- */}
                <g transform="translate(16, 20)">
                    {type === 'ash' && (
                        <>
                            <rect x="4" y="10" width="24" height="18" fill={theme.shirt} rx="2" />
                            <rect x="8" y="10" width="16" height="18" fill="white" /> {/* Ash's inner shirt */}
                        </>
                    )}
                    {type === 'misty' && (
                        <>
                            <rect x="6" y="12" width="20" height="16" fill={theme.shirt} rx="2" />
                            <rect x="8" y="12" width="2" height="16" fill={theme.suspenders} />
                            <rect x="22" y="12" width="2" height="16" fill={theme.suspenders} />
                        </>
                    )}
                    {type === 'brock' && (
                        <>
                            <rect x="4" y="10" width="24" height="20" fill={theme.shirt} rx="2" />
                            <path d="M4 10 L12 10 L16 25 L20 10 L28 10 L28 30 L4 30 Z" fill={theme.vest} />
                        </>
                    )}
                    {isPika && (
                        <ellipse cx="16" cy="25" rx="14" ry="12" fill={theme.skin} />
                    )}
                </g>

                {/* --- HEAD --- */}
                <g transform="translate(32, 22)">
                    {/* Hair/Head Base */}
                    <circle r={isPika ? "10" : "11"} fill={theme.skin} />

                    {/* Brock's Hair (Spiky) */}
                    {type === 'brock' && <path d="M-12 -8 L-8 -15 L0 -12 L8 -15 L12 -8 Z" fill={theme.hair} />}

                    {/* Misty's Side Pony */}
                    {type === 'misty' && (
                        <motion.path
                            d="M10 -5 L20 -12 L18 -2 Z" fill={theme.hair}
                            animate={{ rotate: [0, 15, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity }}
                        />
                    )}

                    {/* Ash's Hat */}
                    {type === 'ash' && (
                        <g>
                            <path d="M-12 0 A 12 12 0 0 1 12 0 Z" fill={theme.hat} transform="translate(0, -4)" />
                            <rect x="-12" y="-4" width="24" height="4" fill={theme.hat} />
                            <rect x="0" y="-8" width="8" height="6" fill="white" rx="1" /> {/* Logo */}
                        </g>
                    )}

                    {/* Eyes */}
                    {type === 'brock' ? (
                        <> {/* Brock's squinty eyes */}
                            <line x1="-6" y1="-1" x2="-2" y2="-1" stroke="#000" strokeWidth="1" />
                            <line x1="2" y1="-1" x2="6" y2="-1" stroke="#000" strokeWidth="1" />
                        </>
                    ) : (
                        <>
                            <circle cx="-4" cy="-1" r="1.5" fill="black" />
                            <circle cx="4" cy="-1" r="1.5" fill="black" />
                        </>
                    )}

                    {/* Pikachu Extras */}
                    {isPika && (
                        <>
                            <circle cx="-6" cy="2" r="3" fill={theme.cheeks} />
                            <circle cx="6" cy="2" r="3" fill={theme.cheeks} />
                            {/* Ears */}
                            <motion.path d="M-8 -8 L-15 -20" stroke={theme.skin} strokeWidth="4" strokeLinecap="round" animate={{ rotate: [-10, 10] }} />
                            <motion.path d="M8 -8 L15 -20" stroke={theme.skin} strokeWidth="4" strokeLinecap="round" animate={{ rotate: [10, -10] }} />
                        </>
                    )}
                </g>

                {/* Pikachu Tail */}
                {isPika && (
                    <motion.path
                        d="M15 45 L5 35 L15 35 L10 25"
                        fill="none"
                        stroke="#b45309"
                        strokeWidth="3"
                        animate={{ x: [0, 2, 0] }}
                    />
                )}
            </motion.svg>
        </motion.div>
    );
};
'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Shield, Zap, Heart, Sword, Wind } from 'lucide-react';
import { AttributeBox, StatBar } from '@/src/Component/MainScreen/pages';

const STAT_ICONS: Record<string, any> = {
    hp: <Heart size={14} />,
    attack: <Sword size={14} />,
    defense: <Shield size={14} />,
    "special-attack": <Zap size={14} />,
    "special-defense": <Shield size={14} />,
    speed: <Wind size={14} />,
};

export const AnalyzeView = ({ pokemon }: { pokemon: any }) => {
    // State to fix hydration mismatch for the DNA bars
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!pokemon) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-white/20 p-6 text-center">
                <Activity size={64} className="mb-4 opacity-20 animate-pulse" />
                <p className="tracking-[0.3em] md:tracking-[0.5em] font-light text-sm md:text-base">
                    AWAITING DNA SAMPLE...
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 p-4 md:p-8 lg:p-12 flex flex-col lg:grid lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto w-full overflow-y-auto custom-scrollbar">

            {/* LEFT COLUMN: Visual DNA Scan */}
            <div className="w-full lg:col-span-5 space-y-6">
                <div className="relative aspect-square bg-gradient-to-b from-white/5 to-transparent rounded-2xl md:rounded-3xl border border-white/10 overflow-hidden flex items-center justify-center shadow-2xl">
                    {/* CRT/Scanline Overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-20 pointer-events-none" />
                    <div className="absolute inset-0 bg-[grid-white/5] [mask-image:radial-gradient(white,transparent)]" />

                    <motion.img
                        key={pokemon.id}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        src={pokemon.sprite}
                        className="w-3/4 h-3/4 relative z-10 drop-shadow-[0_0_30px_rgba(74,222,128,0.3)] object-contain"
                    />

                    {/* HUD Scan Line */}
                    <motion.div
                        animate={{ y: [-150, 150] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute w-full h-1/2 bg-gradient-to-b from-transparent via-green-500/10 to-transparent border-t border-green-500/40 z-20"
                    />
                </div>

                {/* Attributes Grid */}
                <div className="grid grid-cols-3 gap-2 md:gap-4">
                    <AttributeBox label="HEIGHT" value={`${pokemon.height / 10}m`} />
                    <AttributeBox label="WEIGHT" value={`${pokemon.weight / 10}kg`} />
                    <AttributeBox label="INDEX" value={`#${pokemon.id}`} />
                </div>
            </div>

            {/* RIGHT COLUMN: Biological Data */}
            <div className="w-full lg:col-span-7 space-y-6 md:space-y-8">
                <div className="text-center lg:text-left">
                    <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-3">
                        {pokemon.types.map((t: any) => (
                            <span key={t.type.name} className="px-3 py-1 bg-white/5 rounded-full text-[9px] md:text-[10px] font-bold tracking-widest uppercase border border-white/10 text-white/70">
                                {t.type.name}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none italic break-words">
                        {pokemon.name}
                    </h1>
                </div>

                {/* Stat Distribution */}
                <div className="space-y-4 bg-white/5 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/10 shadow-inner">
                    <h3 className="text-[10px] tracking-[0.2em] text-white/30 font-bold mb-4">STATISTICAL DISTRIBUTION</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-x-8 gap-y-4">
                        {pokemon.stats.map((s: any) => (
                            <StatBar
                                key={s.stat.name}
                                label={s.stat.name}
                                value={s.base_stat}
                                icon={STAT_ICONS[s.stat.name]}
                            />
                        ))}
                    </div>
                </div>

                {/* Abilities & DNA Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 lg:pb-0">
                    <div className="space-y-3">
                        <h3 className="text-[10px] tracking-[0.2em] text-green-400/60 font-bold uppercase">Abilities</h3>
                        <div className="flex flex-wrap gap-2">
                            {pokemon.abilities.map((a: any) => (
                                <div key={a.ability.name} className="px-3 py-2 bg-black/40 border border-white/5 rounded-xl text-xs capitalize text-white/80">
                                    {a.ability.name.replace('-', ' ')}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-[10px] tracking-[0.2em] text-green-400/60 font-bold uppercase">DNA Integrity</h3>
                        <div className="h-12 flex items-end gap-1 px-1">
                            {isClient ? (
                                Array.from({ length: 20 }).map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ height: 10 }}
                                        animate={{ height: [10, Math.floor(Math.random() * 30 + 10), 10] }}
                                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.05 }}
                                        className="flex-1 bg-green-500/30 rounded-t-sm"
                                    />
                                ))
                            ) : (
                                <div className="w-full h-4 bg-white/5 animate-pulse rounded" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
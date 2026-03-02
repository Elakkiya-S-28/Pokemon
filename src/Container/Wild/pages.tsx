'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, CheckCircle2, Zap, Timer } from 'lucide-react';
import { Pokeball } from '@/src/Component/MainScreen/pages';
import { PokemonData, WildSceneProps } from '@/src/Component/interface/pages';

export const WildScene = ({ onConfirmCatch }: WildSceneProps) => {
    const [pokemon, setPokemon] = useState<PokemonData | null>(null);
    const [pos, setPos] = useState({ top: '40%', left: '50%' });
    const [status, setStatus] = useState<'loading' | 'idle' | 'throwing'>('loading');
    const [capturedBuffer, setCapturedBuffer] = useState<PokemonData[]>([]);

    const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);

    const spawnNew = useCallback(async () => {
        setStatus('loading');
        try {
            const randomId = Math.floor(Math.random() * 151) + 1;
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
            const data = await response.json();

            const newPokemon: PokemonData = {
                name: data.name,
                id: data.id,
                sprite: data.sprites.other['official-artwork'].front_default,
                stats: data.stats,
                types: data.types,
                abilities: data.abilities,
                height: data.height,
                weight: data.weight,
            };

            // Mobile-aware random positioning (narrower range for mobile)
            const isMobile = window.innerWidth < 1024;
            const randomTop = Math.floor(Math.random() * 30 + 20) + '%';
            const randomLeft = isMobile
                ? Math.floor(Math.random() * 40 + 30) + '%' // Center more on mobile
                : Math.floor(Math.random() * 50 + 25) + '%';

            setPokemon(newPokemon);
            setPos({ top: randomTop, left: randomLeft });
            setStatus('idle');
        } catch (error) {
            console.error("Failed to fetch Pokemon", error);
        }
    }, []);

    useEffect(() => {
        spawnNew();
    }, [spawnNew]);

    // Global 5-second timer
    useEffect(() => {
        if (status === 'idle') {
            const timer = setInterval(() => {
                spawnNew();
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [status, spawnNew]);

    const throwBall = () => {
        if (status !== 'idle' || !pokemon) return;
        setStatus('throwing');

        setTimeout(() => {
            setCapturedBuffer(prev => [pokemon, ...prev]);
            setPokemon(null);
            spawnNew();
        }, 800);
    };

    const removeFromBuffer = (id: number) => {
        setCapturedBuffer(prev => prev.filter((_, index) => index !== id));
    };

    return (
        <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden bg-[#050208]">

            {/* LEFT/TOP: WILD AREA */}
            <div className="relative flex-1 min-h-[50vh] lg:min-h-0 border-b lg:border-b-0 lg:border-r border-white/5 overflow-hidden">
                {/* Timer Progress Bar */}
                {status === 'idle' && (
                    <div className="absolute top-6 left-6 right-6 lg:right-auto z-20 flex items-center gap-3">
                        <Timer size={14} className="text-white/40" />
                        <div className="flex-1 lg:w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: "100%" }}
                                animate={{ width: "0%" }}
                                transition={{ duration: 5, ease: "linear" }}
                                key={pokemon?.id}
                                className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                            />
                        </div>
                    </div>
                )}

                <AnimatePresence>
                    {status !== 'loading' && pokemon && (
                        <motion.div
                            style={{ top: pos.top, left: pos.left }}
                            className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0, rotate: 180 }}
                        >
                            <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[9px] md:text-[10px] tracking-widest mb-2 border border-white/10 text-white/70 whitespace-nowrap">
                                #0{pokemon.id} {pokemon.name.toUpperCase()}
                            </div>
                            <motion.img
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                src={pokemon.sprite}
                                className="w-32 h-32 md:w-48 md:h-48 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Pokeball interaction Area */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
                    {status === 'idle' && (
                        <motion.div
                            whileTap={{ scale: 0.9 }}
                            onClick={throwBall}
                            className="cursor-pointer flex flex-col items-center group"
                        >
                            <Pokeball className="w-14 h-14 md:w-16 md:h-16 group-hover:scale-110 transition-transform" />
                            <p className="text-[8px] tracking-[0.4em] text-white/30 mt-4 group-hover:text-blue-400 uppercase font-bold">Initiate Capture</p>
                        </motion.div>
                    )}

                    {status === 'throwing' && (
                        <motion.div
                            initial={{ y: 0, x: 0, scale: 1 }}
                            animate={{
                                y: `calc(-${100 - parseInt(pos.top)}vh + 150px)`,
                                x: `calc(${parseInt(pos.left) - 50}vw)`,
                                scale: 0.2,
                                rotate: 720
                            }}
                            transition={{ duration: 0.6, ease: "circOut" }}
                        >
                            <Pokeball className="w-14 h-14 md:w-16 md:h-16" />
                        </motion.div>
                    )}
                </div>
            </div>

            {/* RIGHT/BOTTOM: BUFFER PANEL */}
            <div className="w-full lg:w-80 h-[40vh] lg:h-full bg-black/40 backdrop-blur-3xl flex flex-col shrink-0">
                <div className="p-4 md:p-6 border-b border-white/10 flex justify-between items-center lg:block">
                    <div>
                        <h3 className="text-xs md:text-sm font-black tracking-widest text-white/80 flex items-center gap-2">
                            <Zap size={16} className="text-yellow-400" /> DNA BUFFER
                        </h3>
                        <p className="text-[9px] text-white/30 mt-1 uppercase hidden md:block">Secured specimens</p>
                    </div>
                    {/* Mobile Only Count */}
                    <div className="lg:hidden text-[10px] font-mono text-blue-400">
                        COUNT: {capturedBuffer.length}
                    </div>
                </div>

                {/* Scrollable Buffer List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    <AnimatePresence initial={false}>
                        {capturedBuffer.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                                <p className="text-[9px] uppercase tracking-[0.3em]">No DNA Secured</p>
                            </div>
                        ) : (
                            capturedBuffer.map((p, index) => (
                                <motion.div
                                    key={`${p.id}-${index}`}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-white/5 border border-white/5 rounded-xl p-2 md:p-3 flex items-center gap-3 group"
                                >
                                    <img src={p.sprite} className="w-10 h-10 md:w-12 md:h-12" alt="" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-bold text-white uppercase truncate">{p.name}</p>
                                        <div className="flex gap-1 mt-1">
                                            {p.types.map((t: any) => (
                                                <span key={t.type.name} className="text-[7px] text-white/40 uppercase">
                                                    {t.type.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFromBuffer(index)}
                                        className="p-2 hover:bg-red-500/20 rounded-lg text-white/10 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>

                {/* Action Footer */}
                {capturedBuffer.length > 0 && (
                    <div className="p-4 border-t border-white/10 bg-black/20">
                        <button
                            onClick={() => {
                                onConfirmCatch(capturedBuffer);
                                setCapturedBuffer([]);
                            }}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-[10px] font-black tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20 text-white"
                        >
                            <CheckCircle2 size={14} /> SEND TO LAB ({capturedBuffer.length})
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
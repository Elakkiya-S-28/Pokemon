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
    const [timeLeft, setTimeLeft] = useState(5);

    const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);

    const spawnNew = useCallback(async () => {
        setStatus('loading');
        setTimeLeft(5);
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

            const randomTop = Math.floor(Math.random() * 40 + 20) + '%';
            const randomLeft = Math.floor(Math.random() * 50 + 10) + '%';

            setPokemon(newPokemon);
            setPos({ top: randomTop, left: randomLeft });
            setStatus('idle');
        } catch (error) {
            console.error("Failed to fetch Pokemon", error);
        }
    }, []);

    useEffect(() => {
        spawnNew();
        return () => { if (spawnTimerRef.current) clearInterval(spawnTimerRef.current); };
    }, [spawnNew]);

    useEffect(() => {
        if (status === 'idle') {
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        spawnNew();
                        return 5;
                    }
                    return prev - 1;
                });
            }, 1000);
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
        <div className="flex-1 flex flex-row h-full overflow-hidden">
            {/* LEFT: WILD AREA */}
            <div className="flex-1 relative bg-gradient-to-b from-black/20 to-transparent">
                {/* Timer Bar */}
                {status === 'idle' && (
                    <div className="absolute top-10 left-10 flex items-center gap-3">
                        <Timer size={14} className="text-white/40" />
                        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: "100%" }}
                                animate={{ width: "0%" }}
                                transition={{ duration: 5, ease: "linear" }}
                                key={pokemon?.id}
                                className="h-full bg-blue-500"
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
                            <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] tracking-widest mb-2 border border-white/10 text-white/70">
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

                {/* Pokeball UI */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
                    {status === 'idle' && (
                        <motion.div onClick={throwBall} className="cursor-pointer flex flex-col items-center group">
                            <Pokeball className="w-16 h-16 group-hover:scale-110 transition-transform" />
                            <p className="text-[9px] tracking-[0.4em] text-white/40 mt-6 group-hover:text-blue-400">TAP TO CAPTURE</p>
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
                            <Pokeball />
                        </motion.div>
                    )}
                </div>
            </div>

            {/* RIGHT SIDEBAR: BUFFER */}
            <div className="w-80 bg-black/40 border-l border-white/10 backdrop-blur-3xl flex flex-col">
                <div className="p-6 border-b border-white/10">
                    <h3 className="text-sm font-black tracking-widest text-white/80 flex items-center gap-2">
                        <Zap size={16} className="text-yellow-400" /> DNA BUFFER
                    </h3>
                    <p className="text-[10px] text-white/30 mt-1 uppercase">Recently secured specimens</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    <AnimatePresence>
                        {capturedBuffer.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                                <Pokeball className="w-12 h-12 grayscale mb-4" />
                                <p className="text-[10px] uppercase tracking-widest">No DNA secured</p>
                            </div>
                        )}
                        {capturedBuffer.map((p, index) => (
                            <motion.div
                                key={`${p.id}-${index}`}
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 50, opacity: 0 }}
                                className="bg-white/5 border border-white/5 rounded-2xl p-3 flex items-center gap-4 group"
                            >
                                <img src={p.sprite} className="w-12 h-12" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-bold text-white uppercase truncate">{p.name}</p>
                                    <p className="text-[8px] text-white/40 uppercase">Level: {Math.floor(Math.random() * 50) + 1}</p>
                                </div>
                                <button
                                    onClick={() => removeFromBuffer(index)}
                                    className="p-2 hover:bg-red-500/20 rounded-lg text-white/20 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {capturedBuffer.length > 0 && (
                    <div className="p-4 border-t border-white/10">
                        <button
                            onClick={() => {
                                onConfirmCatch(capturedBuffer);
                                setCapturedBuffer([]);
                            }}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-[10px] font-black tracking-[0.2em] flex items-center justify-center gap-2 transition-all"
                        >
                            <CheckCircle2 size={14} /> SEND ({capturedBuffer.length})
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};


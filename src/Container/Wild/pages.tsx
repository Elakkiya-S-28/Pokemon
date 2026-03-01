'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Pokemon {
    name: string;
    sprite: string;
    id: number;
}


export const WildScene = ({ onCatch }: { onCatch: (p: Pokemon) => void }) => {
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    const [pos, setPos] = useState({ top: '40%', left: '50%' });
    const [status, setStatus] = useState<'loading' | 'idle' | 'throwing' | 'caught'>('loading');



    const spawnNew = useCallback(async () => {
        setStatus('loading');
        try {
            // Generate random ID between 1 and 151 (Generation 1)
            const randomId = Math.floor(Math.random() * 151) + 1;
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
            const data = await response.json();

            // Inside spawnNew function in WildScene.tsx
            const newPokemon: Pokemon = {
                name: data.name,
                id: data.id,
                sprite: data.sprites.other['official-artwork'].front_default,
                // Add these new fields:
                stats: data.stats, // hp, attack, defense, etc.
                types: data.types, // water, fire, etc.
                abilities: data.abilities,
                height: data.height,
                weight: data.weight,
            };

            const randomTop = Math.floor(Math.random() * 40 + 20) + '%';
            const randomLeft = Math.floor(Math.random() * 60 + 20) + '%';

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

    const throwBall = () => {
        if (status !== 'idle' || !pokemon) return;
        setStatus('throwing');

        setTimeout(() => {
            setStatus('caught');
            // This is where the error was fixed:
            if (typeof onCatch === 'function') {
                onCatch(pokemon);
            }
        }, 1000);
    };

    if (status === 'loading') {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-xl font-mono animate-pulse text-purple-400">SCANNING AREA...</div>
            </div>
        );
    }

    return (
        <div className="flex-1 relative w-full h-full">
            <AnimatePresence>
                {status !== 'caught' && pokemon && (
                    <motion.div
                        style={{ top: pos.top, left: pos.left }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center"
                        exit={{ scale: 0, opacity: 0, rotate: 360 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] tracking-widest mb-2 border border-white/10">
                            #0{pokemon.id} {pokemon.name.toUpperCase()}
                        </div>
                        <motion.img
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            src={pokemon.sprite}
                            className="w-40 h-40 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {status === 'caught' && pokemon && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0410]/80 backdrop-blur-xl z-50"
                >
                    <div className="relative">
                        <motion.div
                            animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute -inset-20 bg-gradient-to-t from-purple-500/20 to-transparent rounded-full blur-3xl"
                        />
                        <Pokeball className="w-24 h-24 animate-bounce" />
                    </div>
                    <h2 className="text-5xl font-black mt-8 text-green-400 italic tracking-tighter">SUCCESS!</h2>
                    <p className="text-white/60 tracking-[0.3em] uppercase text-xs mt-2">
                        {pokemon.name} DNA secured
                    </p>
                    <button
                        onClick={spawnNew}
                        className="mt-12 px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-green-400 hover:scale-105 transition-all"
                    >
                        SCAN NEW AREA
                    </button>
                </motion.div>
            )}

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
                {status === 'idle' && (
                    <motion.div onClick={throwBall} className="cursor-pointer flex flex-col items-center group">
                        <div className="relative">
                            <div className="absolute -inset-4 bg-white/5 rounded-full blur-xl group-hover:bg-red-500/20 transition-colors" />
                            <Pokeball />
                        </div>
                        <p className="text-[10px] tracking-[0.4em] text-white/40 mt-6 group-hover:text-white">INITIATE CATCH</p>
                    </motion.div>
                )}

                {status === 'throwing' && (
                    <motion.div
                        initial={{ y: 0, x: 0, scale: 1 }}
                        animate={{
                            y: `calc(-${100 - parseInt(pos.top)}vh + 120px)`,
                            x: `calc(${parseInt(pos.left) - 50}vw)`,
                            scale: 0.3,
                            rotate: 1080
                        }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <Pokeball />
                    </motion.div>
                )}
            </div>
        </div>
    );
};

const Pokeball = ({ className = "w-16 h-16" }: { className?: string }) => (
    <div className={`${className} rounded-full border-[3px] border-black relative overflow-hidden bg-white shadow-2xl`}>
        <div className="absolute top-0 w-full h-1/2 bg-[#ff1c1c] border-b-[3px] border-black" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-white border-[3px] border-black rounded-full z-10 flex items-center justify-center">
            <div className="w-1/2 h-1/2 bg-gray-200 rounded-full" />
        </div>
    </div>
);
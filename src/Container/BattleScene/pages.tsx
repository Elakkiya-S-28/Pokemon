'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Activity, Shield, Zap, RotateCcw } from 'lucide-react';

interface Pokemon {
    name: string;
    sprite: string;
    id: number;
    stats: { base_stat: number; stat: { name: string } }[];
}

export const BattleScene = ({ collection }: { collection: Pokemon[] }) => {
    const [p1, setP1] = useState<Pokemon | null>(null);
    const [p2, setP2] = useState<Pokemon | null>(null);
    const [status, setStatus] = useState<'selection' | 'battle' | 'finished'>('selection');
    const [hp, setHp] = useState({ p1: 100, p2: 100 });
    const [turn, setTurn] = useState(1);
    const [isAnimating, setIsAnimating] = useState(false);
    const [battleLog, setBattleLog] = useState("Awaiting sequence initiation...");

    const getStat = (p: Pokemon, name: string) => p.stats?.find(s => s.stat.name === name)?.base_stat || 50;

    const startBattle = () => {
        if (!p1 || !p2) return;
        setHp({ p1: getStat(p1, 'hp'), p2: getStat(p2, 'hp') });
        setBattleLog(`Battle: ${p1.name} vs ${p2.name}`);
        setStatus('battle');
    };

    const executeTurn = async () => {
        if (isAnimating || status !== 'battle') return;
        setIsAnimating(true);

        const attacker = turn === 1 ? p1! : p2!;
        const defender = turn === 1 ? p2! : p1!;
        const damage = Math.max(8, Math.floor((getStat(attacker, 'attack') / getStat(defender, 'defense')) * 20));

        setBattleLog(`${attacker.name.toUpperCase()} attacks!`);

        setTimeout(() => {
            setHp(prev => {
                const newHp = {
                    ...prev,
                    [turn === 1 ? 'p2' : 'p1']: Math.max(0, prev[turn === 1 ? 'p2' : 'p1'] - damage)
                };

                if (newHp[turn === 1 ? 'p2' : 'p1'] <= 0) {
                    setStatus('finished');
                    setBattleLog(`${attacker.name.toUpperCase()} wins!`);
                } else {
                    setTurn(turn === 1 ? 2 : 1);
                }
                return newHp;
            });
            setIsAnimating(false);
        }, 600);
    };

    return (
        <div className="flex-1 flex flex-col bg-[#050208] relative w-full h-full overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, #4a22dd 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

            <AnimatePresence mode="wait">
                {status === 'selection' ? (
                    <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 z-10 overflow-y-auto">

                        <h2 className="text-2xl md:text-4xl font-black italic tracking-tighter text-white mb-6 text-center">
                            BATTLE CONFIG
                        </h2>

                        <div className="flex flex-row items-center justify-center gap-4 md:gap-12 mb-8">
                            <SelectionCard p={p1} label="ALPHA" onClear={() => setP1(null)} color="blue" />
                            <div className="p-2 md:p-4 rounded-full bg-white/5 border border-white/10 shrink-0">
                                <Swords className="text-purple-500 w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <SelectionCard p={p2} label="BETA" onClear={() => setP2(null)} color="red" />
                        </div>

                        <div className="w-full max-w-2xl bg-white/5 rounded-3xl border border-white/10 p-3">
                            <p className="text-[10px] text-center mb-2 text-white/30 tracking-widest uppercase">Select from Collection</p>
                            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 max-h-40 md:max-h-60 overflow-y-auto p-2 custom-scrollbar">
                                {collection.map((p, i) => (
                                    <button
                                        key={i}
                                        onClick={() => !p1 ? setP1(p) : (p1.id !== p.id && !p2) && setP2(p)}
                                        className={`p-1 rounded-xl transition-all ${p1?.id === p.id || p2?.id === p.id ? 'bg-purple-500/20 ring-1 ring-purple-500' : 'hover:bg-white/5'}`}
                                    >
                                        <img src={p.sprite} className="w-full aspect-square object-contain" alt={p.name} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {p1 && p2 && (
                            <motion.button
                                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                                onClick={startBattle}
                                className="mt-8 px-10 py-4 bg-blue-600 text-white rounded-2xl font-black tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"
                            >
                                START BATTLE
                            </motion.button>
                        )}
                    </motion.div>
                ) : (
                    <motion.div key="arena" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col relative h-full">

                        {/* THE BATTLE ARENA AREA */}
                        <div className="relative flex-1 w-full overflow-hidden">

                            {/* P2 - TOP RIGHT (ENEMY) */}
                            <div className="absolute top-[10%] right-[5%] md:top-10 md:right-10">
                                <BattlePlatform
                                    p={p2!}
                                    hp={hp.p2}
                                    maxHp={getStat(p2!, 'hp')}
                                    isAttacking={isAnimating && turn === 2}
                                    isHit={isAnimating && turn === 1}
                                    side="right"
                                />
                            </div>

                            {/* P1 - BOTTOM LEFT (PLAYER) */}
                            <div className="absolute bottom-[5%] left-[5%] md:bottom-[15%] md:left-10">
                                <BattlePlatform
                                    p={p1!}
                                    hp={hp.p1}
                                    maxHp={getStat(p1!, 'hp')}
                                    isAttacking={isAnimating && turn === 1}
                                    isHit={isAnimating && turn === 2}
                                    side="left"
                                />
                            </div>
                        </div>

                        {/* BOTTOM HUD / LOGS */}
                        <div className="h-28 md:h-32 bg-black/90 border-t border-white/10 backdrop-blur-xl p-3 md:p-4 flex gap-3 md:gap-4 items-center shrink-0 z-50">
                            <div className="flex-1 h-full bg-white/5 rounded-xl md:rounded-2xl p-3 flex items-center border border-white/5">
                                <p className="text-sm md:text-xl font-black italic text-white uppercase tracking-tighter leading-tight line-clamp-2">
                                    {battleLog}
                                </p>
                            </div>

                            <div className="w-28 md:w-48 h-full">
                                {status === 'battle' ? (
                                    <button
                                        disabled={isAnimating}
                                        onClick={executeTurn}
                                        className="w-full h-full bg-white text-black font-black text-sm md:text-xl rounded-xl md:rounded-2xl active:scale-95 transition-all disabled:opacity-30"
                                    >
                                        {isAnimating ? "..." : "STRIKE"}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setStatus('selection')}
                                        className="w-full h-full bg-green-500 text-black font-black text-sm rounded-xl md:rounded-2xl flex items-center justify-center gap-2"
                                    >
                                        <RotateCcw size={16} /> <span className="hidden md:inline">REMATCH</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const BattlePlatform = ({ p, hp, maxHp, isAttacking, isHit, side }: any) => {
    const healthPct = (hp / maxHp) * 100;

    return (
        <div className={`flex flex-col ${side === 'left' ? 'items-start' : 'items-end'}`}>
            {/* Health Bar UI */}
            <div className="bg-black/80 border border-white/20 p-2 md:p-3 rounded-xl w-40 sm:w-48 md:w-56 mb-2 md:mb-4 shadow-2xl backdrop-blur-md">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-[8px] md:text-[10px] font-black text-white uppercase tracking-tighter truncate max-w-[70%]">{p.name}</span>
                    <span className="text-[8px] text-white/40 font-mono italic">LV.100</span>
                </div>
                <div className="h-1 md:h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: '100%' }}
                        animate={{ width: `${healthPct}%` }}
                        className={`h-full rounded-full ${healthPct > 50 ? 'bg-green-400' : healthPct > 20 ? 'bg-yellow-400' : 'bg-red-500'}`}
                    />
                </div>
            </div>

            {/* Animation Container */}
            <motion.div
                animate={
                    isAttacking
                        ? { x: side === 'left' ? [0, 60, 0] : [0, -60, 0], y: side === 'left' ? [0, -20, 0] : [0, 20, 0] }
                        : isHit
                            ? { x: [0, -5, 5, -5, 0], filter: ['brightness(1)', 'brightness(3)', 'brightness(1)'] }
                            : { y: [0, -5, 0] }
                }
                transition={isAttacking ? { duration: 0.4 } : isHit ? { duration: 0.2 } : { duration: 3, repeat: Infinity }}
                className="relative"
            >
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 md:w-24 h-4 bg-black/50 blur-lg rounded-full" />

                <img
                    src={p.sprite}
                    className={`w-28 h-28 sm:w-36 sm:h-36 md:w-56 md:h-56 object-contain drop-shadow-2xl ${side === 'left' ? '' : 'scale-x-[-1]'}`}
                    alt={p.name}
                />
            </motion.div>
        </div>
    );
};

const SelectionCard = ({ p, label, onClear, color }: any) => (
    <div className="flex flex-col items-center gap-1 md:gap-2">
        <span className="text-[7px] md:text-[8px] font-black text-white/20 tracking-[0.2em] uppercase">{label}</span>
        <div
            onClick={onClear}
            className={`w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-2xl md:rounded-3xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-all ${p ? (color === 'blue' ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'border-red-500 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.1)]')
                : 'border-white/10 hover:border-white/20'
                }`}
        >
            {p ? (
                <motion.img initial={{ scale: 0 }} animate={{ scale: 1 }} src={p.sprite} className="w-[80%] h-[80%] object-contain" />
            ) : (
                <div className="text-white/10 text-[8px] font-bold text-center px-1">DNA REQ</div>
            )}
        </div>
        <p className="text-[9px] md:text-[10px] font-black text-white uppercase truncate w-20 text-center">{p ? p.name : '---'}</p>
    </div>
);
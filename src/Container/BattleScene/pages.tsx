'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Activity, Shield, Zap } from 'lucide-react';

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
            setHp(prev => ({
                ...prev,
                [turn === 1 ? 'p2' : 'p1']: Math.max(0, prev[turn === 1 ? 'p2' : 'p1'] - damage)
            }));

            if (hp[turn === 1 ? 'p2' : 'p1'] - damage <= 0) {
                setStatus('finished');
                setBattleLog(`${attacker.name.toUpperCase()} wins the simulation!`);
            } else {
                setTurn(turn === 1 ? 2 : 1);
            }
            setIsAnimating(false);
        }, 600);
    };

    return (
        <div className="flex-1 flex flex-col bg-[#050208] relative min-h-[600px] w-full overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, #4a22dd 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

            <AnimatePresence mode="wait">
                {status === 'selection' ? (
                    <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col items-center justify-center p-8 z-10">
                        <h2 className="text-4xl font-black italic tracking-tighter text-white mb-8">BATTLE CONFIGURATOR</h2>

                        <div className="flex items-center gap-8 mb-8">
                            <SelectionCard p={p1} label="ALPHA (P1)" onClear={() => setP1(null)} color="blue" />
                            <div className="p-4 rounded-full bg-white/5 border border-white/10"><Swords className="text-purple-500" /></div>
                            <SelectionCard p={p2} label="BETA (P2)" onClear={() => setP2(null)} color="red" />
                        </div>

                        <div className="grid grid-cols-4 md:grid-cols-6 gap-3 max-h-48 overflow-y-auto p-4 bg-white/5 rounded-3xl border border-white/10">
                            {collection.map((p, i) => (
                                <button key={i} onClick={() => !p1 ? setP1(p) : p1.id !== p.id && setP2(p)}
                                    className="p-1 hover:scale-110 transition-transform">
                                    <img src={p.sprite} className="w-14 h-14" alt={p.name} />
                                </button>
                            ))}
                        </div>

                        {p1 && p2 && (
                            <button onClick={startBattle} className="mt-8 px-10 py-3 bg-blue-600 rounded-full font-black tracking-widest text-white shadow-xl">
                                INITIATE COMBAT
                            </button>
                        )}
                    </motion.div>
                ) : (
                    <motion.div key="arena" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col relative">

                        {/* THE BATTLE ARENA AREA */}
                        <div className="relative flex-1 w-full max-w-5xl mx-auto">

                            {/* P2 - TOP RIGHT (ENEMY) */}
                            <div className="absolute top-10 right-10">
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
                            <div className="absolute bottom-40 left-10">
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
                        <div className="h-32 bg-black/90 border-t border-white/10 backdrop-blur-xl p-4 flex gap-4 items-center shrink-0 z-50">
                            <div className="flex-1 bg-white/5 rounded-xl p-4 border border-white/5">
                                <p className="text-xl font-black italic text-white uppercase tracking-tighter">
                                    {battleLog}
                                </p>
                            </div>

                            <div className="w-48 h-full">
                                {status === 'battle' ? (
                                    <button
                                        disabled={isAnimating}
                                        onClick={executeTurn}
                                        className="w-full h-full bg-white text-black font-black rounded-xl hover:bg-blue-400 disabled:opacity-50 transition-all"
                                    >
                                        {isAnimating ? "WAIT..." : "STRIKE"}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setStatus('selection')}
                                        className="w-full h-full bg-green-500 text-black font-black rounded-xl"
                                    >
                                        FINISH
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

// --- PLATFORM COMPONENT (THE FIX) ---
const BattlePlatform = ({ p, hp, maxHp, isAttacking, isHit, side }: any) => {
    const healthPct = (hp / maxHp) * 100;

    return (
        <div className={`flex flex-col ${side === 'left' ? 'items-start' : 'items-end'}`}>
            {/* Health Bar UI */}
            <div className="bg-black/80 border border-white/20 p-3 rounded-xl w-56 mb-4 shadow-2xl backdrop-blur-md">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-black text-white uppercase tracking-tighter">{p.name}</span>
                    <span className="text-[9px] text-white/40 font-mono italic">LV.100</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: '100%' }}
                        animate={{ width: `${healthPct}%` }}
                        className={`h-full ${healthPct > 50 ? 'bg-green-400' : healthPct > 20 ? 'bg-yellow-400' : 'bg-red-500'}`}
                    />
                </div>
                <div className="text-[8px] text-right mt-1 font-mono text-white/60">{Math.ceil(hp)} / {maxHp}</div>
            </div>

            {/* Animation Logic */}
            <motion.div
                animate={
                    isAttacking
                        ? { x: side === 'left' ? 80 : -80, y: side === 'left' ? -40 : 40 }
                        : isHit
                            ? { x: [0, -5, 5, -5, 0], filter: ['brightness(1)', 'brightness(3)', 'brightness(1)'] }
                            : { y: [0, -8, 0] }
                }
                transition={isAttacking ? { duration: 0.25 } : isHit ? { duration: 0.2 } : { duration: 3, repeat: Infinity }}
                className="relative"
            >
                {/* Platform Shadow */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-black/50 blur-lg rounded-full" />

                <img
                    src={p.sprite}
                    className={`w-40 h-40 md:w-56 md:h-56 object-contain drop-shadow-2xl ${side === 'left' ? '' : 'scale-x-[-1]'}`}
                    alt={p.name}
                />
            </motion.div>
        </div>
    );
};

const SelectionCard = ({ p, label, onClear, color }: any) => (
    <div className="flex flex-col items-center gap-2">
        <span className="text-[8px] font-black text-white/20 tracking-[0.4em]">{label}</span>
        <div
            onClick={onClear}
            className={`w-32 h-32 rounded-3xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-all ${p ? (color === 'blue' ? 'border-blue-500 bg-blue-500/10' : 'border-red-500 bg-red-500/10')
                    : 'border-white/10 hover:border-white/20'
                }`}
        >
            {p ? (
                <motion.img initial={{ scale: 0 }} animate={{ scale: 1 }} src={p.sprite} className="w-24 h-24" />
            ) : (
                <div className="text-white/5 text-[10px] font-bold">DNA AWAITING</div>
            )}
        </div>
        {p && <p className="text-[10px] font-black text-white uppercase">{p.name}</p>}
    </div>
);
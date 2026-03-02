'use client';
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dna, ArrowRight, Beaker } from 'lucide-react';
import { Pokemon } from '@/src/Component/interface/pages';
import { SpecimenSlot } from '@/src/Component/MainScreen/pages';

interface LabProps {
    capturedPokemon: Pokemon[];
}

export const LabScene = ({ capturedPokemon }: LabProps) => {
    const [slotA, setSlotA] = useState<Pokemon | null>(null);
    const [slotB, setSlotB] = useState<Pokemon | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const hybrid = useMemo(() => {
        if (!slotA || !slotB) return null;

        const nameA = slotA.name.substring(0, Math.ceil(slotA.name.length / 2));
        const nameB = slotB.name.substring(Math.floor(slotB.name.length / 2));
        const hybridName = nameA + nameB;

        const fusedStats = slotA.stats.map((s, i) => ({
            name: s.stat.name,
            value: Math.floor((s.base_stat + slotB.stats[i].base_stat) / 1.5),
        }));

        const type1 = slotA.types[0].type.name;
        const type2 = slotB.types[0].type.name;
        const uniqueTypes = Array.from(new Set([type1, type2]));

        const avgHeight = (slotA.height + slotB.height) / 2;
        const avgWeight = (slotA.weight + slotB.weight) / 2;

        return {
            name: hybridName,
            types: uniqueTypes,
            stats: fusedStats,
            height: avgHeight,
            weight: avgWeight,
            abilities: [slotA.abilities[0].ability.name, slotB.abilities[0].ability.name]
        };
    }, [slotA, slotB]);

    const handleFuse = () => {
        setIsProcessing(true);
        setTimeout(() => setIsProcessing(false), 2000);
    };

    return (
        <div className="flex-1 p-6 flex flex-col lg:flex-row gap-8 overflow-hidden bg-[#050208]">
            {/* LEFT: SELECTION PANEL */}
            <div className="w-full lg:w-1/3 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                <h2 className="text-xl font-black italic text-purple-400 flex items-center gap-2 mb-4">
                    <Beaker size={20} /> GENETIC INVENTORY
                </h2>

                {capturedPokemon.length === 0 ? (
                    <div className="p-8 border border-dashed border-white/10 rounded-2xl text-center text-white/30 text-sm">
                        No DNA samples found. Catch Pokemon in the wild first.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {capturedPokemon.map((p, idx) => (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                key={`${p.id}-${idx}`}
                                onClick={() => {
                                    if (!slotA) setSlotA(p);
                                    else if (!slotB) setSlotB(p);
                                    else { setSlotA(p); setSlotB(null); }
                                }}
                                className={`p-3 rounded-xl border transition-all text-left ${slotA?.id === p.id || slotB?.id === p.id
                                    ? 'bg-purple-500/20 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                                    : 'bg-white/5 border-white/10 hover:border-white/30'
                                    }`}
                            >
                                <img src={p.sprite} className="w-full aspect-square object-contain" alt={p.name} />
                                <p className="text-[10px] font-bold uppercase tracking-tighter mt-2 text-white/80 truncate">
                                    {p.name}
                                </p>
                            </motion.button>
                        ))}
                    </div>
                )}
            </div>

            {/* CENTER: FUSION CHAMBER */}
            <div className="flex-1 flex flex-col items-center justify-center relative bg-gradient-to-b from-purple-900/10 to-transparent rounded-[3rem] border border-white/5 p-8">
                <div className="flex items-center gap-4 mb-12">
                    <SpecimenSlot p={slotA} label="ALPHA" onClear={() => setSlotA(null)} />
                    <div className="flex flex-col items-center">
                        <motion.div
                            animate={isProcessing ? { rotate: 360 } : {}}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                            <Dna size={40} className={isProcessing ? "text-green-400" : "text-white/20"} />
                        </motion.div>
                        <ArrowRight className="text-white/20" />
                    </div>
                    <SpecimenSlot p={slotB} label="BETA" onClear={() => setSlotB(null)} />
                </div>

                {slotA && slotB && !isProcessing && !hybrid && (
                    <button
                        onClick={handleFuse}
                        className="px-8 py-3 bg-purple-600 hover:bg-purple-500 rounded-full font-bold text-sm tracking-widest animate-pulse"
                    >
                        INITIATE FUSION
                    </button>
                )}

                <AnimatePresence mode="wait">
                    {isProcessing ? (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ x: '-100%' }} animate={{ x: '0%' }} transition={{ duration: 2 }}
                                    className="w-full h-full bg-green-500"
                                />
                            </div>
                            <p className="text-xs font-mono text-green-400 animate-pulse">SPLICING SEQUENCES...</p>
                        </motion.div>
                    ) : hybrid && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="w-full grid grid-cols-1 md:grid-cols-2 gap-8"
                        >
                            {/* Hybrid Visual */}
                            <div className="flex flex-col items-center justify-center bg-black/40 rounded-3xl p-6 border border-white/10 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <motion.div
                                    animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}
                                    className="relative z-10"
                                >
                                    <div className="relative">
                                        <img src={slotA?.sprite} className="w-48 h-48 opacity-50 absolute inset-0 blur-sm" alt="ghost" />
                                        <img src={slotB?.sprite} className="w-48 h-48 relative z-10 mix-blend-screen" alt="fusion" />
                                    </div>
                                </motion.div>
                                <h3 className="text-3xl font-black italic text-white mt-4 uppercase tracking-tighter">
                                    {hybrid.name}
                                </h3>
                                <div className="flex gap-2 mt-2">
                                    {hybrid.types.map(t => (
                                        <span key={t} className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-purple-300">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Hybrid Data */}
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] text-white/40 font-bold tracking-[0.2em] mb-4">GENETIC STABILITY</p>
                                    <div className="space-y-3">
                                        {hybrid.stats.map(s => (
                                            <div key={s.name}>
                                                <div className="flex justify-between text-[10px] mb-1">
                                                    <span className="text-white/60 uppercase">{s.name}</span>
                                                    <span className="text-purple-400">{s.value}</span>
                                                </div>
                                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }} animate={{ width: `${(s.value / 200) * 100}%` }}
                                                        className="h-full bg-gradient-to-r from-purple-600 to-blue-400"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                        <p className="text-[9px] text-white/40 font-bold uppercase mb-1">Abilities</p>
                                        <p className="text-xs text-white capitalize">{hybrid.abilities.join(' / ')}</p>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                        <p className="text-[9px] text-white/40 font-bold uppercase mb-1">Physicals</p>
                                        <p className="text-xs text-white">{hybrid.height / 10}m / {hybrid.weight / 10}kg</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

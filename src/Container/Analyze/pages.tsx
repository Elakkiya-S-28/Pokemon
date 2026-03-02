'use client';
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
    if (!pokemon) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-white/20">
                <Activity size={64} className="mb-4 opacity-20 animate-pulse" />
                <p className="tracking-[0.5em] font-light">AWAITING DNA SAMPLE...</p>
            </div>
        );
    }

    return (
        <div className="flex-1 p-6 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto w-full">

            {/* LEFT COLUMN: Visual DNA Scan (4 cols) */}
            <div className="lg:col-span-5 space-y-6">
                <div className="relative aspect-square bg-gradient-to-b from-white/5 to-transparent rounded-3xl border border-white/10 overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 pointer-events-none" />
                    <div className="absolute inset-0 bg-[grid-white/5] [mask-image:radial-gradient(white,transparent)]" />

                    <motion.img
                        initial={{ scale: 0.8, filter: 'brightness(0)' }}
                        animate={{ scale: 1, filter: 'brightness(1)' }}
                        src={pokemon.sprite}
                        className="w-4/5 h-4/5 relative z-10 drop-shadow-[0_0_30px_rgba(74,222,128,0.3)]"
                    />

                    {/* HUD Scan Line */}
                    <motion.div
                        animate={{ y: [-150, 150] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute w-full h-1/2 bg-gradient-to-b from-transparent via-green-500/10 to-transparent border-t border-green-500/40 z-20"
                    />
                </div>

                {/* Attributes Grid */}
                <div className="grid grid-cols-3 gap-4">
                    <AttributeBox label="HEIGHT" value={`${pokemon.height / 10}m`} />
                    <AttributeBox label="WEIGHT" value={`${pokemon.weight / 10}kg`} />
                    <AttributeBox label="INDEX" value={`#${pokemon.id}`} />
                </div>
            </div>

            {/* RIGHT COLUMN: Biological Data (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
                <div>
                    <div className="flex gap-2 mb-2">
                        {pokemon.types.map((t: any) => (
                            <span key={t.type.name} className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold tracking-widest uppercase border border-white/10">
                                {t.type.name}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-7xl font-black uppercase tracking-tighter leading-none italic">
                        {pokemon.name}
                    </h1>
                </div>

                {/* Stat Distribution */}
                <div className="space-y-4 bg-white/5 p-6 rounded-3xl border border-white/10">
                    <h3 className="text-xs tracking-[0.3em] text-white/40 font-bold mb-6">STATISTICAL DISTRIBUTION</h3>
                    <div className="space-y-5">
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
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <h3 className="text-[10px] tracking-[0.3em] text-green-400 font-bold">ABILITIES</h3>
                        <div className="flex flex-wrap gap-2">
                            {pokemon.abilities.map((a: any) => (
                                <div key={a.ability.name} className="px-4 py-2 bg-black/40 border border-white/5 rounded-lg text-xs capitalize">
                                    {a.ability.name.replace('-', ' ')}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-[10px] tracking-[0.3em] text-green-400 font-bold">DNA INTEGRITY</h3>
                        <div className="h-10 flex items-end gap-1">
                            {Array.from({ length: 20 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ height: [10, Math.random() * 30 + 10, 10] }}
                                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.05 }}
                                    className="flex-1 bg-green-500/40 rounded-t-sm"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

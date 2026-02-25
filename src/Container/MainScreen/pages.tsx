'use client';
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Home, Beaker, Zap, BarChart2, Library, MousePointer2 } from 'lucide-react';
import { CharacterSilhouette, GrassBlade } from './helper';



export const MainScreen = () => {
    const grassBlades = useMemo(() => Array.from({ length: 120 }), []);

    return (
        <div className="relative min-h-screen w-full bg-[#1a0b2e] overflow-hidden text-white font-sans">

            {/* 1. LAYER: Background Gradient & Mountains */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0410] via-[#4d1a52] to-[#1a0b2e] opacity-90" />

            {/* Mountain Silhouettes (Simplified) */}
            <div className="absolute bottom-0 w-full h-[40vh] bg-[#12071d] clip-path-mountains opacity-40"
                style={{ clipPath: 'polygon(0% 100%, 20% 70%, 40% 85%, 60% 60%, 80% 80%, 100% 100%)' }} />

            {/* 2. LAYER: UI Elements (Navigation) */}
            <nav className="relative z-50 flex items-center justify-between px-12 py-8">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 to-purple-600 shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                    <span className="text-xl font-medium tracking-widest uppercase opacity-80">DNA Lab</span>
                </div>

                <div className="flex items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-2 py-1">
                    <NavItem icon={<Home size={18} />} label="Home" active />
                    <NavItem icon={<Beaker size={18} />} label="Lab" />
                    <NavItem icon={<Zap size={18} />} label="Wild" />
                    <NavItem icon={<BarChart2 size={18} />} label="Analyze" />
                    <NavItem icon={<Library size={18} />} label="Collection" />
                </div>

                <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-green-400 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    SYSTEM ACTIVE
                </div>
            </nav>

            {/* 3. LAYER: Main Title (Mid-ground) */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] text-center select-none">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[120px] font-extralight tracking-[0.4em] leading-none mb-4 opacity-90"
                    style={{ fontFamily: 'var(--font-inter), sans-serif' }}
                >
                    POKÉMON DNA <br /> LAB
                </motion.h1>
                <p className="text-sm tracking-[0.5em] text-white/40 uppercase font-light">
                    Where Legends Evolve
                </p>
            </div>

            {/* 4. LAYER: Foreground (Characters & Grass) */}
            <div className="absolute bottom-0 left-0 w-full h-32 z-30 pointer-events-none">

                {/* Ash and Friends Walking */}
                <div className="absolute bottom-10 left-12 flex items-end gap-12">
                    <CharacterSilhouette delay={0} scale={1.1} /> {/* Ash */}
                    <CharacterSilhouette delay={0.2} scale={1} />   {/* Friend 1 */}
                    <CharacterSilhouette delay={0.4} scale={0.9} /> {/* Friend 2 */}

                    {/* Small Pikachu Silhouette */}
                    <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.3, repeat: Infinity }}
                        className="w-6 h-6 bg-black rounded-full mb-2"
                    />
                </div>

                {/* 120 Blades of Swaying Grass */}
                {grassBlades.map((_, i) => (
                    <GrassBlade key={i} index={i} />
                ))}
            </div>

            {/* 5. Footer Interaction */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-50 z-40">
                <div className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center p-1">
                    <div className="w-full h-[2px] bg-white/60 rotate-0" /> {/* Pokeball line */}
                </div>
                <span className="text-[10px] tracking-[0.3em] font-light uppercase">Scroll to Explore</span>
            </div>

            {/* Subtle Vignette Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)] pointer-events-none" />
        </div>
    );
};

const NavItem = ({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
    <div className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all cursor-pointer ${active ? 'bg-purple-600/30 text-white' : 'text-white/40 hover:text-white'}`}>
        {icon}
        <span className="text-xs font-medium tracking-wide">{label}</span>
    </div>
);
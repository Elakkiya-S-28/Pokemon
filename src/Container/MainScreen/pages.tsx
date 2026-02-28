'use client';
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Home, Beaker, Zap, BarChart2, Library } from 'lucide-react';
import { WalkingSprite, GrassBlade } from './helper';
export const MainScreen = () => {
    const grassBlades = useMemo(() => Array.from({ length: 120 }), []);

    return (
        <div className="relative min-h-screen w-full bg-[#0a0410] overflow-hidden text-white font-sans flex flex-col">

            {/* 1. LAYER: Background Atmosphere */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0410] via-[#2d1244] to-[#1a0b2e] opacity-90" />
            <div className="absolute bottom-0 w-full h-[35vh] bg-[#0a0410] opacity-50"
                style={{ clipPath: 'polygon(0% 100%, 15% 70%, 33% 85%, 50% 60%, 66% 85%, 85% 70%, 100% 100%)' }} />

            {/* 2. LAYER: Navigation */}
            <nav className="relative z-50 flex items-center justify-between px-12 py-8 w-full">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 to-purple-600 shadow-[0_0_20px_rgba(168,85,247,0.4)]" />
                    <span className="text-xl font-bold tracking-[0.2em] uppercase">DNA LAB</span>
                </div>

                <div className="hidden md:flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-1">
                    <NavItem icon={<Home size={18} />} label="Home" active />
                    <NavItem icon={<Beaker size={18} />} label="Lab" />
                    <NavItem icon={<Zap size={18} />} label="Wild" />
                    <NavItem icon={<BarChart2 size={18} />} label="Analyze" />
                    <NavItem icon={<Library size={18} />} label="Collection" />
                </div>

                <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-green-400 font-mono">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    SYSTEM ACTIVE
                </div>
            </nav>

            {/* 3. LAYER: Main Title */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center select-none px-4">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2 }}
                    className="text-6xl md:text-9xl font-extralight tracking-[0.4em] leading-tight mb-4"
                >
                    POKÉMON DNA <br /> <span className="font-bold">LAB</span>
                </motion.h1>

                <div className="overflow-hidden py-2">
                    <motion.p
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        className="text-xs md:text-sm tracking-[0.8em] text-white/40 uppercase font-light"
                    >
                        Where Legends Evolve
                    </motion.p>
                </div>
            </div>

            {/* 4. LAYER: Foreground (Walking Animation) */}
            <div className="absolute bottom-0 left-0 w-full h-100 pointer-events-none">

                {/* Sprites walking at different staggered delays */}
                {/* Offset creates the "Follower" effect for Pikachu */}

                {/* Group 1 */}
                <WalkingSprite type="brock" delay={6} speed={18} scale={1.1} />
                <WalkingSprite type="misty" delay={3} speed={18} scale={1} />

                {/* Ash and Pikachu following close */}
                <WalkingSprite type="ash" delay={0} speed={18} scale={1.05} />
                <WalkingSprite type="pikachu" delay={0.4} speed={18} scale={0.7} />

                {/* Grass Foreground */}
                <div className="absolute bottom-0 w-full flex justify-center items-end h-12 z-0">
                    {grassBlades.map((_, i) => (
                        <GrassBlade key={i} index={i} />
                    ))}
                </div>
            </div>

            {/* Cinematic Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.6)_100%)] pointer-events-none" />
        </div>
    );
};

const NavItem = ({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
    <div className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all cursor-pointer ${active ? 'bg-purple-600/40 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
        {icon}
        <span className="text-[10px] font-bold tracking-widest uppercase">{label}</span>
    </div>
);

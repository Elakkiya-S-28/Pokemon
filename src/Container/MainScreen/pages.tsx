'use client';
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Beaker, Zap, BarChart2, Library } from 'lucide-react';
import { WalkingSprite, GrassBlade } from './helper';
import { WildScene } from '../Wild/pages';
import { CollectionView } from '../Collection/pages';
import { AnalyzeView } from '../Analyze/pages';


export const MainScreen = () => {
    const [activeTab, setActiveTab] = useState('Home');
    const [collection, setCollection] = useState<any[]>([]); // State to hold caught Pokémon
    const [analyzingPoke, setAnalyzingPoke] = useState<any>(null); // State for the current analysis subject

    const handleCatch = (pokemon: any) => {
        setCollection(prev => [pokemon, ...prev]);
        setAnalyzingPoke(pokemon); // This makes Analyze work!
        setActiveTab('Analyze');    // Automatically switch tabs
    };

    const addPokemonToCollection = (pokemon: any) => {
        setCollection(prev => [...prev, pokemon]);
    };

    const grassBlades = useMemo(() => Array.from({ length: 120 }), []);

    // Tab content mapping
    const renderContent = () => {
        switch (activeTab) {
            case 'Wild': return <WildScene onCatch={addPokemonToCollection} />;
            case 'Lab': return <Placeholder title="DNA SEQUENCER" subtitle="Analyzing Genetic Material..." />;
            case 'Analyze': return <AnalyzeView pokemon={analyzingPoke} />;
            case 'Collection': return <CollectionView
                items={collection}
                onSelect={(p) => {
                    setAnalyzingPoke(p);
                    setActiveTab('Analyze');
                }}
            />;
            default: return (
                <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center">
                    <motion.h1
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-6xl md:text-9xl font-extralight tracking-[0.4em] leading-tight mb-4"
                    >
                        POKÉMON DNA <br /> <span className="font-bold">LAB</span>
                    </motion.h1>
                    <p className="text-xs md:text-sm tracking-[0.8em] text-white/40 uppercase font-light">
                        Where Legends Evolve
                    </p>
                </div>
            );
        }
    };

    return (
        <div className="relative min-h-screen w-full bg-[#0a0410] overflow-hidden text-white font-sans flex flex-col">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0410] via-[#2d1244] to-[#1a0b2e] opacity-90" />

            {/* Navigation */}
            <nav className="relative z-[100] flex items-center justify-between px-12 py-8 w-full">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 to-purple-600" />
                    <span className="text-xl font-bold tracking-[0.2em]">DNA LAB</span>
                </div>

                <div className="hidden md:flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-1">
                    <NavItem icon={<Home size={18} />} label="Home" active={activeTab === 'Home'} onClick={() => setActiveTab('Home')} />
                    <NavItem icon={<Beaker size={18} />} label="Lab" active={activeTab === 'Lab'} onClick={() => setActiveTab('Lab')} />
                    <NavItem icon={<Zap size={18} />} label="Wild" active={activeTab === 'Wild'} onClick={() => setActiveTab('Wild')} />
                    <NavItem icon={<BarChart2 size={18} />} label="Analyze" active={activeTab === 'Analyze'} onClick={() => setActiveTab('Analyze')} />
                    <NavItem icon={<Library size={18} />} label="Collection" active={activeTab === 'Collection'} onClick={() => setActiveTab('Collection')} />
                </div>

                <div className="text-[10px] tracking-[0.2em] text-green-400 font-mono flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    {activeTab.toUpperCase()} ACTIVE
                </div>
            </nav>

            {/* Main Dynamic Content */}
            <main className="relative flex-1 flex flex-col">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                        className="flex-1 flex flex-col"
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Foreground (Only show on Home) */}
            {activeTab === 'Home' && (
                <div className="absolute bottom-0 left-0 w-full h-40 pointer-events-none">
                    <WalkingSprite type="brock" delay={6} speed={18} scale={1.1} />
                    <WalkingSprite type="misty" delay={3} speed={18} scale={1} />
                    <WalkingSprite type="ash" delay={0} speed={18} scale={1.05} />
                    <WalkingSprite type="pikachu" delay={0.4} speed={18} scale={0.7} />
                    <div className="absolute bottom-0 w-full flex justify-center items-end h-12">
                        {grassBlades.map((_, i) => <GrassBlade key={i} index={i} />)}
                    </div>
                </div>
            )}
        </div>
    );
};

const NavItem = ({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all ${active ? 'bg-purple-600 text-white shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
    >
        {icon}
        <span className="text-[10px] font-bold tracking-widest uppercase">{label}</span>
    </button>
);

const Placeholder = ({ title, subtitle }: { title: string, subtitle: string }) => (
    <div className="flex-1 flex flex-col items-center justify-center border border-white/5 m-12 rounded-3xl bg-black/20 backdrop-blur-sm">
        <h2 className="text-4xl font-bold tracking-tighter mb-2">{title}</h2>
        <p className="text-purple-400 font-mono text-sm animate-pulse">{subtitle}</p>
    </div>
);
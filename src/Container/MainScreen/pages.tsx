'use client';
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Beaker, Zap, BarChart2, Library, Swords, Menu, X } from 'lucide-react';
import { WalkingSprite, GrassBlade } from './helper';
import { WildScene } from '../Wild/pages';
import { CollectionView } from '../Collection/pages';
import { AnalyzeView } from '../Analyze/pages';
import { NavItem } from '@/src/Component/MainScreen/pages';
import { LabScene } from '../Lab/pages';
import { BattleScene } from '../BattleScene/pages';

export interface Pokemon {
    name: string;
    sprite: string;
    id: number;
    stats: { base_stat: number; stat: { name: string } }[];
    types: { type: { name: string } }[];
    abilities: { ability: { name: string } }[];
    height: number;
    weight: number;
}

export const MainScreen = () => {
    const [activeTab, setActiveTab] = useState('Home');
    const [collection, setCollection] = useState<any[]>([]);
    const [analyzingPoke, setAnalyzingPoke] = useState<any>(null);

    const removeItemFromCollection = (uniqueId: number, index: number) => {
        setCollection(prev => prev.filter((_, i) => i !== index));
        if (analyzingPoke && collection[index]?.id === analyzingPoke.id) {
            setAnalyzingPoke(null);
        }
    };

    const addPokemonToCollection = (pokemon: any) => {
        setCollection(prev => [...pokemon, ...prev]);
        setAnalyzingPoke(pokemon[0]);
    };

    const grassBlades = useMemo(() => Array.from({ length: 60 }), []); // Reduced for mobile performance

    const renderContent = () => {
        switch (activeTab) {
            case 'Wild': return <WildScene onConfirmCatch={addPokemonToCollection} />;
            case 'Lab': return <LabScene capturedPokemon={collection} />;
            case 'Analyze': return <AnalyzeView pokemon={analyzingPoke} />;
            case 'Collection': return <CollectionView
                items={collection}
                onSelect={(p) => {
                    setAnalyzingPoke(p);
                    setActiveTab('Analyze');
                }}
                onRemove={removeItemFromCollection}
            />;
            case 'Battle': return <BattleScene collection={collection} />;
            default: return (
                <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-9xl font-black tracking-tighter leading-tight mb-4 uppercase italic"
                    >
                        POKÉMON <br /> <span className="text-purple-500">DNA LAB</span>
                    </motion.h1>
                    <p className="text-[10px] md:text-sm tracking-[0.4em] md:tracking-[0.8em] text-white/40 uppercase font-light max-w-xs md:max-w-none">
                        Advanced Genetic Evolution & Combat Terminal
                    </p>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setActiveTab('Wild')}
                        className="mt-8 px-8 py-3 bg-white text-black text-xs font-bold rounded-full md:hidden"
                    >
                        START DISCOVERY
                    </motion.button>
                </div>
            );
        }
    };

    const navItems = [
        { id: 'Home', icon: <Home size={20} />, label: 'Home' },
        { id: 'Wild', icon: <Zap size={20} />, label: 'Wild' },
        { id: 'Lab', icon: <Beaker size={20} />, label: 'Lab' },
        { id: 'Battle', icon: <Swords size={20} />, label: 'Battle' },
        { id: 'Collection', icon: <Library size={20} />, label: 'Vault' },
        { id: 'Analyze', icon: <BarChart2 size={20} />, label: 'Data' },
    ];

    return (
        <div className="relative h-screen w-full bg-[#0a0410] overflow-hidden text-white font-sans flex flex-col">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0410] via-[#1a0b2e] to-[#0a0410] opacity-90" />

            {/* TOP HEADER: Mobile & Desktop */}
            <nav className="relative z-[100] flex items-center justify-between px-6 md:px-12 py-4 md:py-8 w-full shrink-0">
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-gradient-to-tr from-orange-400 to-purple-600 shadow-lg shadow-purple-500/20" />
                    <span className="text-lg md:text-xl font-black tracking-tighter italic">POKÉ-DNA</span>
                </div>

                {/* Desktop Nav: Only visible on MD+ */}
                <div className="hidden md:flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-1">
                    {navItems.map((item) => (
                        <NavItem
                            key={item.id}
                            icon={item.icon}
                            label={item.label}
                            active={activeTab === item.id}
                            onClick={() => setActiveTab(item.id)}
                        />
                    ))}
                </div>

                <div className="text-[9px] md:text-[10px] tracking-[0.2em] text-green-400 font-mono flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="hidden sm:inline">{activeTab.toUpperCase()} ACTIVE</span>
                    <span className="sm:hidden">{activeTab.toUpperCase()}</span>
                </div>
            </nav>

            {/* Main Dynamic Content Area */}
            <main className="relative flex-1 flex flex-col overflow-hidden pb-20 md:pb-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                        className="flex-1 flex flex-col h-full overflow-y-auto md:overflow-hidden"
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* BOTTOM NAVIGATION: Only visible on Mobile (sm) */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full bg-black/80 backdrop-blur-2xl border-t border-white/10 z-[110] px-2 py-3">
                <div className="flex justify-around items-center">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === item.id ? 'text-purple-400' : 'text-white/40'
                                }`}
                        >
                            {item.icon}
                            <span className="text-[8px] uppercase font-bold tracking-widest">{item.label}</span>
                            {activeTab === item.id && (
                                <motion.div layoutId="nav-dot" className="w-1 h-1 bg-purple-400 rounded-full" />
                            )}
                        </button>
                    ))}
                </div>
            </nav>

            {/* Home Scene Extras */}
            {activeTab === 'Home' && (
                <div className="absolute bottom-20 md:bottom-0 left-0 w-full h-32 pointer-events-none opacity-50 md:opacity-100">
                    <div className="hidden md:block">
                        <WalkingSprite type="ash" delay={0} speed={18} scale={1.05} />
                        <WalkingSprite type="pikachu" delay={0.4} speed={18} scale={0.7} />
                    </div>
                    <div className="absolute bottom-0 w-full flex justify-center items-end h-8">
                        {grassBlades.map((_, i) => <GrassBlade key={i} index={i} />)}
                    </div>
                </div>
            )}
        </div>
    );
};
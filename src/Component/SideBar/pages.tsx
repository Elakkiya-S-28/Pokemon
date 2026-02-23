"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Home, Dna, Tent, BarChart3, BrainCircuit, Library, Settings, ChevronRight
} from "lucide-react";

const tabs = [
    { id: "home", label: "Home", icon: Home, color: "text-blue-400" },
    { id: "dna", label: "DNA Lab", icon: Dna, color: "text-cyan-400" },
    { id: "wild", label: "Wild Catch", icon: Tent, color: "text-green-400" },
    { id: "stats", label: "Stats Explorer", icon: BarChart3, color: "text-yellow-400" },
    { id: "team", label: "Team Analyzer", icon: BrainCircuit, color: "text-purple-400" },
    { id: "collection", label: "My Collection", icon: Library, color: "text-orange-400" },
];

export default function Sidebar() {
    const [activeTab, setActiveTab] = useState("dna");

    return (
        <nav className="fixed left-0 top-0 h-screen w-72 bg-slate-950 border-r border-slate-800 p-6 flex flex-col z-50">
            {/* Lab Logo */}
            <div className="flex items-center gap-3 mb-12 px-2">
                <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                    <Dna className="text-slate-950" size={24} />
                </div>
                <span className="text-xl font-black tracking-tighter text-white uppercase italic">
                    DNA <span className="text-cyan-500">Lab</span>
                </span>
            </div>

            {/* Navigation Tabs */}
            <div className="flex-1 space-y-2">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-colors group ${isActive ? "text-white" : "text-slate-400 hover:text-slate-200"
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-slate-800/50 border border-slate-700 rounded-xl z-0"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}

                            <tab.icon size={20} className={`relative z-10 ${isActive ? tab.color : "group-hover:text-white"}`} />
                            <span className="relative z-10 font-medium tracking-wide text-sm">
                                {tab.label}
                            </span>

                            {isActive && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="absolute right-4 z-10"
                                >
                                    <div className={`w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]`} />
                                </motion.div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* User / Settings Section */}
            <div className="pt-6 border-t border-slate-900">
                <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-white transition-colors">
                    <Settings size={20} />
                    <span className="text-sm font-medium">Lab Settings</span>
                </button>
            </div>
        </nav>
    );
}
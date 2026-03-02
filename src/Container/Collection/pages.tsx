'use client';
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Search, Library } from "lucide-react";

export const CollectionView = ({ items, onSelect, onRemove }: {
    items: any[],
    onSelect: (p: any) => void,
    onRemove: (id: number, index: number) => void
}) => (
    <div className="p-4 md:p-12 overflow-y-auto h-full custom-scrollbar max-w-7xl mx-auto w-full">
        {/* Header for context (Optional but good for mobile) */}
        <div className="mb-6 lg:hidden">
            <h2 className="text-xl font-black italic tracking-tighter">DATA VAULT</h2>
            <p className="text-[10px] text-white/40 tracking-[0.2em] uppercase">{items.length} Specimens Secured</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6">
            <AnimatePresence mode="popLayout">
                {items.map((p, i) => (
                    <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        key={`${p.id}-${i}`}
                        className="group relative bg-white/5 border border-white/10 p-3 md:p-4 rounded-2xl md:rounded-3xl hover:bg-white/10 hover:border-purple-500/50 transition-all cursor-pointer overflow-hidden"
                    >
                        {/* Action Buttons: Visible by default on mobile, hover on desktop */}
                        <div className="absolute top-2 right-2 flex gap-1 z-20 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={(e) => { e.stopPropagation(); onSelect(p); }}
                                className="p-2 bg-blue-500/80 backdrop-blur-md rounded-lg md:rounded-xl hover:bg-blue-400 text-white shadow-lg"
                                aria-label="Analyze"
                            >
                                <Search size={14} className="md:w-[12px] md:h-[12px]" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onRemove(p.id, i); }}
                                className="p-2 bg-red-500/80 backdrop-blur-md rounded-lg md:rounded-xl hover:bg-red-400 text-white shadow-lg"
                                aria-label="Remove"
                            >
                                <Trash2 size={14} className="md:w-[12px] md:h-[12px]" />
                            </button>
                        </div>

                        {/* Main Card Content */}
                        <div onClick={() => onSelect(p)} className="flex flex-col items-center py-2">
                            <div className="relative">
                                {/* Glow effect behind sprite */}
                                <div className="absolute inset-0 bg-purple-500/10 blur-2xl rounded-full" />
                                <img
                                    src={p.sprite}
                                    alt={p.name}
                                    className="w-20 h-20 md:w-24 md:h-24 relative z-10 drop-shadow-2xl group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>

                            <p className="text-[10px] md:text-xs font-black uppercase mt-3 tracking-widest text-white/80 text-center truncate w-full px-1">
                                {p.name}
                            </p>

                            {/* Type Badges */}
                            <div className="flex flex-wrap justify-center gap-1 mt-2">
                                {p.types.map((t: any) => (
                                    <span
                                        key={t.type.name}
                                        className="text-[7px] md:text-[8px] px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 uppercase font-bold text-white/40 whitespace-nowrap"
                                    >
                                        {t.type.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>

        {items.length === 0 && (
            <div className="h-[60vh] flex flex-col items-center justify-center opacity-20 text-center px-6">
                <Library size={48} className="md:w-16 md:h-16" />
                <h3 className="mt-4 text-sm md:text-base tracking-[0.4em] font-black uppercase">VAULT EMPTY</h3>
                <p className="mt-2 text-[8px] md:text-[10px] tracking-[0.1em] uppercase">No DNA sequences detected in storage</p>
            </div>
        )}
    </div>
);
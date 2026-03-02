'use client';
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Search, Library } from "lucide-react";

export const CollectionView = ({ items, onSelect, onRemove }: {
    items: any[],
    onSelect: (p: any) => void,
    onRemove: (id: number, index: number) => void
}) => (
    <div className="p-8 md:p-12 overflow-y-auto h-full custom-scrollbar">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <AnimatePresence>
                {items.map((p, i) => (
                    <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        key={`${p.id}-${i}`}
                        className="group relative bg-white/5 border border-white/10 p-4 rounded-3xl hover:bg-white/10 hover:border-purple-500/50 transition-all cursor-pointer"
                    >
                        {/* Action Buttons Overlay */}
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                            <button
                                onClick={(e) => { e.stopPropagation(); onSelect(p); }}
                                className="p-2 bg-blue-500 rounded-xl hover:bg-blue-400 text-white"
                            >
                                <Search size={12} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onRemove(p.id, i); }}
                                className="p-2 bg-red-500 rounded-xl hover:bg-red-400 text-white"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>

                        <div onClick={() => onSelect(p)} className="flex flex-col items-center">
                            <img src={p.sprite} alt={p.name} className="w-24 h-24 drop-shadow-2xl group-hover:scale-110 transition-transform" />
                            <p className="text-[10px] font-black uppercase mt-3 tracking-widest text-white/70">{p.name}</p>
                            <div className="flex gap-1 mt-2">
                                {p.types.map((t: any) => (
                                    <span key={t.type.name} className="text-[7px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 uppercase font-bold text-white/40">
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
            <div className="h-full flex flex-col items-center justify-center opacity-20">
                <Library size={64} />
                <p className="mt-4 tracking-[0.5em] font-light uppercase">Database Empty</p>
            </div>
        )}
    </div>
);
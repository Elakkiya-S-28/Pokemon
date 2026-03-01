'use client';
import { motion } from "framer-motion";

export const CollectionView = ({ items, onSelect }: { items: any[], onSelect: (p: any) => void }) => (
    <div className="p-12 overflow-y-auto h-full">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {items.map((p, i) => (
                <motion.div
                    onClick={() => onSelect(p)}
                    whileHover={{ y: -5, borderColor: 'rgba(74,222,128,0.5)' }}
                    key={i}
                    className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center cursor-pointer transition-colors"
                >
                    <img src={p.sprite} alt={p.name} className="w-20 h-20" />
                    <p className="text-[10px] font-bold uppercase mt-2 text-green-400">{p.name}</p>
                </motion.div>
            ))}
        </div>
    </div>
);
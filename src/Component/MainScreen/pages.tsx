import { motion } from "framer-motion";
import { Pokemon } from "../interface/pages";

export const NavItem = ({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all ${active ? 'bg-purple-600 text-white shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
    >
        {icon}
        <span className="text-[10px] font-bold tracking-widest uppercase">{label}</span>
    </button>
);


export const Pokeball = ({ className = "w-16 h-16" }: { className?: string }) => (
    <div className={`${className} rounded-full border-2 border-black relative overflow-hidden bg-white shadow-2xl shadow-blue-500/20`}>
        <div className="absolute top-0 w-full h-1/2 bg-[#ff3e3e] border-b-2 border-black" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-black rounded-full z-10" />
    </div>
);


export const SpecimenSlot = ({ p, label, onClear }: { p: Pokemon | null, label: string, onClear: () => void }) => (
    <div className="flex flex-col items-center gap-2">
        <div className="text-[9px] font-black tracking-[0.3em] text-white/30">{label}</div>
        <div
            onClick={onClear}
            className={`w-24 h-24 md:w-32 md:h-32 rounded-3xl border-2 border-dashed flex items-center justify-center transition-all cursor-pointer overflow-hidden ${p ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 hover:border-white/20 bg-white/5'
                }`}
        >
            {p ? (
                <motion.img initial={{ scale: 0 }} animate={{ scale: 1 }} src={p.sprite} className="w-full h-full p-2" />
            ) : (
                <div className="text-white/10 text-xs">EMPTY</div>
            )}
        </div>
        {p && <div className="text-[10px] font-bold text-white/60 uppercase truncate w-24 text-center">{p.name}</div>}
    </div>
);


export const StatBar = ({ label, value, icon }: { label: string, value: number, icon: any }) => {
    const percentage = Math.min((value / 255) * 100, 100);

    return (
        <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-mono tracking-widest uppercase">
                <div className="flex items-center gap-2 text-white/60">
                    {icon}
                    <span>{label.replace('-', ' ')}</span>
                </div>
                <span className="text-white font-bold">{value}</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full ${percentage > 50 ? 'bg-green-400' : 'bg-orange-400'} shadow-[0_0_10px_rgba(74,222,128,0.5)]`}
                />
            </div>
        </div>
    );
};

export const AttributeBox = ({ label, value }: { label: string, value: string }) => (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
        <p className="text-[9px] tracking-[0.2em] text-white/30 mb-1">{label}</p>
        <p className="text-sm font-bold font-mono">{value}</p>
    </div>
);
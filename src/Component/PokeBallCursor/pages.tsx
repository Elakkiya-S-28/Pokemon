"use client";
import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export default function PokeballCursor() {
    const mouseX = useSpring(0, { stiffness: 500, damping: 28 });
    const mouseY = useSpring(0, { stiffness: 500, damping: 28 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX - 16);
            mouseY.set(e.clientY - 16);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <motion.div
            className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] hidden lg:block"
            style={{ x: mouseX, y: mouseY }}
        >
            {/* CSS Pokeball */}
            <div className="relative w-full h-full rounded-full border-2 border-slate-900 bg-white overflow-hidden animate-spin-slow">
                <div className="absolute top-0 w-full h-1/2 bg-red-500 border-b-2 border-slate-900" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-slate-900 rounded-full z-10" />
            </div>
        </motion.div>
    );
}
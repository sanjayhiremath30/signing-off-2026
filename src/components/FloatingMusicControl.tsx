"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music2, Music, Volume2 } from "lucide-react";
import { useAudioStore } from "@/store/useAudioStore";
import { usePathname } from "next/navigation";

export default function FloatingMusicControl() {
  const { isPlaying, toggle } = useAudioStore();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hide on the home page (it has its own enter journey button)
  if (!mounted || pathname === "/") return null;

  return (
    <AnimatePresence>
      <motion.button
        initial={{ opacity: 0, scale: 0, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 1 }}
        onClick={toggle}
        title={isPlaying ? "Pause music" : "Play music"}
        className={`fixed bottom-6 left-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full backdrop-blur-md border transition-all duration-300 shadow-lg group ${
          isPlaying
            ? "bg-purple-600/80 border-purple-400/50 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)]"
            : "bg-black/60 border-white/10 text-zinc-400 hover:border-purple-500/50 hover:text-white"
        }`}
      >
        {isPlaying ? (
          <>
            <Music2 size={18} className="animate-pulse" />
            <span className="text-sm font-medium hidden group-hover:inline-block transition-all">
              Playing
            </span>
            <span className="flex gap-0.5 items-end h-4">
              {[1, 2, 3].map((b) => (
                <span
                  key={b}
                  className="w-0.5 bg-white rounded-full animate-bounce"
                  style={{
                    height: `${8 + b * 3}px`,
                    animationDelay: `${b * 0.15}s`,
                    animationDuration: "0.8s",
                  }}
                />
              ))}
            </span>
          </>
        ) : (
          <>
            <Music size={18} />
            <span className="text-sm font-medium hidden group-hover:inline-block">
              Play Music
            </span>
          </>
        )}
      </motion.button>
    </AnimatePresence>
  );
}

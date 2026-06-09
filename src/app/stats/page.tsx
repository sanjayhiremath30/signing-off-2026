"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useStudentStore } from "@/store/useStudentStore";

function Counter({ from, to, suffix }: { from: number; to: number; suffix: string }) {
  const [count, setCount] = useState(from);

  useEffect(() => {
    let start = from;
    const end = to;
    if (start === end) return;
    
    const duration = 2000;
    const incrementTime = (duration / end) * 2;
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, incrementTime);
    
    return () => clearInterval(timer);
  }, [from, to]);

  return <span className="tabular-nums">{count}{suffix}</span>;
}

export default function StatsPage() {
  const { students, init } = useStudentStore();
  
  useEffect(() => {
    init();
  }, []);

  const stats = [
    { label: "Students", value: students.length, suffix: "" },
    { label: "Years", value: 4, suffix: "" },
    { label: "Semesters", value: 8, suffix: "" },
    { label: "Photos", value: students.length, suffix: "" },
    { label: "Memories", value: 100, suffix: "+" },
    { label: "Family ❤️", value: 1, suffix: "" },
  ];

  return (
    <div className="min-h-screen w-full bg-transparent text-white px-4 py-20 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-20 relative z-10"
      >
        <h1 className="text-4xl md:text-6xl font-black neon-text-blue tracking-wider mb-4">
          OUR JOURNEY IN NUMBERS
        </h1>
        <p className="text-xl text-zinc-400 font-light tracking-widest">DRIMAC 2022-2026</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 max-w-5xl mx-auto relative z-10 w-full">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
            className="flex flex-col items-center justify-center p-8 glassmorphism rounded-3xl"
          >
            <div className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
              <Counter from={0} to={stat.value} suffix={stat.suffix} />
            </div>
            <div className="text-lg md:text-xl text-zinc-300 font-medium tracking-wider uppercase text-center">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Users } from "lucide-react";
import { useStudentStore } from "@/store/useStudentStore";
import { useRouter } from "next/navigation";

export default function DirectoryPage() {
  const { students, init } = useStudentStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    init();
    setMounted(true);
  }, [init]);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.branch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full bg-transparent text-white px-4 py-8 md:px-12 lg:px-24">
      {/* Header */}
      <header className="flex justify-between items-center mb-12 mt-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl md:text-5xl font-bold neon-text-purple tracking-wider">
            OUR FAMILY
          </h1>
          <p className="text-zinc-500 text-sm mt-1 tracking-widest uppercase">
            {students.length} members · 2022–2026
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="p-3 rounded-full glassmorphism text-white hover:text-purple-400 transition-colors"
        >
          {isSearchOpen ? <X size={24} /> : <Search size={24} />}
        </motion.button>
      </header>

      {/* Search Bar */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-12 overflow-hidden"
          >
            <div className="relative glassmorphism rounded-2xl p-2 max-w-2xl mx-auto">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400" size={24} />
              <input
                type="text"
                autoFocus
                placeholder="Search by name or branch..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none pl-16 pr-6 py-4 text-xl text-white placeholder-zinc-500"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {students.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-32 text-center"
        >
          <div className="p-6 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
            <Users size={48} className="text-purple-400/50" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-400 mb-2">Family directory is empty</h2>
          <p className="text-zinc-600 max-w-sm">
            The admin needs to add student shells first via the{" "}
            <a href="/admin" className="text-purple-400 hover:underline">Admin Dashboard</a>.
          </p>
        </motion.div>
      )}

      {/* Student Grid */}
      {students.length > 0 && (
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6"
        >
          <AnimatePresence>
            {filteredStudents.map((student, index) => (
              <motion.div
                layout
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.04 }}
                onClick={() => router.push(`/profile/${student.id}`)}
                className="group cursor-pointer relative"
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden glassmorphism transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2 group-hover:shadow-[0_0_24px_rgba(168,85,247,0.5)]">
                  {/* Photo */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={student.photoUrl}
                    alt={student.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Profile fill indicator */}
                  {student.messageToBatch && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                  )}

                  {/* Name */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                    <h3 className="text-base md:text-lg font-bold text-white drop-shadow-lg truncate leading-tight">
                      {student.name}
                    </h3>
                    <p className="text-xs text-purple-300 font-medium opacity-0 group-hover:opacity-100 transition-opacity delay-75 truncate">
                      {student.branch} · View Profile →
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {filteredStudents.length === 0 && students.length > 0 && (
        <div className="text-center text-zinc-500 py-20 text-xl">
          No students found matching &ldquo;{searchQuery}&rdquo;
        </div>
      )}
    </div>
  );
}

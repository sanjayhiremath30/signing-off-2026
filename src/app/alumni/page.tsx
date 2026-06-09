"use client";

import { motion } from "framer-motion";
import { Briefcase, ExternalLink, Globe, MapPin } from "lucide-react";

const alumni = [
  {
    name: "Coming Soon",
    role: "Software Engineer",
    company: "Your Dream Company",
    location: "Bengaluru, India",
    linkedin: "#",
    website: "#",
    gradient: "from-purple-500 to-blue-500",
    initials: "?",
  },
];

export default function AlumniConnectPage() {
  return (
    <div className="min-h-screen w-full bg-transparent text-white px-4 py-20 md:px-12 lg:px-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-900/15 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 relative z-10"
      >
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-blue-500/10 border border-blue-500/30">
            <Briefcase size={40} className="text-blue-400" />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-wider mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          ALUMNI CONNECT
        </h1>
        <p className="text-xl text-zinc-400 font-light">
          Where the 2022–2026 batch lands — building the future, one role at a time
        </p>
      </motion.div>

      {/* Coming Soon Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="max-w-2xl mx-auto glassmorphism rounded-3xl p-8 text-center mb-16 relative z-10 border border-blue-500/20"
      >
        <div className="text-5xl mb-4">🚀</div>
        <h2 className="text-2xl font-bold text-blue-400 mb-3">This page unlocks after graduation!</h2>
        <p className="text-zinc-400 leading-relaxed">
          Once the batch officially signs off, alumni will be able to update their profiles with where they&apos;ve landed —
          job, company, city, and more. Check back soon!
        </p>
      </motion.div>

      {/* Preview Cards */}
      <div className="max-w-6xl mx-auto relative z-10">
        <p className="text-center text-zinc-500 text-sm uppercase tracking-widest mb-8 font-bold">Preview</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="group relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="relative glassmorphism rounded-2xl p-6 flex items-center gap-4 opacity-40">
                {/* Avatar placeholder */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl font-black shrink-0">
                  ?
                </div>
                <div className="flex-1 min-w-0">
                  <div className="h-4 bg-white/20 rounded-full w-3/4 mb-2" />
                  <div className="h-3 bg-white/10 rounded-full w-1/2 mb-2" />
                  <div className="flex items-center gap-1">
                    <MapPin size={10} className="text-blue-400" />
                    <div className="h-3 bg-white/10 rounded-full w-1/3" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center mt-20 relative z-10"
      >
        <p className="text-zinc-500 mb-4">Are you a 2022-2026 grad? Update your profile via the Admin panel.</p>
        <a
          href="/admin"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 font-bold hover:from-blue-500 hover:to-purple-500 transition-all text-sm shadow-[0_0_15px_rgba(59,130,246,0.4)]"
        >
          <Globe size={16} /> Go to Admin
        </a>
      </motion.div>
    </div>
  );
}

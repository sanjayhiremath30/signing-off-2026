"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Plus, X, Clock, ShieldAlert, Trash2 } from "lucide-react";
import { useStudentStore } from "@/store/useStudentStore";

interface Capsule {
  id: string;
  studentId: string;
  author: string;
  message: string;
  revealDate: string;
  createdAt: string;
}

export default function CapsulesPage() {
  const { students, init } = useStudentStore();
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [secretKey, setSecretKey] = useState("");
  const [message, setMessage] = useState("");
  const [revealDate, setRevealDate] = useState("2031-06-01");
  const [formError, setFormError] = useState("");

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [adminError, setAdminError] = useState("");

  useEffect(() => {
    init();
    const local = localStorage.getItem("time_capsules_v2");
    if (local) {
      setCapsules(JSON.parse(local));
    } else {
      setCapsules([]);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!secretKey.trim() || !message.trim()) return;

    const student = students.find(s => s.editPassword && s.editPassword === secretKey);
    if (!student) {
      setFormError("Invalid secret key. Use the password your admin created for you.");
      return;
    }

    const newCapsule: Capsule = {
      id: Date.now().toString(),
      studentId: student.id,
      author: student.name,
      message: message.trim(),
      revealDate,
      createdAt: new Date().toLocaleDateString("en-IN"),
    };

    const existingIndex = capsules.findIndex(c => c.studentId === student.id);
    let updated;
    if (existingIndex >= 0) {
      updated = [...capsules];
      updated[existingIndex] = newCapsule;
    } else {
      updated = [newCapsule, ...capsules];
    }

    setCapsules(updated);
    localStorage.setItem("time_capsules_v2", JSON.stringify(updated));
    setSecretKey("");
    setMessage("");
    setShowForm(false);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminKey === "Sanjay@04") {
      setIsAdminMode(true);
      setShowAdminPrompt(false);
      setAdminError("");
      setAdminKey("");
    } else {
      setAdminError("Incorrect admin password.");
    }
  };

  const deleteCapsule = (id: string) => {
    if (!window.confirm("Delete this capsule?")) return;
    const updated = capsules.filter(c => c.id !== id);
    setCapsules(updated);
    localStorage.setItem("time_capsules_v2", JSON.stringify(updated));
  };

  const isRevealed = (dateStr: string) => new Date(dateStr) <= new Date();

  return (
    <div className="min-h-screen w-full bg-transparent text-white px-4 py-20 md:px-12 lg:px-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-900/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-900/20 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 relative z-10"
      >
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-indigo-500/10 border border-indigo-500/30">
            <Lock size={40} className="text-indigo-400" />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-wider mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
          TIME CAPSULES
        </h1>
        <p className="text-xl text-zinc-400 font-light">
          Messages sealed for the future — to be read years from now
        </p>
      </motion.div>

      {/* Add Capsule Button */}
      <div className="flex justify-center mb-12 relative z-10 gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 font-bold hover:from-indigo-500 hover:to-purple-500 transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)]"
        >
          <Plus size={20} /> Seal a Capsule
        </motion.button>
        <button
          onClick={() => isAdminMode ? setIsAdminMode(false) : setShowAdminPrompt(true)}
          className={`glassmorphism p-4 rounded-full transition-colors ${isAdminMode ? 'bg-purple-500/30 text-purple-400' : 'text-zinc-500 hover:text-white'}`}
          title="Admin Mode"
        >
          <ShieldAlert size={20} />
        </button>
      </div>

      {/* Capsules Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <AnimatePresence>
          {capsules.map((capsule, i) => {
            const revealed = isRevealed(capsule.revealDate);
            return (
              <motion.div
                key={capsule.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="group relative"
              >
                <div className={`absolute -inset-0.5 ${revealed ? "bg-gradient-to-br from-emerald-500 to-teal-500" : "bg-gradient-to-br from-indigo-500 to-purple-600"} rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500`} />
                <div className="relative glassmorphism rounded-2xl p-6 h-full flex flex-col">
                  {isAdminMode && (
                    <button 
                      onClick={() => deleteCapsule(capsule.id)}
                      className="absolute -top-3 -right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg z-20"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-2 rounded-xl ${revealed ? "bg-emerald-500/20 text-emerald-400" : "bg-indigo-500/20 text-indigo-400"}`}>
                      {revealed ? <Unlock size={20} /> : <Lock size={20} />}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-zinc-500 flex items-center gap-1 justify-end">
                        <Clock size={12} />
                        {revealed ? "Revealed" : `Opens: ${capsule.revealDate}`}
                      </p>
                    </div>
                  </div>

                  {revealed ? (
                    <p className="text-zinc-200 italic leading-relaxed mb-4">
                      &ldquo;{capsule.message}&rdquo;
                    </p>
                  ) : (
                    <div className="mb-4 py-6 flex flex-col items-center justify-center bg-white/5 rounded-xl border border-dashed border-white/20">
                      <Lock size={32} className="text-indigo-400/50 mb-2" />
                      <p className="text-zinc-500 text-sm">This capsule is sealed until {capsule.revealDate}</p>
                    </div>
                  )}

                  <div className="mt-auto pt-4">
                    <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                      — {capsule.author}
                    </p>
                    <p className="text-xs text-zinc-600 mt-1">Sealed on {capsule.createdAt}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glassmorphism p-8 rounded-3xl w-full max-w-md relative"
            >
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
              <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                Seal a Time Capsule
              </h2>
              <p className="text-zinc-500 text-sm mb-6">Write a message to your future self or the batch</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-zinc-400 text-sm mb-2">Secret Key</label>
                  <input type="password" value={secretKey} onChange={e => setSecretKey(e.target.value)} required
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
                    placeholder="Enter the password from admin" />
                </div>
                <div>
                  <label className="block text-zinc-400 text-sm mb-2">Your Message</label>
                  <textarea value={message} onChange={e => setMessage(e.target.value)} required
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 resize-none h-28"
                    placeholder="Write something to be read in the future..." maxLength={300} />
                </div>
                <div>
                  <label className="block text-zinc-400 text-sm mb-2">Reveal Date</label>
                  <input type="date" value={revealDate} onChange={e => setRevealDate(e.target.value)} required
                    min="2026-06-10"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500" />
                </div>

                {formError && (
                  <p className="text-red-400 text-sm text-center">{formError}</p>
                )}

                <div className="flex gap-4 pt-2">
                  <button type="button" 
                    onClick={() => {
                      setShowForm(false);
                      setFormError("");
                      setSecretKey("");
                    }}
                    className="flex-1 py-3 rounded-xl border border-white/20 hover:bg-white/5 transition-colors">
                    Cancel
                  </button>
                  <button type="submit"
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 font-bold hover:from-indigo-500 hover:to-purple-500 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                    <Lock size={16} /> Seal It
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Auth Modal */}
      <AnimatePresence>
        {showAdminPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glassmorphism p-8 rounded-3xl w-full max-w-sm"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-purple-500/20 border border-purple-500/30">
                  <Lock size={24} className="text-purple-400" />
                </div>
              </div>
              <h2 className="text-xl font-bold neon-text-purple mb-6 text-center">Admin Access</h2>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <input 
                  type="password" 
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Admin password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-center focus:outline-none focus:border-purple-500"
                  required
                />
                {adminError && <p className="text-red-400 text-xs text-center">{adminError}</p>}
                <div className="flex gap-4 pt-2">
                  <button 
                    type="button"
                    onClick={() => {
                      setShowAdminPrompt(false);
                      setAdminError("");
                      setAdminKey("");
                    }}
                    className="flex-1 py-2 rounded-xl border border-white/20 text-zinc-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-500 transition-colors"
                  >
                    Unlock
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

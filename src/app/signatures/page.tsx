"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PenTool, Trash2, Lock, ShieldAlert } from "lucide-react";
import { useStudentStore } from "@/store/useStudentStore";

interface Signature {
  id: string;
  studentId: string;
  name: string;
  message: string;
  color: string;
  font: string;
  left: string;
  top: string;
  delay: string;
}

const fonts = ["font-serif", "font-sans", "font-mono"];
const colors = ["neon-text-purple", "neon-text-blue", "neon-text-gold", "text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.8)]", "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]"];

export default function SignatureWallPage() {
  const { students, init } = useStudentStore();
  const [signatures, setSignatures] = useState<Signature[]>([]);
  
  const [showForm, setShowForm] = useState(false);
  const [secretKey, setSecretKey] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [formError, setFormError] = useState("");

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [adminError, setAdminError] = useState("");

  useEffect(() => {
    init();
    // Load signatures from local storage or start empty
    const local = localStorage.getItem("signatures_v2");
    if (local) {
      setSignatures(JSON.parse(local));
    } else {
      setSignatures([]);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!secretKey || !newMessage) return;

    // 1. Verify Secret Key
    const student = students.find(s => s.editPassword && s.editPassword === secretKey);
    if (!student) {
      setFormError("Invalid secret key. Use the password your admin created for you.");
      return;
    }

    // 2. Check for existing signature to overwrite (max 1 per person)
    const existingIndex = signatures.findIndex(s => s.studentId === student.id);

    // 3. Find non-overlapping coordinates
    let newLeft = 0, newTop = 0;
    let attempts = 0;
    while (attempts < 50) {
      newLeft = Math.random() * 80 + 10;
      newTop = Math.random() * 80 + 10;
      
      const overlap = signatures.some((sig, idx) => {
        if (idx === existingIndex) return false; // Ignore our own old spot
        const sigLeft = parseFloat(sig.left);
        const sigTop = parseFloat(sig.top);
        return Math.abs(sigLeft - newLeft) < 15 && Math.abs(sigTop - newTop) < 15;
      });
      
      if (!overlap) break;
      attempts++;
    }

    const newSig: Signature = {
      id: Date.now().toString(),
      studentId: student.id,
      name: student.name,
      message: newMessage,
      color: colors[Math.floor(Math.random() * colors.length)],
      font: fonts[Math.floor(Math.random() * fonts.length)],
      left: `${newLeft}%`,
      top: `${newTop}%`,
      delay: "0s"
    };

    let updated;
    if (existingIndex >= 0) {
      updated = [...signatures];
      updated[existingIndex] = newSig;
    } else {
      updated = [...signatures, newSig];
    }

    setSignatures(updated);
    localStorage.setItem("signatures_v2", JSON.stringify(updated));
    setShowForm(false);
    setSecretKey("");
    setNewMessage("");
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

  const deleteSignature = (id: string) => {
    if (!window.confirm("Delete this signature?")) return;
    const updated = signatures.filter(s => s.id !== id);
    setSignatures(updated);
    localStorage.setItem("signatures_v2", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen w-full bg-[#030303] overflow-hidden relative perspective-[1000px]">
      
      {/* Background brick wall pattern (simulated with CSS grid/linear-gradients) */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '100px 50px'
        }}
      />

      {/* The 3D rotating wall */}
      <motion.div 
        initial={{ rotateY: 10, scale: 0.9 }}
        animate={{ rotateY: [-5, 5, -5] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 transform-style-preserve-3d"
      >
        {signatures.map((sig) => (
          <motion.div
            key={sig.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 text-center max-w-[300px] ${isAdminMode ? "pointer-events-auto z-50" : "pointer-events-none"}`}
            style={{ 
              left: sig.left, 
              top: sig.top,
              animationDelay: sig.delay 
            }}
          >
            {isAdminMode && (
              <button 
                onClick={() => deleteSignature(sig.id)}
                className="absolute -top-8 left-1/2 -translate-x-1/2 p-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-full transition-colors backdrop-blur-sm"
              >
                <Trash2 size={16} />
              </button>
            )}
            <p className={`text-2xl md:text-4xl ${sig.font} ${sig.color} opacity-80 mix-blend-screen`}>
              {sig.message}
            </p>
            <p className={`text-sm mt-2 text-white/50 italic ${sig.font}`}>
              - {sig.name}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* UI Controls */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
        <button 
          onClick={() => setShowForm(true)}
          className="glassmorphism px-8 py-4 rounded-full text-white font-bold flex items-center gap-3 hover:bg-white/10 transition-colors shadow-[0_0_20px_rgba(168,85,247,0.4)]"
        >
          <PenTool size={20} />
          Leave a Signature
        </button>
        <button
          onClick={() => isAdminMode ? setIsAdminMode(false) : setShowAdminPrompt(true)}
          className={`glassmorphism p-4 rounded-full transition-colors ${isAdminMode ? 'bg-purple-500/30 text-purple-400' : 'text-zinc-500 hover:text-white'}`}
          title="Admin Mode"
        >
          <ShieldAlert size={20} />
        </button>
      </div>

      {/* Add Signature Modal */}
      {showForm && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glassmorphism p-8 rounded-3xl w-full max-w-md"
          >
            <h2 className="text-2xl font-bold neon-text-purple mb-6 text-center">Sign the Wall</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-zinc-400 text-sm mb-2">Secret Key</label>
                <input 
                  type="password" 
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder="Enter the password from admin"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-sm mb-2">Message (Keep it short!)</label>
                <textarea 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  maxLength={60}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 resize-none h-24"
                  required
                />
              </div>
              
              {formError && (
                <p className="text-red-400 text-sm text-center">{formError}</p>
              )}

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormError("");
                    setSecretKey("");
                  }}
                  className="flex-1 py-3 rounded-xl border border-white/20 text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-purple-600 text-white hover:bg-purple-500 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                >
                  Post
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Admin Auth Modal */}
      {showAdminPrompt && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
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
        </div>
      )}
    </div>
  );
}

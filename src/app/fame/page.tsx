"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Plus, X, Lock, ShieldAlert, Trash2 } from "lucide-react";
import { useStudentStore } from "@/store/useStudentStore";
import Image from "next/image";

interface FamePost {
  id: string;
  nominatorId: string;
  nominatorName: string;
  nomineeId: string;
  nomineeName: string;
  nomineePhotoUrl: string;
  title: string;
  color: string;
}

const COLORS = [
  "from-blue-400 to-cyan-400",
  "from-yellow-400 to-orange-400",
  "from-pink-400 to-rose-400",
  "from-purple-400 to-fuchsia-400",
  "from-green-400 to-emerald-400",
  "from-slate-400 to-zinc-400",
  "from-indigo-400 to-blue-600",
  "from-rose-400 to-red-500",
];

export default function HallOfFamePage() {
  const { students, init } = useStudentStore();
  const [posts, setPosts] = useState<FamePost[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [secretKey, setSecretKey] = useState("");
  const [nomineeId, setNomineeId] = useState("");
  const [title, setTitle] = useState("");
  const [formError, setFormError] = useState("");

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [adminError, setAdminError] = useState("");

  useEffect(() => {
    init();
    const local = localStorage.getItem("fame_posts_v2");
    if (local) {
      setPosts(JSON.parse(local));
    } else {
      setPosts([]);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    
    if (!secretKey.trim() || !nomineeId || !title.trim()) {
      setFormError("Please fill out all fields.");
      return;
    }

    const nominator = students.find(s => s.editPassword && s.editPassword === secretKey);
    if (!nominator) {
      setFormError("Invalid secret key. Use the password your admin created for you.");
      return;
    }

    const nominee = students.find(s => s.id === nomineeId);
    if (!nominee) {
      setFormError("Selected person not found.");
      return;
    }

    const newPost: FamePost = {
      id: Date.now().toString(),
      nominatorId: nominator.id,
      nominatorName: nominator.name,
      nomineeId: nominee.id,
      nomineeName: nominee.name,
      nomineePhotoUrl: nominee.photoUrl,
      title: title.trim(),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    localStorage.setItem("fame_posts_v2", JSON.stringify(updated));
    setSecretKey("");
    setNomineeId("");
    setTitle("");
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

  const deletePost = (id: string) => {
    if (!window.confirm("Delete this Hall of Fame post?")) return;
    const updated = posts.filter(p => p.id !== id);
    setPosts(updated);
    localStorage.setItem("fame_posts_v2", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen w-full bg-transparent text-white px-4 py-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-purple-900/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/2 h-full bg-blue-900/10 blur-[150px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 relative z-10"
      >
        <h1 className="text-4xl md:text-6xl font-black neon-text-gold tracking-wider mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 flex items-center justify-center gap-4">
          <Trophy className="text-yellow-400" size={48} />
          HALL OF FAME
        </h1>
        <p className="text-xl text-zinc-400 font-light mb-8">Honor the legends of our batch</p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-bold hover:from-yellow-500 hover:to-orange-500 transition-all shadow-[0_0_20px_rgba(234,179,8,0.4)]"
          >
            <Plus size={20} /> Nominate Someone
          </button>
          <button
            onClick={() => isAdminMode ? setIsAdminMode(false) : setShowAdminPrompt(true)}
            className={`glassmorphism p-4 rounded-full transition-colors ${isAdminMode ? 'bg-yellow-500/30 text-yellow-400' : 'text-zinc-500 hover:text-white'}`}
            title="Admin Mode"
          >
            <ShieldAlert size={20} />
          </button>
        </div>
      </motion.div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        <AnimatePresence>
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
              className="group relative"
            >
              {/* Glow effect behind card */}
              <div className={`absolute -inset-0.5 bg-gradient-to-br ${post.color} rounded-3xl blur opacity-30 group-hover:opacity-70 transition duration-500`} />
              
              <div className="relative glassmorphism rounded-3xl p-6 h-full flex flex-col items-center text-center">
                {isAdminMode && (
                  <button 
                    onClick={() => deletePost(post.id)}
                    className="absolute -top-3 -right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg z-20"
                  >
                    <Trash2 size={16} />
                  </button>
                )}

                <div className="relative w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-white/10 group-hover:border-white/30 transition-colors">
                  {post.nomineePhotoUrl && post.nomineePhotoUrl.startsWith("data:") ? (
                    <img src={post.nomineePhotoUrl} alt={post.nomineeName} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <Image
                      src={post.nomineePhotoUrl || "/college.jpg"}
                      alt={post.nomineeName}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                </div>
                
                <h3 className={`text-sm tracking-[0.2em] uppercase font-bold text-transparent bg-clip-text bg-gradient-to-r ${post.color} mb-2`}>
                  {post.title}
                </h3>
                <p className="text-2xl font-bold text-white drop-shadow-md mb-6">
                  {post.nomineeName}
                </p>
                
                <div className="mt-auto pt-4 border-t border-white/10 w-full">
                  <p className="text-xs text-zinc-500 italic">
                    Nominated by: <span className="font-semibold text-zinc-400">{post.nominatorName}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {posts.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <p className="text-zinc-500 text-lg">No one has been nominated yet. Be the first!</p>
          </div>
        )}
      </div>

      {/* Add Post Modal */}
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

              <h2 className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Create a Nomination
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-zinc-400 text-sm mb-2">Your Secret Key</label>
                  <input
                    type="password"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-yellow-500"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-zinc-400 text-sm mb-2">Who are you nominating?</label>
                  <select
                    value={nomineeId}
                    onChange={(e) => setNomineeId(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-yellow-500"
                    required
                  >
                    <option value="" disabled>Select a person...</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 text-sm mb-2">What are they best at?</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-yellow-500"
                    placeholder="e.g. Best Programmer, Silent Killer..."
                    maxLength={30}
                    required
                  />
                </div>

                {formError && (
                  <p className="text-red-400 text-sm text-center">{formError}</p>
                )}

                <div className="flex gap-4 pt-2">
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
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-yellow-600 to-orange-600 font-bold hover:from-yellow-500 hover:to-orange-500 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(234,179,8,0.5)] text-white"
                  >
                    <Trophy size={16} /> Post
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
                <div className="p-3 rounded-full bg-yellow-500/20 border border-yellow-500/30">
                  <Lock size={24} className="text-yellow-400" />
                </div>
              </div>
              <h2 className="text-xl font-bold neon-text-gold mb-6 text-center text-yellow-500">Admin Access</h2>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <input 
                  type="password" 
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Admin password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-center focus:outline-none focus:border-yellow-500"
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
                    className="flex-1 py-2 rounded-xl bg-yellow-600 text-white hover:bg-yellow-500 transition-colors"
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

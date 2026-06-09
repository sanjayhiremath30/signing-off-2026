import { create } from 'zustand';

export interface MemoryEvent {
  id: string;
  url: string;
  year: string;
  text: string;
}

const STORAGE_KEY = 'memory_tunnel_events_v1';

const DEFAULT_MEMORIES: MemoryEvent[] = [
  { id: "1", url: "/college.jpg", year: "2022", text: "First Day" },
  { id: "2", url: "/college.jpg", year: "2023", text: "Fest 23" },
  { id: "3", url: "/college.jpg", year: "2024", text: "Industrial Visit" },
  { id: "4", url: "/college.jpg", year: "2025", text: "Hackathon Winners" },
  { id: "5", url: "/college.jpg", year: "2026", text: "Graduation Day" },
];

interface MemoryTunnelState {
  memories: MemoryEvent[];
  initialized: boolean;
  init: () => void;
  addMemory: (memory: MemoryEvent) => void;
  deleteMemory: (id: string) => void;
}

export const useMemoryTunnelStore = create<MemoryTunnelState>((set, get) => ({
  memories: [],
  initialized: false,

  init: () => {
    if (get().initialized) return;
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem(STORAGE_KEY);
    let loaded: MemoryEvent[] = DEFAULT_MEMORIES;
    if (raw) {
      try { loaded = JSON.parse(raw); } catch { /* ignore */ }
    }
    set({ memories: loaded, initialized: true });
  },

  addMemory: (memory: MemoryEvent) => {
    const updated = [...get().memories, memory];
    set({ memories: updated });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  deleteMemory: (id: string) => {
    const updated = get().memories.filter(m => m.id !== id);
    set({ memories: updated });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },
}));

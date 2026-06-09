import { create } from 'zustand';

interface AudioState {
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  isPlaying: true, // Auto-play by default
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  toggle: () => set((state) => ({ isPlaying: !state.isPlaying })),
}));

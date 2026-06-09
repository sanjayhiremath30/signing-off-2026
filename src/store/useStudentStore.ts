import { create } from 'zustand';
import { Student, STORAGE_KEY, MOCK_STUDENTS } from '@/data/students';

interface StudentState {
  students: Student[];
  initialized: boolean;
  init: () => void;
  addStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;
  updateStudent: (student: Student) => void;
}

export const useStudentStore = create<StudentState>((set, get) => ({
  students: [],
  initialized: false,

  init: () => {
    if (get().initialized) return;
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem(STORAGE_KEY);
    let loaded: Student[] = MOCK_STUDENTS;
    if (raw) {
      try { loaded = JSON.parse(raw); } catch { /* ignore */ }
    }
    set({ students: loaded, initialized: true });
  },

  addStudent: (student: Student) => {
    const updated = [...get().students, student];
    set({ students: updated });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  deleteStudent: (id: string) => {
    const updated = get().students.filter(s => s.id !== id);
    set({ students: updated });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  updateStudent: (student: Student) => {
    const updated = get().students.map(s => s.id === student.id ? student : s);
    set({ students: updated });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },
}));

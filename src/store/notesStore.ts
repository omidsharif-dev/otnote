import { create } from 'zustand';
import { Note, NoteInput } from '@/types/note';
import { notesStorage } from '@/storage/notesStorage';

interface NotesState {
  notes: Note[];
  isLoading: boolean;
  loadNotes: () => Promise<void>;
  addNote: (note: NoteInput) => Promise<void>;
  updateNote: (id: string, updates: Partial<NoteInput>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  isLoading: false,

  loadNotes: async () => {
    set({ isLoading: true });
    const notes = await notesStorage.getAll();
    set({ notes, isLoading: false });
  },

  addNote: async (note) => {
    const newNote = await notesStorage.add(note);
    set({ notes: [newNote, ...get().notes] });
  },

  updateNote: async (id, updates) => {
    const updated = await notesStorage.update(id, updates);
    if (updated) {
      set({
        notes: get().notes.map(n => n.id === id ? updated : n),
      });
    }
  },

  deleteNote: async (id) => {
    await notesStorage.remove(id);
    set({ notes: get().notes.filter(n => n.id !== id) });
  },
}));
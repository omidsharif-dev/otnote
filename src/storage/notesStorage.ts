import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note, NoteInput } from '@/types/note';

const STORAGE_KEY = '@otnote:notes';

export const notesStorage = {
  async getAll(): Promise<Note[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async save(notes: Note[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  },

  async add(note: NoteInput): Promise<Note> {
    const notes = await this.getAll();
    const newNote: Note = {
      ...note,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    notes.unshift(newNote);
    await this.save(notes);
    return newNote;
  },

  async update(id: string, updates: Partial<NoteInput>): Promise<Note | null> {
    const notes = await this.getAll();
    const index = notes.findIndex(n => n.id === id);
    if (index === -1) return null;

    const updated: Note = {
      ...notes[index],
      ...updates,
      updatedAt: Date.now(),
    };
    notes[index] = updated;
    await this.save(notes);
    return updated;
  },

  async remove(id: string): Promise<void> {
    const notes = await this.getAll();
    const filtered = notes.filter(n => n.id !== id);
    await this.save(filtered);
  },
};
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export type NoteInput = Pick<Note, 'title' | 'content'>;
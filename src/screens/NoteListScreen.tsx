import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, SafeAreaView, Platform, StatusBar, Alert } from 'react-native';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useNotesStore } from '@/store/notesStore';
import { NoteCard } from '@/components/NoteCard';
import { EmptyState } from '@/components/EmptyState';
import { NoteEditor } from '@/components/NoteEditor';

export const NoteListScreen: React.FC = () => {
  const { notes, isLoading, loadNotes, deleteNote } = useNotesStore();
  const [showEditor, setShowEditor] = React.useState(false);
  const [editingNote, setEditingNote] = React.useState<{ id: string; title: string; content: string } | null>(null);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const handleCreate = () => {
    setEditingNote(null);
    setShowEditor(true);
  };

  const handleEdit = (note: { id: string; title: string; content: string }) => {
    setEditingNote(note);
    setShowEditor(true);
  };

  const handleSave = async (title: string, content: string) => {
    if (editingNote) {
      await useNotesStore.getState().updateNote(editingNote.id, { title, content });
    } else if (title.trim() || content.trim()) {
      await useNotesStore.getState().addNote({ title, content });
    }
    setShowEditor(false);
    setEditingNote(null);
  };

  const handleCancel = () => {
    setShowEditor(false);
    setEditingNote(null);
  };

  const handleDelete = async (id: string) => {
    await deleteNote(id);
  };

  const handleLongPress = (note: { id: string; title: string; content: string }) => {
    Alert.alert(
      'Delete note?',
      'This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => handleDelete(note.id) },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading…</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ot note</Text>
        <TouchableOpacity style={styles.fab} onPress={handleCreate}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>

      {notes.length === 0 ? (
        <EmptyState onCreate={handleCreate} />
      ) : (
        <FlatList
          data={notes}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <NoteCard
              title={item.title}
              content={item.content}
              updatedAt={item.updatedAt}
              onPress={() => handleEdit(item)}
              onLongPress={() => handleLongPress(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {showEditor && (
        <NoteEditor
          initialTitle={editingNote?.title || ''}
          initialContent={editingNote?.content || ''}
          onSave={handleSave}
          onCancel={handleCancel}
          isEditing={!!editingNote}
        />
      )}
    </SafeAreaView>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    ...Typography.heading,
    color: Colors.text,
  },
  fab: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 3 },
    }),
  },
  fabText: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '300',
    lineHeight: 28,
  },
  listContent: {
    paddingBottom: Spacing.xl,
  },
});
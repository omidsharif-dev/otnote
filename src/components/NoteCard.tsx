import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, Shadow } from '@/constants/theme';

interface NoteCardProps {
  title: string;
  content: string;
  updatedAt: number;
  onPress: () => void;
  onLongPress?: () => void;
}

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (days === 1) {
    return 'Yesterday';
  } else if (days < 7) {
    return date.toLocaleDateString([], { weekday: 'short' });
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
};

export const NoteCard: React.FC<NoteCardProps> = ({
  title,
  content,
  updatedAt,
  onPress,
  onLongPress,
}) => {
  const preview = content || 'No content';
  const truncatedPreview = preview.length > 80 ? preview.slice(0, 80) + '…' : preview;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.9}
    >
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{title || 'Untitled'}</Text>
        <Text style={styles.preview} numberOfLines={2}>{truncatedPreview}</Text>
      </View>
      <Text style={styles.date}>{formatDate(updatedAt)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    ...Shadow,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  content: {
    flex: 1,
    marginRight: Spacing.md,
    minWidth: 0,
  },
  title: {
    ...Typography.title,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  preview: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  date: {
    ...Typography.caption,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
    flexShrink: 0,
  },
});
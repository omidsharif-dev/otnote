import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from '@/navigation/AppNavigator';
import { useNotesStore } from '@/store/notesStore';

const App: React.FC = () => {
  const loadNotes = useNotesStore(state => state.loadNotes);

  React.useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
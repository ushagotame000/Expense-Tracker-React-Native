import AppNavigator from '@/navigation/appNavigator';
import React from 'react';
import { AuthProvider } from './context/authContext';

const App = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

export default App;

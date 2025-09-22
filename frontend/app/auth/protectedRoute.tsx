import { Redirect, useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/authContext';
import { JSX } from 'react';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { token, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!token) {
    return <Redirect href="/auth/login" />;
  }

  return children;
}
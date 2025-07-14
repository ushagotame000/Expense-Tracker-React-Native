import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginForm from '@/app/auth/login';
import SignupForm from '@/app/auth/signup';
import HomePage from '@/app/pages/home';
import { useAuth } from '@/app/context/authContext';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { token } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {token ? (
          <Stack.Screen name="Home" component={HomePage} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginForm} />
            <Stack.Screen name="Register" component={SignupForm} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

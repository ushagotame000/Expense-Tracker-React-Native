<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream

import { router, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ToastAndroid } from 'react-native';
import { login } from '../api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginForm = () => {
  const [username, setusername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [usernameError, setusernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // <-- Moved inside component

  const validateForm = (): boolean => {
    let isValid = true;
    if (!username) {
      setusernameError('username is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(username)) {
      setusernameError('username is invalid');
      isValid = false;
    } else {
      setusernameError('');
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(\W|_)).{5,}$/.test(password)) {
      setPasswordError("Password must contain 1 number, 1 alphabet, 1 special character, and 1 capital letter");
      isValid = false;
    } else {
      setPasswordError("");
    }
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const response = await login(username, password);
      console.log(response.user)
      await AsyncStorage.setItem('access_token', response.access_token);
      await AsyncStorage.setItem('user_id',response.user_id);
      await AsyncStorage.setItem('user',JSON.stringify(response.user))
      // Show toast (Android only)
      if (Platform.OS === 'android') {
        ToastAndroid.show('Login Successful', ToastAndroid.SHORT);
      } else {
        Alert.alert('Success', 'Login Successful'); 
      }

      // Reset form
      setusername('');
      setPassword('');

      setTimeout(() => {
        router.replace('/pages/home'); 
      }, 500);
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }}
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Login</Text>
        
        <TextInput
          style={[styles.input, usernameError ? styles.inputError : null]}
          placeholder="username"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={username}
          onChangeText={setusername}
        />
        {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
        
        <TextInput
          style={[styles.input, passwordError ? styles.inputError : null]}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
        />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        
        <TouchableOpacity style={styles.button}
         onPress={handleLogin} 
         disabled={isLoading}>
          <Text style={styles.buttonText}>
             Login
          </Text>
           </TouchableOpacity>
        
        <TouchableOpacity style={styles.forgotButton}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>
         <TouchableOpacity onPress={()=>router.navigate('/auth/signup')} style={styles.signupButton}>
                    <Text style={styles.signupText}>
                      Don't have an account? <Text style={styles.signupLink}>Signup</Text>
                    </Text>
                  </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
    fontFamily: "Inter-SemiBold",
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
    fontFamily: "Inter-Regular",
  },
  inputError: {
    borderColor: 'red',
    fontFamily: "Inter-Regular",
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 14,
    fontFamily: "Inter-Regular",

  },
  button: {
    backgroundColor: '#00712D',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,

  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: "Inter-Bold",

  },
  forgotButton: {
    marginTop: 15,
    alignItems: 'center',
    color: '#00712D'
  },
  forgotText: {
    color: '#00712D',
    fontSize: 14,
  },
   signupButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  signupText: {
    color: '#666',
    fontFamily: "Inter-Regular",
    fontSize: 14,
  },
  signupLink: {
    color: "#00712D",
    fontFamily: "Inter-SemiBold",
  },
});

export default LoginForm;
=======
>>>>>>> Stashed changes

import { router, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ToastAndroid } from 'react-native';
import { login } from '../api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginForm = () => {
  const [username, setusername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [usernameError, setusernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // <-- Moved inside component

  const validateForm = (): boolean => {
    let isValid = true;
    if (!username) {
      setusernameError('username is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(username)) {
      setusernameError('username is invalid');
      isValid = false;
    } else {
      setusernameError('');
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(\W|_)).{5,}$/.test(password)) {
      setPasswordError("Password must contain 1 number, 1 alphabet, 1 special character, and 1 capital letter");
      isValid = false;
    } else {
      setPasswordError("");
    }
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      console.log("Logging in with:", username)
      const response = await login(username, password);
      console.log(response.user)
      await AsyncStorage.setItem('access_token', response.access_token);
      await AsyncStorage.setItem('user_id',response.user_id);
      await AsyncStorage.setItem('user',JSON.stringify(response.user))
      // Show toast (Android only)
      if (Platform.OS === 'android') {
        ToastAndroid.show('Login Successful', ToastAndroid.SHORT);
      } else {
        Alert.alert('Success', 'Login Successful'); 
      }

      // Reset form
      setusername('');
      setPassword('');

      setTimeout(() => {
        router.replace('/pages/home'); 
      }, 500);
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }}
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Login</Text>
        
        <TextInput
          style={[styles.input, usernameError ? styles.inputError : null]}
          placeholder="username"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={username}
          onChangeText={setusername}
        />
        {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
        
        <TextInput
          style={[styles.input, passwordError ? styles.inputError : null]}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
        />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        
        <TouchableOpacity style={styles.button}
         onPress={handleLogin} 
         disabled={isLoading}>
          <Text style={styles.buttonText}>
             Login
          </Text>
           </TouchableOpacity>
        
        <TouchableOpacity style={styles.forgotButton}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>
         <TouchableOpacity onPress={()=>router.navigate('/auth/signup')} style={styles.signupButton}>
                    <Text style={styles.signupText}>
                      Don't have an account? <Text style={styles.signupLink}>Signup</Text>
                    </Text>
                  </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
    fontFamily: "Inter-SemiBold",
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
    fontFamily: "Inter-Regular",
  },
  inputError: {
    borderColor: 'red',
    fontFamily: "Inter-Regular",
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 14,
    fontFamily: "Inter-Regular",

  },
  button: {
    backgroundColor: '#00712D',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,

  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: "Inter-Bold",

  },
  forgotButton: {
    marginTop: 15,
    alignItems: 'center',
    color: '#00712D'
  },
  forgotText: {
    color: '#00712D',
    fontSize: 14,
  },
   signupButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  signupText: {
    color: '#666',
    fontFamily: "Inter-Regular",
    fontSize: 14,
  },
  signupLink: {
    color: "#00712D",
    fontFamily: "Inter-SemiBold",
  },
});

export default LoginForm;
<<<<<<< Updated upstream
=======
>>>>>>> Stashed changes
>>>>>>> Stashed changes

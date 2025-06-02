import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  Dimensions,
  ScrollView
} from 'react-native';
import { validateSignupForm } from '../utils/validationUtils';
import { useRouter } from 'expo-router';

const { height, width } = Dimensions.get("window");

const SignupForm = () => {
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const routers = useRouter();

  const handleSignup = () => {
    const validation = validateSignupForm(email, password, fullName);
    setErrors({
      fullName: validation.errors.fullName || '',
      email: validation.errors.email || '',
      password: validation.errors.password || ''
    });

    if (validation.isValid) {
      Alert.alert(
        'Registration Successful',
        `Welcome ${fullName}! Your account has been created.`
      );
      setFullName('');
      setEmail('');
      setPassword('');
    }
  };

const router = useRouter(); 
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Image Header */}
        <ImageBackground
          source={require('@/assets/images/upperhalf.png')} // Update with your image path
          style={styles.imageBackground}
          resizeMode="cover"
        >
          <Text style={styles.title}>Create Account</Text>
        </ImageBackground>

        {/* Form Container */}
        <View style={styles.formContainer}>
          {/* Full Name Field */}
          <TextInput
            style={[styles.input, errors.fullName ? styles.inputError : null]}
            placeholder="Full Name"
            placeholderTextColor="#888"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />
          {errors.fullName ? <Text style={styles.errorText}>{errors.fullName}</Text> : null}

          {/* Email Field */}
          <TextInput
            style={[styles.input, errors.email ? styles.inputError : null]}
            placeholder="Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

          {/* Password Field */}
          <TextInput
            style={[styles.input, errors.password ? styles.inputError : null]}
            placeholder="Password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>routers.navigate('/pages/login')} style={styles.loginButton}>
            <Text style={styles.loginText}>
              Already have an account? <Text style={styles.loginLink}>Log In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  imageBackground: {
    width: '100%',
    height: height * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: 'white',
    fontFamily: "Inter-Bold",
    marginTop: height * 0.1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  formContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 5,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
    fontFamily: "Inter-Regular",
  },
  inputError: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFF0EF',
  },
  errorText: {
    color: '#FF3B30',
    marginBottom: 15,
    fontSize: 13,
    fontFamily: "Inter-Regular",
    marginLeft: 5,
  },
  button: {
    backgroundColor: '#00712D',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
  },
  loginButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  loginText: {
    color: '#666',
    fontFamily: "Inter-Regular",
    fontSize: 14,
  },
  loginLink: {
    color: "#00712D",
    fontFamily: "Inter-SemiBold",
  },
});

export default SignupForm;
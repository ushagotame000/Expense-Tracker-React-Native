import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';

const LoginForm = () => {
    const [email,setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')

const validateForm =():boolean=>{
    let isValid = true;
if (!email){
    setEmailError('Email is required');
    isValid = false;
}else if (!/\S+@\S+\.\S+/.test(email)){
    setEmailError('Email is invalid');
} else{
    setEmailError('')
}
// for password
if(!password){
    setPasswordError("Password is required");
    isValid= false;
}
else if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(\W|_)).{5,}$/.test(password)){
    setPasswordError("Passwod must contain 1 number 1 alphabet 1 character and 1 Capital letter")
    isValid = false
}
else{
    setPasswordError("")
}
return isValid
}
    
    const handleLogin=()=>{
        if(validateForm()){
            Alert.alert('Login Successful', `Welcome, ${email}!`)
            setEmail('')
            setPassword('')
        }
        console.log({email},"the email is")
    }
  
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Login</Text>
        
        <TextInput
          style={[styles.input, emailError ? styles.inputError : null]}
          placeholder="Email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        
        <TextInput
          style={[styles.input, passwordError ? styles.inputError : null]}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          autoCapitalize="none"
        />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        
        <TouchableOpacity style={styles.button} >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.forgotButton}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
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
});

export default LoginForm;
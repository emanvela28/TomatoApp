import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await api.post('/login', { username, password });
      await AsyncStorage.setItem('token', response.data.access_token);
      navigation.navigate('Main');  // Redirect after login
    } catch (error) {
      setError('Invalid username or password');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 },
  error: { color: 'red', marginBottom: 10 },
});

export default LoginScreen;


const handleLogin = async () => {
    try {
      console.log("🟢 Attempting login...");
      
      const apiUrl = process.env.API_URL + "/login";
      console.log("🟢 API URL:", apiUrl);
  
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });
  
      const responseData = await response.json();
      console.log("✅ Login Response:", responseData);
  
      if (response.ok) {
        console.log("✅ Token saved! Navigating to Home...");
        navigation.navigate("Home");
      } else {
        console.log("❌ Login failed:", responseData);
        setError("Invalid username or password");
      }
    } catch (error) {
      console.log("❌ Login Error:", error);
      setError("Network error, please try again.");
    }
  };
  
  
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import HomeScreen from './screens/HomeScreen';  
import InboxScreen from './screens/InboxScreen'; 
import AlertScreen from './screens/AlertScreen'; 
import GameScreen from './screens/GameScreen'; 
import ProfileScreen from './screens/ProfileScreen'; 

const Stack = createNativeStackNavigator();

// Replace this with your local IP address
const BASE_URL = 'http://192.168.1.34/crimeless/api.php';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch(`${BASE_URL}?action=login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `username=${username}&password=${password}`,
      });

      const data = await response.json();

      if (data.success) {
        await AsyncStorage.setItem('username', username);
        Alert.alert('Login successful!');
        navigation.navigate('Home');  // Change to navigate to Home after login
      } else {
        Alert.alert('Login failed', data.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      Alert.alert('Error', 'Could not log in. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('./assets/crimeless_logo.png')} style={styles.logo} />
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        placeholderTextColor="#666"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#666"
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>LOG IN</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.switchText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const RegisterScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState(''); 
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match');
      return;
    }
  
    try {
      const response = await fetch(`${BASE_URL}?action=register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `username=${username}&password=${password}&email=${email}&phone=${phone}&address=${address}`,
      });
  
      const data = await response.json();
  
      if (data.success) {
        Alert.alert('Registration successful!');
        navigation.navigate('Login');
      } else {
        Alert.alert('Registration failed', data.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error registering:', error);
      Alert.alert('Error', 'Could not register. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('./assets/crimeless_logo.png')} style={styles.logo} />
      <Text style={styles.title}>LET'S GET STARTED!</Text>
      <Text style={styles.subtitle}>Create an account on CrimeLess to get all Features</Text>
      <TextInput
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
        placeholderTextColor="#666"
      />
      <TextInput
        placeholder="Address"  
        value={address}
        onChangeText={setAddress}
        style={styles.input}
        placeholderTextColor="#666"
      />
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        placeholderTextColor="#666"
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholderTextColor="#666"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#666"
      />
      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#666"
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>SUBMIT</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.switchText}>
          Already have an account? <Text style={styles.loginText}>Log in here.</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Inbox" component={InboxScreen} />
        <Stack.Screen name="Alert" component={AlertScreen} />
        <Stack.Screen name="Games" component={GameScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Your existing styles remain unchanged
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFA500',
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 30,
    marginBottom: 15,
    width: '100%',
    padding: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#B22222',
    borderRadius: 30,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchText: {
    color: '#fff',
    marginTop: 15,
    fontSize: 16,
  },
  loginText: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default App;

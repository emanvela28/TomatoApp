import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './LoginScreen';

// Home Screen
const HomeScreen = () => (
  <View style={styles.container}>
    <Text>Welcome to the Home Screen!</Text>
  </View>
);

// Dashboard Screen
const DashboardScreen = () => (
  <View style={styles.container}>
    <Text>This is the Dashboard Screen</Text>
  </View>
);

// Truck Screen
const TruckScreen = () => (
  <View style={styles.container}>
    <Text>This is the Truck Screen</Text>
  </View>
);

// Bottom Tabs Navigator
const Tab = createBottomTabNavigator();
const BottomTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Dashboard') {
          iconName = focused ? 'stats-chart' : 'stats-chart-outline';
        } else if (route.name === 'Truck') {
          iconName = focused ? 'car' : 'car-outline';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#2E86C1',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: { backgroundColor: '#f8f9fa', height: 60 },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Truck" component={TruckScreen} />
  </Tab.Navigator>
);

// Stack Navigator (Login + Bottom Tabs)
const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const forceLogin = async () => {
      await AsyncStorage.removeItem('token');  // 🔥 Always clear token on app start
      console.log("✅ Token cleared. User must log in.");
      setIsLoggedIn(false);
      setIsLoading(false);
    };
    forceLogin();
  }, []);

  // Show a loading screen while checking auth
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2E86C1" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? "Main" : "Login"}>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={BottomTabNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles
const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

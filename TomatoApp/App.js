import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './LoginScreen';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';


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

import { useNavigation } from '@react-navigation/native';

const TruckScreen = ({ navigation }) => {
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://192.168.1.86:5000/api/trucks")
      .then((response) => response.json())
      .then((data) => {
        console.log("🚚 Truck Data:", data);
        setTrucks(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ Error fetching truck data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2E86C1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🚛 Truck Data</Text>
      {trucks.length === 0 ? (
        <Text>No trucks available</Text>
      ) : (
        trucks.map((truck) => (
          <TouchableOpacity
            key={truck.truck_id}
            style={styles.truckCard}
            onPress={() => navigation.navigate("TruckDetails", { truck })}
          >
            <View style={styles.truckRow}>
              <Text style={styles.truckTitle}>Truck ID: {truck.truck_id}</Text>
            </View>

            <View style={styles.truckRow}>
              <Text style={styles.truckInfo}>📋 License Plate: {truck.license_plate}</Text>
            </View>

            <View style={styles.truckRow}>
              <Text style={[styles.truckStatus, truck.status === "completed" ? styles.completed : styles.pending]}>
                {truck.status === "completed" ? "✅ Status: Completed" : "⏳ Status: " + truck.status}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
};


const TruckDetailsScreen = ({ route }) => {
  const { truck } = route.params; // Get truck data from navigation

  return (
    <View style={detailsStyles.container}>
      {/* Truck Header */}
      <Text style={detailsStyles.header}>Trailer {truck.truck_id} Information</Text>

      {/* Recommendation Section */}
      <Text style={detailsStyles.subHeader}>
        Recommendation:{" "}
        <Text style={detailsStyles.boldText}>
          {truck.status === "completed" ? " Dispatch Approved" : "Pending"}
        </Text>
      </Text>

      {/* Percentage Details */}
      <View style={detailsStyles.infoBox}>
        <Text style={detailsStyles.label}>Percentage of tomatoes over {"<size>"}:</Text>
        <Text style={detailsStyles.pendingText}>Pending</Text>
      </View>

      <View style={detailsStyles.infoBox}>
        <Text style={detailsStyles.label}>Percentage of tomatoes under {"<size>"}:</Text>
        <Text style={detailsStyles.pendingText}>Pending</Text>
      </View>

      {/* Truck Information */}
      <Text style={detailsStyles.sectionTitle}>Truck Information:</Text>

      <View style={detailsStyles.infoContainer}>
        <View style={detailsStyles.infoRow}>
          <Text style={detailsStyles.infoText}>📋 License Plate: {truck.license_plate}</Text>
        </View>
        <View style={detailsStyles.infoRow}>
          <Text style={detailsStyles.infoText}>⏱️ Arrival Time: {truck.arrival_time}</Text>
        </View>
        <View style={detailsStyles.infoRow}>
          <Text style={detailsStyles.infoText}>
            📌 Status: {truck.status === "completed" ? "✅ Completed" : "⏳ " + truck.status}
          </Text>
        </View>
        <View style={detailsStyles.infoRow}>
          <Text style={detailsStyles.infoText}>
            ⏳ Departure Time: {truck.departure_time || "Not Departed"}
          </Text>
        </View>
      </View>
    </View>
  );
};



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
        <Stack.Screen name="TruckDetails" component={TruckDetailsScreen} options={{ title: "Truck Details" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles
const styles = {
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  truckCard: {
    width: "90%",
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  truckRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  truckTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  truckInfo: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  truckStatus: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  completed: {
    color: "green",
  },
  pending: {
    color: "red",
  },
};


const detailsStyles = {
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
    textAlign: "center",
  },
  boldText: {
    fontWeight: "bold",
    color: "#2E86C1",
  },
  infoBox: {
    width: "90%",
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 5,
    textAlign: "center",
  },
  infoContainer: {
    width: "90%",
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    textAlign: "left",
  },
};

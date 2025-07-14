import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import ProtectedRoute from "../components/protectedRoute";
import { AuthProvider } from "../context/authContext";

export default function PagesLayout() {
  return (
    <AuthProvider>
    <ProtectedRoute>
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#00712D",
        tabBarInactiveTintColor: "#333333",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" color={color} size={35} />
          ),
        }}
      />
      <Tabs.Screen
        name="transaction"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="signal" color={color} size={35} />
          ),
        }}
      />
      <Tabs.Screen
        name="stock"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="trending-up"
              color={color}
              size={35}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" color={color} size={35} />
          ),
        }}
      />
    </Tabs>
    </ProtectedRoute>
    </AuthProvider>
  );
}


import { FontAwesome, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import ProtectedRoute from "../auth/protectedRoute";
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
              tabBarLabel: "Home",
              tabBarIcon: ({ color }) => (
                <FontAwesome name="home" color={color} size={35} />
              ),
            }}
          />
          <Tabs.Screen
            name="transaction"
            options={{
              tabBarLabel: "Transactions",
              tabBarIcon: ({ color }) => (
                <FontAwesome name="signal" color={color} size={35} />
              ),
            }}
          />
          <Tabs.Screen
            name="category"
            options={{
              tabBarLabel: "Category",
              tabBarIcon: ({ color }) => (
                <MaterialIcons
                  name="category"
                  color={color}
                  size={35}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="prediction"
            options={{
              tabBarLabel: "Predication",
              tabBarIcon: ({ color }) => (
                <MaterialIcons
                  name="online-prediction"
                  color={color}
                  size={35}
                />
              ),
            }}
          />



          <Tabs.Screen
            name="profile"
            options={{
              tabBarLabel: "Profile",
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



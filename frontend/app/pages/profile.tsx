import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { icons } from "@/assets/images/assets";
import ListItem from "../components/ListItem";
import { useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { height } = Dimensions.get("window");

export default function Profile() {
  const [user, setUser] = useState<any>();
  
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData !== null) {
          setUser(JSON.parse(userData));
        }
      } catch (e) {
        console.log("Failed to load user data", e);
      }
    };
    loadUserData();
  }, []);

  const logout = () => {
    alert("Logout pressed"); 
    localStorage.removeItem("access_token")
    localStorage.removeItem("user_id")
    localStorage.removeItem("user")

    
  };

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Background Header Image */}
      <ImageBackground
        source={icons.Upperhalf}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
          >
            <FontAwesome name="arrow-left" size={20} color="#ffffff" />
          </TouchableOpacity>

          <Text style={styles.title}>Profile</Text>

          <TouchableOpacity style={styles.iconButton}>
            <FontAwesome name="bell" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* Profile Section */}
      <View style={styles.body}>
        <View style={styles.profileImageContainer}>
          <FontAwesome name="user" size={150} color="#00712D" />
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{user?.username}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <View style={styles.listContainer}>
          <ListItem icon="diamond" text="Invite Friends" />
          <ListItem icon="user" text="Account info" />
          <ListItem icon="users" text="Personal profile" />
          <ListItem icon="envelope" text="Message center" />
          <ListItem icon="shield" text="Login and security" />
          <ListItem icon="lock" text="Data and privacy" />
          <TouchableOpacity onPress={logout}>
            <ListItem icon="arrow-left" text="Logout" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageBackground: {
    height: height * 0.4,
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: -1, 
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 35,
    paddingHorizontal: 20,
  },
  iconButton: {
    borderRadius: 10,
    padding: 2,
    width: 40,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  body: {
    flex: 1,
    padding: 20,
    marginTop: height * 0.35, 
  },
  profileImageContainer: {
    height: 170,
    width: 170,
    borderRadius: 85,
    backgroundColor: "#eee",
    alignSelf: "center",
    marginTop: -80, 
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    alignItems: "center",
    padding: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
  },
  email: {
    fontSize: 14,
    color: "#00712D",
  },
  listContainer: {
    marginTop: 20,
    gap: 20,
  },
});

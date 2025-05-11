import { FontAwesome } from "@expo/vector-icons";
import React from "react";
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

const { height } = Dimensions.get("window");

export default function Profile() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={icons.Upperhalf}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton}>
            <FontAwesome name="arrow-left" size={20} color="#ffffff" />
          </TouchableOpacity>

          <Text style={styles.title}>Profile</Text>

          <TouchableOpacity style={styles.iconButton}>
            <FontAwesome name="bell" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <View style={styles.body}>
        <View style={styles.profileImage}>
          <FontAwesome name="user" size={150} color="#00712D" />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>Usha Gotame</Text>
          <Text style={styles.email}>@Usha Gotame</Text>
        </View>

        <View style={styles.listContainer}>
          <ListItem icon="diamond" text="Invite Friends" />
          <ListItem icon="user" text="Account info" />
          <ListItem icon="users" text="Personal profile" />
          <ListItem icon="envelope" text="Message center" />
          <ListItem icon="shield" text="Login and security" />
          <ListItem icon="lock" text="Data and privacy" />
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
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 8,
    borderRadius: 10,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  body: {
    flex: 1,
    padding: 20,
  },
  profileImage: {
    height: 170,
    width: 170,
    borderRadius: 100,
    backgroundColor: "#eee",
    alignSelf: "center",
    marginTop: "-40%",
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    alignItems: "center",
    padding: 12,
  },
  name: {
    fontSize: 20,
    fontFamily: "Inter-SemiBold",
  },
  email: {
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    color: "#00712D",
  },
  listContainer: {
    marginTop: 5,
    gap: 20,
  },
});

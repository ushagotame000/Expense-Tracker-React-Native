import React, { ReactNode } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface ContainerProps {
  title: string;
  children: ReactNode;
}

const Container: React.FC<ContainerProps> = ({ title, children }) => {
  const router = useRouter();

  return (
    <View style={styles.pageBackground}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <FontAwesome name="chevron-left" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.editTitle}>{title}</Text>
      <View style={styles.container}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageBackground: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "green",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "white",
    marginTop: "10%",
  },
  backButton: {
    position: "absolute",
    top: 30,
    left: 20,
    zIndex: 1,
  },
  editTitle: {
    fontSize: 32,
    fontWeight: "500",
    color: "#fff",
    textAlign: "center",
    alignItems: "center",
  },
});

export default Container;

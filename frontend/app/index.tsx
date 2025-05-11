import { Link, useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { icons } from "../assets/images/assets"; // Adjust path as needed

export default function Index() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Image source={icons.Man} style={styles.image} resizeMode="contain" />
      <View style={styles.textContainer}>
        <Text style={styles.text}>Spend Smarter{"\n"}Save More</Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.navigate("/pages/home")}
      >
        <Text style={styles.btntext}>Get Started</Text>
      </TouchableOpacity>
      <Link
        href={{
          pathname: "/pages/[type]/[id]",
          params: { type: "Expense", id: 0 },
        }}
        style={styles.button}
      >
        <Text style={styles.btntext}>Add Expense</Text>
      </Link>
      <TouchableOpacity>
        <Text style={styles.loginText}>
          Already Have Account? <Text style={styles.loginLink}>Log In</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  image: {
    width: "100%",
    height: "60%",
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 36,
    color: "#00712D",
    fontFamily: "Inter-Bold",
    textAlign: "center",
    marginTop: "-3%",
  },
  button: {
    backgroundColor: "#00712D",
    width: "80%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    marginTop: 20,
  },
  btntext: {
    color: "white",
    fontFamily: "Inter-SemiBold",
    fontSize: 15,
  },
  loginText: {
    color: "black",
    fontFamily: "Inter-Regular",
    fontSize: 14,
    marginTop: 15,
  },
  loginLink: {
    color: "#00712D",
    fontFamily: "Inter-SemiBold",
  },
});

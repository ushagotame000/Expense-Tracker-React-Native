import { icons } from "@/assets/images/assets";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const { height } = Dimensions.get("window");

export default function HomePage() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={icons.Upperhalf}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good afternoon,</Text>
            <Text style={styles.name}>Usha Gotame</Text>
          </View>
          <TouchableOpacity style={styles.bellIcon}>
            <FontAwesome name="bell" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <View style={styles.body}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>
              Total Balance {"\n"}
              <Text style={styles.balance}>$2,548.00</Text>
            </Text>
            <TouchableOpacity style={styles.ellipsis}>
              <FontAwesome name="ellipsis-h" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
          <View style={styles.cardHeader}>
            <Text style={styles.expenses}>
              <FontAwesome
                name="arrow-up"
                size={5}
                color="#ffffff"
                style={styles.arrowIcon}
              />
              Income {"\n"}
              <Text style={styles.expensesBalance}>$1840.00</Text>
            </Text>
            <Text style={styles.expenses}>
              Expenses {"\n"}
              <Text style={styles.expensesBalance}>$1840.00</Text>
            </Text>
          </View>
        </View>
        <Text style={styles.sectionTitle}>home page</Text>
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
    alignItems: "flex-start",
  },
  greeting: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "400",
  },
  name: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  bellIcon: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 8,
    borderRadius: 10,
  },
  body: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#25A969",
    borderRadius: 10,
    padding: 20,
  },
  ellipsis: {
    padding: 8,
    borderRadius: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 14,
    color: "#ffffff",
    fontFamily: "Inter-SemiBold",
    lineHeight: 30,
  },
  balance: {
    fontSize: 30,
    color: "#ffffff",
    fontFamily: "Inter-Bold",
    lineHeight: 40,
  },
  expenses: {
    fontSize: 15,
    color: "#ffffff",
    fontFamily: "Inter-Regular",
    marginTop: 10,
  },
  expensesBalance: {
    fontSize: 20,
    color: "#ffffff",
    fontFamily: "Inter-SemiBold",
  },
  arrowIcon: {
    width: 5,
    marginLeft: "-2%",
  },
});

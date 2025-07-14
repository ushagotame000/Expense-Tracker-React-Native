import { icons } from "@/assets/images/assets";
import React, { useState } from "react";
import { Feather, FontAwesome } from "@expo/vector-icons";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Link } from "expo-router";

const { height, width } = Dimensions.get("window");

export default function HomePage() {
  const [modalVisible, setModalVisible] = useState(false);

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
              <Feather
                name="arrow-up"
                size={13}
                color="#ffffff"
                style={styles.arrowIcon}
              />
              Income {"\n"}
              <Text style={styles.expensesBalance}>$1840.00</Text>
            </Text>
            <Text style={styles.expenses}>
              <Feather
                name="arrow-down"
                size={13}
                color="#ffffff"
                style={styles.arrowIcon}
              />
              Expenses {"\n"}
              <Text style={styles.expensesBalance}>$1840.00</Text>
            </Text>
          </View>
        </View>

        <View style={styles.transactionHeader}>
          <Text style={styles.transactionTitle}>Transaction History</Text>
          <Text style={styles.semiTitle}>See all</Text>
        </View>
        <View>
          <View style={styles.items}>
            <Text style={styles.sectionTitle}>
              Upwork {"\n"}
              <Text style={styles.semiTitle}>Today</Text>
            </Text>
            <Text style={styles.transactionBalance}>+$850.00</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setModalVisible(true)}
      >
        <Feather name="plus" size={32} color="#fff" />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
                <Text style={styles.modalTitle}>Add Transaction</Text>
                <TouchableOpacity style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Add Income</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.expenseButton]}
                >
                  <Link
                          href={{
                            pathname: "/screen/[type]/[id]",
                            params: { type: "Expense", id: 0 },
                          }}>
                  <Text style={styles.modalButtonText}>Add Expense</Text>
                     </Link>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
    marginTop: "5%",
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
    borderRadius: 15,
    padding: 20,
    marginTop: "-45%",
    borderColor: "black",
    borderWidth: 0.5,
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
    width: 15,
    marginLeft: "-2%",
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 25,
  },
  transactionTitle: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
  },
  semiTitle: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#666666",
  },
  items: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: "5%",
  },
  transactionBalance: {
    color: "#25A969",
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
  },
  floatingButton: {
    position: "absolute",
    bottom: 5,
    left: width / 2 - 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#00712D",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00712D",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Inter-SemiBold",
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: "#00712D",
    padding: 10,
    marginVertical: 8,
    borderRadius: 13,
    width: "100%",
    alignItems: "center",
  },
  expenseButton: {
    backgroundColor: "#C20000",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter-Regular",
  },
});

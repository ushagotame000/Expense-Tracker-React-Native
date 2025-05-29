import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { LineChart } from "react-native-chart-kit";
import LineGraph from "../components/LineGraph";

export default function Transaction() {
  const [activeFilter, setActiveFilter] = useState("Day");

  const filters = ["Day", "Week", "Month", "Year"];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <FontAwesome name="angle-left" size={20} color="#ffffff" />
        </TouchableOpacity>

        <Text style={styles.title}>Statistics</Text>

        <TouchableOpacity style={styles.iconButton}>
          <FontAwesome name="download" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Filter Buttons */}
      <View style={styles.buttonContainer}>
        {filters.map((label) => {
          const isActive = label === activeFilter;
          return (
            <TouchableOpacity
              key={label}
              style={[styles.button, isActive && styles.activeButton]}
              onPress={() => setActiveFilter(label)}
            >
              <Text
                style={[styles.buttonText, isActive ? styles.activeText : styles.inactiveText]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {/* dropdown */}
      <View style={styles.dropdownContainer}>
      <Picker style={styles.pickerText}
      >
        <Picker.Item label="Expense" />
        <Picker.Item label="Income" />
      </Picker>
      </View>
      {/* linegraph */}
<View style={{ flex: 1 }}>
        <LineGraph/>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "10%",
  },
  iconButton: {
    backgroundColor: "#222222",
    padding: 8,
    borderRadius: 10,
  },
  title: {
    color: "#222222",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Inter-Bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  activeButton: {
    backgroundColor: "#00712D",
  },
  buttonText: {
    fontFamily: "Inter-Regular",
    fontWeight: "600",
  },
  activeText: {
    color: "#ffffff",
  },
  inactiveText: {
    color: "#666666",
    fontWeight:"semibold"
  },
  dropdownContainer:{
    borderColor:"#666666",
    borderRadius:10,
     borderWidth: 1,
     marginTop:20,
     width:"50%",
     display:"flex",
    alignSelf:"flex-end"
  },
   pickerText: {
    color: "#666666",
    fontWeight:"semibold",
    fontFamily: "Inter-Regular",

  },
});

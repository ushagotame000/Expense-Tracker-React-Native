import { icons } from "@/assets/images/assets";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from "@react-native-picker/picker";

import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import StyledInput from "../../../components/inputs/StyledInput";

const { height } = Dimensions.get("window");

export default function AddPage() {
  const { type, id } = useLocalSearchParams();
  const [typeName, setTypeName] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedAccount, setSelectedAccount] = useState();
  const [inputDate, setInputDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [visible, setVisible] = React.useState(false);
  
  const onDismiss = React.useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || inputDate;
    setShowDatePicker(false);
    setInputDate(currentDate);
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || inputDate;
    setShowTimePicker(false);
    setInputDate(currentTime);
  };

  const handleAdd=()=>{
    console.log("button add clicked")
  }
  return (
    <View style={styles.container}>
      <ImageBackground
        source={icons.Upperhalf}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <View style={styles.header}>
          <AntDesign name="left" size={24} color="white" />
          <Text style={styles.name}>
            {id === "0" ? "Add " + type : "Edit " + type}
          </Text>
          <TouchableOpacity style={styles.bellIcon}>
            <FontAwesome name="bell" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <View
        style={{
          flex: 1,
          position: "absolute",
          justifyContent: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <View style={styles.form_container}>
          <Text style={styles.label}>Name</Text>
          <StyledInput
            value={typeName}
            onChangeText={setTypeName}
            placeholder="Enter amount"
            style={{ marginTop: 16 }}
          />

          <Text style={styles.label}>Account</Text>
          <Picker
            selectedValue={selectedAccount}
            onValueChange={(itemValue) => setSelectedAccount(itemValue)}
            style={{ borderColor: "#DDDDDD", borderWidth: 2 }}
          >
            <Picker.Item label="Cash" value="Cash" />
            <Picker.Item label="Bank" value="Bank" />
          </Picker>

          <Text style={styles.label}>Amount</Text>
          <StyledInput
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter amount"
            keyboardType="numeric"
            style={{ marginTop: 16 }}
          />

          <Text style={styles.label}>Date</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
            <Text>{inputDate.toLocaleDateString()}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={inputDate}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}

          <Text style={styles.label}>Time</Text>
          <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.datePicker}>
            <Text>{inputDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          </TouchableOpacity>

          {showTimePicker && (
            <DateTimePicker
              value={inputDate}
              mode="time"
              display="default"
              onChange={onTimeChange}
            />
          )}

          <TouchableOpacity style={styles.submitBtn} onPress={handleAdd}>
            <Text style={[styles.name, { textAlign: "center" }]}>Add</Text>
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
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
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
  form_container: {
    backgroundColor: "#ffffff",
    flex: 1,
    marginHorizontal: "6%",
    maxHeight: "70%",
    padding: 20,
    paddingVertical: 35,
    borderRadius: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  submitBtn: {
    width: "100%",
    backgroundColor: "#00712D",
    margin: 5,
    padding: 8,
    borderRadius: 8,
  },
  label: {
    color: "#666666",
    fontSize: 15,
    fontWeight: "bold",
    padding: 5,
    marginHorizontal: 5,
  },
  datePicker: {
    borderColor: "#DDDDDD",
    borderWidth: 2,
    padding: 10,
    borderRadius: 5,
    marginTop: 16,
    alignItems: "center",
  },
});

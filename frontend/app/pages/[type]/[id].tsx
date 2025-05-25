import { icons } from "@/assets/images/assets";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
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
import { TextInput } from "react-native-paper";
import { DatePickerInput, TimePickerModal } from "react-native-paper-dates";
import StyledInput from "../../../components/inputs/StyledInput";
const { height } = Dimensions.get("window");
export default function AddPage() {
  const { type, id } = useLocalSearchParams();
  const [typeName, setTypeName] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedAccount, setSelectedAccount] = useState();
  const [inputDate, setInputDate] = useState<any>();
  const [visible, setVisible] = React.useState(false);
  const onDismiss = React.useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const onConfirm = React.useCallback(
    ({ hours, minutes }) => {
      setVisible(false);
      console.log({ hours, minutes });
    },
    [setVisible]
  );

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
          {/* <TextInput placeholder="Account" style={styles.form_control} /> */}
          <Picker
            selectedValue={selectedAccount}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedAccount(itemValue)
            }
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
          ></StyledInput>
          <Text style={styles.label}>Date</Text>
          <View
            style={{
              justifyContent: "space-between",
              flex: 1,
              alignItems: "center",
              flexDirection: "row",
              width:'100%'
            }}
          >
            <DatePickerInput
              locale="en"
              label="Date"
              value={inputDate}
              onChange={(d) => setInputDate(d)}
              inputMode="start"
              inputEnabled={false}
              style={{width:1}}
              presentationStyle='pageSheet'
            />
            <View>
              {/* <Button
                onPress={() => setVisible(true)}
                uppercase={false}
                mode="outlined"
              >
                Pick time
              </Button> */}
              <View
                style={{ flex: 1, flexDirection: "row", alignItems: "center",width:100, marginLeft:'5%', paddingHorizontal:5 }}
              >
                <TextInput placeholder="12"  /> <Text>:</Text>
                <TextInput placeholder="12"  />
              </View>
              <TimePickerModal
                visible={visible}
                onDismiss={onDismiss}
                onConfirm={onConfirm}
                hours={12}
                minutes={14}
              />
            </View>
          </View>
          <View
            style={{ justifyContent: "center", flex: 1, alignItems: "center" }}
          ></View>

          <TouchableOpacity style={styles.submitBtn}>
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
  label: {
    color: "#666666",
    fontSize: 15,
    fontWeight: "bold",
    fontFamily: "Inter-Bold",
    padding: 5,
    marginHorizontal: 5,
  },
  form_control: {
    borderWidth: 2,
    padding: 5,
    borderRadius: 5,
    borderColor: "#DDDDDD",
    margin: 5,
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
    position:'static'
  },
  submitBtn: {
    width: "100%",
    backgroundColor: "#00712D",
    margin: 5,
    padding: 8,
    borderRadius: 8,
  },
});

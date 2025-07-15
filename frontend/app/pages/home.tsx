import { icons } from "@/assets/images/assets";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { AccountData, getAllUserAccounts } from "../api/account";
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { addAccount } from "../api/account";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { height, width } = Dimensions.get("window");

export default function HomePage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAccountVisible, setModalAccountVisible] = useState(false);
  const [newAccountName, setNewAccountName] = useState("");
  const [initialBalance, setInitialBalance] = useState("0");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [expenseBalance, setExpenseBalance] = useState("0");
  const [newExpanseName, setNewExpanseName] = useState("");
  const [isExpenseModalVisible, setExpenseModelVisible] = useState(false);
  const handleAddaccount = async () => {
    if (!newAccountName.trim()) {
      setError('Account name is required');
      return;
    }
    try {
      const userId = await AsyncStorage.getItem('user_id');
      console.log("userid is", userId)

      if (!userId) {
        setError('User not authenticated');
        return;
      }
      const accountData: AccountData = {
        user_id: userId,
        name: newAccountName.trim(),
        balance: parseFloat(initialBalance) || 0,
      };
      setIsLoading(true);
      setError("");
      const response = await addAccount(accountData);
      console.log('account added successfully:', response);
      setModalAccountVisible(false);
      setModalVisible(false);
      setNewAccountName(""),
        setInitialBalance("0");
    }
    catch (err) {
      console.log("failed to add account:", err);
      setError("failed to add account. Please try again.")
    }
    finally {
      setIsLoading(false);
    }
  }

  const userId = AsyncStorage.getItem('user_id');
  useEffect(() => {
    const fetchUserAccount = async () => {
      try {
        const userId = await AsyncStorage.getItem('user_id');
        if (userId) {
          const userAccounts = await getAllUserAccounts(userId);
          console.log('fetched accout:', userAccounts)
          setAccounts(userAccounts);
        }
      } catch (err) {
        setError('Failed to fetch accounts');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    console.log("userid is from fetch", userId);

    fetchUserAccount();
  }, []);



  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4db078ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }


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
        <TouchableOpacity
          style={{ backgroundColor: 'black' }}
          onPress={() => setModalAccountVisible(true)}
        >
          <Feather name="plus" size={32} color="#fff" />
        </TouchableOpacity>
        {/* <ScrollView horizontal style={styles.accountScrollContainer} > */}
        <View style={styles.accountContainer}>
          <View style={styles.accountCard}>
            <Text>Ac Name</Text>
            <Text>Rs 100000</Text>
            <Text>5 Transactions</Text>


          </View>
          <View style={styles.accountCard}>
            <Text>Ac Name</Text>
            <Text>Rs 100000</Text>
            <Text>5 Transactions</Text>


          </View>
          <View style={styles.accountCard}>
            <Text>Ac Name</Text>
            <Text>Rs 100000</Text>
            <Text>5 Transactions</Text>


          </View>
          <View style={styles.accountCard}>
            <Text>Ac Name</Text>
            <Text>Rs 100000</Text>
            <Text>5 Transactions</Text>


          </View>
          <View style={styles.accountCard}>
            <Text>Ac Name</Text>
            <Text>Rs 100000</Text>
            <Text>5 Transactions</Text>


          </View>
        </View>
        {/* </ScrollView> */}
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
                  onPress={() => setExpenseModelVisible(true)}
                >
                  <Link
                    href={{
                      pathname: "/pages/[type]/[id]",
                      params: { type: "Expense", id: 0 },
                    }}>
                    <Text style={styles.modalButtonText}>Add Expense</Text>
                  </Link>
                </TouchableOpacity>

                {/* expense model */}
                <Modal
                  visible={isExpenseModalVisible}
                  animationType="slide"
                  transparent={true}
                  onRequestClose={() => setExpenseModelVisible(false)}
                >
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <Text style={styles.modalTitle}>Expense</Text>

                      <TextInput
                        style={styles.input}
                        placeholder="Expense Name"
                        value={newExpanseName}
                        onChangeText={setNewExpanseName}
                      />

                      <View style={styles.balanceContainer}>
                        <TextInput
                          style={[styles.input, { flex: 1 }]}
                          placeholder="Balance"
                          value={expenseBalance}
                          onChangeText={setExpenseBalance}
                          keyboardType="numeric"
                        />

                      </View>

                      <View style={styles.buttonContainer}>
                        <TouchableOpacity
                          style={[styles.actionButton, styles.cancelButton]}
                          onPress={() => setExpenseModelVisible(false)}
                        >
                          <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.actionButton, styles.submitButton]}
                          onPress={() => console.log("expense button clicked!")}
                        >
                          <Text style={styles.buttonText}>Add</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>
                {/* end expanse modal */}

              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalAccountVisible}
        onRequestClose={() => setModalAccountVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalAccountVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
                <Text style={styles.modalTitle}>Select Accounts</Text>

                {/* Account options */}
                <View style={styles.container}>
                  {accounts.length > 0 ? (
                    accounts.map((account) => (
                      <View key={`${account.user_id}-${account.name}`} style={styles.accountCard}>
                        <Text>{account.name}</Text>
                        <Text>Rs {account.balance.toFixed(2)}</Text>
                        <Text>0 Transactions</Text>
                      </View>
                    ))
                  ) : (
                    <Text>No accounts found</Text>
                  )}
                </View>
                <TouchableOpacity style={styles.accountOption}>
                  <Text style={styles.accountText}>Cash</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => setIsModalVisible(true)}
                >
                  <View style={styles.addButtonContent}>
                    <Ionicons name="add" size={25} color="white" />
                    <Text style={styles.addButtonText}>Add</Text>
                  </View>
                </TouchableOpacity>

                {/* Add Account Modal */}
                <Modal
                  visible={isModalVisible}
                  animationType="slide"
                  transparent={true}
                  onRequestClose={() => setIsModalVisible(false)}
                >
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <Text style={styles.modalTitle}>Add New Account</Text>

                      <TextInput
                        style={styles.input}
                        placeholder="Account Name"
                        value={newAccountName}
                        onChangeText={setNewAccountName}
                      />

                      <View style={styles.balanceContainer}>
                        <TextInput
                          style={[styles.input, { flex: 1 }]}
                          placeholder="Balance"
                          value={initialBalance}
                          onChangeText={setInitialBalance}
                          keyboardType="numeric"
                        />
                        <Picker
                          // selectedValue={}
                          style={styles.currencyPicker}
                        // onValueChange={(itemValue) => setCurrency(itemValue)}
                        >
                          <Picker.Item label="₹ INR" value="INR" />
                          <Picker.Item label="$ USD" value="USD" />
                          <Picker.Item label="€ EUR" value="EUR" />
                          <Picker.Item label="£ GBP" value="GBP" />
                        </Picker>
                      </View>

                      <View style={styles.buttonContainer}>
                        <TouchableOpacity
                          style={[styles.actionButton, styles.cancelButton]}
                          onPress={() => setIsModalVisible(false)}
                        >
                          <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.actionButton, styles.submitButton]}
                          onPress={handleAddaccount}
                        >
                          <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>

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
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    color: 'red'
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  currencyPicker: {
    width: 120,
    height: 50,
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  submitButton: {
    backgroundColor: '#17a34a',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: "Inter-Regular",
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
    color: "#17a34a",
    fontSize: 16,
    fontFamily: "Inter-Regular",
  },
  accountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: 'black',
    borderWidth: 1,
    borderStyle: "solid",
    marginVertical: 12,
    width: "100%",
    height: 90
  },

  accountCard: {
    backgroundColor: 'green',
    margin: 2,
    height: 80,
    padding: 5
  },
  accountScrollContainer: {
    padding: 0,
    height: 5
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#17a34a',
    fontFamily: "Inter-Regular",
  },
  accountOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  accountText: {
    fontSize: 16,
    color: '#17a34a',
    fontFamily: "Inter-Regular",
  },
  addButtonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 5,
  },
  addButton: {
    backgroundColor: 'green',
    padding: 5,
    borderRadius: 5,
    shadowColor: 'gray',
  }
});

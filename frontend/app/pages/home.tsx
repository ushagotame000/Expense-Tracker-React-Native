import { icons } from "@/assets/images/assets";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { AccountData, AccountWithTransactions, addAccount, getAllUserAccounts, ITotalBalances } from "../api/account";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { logout } from "../api/auth";
import { addTransaction, getAllTransaction, TransactionData, TransactionDataFetch } from "../api/transaction";
import { Greeting } from "../constant/greeting";
import FilterTransaction from "../screen/FilterTransaction";
import ScrollContainer from "@/components/ScrollContainer";

const { height, width } = Dimensions.get("window");

export default function HomePage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAccountVisible, setModalAccountVisible] = useState(false);
  const [newAccountName, setNewAccountName] = useState("");
  const [initialBalance, setInitialBalance] = useState("0");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [accounts, setAccounts] = useState<AccountWithTransactions[]>([]);
  const [isTransactionModalVisible, setTransactionModelVisible] = useState(false);
  const [description, setNewDescription] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("0");
  const [transactionType, setTransactionType] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [transactionAccount, setTransactionAccount] = useState<TransactionDataFetch[]>([]);
  const [totalBalances, setTotalBalances] = useState<ITotalBalances | null>(null);
  const router = useRouter();

  const handleAddTransaction = async () => {
    if (!description && !transactionAmount) {
      setError('Fields is required');
      return;
    }
    try {
      const userId = await AsyncStorage.getItem('user_id');
      console.log("userid is", userId)

      if (!userId) {
        setError('User not authenticated');
        return;
      }
      const TransactionData: TransactionData = {
        user_id: userId,
        description: description.trim(),
        amount: parseFloat(transactionAmount) || 0,
        type: transactionType,
        account_id: selectedAccount!,
      };
      setIsLoading(true);
      setError("");
      const response = await addTransaction(TransactionData);
      console.log('transaction added successfully:', response);
      setModalAccountVisible(false);
      setModalVisible(false);
      setNewDescription(""),
        setTransactionAmount("0");
    }
    catch (err) {
      console.log("failed to add transaction:", err);
      setError("failed to add transaction. Please try again.")
    }
    finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const fetchAllTransaction = async () => {
      try {
        const userId = await AsyncStorage.getItem('user_id');
        if (userId) {
          const transactionAccount = await getAllTransaction(userId);
          setTransactionAccount(transactionAccount);
        }
      } catch (err) {
        setError('Failed to fetch transaction');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllTransaction();
  }, []);
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
      const accountData = {
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
          // console.log("Hello",userAccounts)
          // console.log('fetched accout:', userAccounts.total_balances)
          setTotalBalances(userAccounts.total_balances)
          setAccounts(userAccounts.accounts);
        }
      } catch (err) {
        setError('Failed to fetch accounts');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    console.log("account", accounts);
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
    <View style={{ flex: 1 }}>
    <ScrollContainer>
      <View style={styles.container}>
        <ImageBackground
          source={icons.Upperhalf}
          style={styles.imageBackground}
          resizeMode="cover"
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>{Greeting()},</Text>
              <Text style={styles.name}>Usha Gotame</Text>
            </View>
            <TouchableOpacity style={styles.bellIcon}>
              <FontAwesome name="bell" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </ImageBackground>
        {/* main card */}
        <View style={styles.body}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>
                Total Balance {"\n"}
                <Text style={styles.balance}>
                  Rs {totalBalances?.total_balance ?? 0}
                </Text>
              </Text>

              <TouchableOpacity style={styles.ellipsis} onPress={logout}>
                <FontAwesome name="ellipsis-h" size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
            {/* end card */}
            <View style={styles.cardHeader}>
              <Text style={styles.expenses}>
                <Feather
                  name="arrow-up"
                  size={13}
                  color="#ffffff"
                  style={styles.arrowIcon}
                />
                Income {"\n"}
                <Text style={styles.expensesBalance}>Rs {totalBalances?.total_income ?? 0}</Text>
              </Text>
              <Text style={styles.expenses}>
                <Feather
                  name="arrow-down"
                  size={13}
                  color="#ffffff"
                  style={styles.arrowIcon}
                />
                Expenses {"\n"}
                <Text style={styles.expensesBalance2}>Rs {totalBalances?.total_expense}</Text>
              </Text>
            </View>
          </View>


          {/* <ScrollView horizontal style={styles.accountScrollContainer} > */}
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScrollContainer}
              contentContainerStyle={styles.scrollContentContainer}
            >
              {accounts.length > 0 ? (
                accounts.map((accountData) => (
                  <TouchableOpacity
                    key={`${accountData.account._id}`}
                    style={styles.accountCard}
                    onPress={() => {

                      console.log('Account pressed:', accountData.account.user_id)
                      console.log('New Account Name:', accountData.account.name);
                    }
                    }

                  >
                    <View style={styles.accountPing} />
                    <Text
                      style={styles.accountName}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    > {accountData.account.name}
                    </Text>
                    <Text style={styles.accountBalance}>Rs {accountData.account.balance.toFixed(2)}</Text>
                    <Text style={styles.accountTransactions}>{accountData.transaction_count} Transaction{accountData.transaction_count !== 1 ? 's' : ''}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text >No accounts found</Text>
              )}
              {/* add account button */}
              <TouchableOpacity
                style={[styles.accountCard, { backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }]}
                onPress={() => setModalAccountVisible(true)}
              >
                <Feather name="file-plus" size={32} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 10, marginTop: 5 }}>Add Account</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* </ScrollView> */}

          {/* transaction history layout */}
          {/* <View style={styles.transactionHeader}>
          <Text style={styles.transactionTitle}>Transaction History</Text>
          <Text style={styles.semiTitle}>See all</Text>
        </View> */}
          <FilterTransaction />
        </View>
        {/* end transaction history */}

        
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
                  <Text style={styles.modalTitle}></Text>

                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => {
                      setTransactionType("income");
                      setTransactionModelVisible(true);
                    }}
                  >
                    <Text style={styles.modalButtonText}>Add Income</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.expenseButton]}
                    onPress={() => {
                      setTransactionType("expense");
                      setTransactionModelVisible(true);
                    }}
                  >
                    <Text style={styles.modalButtonText}>Add Expense</Text>
                  </TouchableOpacity>
                  {/* add expnse end */}

                  {/* transaction model */}
                  <Modal
                    visible={isTransactionModalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setTransactionModelVisible(false)}
                  >
                    <View style={styles.modalContainer}>
                      <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add Transaction</Text>

                        <TextInput
                          style={styles.input}
                          placeholder="Transaction Name"
                          value={description}
                          onChangeText={setNewDescription}
                        />

                        <View style={styles.balanceContainer}>
                          <TextInput
                            style={[styles.input, { flex: 1 }]}
                            placeholder="Balance"
                            value={transactionAmount}
                            onChangeText={setTransactionAmount}
                            keyboardType="numeric"
                          />

                        </View>
                        {/* dropdown */}
                        <View style={styles.dropdownContainer}>
                          {accounts.length > 0 ? (
                            <Picker
                              style={styles.pickerText}
                              selectedValue={selectedAccount}
                              onValueChange={(itemValue) => setSelectedAccount(itemValue)}
                            >
                              {accounts.map((accountData) => (
                                <Picker.Item
                                  key={accountData.account._id}
                                  label={accountData.account.name}
                                  value={accountData.account._id}
                                />
                              ))}
                            </Picker>
                          ) : (
                            <Text style={styles.noAccountsText}>No accounts available</Text>
                          )}
                        </View>
                        <View style={styles.buttonContainer}>
                          <TouchableOpacity
                            style={[styles.actionButton, styles.cancelButton]}
                            onPress={() => setTransactionModelVisible(false)}
                          >
                            <Text style={styles.buttonText}>Cancel</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[styles.actionButton, styles.submitButton]}
                            onPress={handleAddTransaction}
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
                  <Text style={styles.modalTitle}>Create Account</Text>
                  <Text> {accounts.length > 0 ? "lot of acocunts" : "No accounts found"}
                  </Text>
                  {/* Account options */}
                  <View>

                    {accounts.length > 0 ? (

                      accounts.map((accountData) => (
                        <View key={`${accountData.account._id}`} >
                          <TouchableOpacity style={styles.accountOption}>
                            <Text style={styles.accountText}>{accountData.account.name}</Text>
                          </TouchableOpacity>
                          <Text>Rs {accountData.account.balance.toFixed(2)}</Text>
                          <Text>{accountData.transaction_count} Transactions</Text>
                        </View>
                      ))
                    ) : (
                      <Text>No accounts found</Text>
                    )}
                  </View>

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
                  {/* end account modal */}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </ScrollContainer>
    <TouchableOpacity
    style={styles.floatingButton}
    onPress={() => setModalVisible(true)}
  >
    <Feather name="plus" size={32} color="#fff" />
  </TouchableOpacity>
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
    fontSize: 20,
    fontWeight: "400",
    paddingBottom: 5,
    fontFamily: "Inter-Regular",
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
    padding: 10,
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
    bottom: 3,
    left: width / 2 - 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#00712D",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#8beeb2ff",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    zIndex: 100,
  },
  // floatingButton: {
  //   position: "absolute",
  //   bottom: 30,  // Increased from 5 for better visibility
  //   left: width / 2 - 30,   // Changed from center to right side
  //   width: 60,
  //   height: 60,
  //   borderRadius: 30,
  //   backgroundColor: "#00712D",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   shadowColor: "#000",
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 3.84,
  //   elevation: 5,
  //   zIndex: 100,  // Ensure it stays above other elements
  // },

  modalButton: {
    backgroundColor: "#17a34a",
    padding: 10,
    marginVertical: 8,
    borderRadius: 13,
    width: "100%",
    alignItems: "center",
  },
  expenseButton: {
    backgroundColor: "#d43030ff",
  },
  modalButtonText: {
    color: "white",
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
  },
  horizontalScrollContainer: {
    width: '100%',
    marginVertical: 12,
  },

  scrollContentContainer: {
    paddingHorizontal: 16,
    height: '100%'
  },

  accountCard: {
    backgroundColor: '#ffffff',
    marginRight: 12,
    padding: 16,
    borderRadius: 12,
    width: 160,
    height: 'auto',
    borderWidth: 1,
    borderColor: '#000000',
    // Enhanced shadow
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
    // For absolute positioning of ping
    overflow: 'hidden',
    position: 'relative',
  },

  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#38a169',  // Green text color
    marginBottom: 4,
  },

  accountBalance: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2f855a',  // Darker green
    marginBottom: 2,
  },

  accountTransactions: {
    fontSize: 12,
    color: '#718096',  // Gray text
    opacity: 0.9,
  },

  // New style for the green ping indicator
  accountPing: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#48bb78',  // Vibrant green
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginVertical: 8,
  },
  pickerText: {
    height: 50,
    width: '100%',
  },
  noAccountsText: {
    padding: 10,
    color: '#999',
  },
  income: {
    color: '#4CAF50',  // Green for income
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  expense: {
    color: '#F44336',  // Red for expenses
    // Optional additional styling:
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
});

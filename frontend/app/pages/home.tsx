import { icons } from "@/assets/images/assets";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ImageBackground,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  AccountData,
  AccountWithTransactions,
  addAccount,
  deleteAccount,
  getAllUserAccounts,
  ITotalBalances,
} from "../api/account";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { logout } from "../api/auth";
import {
  addTransaction,
  getAllTransaction,
  TransactionData,
  TransactionDataFetch,
} from "../api/transaction";
import { Greeting } from "../constant/greeting";
import FilterTransaction from "../screen/FilterTransaction";
import ScrollContainer from "@/components/ScrollContainer";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import ModalComponent from "../components/ModalComponent";
import ConfirmationModal from "../components/ConfirmationModal";
import { styles } from "../styles/pages/homeStyles";
const { height, width } = Dimensions.get("window");
const wp = (value: number) => (width * value) / 100;
const hp = (value: number) => (height * value) / 100;
type pickerMode = "date" | "time";
export default function HomePage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAccountVisible, setModalAccountVisible] = useState(false);
  const [newAccountName, setNewAccountName] = useState("");
  const [initialBalance, setInitialBalance] = useState("0");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [accounts, setAccounts] = useState<AccountWithTransactions[]>([]);
  const [isTransactionModalVisible, setTransactionModelVisible] =
    useState(false);
  const [description, setNewDescription] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("0");
  const [transactionType, setTransactionType] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [transactionAccount, setTransactionAccount] = useState<
    TransactionDataFetch[]
  >([]);
  const [totalBalances, setTotalBalances] = useState<ITotalBalances | null>(
    null
  );
  const [user, setUser] = useState<any>();
  const [isModalComponentVisible, setModalComponentVisible] =
    useState<boolean>(false);
  const [isDeleteModalVisible, setDeleteModalVisible] =
    useState<boolean>(false);
    const [date, setDate] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [pickerMode, setPickerMode] = useState<pickerMode>("date");
  const router = useRouter();

  const handleAddTransaction = async () => {
    if (!description && !transactionAmount) {
      setError("Fields is required");
      return;
    }
    try {
      const userId = await AsyncStorage.getItem("user_id");
      console.log("userid is", userId);

      if (!userId) {
        setError("User not authenticated");
        return;
      }
      const TransactionData: TransactionData = {
        user_id: userId,
        description: description.trim(),
        amount: parseFloat(transactionAmount) || 0,
        type: transactionType,
        account_id: selectedAccount!,
        date: date.toISOString().split("T")[0],
        time: date.toTimeString().split(" ")[0],
      };
      setIsLoading(true);
      setError("");
      const response = await addTransaction(TransactionData);
      // console.log('transaction added successfully:', response);
      setModalAccountVisible(false);
      setModalVisible(false);
      setNewDescription(""), setTransactionAmount("0");
      console.log(response, "the response is ");
    } catch (err) {
      console.log("failed to add transaction:", err);
      setError("failed to add transaction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData !== null) {
          setUser(JSON.parse(userData));
        }
      } catch (e) {
        console.log("Failed to load user data", e);
      }
    };
    loadUserData();
  }, []);

  useEffect(() => {
    const fetchAllTransaction = async () => {
      try {
        const userId = await AsyncStorage.getItem("user_id");
        if (userId) {
          const transactionAccount = await getAllTransaction(userId);
          setTransactionAccount(transactionAccount);
        }
      } catch (err) {
        setError("Failed to fetch transaction");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllTransaction();
  }, []);

  // accounts section starts here
  const fetchUserAccount = async () => {
    setIsLoading(true);
    try {
      const userId = await AsyncStorage.getItem("user_id");
      if (userId) {
        const userAccounts = await getAllUserAccounts(userId);
        setTotalBalances(userAccounts.total_balances);
        setAccounts(userAccounts.accounts);
      }
    } catch (err) {
      setError("Failed to fetch accounts");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAccount();
  }, []);

  const handleAddaccount = async () => {
    if (!newAccountName.trim()) {
      setError("Account name is required");
      return;
    }
    try {
      const userId = await AsyncStorage.getItem("user_id");
      console.log("userid is", userId);

      if (!userId) {
        setError("User not authenticated");
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
      console.log("account added successfully:", response);
      setModalAccountVisible(false);
      setModalVisible(false);
      setNewAccountName("");
      setInitialBalance("0");
      fetchUserAccount();
    } catch (err) {
      console.log("failed to add account:", err);
      setError("failed to add account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // const userId = AsyncStorage.getItem("user_id");
  // useEffect(() => {
  //   const fetchUserAccount = async () => {
  //     try {
  //       const userId = await AsyncStorage.getItem("user_id");
  //       if (userId) {
  //         const userAccounts = await getAllUserAccounts(userId);

  //         console.log("Hello", userAccounts);
  //         // console.log('fetched accout:', userAccounts.total_balances)
  //         setTotalBalances(userAccounts.total_balances);
  //         setAccounts(userAccounts.accounts);
  //       }
  //     } catch (err) {
  //       setError("Failed to fetch accounts");
  //       console.error(err);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   console.log("account", accounts);
  //   fetchUserAccount();
  // }, []);

  const handleEdit = (account_id: string) => {
    console.log("Edit Account:", selectedAccount);
    router.push(`/editpages/${account_id}`);
    setModalComponentVisible(false);
  };

  // Account delete
  const handleDeleteAccount = () => {
    setModalComponentVisible(false);
    setDeleteModalVisible(true);
  };

  //Account delete confirmation
  const handleConfirmAccount = async (account_id: string) => {
    console.log("this is account_id", account_id);

    try {
      const response = await deleteAccount(account_id);
      if (response && response.success) {
        console.log("account deleted successfully");
        Alert.alert("Account deleted successfully");
        fetchUserAccount();
      }
    } catch (error) {
      console.error("Error during account deletion:", error);
      setDeleteModalVisible(true);
      Alert.alert("Account deletion failed");
    }
  };

  const cancelDelete = () => {
    setDeleteModalVisible(false);
  };

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



  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
    }

    // On Android, close picker after selection
    if (Platform.OS === "android") {
      setShowPicker(false);
    }
  };

  const showDatePicker = () => {
    setPickerMode("date");
    setShowPicker(true);
  };

  const showTimePicker = () => {
    setPickerMode("time");
    setShowPicker(true);
  };

  return (
    <View style={styles.container}>
      <ScrollContainer>
        <View style={styles.container}>
          <ImageBackground
            source={icons.Upperhalf}
            style={styles.imageBackground}
            resizeMode="cover"
          >
            <View style={styles.headerContainer}>
              <View>
                <Text style={styles.greeting}>{Greeting()},</Text>
                <Text style={styles.name}>{user?.username}</Text>
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
                {/* {accounts[0]?.total_balances?.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} */}
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
                  <Text style={styles.expensesBalance}>
                    Rs {totalBalances?.total_income ?? 0}
                  </Text>
                </Text>
                <Text style={styles.expenses}>
                  <Feather
                    name="arrow-down"
                    size={13}
                    color="#ffffff"
                    style={styles.arrowIcon}
                  />
                  Expenses {"\n"}
                  <Text style={styles.expensesBalance}>
                    Rs {totalBalances?.total_expense}
                  </Text>
                </Text>
              </View>
            </View>

            {/* <ScrollView horizontal style={styles.accountScrollContainer} > */}
            <View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.horizontalScrollContainer}
                contentContainerStyle={[
                  styles.scrollContentContainer,
                  accounts.length === 0 && styles.centerContent
                ]}
              >
                {accounts.length > 0 ? (
                  accounts.map((accountData) => (
                    <TouchableOpacity
                      key={accountData.account._id}
                      style={styles.accountCard}
                      onPress={() => {
                        setSelectedAccount(accountData.account._id);
                        setModalComponentVisible(true);
                      }}
                    >
                      <View style={styles.accountPing} />
                      <Text style={styles.accountName}>
                        {accountData.account.name.charAt(0).toUpperCase() +
                          accountData.account.name.slice(1)}
                      </Text>
                      <Text style={styles.accountBalance}>
                        Rs {accountData.account.balance.toFixed(2)}
                      </Text>
                      <Text style={styles.accountTransactions}>
                        {accountData.transaction_count} Transaction
                        {accountData.transaction_count !== 1 ? "s" : ""}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : null}

                {/* ALWAYS SHOW ADD ACCOUNT BUTTON */}
                <TouchableOpacity
                  style={[
                    styles.accountCard,
                    styles.addAccountCard,
                    accounts.length === 0 && styles.centerAddButton
                  ]}
                  onPress={() => setModalAccountVisible(true)}
                >
                  <Feather name="file-plus" size={32} color="#fff" />
                  <Text style={styles.addAccountText}>Add Account</Text>
                </TouchableOpacity>
              </ScrollView>


              {/* account add edit modal  */}
              <ModalComponent
                visible={isModalComponentVisible}
                onClose={() => setModalComponentVisible(false)}
                onDelete={handleDeleteAccount}
                item={selectedAccount}
                onEdit={() => {
                  if (selectedAccount !== null) {
                    handleEdit(selectedAccount);
                  } else {
                    console.warn("Selected account Id is null.");
                  }
                }}
              />

              {/* Delete  account Confirmation Modal */}
              <ConfirmationModal
                visible={isDeleteModalVisible}
                onClose={cancelDelete}
                onConfirm={() => {
                  if (selectedAccount !== null) {
                    handleConfirmAccount(selectedAccount);
                    setDeleteModalVisible(false);
                    Alert.alert("Account deleted successfully");
                  } else {
                    console.warn("Selected account Id is null.");
                  }
                }}
              />
            </View>

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
                          <View style={styles.balanceContainer}>
                            <TouchableOpacity
                              onPress={showDatePicker}
                              style={[styles.input, { flex: 1 }]}
                            >
                              <Text>{date.toLocaleDateString()}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              onPress={showTimePicker}
                              style={[styles.input, { flex: 1, marginLeft: 10 }]}
                            >
                              <Text>
                                {date.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </Text>
                            </TouchableOpacity>

                            {showPicker && (
                              <DateTimePicker
                                testID="dateTimePicker"
                                value={date}
                                mode={pickerMode}
                                display={
                                  Platform.OS === "ios" ? "spinner" : "default"
                                }
                                onChange={onChange}
                              />
                            )}
                          </View>
                          {/* dropdown */}
                          <View style={styles.dropdownContainer}>
                            {accounts.length > 0 ? (
                              <Picker
                                style={styles.pickerText}
                                placeholder="Select Account"
                                selectedValue={selectedAccount}
                                onValueChange={(itemValue) =>
                                  setSelectedAccount(itemValue)
                                }
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
                              <Text style={styles.noAccountsText}>
                                No accounts available
                              </Text>
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
            <TouchableWithoutFeedback
              onPress={() => setModalAccountVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback>
                  <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Create Account</Text>
                    <Text> {accounts.length > 0 ? "" : "No accounts found"}</Text>
                    {/* Account options */}
                    <View>
                      {accounts.length > 0 ? (
                        accounts.map((accountData) => (
                          <View key={`${accountData.account._id}`}>
                            <TouchableOpacity style={styles.accountOption}>
                              <Text style={styles.accountText}>
                                {accountData.account.name}
                              </Text>
                            </TouchableOpacity>
                            <Text>
                              Rs {accountData.account.balance.toFixed(2)}
                            </Text>
                            <Text>
                              {accountData.transaction_count} Transactions
                            </Text>
                          </View>
                        ))
                      ) : (
                        <Text> </Text>
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
                              <Picker.Item label="Rs. NPR" value="INR" />
                              {/* <Picker.Item label="₹ INR" value="INR" />
                              <Picker.Item label="$ USD" value="USD" />
                              <Picker.Item label="€ EUR" value="EUR" />
                              <Picker.Item label="£ GBP" value="GBP" /> */}
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


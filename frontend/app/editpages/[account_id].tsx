import React, { useEffect, useState } from "react";
import {
  View,
  Picker,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Container from "../components/Container";
import TextInputField from "../components/TextInputField";
import {
  AccountData,
  getUserAccountById,
  handleEditAccounts,
} from "../api/account";

const EditAccount: React.FC = () => {
  const { account_id } = useLocalSearchParams();
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [newAccountName, setNewAccountName] = useState<string>("");
  const [initialBalance, setInitialBalance] = useState<string>("");
  const [currency, setCurrency] = useState<string>("INR");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        setLoading(true);
        const response = await getUserAccountById(account_id);

        if (response?.account) {
          const acc = response.account;
          setAccountData(acc);

          setNewAccountName(acc.name);
          setInitialBalance(acc.balance.toString());
          //setCurrency(acc.currency)
        }
      } catch (error) {
        console.error("Error fetching account data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (account_id) {
      fetchAccount();
    }
  }, [account_id]);

  const handleEditAccount = async () => {
    if (!accountData) return;

    try {
      const updatedAccount = {
        user_id: accountData.user_id, 
        name: newAccountName,
        balance: Number(initialBalance),
        currency, 
      };

      console.log("Sending updated data:", updatedAccount);

      const response = await handleEditAccounts(
        account_id as string,
        updatedAccount
      );

      console.log("Account updated successfully:", response);

      router.push(`/pages/home`);
    } catch (error) {
      console.error("Error while editing account:", error);
      alert("Failed to update account. Please try again.");
    }
  };

  if (loading) {
    return (
      <Container title="Edit Account">
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#2F8E5F" />
        </View>
      </Container>
    );
  }

  return (
    <Container title="Edit Account">
      <View style={styles.formContainer}>
        <TextInputField
          placeholder="Account Name"
          value={newAccountName}
          onChangeText={setNewAccountName}
        />

        <TextInputField
          placeholder="Balance"
          value={initialBalance}
          onChangeText={setInitialBalance}
          keyboardType="numeric"
        />

        <Picker
          selectedValue={currency}
          style={styles.input}
          onValueChange={(itemValue) => setCurrency(itemValue)}
        >
          <Picker.Item label="Rs NPR" value="NPR" />
          {/* <Picker.Item label="₹ INR" value="INR" />
          <Picker.Item label="$ USD" value="USD" />
          <Picker.Item label="€ EUR" value="EUR" />
          <Picker.Item label="£ GBP" value="GBP" /> */}
        </Picker>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => router.back()}
          >
            <Text style={[styles.buttonText, { color: "#000" }]}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.submitButton]}
            onPress={handleEditAccount}
          >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Container>
  );
};
const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  actionButton: {
    height: 45,
    width: "48%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: "#E1E1E1",
  },
  submitButton: {
    backgroundColor: "#2F8E5F",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EditAccount;

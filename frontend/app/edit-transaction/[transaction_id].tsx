import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Picker,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Container from "../components/Container";
import TextInputField from "../components/TextInputField";
import { editTransaction, getTransactionById, TransactionData } from "../api/transaction";

const EditTransaction: React.FC = () => {
  const router = useRouter();
  const { transaction_id } = useLocalSearchParams(); 
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState<TransactionData | null>(null);

  // Input states
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
const [accountId, setAccountId] = useState<string | undefined>(undefined);
  useEffect(() => {
    console.log("transaction_id", transaction_id);
    if (!transaction_id) return;

   const fetchTransaction = async () => {
     try {
       const response = await getTransactionById(transaction_id as string);
       const transaction = response.transaction;

       console.log("Fetched transaction:", transaction);

       setTransaction(transaction);
       setDescription(transaction.description);
       setAmount(transaction.amount.toString());
       setType(transaction.type);
       setTime(transaction.time || "");
       setDate(transaction.date || "");
       setAccountId(transaction._id);
     } catch (error) {
       console.error("Failed to load transaction:", error);
       Alert.alert("Error", "Unable to load transaction data.");
     } finally {
       setLoading(false);
     }
   };
    fetchTransaction();
  }, [transaction_id]);

  const handleEditSave = async () => {
   if (!transaction || !accountId) {
     Alert.alert("Error", "Account ID missing. Cannot update transaction.");
     return;
   }


    const updatedTransaction: TransactionData = {
      ...transaction,
      description,
      amount: parseFloat(amount),
      type,
      time,
      date,
      account_id: accountId,
    };

    try {
      await editTransaction(
        transaction_id as string, 
        updatedTransaction
      );

      Alert.alert("Success", "Transaction updated.");
      router.back();
    } catch (error) {
      console.error("Failed to update transaction:", error);
      Alert.alert("Error", "Could not update transaction.");
    }
  };

  if (loading) {
    return (
      <Container title="Edit Transaction">
        <View >
          <ActivityIndicator size="large" color="#2F8E5F" />
        </View>
      </Container>
    );
  }

  return (
    <Container title="Edit Transaction">
      <View style={styles.formContainer}>
        <TextInputField
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
        />

        <TextInputField
          placeholder="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        <Picker
          selectedValue={type}
          style={styles.input}
          onValueChange={(value) => setType(value)}
        >
          <Picker.Item label="Expense" value="expense" />
          <Picker.Item label="Income" value="income" />
        </Picker>

        <TextInputField
          placeholder="Time (e.g., 14:30)"
          value={time}
          onChangeText={setTime}
        />

        <TextInputField
          placeholder="Date (e.g., 2025-09-21)"
          value={date}
          onChangeText={setDate}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => router.back()}
          >
            <Text style={[styles.buttonText, { color: "#000" }]}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.submitButton]}
            onPress={handleEditSave}
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

export default EditTransaction;

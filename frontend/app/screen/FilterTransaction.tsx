import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { getAllTransaction, TransactionDataFetch } from "../api/transaction";
import { FontAwesome } from "@expo/vector-icons";

const NEPAL_TIME_OFFSET = 5 * 60 + 45;

const toNepalTime = (date: Date) => {
  const nepaliDate = new Date(date);
  nepaliDate.setMinutes(nepaliDate.getMinutes() + NEPAL_TIME_OFFSET);
  return nepaliDate;
};

const formatTransactionTime = (dateString: string) => {
  if (!dateString) return "";
  try {
    const utcDate = new Date(dateString);
    const nepalTime = toNepalTime(utcDate);
    return nepalTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "";
  }
};

const formatTransactionDate = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const dayBeforeYesterday = new Date(yesterday);
  dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 1);

  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  dayBeforeYesterday.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  if (date.getTime() === today.getTime()) return "Today";
  if (date.getTime() === yesterday.getTime()) return "Yesterday";
  if (date.getTime() === dayBeforeYesterday.getTime())
    return dayBeforeYesterday.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const groupTransactionsByDate = (transactions: TransactionDataFetch[]) => {
  const grouped: { [key: string]: TransactionDataFetch[] } = {};
  transactions.forEach((t) => {
    if (!t.created_at) return;
    const dateKey = formatTransactionDate(t.created_at);
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(t);
  });
  return grouped;
};

export const fetchAllTransaction = async (): Promise<
  TransactionDataFetch[]
> => {
  const userId = await AsyncStorage.getItem("user_id");
  if (!userId) throw new Error("User ID not found");
  const transactions = await getAllTransaction(userId);
  return [...transactions].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
};

const FilterTransaction = () => {
  const navigation = useNavigation();
  const [transactionAccount, setTransactionAccount] = useState<
    TransactionDataFetch[]
  >([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    TransactionDataFetch[]
  >([]);
  const [activeTab, setActiveTab] = useState<"all" | "income" | "expense">(
    "all"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const transactions = await fetchAllTransaction();
        setTransactionAccount(transactions);
        setFilteredTransactions(transactions);
      } catch (err) {
        setError("Failed to fetch transactions");
      } finally {
        setIsLoading(false);
      }
    };
    loadTransactions();
  }, []);

  const handleFilter = (type: "all" | "income" | "expense") => {
    setActiveTab(type);
    setVisibleCount(10);
    if (type === "all") setFilteredTransactions([...transactionAccount]);
    else
      setFilteredTransactions(
        transactionAccount.filter(
          (t) => t.type.toLowerCase() === type.toLowerCase()
        )
      );
  };

  const groupedTransactions = groupTransactionsByDate(
    filteredTransactions.slice(0, visibleCount)
  );

  if (isLoading)
    return <ActivityIndicator size="large" style={styles.loadingContainer} />;
  if (error) return <Text style={styles.errorText}>{error}</Text>;

  return (
    <View style={styles.container}>
      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'all' && styles.activeTab]}
          onPress={() => handleFilter('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeText]}>All</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'income' && styles.activeTab]}
          onPress={() => handleFilter('income')}
        >
          <Text style={[styles.tabText, activeTab === 'income' && styles.activeText]}>Income</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'expense' && styles.activeTab]}
          onPress={() => handleFilter('expense')}
        >
          <Text style={[styles.tabText, activeTab === 'expense' && styles.activeText]}>Expense</Text>
        </TouchableOpacity>
=======
>>>>>>> Stashed changes
        {["all", "income", "expense"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.tabButton,
              activeTab === type &&
              (type === "income"
                ? styles.activeIncomeTab
                : type === "expense"
                  ? styles.activeExpenseTab
                  : styles.activeTab),
            ]}
            onPress={() => handleFilter(type as any)}
          >
            {type === "income" && (
              <FontAwesome
                name="arrow-up"
                size={18}
                color={activeTab === "income" ? "white" : "#4CAF50"}
                style={styles.tabIcon}
              />
            )}
            {type === "expense" && (
              <FontAwesome
                name="arrow-down"
                size={18}
                color={activeTab === "expense" ? "white" : "#F44336"}
                style={styles.tabIcon}
              />
            )}
            <Text
              style={[styles.tabText, activeTab === type && styles.activeText]}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
<<<<<<< Updated upstream
=======
>>>>>>> Stashed changes
>>>>>>> Stashed changes
      </View>

      {/*  Pagination "See More" Button */}
      {filteredTransactions.length > visibleCount && (
        <TouchableOpacity
          style={styles.seeMoreButton}
          onPress={() => navigation.navigate("transaction")}
        >
          <Text style={styles.seeMoreText}>See More</Text>
        </TouchableOpacity>
      )}

      {/* Transactions List */}
      <View style={styles.transactionsContainer}>
        {Object.keys(groupedTransactions).length ? (
          Object.entries(groupedTransactions).map(([date, transactions]) => (
            <View key={date} style={styles.dateGroup}>
              <Text style={styles.dateHeader}>{date}</Text>
              {transactions.map((t) => (
                <View key={t._id} style={styles.item}>
                  <View style={styles.textContainer}>
<<<<<<< Updated upstream
                    <Text style={styles.description}>{t.description}</Text>
=======
                    <Text style={styles.description}>
                      {transaction.description}
                    </Text>
<<<<<<< Updated upstream
>>>>>>> Stashed changes
                    <Text style={styles.time}>
                      {t.created_at && formatTransactionTime(t.created_at)}
                    </Text>
<<<<<<< Updated upstream
=======
                    <Text style={styles.time}>
                    </Text>
                    {transaction.category && (
                      <Text style={styles.category}>
                        {transaction.category}
                      </Text>
=======
>>>>>>> Stashed changes
                    {t.category && (
                      <Text style={styles.category}>{t.category.toLowerCase()
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())}</Text>
<<<<<<< Updated upstream
=======
>>>>>>> Stashed changes
>>>>>>> Stashed changes
                    )}
                  </View>
                  <Text
                    style={[
                      styles.amount,
                      t.type.toLowerCase() === "expense"
                        ? styles.expense
                        : styles.income,
                    ]}
                  >
                    {t.type.toLowerCase() === "expense" ? "-" : "+"}Rs.
                    {t.amount.toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          ))
        ) : (
          <Text style={styles.noTransactionsText}>No transactions found</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 8,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    flexDirection: 'row',
  },
  activeTab: {
    backgroundColor: "#17a34a",
  },
  tabText: {
<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream
    color: '#333',
    fontWeight: '500',
=======
>>>>>>> Stashed changes
    color: "#333",
    fontWeight: "500",
  },
  tabIcon: {
    marginRight: 8,
<<<<<<< Updated upstream
=======
>>>>>>> Stashed changes
>>>>>>> Stashed changes
  },
  activeText: {
    color: "white",
    fontWeight: "bold",
  },
  transactionsContainer: {
    flex: 1,
  },
  dateGroup: {
    marginBottom: 16,
  },
  dateHeader: {
    fontSize: 14,
    fontWeight: "semibold",
    color: "#6200ee",
    marginBottom: 8,
    paddingLeft: 8,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginBottom: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
<<<<<<< Updated upstream
    borderBottomColor: "#cb2323ff",
    borderBottomWidth: 1,
=======
<<<<<<< Updated upstream
=======
    borderBottomColor: "#cb2323ff",
    borderBottomWidth: 1,
>>>>>>> Stashed changes
>>>>>>> Stashed changes
  },
  textContainer: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#4c7aafff",
    marginTop: 2,
  },
  amount: {
    fontSize: 16,
    fontWeight: "semibold",
  },
  income: {
    color: "#4CAF50",
  },
  expense: {
    color: "#F44336",
  },
  noTransactionsText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream
=======
>>>>>>> Stashed changes
  seeMoreButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 10,
  },

  seeMoreText: {
    color: '#007bff',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  activeIncomeTab: {
    backgroundColor: "#17a34a",
  },
  activeExpenseTab: {
    backgroundColor: "#F44336",
  },

<<<<<<< Updated upstream
=======
>>>>>>> Stashed changes
>>>>>>> Stashed changes
});

export default FilterTransaction;

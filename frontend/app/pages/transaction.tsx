import { StyleSheet, TouchableOpacity, View, ActivityIndicator, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { LineChart } from "react-native-chart-kit";
import LineGraph from "../components/LineGraph";
import { Text } from 'react-native-paper';
import ScrollContainer from "@/components/ScrollContainer";
import { useNavigation } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllTransaction } from "../api/transaction";
import ChartPie from "../components/LineGraph";

// Helper functions (copy from FilterTransaction)
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

  if (date.getTime() === today.getTime()) return 'Today';
  if (date.getTime() === yesterday.getTime()) return 'Yesterday';
  if (date.getTime() === dayBeforeYesterday.getTime())
    return dayBeforeYesterday.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

const NEPAL_TIME_OFFSET = 5 * 60 + 45;

const toNepalTime = (date: Date) => {
  const nepaliDate = new Date(date);
  nepaliDate.setMinutes(nepaliDate.getMinutes() + NEPAL_TIME_OFFSET);
  return nepaliDate;
};

const formatTransactionTime = (dateString: string) => {
  if (!dateString) return '';
  try {
    const utcDate = new Date(dateString);
    const nepalTime = toNepalTime(utcDate);
    return nepalTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting transaction time:', error);
    return '';
  }
};

const groupTransactionsByDate = (transactions: any[]) => {
  const grouped: { [key: string]: any[] } = {};
  transactions.forEach(transaction => {
    if (!transaction.created_at) return;
    const dateKey = formatTransactionDate(transaction.created_at);
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(transaction);
  });
  return grouped;
};

export default function Transaction() {
  const [activeFilter, setActiveFilter] = useState("Month");
  const [activeTab, setActiveTab] = useState<'all' | 'income' | 'expense'>('all');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<{ month: string, income: number, expense: number }[]>([]);
  const [categoryData, setCategoryData] = useState<{ name: string, amount: number, color: string }[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  // const filters = ["Day", "Week", "Month", "Year"];

  const categoryColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#8AC24A', '#607D8B', '#E91E63', '#9C27B0'
  ];

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const userId = await AsyncStorage.getItem('user_id');
        if (!userId) throw new Error('User ID not found');

        const fetchedTransactions = await getAllTransaction(userId);
        const sortedTransactions = [...fetchedTransactions].sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
          const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
          return dateB.getTime() - dateA.getTime();
        });

        setTransactions(sortedTransactions);
        setFilteredTransactions(sortedTransactions);
        calculateMonthlyData(sortedTransactions);
        calculateCategoryData(sortedTransactions);
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const calculateMonthlyData = (transactions: any[]) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const monthlyTotals = months.map(month => ({
      month,
      income: 0,
      expense: 0
    }));

    transactions.forEach(transaction => {
      const date = new Date(transaction.created_at);
      const monthIndex = date.getMonth();

      if (transaction.type.toLowerCase() === 'income') {
        monthlyTotals[monthIndex].income += transaction.amount;
      } else {
        monthlyTotals[monthIndex].expense += transaction.amount;
      }
    });

    setMonthlyData(monthlyTotals);
  };

  const calculateCategoryData = (transactions: any[]) => {
    const categories: { [key: string]: number } = {};

    transactions.forEach(transaction => {
      if (!transaction.category) return;

      if (!categories[transaction.category]) {
        categories[transaction.category] = 0;
      }
      categories[transaction.category] += transaction.amount;
    });

    const sortedCategories = Object.entries(categories)
      .map(([name, amount], index) => ({
        name,
        amount,
        color: categoryColors[index % categoryColors.length]
      }))
      .sort((a, b) => b.amount - a.amount);

    setCategoryData(sortedCategories);
  };

  const handleTabFilter = (type: 'all' | 'income' | 'expense') => {
    setActiveTab(type);
    if (type === 'all') {
      setFilteredTransactions([...transactions]);
      calculateCategoryData(transactions);
    } else {
      const filtered = transactions.filter(
        transaction => transaction.type.toLowerCase() === type.toLowerCase()
      );
      setFilteredTransactions(filtered);
      calculateCategoryData(filtered);
    }
  };

  const handleTimeFilter = (filter: string) => {
    setActiveFilter(filter);
    // Implement time-based filtering if needed
  };

  const handleMonthSelect = (monthIndex: number) => {
    setSelectedMonth(monthIndex === selectedMonth ? null : monthIndex);

    // Filter transactions for the selected month
    const filtered = monthIndex === selectedMonth
      ? transactions
      : transactions.filter(transaction => {
        const date = new Date(transaction.created_at);
        return date.getMonth() === monthIndex;
      });

    setFilteredTransactions(filtered);
    calculateCategoryData(filtered);
  };

  const handleSegmentPress = (segment: any) => {
    setSelectedSegment(segment);
    setTimeout(() => setSelectedSegment(null), 2000); // Hide after 2 seconds
  };

  const groupedTransactions = groupTransactionsByDate(filteredTransactions);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollContainer>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
          >
            <FontAwesome name="angle-left" size={28} color="#17a34a" />
          </TouchableOpacity>

          <Text variant="displayMedium" style={{ color: 'green' }}>Transactions</Text>

          <TouchableOpacity style={styles.iconButton}>
            <FontAwesome name="download" size={24} color="#17a34a" />
          </TouchableOpacity>
        </View>

        {/* Time Filter Buttons */}
        {/* <View style={styles.buttonContainer}>
          {filters.map((label) => (
            <TouchableOpacity
              key={label}
              style={[styles.button, label === activeFilter && styles.activeButton]}
              onPress={() => handleTimeFilter(label)}
            >
              <Text style={[styles.buttonText, label === activeFilter ? styles.activeText : styles.inactiveText]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View> */}

        {/* Type Filter Picker */}
        <View style={styles.dropdownContainer}>
          <Picker
            selectedValue={activeTab}
            onValueChange={(itemValue) => handleTabFilter(itemValue)}
            style={styles.pickerText}
          >
            <Picker.Item label="All" value="all" />
            <Picker.Item label="Income" value="income" />
            <Picker.Item label="Expense" value="expense" />
          </Picker>
        </View>

        {/* Month Selector */}

        <View style={styles.monthSelector}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.buttonContainer}>
              {monthlyData.map((monthData, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    // styles.button,        
                    styles.button,
                    selectedMonth === index && styles.activeButton

                  ]}
                  onPress={() => handleMonthSelect(index)}
                >
                  <Text style={[
                    styles.inactiveText,
                    selectedMonth === index && styles.activeText
                  ]}>
                    {monthData.month.substring(0, 3)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Pie Chart */}
        <View style={{ marginVertical: 20 }}>
          <ChartPie
            categoryData={categoryData}
            onSegmentPress={handleSegmentPress}
          />
        </View>

        {/* Segment Tooltip */}
        {selectedSegment && (
          <View style={[
            styles.tooltip,
            {
              top: selectedSegment.y - 60,
              left: selectedSegment.x - 50
            }
          ]}>
            <Text style={styles.tooltipText}>{selectedSegment.name}</Text>
            <Text style={styles.tooltipText}>Rs {selectedSegment.amount.toFixed(2)}</Text>
          </View>
        )}

        {/* Transactions List */}
        <View style={styles.transactionsContainer}>
          {Object.keys(groupedTransactions).length > 0 ? (
            Object.entries(groupedTransactions).map(([date, transactions]) => (
              <View key={date} style={styles.dateGroup}>
                <Text style={styles.dateHeader}>{date}</Text>
                {transactions.map((transaction) => (
                  <View key={transaction._id} style={styles.item}>
                    <View style={styles.textContainer}>
                      <Text style={styles.description}>
                        {transaction.description}
                      </Text>
                      <Text style={styles.time}>
                        {transaction.created_at && formatTransactionTime(transaction.created_at)}
                      </Text>
                      {transaction.category && (
                        <Text style={styles.category}>
                          {transaction.category}
                        </Text>
                      )}
                    </View>
                    <Text
                      style={[
                        styles.amount,
                        transaction.type.toLowerCase() === 'expense' ? styles.expense : styles.income
                      ]}
                    >
                      {transaction.type.toLowerCase() === 'expense' ? '-' : '+'}Rs {transaction.amount.toFixed(2)}
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
    </ScrollContainer>
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
    backgroundColor: "#ffffff",
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
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
    textAlign: 'center',
  },
  activeText: {
    color: "#ffffff",
  },
  inactiveText: {
    color: "#666666",
    fontWeight: "semibold"
  },
  dropdownContainer: {
    borderRadius: 2,
    borderColor: "#666666",
    borderWidth: 1,
    marginTop: 20,
    width: "50%",
    alignSelf: "flex-end",
  },
  pickerText: {
    color: "#666666",
    fontWeight: "semibold",
    fontFamily: "Inter-Regular",
    fontSize: 15,
    padding: 6,

  },
  monthSelector: {
    marginVertical: 15,
    height: 50,
  },
  monthButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
  },
  selectedMonthButton: {
    backgroundColor: '#00712D',
  },
  monthButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  selectedMonthButtonText: {
    color: '#fff',
  },
  transactionsContainer: {
    flex: 1,
    marginTop: 4,
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
    backgroundColor: "#fcf5fbff",
    borderRadius: 8,
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
    color: "#4c7aafff",
    fontStyle: "italic",
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
  tooltip: {
    position: 'absolute',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#00712D',
    zIndex: 100,
  },
  tooltipText: {
    color: '#00712D',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
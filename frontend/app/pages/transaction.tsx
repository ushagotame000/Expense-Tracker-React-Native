import { StyleSheet, TouchableOpacity, View, ActivityIndicator, ScrollView, ImageBackground, Dimensions } from "react-native";
import React, { useState, useEffect, useRef } from "react";
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
import { icons } from "@/assets/images/assets";

const { height, width } = Dimensions.get("window");

// Helper functions (unchanged)
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
  const [selectedMonth, setSelectedMonth] = useState<number | null>(new Date().getMonth());
  const [selectedSegment, setSelectedSegment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView>(null);

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
        calculateMonthlyData(sortedTransactions);
        
        // Filter for current month by default
        const currentMonth = new Date().getMonth();
        const currentMonthTransactions = sortedTransactions.filter(transaction => {
          const date = new Date(transaction.created_at);
          return date.getMonth() === currentMonth;
        });
        
        setFilteredTransactions(currentMonthTransactions);
        calculateCategoryData(currentMonthTransactions);
        
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, []);

  useEffect(() => {
    if (monthlyData.length > 0 && scrollViewRef.current) {
      const currentMonthIndex = new Date().getMonth();
      const scrollPosition = currentMonthIndex * 70 - (width / 2 - 35);
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ x: scrollPosition, animated: false });
      }, 100);
    }
  }, [monthlyData]);

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
      if (selectedMonth !== null) {
        const filtered = transactions.filter(transaction => {
          const date = new Date(transaction.created_at);
          return date.getMonth() === selectedMonth;
        });
        setFilteredTransactions(filtered);
        calculateCategoryData(filtered);
      } else {
        setFilteredTransactions([...transactions]);
        calculateCategoryData(transactions);
      }
    } else {
      const filtered = transactions.filter(
        transaction => transaction.type.toLowerCase() === type.toLowerCase() && 
        (selectedMonth === null || new Date(transaction.created_at).getMonth() === selectedMonth)
      );
      setFilteredTransactions(filtered);
      calculateCategoryData(filtered);
    }
  };

  const handleTimeFilter = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleMonthSelect = (monthIndex: number) => {
    if (selectedMonth === monthIndex) {
      setSelectedMonth(null);
      setFilteredTransactions(transactions);
      calculateCategoryData(transactions);
    } else {
      setSelectedMonth(monthIndex);
      const filtered = transactions.filter(transaction => {
        const date = new Date(transaction.created_at);
        return date.getMonth() === monthIndex;
      });
      setFilteredTransactions(filtered);
      calculateCategoryData(filtered);
    }
  };

  const handleSegmentPress = (segment: any) => {
    setSelectedSegment(segment);
    setTimeout(() => setSelectedSegment(null), 2000);
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
        <ImageBackground
          source={icons.Upperhalf}
          style={styles.imageBackground}
          resizeMode="cover"
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.goBack()}
            >
              <FontAwesome name="angle-left" size={30} color="#b5f2ccff" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Transactions</Text>

            <TouchableOpacity style={styles.iconButton}>
              <FontAwesome name="download" size={28} color="#b5f2ccff" />
            </TouchableOpacity>
          </View>

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

          <View style={styles.monthSelector}>
            <ScrollView 
              ref={scrollViewRef}
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.monthScrollContainer}
            >
              <View style={styles.buttonContainer}>
                {monthlyData.map((monthData, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.monthButton,
                      selectedMonth === index && styles.activeMonthButton
                    ]}
                    onPress={() => handleMonthSelect(index)}
                  >
                    <Text style={[
                      styles.monthButtonText,
                      selectedMonth === index && styles.activeMonthButtonText
                    ]}>
                      {monthData.month.substring(0, 3)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </ImageBackground>

        <View style={{ marginVertical: 20, backgroundColor: 'transparent', marginTop:'-20%' }}>
          <ChartPie
            categoryData={categoryData}
            onSegmentPress={handleSegmentPress}
          />
        </View>

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
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    flex: 1,
  },
  iconButton: {
    borderRadius: 10,
    padding: 2,
    width: 40,
  },
  dropdownContainer: {
    borderRadius: 2,
    borderColor: "#666666",
    borderWidth: 1,
    marginTop: 20,
    width: "50%",
    alignSelf: "flex-end",
    backgroundColor: '#ffffff'
  },
  pickerText: {
    color: "#666666",
    fontWeight: "semibold",
    fontFamily: "Inter-Regular",
    fontSize: 15,
  },
  monthSelector: {
    marginVertical: 15,
    height: 50,
  },
  monthScrollContainer: {
    paddingHorizontal: width / 2 - 35,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  monthButton: {
    width: 70,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeMonthButton: {
    backgroundColor: "#b5f2ccff",
    borderRadius: 5,
  },
  monthButtonText: {
    color: "#ffffff",
    fontWeight: "semibold"
  },
  activeMonthButtonText: {
    color: "#17a34a",
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
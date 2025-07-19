import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllTransaction, TransactionDataFetch } from '../api/transaction';

// Helper function to format dates
const formatTransactionDate = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const dayBeforeYesterday = new Date(yesterday);
  dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 1);

  // Reset time parts for comparison
  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  dayBeforeYesterday.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  if (date.getTime() === today.getTime()) return 'Today';
  if (date.getTime() === yesterday.getTime()) return 'Yesterday';
  if (date.getTime() === dayBeforeYesterday.getTime()) return dayBeforeYesterday.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

// Nepal Time Offset (UTC+5:45 in minutes)
const NEPAL_TIME_OFFSET = 5 * 60 + 45;

// Convert UTC to Nepal Time
const toNepalTime = (date: Date) => {
  const nepaliDate = new Date(date);
  nepaliDate.setMinutes(nepaliDate.getMinutes() + NEPAL_TIME_OFFSET);
  return nepaliDate;
};

// Format transaction time in Nepal Time
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

// Group transactions by date
const groupTransactionsByDate = (transactions: TransactionDataFetch[]) => {
  const grouped: {[key: string]: TransactionDataFetch[]} = {};
  
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

// Exportable transaction fetching function with proper sorting
export const fetchAllTransaction = async (): Promise<TransactionDataFetch[]> => {
  try {
    const userId = await AsyncStorage.getItem('user_id');
    if (!userId) throw new Error('User ID not found');
    
    const transactions = await getAllTransaction(userId);
    
    // Proper sorting implementation (newest first)
    return [...transactions].sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
      const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
      return dateB.getTime() - dateA.getTime(); // Descending order
    });
  } catch (err) {
    console.error('Failed to fetch transactions:', err);
    throw err;
  }
};

const FilterTransaction = () => {
  const [transactionAccount, setTransactionAccount] = useState<TransactionDataFetch[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<TransactionDataFetch[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'income' | 'expense'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const transactions = await fetchAllTransaction();
        setTransactionAccount(transactions);
        setFilteredTransactions(transactions);
      } catch (err) {
        setError('Failed to fetch transactions');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const handleFilter = (type: 'all' | 'income' | 'expense') => {
    setActiveTab(type);
    
    if (type === 'all') {
      setFilteredTransactions([...transactionAccount]);
    } else {
      const filtered = transactionAccount.filter(
        transaction => transaction.type.toLowerCase() === type.toLowerCase()
      );
      setFilteredTransactions(filtered);
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.loadingContainer} />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  const groupedTransactions = groupTransactionsByDate(filteredTransactions);

  return (
    <View style={styles.container}>
      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
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
      </View>

      {/* Transactions List grouped by date */}
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
                    <Text style={styles.time}>
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
                    {transaction.type.toLowerCase() === 'expense' ? '-' : '+'}${transaction.amount.toFixed(2)}
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
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 8,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#17a34a',
  },
  tabText: {
    color: '#333',
    fontWeight: '500',
  },
  activeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  transactionsContainer: {
    flex: 1,
  },
  dateGroup: {
    marginBottom: 16,
  },
  dateHeader: {
    fontSize: 14,
    fontWeight: 'semibold',
    color: '#6200ee',
    marginBottom: 8,
    paddingLeft: 8,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    fontStyle: 'italic',
         color: '#4c7aafff',
         marginTop:-20,

  },
  amount: {
    fontSize: 16,
    fontWeight: 'semibold',

  },
  income: {
    color: '#4CAF50',
  },
  expense: {
    color: '#F44336',
  },
  noTransactionsText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default FilterTransaction;
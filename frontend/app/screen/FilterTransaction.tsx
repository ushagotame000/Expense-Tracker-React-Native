import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllTransaction, TransactionDataFetch } from '../api/transaction';

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
      setFilteredTransactions([...transactionAccount]); // Create new array reference
    } else {
      const filtered = transactionAccount.filter(
        transaction => transaction.type === type
      );
      setFilteredTransactions(filtered);
    }
  };

  // Function to add new transaction to the top
  const addNewTransaction = (newTransaction: TransactionDataFetch) => {
    const updatedTransactions = [
      {
        ...newTransaction,
        created_at: newTransaction.created_at || new Date().toISOString()
      },
      ...transactionAccount
    ];
    
    setTransactionAccount(updatedTransactions);
    
    // Update filtered view if it matches the filter
    if (activeTab === 'all' || newTransaction.type === activeTab) {
      setFilteredTransactions([
        newTransaction,
        ...filteredTransactions
      ]);
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.loadingContainer} />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

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

      {/* Transactions List (Newest first) */}
      <View style={styles.transactionsContainer}>
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <View key={transaction._id} style={styles.item}>
              <View style={styles.textContainer}>
                <Text style={styles.description}>
                  {transaction.description}
                </Text>
                <Text style={styles.date}>
                  {transaction.created_at ? new Date(transaction.created_at).toLocaleDateString() : 'N/A'}
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
                  transaction.type === 'expense' ? styles.expense : styles.income
                ]}
              >
                {transaction.type === 'expense' ? '-' : '+'}${transaction.amount.toFixed(2)}
              </Text>
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
    padding: 16,
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
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#6200ee',
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
  date: {
    fontSize: 12,
    color: '#666',
  },
  category: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
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
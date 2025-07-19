// app/category.tsx
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { MaterialIcons, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getAllTransaction } from '../api/transaction'

const getIconComponent = (categoryName: string) => {
const iconMap: Record<string, React.ReactNode> = {    
  'food': <MaterialIcons name="restaurant" size={24} color="white" />,
    'transport': <MaterialIcons name="directions-car" size={24} color="white" />,
    'shopping': <FontAwesome name="shopping-cart" size={24} color="white" />,
    'entertainment': <MaterialIcons name="movie" size={24} color="white" />,
    'bills': <Ionicons name="receipt" size={24} color="white" />,
    'health': <MaterialIcons name="local-hospital" size={24} color="white" />,
    'education': <MaterialIcons name="school" size={24} color="white" />,
    'travel': <MaterialIcons name="flight" size={24} color="white" />,
    'groceries': <MaterialCommunityIcons name="food-apple" size={24} color="white" />,
    'utilities': <MaterialIcons name="electrical-services" size={24} color="white" />,
  }
  
  return iconMap[categoryName.toLowerCase()] || <MaterialCommunityIcons name="tag" size={24} color="white" />
}

const getCategoryColor = (categoryName: string) => {
  const colorMap: Record<string, string> = {
    'food': '#FF6B6B',
    'transport': '#4ECDC4',
    'shopping': '#FFA07A',
    'entertainment': '#9575CD',
    'bills': '#81C784',
    'health': '#FF8A65',
    'education': '#64B5F6',
    'travel': '#FFD54F',
    'groceries': '#FF9E80',
    'utilities': '#80DEEA',
  }
  
  return colorMap[categoryName.toLowerCase()] || '#A1887F'
}

export default function Category() {
  const [categories, setCategories] = useState<{name: string, total: number}[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const userId = await AsyncStorage.getItem('user_id')
        if (!userId) throw new Error('User ID not found')
        
        const transactions = await getAllTransaction(userId)
        
        // Calculate totals by category
        const categoryTotals: Record<string, number> = {}
        
        transactions.forEach(transaction => {
          if (transaction.category) {
            const category = transaction.category.toLowerCase()
            const amount = transaction.type.toLowerCase() === 'expense' ? 
              transaction.amount : -transaction.amount
            
            categoryTotals[category] = (categoryTotals[category] || 0) + amount
          }
        })
        
        // Convert to array and sort by highest amount
        const sortedCategories = Object.entries(categoryTotals)
          .map(([name, total]) => ({ name, total }))
          .sort((a, b) => b.total - a.total)
        
        setCategories(sortedCategories)
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchCategoryData()
  }, [])

  const renderItem = ({ item }: {item: {name: string, total: number}}) => (
    <TouchableOpacity 
      style={[
        styles.card, 
        { backgroundColor: getCategoryColor(item.name) }
      ]}
    >
      <View style={styles.iconContainer}>
        {getIconComponent(item.name)}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.categoryName}>
          {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
        </Text>
        <Text style={styles.categoryTotal}>
          Rs {Math.abs(item.total).toLocaleString('en-IN')}
        </Text>
      </View>
    </TouchableOpacity>
  )

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Expense Categories</Text>
      
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No categories found</Text>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    minHeight: 100,
  },
  iconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 50,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  categoryTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
})
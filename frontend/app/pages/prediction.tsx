import React, { useEffect, useState } from 'react';
import {
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { icons } from '@/assets/images/assets';
import { getPredictedExpenses } from '../api/prediction';

const { height } = Dimensions.get('window');

// Icon mapping for each category
const categoryIcons: { [key: string]: keyof typeof MaterialCommunityIcons.glyphMap } = {
  bills: 'file-document',
  education: 'school',
  entertainment: 'movie-open',
  food: 'food',
  healthcare: 'hospital',
  housing: 'home',
  transport: 'bus',
  other: 'dots-horizontal',
};

// Vibrant gradient colors for each category
const categoryColors: { [key: string]: string[] } = {
  bills: ['#FF9F00', '#FF5722'],  // Vibrant orange-red gradient
  education: ['#64B5F6', '#2196F3'],  // Blue gradient
  entertainment: ['#FF4081', '#F50057'],  // Pink gradient
  food: ['#FF6B6B', '#FFB6B6'],  // Soft red gradient
  healthcare: ['#FF8A65', '#FF7043'],  // Warm orange gradient
  housing: ['#4CAF50', '#81C784'],  // Green gradient
  transport: ['#4ECDC4', '#1B5E20'],  // Green-blue gradient
  other: ['#00BCD4', '#0288D1'],  // Blue gradient
};

const Prediction = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<{ [key: string]: number }>({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchPredictions = async () => {
      setLoading(true);
      const user_id = localStorage.getItem('user_id');
      const response = await getPredictedExpenses(user_id);

      if (response) {
        setExpenses(response.predicted_expenses);
        setMessage(response.msg);
      }
      setLoading(false);
    };

    fetchPredictions();
  }, []);

  // Function to render each category's item
  const renderCategory = ([category, amount]: [string, number]) => {
    const iconName = categoryIcons[category] || 'wallet';
    const colors = categoryColors[category] || ['#ece9e6', '#ffffff'];  // Default fallback color

    return (
      <LinearGradient colors={colors} style={styles.card}>
        <View style={styles.iconWrapper}>
          <MaterialCommunityIcons name={iconName} size={28} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.categoryName}>{category}</Text>
          <Text style={styles.amountText}>₹{amount.toFixed(2)}</Text>
        </View>
      </LinearGradient>
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={icons.Upperhalf}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
          >
            <FontAwesome name="angle-left" size={30} color="#b5f2ccff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Prediction for Next Month</Text>
          <View style={styles.iconButton} />
        </View>
      </ImageBackground>

      <View style={styles.listWrapper}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00a86b" />
          </View>
        ) : (
          <FlatList
            data={Object.entries(expenses)}
            keyExtractor={([category]) => category}
            renderItem={({ item }) => renderCategory(item)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </View>
  );
};

export default Prediction;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  imageBackground: {
    height: height * 0.4,
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 35,
    paddingHorizontal: 20,
  },
  iconButton: {
    borderRadius: 10,
    padding: 2,
    width: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    flex: 1,
  },
  listWrapper: {
    marginTop: height * 0.15,  // Adjusted to make room for header
    flex: 1,
    paddingHorizontal: 20,  // Padding for better spacing
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 18,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff', // Static white color for category name
    textTransform: 'capitalize',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff', // Static white color for amount
    marginTop: 3,
  },
});

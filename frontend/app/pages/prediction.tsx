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
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { icons } from '@/assets/images/assets';
import { getPredictedExpenses } from '../api/prediction';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Responsive scaling functions
const scale = (size: number) => (SCREEN_WIDTH / 375) * size;
const verticalScale = (size: number) => (SCREEN_HEIGHT / 812) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

// Breakpoints for different screen sizes
const isSmallDevice = SCREEN_WIDTH < 375;
const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 768;
const isLargeDevice = SCREEN_WIDTH >= 768;

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
  bills: ['#FF9F00', '#FF5722'],
  education: ['#64B5F6', '#2196F3'],
  entertainment: ['#FF4081', '#F50057'],
  food: ['#FF6B6B', '#FFB6B6'],
  healthcare: ['#FF8A65', '#FF7043'],
  housing: ['#4CAF50', '#81C784'],
  transport: ['#4ECDC4', '#1B5E20'],
  other: ['#00BCD4', '#0288D1'],
};

const Prediction = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<{ [key: string]: number }>({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Get user_id from AsyncStorage
        const user_id = await AsyncStorage.getItem('user_id');
        
        console.log("Fetching predictions for user_id:", user_id);
        
        if (!user_id) {
          setError('User ID not found. Please log in again.');
          setLoading(false);
          return;
        }

        const response = await getPredictedExpenses(user_id);
        
        console.log("API Response:", response);

        if (response && response.predicted_expenses) {
          setExpenses(response.predicted_expenses);
          setMessage(response.msg || '');
        } else {
          setError('No prediction data available. Please add more transactions.');
        }
      } catch (err) {
        console.error('Error fetching predictions:', err);
        setError('Failed to load predictions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  // Function to render each category's item
  const renderCategory = ([category, amount]: [string, number]) => {
    const iconName = categoryIcons[category] || 'wallet';
    const colors = categoryColors[category] || ['#ece9e6', '#ffffff'];

    return (
      <LinearGradient colors={colors} style={styles.card}>
        <View style={styles.iconWrapper}>
          <MaterialCommunityIcons 
            name={iconName} 
            size={moderateScale(28)} 
            color="#fff" 
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.categoryName}>{category}</Text>
          <Text style={styles.amountText}>Rs.{amount.toFixed(2)}</Text>
        </View>
      </LinearGradient>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons 
        name="chart-line" 
        size={moderateScale(80)} 
        color="#ccc" 
      />
      <Text style={styles.emptyText}>
        {error || 'No predictions available yet'}
      </Text>
      <Text style={styles.emptySubtext}>
        Add more transactions to get predictions
      </Text>
    </View>
  );

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
            <FontAwesome 
              name="angle-left" 
              size={moderateScale(30)} 
              color="#b5f2ccff" 
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isSmallDevice ? 'Next Month' : 'Prediction for Next Month'}
          </Text>
          <View style={styles.iconButton} />
        </View>
      </ImageBackground>

      <View style={styles.listWrapper}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00a86b" />
            <Text style={styles.loadingText}>Loading predictions...</Text>
          </View>
        ) : Object.keys(expenses).length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={Object.entries(expenses)}
            keyExtractor={([category]) => category}
            renderItem={({ item }) => renderCategory(item)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flatListContent}
            numColumns={isLargeDevice ? 2 : 1}
            key={isLargeDevice ? 'two-columns' : 'one-column'}
            columnWrapperStyle={isLargeDevice ? styles.columnWrapper : undefined}
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  imageBackground: {
    height: verticalScale(300),
    maxHeight: SCREEN_HEIGHT * 0.4,
    minHeight: 200,
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(35),
    paddingHorizontal: scale(20),
    minHeight: moderateScale(50),
  },
  iconButton: {
    borderRadius: moderateScale(10),
    padding: scale(2),
    width: moderateScale(40),
    height: moderateScale(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    flex: 1,
    paddingHorizontal: scale(10),
  },
  listWrapper: {
    marginTop: isSmallDevice ? verticalScale(120) : verticalScale(140),
    flex: 1,
    paddingHorizontal: scale(20),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: verticalScale(200),
  },
  loadingText: {
    marginTop: verticalScale(15),
    fontSize: moderateScale(16),
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: verticalScale(300),
    paddingHorizontal: scale(40),
  },
  emptyText: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: '#666',
    marginTop: verticalScale(20),
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: moderateScale(14),
    color: '#999',
    marginTop: verticalScale(10),
    textAlign: 'center',
  },
  flatListContent: {
    paddingBottom: verticalScale(20),
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: scale(12),
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: moderateScale(14),
    padding: scale(18),
    marginVertical: verticalScale(6),
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    flex: isLargeDevice ? 0.48 : 1,
    minHeight: moderateScale(80),
  },
  iconWrapper: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(15),
  },
  categoryName: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#fff',
    textTransform: 'capitalize',
    flexWrap: 'wrap',
  },
  amountText: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: '#fff',
    marginTop: verticalScale(3),
  },
});

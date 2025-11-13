import React from "react";
import { Dimensions, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

// Define types for our data
interface CategoryData {
  name: string;
  amount: number;
  color: string;
}

interface ChartSegment {
  name: string;
  population: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

interface PieChartProps {
  categoryData: CategoryData[];
  onSegmentPress?: (segment: ChartSegment) => void;
}

const ChartPie: React.FC<PieChartProps> = ({ categoryData, onSegmentPress }) => {
  // Prepare data for the pie chart with proper typing
  const chartData: ChartSegment[] = categoryData.map(item => ({
    name: item.name,
    population: item.amount,
    color: item.color,
    legendFontColor: '#7F7F7F',
    legendFontSize: 12
  }));

  // Calculate total for percentages
  const totalAmount = chartData.reduce((sum, item) => sum + item.population, 0);

  return (
    <View style={styles.container}>
      {/* Pie Chart */}
      <View style={styles.chartContainer}>
        <PieChart
          data={chartData}
          width={screenWidth * 0.90}  
          height={220}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="0"  // Changed from 15 to 0
          absolute
          hasLegend={false}
          style={styles.chartStyle}
        />
      </View>

      {/* Category Legend - Right Column */}
      <View style={styles.legendContainer}>
        {chartData.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.legendItem}
            onPress={() => onSegmentPress?.(item)}
          >
            <View style={[styles.colorBox, { backgroundColor: item.color }]} />
            <View style={styles.legendTextContainer}>
              <Text style={styles.categoryName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.categoryValue}>
                Rs {item.population.toFixed(2)} ({(totalAmount > 0 ? 
                  ((item.population / totalAmount) * 100).toFixed(1) : 0)}%)
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
 container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: -10,
    paddingHorizontal: 10,  
  },
  chartContainer: {
    width: '65%',  
  },
  legendContainer: {
    width: '35%',  
    paddingLeft: 5, 
  },
  chartStyle: {
    borderRadius: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  colorBox: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 8,
  },
  legendTextContainer: {
    flex: 1,
  },
  categoryName: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
    fontFamily:"Inter-Semibold"
  },
  categoryValue: {
    fontSize: 12,
    color: '#ff6f3bff',
  },
});

export default ChartPie;
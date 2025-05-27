import React, { useRef, useState } from "react";
import {
  View,
  Dimensions,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

type DataPoint = {
  index: number;
  value: number;
  dataset: {
    data: number[];
    [key: string]: any;
  };
  x: number;
  y: number;
  getColor: (opacity: number) => string;
};

type SelectedPoint = {
  month: string;
  value: string;
  x: number;
  y: number;
};

const screenWidth = Dimensions.get("window").width;
const chartWidth = screenWidth * 2;

const LineGraph: React.FC = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedPoint, setSelectedPoint] = useState<SelectedPoint | null>(null);

  const data = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    datasets: [
      {
        data: [800, 900, 1000, 950, 1100, 1050, 1200, 1150, 1230, 1300, 1250, 1400],
      },
    ],
  };

  const handlePointPress = (dataPoint: DataPoint) => {
    const monthIndex = dataPoint.index;
    const month = data.labels[monthIndex];
    setSelectedPoint({
      month,
      value: `$${dataPoint.value.toLocaleString()}`,
      x: dataPoint.x,
      y: dataPoint.y,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={{ position: "relative" }}>
          <LineChart
            data={data}
            width={chartWidth}
            height={220}
            withDots={true}
            withShadow={false}
            withInnerLines={false}
            withOuterLines={false}
            withVerticalLines={false}
            withHorizontalLines={true}
            withVerticalLabels={true} 
            withHorizontalLabels={false} 
            onDataPointClick={handlePointPress}
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 113, 45, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForDots: {
                r: "5",
                strokeWidth: "2",
                stroke: "#00712D",
                fill: "#ffffff",
              },
            }}
            bezier
            style={styles.chartStyle}
          />

          {selectedPoint && (
            <View
              style={[
                styles.verticalLine,
                {
                  left: selectedPoint.x,
                  top: selectedPoint.y,
                  height: 220 - selectedPoint.y, // from dot to bottom of chart
                },
              ]}
            />
          )}
        </View>
      </ScrollView>

      {selectedPoint && (
        <View
          style={[
            styles.tooltip,
            {
              left: selectedPoint.x - 75,
              top: selectedPoint.y - 60,
            },
          ]}
        >
          <Text style={styles.tooltipText}>{selectedPoint.month}</Text>
          <Text style={styles.tooltipText}>{selectedPoint.value}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  scrollViewContent: {
    paddingRight: 16,
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
  tooltip: {
    position: "absolute",
    backgroundColor: "white",
    padding: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#00712D",
    zIndex: 100,
  },
  tooltipText: {
    color: "#00712D",
    fontWeight: "semibold",
    fontFamily:"Inter-SemiBold",
    textAlign: "center",
  },
  verticalLine: {
    position: "absolute",
    width: 1.5,
    backgroundColor: "#00712D",
    borderStyle: "dotted",
    borderWidth: 0,
    borderColor: "#00712D",
    zIndex: 50,
  },
});

export default LineGraph;

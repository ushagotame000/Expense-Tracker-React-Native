import {
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
  Dimensions,
  Modal,
  Alert,
  Platform,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Text } from "react-native-paper";
import ScrollContainer from "@/components/ScrollContainer";
import { useNavigation, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteTransaction, getAllTransaction } from "../api/transaction";
import ChartPie from "../components/LineGraph";
import { icons } from "@/assets/images/assets";
import ConfirmationModal from "../components/ConfirmationModal";
import ModalComponent from "../components/ModalComponent";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from 'expo-media-library';

const { height, width } = Dimensions.get("window");

// Helper functions
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
  } catch (error) {
    console.error("Error formatting transaction time:", error);
    return "";
  }
};

const groupTransactionsByDate = (transactions: any[]) => {
  const grouped: { [key: string]: any[] } = {};
  transactions.forEach((transaction) => {
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
  const [activeTab, setActiveTab] = useState<"all" | "income" | "expense">(
    "all"
  );
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<
    { month: string; income: number; expense: number }[]
  >([]);
  const [categoryData, setCategoryData] = useState<
    { name: string; amount: number; color: string }[]
  >([]);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(
    new Date().getMonth()
  );
  const [selectedSegment, setSelectedSegment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(
    null
  );
  const [isModalComponentVisible, setModalComponentVisible] =
    useState<boolean>(false);
  const [isDeleteModalVisible, setDeleteModalVisible] =
    useState<boolean>(false);
  const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false);
  const [reportPeriod, setReportPeriod] = useState<
    "weekly" | "monthly" | "yearly"
  >("monthly");
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  const categoryColors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#8AC24A",
    "#607D8B",
    "#E91E63",
    "#9C27B0",
  ];

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const userId = await AsyncStorage.getItem("user_id");
        if (!userId) throw new Error("User ID not found");

        const fetchedTransactions = await getAllTransaction(userId);
        const sortedTransactions = [...fetchedTransactions].sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
          const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
          return dateB.getTime() - dateA.getTime();
        });

        setTransactions(sortedTransactions);
        calculateMonthlyData(sortedTransactions);

        const currentMonth = new Date().getMonth();
        const currentMonthTransactions = sortedTransactions.filter(
          (transaction) => {
            const date = new Date(transaction.created_at);
            return date.getMonth() === currentMonth;
          }
        );

        setFilteredTransactions(currentMonthTransactions);
        calculateCategoryData(currentMonthTransactions);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
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
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const monthlyTotals = months.map((month) => ({
      month,
      income: 0,
      expense: 0,
    }));

    transactions.forEach((transaction) => {
      const date = new Date(transaction.created_at);
      const monthIndex = date.getMonth();

      if (transaction.type.toLowerCase() === "income") {
        monthlyTotals[monthIndex].income += transaction.amount;
      } else {
        monthlyTotals[monthIndex].expense += transaction.amount;
      }
    });

    setMonthlyData(monthlyTotals);
  };

  const calculateCategoryData = (transactions: any[]) => {
    const categories: { [key: string]: number } = {};

    transactions.forEach((transaction) => {
      if (!transaction.category) return;
      if (!categories[transaction.category]) {
        categories[transaction.category] = 0;
      }
      categories[transaction.category] += transaction.amount;
    });

    const sortedCategories = Object.entries(categories)
      .map(([name, amount], index) => ({
        name: name
          .toLowerCase()
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        amount,
        color: categoryColors[index % categoryColors.length],
      }))
      .sort((a, b) => b.amount - a.amount);

    setCategoryData(sortedCategories);
  };

  const handleTabFilter = (type: "all" | "income" | "expense") => {
    setActiveTab(type);
    const filtered = transactions.filter((transaction) => {
      const matchesType =
        type === "all" || transaction.type.toLowerCase() === type.toLowerCase();
      const matchesMonth =
        selectedMonth === null ||
        new Date(transaction.created_at).getMonth() === selectedMonth;
      return matchesType && matchesMonth;
    });
    setFilteredTransactions(filtered);
    calculateCategoryData(filtered);
  };

  const handleMonthSelect = (monthIndex: number) => {
    const filtered = transactions.filter((transaction) => {
      const date = new Date(transaction.created_at);
      return date.getMonth() === monthIndex;
    });

    setSelectedMonth(monthIndex);
    setFilteredTransactions(filtered);
    calculateCategoryData(filtered);
  };

  const handleSegmentPress = (segment: any) => {
    setSelectedSegment(segment);
    setTimeout(() => setSelectedSegment(null), 2000);
  };

  const handleEdit = (transaction_id: string) => {
    if (!transaction_id) return;
    router.push(`/edit-transaction/${transaction_id}`);
    setModalComponentVisible(false);
  };

  const handleDeleteAccount = () => {
    setModalComponentVisible(false);
    setDeleteModalVisible(true);
  };

  const handleConfirmAccount = async () => {
    try {
      if (!selectedTransaction) return;
      await deleteTransaction(selectedTransaction);
      const updatedTransactions = transactions.filter(
        (txn) => txn._id !== selectedTransaction
      );
      setTransactions(updatedTransactions);
      setFilteredTransactions(updatedTransactions);
    } catch (error) {
      console.error("Failed to delete transaction", error);
    } finally {
      setModalComponentVisible(false);
      setDeleteModalVisible(false);
    }
  };

  const getFilteredTransactionsByPeriod = (
    period: "weekly" | "monthly" | "yearly"
  ) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentDate = now.getDate();

    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.created_at);
      const transactionYear = transactionDate.getFullYear();
      const transactionMonth = transactionDate.getMonth();

      switch (period) {
        case "weekly":
          const weekAgo = new Date(now);
          weekAgo.setDate(currentDate - 7);
          return transactionDate >= weekAgo && transactionDate <= now;

        case "monthly":
          return (
            transactionYear === currentYear && transactionMonth === currentMonth
          );

        case "yearly":
          return transactionYear === currentYear;

        default:
          return true;
      }
    });
  };

  const generateCSVContent = (transactionsData: any[], period: string) => {
    let csv = `Transaction Report - ${period.toUpperCase()}\n`;
    csv += `Generated on: ${new Date().toLocaleString()}\n\n`;

    // Summary
    const totalIncome = transactionsData
      .filter((t) => t.type.toLowerCase() === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactionsData
      .filter((t) => t.type.toLowerCase() === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    csv += `Summary\n`;
    csv += `Total Income,Rs ${totalIncome.toFixed(2)}\n`;
    csv += `Total Expense,Rs ${totalExpense.toFixed(2)}\n`;
    csv += `Net Balance,Rs ${(totalIncome - totalExpense).toFixed(2)}\n\n`;

    // Transactions
    csv += `Date,Time,Description,Category,Type,Amount\n`;

    transactionsData.forEach((transaction) => {
      const date = new Date(transaction.created_at).toLocaleDateString();
      const time = formatTransactionTime(transaction.created_at);
      const description = transaction.description || "N/A";
      const category = transaction.category || "N/A";
      const type = transaction.type;
      const amount = transaction.amount.toFixed(2);

      csv += `${date},${time},${description},${category},${type},Rs ${amount}\n`;
    });

    return csv;
  };
const handleDownloadReport = async () => {
  try {
    // Get the filtered transactions based on the selected report period
    const reportTransactions = getFilteredTransactionsByPeriod(reportPeriod);

    // If no transactions are found for the selected period, show an alert
    if (reportTransactions.length === 0) {
      Alert.alert("No Data", `No transactions found for ${reportPeriod} period.`);
      return;
    }

    // Generate the CSV content
    const csvContent = generateCSVContent(reportTransactions, reportPeriod);
    
    // Define a unique file name based on the report period and timestamp
    const fileName = `transaction_report_${reportPeriod}_${new Date().getTime()}.csv`;
    
    // For Android, we will try to save it in the Downloads folder.
    let fileUri;

    if (Platform.OS === 'android') {
      // Android Downloads folder path
      const downloadsDirectory = FileSystem.documentDirectory + 'Download/';
      await FileSystem.makeDirectoryAsync(downloadsDirectory, { intermediates: true });

      fileUri = downloadsDirectory + fileName;
    } else {
      // iOS / other platforms - app's document directory
      fileUri = FileSystem.documentDirectory + fileName;
    }

    // Write the CSV file to the specified URI
    await FileSystem.writeAsStringAsync(fileUri, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // Check if sharing is available (to open in external apps)
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      // If sharing is available, share the file
      await Sharing.shareAsync(fileUri);
    } else {
      // If not sharing, show success message with the saved file URI
      Alert.alert('Success', `Report saved to your device: ${fileUri}`);
    }

    // Optionally close any modals
    setShowDownloadModal(false);
  } catch (error) {
    console.error("Error saving report:", error);
    Alert.alert("Error", "Failed to save report. Please try again.");
  }
};
  // const handleDownloadReport = async () => {
  //   try {
  //     const reportTransactions = getFilteredTransactionsByPeriod(reportPeriod);

  //     if (reportTransactions.length === 0) {
  //       Alert.alert(
  //         "No Data",
  //         `No transactions found for ${reportPeriod} period.`
  //       );
  //       return;
  //     }

  //     const csvContent = generateCSVContent(reportTransactions, reportPeriod);
  //     const fileName = `transaction_report_${reportPeriod}_${new Date().getTime()}.csv`;
  //     const fileUri = FileSystem.documentDirectory + fileName;
  //     // const fileUri = FileSystem.cacheDirectory + fileName;

  //     await FileSystem.writeAsStringAsync(fileUri, csvContent, {
  //       encoding: FileSystem.EncodingType.UTF8,
  //     });

  //     // const { status } = await MediaLibrary.requestPermissionsAsync();
  //     // if (status !== 'granted') {
  //     //   Alert.alert("Permission Denied", "Permission to access media library is required to save the report.");
  //     //   return;
  //     // }
  //     // if (Platform.OS === 'android') {
  //     //   const asset = await MediaLibrary.createAssetAsync(fileUri);
  //     //   const album = await MediaLibrary.getAlbumAsync('Download');
  //     //   if (album == null) {
  //     //     await MediaLibrary.createAlbumAsync('Download', asset, false);
  //     //   } else {
  //     //     await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
  //     //   }
  //     //   Alert.alert("Success", `Report saved to Download folder.`);
  //     // }

  //     const isAvailable = await Sharing.isAvailableAsync();
  //     if (isAvailable) {
  //       await Sharing.shareAsync(fileUri);
  //     } else {
  //       Alert.alert("Success", `Report saved to: ${fileUri}`);
  //     }

  //     setShowDownloadModal(false);
  //   } catch (error) {
  //     console.error("Error downloading report:", error);
  //     Alert.alert("Error", "Failed to generate report. Please try again.");
  //   }
  // };

  const groupedTransactions = groupTransactionsByDate(filteredTransactions);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setShowDownloadModal(true)}
            >
              <FontAwesome name="download" size={28} color="#b5f2ccff" />
            </TouchableOpacity>
          </View>

          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={activeTab}
              onValueChange={handleTabFilter}
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
                      selectedMonth === index && styles.activeMonthButton,
                    ]}
                    onPress={() => handleMonthSelect(index)}
                  >
                    <Text
                      style={[
                        styles.monthButtonText,
                        selectedMonth === index && styles.activeMonthButtonText,
                      ]}
                    >
                      {monthData.month.substring(0, 3)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </ImageBackground>

        <View style={styles.body}>

          <ChartPie
            categoryData={categoryData}
            onSegmentPress={handleSegmentPress}
          />
        </View>

        {selectedSegment && (
          <View
            style={[
              styles.tooltip,
              { top: selectedSegment.y - 60, left: selectedSegment.x - 50 },
            ]}
          >
            <Text style={styles.tooltipText}>{selectedSegment.name}</Text>
            <Text style={styles.tooltipText}>
              Rs {selectedSegment.amount.toFixed(2)}
            </Text>
          </View>
        )}

        {Object.keys(groupedTransactions).length > 0 ? (
          Object.entries(groupedTransactions).map(([date, transactions]) => (
            <View key={date} style={styles.dateGroup}>
              <Text style={styles.dateHeader}>{date}</Text>
              {transactions.map((transaction) => (
                <TouchableOpacity
                  key={transaction._id}
                  onPress={() => {
                    setSelectedTransaction(transaction._id);
                    setModalComponentVisible(true);
                  }}
                >
                  <View style={styles.item}>
                    <View style={styles.textContainer}>
                      <Text style={styles.description}>
                        {transaction.description}
                      </Text>
                      <Text style={styles.time}>
                        {transaction.created_at &&
                          formatTransactionTime(transaction.created_at)}
                      </Text>
                      {transaction.category && (
                        <Text style={styles.category}>
                          {transaction.category.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}
                        </Text>
                      )}
                    </View>
                    <Text
                      style={[
                        styles.amount,
                        transaction.type.toLowerCase() === "expense"
                          ? styles.expense
                          : styles.income,
                      ]}
                    >
                      {transaction.type.toLowerCase() === "expense" ? "-" : "+"}
                      Rs {transaction.amount.toFixed(2)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))
        ) : (
          <Text style={styles.noTransactionsText}>No transactions found</Text>
        )}

        {/* Download Modal */}
        <Modal
          visible={showDownloadModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowDownloadModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.downloadModal}>
              <Text style={styles.downloadModalTitle}>Download Report</Text>
              <Text style={styles.downloadModalSubtitle}>
                Select report period:
              </Text>

              <TouchableOpacity
                style={[
                  styles.periodButton,
                  reportPeriod === "weekly" && styles.activePeriodButton,
                ]}
                onPress={() => setReportPeriod("weekly")}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    reportPeriod === "weekly" && styles.activePeriodButtonText,
                  ]}
                >
                  Weekly Report
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.periodButton,
                  reportPeriod === "monthly" && styles.activePeriodButton,
                ]}
                onPress={() => setReportPeriod("monthly")}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    reportPeriod === "monthly" && styles.activePeriodButtonText,
                  ]}
                >
                  Monthly Report
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.periodButton,
                  reportPeriod === "yearly" && styles.activePeriodButton,
                ]}
                onPress={() => setReportPeriod("yearly")}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    reportPeriod === "yearly" && styles.activePeriodButtonText,
                  ]}
                >
                  Yearly Report
                </Text>
              </TouchableOpacity>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowDownloadModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.downloadButton]}
                  onPress={handleDownloadReport}
                >
                  <FontAwesome
                    name="download"
                    size={16}
                    color="#fff"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.downloadButtonText}>Download</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <ModalComponent
          visible={isModalComponentVisible}
          onClose={() => setModalComponentVisible(false)}
          onDelete={handleDeleteAccount}
          item={transactions.find((txn) => txn._id === selectedTransaction)}
          onEdit={() => handleEdit(selectedTransaction)}
        />

        <ConfirmationModal
          visible={isDeleteModalVisible}
          onClose={() => setDeleteModalVisible(false)}
          onConfirm={handleConfirmAccount}
        />
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
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
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
    backgroundColor: "#ffffff",
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
    paddingHorizontal: width / 6 - 50,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  monthButton: {
    width: 70,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  activeMonthButton: {
    backgroundColor: "#b5f2ccff",
    borderRadius: 5,
  },
  monthButtonText: {
    color: "#ffffff",
    fontWeight: "semibold",
  },
  activeMonthButtonText: {
    color: "#17a34a",
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
  body: {
    flex: 1,
    padding: 20,
    marginTop: height * 0.25,
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
    position: "absolute",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#00712D",
    zIndex: 100,
  },
  tooltipText: {
    color: "#00712D",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  downloadModal: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    width: width * 0.85,
    maxWidth: 400,
  },
  downloadModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  downloadModalSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  periodButton: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    marginBottom: 12,
    backgroundColor: "#f5f5f5",
  },
  activePeriodButton: {
    borderColor: "#17a34a",
    backgroundColor: "#e8f5e9",
  },
  periodButtonText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    fontWeight: "500",
  },
  activePeriodButtonText: {
    color: "#17a34a",
    fontWeight: "bold",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
    marginRight: 8,
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  downloadButton: {
    backgroundColor: "#17a34a",
    marginLeft: 8,
  },
  downloadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

// import { StyleSheet, TouchableOpacity, View, ActivityIndicator, ScrollView, ImageBackground, Dimensions } from "react-native";
// import React, { useState, useEffect, useRef } from "react";
// import { FontAwesome } from "@expo/vector-icons";
// import { Picker } from "@react-native-picker/picker";
// import { LineChart } from "react-native-chart-kit";
// import LineGraph from "../components/LineGraph";
// import { Text } from 'react-native-paper';
// import ScrollContainer from "@/components/ScrollContainer";
// import { useNavigation, useRouter } from "expo-router";
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { deleteTransaction, getAllTransaction } from "../api/transaction";
// import ChartPie from "../components/LineGraph";
// import { icons } from "@/assets/images/assets";
// import ConfirmationModal from "../components/ConfirmationModal";
// import ModalComponent from "../components/ModalComponent";

// const { height, width } = Dimensions.get("window");

// // Helper functions (unchanged)
// const formatTransactionDate = (dateString: string) => {
//   const date = new Date(dateString);
//   const today = new Date();
//   const yesterday = new Date(today);
//   yesterday.setDate(yesterday.getDate() - 1);
//   const dayBeforeYesterday = new Date(yesterday);
//   dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 1);

//   today.setHours(0, 0, 0, 0);
//   yesterday.setHours(0, 0, 0, 0);
//   dayBeforeYesterday.setHours(0, 0, 0, 0);
//   date.setHours(0, 0, 0, 0);

//   if (date.getTime() === today.getTime()) return 'Today';
//   if (date.getTime() === yesterday.getTime()) return 'Yesterday';
//   if (date.getTime() === dayBeforeYesterday.getTime())
//     return dayBeforeYesterday.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

//   return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
// };

// const NEPAL_TIME_OFFSET = 5 * 60 + 45;

// const toNepalTime = (date: Date) => {
//   const nepaliDate = new Date(date);
//   nepaliDate.setMinutes(nepaliDate.getMinutes() + NEPAL_TIME_OFFSET);
//   return nepaliDate;
// };

// const formatTransactionTime = (dateString: string) => {
//   if (!dateString) return '';
//   try {
//     const utcDate = new Date(dateString);
//     const nepalTime = toNepalTime(utcDate);
//     return nepalTime.toLocaleTimeString('en-US', {
//       hour: 'numeric',
//       minute: '2-digit',
//       hour12: true
//     });
//   } catch (error) {
//     console.error('Error formatting transaction time:', error);
//     return '';
//   }
// };

// const groupTransactionsByDate = (transactions: any[]) => {
//   const grouped: { [key: string]: any[] } = {};
//   transactions.forEach(transaction => {
//     if (!transaction.created_at) return;
//     const dateKey = formatTransactionDate(transaction.created_at);
//     if (!grouped[dateKey]) {
//       grouped[dateKey] = [];
//     }
//     grouped[dateKey].push(transaction);
//   });
//   return grouped;
// };

// export default function Transaction() {
//   const [activeFilter, setActiveFilter] = useState("Month");
//   const [activeTab, setActiveTab] = useState<"all" | "income" | "expense">(
//     "all"
//   );
//   const [transactions, setTransactions] = useState<any[]>([]);
//   const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
//   const [monthlyData, setMonthlyData] = useState<
//     { month: string; income: number; expense: number }[]
//   >([]);
//   const [categoryData, setCategoryData] = useState<
//     { name: string; amount: number; color: string }[]
//   >([]);
//   const [selectedMonth, setSelectedMonth] = useState<number | null>(
//     new Date().getMonth()
//   );
//   const [selectedSegment, setSelectedSegment] = useState<any>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const navigation = useNavigation();
//   const [selectedTransaction, setSelectedTransaction] = useState<string | null>(
//     null
//   );

//   const [isModalComponentVisible, setModalComponentVisible] =
//     useState<boolean>(false);
//   const [isDeleteModalVisible, setDeleteModalVisible] =
//     useState<boolean>(false);
//   const router = useRouter();
//   const scrollViewRef = useRef<ScrollView>(null);

//   const categoryColors = [
//     "#FF6384",
//     "#36A2EB",
//     "#FFCE56",
//     "#4BC0C0",
//     "#9966FF",
//     "#FF9F40",
//     "#8AC24A",
//     "#607D8B",
//     "#E91E63",
//     "#9C27B0",
//   ];

//   useEffect(() => {
//     const loadTransactions = async () => {
//       try {
//         const userId = await AsyncStorage.getItem("user_id");
//         if (!userId) throw new Error("User ID not found");

//         const fetchedTransactions = await getAllTransaction(userId);
// console.log("fetched transaction by id", fetchedTransactions)
//         const sortedTransactions = [...fetchedTransactions].sort((a, b) => {
//           const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
//           const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
//           return dateB.getTime() - dateA.getTime();
//         });

//         setTransactions(sortedTransactions);

//         calculateMonthlyData(sortedTransactions);
// console.log("fetched sorted transaction by id", sortedTransactions)

//         const currentMonth = new Date().getMonth();
//         const currentMonthTransactions = sortedTransactions.filter(
//           (transaction) => {
//             const date = new Date(transaction.created_at);
//             return date.getMonth() === currentMonth;
//           }
//         );

//         setFilteredTransactions(currentMonthTransactions);
//         calculateCategoryData(currentMonthTransactions);
//       } catch (err) {
//         console.error("Failed to fetch transactions:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadTransactions();
//   }, []);

//   useEffect(() => {
//     if (monthlyData.length > 0 && scrollViewRef.current) {
//       const currentMonthIndex = new Date().getMonth();
//       const scrollPosition = currentMonthIndex * 70 - (width / 2 - 35);
//       setTimeout(() => {
//         scrollViewRef.current?.scrollTo({ x: scrollPosition, animated: false });
//       }, 100);
//     }
//   }, [monthlyData]);

//   const calculateMonthlyData = (transactions: any[]) => {
//     const months = [
//       "January",
//       "February",
//       "March",
//       "April",
//       "May",
//       "June",
//       "July",
//       "August",
//       "September",
//       "October",
//       "November",
//       "December",
//     ];

//     const monthlyTotals = months.map((month) => ({
//       month,
//       income: 0,
//       expense: 0,
//     }));

//     transactions.forEach((transaction) => {
//       const date = new Date(transaction.created_at);
//       const monthIndex = date.getMonth();

//       if (transaction.type.toLowerCase() === "income") {
//         monthlyTotals[monthIndex].income += transaction.amount;
//       } else {
//         monthlyTotals[monthIndex].expense += transaction.amount;
//       }
//     });

//     setMonthlyData(monthlyTotals);
//   };

//   const calculateCategoryData = (transactions: any[]) => {
//     const categories: { [key: string]: number } = {};

//     transactions.forEach((transaction) => {
//       if (!transaction.category) return;
//       if (!categories[transaction.category]) {
//         categories[transaction.category] = 0;
//       }
//       categories[transaction.category] += transaction.amount;
//     });

//     const sortedCategories = Object.entries(categories)
//       .map(([name, amount], index) => ({
//         name,
//         amount,
//         color: categoryColors[index % categoryColors.length],
//       }))
//       .sort((a, b) => b.amount - a.amount);

//     setCategoryData(sortedCategories);
//   };

//   const handleTabFilter = (type: "all" | "income" | "expense") => {
//     setActiveTab(type);
//     const filtered = transactions.filter((transaction) => {
//       const matchesType =
//         type === "all" || transaction.type.toLowerCase() === type.toLowerCase();
//       const matchesMonth =
//         selectedMonth === null ||
//         new Date(transaction.created_at).getMonth() === selectedMonth;
//       return matchesType && matchesMonth;
//     });
//     setFilteredTransactions(filtered);
//     calculateCategoryData(filtered);
//   };

//   const handleMonthSelect = (monthIndex: number) => {
//     const filtered = transactions.filter((transaction) => {
//       const date = new Date(transaction.created_at);
//       return date.getMonth() === monthIndex;
//     });
//    console.log(" thisis filterd", filtered)

//     setSelectedMonth(monthIndex);
//     setFilteredTransactions(filtered);
//     calculateCategoryData(filtered);
//   };

//   const handleSegmentPress = (segment: any) => {
//     setSelectedSegment(segment);
//     setTimeout(() => setSelectedSegment(null), 2000);
//   };

//   const handleEdit = (transaction_id: string) => {
//     if (!transaction_id) return;
//     router.push(`/edit-transaction/${transaction_id}`);
//     setModalComponentVisible(false);
//   };

//   const handleDeleteAccount = () => {
//     setModalComponentVisible(false);
//     setDeleteModalVisible(true);
//   };

//   const handleConfirmAccount = async () => {
//     try {
//       if (!selectedTransaction) return;
//       await deleteTransaction(selectedTransaction);
//       const updatedTransactions = transactions.filter(
//         (txn) => txn._id !== selectedTransaction
//       );
//       setTransactions(updatedTransactions);
//       setFilteredTransactions(updatedTransactions);
//     } catch (error) {
//       console.error("Failed to delete transaction", error);
//     } finally {
//       setModalComponentVisible(false);
//       setDeleteModalVisible(false);
//     }
//   };
//   console.log("beforegroupedTransactions",filteredTransactions)

//   const groupedTransactions = groupTransactionsByDate(filteredTransactions);
//   console.log("groupedTransactions",groupedTransactions)

//   if (isLoading) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   return (
//     <ScrollContainer>
//       <View style={styles.container}>
//         <ImageBackground
//           source={icons.Upperhalf}
//           style={styles.imageBackground}
//           resizeMode="cover"
//         >
//           <View style={styles.header}>
//             <TouchableOpacity
//               style={styles.iconButton}
//               onPress={() => navigation.goBack()}
//             >
//               <FontAwesome name="angle-left" size={30} color="#b5f2ccff" />
//             </TouchableOpacity>
//             <Text style={styles.headerTitle}>Transactions</Text>
//             <TouchableOpacity style={styles.iconButton}>
//               <FontAwesome name="download" size={28} color="#b5f2ccff" />
//             </TouchableOpacity>
//           </View>

//           <View style={styles.dropdownContainer}>
//             <Picker
//               selectedValue={activeTab}
//               onValueChange={handleTabFilter}
//               style={styles.pickerText}
//             >
//               <Picker.Item label="All" value="all" />
//               <Picker.Item label="Income" value="income" />
//               <Picker.Item label="Expense" value="expense" />
//             </Picker>
//           </View>

//           <View style={styles.monthSelector}>
//             <ScrollView
//               ref={scrollViewRef}
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               contentContainerStyle={styles.monthScrollContainer}
//             >
//               <View style={styles.buttonContainer}>
//                 {monthlyData.map((monthData, index) => (
//                   <TouchableOpacity
//                     key={index}
//                     style={[
//                       styles.monthButton,
//                       selectedMonth === index && styles.activeMonthButton,
//                     ]}
//                     onPress={() => handleMonthSelect(index)}
//                   >
//                     <Text
//                       style={[
//                         styles.monthButtonText,
//                         selectedMonth === index && styles.activeMonthButtonText,
//                       ]}
//                     >
//                       {monthData.month.substring(0, 3)}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </ScrollView>
//           </View>
//         </ImageBackground>

//         <View
//           style={{
//             marginVertical: 20,
//             backgroundColor: "transparent",
//             marginTop: "-20%",
//           }}
//         >
//           <ChartPie
//             categoryData={categoryData}
//             onSegmentPress={handleSegmentPress}
//           />
//         </View>

//         {selectedSegment && (
//           <View
//             style={[
//               styles.tooltip,
//               { top: selectedSegment.y - 60, left: selectedSegment.x - 50 },
//             ]}
//           >
//             <Text style={styles.tooltipText}>{selectedSegment.name}</Text>
//             <Text style={styles.tooltipText}>
//               Rs {selectedSegment.amount.toFixed(2)}
//             </Text>
//           </View>
//         )}

//         {Object.keys(groupedTransactions).length > 0 ? (
//           Object.entries(groupedTransactions).map(([date, transactions]) => (
//             <View key={date} style={styles.dateGroup}>
//               <Text style={styles.dateHeader}>{date}</Text>

//               {transactions.map((transaction) => (
//                 <TouchableOpacity
//                   key={transaction._id}
//                   onPress={() => {
//                     setSelectedTransaction(transaction._id);
//                     setModalComponentVisible(true);
//                   }}
//                 >
//                   <View style={styles.item}>
//                     <View style={styles.textContainer}>
//                       <Text style={styles.description}>
//                         {transaction.description}
//                       </Text>
//                       <Text style={styles.time}>
//                         {transaction.created_at &&
//                           formatTransactionTime(transaction.created_at)}
//                       </Text>
//                       {transaction.category && (
//                         <Text style={styles.category}>
//                           {transaction.category}
//                         </Text>
//                       )}
//                     </View>
//                     <Text
//                       style={[
//                         styles.amount,
//                         transaction.type.toLowerCase() === "expense"
//                           ? styles.expense
//                           : styles.income,
//                       ]}
//                     >
//                       {transaction.type.toLowerCase() === "expense" ? "-" : "+"}
//                       Rs {transaction.amount.toFixed(2)}
//                     </Text>
//                   </View>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           ))
//         ) : (
//           <Text style={styles.noTransactionsText}>No transactions found</Text>
//         )}

//         <ModalComponent
//           visible={isModalComponentVisible}
//           onClose={() => setModalComponentVisible(false)}
//           onDelete={handleDeleteAccount}
//           item={transactions.find((txn) => txn._id === selectedTransaction)}
//           onEdit={() => handleEdit(selectedTransaction)}
//         />

//         <ConfirmationModal
//           visible={isDeleteModalVisible}
//           onClose={() => setDeleteModalVisible(false)}
//           onConfirm={handleConfirmAccount}
//         />
//       </View>
//     </ScrollContainer>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     fontFamily: "Inter-Regular",
//   },
//   imageBackground: {
//     height: height * 0.4,
//     paddingTop: 60,
//     paddingHorizontal: 20,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#ffffff',
//     textAlign: 'center',
//     flex: 1,
//   },
//   iconButton: {
//     borderRadius: 10,
//     padding: 2,
//     width: 40,
//   },
//   dropdownContainer: {
//     borderRadius: 2,
//     borderColor: "#666666",
//     borderWidth: 1,
//     marginTop: 20,
//     width: "50%",
//     alignSelf: "flex-end",
//     backgroundColor: '#ffffff'
//   },
//   pickerText: {
//     color: "#666666",
//     fontWeight: "semibold",
//     fontFamily: "Inter-Regular",
//     fontSize: 15,
//   },
//   monthSelector: {
//     marginVertical: 15,
//     height: 50,
//   },
//   monthScrollContainer: {
//     paddingHorizontal: width / 6 - 50,
//   },
//   buttonContainer: {
//     flexDirection: "row",
//   },
//   monthButton: {
//     width: 70,
//     paddingVertical: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   activeMonthButton: {
//     backgroundColor: "#b5f2ccff",
//     borderRadius: 5,
//   },
//   monthButtonText: {
//     color: "#ffffff",
//     fontWeight: "semibold"
//   },
//   activeMonthButtonText: {
//     color: "#17a34a",
//   },

//   transactionsContainer: {
//     flex: 1,
//     marginTop: 4,
//   },
//   dateGroup: {
//     marginBottom: 16,
//   },
//   dateHeader: {
//     fontSize: 14,
//     fontWeight: "semibold",
//     color: "#6200ee",
//     marginBottom: 8,
//     paddingLeft: 8,
//   },
//   item: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 16,
//     marginBottom: 8,
//     backgroundColor: "#fcf5fbff",
//     borderRadius: 8,
//   },
//   textContainer: {
//     flex: 1,
//   },
//   description: {
//     fontSize: 16,
//     fontWeight: "500",
//     marginBottom: 4,
//   },
//   time: {
//     fontSize: 12,
//     color: "#666",
//     marginBottom: 4,
//   },
//   category: {
//     fontSize: 12,
//     color: "#4c7aafff",
//     fontStyle: "italic",
//   },
//   amount: {
//     fontSize: 16,
//     fontWeight: "semibold",
//   },
//   income: {
//     color: "#4CAF50",
//   },
//   expense: {
//     color: "#F44336",
//   },
//   noTransactionsText: {
//     textAlign: "center",
//     marginTop: 20,
//     color: "#666",
//   },
//   tooltip: {
//     position: 'absolute',
//     backgroundColor: 'white',
//     padding: 10,
//     borderRadius: 5,
//     borderWidth: 1,
//     borderColor: '#00712D',
//     zIndex: 100,
//   },
//   tooltipText: {
//     color: '#00712D',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
// });

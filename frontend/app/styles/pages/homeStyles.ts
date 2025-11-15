import { Dimensions, StyleSheet } from 'react-native';
const { height, width } = Dimensions.get("window");
const wp = (value: number) => (width * value) / 100;
const hp = (value: number) => (height * value) / 100;
export const styles = StyleSheet.create({
  centerContent: {
    justifyContent: "center",   // <-- center horizontally
    alignItems: "center",
    width: "100%",
  },

  addAccountCard: {
    backgroundColor: "#25A969",
    justifyContent: "center",
    alignItems: "center",
    borderBlockColor: "none",
  },

  addAccountText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 5,
  },

  centerAddButton: {
    width: 160,
    height: 120,
    alignSelf: "center",
  },

  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  addButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  errorText: {
    color: "red",
  },
  addButtonText: {
    color: "white",
    fontSize: 18,
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
  },
  balanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  currencyPicker: {
    width: 120,
    height: 50,
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    padding: 10,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  submitButton: {
    backgroundColor: "#17a34a",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontFamily: "Inter-Regular",
  },
  imageBackground: {
    height: height * 0.4,
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: 50, // Adjusted padding for spacing
    paddingHorizontal: 20,
  },
  greeting: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "400",
    paddingBottom: 5,
    fontFamily: "Inter-Regular",
  },
  name: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  bellIcon: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 8,
    borderRadius: 10,
  },
  body: {
    flex: 1,
    padding: 20,
    marginTop: height * 0.35,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#25A969",
    borderRadius: 15,
    padding: 20,
    marginTop: "-45%",
    borderColor: "black",
    borderWidth: 0.5,
  },
  ellipsis: {
    padding: 8,
    borderRadius: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 14,
    color: "#ffffff",
    fontFamily: "Inter-SemiBold",
    lineHeight: 30,
  },

  balance: {
    fontSize: 30,
    color: "#ffffff",
    fontFamily: "Inter-Bold",
    lineHeight: 40,
  },
  expenses: {
    fontSize: 15,
    color: "#ffffff",
    fontFamily: "Inter-Regular",
    marginTop: 10,
  },
  expensesBalance: {
    fontSize: 20,
    color: "#ffffff",
    fontFamily: "Inter-SemiBold",
  },
  arrowIcon: {
    width: 15,
    marginLeft: "-2%",
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 25,
  },
  transactionTitle: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
  },
  semiTitle: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#666666",
  },
  items: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: "5%",
  },
  transactionBalance: {
    color: "#25A969",
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    marginLeft: -30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#00712D",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00712D",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  modalButton: {
    backgroundColor: "#17a34a",
    padding: 10,
    marginVertical: 8,
    borderRadius: 13,
    width: "100%",
    alignItems: "center",
  },
  expenseButton: {
    backgroundColor: "#d43030ff",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Inter-Regular",
  },
  accountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: "black",
    borderWidth: 1,
    borderStyle: "solid",
    marginVertical: 12,
    width: "100%",
    height: 90,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  accountOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  accountText: {
    fontSize: 16,
    color: "#17a34a",
    fontFamily: "Inter-Regular",
  },

  horizontalScrollContainer: {
    width: "100%",
    marginVertical: 12,
  },

  scrollContentContainer: {
    paddingHorizontal: 16,
    height: "100%",
  },

  accountCard: {
    backgroundColor: "#ffffff",
    marginRight: 12,
    padding: 16,
    borderRadius: 12,
    width: wp(40),         // responsive width
    height: hp(10),
    // borderWidth: 1,
    // borderColor: "#000000",
    // Enhanced shadow
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
    // For absolute positioning of ping
    overflow: "hidden",
    position: "relative",
  },

  accountName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },

  accountBalance: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2f855a", // Darker green
    marginBottom: 2,
  },

  accountTransactions: {
    fontSize: 12,
    color: "#718096", // Gray text
    opacity: 0.9,
  },

  // New style for the green ping indicator
  accountPing: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#48bb78", // Vibrant green
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginVertical: 8,
  },
  pickerText: {
    height: 50,
    width: "100%",
  },
  noAccountsText: {
    padding: 10,
    color: "#999",
  },
  income: {
    color: "#4CAF50", // Green for income
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  expense: {
    color: "#F44336", // Red for expenses
    // Optional additional styling:
    backgroundColor: "rgba(244, 67, 54, 0.1)",
  },
});
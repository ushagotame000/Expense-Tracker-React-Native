import { Dimensions, StyleSheet } from "react-native";
const { height, width } = Dimensions.get("window");

export const styles = StyleSheet.create({
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
    height: height * 0.3,
    textAlign: "center",
    marginTop: 20,
    color: "#000000ff",
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
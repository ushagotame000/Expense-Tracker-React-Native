import { FontAwesome } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type ListItemProps = {
  icon: keyof typeof FontAwesome.glyphMap;
  text: string;
};

export default function ListItem({ icon, text }: ListItemProps) {
  return (
    <TouchableOpacity style={styles.listItem}>
      <FontAwesome name={icon} size={20} color="#333" style={styles.listIcon} />
      <Text style={styles.listText}>{text}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  listIcon: {
    marginRight: 16,
    width: 24,
    textAlign: "center",
  },
  listText: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "black",
  },
});

import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Button, StyleProp, View, ViewStyle } from "react-native";

// Define props interface
interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  mode?: "date" | "time" | "datetime";
  style?: StyleProp<ViewStyle>;
}

export default function DatePicker({
  value,
  onChange,
  mode = "date",
  style,
}: DatePickerProps) {
  const [show, setShow] = useState<boolean>(false);
  const [isDateSelected, setIsDateSelected] = useState<boolean>(false); // Track date selection for datetime

  // Determine button title based on mode
  const buttonTitle =
    mode === "time"
      ? "Select Time"
      : mode === "datetime" && !isDateSelected
      ? "Select Date"
      : mode === "datetime"
      ? "Select Time"
      : "Select Date";

  const handleChange = (event: any, selectedDate: Date | undefined) => {
    if (selectedDate) {
      if (mode === "datetime" && !isDateSelected) {
        // After selecting date, keep picker open for time
        onChange(selectedDate);
        setIsDateSelected(true);
        setShow(true);
      } else {
        // For time or datetime (after date), close picker
        onChange(selectedDate);
        setShow(false);
        setIsDateSelected(false); // Reset for next use
      }
    } else {
      // Handle cancel (Android)
      setShow(false);
      setIsDateSelected(false);
    }
  };

  return (
    <View style={style}>
      <Button title={buttonTitle} onPress={() => setShow(true)} />
      {show && (
        <DateTimePicker
          value={value}
          mode={mode === "datetime" && !isDateSelected ? "date" : "time"}
          onChange={handleChange}
          display="default"
        />
      )}
    </View>
  );
}

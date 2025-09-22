import { useState } from "react";
import { StyleProp, TextInput, TextInputProps, TextStyle } from "react-native";

// Define props interface
interface StyledInputProps extends TextInputProps {
  style?: StyleProp<TextStyle>;
  defaultBorderColor?: string;
  activeBorderColor?: string;
}

export default function StyledInput({
  style,
  defaultBorderColor = "#DDDDDD",
  activeBorderColor = "#00712D",
  ...textInputProps
}: StyledInputProps) {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <TextInput
      style={[
        {
          borderWidth: 2,
          borderColor: isFocused ? activeBorderColor : defaultBorderColor,
          borderRadius: 8,
          padding: 12,
          fontFamily: "Inter-Regular",
          fontSize: 16,
          backgroundColor: "#fff",
        },
        style,
      ]}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      {...textInputProps}
    />
  );
}

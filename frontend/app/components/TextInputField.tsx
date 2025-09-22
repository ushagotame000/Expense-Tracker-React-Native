import React from "react";
import { TextInput, StyleSheet, TextInputProps } from "react-native";

interface TextInputFieldProps extends TextInputProps {
  placeholder: string;
}

const TextInputField: React.FC<TextInputFieldProps> = ({
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
}) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 20,
  },
});

export default TextInputField;

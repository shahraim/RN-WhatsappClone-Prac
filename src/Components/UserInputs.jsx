import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

export default function UserInputs({
  placeholder,
  isPass,
  setStateValue,
  setEmailIsValid,
}) {
  const [value, setValue] = useState("");
  const [emailValid, setEmailValid] = useState("");
  const [passChange, setPassChange] = useState(true);
  const [icon, setIcon] = useState("");

  const handleGetValue = (text) => {
    setValue(text);
    if (placeholder === "Email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const status = emailRegex.test(text);
      setEmailValid(status);
      setEmailIsValid(status);
    }
    setStateValue(text);
  };

  useLayoutEffect(() => {
    switch (placeholder) {
      case "Full Name":
        setIcon("person");
        break;
      case "Email":
        setIcon("mail");
        break;
      case "Password":
        setIcon("lock");
        break;
      default:
        break;
    }
  }, [placeholder]);

  useEffect(() => {
    setStateValue("");
    setValue("");
  }, []);

  return (
    <View
      style={[
        styles.container,
        !emailValid &&
          placeholder === "Email" &&
          value.length > 0 && {
            borderColor: "red",
          },
      ]}
    >
      <View style={styles.inputContainer}>
        <MaterialIcons name={icon} color="#000" size={18} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={handleGetValue}
          secureTextEntry={isPass && passChange}
          autoCapitalize={placeholder === "Email" ? "none" : "sentences"}
        />
      </View>
      {isPass && (
        <TouchableOpacity onPress={() => setPassChange(!passChange)}>
          <FontAwesome name={passChange ? "eye" : "eye-slash"} color="#000" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    height: 50,
    width: "100%",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "gray",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  input: {
    height: "100%",
    width: "80%",
  },
});

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";

export default function UserInputs({
  label,
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
    if (label === "Your Email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const status = emailRegex.test(text);
      setEmailValid(status);
      setEmailIsValid(status);
    }
    setStateValue(text);
  };
  const [loaded] = useFonts({
    medium: require("../../assets/fonts/Poppins-Medium.ttf"),
  });
  if (!loaded) {
    return null;
  }

  useLayoutEffect(() => {
    switch (label) {
      case "Full Name":
        setIcon("person");
        break;
      case "Your Email":
        setIcon("mail");
        break;
      case "Password":
        setIcon("lock");
        break;
      default:
        break;
    }
  }, [label]);

  useEffect(() => {
    setStateValue("");
    setValue("");
  }, []);

  return (
    <View style={styles.mainInput}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View
        style={[
          styles.container,
          !emailValid &&
            label === "Your Email" &&
            value.length > 0 && {
              borderColor: "red",
            },
        ]}
      >
        <View style={styles.inputContainer}>
          <MaterialIcons name={icon} color="#000" size={18} />
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={handleGetValue}
            secureTextEntry={isPass && passChange}
            autoCapitalize={label === "Your Email" ? "none" : "sentences"}
          />
        </View>
        {isPass && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setPassChange(!passChange)}
          >
            <FontAwesome name={passChange ? "eye" : "eye-slash"} color="#000" />
          </TouchableOpacity>
        )}
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: 370,
    height: 45,
    borderBottomWidth: 1,
    borderRadius: 8,
    borderColor: "gray",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingLeft: 10,
  },
  input: {
    height: "100%",
    width: "85%",
  },
  mainInput: {
    height: 65,
    marginVertical: 10,
  },
  inputLabel: {
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: 0.1,
    fontFamily: "medium",
    color: "#3D4A7A",
    marginLeft: 6,
  },
  eyeIcon: {
    width: 25,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
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
  const [icon, setIcon] = useState();

  const handleGetValue = (text) => {
    setValue(text);
    if (placeholder == "Email") {
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
        return setIcon("person");
      case "Email":
        return setIcon("mail");
      case "Password":
        return setIcon("lock");
    }
  }, []);

  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          marginVertical: 10,
          height: 50,
          width: "100%",
          borderWidth: 1,
          borderRadius: 8,
        },
        !emailValid && placeholder === "Email" && value.length > 0
          ? { borderColor: "red" }
          : { borderColor: "gray" },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <MaterialIcons name={icon} color="#000" size={18} />
        <TextInput
          style={{ height: "100%", width: "80%" }}
          placeholder={placeholder}
          value={value}
          onChangeText={handleGetValue}
          secureTextEntry={isPass && passChange}
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

const styles = StyleSheet.create({});

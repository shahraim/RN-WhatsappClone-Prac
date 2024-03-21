import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import UserInputs from "../Components/UserInputs";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailIsValid, setEmailIsValid] = useState(false);

  return (
    <View style={styles.container}>
      <UserInputs
        placeholder={"Email"}
        isPass={false}
        setStateValue={setEmail}
        style={styles.input}
        setEmailIsValid={setEmailIsValid}
      />
      <UserInputs
        placeholder={"Password"}
        isPass={true}
        setStateValue={setPassword}
        style={styles.input}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate("Typo")}
        style={styles.loginButton}
      >
        <Text style={styles.loginButtonText}>Log In</Text>
      </TouchableOpacity>
      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.signUpLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  loginButton: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 25,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signUpText: {
    color: "#555",
    marginRight: 5,
  },
  signUpLink: {
    fontWeight: "bold",
    color: "#4CAF50",
    textDecorationLine: "underline",
  },
});

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import UserInputs from "../Components/UserInputs";
import { auth, db } from "../Config/Firebase.config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setUserData } from "../Config/toolkit/userReducer";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailIsValid, setEmailIsValid] = useState(false);
  const [isProgress, setIsProgress] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = () => {
    setIsProgress(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        if (userCredential) {
          getDoc(doc(db, "users", userCredential?.user.uid)).then((docSnap) => {
            if (docSnap.exists()) {
              dispatch(setUserData(docSnap.data()));
              updateDoc(doc(db, "users", userCredential?.user.uid), {
                alreadyIn: true,
              })
                .then(() => {
                  console.log("alreadyIn updated to true");
                })
                .catch((error) => {
                  console.error("Error updating document: ", error);
                });
            }
          });
        }
        setIsProgress(false);
        navigation.replace("Chatter");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
        setIsProgress(false);
      });
  };

  return (
    <View style={styles.container}>
      <UserInputs
        placeholder={"Email"}
        isPass={false}
        setStateValue={setEmail}
        setEmailIsValid={setEmailIsValid}
      />
      <UserInputs
        placeholder={"Password"}
        isPass={true}
        setStateValue={setPassword}
      />

      <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
        <Text style={styles.loginButtonText}>
          {isProgress ? <ActivityIndicator color={"gray"} /> : "Log In"}
        </Text>
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

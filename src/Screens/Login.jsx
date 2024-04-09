import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import UserInputs from "../Components/UserInputs";
import { auth, db } from "../Config/Firebase.config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setUserData } from "../Config/toolkit/userReducer";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailIsValid, setEmailIsValid] = useState(false);
  const [isProgress, setIsProgress] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessageALert, setErrorMessageAlert] = useState(false);
  const dispatch = useDispatch();

  const [loaded] = useFonts({
    light: require("../../assets/fonts/Poppins-Light.ttf"),
    bold: require("../../assets/fonts/Poppins-Bold.ttf"),
    black: require("../../assets/fonts/Poppins-Black.ttf"),
    medium: require("../../assets/fonts/Poppins-Medium.ttf"),
  });
  if (!loaded) {
    return null;
  }

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
        if (email === "") {
          setErrorMessage("Email is required.");
        } else if (errorCode === "auth/invalid-email") {
          setErrorMessage("No account found with this email.");
        } else if (errorCode === "auth/missing-password") {
          setErrorMessage("Enter password.");
        } else if (errorCode === "auth/invalid-credential") {
          setErrorMessage("Incorrect password.");
        } else {
          setErrorMessage(errorMessage);
        }
        setIsProgress(false);
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <StatusBar style="dark" />
        {/* <Image
        source={{
          uri: "https://media.giphy.com/media/U3qYN8S0j3bpK/giphy.gif",
        }}
        style={styles.bg}
      /> */}
        <View style={styles.gap}>
          <View style={styles.loginTitleArea}>
            <Text style={styles.loginTitle}> Log in to Chatter</Text>
            <Text style={styles.loginTitlePara}>
              Welocme back! Sign in using your social account or email to
              continue
            </Text>
          </View>
          <View style={styles.otherLoginArea}>
            <TouchableOpacity>
              <Ionicons name="logo-facebook" size={24} color={"#1877F2"} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons
                name="logo-google"
                size={24}
                color={"rgb(52, 168, 83)"}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <FontAwesome name="apple" size={24} />
            </TouchableOpacity>
          </View>
          <View style={styles.or}>
            <Text style={styles.orText}>OR</Text>
          </View>

          <View>
            <UserInputs
              label={"Your Email"}
              isPass={false}
              setStateValue={setEmail}
              setEmailIsValid={setEmailIsValid}
              errorMessage={errorMessage}
              errorMessageALert={errorMessageALert}
            />
            <UserInputs
              label={"Password"}
              isPass={true}
              setStateValue={setPassword}
            />
          </View>
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
        </View>
        <View style={styles.gap}>
          <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
            <Text style={styles.loginButtonText}>
              {isProgress ? <ActivityIndicator color={"gray"} /> : "Log In"}
            </Text>
            <Image
              style={styles.loginImg}
              source={require("../../assets/Rectangle 1159.png")}
            />
          </TouchableOpacity>
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account?</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("SignUp");
                setErrorMessageAlert(false);
              }}
            >
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  container: {
    // marginHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    gap: 50,
    backgroundColor: "#fff",
    paddingVertical: 30,
  },
  loginButton: {
    width: 327,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 25,
    position: "relative",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "bold",
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
    fontSize: 14,
    fontFamily: "medium",
    color: "#3D4A7A",
    textDecorationLine: "underline",
  },
  //
  loginTitleArea: {
    alignItems: "center",
    gap: 10,
  },
  loginTitle: {
    fontSize: 18,
    color: "#3D4A7A",
    fontFamily: "bold",
  },
  loginTitlePara: {
    width: 293,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
    color: "#797C7B",
    fontFamily: "light",
  },
  bg: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  otherLoginArea: {
    flexDirection: "row",
    width: 184,
    gap: 25,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 18,
  },
  or: {
    width: "85%",
    height: 1,
    backgroundColor: "rgba(000,000,000,0.3)",
    borderRadius: 100,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 25,
  },
  gap: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  orText: {
    position: "absolute",
    backgroundColor: "#fff",
    zIndex: 1,
    fontSize: 14,
    borderRadius: 100,
    padding: 4,
    color: "#797C7B",
    fontFamily: "black",
  },
  loginImg: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: -1,
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
});

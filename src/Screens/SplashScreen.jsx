import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect } from "react";
import { auth, db } from "../Config/Firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { setUserData } from "../Config/toolkit/userReducer";
import { useDispatch } from "react-redux";

export default function SplashScreen({ navigation }) {
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    checkUser();
  }, []);

  const checkUser = () => {
    auth.onAuthStateChanged((user) => {
      if (user?.uid) {
        getDoc(doc(db, "users", user?.uid)).then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            dispatch(setUserData(userData));
            if (userData.alreadyIn) {
              navigation.replace("Chatter");
            } else {
              navigation.replace("Login");
            }
            return;
          }
        });
      } else {
        navigation.replace("Login");
      }
    });
  };

  return (
    <View style={styles.main}>
      <Image
        style={styles.spalshImg}
        source={require("../../assets/Splash.jpg")}
        resizeMode="cover"
      />
      <View style={styles.mainName}>
        <Image
          style={styles.spalshIcon}
          source={require("../../assets/Vector.png")}
        />
        <Image
          style={styles.appName}
          source={require("../../assets/Chatter-4-1-2024.png")}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  spalshImg: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  mainName: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  spalshIcon: {
    position: "absolute",
  },
  appName: {
    // fontSize: 30,
    position: "absolute",
    top: -130,
    width: 200,
    height: 200,
  },
});

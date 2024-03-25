import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
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
      <Text>SplashScreen</Text>
      <ActivityIndicator size={"large"} color={"#131313"} />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

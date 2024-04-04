import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import MainNavigator from "./src/Config/navigation";
import { Provider } from "react-redux";
import { store } from "./src/Config/toolkit/store";
import "react-native-gesture-handler";

export default function App() {
  const [statusBarStyle, setStatusBarStyle] = useState("light");

  const handleStatusBarChange = (newStyle) => {
    setStatusBarStyle(newStyle);
  };

  return (
    <Provider store={store}>
      <View style={styles.container}>
        <MainNavigator onStatusBarChange={handleStatusBarChange} />
        <StatusBar style={statusBarStyle === "light" ? "light" : "dark"} />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import MainNavigator from "./src/Config/navigation";
import { Provider } from "react-redux";
import { store } from "./src/Config/toolkit/store";

export default function App() {
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <MainNavigator />
        <StatusBar style="auto" />
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

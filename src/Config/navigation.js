import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Chats from "../Screens/Chats";
import Status from "../Screens/Status";
import Calls from "../Screens/Calls";
import Login from "../Screens/Login";
import SignUp from "../Screens/SignUp";
import SplashScreen from "../Screens/SplashScreen";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

function MainNavigator() {
  const select = useSelector((state) => state.user.userData);
  return (
    <NavigationContainer>
      <Stack.Navigator
      // screenOptions={{
      //   headerShown: false,
      // }}
      >
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen
          name="Chatter"
          component={TabNavigator}
          options={{
            headerRight: () => (
              <TouchableOpacity style={styles.avatarContainer}>
                <Image
                  source={{ uri: select.profilePic }}
                  resizeMode="contain"
                  style={styles.avatar}
                />
              </TouchableOpacity>
            ),
            title: "Chatter",
            headerStyle: {
              backgroundColor: "#075E54",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#999999",
        tabBarStyle: { backgroundColor: "#075E54" },
      }}
    >
      <Tab.Screen name="Chats" component={Chats} />
      <Tab.Screen name="Status" component={Status} />
      <Tab.Screen name="Calls" component={Calls} />
    </Tab.Navigator>
  );
}

export default MainNavigator;

const styles = StyleSheet.create({
  avatarContainer: {
    marginHorizontal: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderWidth: 2,
    borderColor: "gray",
    borderRadius: 40,
  },
});

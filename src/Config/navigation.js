import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Chats from "../Screens/Chats";
import Status from "../Screens/Status";
import Calls from "../Screens/Calls";
import Login from "../Screens/Login";
import SignUp from "../Screens/SignUp";
import SplashScreen from "../Screens/SplashScreen";
import UserAvatar from "../Components/UserAvatar";
import UserProfile from "../Screens/UserProfile";
import UserChatScreen from "../Screens/UserChatScreen";
import GroupChats from "../Screens/GroupChats";
import SingleChat from "../Screens/SingleChat";
import GroupOptions from "../Components/GroupOptions";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import AppBar from "../Components/AppBar";
import { ImageBackground, StyleSheet, View } from "react-native";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Profile" component={UserProfile} />
        <Stack.Screen name="GroupChats" component={GroupChats} />
        <Stack.Screen name="SingleChat" component={SingleChat} />
        <Stack.Screen name="GroupOptions" component={GroupOptions} />
        <Stack.Screen name="ChatScreen" component={UserChatScreen} />
        <Stack.Screen name="Chatter" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function TabNavigator() {
  const [loaded] = useFonts({
    light: require("../../assets/fonts/Poppins-Light.ttf"),
  });
  if (!loaded) {
    return null;
  }
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/Home.jpg")}
        resizeMode="cover"
        style={styles.image}
      >
        <AppBar />
        <View style={styles.mainbody}>
          <View style={styles.tabContainer}>
            <View style={styles.topBar}>
              <View style={styles.bar}></View>
            </View>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;

                  if (route.name === "Message") {
                    iconName = focused ? "logo-wechat" : "chatbubbles-outline";
                  } else if (route.name === "Status") {
                    iconName = focused ? "sync-circle" : "sync-circle-outline";
                  } else if (route.name === "Calls") {
                    iconName = focused ? "call" : "call-outline";
                  }

                  return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "#3D4A7A",
                tabBarInactiveTintColor: "#999999",
                tabBarStyle: {
                  backgroundColor: "#fff",
                  paddingBottom: 8,
                  paddingTop: 8,
                  height: 68,
                },
                tabBarLabelStyle: {
                  fontSize: 14,
                  fontFamily: "light",
                },
                headerShown: false,
              })}
            >
              <Tab.Screen name="Message" component={Chats} />
              <Tab.Screen name="Status" component={Status} />
              <Tab.Screen name="Calls" component={Calls} />
            </Tab.Navigator>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  mainbody: {
    flex: 1,
    marginTop: 30,
  },
  tabContainer: {
    flex: 1,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  topBar: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  bar: {
    width: 35,
    height: 4,
    borderRadius: 100,
    backgroundColor: "#E6E6E6",
  },
});

export default MainNavigator;

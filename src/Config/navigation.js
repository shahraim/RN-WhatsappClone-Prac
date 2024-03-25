import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Chats from "../Screens/Chats";
import Status from "../Screens/Status";
import Calls from "../Screens/Calls";
import Login from "../Screens/Login";
import SignUp from "../Screens/SignUp";
import SplashScreen from "../Screens/SplashScreen";
import UserAvatar from "../Components/UserAvatar";
import UserProfile from "../Screens/UserProfile";
import UserChatScreen from "../Screens/UserChatScreen";
import AddToChat from "../Screens/AddToChat";

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

function MainNavigator() {
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
        <Stack.Screen name="Profile" component={UserProfile} />
        <Stack.Screen name="AddToChat" component={AddToChat} />
        <Stack.Screen
          name="ChatScreen"
          component={UserChatScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Chatter"
          component={TabNavigator}
          options={{
            headerRight: () => (
              <UserAvatar width={40} height={40} margin={(0, 10, 0, 10)} />
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

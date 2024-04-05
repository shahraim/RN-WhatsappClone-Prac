import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  Modal, // Import Modal component
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { doc, getDocs, setDoc, collection } from "firebase/firestore";
import { db } from "../Config/Firebase.config";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";

export default function SingleChatModal() {
  const navigation = useNavigation();
  const currentUser = useSelector((state) => state.user.userData);
  const [email, setEmail] = useState("");
  const [isButtonEnabled, setIsButtonEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [loaded] = useFonts({
    medium: require("../../assets/fonts/Poppins-Medium.ttf"),
    regular: require("../../assets/fonts/Poppins-Regular.ttf"),
  });
  if (!loaded) {
    return null;
  }

  const addUserToChat = async () => {
    if (!isButtonEnabled) return;

    if (email === "") {
      Alert.alert("Please enter the user's email");
      return;
    }

    setIsLoading(true);
    setIsButtonEnabled(false);

    try {
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(usersRef);

      let userDataTwo;
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        userData.providerData.forEach((provider) => {
          if (provider.email === email) {
            userDataTwo = userData;
          }
        });
      });

      if (!userDataTwo) {
        Alert.alert("User with the specified email does not exist");
        setIsButtonEnabled(true);
        setIsLoading(false);
        return;
      }

      const chatsRef = collection(db, "chats");
      const chatQuerySnapshot = await getDocs(chatsRef);
      const userInChatWithLoggedInUser = chatQuerySnapshot.docs.some((doc) => {
        const chatData = doc.data();
        if (chatData.chatIs === "person") {
          const chatUsers = chatData.users;
          const loggedInUser = chatUsers.find(
            (user) =>
              user.providerData[0].email === currentUser.providerData[0].email
          );
          const searchedUser = chatUsers.find(
            (user) => user.providerData[0].email === email
          );
          return loggedInUser && searchedUser;
        }
        return false;
      });

      if (userInChatWithLoggedInUser) {
        Alert.alert(
          "User is already in a chat with the current logged-in user"
        );
        setIsLoading(false);
        setIsButtonEnabled(true);
        return;
      }
      const id = `${Date.now()}`;
      const chatName = currentUser.fullName;
      const chatDoc = {
        id: id,
        groupIcon:
          "https://static.vecteezy.com/system/resources/thumbnails/006/576/177/small_2x/customer-chat-icon-people-with-chat-line-icon-style-suitable-for-customer-relationship-management-business-website-icon-simple-design-editable-design-template-vector.jpg",
        users: [currentUser, userDataTwo],
        chatName: chatName,
        chatIs: "person",
      };
      await setDoc(doc(db, "chats", id), chatDoc);
      navigation.reset({
        index: 0,
        routes: [{ name: "Chatter" }],
      });

      setIsLoading(false);
    } catch (error) {
      Alert.alert("Error", "An error occurred: " + error.message);
      setIsButtonEnabled(true);
      setIsLoading(false);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View>
          <Text style={styles.singleTitle}>Create a Chat</Text>
        </View>
        <View style={styles.mainInput}>
          <Text style={styles.inputLabel}>Email</Text>
          <View style={[styles.undrContain]}>
            <View style={styles.inputContainer}>
              <MaterialIcons name="mail" color="#000" size={18} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={(text) => setEmail(text)}
                autoCapitalize={"none"}
              />
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={addUserToChat}
          disabled={!isButtonEnabled}
          style={[styles.button, { opacity: isButtonEnabled ? 1 : 0.5 }]}
        >
          <FontAwesome name="send" size={20} color={"#383A78"} />
          <Text style={{ color: "#383A78" }}>
            {isLoading ? (
              <ActivityIndicator size={"small"} color={"#000"} />
            ) : (
              "Add"
            )}
          </Text>
          <FontAwesome
            name="send"
            style={{
              transform: [{ scaleX: -1 }],
            }}
            size={20}
            color={"#383A78"}
          />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  button: {
    marginLeft: 10,
    padding: 15,
    borderRadius: 100,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#383A78",
    width: 327,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  mainInput: {
    height: 65,
    marginVertical: 10,
  },
  inputLabel: {
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: 0.1,
    fontFamily: "medium",
    color: "#3D4A7A",
    marginLeft: 6,
  },
  eyeIcon: {
    width: 25,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingLeft: 10,
  },
  input: {
    height: "100%",
    width: "85%",
  },
  undrContain: {
    alignItems: "center",
    width: 370,
    height: 45,
    borderBottomWidth: 1,
    borderRadius: 8,
    borderColor: "gray",
  },
  singleTitle: {
    fontSize: 20,
    fontFamily: "medium",
  },
});

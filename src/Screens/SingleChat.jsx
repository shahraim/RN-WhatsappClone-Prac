import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { doc, getDocs, setDoc, collection } from "firebase/firestore";
import { db } from "../Config/Firebase.config";
import { useNavigation } from "@react-navigation/native";

export default function SingleChat() {
  const navigation = useNavigation();
  const currentUser = useSelector((state) => state.user.userData);
  const [email, setEmail] = useState("");
  const [isButtonEnabled, setIsButtonEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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
      {isLoading && (
        <View style={styles.loading}>
          <ActivityIndicator size={"large"} color={"red"} />
        </View>
      )}

      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Ionicons name="mail" size={20} color={"gray"} />
          <TextInput
            placeholder="Enter user email"
            placeholderTextColor={"gray"}
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
            autoCapitalize={"none"}
          />
          <TouchableOpacity
            onPress={addUserToChat}
            disabled={!isButtonEnabled}
            style={[styles.button, { opacity: isButtonEnabled ? 1 : 0.5 }]}
          >
            <FontAwesome name="send" size={20} color={"white"} />
          </TouchableOpacity>
        </View>
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
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginVertical: 10,
    paddingLeft: 10,
  },
  input: {
    flex: 1,
    height: 40,
    marginLeft: 10,
    color: "black",
  },
  button: {
    marginLeft: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#5cb85c",
  },
  loading: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "gray",
    zIndex: 1,
    opacity: 0.4,
  },
});

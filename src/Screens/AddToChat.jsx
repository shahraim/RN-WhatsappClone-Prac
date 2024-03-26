import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { doc, getDocs, setDoc, collection } from "firebase/firestore";
import { db } from "../Config/Firebase.config";
import { useNavigation } from "@react-navigation/native";

export default function AddToChat() {
  const navigation = useNavigation();
  const currentUser = useSelector((state) => state.user.userData);
  const [email, setEmail] = useState("");
  const [chatName, setChatName] = useState("");
  const [isButtonEnabled, setIsButtonEnabled] = useState(true);

  const addUserToChat = async () => {
    if (!isButtonEnabled) return;

    if (email === "" || chatName === "") {
      Alert.alert("Please enter both user email and chat name");
      return;
    }

    setIsButtonEnabled(false);

    try {
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(usersRef);

      let userSnapshot;
      let userDataTwo;
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        userData.providerData.forEach((provider) => {
          if (provider.email === email) {
            userSnapshot = doc;
            userDataTwo = userData;
          }
        });
      });

      if (userSnapshot && userDataTwo) {
        const id = `${Date.now()}`;
        const chatDoc = {
          id: id,
          groupIcon:
            "https://png.pngtree.com/png-clipart/20190620/original/pngtree-vector-leader-of-group-icon-png-image_4022100.jpg",
          users: [currentUser, userDataTwo],
          chatName: chatName,
        };

        await setDoc(doc(db, "chats", id), chatDoc);

        navigation.reset({
          index: 0,
          routes: [{ name: "Chatter" }],
        });
      } else {
        Alert.alert("User with the specified email does not exist");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred: " + error.message);
    } finally {
      setIsButtonEnabled(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Ionicons name="mail" size={20} color={"gray"} />
        <TextInput
          placeholder="Enter user email"
          placeholderTextColor={"gray"}
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
          autoCapitalize={"sentences"}
        />
      </View>
      <View style={styles.inputContainer}>
        <Ionicons name="chatbox-sharp" size={20} color={"gray"} />
        <TextInput
          placeholder="Create chat name"
          placeholderTextColor={"gray"}
          value={chatName}
          onChangeText={(text) => setChatName(text)}
          style={[styles.input, { flex: 1 }]}
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
    // paddingHorizontal: 10,
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
});

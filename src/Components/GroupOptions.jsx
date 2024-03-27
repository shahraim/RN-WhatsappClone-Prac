import React, { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { doc, getDoc, setDoc, collection } from "firebase/firestore";
import { auth, db } from "../Config/Firebase.config";
import { useNavigation } from "@react-navigation/native";

export default function GroupOptions({ route, navigation }) {
  const { room } = route.params;
  const currentUser = useSelector((state) => state.user.userData);
  const [email, setEmail] = useState("");
  const [isButtonEnabled, setIsButtonEnabled] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const usersInChat = room.users;

  const addUserToGroup = async () => {
    if (!isButtonEnabled) return;

    if (email === "") {
      Alert.alert("Please enter user email");
      return;
    }

    setIsButtonEnabled(false);

    auth.onAuthStateChanged((user) => {
      if (user?.uid) {
        getDoc(doc(db, "users", email))
          .then(async (docSnap) => {
            console.log("Document snapshot:", docSnap);
            console.log("Does document exist?", docSnap.exists());

            if (docSnap.exists()) {
              const userData = docSnap.data();
              console.log("User data:", userData);

              // Check if the user is already in the group
              const userExistsInGroup = room.users.some(
                (user) => user.providerData[0].email === email
              );

              if (userExistsInGroup) {
                Alert.alert("User is already in the group");
                setIsButtonEnabled(true);
                return;
              }

              // Update the group chat with the new user
              const updatedUsers = [...room.users, userData];
              const updatedRoom = { ...room, users: updatedUsers };

              await setDoc(doc(db, "chats", room.id), updatedRoom);

              Alert.alert("User added to the group");
              setEmail("");
            } else {
              Alert.alert("User with the specified email does not exist");
              setIsButtonEnabled(true);
            }
          })
          .catch((err) => {
            console.log(err);

            setIsButtonEnabled(true);
          });
      }
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#075E54" />
      </TouchableOpacity>
      <View style={styles.userInfo}>
        <Image source={{ uri: room.groupIcon }} style={styles.avatar} />
        <Text style={styles.chatName}>{room.chatName}</Text>
      </View>
      <TextInput
        placeholder="Enter user email"
        placeholderTextColor={"gray"}
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
        autoCapitalize={"none"}
      />
      <TouchableOpacity
        onPress={addUserToGroup}
        disabled={!isButtonEnabled}
        style={[styles.button, { opacity: isButtonEnabled ? 1 : 0.5 }]}
      >
        <Text style={styles.buttonText}>Add User to Group</Text>
      </TouchableOpacity>
      {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
      {successMessage ? (
        <Text style={styles.successMessage}>{successMessage}</Text>
      ) : null}
      <View style={styles.usersList}>
        <Text style={styles.usersHeader}>Users in Chat:</Text>
        {usersInChat.map((user, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={{ uri: user.profilePic }}
                style={styles.userAvatar}
              />
              <Text style={styles.userEmail}>{user.providerData[0].email}</Text>
            </View>
            <Text style={styles.userName}>{user.fullName}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 10,
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  chatName: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    width: "100%",
    paddingVertical: 12,
    backgroundColor: "#5cb85c",
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorMessage: {
    color: "red",
    marginBottom: 10,
  },
  successMessage: {
    color: "green",
    marginBottom: 10,
  },
  usersList: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
  },
  usersHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  userAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  userEmail: {
    fontSize: 16,
    marginRight: 5,
  },
  userName: {
    fontSize: 16,
  },
});

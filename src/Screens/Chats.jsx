import { Ionicons } from "@expo/vector-icons";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useLayoutEffect, useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import { db } from "../Config/Firebase.config";
import Messages from "../Components/Messages";

export default function Chats({ navigation }) {
  const selector = useSelector((state) => state.user.userData);
  const [chats, setChats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    const q = query(collection(db, "chats"), orderBy("id", "desc"));

    const unSubscribe = onSnapshot(q, (querySnapshot) => {
      const chatRooms = querySnapshot.docs.map((doc) => doc.data());
      const userChats = chatRooms.filter((chat) => {
        const usersEmails = chat.users.map((user) => {
          return user.providerData[0].email;
        });
        return usersEmails?.includes(selector?.providerData[0]?.email);
      });

      setChats(userChats);
      setIsLoading(false);
    });
    return unSubscribe;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("AddToChat")}
        style={styles.messageDiv}
      >
        <Ionicons name="chatbox-ellipses" color={"white"} size={24} />
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.headerText}>Messages</Text>
      </View>
      <ScrollView>
        <View style={styles.chatsContainer}>
          {isLoading ? (
            <ActivityIndicator size={"large"} color={"red"} />
          ) : (
            <>
              {chats && chats.length > 0 ? (
                chats.map((el, ind) => {
                  const isUserInChat = el.users.some(
                    (user) =>
                      user.providerData[0].email ===
                      selector.providerData[0].email
                  );
                  if (isUserInChat) {
                    return <Messages key={ind} chat={el} />;
                  } else {
                    return null;
                  }
                })
              ) : (
                <Text style={{ textAlign: "center" }}>No Groups</Text>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerText: {
    fontSize: 17,
    color: "purple",
    fontWeight: "bold",
  },
  chatsContainer: {
    padding: 15,
  },
  messageDiv: {
    position: "absolute",
    bottom: 40,
    right: 20,
    backgroundColor: "green",
    borderRadius: 100,
    padding: 10,
    zIndex: 1, // Ensure it has a higher zIndex than the ScrollView
  },
});


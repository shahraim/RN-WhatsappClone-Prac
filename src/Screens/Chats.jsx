import { FontAwesome, Ionicons } from "@expo/vector-icons";
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
  const [isChatClicked, setIsChatClicked] = useState(false);

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
      zIndex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: 5,
    },
    messageDivBtn: {
      backgroundColor: "green",
      borderRadius: 100,
      padding: 10,
    },
    options: {
      position: "absolute",
      bottom: 45,
      right: 20,
      width: 70,
      backgroundColor: "white",
      borderRadius: 10,
      padding: 8,
      gap: 10,
      // flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      opacity: isChatClicked ? 1 : 0,
      transform: [{ translateY: isChatClicked ? 0 : 50 }],
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.messageDiv}>
        <View style={styles.options}>
          <TouchableOpacity
            style={{ alignItems: "center" }}
            onPress={() => navigation.navigate("GroupChats")}
          >
            <FontAwesome name="group" size={24} color={"gray"} />
            <Text style={{ fontSize: 10 }}>Group Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ alignItems: "center" }}
            onPress={() => navigation.navigate("SingleChat")}
          >
            <Ionicons name="person" size={24} color={"gray"} />
            <Text style={{ fontSize: 10 }}>Single Chat</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => setIsChatClicked(!isChatClicked)}
          style={styles.messageDivBtn}
        >
          <Ionicons name="chatbox-ellipses" color={"white"} size={24} />
        </TouchableOpacity>
      </View>
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
                <Text style={{ textAlign: "center" }}>No Chats</Text>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

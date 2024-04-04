import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../Config/Firebase.config";
import Messages from "../Components/Messages";

export default function Chats({ navigation }) {
  const selector = useSelector((state) => state.user.userData);
  const [chats, setChats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatClicked, setIsChatClicked] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "chats"), orderBy("id", "desc"));

    const unSubscribe = onSnapshot(q, (querySnapshot) => {
      const chatRooms = querySnapshot.docs.map((doc) => doc.data());
      const userChats = chatRooms.filter((chat) => {
        const usersEmails = chat.users.map(
          (user) => user?.providerData[0]?.email
        );
        return usersEmails.includes(selector?.providerData[0]?.email);
      });

      setChats(userChats);
      setIsLoading(false);
    });
    return unSubscribe;
  }, []);

  const closeOptions = () => {
    setIsChatClicked(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "#fff",
  },
  chatsContainer: {
    padding: 15,
  },
});
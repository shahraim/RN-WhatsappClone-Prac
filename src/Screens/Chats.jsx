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
import { useNavigation } from "@react-navigation/native";
import Messages from "../Components/Messages";

export default function Chats({ navigation }) {
  const selector = useSelector((state) => state.user.userData);
  const [chats, setChats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    const q = query(collection(db, "chats"), orderBy("id", "desc"));

    const unSubscribe = onSnapshot(q, (querySnapshot) => {
      const chatRooms = querySnapshot.docs.map((doc) => doc.data());
      setChats(chatRooms);
      setIsLoading(false);
    });
    return unSubscribe;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Messages</Text>
        <TouchableOpacity onPress={() => navigation.navigate("AddToChat")}>
          <Ionicons name="chatbox-ellipses" color={"gray"} size={24} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.chatsContainer}>
          {isLoading ? (
            <View>
              <ActivityIndicator size={"large"} color={"red"} />
            </View>
          ) : (
            <>
              {/* Render list of chats */}
              {chats && chats.length > 0 ? (
                <>
                  {chats.map((el, ind) => (
                    <Messages key={ind} chat={el} />
                  ))}
                </>
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  chatsContainer: {
    padding: 15,
  },
});

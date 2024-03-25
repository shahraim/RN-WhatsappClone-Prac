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

// function Messages({ chat }) {
//   const navigation = useNavigation();
//   return (
//     <View style={styles.chatItem}>
//       <TouchableOpacity>
//         <Image
//           source={{
//             uri: chat.groupIcon,
//           }}
//           style={styles.avatar}
//           resizeMode="cover"
//         />
//       </TouchableOpacity>
//       <View style={styles.chatContent}>
//         <TouchableOpacity
//           onPress={() => navigation.navigate("ChatScreen", { room: chat })}
//         >
//           <Text style={styles.chatName}>{chat.chatName}</Text>
//           <Text style={styles.chatMessage}>
//             Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui,
//             laborum quod. Fugit, praesent...
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

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
  // chatItem: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   marginBottom: 18,
  // },
  // avatar: {
  //   width: 50,
  //   height: 50,
  //   marginRight: 10,
  //   borderWidth: 1,
  //   borderColor: "green",
  //   borderRadius: 25,
  // },
  // chatContent: {
  //   flex: 1,
  // },
  // chatName: {
  //   fontSize: 16,
  //   fontWeight: "bold",
  // },
  // chatMessage: {
  //   fontSize: 14,
  //   color: "#666",
  // },
});

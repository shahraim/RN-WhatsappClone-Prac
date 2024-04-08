import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFonts } from "expo-font";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../Config/Firebase.config";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

export default function GroupOptions({ chatRoom, isLoading, room }) {
  const currentUser = useSelector((state) => state?.user?.userData);

  const [loaded] = useFonts({
    regular: require("../../assets/fonts/Poppins-Regular.ttf"),
    medium: require("../../assets/fonts/Poppins-Medium.ttf"),
    bold: require("../../assets/fonts/Poppins-Bold.ttf"),
  });
  if (!loaded) {
    return null;
  }
  const navigation = useNavigation();

  const handleDeleteChat = async () => {
    try {
      const chatRef = doc(db, "chats", room.id);
      const chatDoc = await getDoc(chatRef);

      if (chatDoc.exists()) {
        const chatData = chatDoc.data();
        if (chatData.chatIs === "group") {
          const userIndex = chatData.users.findIndex(
            (user) =>
              user.providerData[0].email === currentUser?.providerData[0]?.email
          );
          if (userIndex !== -1) {
            const updatedUsers = [...chatData.users];
            updatedUsers.splice(userIndex, 1);
            await updateDoc(chatRef, { users: updatedUsers });

            // Add exit message
            const exitMessage = {
              id: `${Date.now()}`,
              roomId: room.id,
              isExit: "userExit",
              timeStamp: serverTimestamp(),
              message: `${currentUser.fullName} has exited the group.`,
            };
            addDoc(
              collection(doc(db, "chats", room.id), "messages"),
              exitMessage
            );

            navigation.reset({
              index: 0,
              routes: [{ name: "Chatter" }],
            });
          }
        }
      } else {
        console.log("Chat not found");
      }
    } catch (error) {
      console.error("Error removing chat:", error);
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
        <ScrollView>
          <View style={styles.usersList}>
            <Text style={styles.members}>Group: {chatRoom.length} members</Text>
            {chatRoom.map((user, index) => (
              <View key={index} style={styles.memeberInGroup}>
                <View style={styles.memberEmail}>
                  <Image
                    source={{ uri: user.profilePic }}
                    style={styles.userAvatar}
                  />
                  <Text style={styles.userEmail}>
                    {user.providerData[0].email}
                  </Text>
                </View>
                <Text style={styles.userName}>{user?.fullName}</Text>
              </View>
            ))}
          </View>
          <View style={styles.btns}>
            <TouchableOpacity
              style={styles.btnClicked}
              onPress={handleDeleteChat}
            >
              <Ionicons name="exit-outline" size={18} color={"red"} />
              <Text style={styles.btnText}>Exit Group</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnClicked}>
              <FontAwesome name="thumbs-down" size={18} color={"red"} />
              <Text style={styles.btnText}>Report Group</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  members: {
    fontSize: 18,
    textAlign: "center",
    fontFamily: "medium",
    color: "gray",
  },
  usersList: {
    gap: 5,
  },
  memeberInGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderTopWidth: 0,
  },
  userAvatar: {
    width: 30,
    height: 30,
  },
  memberEmail: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  userEmail: {
    fontSize: 15,
    fontFamily: "regular",
  },
  userName: {
    fontFamily: "medium",
  },
  btns: { gap: 8, marginTop: 12 },
  btnClicked: { flexDirection: "row", alignItems: "center", gap: 10 },
  btnText: { color: "red", fontFamily: "regular", fontSize: 15 },
});

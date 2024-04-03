import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Button,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import {
  collection,
  query,
  orderBy,
  getDocs,
  limit,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../Config/Firebase.config";
import { doc, deleteDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";

const MAX_MESSAGE_LENGTH = 50;

export default function Messages({ chat }) {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const currentUser = useSelector((state) => state.user.userData);
  const [lastMessage, setLastMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const fetchLastMessage = useCallback(async () => {
    const messagesRef = collection(db, `chats/${chat.id}/messages`);
    const q = query(messagesRef, orderBy("timeStamp", "desc"), limit(1));

    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const lastMessageDoc = querySnapshot.docs[0];
        const lastMessageData = lastMessageDoc.data();
        const messageText = lastMessageData.message;
        setLastMessage(truncateMessage(messageText));
      } else {
        setLastMessage("Start conversation");
      }
    } catch (error) {
      console.error("Error fetching last message:", error);
    }
  }, [chat.id]);
  let mainUser;
  chat.users.map((el) => (mainUser = el));
  useEffect(() => {
    if (isFocused) {
      fetchLastMessage();
    }
  }, [isFocused, fetchLastMessage]);

  const truncateMessage = (message) => {
    if (message.length > MAX_MESSAGE_LENGTH) {
      return message.slice(0, MAX_MESSAGE_LENGTH) + "...";
    }
    return message;
  };

  const handleDeleteChat = async () => {
    try {
      const chatRef = doc(db, "chats", chat.id);
      const chatDoc = await getDoc(chatRef);

      if (chatDoc.exists()) {
        const chatData = chatDoc.data();
        if (chatData.chatIs === "person") {
          setShowDeleteModal(false);
          await deleteDoc(chatRef);
        } else if (chatData.chatIs === "group") {
          const userIndex = chatData.users.findIndex(
            (user) =>
              user.providerData[0].email === currentUser.providerData[0].email
          );
          if (userIndex !== -1) {
            const updatedUsers = [...chatData.users];
            updatedUsers.splice(userIndex, 1);
            setShowDeleteModal(false);
            await updateDoc(chatRef, { users: updatedUsers });
          }
        }
      } else {
        console.log("Chat not found");
      }
    } catch (error) {
      console.error("Error removing chat:", error);
      setShowDeleteModal(false);
    }
  };

  const handleEditProfile = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.cancelled) {
        setImageUrl([...imageUrl, result.assets[0].uri]);
      }
    } catch (err) {
      console.log("img", err);
    }
  };

  return (
    <View style={styles.chatItem}>
      <TouchableOpacity onPress={() => setIsClicked(!isClicked)}>
        <Image
          source={{
            uri:
              chat.chatIs === "person" && chat.users.length === 2
                ? chat.users.find(
                    (user) =>
                      user.providerData[0].email !==
                      currentUser.providerData[0].email
                  )?.profilePic || ""
                : chat.groupIcon,
          }}
          style={styles.avatar}
          resizeMode="cover"
        />
      </TouchableOpacity>
      <View style={styles.chatContent}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(
              "ChatScreen",
              { room: chat },
              setIsClicked(false)
            )
          }
        >
          <Text style={styles.chatName}>
            {chat.chatName === currentUser.fullName &&
            chat.chatName !== mainUser.fullName
              ? chat.users
                  .filter(
                    (user) =>
                      user.providerData[0].email !==
                      currentUser.providerData[0].email
                  )
                  .map((user) => user.fullName)
                  .join(", ")
              : chat.chatName}
          </Text>
          <Text style={styles.chatMessage}>
            {lastMessage ? lastMessage : "Start conversation"}
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowDeleteModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.deleteModal}>
              <Text style={styles.deleteMessage}>Delete Chat?</Text>
              <View style={styles.deleteButtonContainer}>
                <Button
                  title="Cancel"
                  onPress={() => setShowDeleteModal(false)}
                />
                <Button title="Delete" onPress={handleDeleteChat} color="red" />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      {isClicked && (
        <View style={styles.editProfile}>
          <TouchableOpacity
            onPress={() => setShowDeleteModal(true)}
            style={styles.delteBtn}
          >
            <MaterialIcons name="delete" size={24} color="white" />
          </TouchableOpacity>
          {chat.chatIs === "group" && (
            <TouchableOpacity
              onPress={handleEditProfile}
              style={styles.editBtn}
            >
              <MaterialIcons name="edit" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    position: "relative",
  },
  avatar: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 25,
  },
  chatContent: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  chatMessage: {
    fontSize: 14,
    color: "#666",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteModal: {
    backgroundColor: "white",
    width: 300,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  deleteMessage: {
    fontSize: 18,
    marginBottom: 20,
  },
  deleteButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  editProfile: {
    width: 80,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 20,
    padding: 5,
  },
});

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { collection, query, orderBy, getDocs, limit } from "firebase/firestore";
import { db } from "../Config/Firebase.config";

const MAX_MESSAGE_LENGTH = 50;

export default function Messages({ chat }) {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);
  const [lastMessage, setLastMessage] = useState("");

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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUrl([...imageUrl, result.assets[0].uri]);
    }
  };

  return (
    <View style={styles.chatItem}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Image
          source={{ uri: chat.groupIcon }}
          style={styles.avatar}
          resizeMode="cover"
        />
      </TouchableOpacity>
      <View style={styles.chatContent}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ChatScreen", { room: chat })}
        >
          <Text style={styles.chatName}>{chat.chatName}</Text>
          <Text style={styles.chatMessage}>
            {lastMessage ? lastMessage : "Start conversation"}
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Button title="Select Image" onPress={pickImage} />
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    width: 350,
    height: 300,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    gap: 10,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

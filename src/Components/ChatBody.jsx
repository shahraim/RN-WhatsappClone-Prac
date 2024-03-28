import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ImageBackground,
} from "react-native";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { addDoc, collection, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../Config/Firebase.config";
import { useSelector } from "react-redux";
import ChatMessages from "./ChatMessages";

export default function ChatBody({ room }) {
  const [message, setMessage] = useState("");
  const currentUser = useSelector((state) => state?.user?.userData);

  const sendMessage = () => {
    if (!message.trim()) {
      return;
    }
    const timeStamp = serverTimestamp();
    const id = `${Date.now()}`;
    const messageDoc = {
      id: id,
      roomId: room.id,
      timeStamp: timeStamp,
      message: message,
      user: currentUser,
    };
    setMessage("");
    addDoc(collection(doc(db, "chats", room.id), "messages"), messageDoc)
      .then(() => {})
      .catch((err) => alert(err));
  };

  return (
    <View style={styles.body}>
      <ImageBackground
        source={{
          uri: "https://i0.wp.com/www.gizdev.com/wp-content/uploads/2022/02/WhatsApp-ChatBackground-Walls-5.jpg?w=1080&ssl=1",
        }}
        resizeMode="cover"
        style={styles.image}
      />
      {/* chat messahe here */}
      <ChatMessages room={room} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        style={styles.inputContainer}
      >
        <TouchableOpacity style={styles.emojiButton}>
          <Entypo name="emoji-happy" size={20} color="#000" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type Here ..."
          placeholderTextColor="#000"
          value={message}
          onChangeText={(text) => setMessage(text)}
          multiline
        />
        <TouchableOpacity style={styles.micButton}>
          <Entypo name="mic" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <FontAwesome name="send" size={20} color="#000" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  body: {
    flex: 1,
    backgroundColor: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#fff",
  },
  emojiButton: {
    padding: 10,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  micButton: {
    padding: 10,
  },
  sendButton: {
    padding: 10,
  },
});

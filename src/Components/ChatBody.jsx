import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TextInput,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../Config/Firebase.config";
import { useSelector } from "react-redux";

export default function ChatBody({ room }) {
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = useSelector((state) => state?.user?.userData);
  const scrollViewRef = useRef();

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

  useLayoutEffect(() => {
    const msgQuery = query(
      collection(db, "chats", room.id, "messages"),
      orderBy("timeStamp", "asc")
    );
    const unSubscribe = onSnapshot(msgQuery, (querySnapshot) => {
      const msg = querySnapshot.docs.map((doc) => doc.data());
      setAllMessages(msg);
      setIsLoading(false);
    });
    return unSubscribe;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
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
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        onContentSizeChange={scrollToBottom}
      >
        {!isLoading ? (
          <View style={{ marginVertical: 10 }}>
            {allMessages?.map((el, ind) => (
              <View
                key={ind}
                style={[
                  styles.messageContainer,
                  el.user?.providerData[0]?.email ===
                  currentUser?.providerData[0].email
                    ? styles.senderMessageContainer
                    : styles.receiverMessageContainer,
                ]}
              >
                <Image
                  source={{ uri: el?.user?.profilePic }}
                  width={25}
                  height={25}
                  style={[
                    el.user?.providerData[0]?.email ===
                    currentUser?.providerData[0].email
                      ? styles.senderMessageImg
                      : styles.receiverMessageImg,
                  ]}
                />
                <View
                  style={[
                    styles.messageContainer,
                    el.user?.providerData[0]?.email ===
                    currentUser?.providerData[0].email
                      ? styles.senderMessageText
                      : styles.receiverMessageText,
                  ]}
                >
                  <Text style={styles.messageText}>{el.message}</Text>
                  {el?.timeStamp ? (
                    <Text style={{ fontSize: 10, color: "gray" }}>
                      {new Date(
                        parseInt(el?.timeStamp?.seconds) * 1000
                      ).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
                    </Text>
                  ) : (
                    <Text style={{ fontSize: 10, color: "gray" }}>sending</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
      </ScrollView>
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
  messageContainer: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 10,
  },
  senderMessageContainer: {
    alignSelf: "flex-end",
  },
  senderMessageImg: {
    display: "none",
  },
  receiverMessageContainer: {
    alignSelf: "flex-start",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  senderMessageText: {
    backgroundColor: "#DCF8C5",
  },
  receiverMessageText: {
    backgroundColor: "#E8E8E8",
    marginLeft: 3,
  },
  receiverMessageImg: {
    alignSelf: "flex-start",
  },
  messageText: {
    color: "#000",
  },
});

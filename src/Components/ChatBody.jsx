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
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { Ionicons, FontAwesome, Entypo } from "@expo/vector-icons";
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

export default function ChatBody() {
  const scrollViewRef = useRef();

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
        <TouchableOpacity
          style={styles.emojiButton}
          // onPress={toggleEmojiKeyboard}
        >
          <Entypo name="emoji-happy" size={20} color="#000" />
        </TouchableOpacity>
        <TextInput
          // ref={inputRef}
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

const styles = StyleSheet.create({});

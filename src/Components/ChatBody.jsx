import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ImageBackground,
  Modal,
  Text,
} from "react-native";
import { FontAwesome, Entypo, Ionicons } from "@expo/vector-icons";
import { addDoc, collection, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../Config/Firebase.config";
import { useSelector } from "react-redux";
import ChatMessages from "./ChatMessages";
import { useFonts } from "expo-font";

export default function ChatBody({ room }) {
  const [message, setMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const currentUser = useSelector((state) => state?.user?.userData);

  const [loaded] = useFonts({
    regular: require("../../assets/fonts/Poppins-Regular.ttf"),
    medium: require("../../assets/fonts/Poppins-Medium.ttf"),
    bold: require("../../assets/fonts/Poppins-Bold.ttf"),
  });
  if (!loaded) {
    return null;
  }
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
      <ChatMessages room={room} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        style={styles.inputContainer}
      >
        <TouchableOpacity
          style={styles.morePin}
          onPress={() => setModalVisible(true)}
        >
          <FontAwesome name="paperclip" size={22} color="rgba(0, 14, 8, 0.7)" />
        </TouchableOpacity>
        <View style={styles.inputArea}>
          <TouchableOpacity style={styles.emojiButton}>
            <FontAwesome name="smile-o" size={20} color="rgba(0, 14, 8, 0.7)" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Write Your Mess.."
            placeholderTextColor="#aaa"
            value={message}
            onChangeText={(text) => setMessage(text)}
            multiline
          />
        </View>
        <TouchableOpacity style={styles.micButton} onPress={sendMessage}>
          <Ionicons name="mic-outline" size={25} color="rgba(0, 14, 8, 0.7)" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <FontAwesome name="send-o" size={20} color="rgba(0, 14, 8, 0.7)" />
        </TouchableOpacity>
      </KeyboardAvoidingView>

      {/* Modal for bottom */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={styles.closeIcon}
                  onPress={() => setModalVisible(false)}
                >
                  <Ionicons name="close" size={20} />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Share Content</Text>
                <View></View>
              </View>
              <View style={styles.optionContainer}>
                <TouchableOpacity style={styles.optionItem}>
                  {/* Camera icon */}
                  <Ionicons
                    style={styles.icon}
                    name="camera-outline"
                    size={26}
                    color="rgba(121,124,123,0.8)"
                  />
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionText}>Camera</Text>
                    <Text style={styles.optionSubtext}>Share image</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionItem}>
                  {/* Document icon */}
                  <Ionicons
                    style={styles.icon}
                    name="document-outline"
                    size={26}
                    color="rgba(121,124,123,0.8)"
                  />
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionText}>Documents</Text>
                    <Text style={styles.optionSubtext}>Share your files</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionItem}>
                  {/* Media icon */}
                  <Ionicons
                    style={styles.icon}
                    name="image-outline"
                    size={26}
                    color="rgba(121,124,123,0.8)"
                  />
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionText}>Media</Text>
                    <Text style={styles.optionSubtext}>
                      Share photos and videos
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionItem}>
                  {/* contact icon */}
                  <Ionicons
                    style={styles.icon}
                    name="person-circle-outline"
                    size={28}
                    color="rgba(121,124,123,0.8)"
                  />
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionText}>Contact</Text>
                    <Text style={styles.optionSubtext}>
                      Share your contacts
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionItem}>
                  {/* location icon */}
                  <Ionicons
                    style={styles.icon}
                    name="location-outline"
                    size={28}
                    color="rgba(121,124,123,0.8)"
                  />
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionText}>Location</Text>
                    <Text style={styles.optionSubtext}>
                      Share your Location
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
    justifyContent: "space-between",
    paddingHorizontal: 17,
    paddingVertical: 18,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
    elevation: 5,
  },
  emojiButton: {
    padding: 10,
    position: "absolute",
    right: 5,
    zIndex: 1,
    top: "8%",
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: "#F3F6F6",
    paddingRight: 40,
  },
  inputArea: {
    width: 270,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    // alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "100%",
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: "medium",
  },
  optionContainer: {
    gap: 30,
    // height: 460,
    marginVertical: 15,
  },
  optionItem: {
    alignItems: "center",
    flexDirection: "row",
    height: 44,
    gap: 12,
  },
  optionTextContainer: { gap: -3 },
  optionText: {
    fontSize: 16,
    fontFamily: "bold",
  },
  optionSubtext: {
    fontSize: 12,
    color: "rgba(121,124,123,0.7)",
    fontFamily: "regular",
  },
  icon: {
    backgroundColor: "#F2F8F7",
    height: 44,
    width: 44,
    borderRadius: 100,
    textAlign: "center",
    textAlignVertical: "center",
  },
  closeIcon: {
    position: "absolute",
    left: 0,
    padding: 5,
    borderRadius: 10,
  },
});

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Button,
  TouchableOpacityComponent,
} from "react-native";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../Config/Firebase.config";
import { useSelector } from "react-redux";
import { useFonts } from "expo-font";

// Sender message component
const SenderMessage = ({ message }) => {
  return (
    <View style={[styles.messageContainer, styles.senderMessageContainer]}>
      <View style={styles.messageArea}>
        <View style={styles.senderMainMessage}>
          <Text style={[styles.messageText, styles.senderMessageText]}>
            {message.message}
          </Text>
        </View>
        <View style={{ alignSelf: "flex-end", marginTop: 1 }}>
          <Text style={{ fontSize: 10, color: "gray" }}>
            {message?.timeStamp
              ? new Date(message.timeStamp.seconds * 1000).toLocaleTimeString(
                  "en-US",
                  {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  }
                )
              : "sending"}
          </Text>
        </View>
      </View>
    </View>
  );
};

// Receiver message component
const ReceiverMessage = ({ message }) => {
  return (
    <View style={[styles.messageContainer, styles.receiverMessageContainer]}>
      <Image
        source={{ uri: message?.user?.profilePic }}
        width={38}
        height={38}
        style={styles.receiverMessageImg}
      />
      <View style={styles.messageArea}>
        <Text style={styles.userName}>{message?.user?.fullName}</Text>
        <View style={styles.recieverMainMessage}>
          <Text style={styles.messageText}>{message.message}</Text>
        </View>
        <View style={{ alignSelf: "flex-end", marginTop: 1 }}>
          <Text style={{ fontSize: 10, color: "gray" }}>
            {message?.timeStamp
              ? new Date(message.timeStamp.seconds * 1000).toLocaleTimeString(
                  "en-US",
                  {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  }
                )
              : "sending"}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default function ChatMessages({ room }) {
  const scrollViewRef = useRef();
  const [allMessages, setAllMessages] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const currentUser = useSelector((state) => state?.user?.userData);

  useEffect(() => {
    const msgQuery = query(
      collection(db, "chats", room.id, "messages"),
      orderBy("timeStamp", "asc")
    );
    const unSubscribe = onSnapshot(msgQuery, (querySnapshot) => {
      const msg = querySnapshot.docs.map((doc) => ({
        _id: doc.id,
        ...doc.data(),
      }));
      setAllMessages(msg);
      setIsLoading(false);
    });
    return unSubscribe;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  const [loaded] = useFonts({
    regular: require("../../assets/fonts/Poppins-Regular.ttf"),
    medium: require("../../assets/fonts/Poppins-Medium.ttf"),
  });
  if (!loaded) {
    return null;
  }

  const onDeleteMessage = async () => {
    try {
      if (selectedMessage) {
        setShowDeleteModal(false);
        await deleteDoc(
          doc(db, `chats/${room.id}/messages`, selectedMessage._id)
        );
      } else {
        console.log("Cannot delete messages.");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleLongPress = (message) => {
    if (
      message.user.providerData[0].email === currentUser.providerData[0].email
    ) {
      setSelectedMessage(message);
      setShowDeleteModal(true);
    } else {
      console.log("You can only delete your own messages.");
    }
  };

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  return (
    <>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        onContentSizeChange={scrollToBottom}
      >
        {!isLoading ? (
          <View style={{ marginVertical: 10, position: "relative" }}>
            {allMessages?.map((message, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setShowDeleteModal(false)}
                onLongPress={() => handleLongPress(message)}
              >
                {message.user.providerData[0].email ===
                currentUser.providerData[0].email ? (
                  <SenderMessage message={message} key={index} />
                ) : (
                  <ReceiverMessage message={message} key={index} />
                )}
              </TouchableOpacity>
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to delete this message?
            </Text>
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => setShowDeleteModal(false)}
              />
              <Button title="Delete" onPress={onDeleteMessage} color="red" />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    padding: 8,
    maxWidth: 300,
    flexDirection: "row",
  },
  senderMessageContainer: {
    alignSelf: "flex-end",
  },
  receiverMessageContainer: {
    alignSelf: "flex-start",
  },
  senderMainMessage: {
    backgroundColor: "#3D4A7A",
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  recieverMainMessage: {
    backgroundColor: "#E8E8E8",
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  receiverMessageImg: {
    marginHorizontal: 5,
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  messageText: {
    color: "#000E08",
    fontFamily: "regular",
    fontSize: 12,
  },
  messageArea: {
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 3,
  },
  userName: {
    fontSize: 13,
    color: "#000E08",
    marginLeft: 3,
    fontFamily: "medium",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  senderMessageText: {
    color: "#fff",
  },
});

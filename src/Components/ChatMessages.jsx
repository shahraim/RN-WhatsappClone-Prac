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
    // const currentTime = new Date();
    // const messageTime = new Date(selectedMessage?.timeStamp?.seconds * 1000);
    // const differenceInHours = (currentTime - messageTime) / (1000 * 60 * 60);
    // if (differenceInHours <= 1) {
    // }
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
            {allMessages?.map((el, ind) => (
              <TouchableOpacity
                key={ind}
                onPress={() => setShowDeleteModal(false)}
                onLongPress={() => handleLongPress(el)}
              >
                <View
                  key={ind}
                  style={[
                    { margin: 8 },
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
                  <View style={styles.messageArea}>
                    <View
                      style={[
                        styles.messageContainer,
                        el.user?.providerData[0]?.email ===
                        currentUser?.providerData[0].email
                          ? styles.senderMainMessage
                          : styles.recieverMainMessage,
                      ]}
                    >
                      <Text style={styles.userName}>{el.user?.fullName}</Text>
                      <Text style={styles.messageText}>{el.message}</Text>
                    </View>
                    {el?.timeStamp ? (
                      <Text
                        style={{
                          fontSize: 10,
                          color: "gray",
                        }}
                      >
                        {new Date(
                          parseInt(el?.timeStamp?.seconds) * 1000
                        ).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })}
                      </Text>
                    ) : (
                      <Text style={{ fontSize: 10, color: "gray" }}>
                        sending
                      </Text>
                    )}
                  </View>
                </View>
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
    // maxWidth: "80%",
    padding: 8,
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
  // senderMessageText: {
  //   backgroundColor: "#DCF8C5",
  // },
  // receiverMessageText: {
  //   backgroundColor: "#E8E8E8",
  //   marginLeft: 3,
  // },
  senderMainMessage: {
    backgroundColor: "#DCF8C5",
  },
  recieverMainMessage: {
    backgroundColor: "#E8E8E8",
  },
  receiverMessageImg: {
    alignSelf: "flex-start",
  },
  messageText: {
    color: "#000",
  },
  messageArea: {
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 3,
  },
  userName: {
    fontSize: 10,
    color: "gray",
    marginLeft: 3,
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
});

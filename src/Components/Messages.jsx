import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Messages({ chat }) {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleImageSelection = () => {
    // Logic to handle image selection
  };

  const handleImageUrlSubmit = () => {
    // Logic to handle URL submission
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
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui,
            laborum quod. Fugit, praesent...
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Button title="Select Image" onPress={handleImageSelection} />
            <TextInput
              style={styles.input}
              placeholder="Enter Image URL"
              onChangeText={(text) => setImageUrl(text)}
            />
            <Button title="Submit" onPress={handleImageUrlSubmit} />
            <Button
              title="Close"
              onPress={() => setModalVisible(!modalVisible)}
            />
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
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: "80%",
  },
});
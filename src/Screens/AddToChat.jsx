import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../Config/Firebase.config";
import { useNavigation } from "@react-navigation/native";

export default function AddToChat() {
  const navigation = useNavigation();
  const selector = useSelector((state) => state.user.userData);
  const [chatSearch, setChatSearch] = useState("");
  const addChat = () => {
    const id = `${Date.now()}`;
    const chatDoc = {
      id: id,
      groupIcon:
        "https://png.pngtree.com/png-clipart/20190620/original/pngtree-vector-leader-of-group-icon-png-image_4022100.jpg",
      user: selector,
      chatName: chatSearch,
    };
    console.log(chatDoc);
    
    if (chatSearch !== "") {
      setDoc(doc(db, "chats", id), chatDoc)
        .then(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: "Chatter" }],
          });
        })
        .catch((err) => alert(err));
    } else {
      alert("input empty");
    }
  };

  return (
    <View style={{ margin: 10 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderWidth: 1,
          borderColor: "green",
          paddingHorizontal: 10,
          borderRadius: 20,
        }}
      >
        <Ionicons name="chatbubbles" size={20} color={"gray"} />
        <TextInput
          placeholder="Create chat"
          placeholderTextColor={"gray"}
          value={chatSearch}
          onChangeText={(text) => setChatSearch(text)}
          style={{
            width: "80%",
            height: 40,
          }}
        />
        <TouchableOpacity onPress={addChat}>
          <FontAwesome name="send" size={20} color={"gray"} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});

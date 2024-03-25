import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

export default function UserChatScreen({ route, navigation }) {
  const { room } = route.params;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#075E54" />
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <View style={styles.textContainer}>
            <Image
              source={{
                uri: room.groupIcon,
              }}
              style={styles.avatar}
            />
            <Text style={styles.userName}>{room.chatName}</Text>
          </View>

          <View style={styles.iconContainer}>
            <TouchableOpacity style={styles.icon}>
              <FontAwesome name="phone" size={20} color="#075E54" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon}>
              <FontAwesome name="video-camera" size={20} color="#075E54" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* Message Body */}
      <View style={styles.body}>
        <Text>Messages will appear here</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 25,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 100,
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  icon: {
    marginLeft: 10,
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

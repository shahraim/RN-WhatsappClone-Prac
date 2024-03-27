import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import ChatBody from "../Components/ChatBody";

export default function UserChatScreen({ route, navigation }) {
  const { room } = route.params;
  const currentUser = useSelector((state) => state?.user?.userData);

  let mainUser;
  room.users.map((el) => (mainUser = el));

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#075E54" />
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <Image source={{ uri: room.groupIcon }} style={styles.avatar} />
          <Text style={styles.userName}>
            {room.chatName === currentUser.fullName &&
            room.chatName !== mainUser.fullName
              ? room.users
                  .filter(
                    (user) =>
                      user.providerData[0].email !==
                      currentUser.providerData[0].email
                  )
                  .map((user) => user.fullName)
                  .join(", ")
              : room.chatName}
          </Text>
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.icon}>
            <FontAwesome name="phone" size={20} color="#075E54" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon}>
            <FontAwesome name="video-camera" size={20} color="#075E54" />
          </TouchableOpacity>
          {room.chatIs === "group" && (
            <View style={styles.iconContainer}>
              <TouchableOpacity
                style={styles.icon}
                onPress={() =>
                  navigation.navigate("GroupOptions", { room: room })
                }
              >
                <MaterialIcons name="more-vert" size={20} color="#075E54" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Message Body */}
      <ChatBody room={room} />
      {/*  */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 30,
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
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginLeft: 10,
  },
});

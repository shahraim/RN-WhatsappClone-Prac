import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import ChatBody from "../Components/ChatBody";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";

export default function UserChatScreen({ route, navigation }) {
  const { room } = route.params;
  const currentUser = useSelector((state) => state?.user?.userData);

  let mainUser;
  room.users.map((el) => (mainUser = el));

  const [loaded] = useFonts({
    regular: require("../../assets/fonts/Poppins-Regular.ttf"),
    medium: require("../../assets/fonts/Poppins-Medium.ttf"),
  });
  if (!loaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.arrowBack}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000E08" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.userInfo}
          onPress={() =>
            room.chatIs === "group" &&
            navigation.navigate("GroupOptions", { room: room })
          }
        >
          <Image
            source={{
              uri:
                room.chatIs === "person" && room.users.length === 2
                  ? room.users.find(
                      (user) =>
                        user.providerData[0].email !==
                        currentUser.providerData[0].email
                    )?.profilePic || ""
                  : room.groupIcon,
            }}
            style={styles.avatar}
            resizeMode="cover"
          />
          <View style={styles.userNameInfo}>
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
            <Text style={styles.active}>Active now</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.icon}>
            <Ionicons name="call-outline" size={22} color="#000E08" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon}>
            <Ionicons name="videocam-outline" size={22} color="#000E08" />
          </TouchableOpacity>
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
    // height: 80,
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    textTransform: "capitalize",
    color: "#000",
    fontFamily: "medium",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginLeft: 2,
    padding: 5,
  },
  userNameInfo: { gap: -6 },
  active: {
    color: "#797C7B",
    fontSize: 11,
    fontFamily: "regular",
  },
  arrowBack: {
    paddingVertical: 10,
    paddingHorizontal: 2,
  },
});

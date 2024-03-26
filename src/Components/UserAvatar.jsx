import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

export default function UserAvatar({ width, height, margin }) {
  const navigation = useNavigation();
  const select = useSelector((state) => state?.user?.userData);
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Profile")}
      style={{ margin: margin }}
    >
      <Image
        source={{ uri: select?.profilePic }}
        resizeMode="contain"
        style={styles.avatar}
        width={width}
        height={height}
      />
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  avatar: {
    borderWidth: 2,
    borderColor: "gray",
    borderRadius: 40,
  },
});

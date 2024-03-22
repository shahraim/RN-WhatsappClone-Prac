import React from "react";
import { Text, View } from "react-native";
import { useSelector } from "react-redux";

export default function Chats() {
  const selector = useSelector((state) => state.user.userData);
  console.log("ss", selector);

  return (
    <View>
      <Text>Chats</Text>
    </View>
  );
}

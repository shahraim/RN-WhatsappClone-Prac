import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import UserAvatar from "./UserAvatar";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";

export default function AppBar() {
  const navigation = useNavigation();
  const [loaded] = useFonts({
    medium: require("../../assets/fonts/Poppins-Medium.ttf"),
  });
  if (!loaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Top Navbar */}
      <View style={styles.topNavbar}>
        <TouchableOpacity style={styles.searchBtn}>
          <Ionicons name="search-outline" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Ionicons
            name="refresh-outline"
            style={styles.refreshIcon}
            size={20}
            color={"white"}
          />
          <Text style={styles.title}>hatter</Text>
        </View>
        <UserAvatar width={44} height={44} margin={(0, 10, 0, 10)} />
      </View>
      {/* Add Person or Group */}
      <View style={styles.addPersonGroup}>
        {/* group */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate("GroupChats")}
        >
          <Image
            source={require("../../assets/group1.png")}
            style={styles.personIcon}
          />
          <Text style={styles.optionText}>Group Chat</Text>
        </TouchableOpacity>
        {/* person */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate("SingleChat")}
        >
          <Image
            source={require("../../assets/person1.png")}
            style={styles.personIcon}
          />
          <Text style={styles.optionText}>Single Chat</Text>
        </TouchableOpacity>
        {/* setting */}
        <TouchableOpacity style={styles.option}>
          <Image
            source={require("../../assets/setting.png")}
            style={styles.personIcon}
          />
          <Text style={styles.optionText}>Setting</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 18,
  },
  topNavbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: -2,
  },
  title: {
    fontSize: 20,
    color: "#fff",
    fontFamily: "medium",
    marginRight: -5,
  },
  refreshIcon: {
    marginBottom: 4,
  },
  addPersonGroup: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },

  option: {
    alignItems: "center",
    marginLeft: 20,
  },
  optionText: {
    fontSize: 12,
    marginTop: 5,
    color: "#fff",
  },
  searchBtn: {
    backgroundColor: "rgba(128,128,128,0.5)",
    borderRadius: 100,
    padding: 8,
  },
  personIcon: {
    width: 32,
    height: 32,
  },
});

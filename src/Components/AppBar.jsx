import {
  Image,
  Modal,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import UserAvatar from "./UserAvatar";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import SingleChat from "../Screens/SingleChat";
import { BlurView } from "expo-blur";

export default function AppBar() {
  const navigation = useNavigation();
  const [showSingleChatModal, setShowSingleChatModal] = useState(false); // State to control the visibility of the SingleChat modal

  const [loaded] = useFonts({
    medium: require("../../assets/fonts/Poppins-Medium.ttf"),
    regular: require("../../assets/fonts/Poppins-Regular.ttf"),
  });
  if (!loaded) {
    return null;
  }
  const closeSingleChatModal = () => {
    setShowSingleChatModal(false);
  };
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderRelease: (e, gestureState) => {
      // Checking if the user swiped down by a certain threshold
      if (gestureState.dy > 50) {
        closeSingleChatModal();
      }
    },
  });

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
          onPress={() => setShowSingleChatModal(true)} // Show the SingleChat modal when clicked
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

      <Modal
        visible={showSingleChatModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSingleChatModal(false)}
      >
        <View style={styles.modalContainer} {...panResponder.panHandlers}>
          <BlurView intensity={90} style={styles.blur}></BlurView>
          <View style={styles.modalContent}>
            <View style={styles.topBar}>
              <View style={styles.bar}></View>
            </View>
            <SingleChat closeModal={closeSingleChatModal} />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowSingleChatModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
              <Image
                style={styles.loginImg}
                source={require("../../assets/Rectangle 1159.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    fontFamily: "regular",
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
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    // backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "100%",
    height: 400,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 20,
    paddingTop: 0,
    alignItems: "center",
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  closeButton: {
    width: 327,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 25,
    position: "relative",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  topBar: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  bar: {
    width: 35,
    height: 4,
    borderRadius: 100,
    backgroundColor: "#c6c6c6",
  },
  loginImg: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: -1,
    borderRadius: 100,
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
  },
});

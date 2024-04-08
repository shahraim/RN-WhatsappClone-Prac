import React, { useLayoutEffect, useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import GroupOptions from "./GroupOptions";
import { db } from "../Config/Firebase.config";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";

export default function ChatOptions({ route, navigation }) {
  const { room } = route.params;
  const currentUser = useSelector((state) => state?.user?.userData);
  const [email, setEmail] = useState("");
  const [isButtonEnabled, setIsButtonEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [chatRoom, setChatRoom] = useState([]);

  useLayoutEffect(() => {
    setChatRoom([...room.users]);
  }, []);

  const toggleModal = () => {
    setShowModal(!showModal);
  };
  const [loaded] = useFonts({
    regular: require("../../assets/fonts/Poppins-Regular.ttf"),
    medium: require("../../assets/fonts/Poppins-Medium.ttf"),
    bold: require("../../assets/fonts/Poppins-Bold.ttf"),
  });
  if (!loaded) {
    return null;
  }
  let mainUser;
  room.users.map((el) => (mainUser = el));
  let userName =
    room.chatName === currentUser.fullName &&
    room.chatName !== mainUser.fullName
      ? room.users
          .filter(
            (user) =>
              user.providerData[0].email !== currentUser.providerData[0].email
          )
          .map((user) => user.fullName)
          .join(", ")
      : room.chatName;

  const addUserToGroup = async () => {
    if (!isButtonEnabled) return;

    if (email === "") {
      Alert.alert("Please enter user email");
      return;
    }

    setIsButtonEnabled(false);
    setIsLoading(true);

    try {
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(usersRef);

      let userExists = false;

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        userData.providerData.forEach((provider) => {
          if (provider.email === email) {
            userExists = true;
          }
        });
      });

      if (userExists) {
        const userExistsInGroup = room.users.some(
          (user) => user.providerData[0].email === email
        );

        if (userExistsInGroup) {
          Alert.alert("User is already in the group");
          setIsButtonEnabled(true);
          setIsLoading(false);
          setShowModal(false);
          return;
        }
        const userData = querySnapshot.docs
          .find((doc) => {
            return doc
              .data()
              .providerData.some((provider) => provider.email === email);
          })
          .data();
        const updatedUsers = [...room.users, userData];
        const updatedRoom = { ...room, users: updatedUsers };
        setChatRoom([...chatRoom, userData]);

        await setDoc(doc(db, "chats", room.id), updatedRoom);

        Alert.alert("User added to the group");
        setShowModal(false);
        setEmail("");
      } else {
        Alert.alert("User with the specified email does not exist");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error adding user to group:", error);
      Alert.alert("Error", "An error occurred while adding user to the group");
    } finally {
      setIsButtonEnabled(true);
      setEmail("");
      setShowModal(false);
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/Home.jpg")}
        resizeMode="cover"
        style={styles.image}
      >
        <StatusBar style="light" />
        <TouchableOpacity
          style={styles.arrowBack}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color={"white"} />
        </TouchableOpacity>
        <View style={styles.userInfo}>
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
          <Text style={styles.chatName}>{userName}</Text>
          <View style={styles.iconsContainer}>
            <TouchableOpacity style={styles.iconsTab}>
              <Ionicons name="chatbubble-outline" size={20} color={"white"} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconsTab}>
              <Ionicons name="videocam-outline" size={20} color={"white"} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconsTab}>
              <Ionicons name="call-outline" size={20} color={"white"} />
            </TouchableOpacity>
            {room.chatIs === "group" && (
              <TouchableOpacity style={styles.iconsTab} onPress={toggleModal}>
                <Ionicons name="add-circle-outline" size={25} color={"white"} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.mainInfo}>
          <View style={styles.topBar}>
            <View style={styles.bar}></View>
          </View>
          {room.chatIs === "person" && (
            <>
              <View style={styles.personInfo}>
                <View style={styles.nameBox}>
                  <Text style={styles.subName}>Display Name</Text>
                  <Text style={styles.nameInfo}>{userName}</Text>
                </View>
                <View style={styles.nameBox}>
                  <Text style={styles.subName}>Email Address</Text>
                  <Text style={styles.nameInfo}>
                    {room.users
                      .filter(
                        (el) =>
                          currentUser.providerData[0].email !==
                          el.providerData[0].email
                      )
                      .map((user) => user.providerData[0].email)}
                  </Text>
                </View>
                <View style={styles.nameBox}>
                  <Text style={styles.subName}>Address</Text>
                  <Text style={styles.nameInfo}>
                    33 street west subidbazar,sylhet
                  </Text>
                </View>
                <View style={styles.nameBox}>
                  <Text style={styles.subName}>Phone Number</Text>
                  <Text style={styles.nameInfo}>(320) 555-0104</Text>
                </View>
              </View>
              <View style={styles.mediaContainer}>
                <View style={styles.mediaHeader}>
                  <Text style={styles.mediaTitle}>Media Shared</Text>
                  <Text style={styles.mediaView}>View All</Text>
                </View>
                <View style={styles.mediaItemsContainer}>
                  <Image source={require("../../assets/Rectangle 1154.png")} />
                  <Image source={require("../../assets/Rectangle 1155.png")} />
                  <Image source={require("../../assets/Group 430.png")} />
                </View>
              </View>
            </>
          )}
          {room.chatIs === "group" && (
            <GroupOptions
              chatRoom={chatRoom}
              isLoading={isLoading}
              room={room}
            />
          )}
          <Modal
            animationType="slide"
            transparent={true}
            visible={showModal}
            onRequestClose={toggleModal}
          >
            {/* Content of the modal */}
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TextInput
                  placeholder="Enter user email"
                  placeholderTextColor={"gray"}
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                  style={styles.input}
                  autoCapitalize={"none"}
                />
                <TouchableOpacity
                  onPress={addUserToGroup}
                  disabled={!isButtonEnabled}
                  style={[
                    styles.button,
                    {
                      opacity: isButtonEnabled ? 1 : 0.5,
                    },
                  ]}
                >
                  <Text style={styles.buttonText}>Add User to Group</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={toggleModal}
                  style={styles.closeButton}
                >
                  <Ionicons name="close-circle" size={30} color="#383A78" />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  arrowBack: {
    position: "absolute",
    top: 50,
    left: 15,
    padding: 8,
    borderRadius: 100,
    zIndex: 1,
  },
  userInfo: {
    alignItems: "center",
    marginTop: 60,
    gap: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  chatName: {
    fontSize: 20,
    fontFamily: "bold",
    color: "#fff",
    lineHeight: 24,
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    gap: 28,
  },
  iconsTab: {
    backgroundColor: "rgba(255,255,255,0.2)",
    height: 44,
    width: 44,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  mainInfo: {
    backgroundColor: "#fff",
    flex: 1,
    marginTop: 25,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 20,
    paddingTop: 40,
  },
  topBar: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 10,
    left: "50%",
    borderRadius: 100,
  },
  bar: {
    width: 35,
    height: 4,
    borderRadius: 100,
    backgroundColor: "#d6d6d6",
  },
  personInfo: {
    gap: 18,
  },
  nameBox: {},
  subName: {
    fontSize: 14,
    fontFamily: "regular",
    color: "#898C8B",
  },
  nameInfo: {
    fontSize: 18,
    fontFamily: "medium",
    color: "#000E08",
    paddingLeft: 5,
  },
  mediaContainer: {
    marginTop: 25,
  },
  mediaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  mediaItemsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    alignItems: "center",
    marginTop: 10,
  },
  mediaTitle: {
    fontSize: 14,
    color: "#797C7B",
    fontFamily: "regular",
  },
  mediaView: {
    fontSize: 14,
    color: "#20A090",
    fontFamily: "regular",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "80%",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    gap: 10,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    color: "red",
  },
  input: {
    borderBottomWidth: 1,
    width: "100%",
    height: 50,
  },
  button: {
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#383A78",
    borderRadius: 100,
    padding: 12,
  },
  buttonText: {
    fontFamily: "medium",
    color: "#383A78",
  },
});

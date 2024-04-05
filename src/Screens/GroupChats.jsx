import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  Text,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { doc, getDocs, setDoc, collection } from "firebase/firestore";
import { db } from "../Config/Firebase.config";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";

export default function GroupChats() {
  const navigation = useNavigation();
  const currentUser = useSelector((state) => state.user.userData);
  const [email, setEmail] = useState("");
  const [chatName, setChatName] = useState("");
  const [isButtonEnabled, setIsButtonEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [loaded] = useFonts({
    medium: require("../../assets/fonts/Poppins-Medium.ttf"),
    regular: require("../../assets/fonts/Poppins-Regular.ttf"),
  });
  if (!loaded) {
    return null;
  }

  const addUserToChat = async () => {
    if (!isButtonEnabled) return;

    if (email === "" || chatName === "") {
      Alert.alert("Please enter both user email and chat name");
      return;
    }

    setIsButtonEnabled(false);
    setIsLoading(true);

    if (email === currentUser.providerData[0].email) {
      alert("u cnt add your self");
      setIsButtonEnabled(true);
      setIsLoading(false);
      return;
    }

    try {
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(usersRef);

      let userSnapshot;
      let userDataTwo;
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        userData.providerData.forEach((provider) => {
          if (provider.email === email) {
            userSnapshot = doc;
            userDataTwo = userData;
          }
        });
      });

      if (userSnapshot && userDataTwo) {
        const id = `${Date.now()}`;
        const chatDoc = {
          id: id,
          groupIcon:
            "https://png.pngtree.com/png-clipart/20190620/original/pngtree-vector-leader-of-group-icon-png-image_4022100.jpg",
          users: [currentUser, userDataTwo],
          chatName: chatName,
          chatIs: "group",
        };

        await setDoc(doc(db, "chats", id), chatDoc);

        navigation.reset({
          index: 0,
          routes: [{ name: "Chatter" }],
        });
      } else {
        Alert.alert("User with the specified email does not exist");
        setIsLoading(false);
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred: " + error.message);
      setIsLoading(false);
    } finally {
      setIsButtonEnabled(true);
      setIsLoading(false);
    }
  };

  return (
    <>
      <StatusBar style="dark" />
      <TouchableOpacity
        style={styles.arrowBack}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={20} color={"black"} />
      </TouchableOpacity>
      {/*  */}
      <View style={styles.container}>
        <View style={styles.groupHead}>
          <Text style={styles.groupDes}>Group Description</Text>
          <Text style={styles.groupPara}>Make Group for Team Work</Text>
          <View style={styles.groupPoint}>
            <Text style={styles.point}>Group work</Text>
            <Text style={styles.point}>Team relationship</Text>
          </View>
        </View>
        <View style={{ alignItems: "center", gap: 10 }}>
          {/* chat name */}
          <View style={styles.mainInput}>
            <Text style={styles.inputLabel}>Chat Name</Text>
            <View style={[styles.undrContain]}>
              <View style={styles.inputContainer}>
                <Ionicons name="chatbox-outline" color="#000" size={20} />
                <TextInput
                  value={chatName}
                  onChangeText={(text) => setChatName(text)}
                  style={[styles.input]}
                />
              </View>
            </View>
          </View>

          {/* user email to add */}
          <View style={styles.mainInput}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={[styles.undrContain]}>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" color="#000" size={20} />
                <TextInput
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                  style={styles.input}
                  autoCapitalize={"none"}
                />
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={addUserToChat}
            disabled={!isButtonEnabled}
            style={[styles.button, { opacity: isButtonEnabled ? 1 : 0.5 }]}
          >
            <Text style={{ color: "#fff", fontFamily: "regular" }}>
              {isLoading ? (
                <ActivityIndicator size={"small"} color={"#fff"} />
              ) : (
                "Create"
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    gap: 50,
  },
  mainInput: {
    height: 65,
    marginVertical: 10,
  },
  inputLabel: {
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: 0.1,
    fontFamily: "medium",
    color: "#3D4A7A",
    marginLeft: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingLeft: 10,
  },
  input: {
    height: "100%",
    width: "85%",
  },
  button: {
    marginLeft: 10,
    padding: 15,
    borderRadius: 100,
    backgroundColor: "#3D4A7A",
    width: 327,
    alignItems: "center",
  },
  arrowBack: {
    position: "absolute",
    top: 45,
    left: 15,
    padding: 8,
    borderRadius: 100,
    zIndex: 1,
  },
  groupHead: {
    gap: 5,
  },
  groupDes: {
    fontSize: 16,
    fontFamily: "medium",
    color: "rgba(121,124,123,0.5)",
  },
  groupPara: {
    fontSize: 40,
    fontFamily: "medium",
    color: "#000E08",
    lineHeight: 50,
  },
  groupPoint: {
    flexDirection: "row",
    gap: 10,
  },
  point: {
    fontSize: 14,
    fontFamily: "regular",
    color: "#000E08",
    backgroundColor: "rgba(61,74,122,0.1)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 30,
  },
  undrContain: {
    alignItems: "center",
    width: 370,
    height: 40,
    borderBottomWidth: 1,
    borderRadius: 8,
    borderColor: "gray",
  },
});

import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import UserInputs from "../Components/UserInputs";
import * as Progress from "react-native-progress";
import { BlurView } from "expo-blur";
import { avatars } from "../Utils/Avatar";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../Config/Firebase.config";
import { doc, setDoc } from "firebase/firestore";

export default function SignUp({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailIsValid, setEmailIsValid] = useState(false);
  const [password, setPassword] = useState("");
  const [isAvatar, setIsAvatar] = useState(false);
  const [isProgress, setIsProgress] = useState(false);
  const [avatar, setAvatar] = useState(avatars[0]?.image.asset.url);
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  const handleAvatar = (item) => {
    setAvatar(item?.image.asset.url);
    setIsAvatar(false);
  };

  const handleSingUp = async () => {
    setIsProgress(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        const data = {
          _id: userCredential?.user.uid,
          fullName: name,
          profilePic: avatar,
          alreadyIn: false,
          providerData: userCredential.user.providerData,
        };
        setDoc(doc(db, "users", userCredential?.user.uid), data).then((res) => {
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
          setIsProgress(false);
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
        setIsProgress(false);
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        {isAvatar && (
          <View
            style={[
              styles.overlay,
              { width: screenWidth, height: screenHeight },
            ]}
          >
            <BlurView
              intensity={90}
              style={[
                styles.blurView,
                { width: screenWidth, height: screenHeight },
              ]}
              tint="systemMaterialDark"
            >
              {avatars?.map((el) => (
                <TouchableOpacity
                  key={el._id}
                  style={styles.imgAvatar}
                  onPress={() => handleAvatar(el)}
                >
                  <Image
                    source={{ uri: el?.image.asset.url }}
                    style={styles.avatarImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              ))}
            </BlurView>
          </View>
        )}
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={() => setIsAvatar(true)}
        >
          <Image
            source={{ uri: avatar }}
            resizeMode="contain"
            style={styles.avatar}
          />
        </TouchableOpacity>
        <UserInputs
          placeholder={"Full Name"}
          isPass={false}
          setStateValue={setName}
        />
        <UserInputs
          placeholder={"Email"}
          isPass={false}
          setStateValue={setEmail}
          setEmailIsValid={setEmailIsValid}
        />
        <UserInputs
          placeholder={"Password"}
          isPass={true}
          setStateValue={setPassword}
        />
        <TouchableOpacity style={styles.signUpButton} onPress={handleSingUp}>
          <Text style={styles.signUpButtonText}>
            {isProgress ? <ActivityIndicator color={"gray"} /> : "Sign Up"}
          </Text>
        </TouchableOpacity>
        <View style={styles.bottomTextContainer}>
          <Text style={styles.bottomText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  overlay: {
    position: "absolute",
    zIndex: 8,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  blurView: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderColor: "gray",
    borderRadius: 40,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  imgAvatar: {
    margin: 15,
  },
  signUpButton: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
  },
  signUpButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  bottomText: {
    marginRight: 5,
  },
  loginText: {
    fontWeight: "bold",
    color: "#4CAF50",
  },
});

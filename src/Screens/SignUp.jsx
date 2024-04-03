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
import { FontAwesome, Ionicons } from "@expo/vector-icons";

export default function SignUp({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailIsValid, setEmailIsValid] = useState(false);
  const [password, setPassword] = useState("");
  const [isAvatar, setIsAvatar] = useState(false);
  const [isProgress, setIsProgress] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessageALert, setErrorMessageAlert] = useState(false);
  const [avatar, setAvatar] = useState(avatars[0]?.image.asset.url);

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
          setErrorMessageAlert(false);
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMess = error.message;
        if (name === "") {
          setErrorMessage("name is required");
        } else if (errorMess.includes("email")) {
          setErrorMessage("email is empty or already exist");
        } else if (errorMess.includes("password")) {
          setErrorMessage("password is incorrect");
        }
        setErrorMessageAlert(true);
        setIsProgress(false);
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        {isAvatar && (
          <View style={[styles.overlay]}>
            <ScrollView>
              <BlurView
                intensity={90}
                style={[styles.blurView]}
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
            </ScrollView>
          </View>
        )}
        <TouchableOpacity
          style={styles.arrowBack}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} />
        </TouchableOpacity>

        <View style={styles.gap}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={() => setIsAvatar(true)}
          >
            <FontAwesome
              style={styles.avatarIcon}
              name="pencil"
              size={15}
              color="#3D4A7A"
            />
            <Image
              source={{ uri: avatar }}
              resizeMode="contain"
              style={styles.avatar}
            />
          </TouchableOpacity>
          <View style={styles.loginTitleArea}>
            <Text style={styles.loginTitle}> Sign up with Email</Text>
            <Text style={styles.loginTitlePara}>
              Get chatting with friends and family today by signing up for our
              chat app!
            </Text>
          </View>
          <UserInputs
            label={"Full Name"}
            isPass={false}
            setStateValue={setName}
          />
          <UserInputs
            label={"Your Email"}
            isPass={false}
            setStateValue={setEmail}
            setEmailIsValid={setEmailIsValid}
          />
          <UserInputs
            label={"Password"}
            isPass={true}
            setStateValue={setPassword}
          />
          {errorMessageALert ? (
            <Text style={{ color: "red" }}>{errorMessage}</Text>
          ) : null}
        </View>
        <View style={styles.gap}>
          <TouchableOpacity onPress={handleSingUp} style={styles.loginButton}>
            <Text style={styles.loginButtonText}>
              {isProgress ? <ActivityIndicator color={"gray"} /> : "Sign Up"}
            </Text>
            <Image
              style={styles.loginImg}
              source={require("../../assets/Rectangle 1159.png")}
            />
          </TouchableOpacity>
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Already have an account?</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Login");
                setErrorMessageAlert(false);
              }}
            >
              <Text style={styles.signUpLink}>Login</Text>
            </TouchableOpacity>
          </View>
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
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    gap: 50,
    backgroundColor: "#fff",
    paddingVertical: 30,
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
    position: "relative",
  },
  avatarIcon: {
    position: "absolute",
    zIndex: 1,
    right: -2,
    top: 0,
    backgroundColor: "#fff",
    borderRadius: 100,
    padding: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: "#3D4A7A",
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

  loginImg: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: -1,
  },

  loginButton: {
    width: 327,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 25,
    position: "relative",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "bold",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signUpText: {
    color: "#555",
    marginRight: 5,
  },
  signUpLink: {
    fontSize: 14,
    fontFamily: "medium",
    color: "#3D4A7A",
    textDecorationLine: "underline",
  },

  gap: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  loginTitleArea: {
    alignItems: "center",
    gap: 10,
    marginVertical: 10,
  },
  loginTitle: {
    fontSize: 18,
    color: "#3D4A7A",
    fontFamily: "bold",
  },
  loginTitlePara: {
    width: 293,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
    color: "#797C7B",
    fontFamily: "light",
  },
  arrowBack: {
    position: "absolute",
    top: 60,
    left: 20,
  },
});

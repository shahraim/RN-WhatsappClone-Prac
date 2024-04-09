import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import UserAvatar from "../Components/UserAvatar";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { AntDesign } from "@expo/vector-icons";
import { signOut } from "firebase/auth";
import { auth } from "../Config/Firebase.config";
import { clearUserData } from "../Config/toolkit/userReducer";

export default function UserProfile({ navigation }) {
  const select = useSelector((state) => state?.user?.userData);
  const dispatch = useDispatch();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
        dispatch(clearUserData());
      })
      .catch((error) => {
        const err = error.message;
        alert(err);
      });
  };

  const handleDeleteAccount = () => {
    console.log("Deleting user account...");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="" />
      <TouchableOpacity
        style={styles.arrowBack}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={20} />
      </TouchableOpacity>
      <ImageBackground
        source={{
          uri: "https://t3.ftcdn.net/jpg/03/27/51/56/360_F_327515607_Hcps04aaEc7Ki43d1XZPxwcv0ZaIaorh.jpg",
        }}
        style={styles.headerBackground}
      >
        <View style={styles.header}>
          <UserAvatar width={70} height={70} margin={0} />
          <Text style={styles.fullName}>{select.fullName}</Text>
        </View>
      </ImageBackground>

      <View style={styles.infoContainer}>
        <InfoItem label="Email" value={select.providerData[0].email} />
        <InfoItem label="DOB" value="Not available" />
        <InfoItem label="Date" value="22/3/2024" />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("EditProfile")}
      >
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <AntDesign name="logout" size={24} color="white" />
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.deleteButton]}
        onPress={handleDeleteAccount}
      >
        <AntDesign name="deleteuser" size={24} color="white" />
        <Text style={styles.buttonText}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const InfoItem = ({ label, value }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerBackground: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
  },
  fullName: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    color: "#fff",
  },
  infoContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  infoValue: {
    fontSize: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF6347",
    paddingVertical: 10,
    marginHorizontal: 50,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
  },
  deleteButton: {
    backgroundColor: "#FF0000",
  },

  arrowBack: {
    position: "absolute",
    top: 50,
    left: 15,
    zIndex: 2,
    padding: 6,
    borderRadius: 100,
  },
});

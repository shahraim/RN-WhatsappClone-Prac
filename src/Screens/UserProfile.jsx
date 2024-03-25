import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
} from "react-native";
import UserAvatar from "../Components/UserAvatar";
import { useSelector } from "react-redux";
import { AntDesign } from "@expo/vector-icons";
import { signOut } from "firebase/auth";
import { auth } from "../Config/Firebase.config";

export default function UserProfile({ navigation }) {
  const select = useSelector((state) => state?.user?.userData);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      })
      .catch((error) => {
        const err = error.message;
        alert(err);
      });
  };

  return (
    <View style={styles.container}>
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

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <AntDesign name="logout" size={24} color="white" />
        <Text style={styles.logoutText}>Logout</Text>
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
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF6347",
    paddingVertical: 10,
    marginHorizontal: 50,
    borderRadius: 10,
    marginTop: 30,
  },
  logoutText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
  },
});

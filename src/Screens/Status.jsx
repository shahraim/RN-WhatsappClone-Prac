import React, { useState, useEffect } from "react";
import {
  Button,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import ProgressBar from "react-native-progress/Bar";

export default function Status() {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [timer, setTimer] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (modalVisible && images.length > 0) {
      setTimer(
        setInterval(() => {
          if (currentIndex === images.length - 1) {
            setModalVisible(false);
          } else {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
            setProgress(0);
          }
        }, 10000)
      );
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [modalVisible, currentIndex]);

  useEffect(() => {
    let interval;
    if (modalVisible) {
      interval = setInterval(() => {
        setProgress((prevProgress) => prevProgress + 0.01);
      }, 108);
    }
    return () => clearInterval(interval);
  }, [modalVisible]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const handleCirclePress = () => {
    if (images.length > 0) {
      setCurrentIndex(0);
      setModalVisible(true);
      setProgress(0);
    }
  };

  const handleNextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    setProgress(0);
  };

  const handlePreviousImage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
    setProgress(0);
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.circle} onPress={handleCirclePress}>
        {images.length > 0 && (
          <>
            <Image
              source={{ uri: images[currentIndex] }}
              style={styles.circleImage}
            />
          </>
        )}
      </TouchableOpacity>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleClose}
      >
        <View style={styles.modalContainer}>
          <ProgressBar
            progress={progress}
            width={null}
            color="#075e55"
            style={styles.progressBar}
          />
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.leftArrow}
            onPress={handlePreviousImage}
          >
            <Ionicons name="arrow-back" size={30} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.rightArrow} onPress={handleNextImage}>
            <Ionicons name="arrow-forward" size={30} color="black" />
          </TouchableOpacity>
          {images.length > 0 && (
            <>
              <Image
                source={{ uri: images[currentIndex] }}
                style={styles.modalImage}
              />
            </>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    position: "relative",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "lightgray",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  circleImage: {
    width: "80%",
    height: "80%",
    borderRadius: 75,
    resizeMode: "cover",
  },
  progressBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalImage: {
    width: "100%",
    height: "90%",
    resizeMode: "contain",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
  },
  leftArrow: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    height: "100%",
    width: 35,
    backgroundColor: "black",
    zIndex: 1,
    opacity: 0,
  },
  rightArrow: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    zIndex: 1,
    height: "100%",
    opacity: 0,
    width: 35,
    backgroundColor: "black",
  },
});

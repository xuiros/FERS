import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { CameraView } from "expo-camera";
import { manipulateAsync } from "expo-image-manipulator";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";

export default function BackID() {
  const cameraRef = useRef(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { frontData } = route.params || {};
  const [loading, setLoading] = useState(false);

  // 🔹 Replace this with your ngrok URL
  const NGROK_URL = "https://abcd1234.ngrok.io"; // <-- PUT YOUR ACTUAL NGROK URL HERE

  const takePicture = async () => {
    if (cameraRef.current) {
      setLoading(true);
      const photo = await cameraRef.current.takePictureAsync();
      const croppedPhoto = await cropImage(photo);

      try {
        const base64Image = await convertToBase64(croppedPhoto.uri);

        // 🔹 Send to your backend via ngrok
        const response = await fetch(`${NGROK_URL}/vision`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ base64Image }),
        });

        if (!response.ok) throw new Error("Failed to connect to backend");

        const visionResponse = await response.json();

        navigation.navigate("UserInformation", { frontData, backData: visionResponse });
      } catch (err) {
        Alert.alert("Error", err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const cropImage = async (photo) => {
    const cropWidth = photo.width * 0.8;
    const cropHeight = photo.height * 0.4;
    const cropX = (photo.width - cropWidth) / 2;
    const cropY = (photo.height - cropHeight) / 2;

    return await manipulateAsync(
      photo.uri,
      [
        {
          crop: {
            originX: cropX,
            originY: cropY,
            width: cropWidth,
            height: cropHeight,
          },
        },
      ],
      { compress: 1, format: "jpeg" }
    );
  };

  const convertToBase64 = async (uri) => {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraWrapper}>
        <CameraView style={styles.camera} ref={cameraRef} facing="back" />
        <View style={styles.overlay}>
          <Text style={styles.warning}>Align your ID inside the rectangle</Text>
          <View style={styles.rectangle} />
        </View>
      </View>
      <TouchableOpacity
        style={styles.captureBtn}
        onPress={takePicture}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <View style={styles.innerCircle} />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  cameraWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  camera: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  warning: {
    position: "absolute",
    top: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "#fff",
    padding: 8,
    borderRadius: 8,
    fontSize: 14,
  },
  rectangle: {
    width: "80%",
    height: "40%",
    borderWidth: 3,
    borderColor: "green",
    borderRadius: 10,
    backgroundColor: "transparent",
  },
  captureBtn: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#007AFF",
  },
  innerCircle: {
    width: 60,
    height: 60,
    backgroundColor: "#007AFF",
    borderRadius: 30,
  },
});

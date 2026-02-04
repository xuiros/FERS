import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { manipulateAsync } from "expo-image-manipulator";
import * as FileSystem from "expo-file-system/legacy";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";

export default function BackID() {
  const cameraRef = useRef(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { frontData, userId } = route.params || {};
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);

  const BACKEND_URL = "http://10.53.52.120:5000/api/vision/back";

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Camera access is required</Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current) return;
    setLoading(true);
    setScanning(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 1 });
      const cropped = await cropImage(photo);
      const base64Image = await convertToBase64(cropped.uri);

      const response = await axios.post(BACKEND_URL, {
        base64Image,
        userId,
      });

      const backData = response.data?.data;
      console.log("✅ Back ID processed:", backData);

      const combined = { ...frontData, ...backData };

      Alert.alert("Success", "Back ID scanned successfully!");
      navigation.replace("UserInformation", { userData: combined });
    } catch (err) {
      console.error("❌ Error capturing back ID:", err);
      Alert.alert("Upload Error", err.message);
    } finally {
      setLoading(false);
      setScanning(false);
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

  const convertToBase64 = async (uri) =>
    await FileSystem.readAsStringAsync(uri, { encoding: "base64" });

  return (
    <View style={styles.container}>
      <View style={styles.cameraWrapper}>
        {/* ✅ CAMERA FIXED: This will now appear */}
        <CameraView style={styles.camera} ref={cameraRef} facing="back" />
        <View style={styles.overlay}>
          <Text style={styles.warning}>Align the BACK side of your ID</Text>
          <View style={styles.rectangle} />
        </View>
      </View>

      <TouchableOpacity
        style={styles.captureBtn}
        onPress={takePicture}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#007AFF" size="large" />
        ) : (
          <View style={styles.innerCircle} />
        )}
      </TouchableOpacity>

      {/* 🔔 Scanning Modal */}
      <Modal visible={scanning} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <ActivityIndicator size="large" color="#FFD700" />
            <Text style={styles.modalText}>Scanning Back ID...</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  cameraWrapper: { flex: 1, justifyContent: "center", alignItems: "center" },
  camera: { width: "100%", height: "100%", position: "absolute" },
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
    top: 40,
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    fontSize: 14,
  },
  rectangle: {
    width: "80%",
    height: "40%",
    borderWidth: 0,
    borderColor: "transparent",
    borderRadius: 10,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#111",
    padding: 30,
    borderRadius: 15,
    alignItems: "center",
  },
  modalText: {
    color: "#FFD700",
    marginTop: 15,
    fontSize: 16,
    fontWeight: "600",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  permissionText: { color: "#fff", fontSize: 16, marginBottom: 20 },
  permissionButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 10,
  },
  permissionButtonText: { color: "#fff", fontWeight: "bold" },
});

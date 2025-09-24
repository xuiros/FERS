import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Image, Alert,StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

export default function FrontID() {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const navigation = useNavigation();

  // 🔹 Replace this with your ngrok HTTPS URL
  const NGROK_URL = "https://5da2334c9353.ngrok-free.app/vision";

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>No camera access</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current) return;
    setLoading(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({ base64: true });
      setPreview(photo.uri);

      const response = await axios.post(NGROK_URL, {
        base64Image: photo.base64,
      });

      navigation.navigate("BackID", { frontData: response.data });
    } catch (error) {
      console.error("Upload error:", error.message);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-black">
      {preview ? (
        <Image source={{ uri: preview }} style={{ flex: 1 }} />
      ) : (
        <CameraView style={{ flex: 1 }} ref={cameraRef} />
      )}

      <View className="absolute bottom-10 w-full flex items-center">
        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <TouchableOpacity
            onPress={takePicture}
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: "white",
            }}
          />
        )}
      </View>
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
  captureButton: {
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
  previewWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  preview: {
    width: "90%",
    height: "70%",
    resizeMode: "contain",
    borderRadius: 10,
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  permissionText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

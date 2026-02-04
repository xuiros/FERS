import React, { useState, useEffect } from "react";
import axios from "axios";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import io from "socket.io-client";

import HomeScreen from "../screens/HomeScreen";
import CallScreen from "../screens/CallScreen";
import ChatScreen from "../screens/ChatScreen";
import ProfileScreen from "../screens/ProfileScreen";

const EmptyScreen = () => null;
const Tab = createBottomTabNavigator();

const BASE_URL = "http://10.53.52.120:5000/api/reports";
const SOCKET_URL = "http://10.53.52.120.120:5000";

const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      top: -30,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 35,
      backgroundColor: "#D94701",
      width: 70,
      height: 70,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 5,
    }}
  >
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {children}
    </View>
  </TouchableOpacity>
);

const Tabs = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [userName, setUserName] = useState("Unnamed");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUserName(parsed.name || "Unnamed");
          setUserId(parsed._id);
        }
      } catch (err) {
        console.error("Error loading user:", err);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("🟢 Connected to Socket.IO:", socket.id);
      socket.emit("join_room", userId);
      console.log(`📡 Joined room: ${userId}`);
    });

    socket.on("help_on_way", (data) => {
      console.log("🚑 Help notification received:", data);
      Alert.alert("🚑 Help is on the way!", data.message || "Responders are coming to your location.");
    });

    socket.on("view_location", (data) => {
      console.log("👁️ Admin viewed location:", data);
      Alert.alert("📍 Admin is viewing your location", "Your emergency report is being monitored.");
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected from socket server");
    });

    return () => {
      socket.disconnect();
      console.log("🧹 Socket.IO connection closed");
    };
  }, [userId]);

  const emergencyDetails = {
    Fire: [
      { level: "First Alarm", desc: "Fire affecting ~2-3 houses" },
      { level: "Second Alarm", desc: "Fire in ~4-5 houses" },
      { level: "Third Alarm", desc: "Fire in ~6-7 houses or part of high-rise building" },
      { level: "Fourth Alarm", desc: "Fire in ~8-9 houses or larger high-rise portion" },
      { level: "Fifth Alarm", desc: "Fire in ~10-11 houses or large high-rise" },
    ],
    Flood: [
      { level: "Minor Flood", desc: "Localized flooding in low areas" },
      { level: "Moderate Flood", desc: "Flooding in several barangays" },
      { level: "Severe Flood", desc: "Widespread flooding across the city" },
    ],
    Earthquake: [
      { level: "Mild Tremor", desc: "Slight shaking, no major damage" },
      { level: "Moderate Quake", desc: "Noticeable shaking, possible light damage" },
      { level: "Strong Quake", desc: "Severe shaking, structural damage possible" },
    ],
    Accident: [
      { level: "Road Accident", desc: "Collision or crash on the road" },
      { level: "Workplace Accident", desc: "Injury at work site or office" },
      { level: "Other Accident", desc: "Miscellaneous accident needing assistance" },
    ],
    Landslide: [
      { level: "Minor Landslide", desc: "Small soil movement, limited damage" },
      { level: "Moderate Landslide", desc: "Covers roads or nearby houses, moderate risk" },
      { level: "Severe Landslide", desc: "Large-scale, multiple houses/roads affected" },
    ],
  };

  const handleEmergencySelect = (type) => {
    setSelectedEmergency(type);
    setModalVisible(false);
    setDetailModalVisible(true);
  };

  const handleDetailSelect = (detail) => {
    setSelectedDetail(detail);
    setDetailModalVisible(false);
    setConfirmModalVisible(true);
  };

  const handleConfirm = async () => {
    if (!selectedEmergency || !selectedDetail) return;
    setConfirmModalVisible(false);
    Alert.alert("Sending...", "Please wait while your alert is being sent.");

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Please enable location permissions in settings.");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        timeInterval: 1000,
        maximumAge: 0,
      });

      const payload = {
        name: userName,
        userId,
        message: `🚨 ${selectedEmergency} report (${selectedDetail.level}) from ${userName}`,
        type: selectedEmergency,
        level: selectedDetail.level,
        description: selectedDetail.desc,
        location: {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        },
      };

      await axios.post(BASE_URL, payload);
      Alert.alert("✅ Success", `Emergency alert sent by ${userName}!`);
    } catch (err) {
      console.error("Error sending alert:", err);
      Alert.alert("❌ Error", "Failed to send alert. Check your connection.");
    }
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarStyle: {
            position: "absolute",
            left: 20,
            right: 20,
            elevation: 0,
            backgroundColor: "#ffffff",
            borderRadius: 15,
            height: 90,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          children={(props) => (
            <HomeScreen {...props} openEmergencyModal={() => setModalVisible(true)} />
          )}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: "center", justifyContent: "center", top: 10 }}>
                <Image
                  source={require("../assets/icons/home.png")}
                  resizeMode="contain"
                  style={{
                    width: 35,
                    height: 35,
                    tintColor: focused ? "#11224D" : "#999999",
                  }}
                />
                <Text style={{ color: focused ? "#11224D" : "#999999", fontSize: 10, fontWeight: "bold" }}>
                  HOME
                </Text>
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: "center", justifyContent: "center", top: 10 }}>
                <Image
                  source={require("../assets/icons/chat.png")}
                  resizeMode="contain"
                  style={{
                    width: 35,
                    height: 35,
                    tintColor: focused ? "#11224D" : "#999999",
                  }}
                />
                <Text style={{ color: focused ? "#11224D" : "#999999", fontSize: 10, fontWeight: "bold" }}>
                  CHAT
                </Text>
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="Emergency"
          component={EmptyScreen}
          options={{
            tabBarIcon: () => (
              <Image
                source={require("../assets/icons/emergency.png")}
                resizeMode="contain"
                style={{ width: 40, height: 40, tintColor: "#fff" }}
              />
            ),
            tabBarButton: (props) => (
              <CustomTabBarButton {...props} onPress={() => setModalVisible(true)} />
            ),
          }}
        />

        <Tab.Screen
          name="Call"
          component={CallScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: "center", justifyContent: "center", top: 10 }}>
                <Image
                  source={require("../assets/icons/call.png")}
                  resizeMode="contain"
                  style={{
                    width: 35,
                    height: 35,
                    tintColor: focused ? "#11224D" : "#999999",
                  }}
                />
                <Text style={{ color: focused ? "#11224D" : "#999999", fontSize: 10, fontWeight: "bold" }}>
                  CALL
                </Text>
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: "center", justifyContent: "center", top: 10 }}>
                <Image
                  source={require("../assets/icons/user.png")}
                  resizeMode="contain"
                  style={{
                    width: 35,
                    height: 35,
                    tintColor: focused ? "#11224D" : "#999999",
                  }}
                />
                <Text style={{ color: focused ? "#11224D" : "#999999", fontSize: 10, fontWeight: "bold" }}>
                  ME
                </Text>
              </View>
            ),
          }}
        />
      </Tab.Navigator>

      {/* Modals */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Select Emergency</Text>
            {Object.keys(emergencyDetails).map((type) => (
              <TouchableOpacity key={type} style={styles.modalButton} onPress={() => handleEmergencySelect(type)}>
                <Text style={styles.modalButtonText}>{type}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={[styles.modalButton, { backgroundColor: "#ccc" }]} onPress={() => setModalVisible(false)}>
              <Text style={[styles.modalButtonText, { color: "#333" }]}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={detailModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{selectedEmergency} Details</Text>
            {selectedEmergency && emergencyDetails[selectedEmergency].map((item) => (
              <TouchableOpacity key={item.level} style={styles.modalButton} onPress={() => handleDetailSelect(item)}>
                <Text style={styles.modalButtonText}>{item.level}</Text>
                <Text style={{ fontSize: 12, color: "#333", textAlign: "center" }}>{item.desc}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#ccc" }]}
              onPress={() => {
                setDetailModalVisible(false);
                setModalVisible(true);
              }}
            >
              <Text style={[styles.modalButtonText, { color: "#333" }]}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={confirmModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Confirm Selection</Text>
            <Text style={{ textAlign: "center", marginBottom: 15 }}>
              You selected: {selectedEmergency} - {selectedDetail?.level}
            </Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleConfirm}>
              <Text style={styles.modalButtonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#ccc" }]}
              onPress={() => {
                setConfirmModalVisible(false);
                setDetailModalVisible(true);
              }}
            >
              <Text style={[styles.modalButtonText, { color: "#333" }]}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxWidth: 320,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#11224D",
  },
  modalButton: {
    backgroundColor: "#FF8811",
    paddingVertical: 12,
    borderRadius: 10,
    marginVertical: 6,
    width: "100%",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});

export default Tabs;

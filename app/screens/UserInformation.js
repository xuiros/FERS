import React from "react";
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function UserInformation() {
  const navigation = useNavigation();
  const route = useRoute();
  const { userData } = route.params || {};

  // 🧹 Helper function to clean text
  const clean = (text) => {
    if (!text || text.trim() === "" || text.toLowerCase() === "unknown") return "N/A";
    return text.replace(/\bPHL\b/g, "").replace(/\s+/g, " ").trim();
  };

  // 🧩 Handle missing data
  if (!userData) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>❌ No user data found</Text>
      </View>
    );
  }

  // 🧾 Extracted data mapping (removed blood type & civil status)
  const data = {
    last_name: clean(userData.last_name),
    given_name: clean(userData.given_name),
    middle_name: clean(userData.middle_name),
    birthdate: clean(userData.birthdate),
    address: clean(userData.address),
    id_number: clean(userData.id_number),
    sex: clean(userData.sex),
  };

  // 👤 Build Full Name
  const fullName =
    data.given_name !== "N/A" || data.last_name !== "N/A"
      ? `${data.given_name} ${data.middle_name} ${data.last_name}`.replace(/\s+/g, " ").trim()
      : "N/A";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 🔙 Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      {/* 🛡️ BFP Logo */}
      <Image
        source={{
          uri: "https://upload.wikimedia.org/wikipedia/en/3/38/Bureau_of_Fire_Protection_%28Philippines%29_Seal.png",
        }}
        style={styles.logo}
      />

      {/* 🧾 Header */}
      <Text style={styles.headerText}>National ID Information</Text>
      <Text style={styles.subText}>Verified from scanned front and back IDs</Text>

      {/* 🪪 Info Card */}
      <View style={styles.card}>
        <InfoRow label="FULL NAME" value={fullName} />
        <InfoRow label="DATE OF BIRTH" value={data.birthdate} />
        <InfoRow label="SEX" value={data.sex} />
        <InfoRow label="ADDRESS" value={data.address} />
        <InfoRow label="ID NUMBER" value={data.id_number} />
      </View>

      {/* ✅ Confirm Button */}
      <TouchableOpacity
        style={styles.confirmBtn}
        onPress={() => alert("✅ Account Created Successfully")}
      >
        <Text style={styles.confirmText}>Confirm & Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// 🧩 Info Row Component
const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fef8f2",
  },
  content: {
    alignItems: "center",
    padding: 20,
    paddingBottom: 80,
  },
  backBtn: {
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  backArrow: {
    fontSize: 24,
    color: "#333",
    marginLeft: 5,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginVertical: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    marginTop: 10,
  },
  subText: {
    color: "#555",
    fontSize: 14,
    marginBottom: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  infoRow: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: "#111",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 5,
  },
  confirmBtn: {
    marginTop: 30,
    backgroundColor: "#0b4b9a",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 25,
    elevation: 3,
  },
  confirmText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  emptyText: {
    color: "#ccc",
    fontSize: 18,
    fontStyle: "italic",
  },
});

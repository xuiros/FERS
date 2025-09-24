import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

export default function UserInformation({ route }) {
  const { frontData, backData } = route.params || {};

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Extracted Information</Text>

      {frontData ? (
        <View style={styles.section}>
          <Text style={styles.title}>Front ID:</Text>
          <Text style={styles.text}>{frontData}</Text>
        </View>
      ) : (
        <View style={styles.section}>
          <Text style={styles.title}>Front ID:</Text>
          <Text style={styles.text}>No data detected</Text>
        </View>
      )}

      {backData ? (
        <View style={styles.section}>
          <Text style={styles.title}>Back ID:</Text>
          <Text style={styles.text}>{backData}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  content: { padding: 20 },
  heading: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 20 },
  section: { marginBottom: 20 },
  title: { fontSize: 18, fontWeight: "600", color: "#007AFF", marginBottom: 5 },
  text: { fontSize: 16, color: "#fff", lineHeight: 22 },
});

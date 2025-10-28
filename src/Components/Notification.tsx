import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function Notification({ onBack }: { onBack: () => void }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Notifications</Text>
      <Text>No new notifications</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  backText: { color: "#004AAD", marginBottom: 16, fontWeight: "500" },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
});

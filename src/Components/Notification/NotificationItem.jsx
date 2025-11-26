import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const NotificationItem = ({ item }) => {
  const iconMap = {
    alert: require("../../assets/Images/money-check.png"),
    info: require("../../assets/Images/command.png"),
    bill: require("../../assets/Images/command.png"),
    user: require("../../assets/Images/user-add.png"),
    complaint: require("../../assets/Images/NK.png"),
    resolved: require("../../assets/Images/money-check.png"),
  };

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Image source={iconMap[item.type]} style={styles.iconImage} />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{item.notificationType}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.time}>{item.createdDate}</Text>
      </View>
    </View>
  );
};

export default NotificationItem;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  iconImage: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontWeight: "600",
    fontSize: 15,
    color: "#111827",
  },
  description: {
    color: "#6B7280",
    fontSize: 13,
    marginTop: 3,
  },
  time: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 5,
    alignSelf: "flex-end",
  },
});

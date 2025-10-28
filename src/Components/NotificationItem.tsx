import React from "react";
import { View, Text, StyleSheet , Image } from "react-native";
// import Icon from "react-native-vector-icons/Ionicons";

interface NotificationItemProps {
  item: {
    id: string;
    title: string;
    description: string;
    time: string;
    type: "alert" | "info" | "bill" | "user" | "complaint" | "resolved";
  };
}

const NotificationItem: React.FC<NotificationItemProps> = ({ item }) => {
  const iconMap: Record<NotificationItemProps["item"]["type"], any> = {
    alert: require("./money-check.png"),
    info: require("./command.png"),
    bill: require("./command.png"),
    user: require("./user-add.png"),
    complaint: require("./NK.png"),
    resolved: require("./money-check.png"),
  };

  return (
    <View style={styles.card}>
       <View style={styles.iconContainer}>
        <Image source={iconMap[item.type]} style={styles.iconImage} />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </View>
  );
};

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
  contentContainer: {
    flex: 1,
  },
  iconImage: {
    width: 24,
    height: 24,
    resizeMode: "contain",
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

export default NotificationItem;

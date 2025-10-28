import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ListRenderItem,
  Image
} from "react-native";
import NotificationItem from "./NotificationItem";
// import Icon from "react-native-vector-icons/Ionicons";
// import { Ionicons } from '@expo/vector-icons';


// Define Notification item type
interface NotificationData {
  id: string;
  title: string;
  description: string;
  time: string;
  date: string;
  type: "alert" | "info" | "bill" | "user" | "complaint" | "resolved";
}

// Props for Notification component
interface NotificationProps {
  onBack: () => void;
}

const notifications: NotificationData[] = [
  {
    id: "1",
    title: "Hostel Maintenance Alert",
    description:
      "Water supply will be interrupted on Oct 28th, 7 AM – 10 AM for maintenance. Kindly store sufficient water in advance.",
    time: "14h",
    date: "Today",
    type: "alert",
  },
  {
    id: "2",
    title: "Cleanliness Drive",
    description:
      "Common area cleaning is scheduled for Sunday, Oct 27th at 9 AM. Please keep your personal items inside rooms.",
    time: "Yesterday",
    date: "Yesterday",
    type: "info",
  },
  {
    id: "3",
    title: "Water Bill Issued",
    description:
      "Common area cleaning is scheduled for Sunday, Oct 27th at 9 AM. Please keep your personal items inside rooms.",
    time: "Yesterday",
    date: "Yesterday",
    type: "bill",
  },
  {
    id: "4",
    title: "New Tenant Added – Rahul D",
    description: "Tenant added to Ground Floor, Room 102.",
    time: "14h",
    date: "Yesterday",
    type: "user",
  },
  {
    id: "5",
    title: "SJ Suryah Raised a Complaint",
    description: "Issue reported: “Fan not working” in Room 303.",
    time: "15h",
    date: "Yesterday",
    type: "complaint",
  },
  {
    id: "6",
    title: "Complaint Marked Resolved by Admin",
    description: "Issue resolved: “Fan not working” in Room 303.",
    time: "Yesterday",
    date: "Yesterday",
    type: "resolved",
  },
];

const Notification: React.FC<NotificationProps> = ({ onBack }) => {
  const renderItem: ListRenderItem<NotificationData> = ({ item }) => (
    <NotificationItem item={item} />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        {/* <Ionicons name="arrow-back-outline" size={22} color="#004AAD" /> */}
        {/* <Text style={styles.backText}>Back</Text> */}
        <Image  source={require("./Line_arrow-left.png")}/>
             <Text style={styles.header}>Notifications</Text>

      </TouchableOpacity>


      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 5,
    cursor:'pointer',
  },
  backText: {
    color: "#004AAD",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 4,
  },
  header: {
    fontSize: 22,
    fontWeight: "600",
    // marginBottom: 12,
    marginLeft:10
  },
  listContainer: {
    paddingBottom: 20,
  },
});

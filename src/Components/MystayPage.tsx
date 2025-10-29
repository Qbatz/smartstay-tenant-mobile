import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import Notification from "./Notification";

export default function MystayPage() {
  const [notificationshow, setNotificationShow] = useState(false);
  const [activeTab, setActiveTab] = useState("My Stay");
  const [activeDot, setActiveDot] = useState(0);

  const handleNotificationShow = () => {
    setNotificationShow(true);
  };

  const handleBack = () => {
    setNotificationShow(false);
  };

  if (notificationshow) {
    return <Notification onBack={handleBack} />;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileIcon}>
          <TouchableOpacity>
            <Image source={require("../assets/Images/Group 1.png")} />
          </TouchableOpacity>
        </View>

        <View>
          <Text style={styles.hostelName}>Smartstay Hostel</Text>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Image source={require("../assets/Images/location.png")} />
            <Text>Kandanchavadi</Text>
          </View>
        </View>

        <View style={styles.profileIcon}>
          <TouchableOpacity onPress={handleNotificationShow}>
            <Image source={require("../assets/Images/notification.png")} />
          </TouchableOpacity>
        </View>

        <View style={styles.profileIcon}>
          <Text style={styles.profileText}>👤</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {["My Stay", "Services", "Payments"].map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
            <View style={styles.tabItem}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTab,
                ]}
              >
                {tab}
              </Text>
              {activeTab === tab && <View style={styles.underline} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Notice Box */}
      <View style={styles.noticeBox}>
        <Text style={styles.noticeText}>
          Hostel water maintenance on 5th June
        </Text>
      </View>

      {/* Dots */}
      <View style={styles.dotsContainer}>
        {[0, 1, 2].map((dot) => (
          <TouchableOpacity
            key={dot}
            onPress={() => {
              if (dot === 1) handleNotificationShow();
              else setActiveDot(dot);
            }}
          >
            <View
              style={[
                styles.dot,
                activeDot === dot && styles.activeDotStyle,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Bills */}
      <View style={styles.billContainer}>
        <View style={styles.billCard}>
          <Text style={styles.amount}>₹ 350.00</Text>
          <Text style={styles.label}>Last Month EB Bill</Text>
          <Text style={styles.paidOn}>Paid on: 03 June</Text>
        </View>

        <View style={styles.billCard}>
          <Text style={styles.amount}>₹ 8,000.00</Text>
          <Text style={styles.label}>Last Month Rent</Text>
          <Text style={styles.paidOn}>Paid on: 02 June</Text>
        </View>

        <View style={styles.billCard}>
          <Text style={[styles.amount, { color: "#FF7A00" }]}>₹ 322.00</Text>
          <Text style={styles.label}>New Bill Generated</Text>
          <Text style={styles.dueOn}>Due date: 05 Nov</Text>
        </View>

        <View style={styles.billCard}>
          <Text style={[styles.amount, { color: "#FF7A00" }]}>₹ 7,400.00</Text>
          <Text style={styles.label}>New Bill Generated</Text>
          <Text style={styles.dueOn}>Due date: 05 Nov</Text>
        </View>
      </View>

      {/* Quick Links */}
      <View style={styles.quickLinks}>
        <TouchableOpacity style={styles.quickButton}>
          <Image
            source={require("../assets/Images/receipt-edit.png")}
            style={{ width: 24, height: 24 }}
          />
          <Text style={styles.quickText}>Complaints</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickButton}>
          <Image source={require("../assets/Images/Frame.png")} />
          <Text style={styles.quickText}>Request Bed change</Text>
        </TouchableOpacity>
      </View>

      {/* Complaints */}
      <View style={styles.complaintSection}>
        <View style={styles.complaintHeader}>
          <Text style={styles.complaintTitle}>Complaints</Text>
          <Text style={styles.viewAll}>View all</Text>
        </View>

        <View style={styles.complaintCard}>
          <View>
            <Text style={styles.complaintIssue}>Washing machine Problem</Text>
            <Text style={styles.complaintType}>Plumbing</Text>
          </View>
          <Text style={styles.pending}>Pending</Text>
        </View>

        <View style={styles.complaintCard1}>
          <View>
            <Text style={styles.complaintIssue}>Fan not working</Text>
            <Text style={styles.complaintType}>Electrical</Text>
          </View>
          <Text style={styles.pending}>Pending</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F8FA", padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
  },
  hostelName: { fontSize: 18, fontWeight: "600", color: "#000", marginRight: 30 },
  profileIcon: { backgroundColor: "#EAEAEA", borderRadius: 20, padding: 8 },
  profileText: { fontSize: 14 },
  tabs: { flexDirection: "row", justifyContent: "space-around", marginTop: 20 },
  tabText: { fontSize: 16, color: "#777", fontWeight: "500" },
  activeTab: { color: "#004AAD", fontWeight: "bold" },
  noticeBox: {
    backgroundColor: "#004AAD",
    borderRadius: 10,
    padding: 14,
    marginTop: 20,
  },
  noticeText: { color: "#fff", fontWeight: "500", textAlign: "center" },
  billContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
  billCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    width: "48%",
    marginBottom: 14,
    elevation: 2,
  },
  amount: { fontSize: 18, fontWeight: "bold", color: "#000" },
  label: { color: "#666", marginTop: 4 },
  paidOn: { color: "#004AAD", marginTop: 4, fontWeight: "500" },
  dueOn: { color: "#FF7A00", marginTop: 4, fontWeight: "500" },
  quickLinks: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  quickButton: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 20,
    width: "48%",
    alignItems: "center",
    elevation: 2,
  },
  quickText: { color: "#004AAD", fontWeight: "500" },
  complaintSection: { marginTop: 20, marginBottom: 40 },
  complaintHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  complaintTitle: { fontSize: 16, fontWeight: "600" },
  viewAll: { color: "#004AAD", fontWeight: "500" },
  complaintCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  complaintCard1: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
    marginTop: 10,
  },
  complaintIssue: { fontSize: 14, fontWeight: "500" },
  complaintType: { color: "#777", marginTop: 4 },
  pending: { color: "#FF7A00", fontWeight: "bold" },
  tabItem: { alignItems: "center" },
  underline: {
    height: 3,
    width: 20,
    backgroundColor: "#004AAD",
    borderRadius: 2,
    marginTop: 4,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDotStyle: {
    backgroundColor: "#004AAD",
    width: 10,
    height: 10,
  },
});

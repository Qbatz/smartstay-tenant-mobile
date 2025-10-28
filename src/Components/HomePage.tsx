import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Notification from "./Notification";

export default function HomePage() {
  const [notificationshow, setNotificationShow] = useState(false);

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
    
      <View style={styles.header}>
        <View>
          <Text style={styles.hostelName}>Smartstay Hostel</Text>
          <Text style={styles.location}>Kandanchavadi</Text>
        </View>

        <View style={styles.profileIcon}>
          <TouchableOpacity onPress={handleNotificationShow}>
            <Text style={styles.profileText}>Notification</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileIcon}>
          <Text style={styles.profileText}>👤</Text>
        </View>
      </View>

     
      <View style={styles.tabs}>
        <Text style={[styles.tabText, styles.activeTab]}>My Stay</Text>
        <Text style={styles.tabText}>Services</Text>
        <Text style={styles.tabText}>Payments</Text>
      </View>

      
      <View style={styles.noticeBox}>
        <Text style={styles.noticeText}>Hostel water maintenance on 5th June</Text>
      </View>

     
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

    
      <View style={styles.quickLinks}>
        <TouchableOpacity style={styles.quickButton}>
          <Text style={styles.quickText}>Complaint</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickButton}>
          <Text style={styles.quickText}>Request Bed change</Text>
        </TouchableOpacity>
      </View>

    
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F8FA", padding: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 30 },
  hostelName: { fontSize: 18, fontWeight: "600", color: "#000" },
  location: { color: "#666" },
  profileIcon: { backgroundColor: "#EAEAEA", borderRadius: 20, padding: 8 },
  profileText: { fontSize: 14 },
  tabs: { flexDirection: "row", justifyContent: "space-around", marginTop: 20 },
  tabText: { fontSize: 16, color: "#777", fontWeight: "500" },
  activeTab: { color: "#004AAD", fontWeight: "bold" },
  noticeBox: { backgroundColor: "#004AAD", borderRadius: 10, padding: 14, marginTop: 20 },
  noticeText: { color: "#fff", fontWeight: "500", textAlign: "center" },
  billContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 20 },
  billCard: { backgroundColor: "#fff", borderRadius: 10, padding: 14, width: "48%", marginBottom: 14, elevation: 2 },
  amount: { fontSize: 18, fontWeight: "bold", color: "#000" },
  label: { color: "#666", marginTop: 4 },
  paidOn: { color: "#004AAD", marginTop: 4, fontWeight: "500" },
  dueOn: { color: "#FF7A00", marginTop: 4, fontWeight: "500" },
  quickLinks: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  quickButton: { backgroundColor: "#fff", borderRadius: 10, paddingVertical: 20, width: "48%", alignItems: "center", elevation: 2 },
  quickText: { color: "#004AAD", fontWeight: "500" },
  complaintSection: { marginTop: 20, marginBottom: 40 },
  complaintHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  complaintTitle: { fontSize: 16, fontWeight: "600" },
  viewAll: { color: "#004AAD", fontWeight: "500" },
  complaintCard: { backgroundColor: "#fff", borderRadius: 10, padding: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center", elevation: 2 },
  complaintIssue: { fontSize: 14, fontWeight: "500" },
  complaintType: { color: "#777", marginTop: 4 },
  pending: { color: "#FF7A00", fontWeight: "bold" },
});

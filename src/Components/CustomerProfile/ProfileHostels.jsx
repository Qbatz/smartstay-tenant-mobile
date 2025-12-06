import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image,ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import HostelImage from "../../assets/Images/Group 1.png"
import LocationIcon from "../../assets/Images/location.png";
import MoneyIcon from "../../assets/Images/money.png";
import RentAmountIcon from "../../assets/Images/money-add.png"
import DateIcon from "../../assets/Images/calendar.png";
import Ionicons from "react-native-vector-icons/Ionicons";
import CustomerImage from "../../assets/Images/Customer_Icon.png";
import LeftArrow from "../../assets/Images/LeftArrow.png"
import { UsersContext } from "../../Context/UserContext";


const ProfileHostels = () => {


  const navigation = useNavigation();
  const userContext=useContext(UsersContext)
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedHostel, setSelectedHostel] = useState("Smartstay Hostel");

  const hostels = [
    { id: 1, name: "Smartstay Hostel", location: "Kandanchavadi" },
    { id: 2, name: "StayEasy Hostel", location: "Velachery" },
    { id: 3, name: "ComfortNest", location: "Thoraipakkam" },
  ];

  console.log(userContext.getCustomerDetail)

  const handleSelectHostel = (hostel) => {
    setSelectedHostel(hostel.name);
    setDropdownVisible(false);
  };

  const handleBack = () => navigation.goBack();
  return <View style={styles.container}>

    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Image
          source={LeftArrow}
          style={{ height: 25, width: 25 }}
        />
      </TouchableOpacity>
      <Text style={styles.header}>Hostels</Text>
    </View>

    <View style={styles.card}>
      <TouchableOpacity
        style={styles.hostelHeader}
        onPress={() => setDropdownVisible(!dropdownVisible)}
        activeOpacity={0.8}
      >
        <Image
          source={HostelImage}
          style={styles.hostelImage}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.hostelTitle}>{selectedHostel}</Text>
          <View style={styles.locationRow}>
            <Image
              source={LocationIcon}
              resizeMode="contain" style={{ width: 20, height: 20 }}
            />
            <Text style={styles.locationText}>Kandanchavadi</Text>
          </View>
        </View>

        <Ionicons
          name={dropdownVisible ? "chevron-up" : "chevron-down"}
          size={22}
          color="#000"
        />
      </TouchableOpacity>

      {dropdownVisible && (
        <View style={styles.dropdown}>
          <ScrollView>
            {userContext.getHostelList.map((item) => (
              <TouchableOpacity
                key={item.hostelId}
                style={styles.dropdownItem}
                onPress={() => handleSelectHostel(item)}
              >
                <Text style={styles.dropdownText}>{item.hostelName}</Text>
                <Text style={styles.dropdownSub}>{item.city}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}


      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>Rental Details</Text>

      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Joined Date</Text>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Image
            source={DateIcon}
            resizeMode="contain" style={{ width: 20, height: 20 }}
          />
          <Text style={styles.detailValue}>02 May 2024</Text>
        </View>
      </View>

      <View style={styles.detailRow}>

        <Text style={styles.detailLabel}>Advance Paid</Text>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Image
            source={MoneyIcon}
            resizeMode="contain" style={{ width: 20, height: 20 }}
          />
          <Text style={styles.detailValue}>₹4,000.00</Text>
        </View>
      </View>

      <View style={styles.detailRow}>

        <Text style={styles.detailLabel}>Monthly Rent</Text>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Image
            source={RentAmountIcon}
            resizeMode="contain" style={{ width: 20, height: 20 }}
          />
          <Text style={styles.detailValue}>₹8,000.00</Text>
        </View>
      </View>

      <View style={styles.detailRow}>

        <Text style={styles.detailLabel}>Due Date</Text>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Image
            source={DateIcon}
            resizeMode="contain" style={{ width: 20, height: 20 }}
          />
          <Text style={styles.detailValue}>5th of Every Month</Text>
        </View>
      </View>
    </View>

  </View>
}

const styles = StyleSheet.create({

  textdesign:{
      color:'grey'
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 30,
    paddingVertical:20,
    paddingHorizontal:20
  },
  
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
    marginBottom: 5,
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 10,
  },
  profileCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 12,
  },
  profileRow: {
    flexDirection: "row",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  infoText: {
    color: "#555",
    marginRight: 5,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 12,
    marginTop:20
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  statusBadgePending: {
    display: 'flex', flexDirection: 'row',
    backgroundColor: "rgba(236, 155, 41, 1)",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  FloorBadgePending: {
    backgroundColor: "rgba(255, 239, 207, 1)",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  statusText: {
    color: "white",
    fontWeight: "600",
  },
  lastAttempt: {
    color: "#777",
    fontSize: 13,
    marginTop: 5,
  },
  hostelHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  hostelImage: {
    width: 45,
    height: 45,
    borderRadius: 10,
    marginRight: 10,
  },
  hostelTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  locationText: {
    marginLeft: 4,
    color: "#555",
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 20

  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  detailRow: {
    alignItems: "left",
    marginBottom: 8,
    marginTop:8,
  },
  detailLabel: {
    marginBottom: 5,
    color: "#555",
    fontWeight: "500",
  },
  detailValue: {
    color: "#000",
    fontWeight: "600",
    marginLeft: 8
  },
  dropdown: {
    marginTop: 10,
    backgroundColor: "#F8F9FF",
    borderRadius: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    overflow: "hidden",
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dropdownText: {
    fontSize: 15,
    fontWeight: "600",
  },
  dropdownSub: {
    fontSize: 13,
    color: "#777",
  },
})
export default ProfileHostels;
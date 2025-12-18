import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image, Linking, Alert,
  BackHandler
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import CustomerImage from "../../assets/Images/Customer_Icon.png";
import LeftArrow from "../../assets/Images/LeftArrow.png"
import EditIcon from "../../assets/Images/edit.png"
import VerifyIcon from "../../assets/Images/verify.png"
import PendingIcon from "../../assets/Images/pending.png";
import BedIcon from "../../assets/Images/Bed_Icon.png"
import RoomIcon from "../../assets/Images/Room.png";
import HostelImage from "../../assets/Images/Group 1.png"
import LocationIcon from "../../assets/Images/location.png";
import MoneyIcon from "../../assets/Images/money.png";
import RentAmountIcon from "../../assets/Images/money-add.png"
import DateIcon from "../../assets/Images/calendar.png";
import ViewIcon from "../../assets/Images/view.png";
import DownloadIcon from "../../assets/Images/download.png";
import InfoIcon from "../../assets/Images/info-circle.png"
import LogoutIcon from "../../assets/Images/logout.png";
import { UsersContext } from "../../Context/UserContext";
import { remoteData, storeData } from "../../Utils/Storage";
import { ACCESS_TOKEN, LOGGEDIN, PHONE_NO } from "../../Utils/Constant";
import { customerDetails } from "../../Action/CustomerAction";
import buildings from '../../assets/Images/buildings.png'
import paperclip from '../../assets/Images/paperclip.png'
import sideframe from '../../assets/Images/sideframe.png'
import { LoginContexts } from "../../Context/LoginContext";



const CustomerProfile = (route) => {

  const context = useContext(UsersContext)
  const loginContext = useContext(LoginContexts)

  const navigation = useNavigation();
  const [customer, setCustomers] = useState()

  useEffect(()=>{
      const onBackPress=()=>{
        navigation.goBack();
        return true;
      }

      BackHandler.addEventListener('hardwareBackPress',onBackPress);

      return()=>BackHandler.addEventListener('hardwareBackPress',onBackPress);
  },[navigation])


  useEffect(() => {
    customerDetails(loginContext.getToken).then(r => {
      console.log(r.data)
      context.updateCustomer(r.data)
    }).catch(error => {
      console.log(error)
    })
  }, [])


  


  const handleDownload = async () => {
    try {
      const response = await fetch("https://smartstaytestingapi.s3remotica.com/invoice/invoice-list-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTkzLCJzdWIiOjE5MywidXNlcl90eXBlIjoiYWRtaW4iLCJyb2xlX2lkIjowLCJwbGFuX2NvZGUiOiJvbmVfZGF5IiwicGxhbl9zdGF0dXMiOjEsImlhdCI6MTc2MjQxMDIzOSwiZXhwIjoxNzYyNDEyMDM5fQ.BNCXjNx4B9AH0UV9Yy_dXnnBLzjfDUY7qOJOzuxlS2E`,
        },
        body: JSON.stringify({
          Date: "2025-11-01",
          User_Id: "NOTI1629",
          id: 2148,
        }),
      });

      const data = await response.json();

      const pdfUrl = data?.pdf_url;

      if (pdfUrl) {
        const supported = await Linking.canOpenURL(pdfUrl);
        if (supported) {
          await Linking.openURL(pdfUrl);
        } else {
          Alert.alert("Error", "Cannot open this PDF link");
        }
      } else {
        Alert.alert("No PDF found in response");
      }
    } catch (error) {
      console.error("PDF open error:", error);
      Alert.alert("Error", "Failed to open PDF");
    }
  };



  const handleSelectHostel = (hostel) => {
    setSelectedHostel(hostel.name);
    setDropdownVisible(false);
  };

  const handleEditProfile = () => {
    navigation.navigate("EditProfile", { customer: context.getCustomerDetail });

  }

  const handleLogout = () => {
    loginContext.logout('false')
    remoteData(ACCESS_TOKEN)
    remoteData(PHONE_NO)
    storeData(LOGGEDIN, "false")
    loginContext.updateToken(null)
    // navigation.navigate("SplashScreen");
  }

  const HostelClick = () => {
    navigation.navigate('ProfileHostels')
  }



 
   const handleBack = () => navigation.goBack();


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Image
              source={LeftArrow}
              style={{ height: 25, width: 25 }}
            />
          </TouchableOpacity>
          <Text style={styles.header}>Customer Profile</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.profileRow}>

            {context.getCustomerDetail?.profilePic ? (
              <Image
                source={{ uri: context.getCustomerDetail?.profilePic }}
                style={styles.profileImage} />
            ) : (
              <View style={[styles.profileImage, styles.initialContainer]}>
                <Text style={styles.initialText}>
                  {context.getCustomerDetail?.initials?.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View style={{ flex: 1, marginLeft: 10 }}>
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <Text style={styles.profileName}>{context.getCustomerDetail?.firstName}</Text>

                <Text style={styles.lastName}>{context.getCustomerDetail?.lastName}</Text>
                <Image source={VerifyIcon} resizeMode="contain" style={{ marginTop: 2, marginLeft: 4, height: 20, width: 20 }} />
              </View>

              <View style={styles.infoRow}>
                <View style={styles.FloorBadgePending}>
                  <Text style={{ color: 'black' }}>{context.getCustomerDetail?.bookingDetails?.floorName}</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    source={RoomIcon}
                    style={{ height: 16, width: 16, marginRight: 4 }}
                    resizeMode="contain"
                  />
                  <Text>{context.getCustomerDetail?.bookingDetails?.roomName}</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                  <Image
                    source={BedIcon}
                    style={{ height: 16, width: 16, marginRight: 4 }}
                    resizeMode="contain"
                  />
                  <Text>{context.getCustomerDetail?.bookingDetails?.bedName}</Text>
                </View>


              </View>
            </View>
            {/* <TouchableOpacity onPress={handleEditProfile}>
              <Image source={EditIcon} resizeMode="contain"
                style={{ height: 20, width: 20 }} />
            </TouchableOpacity> */}
          </View>
        </View>

        {/* ----KYC------ */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Complete your KYC verification</Text>
          <Text style={styles.warningText}>
            Enter your Aadhar/PAN card documents and Complete the status
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate("VerifyKYC")}>
            <Text style={styles.primaryButtonText}>Verify Now</Text>
          </TouchableOpacity>
        </View>

        {/* <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardTitle}>KYC Status</Text>
            <View style={styles.statusBadgePending}>
              <Image source={PendingIcon} resizeMode="contain" style={{ marginRight: 3, marginTop: 4, height: 14, width: 14 }} />
              <Text style={styles.statusText}>Pending</Text>
            </View>
          </View>
          <Text style={styles.lastAttempt}>
            Last Attempt: 06 Sep, 2025 – 04:22 PM
          </Text>
        </View> */}


        <View style={styles.cards}>

          <TouchableOpacity onPress={HostelClick} style={styles.row}>
            <View style={{ flexDirection: 'row' }}>
              <Image source={buildings} style={{ width: 20, height: 20 }} />
              <Text style={{ fontSize: 14, fontWeight: 400, marginLeft: 5 }}>
                Hostels</Text>
            </View>

            <Image source={sideframe} style={{ width: 23, height: 23 }} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity onPress={() => navigation.navigate('ComingSoonPage')} style={styles.row}>
            <View style={{ flexDirection: 'row' }}>
              <Image source={paperclip} style={{ width: 20, height: 20 }} />
              <Text style={{ fontSize: 14, fontWeight: 400, marginLeft: 5 }}>Rental Agreement</Text>
            </View>

            <Image source={sideframe} style={{ width: 23, height: 23 }} />
          </TouchableOpacity>

        </View>




        {/* <View style={styles.card}>
          <Text style={styles.sectionTitle}>Rental Agreement</Text>
          <Text style={styles.warningText}>
            Complete your Rental Agreement E-Sign to fully activate your account.
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate("Agreement")}>
            <Text style={styles.primaryButtonText}>Complete E-Sign Now</Text>
          </TouchableOpacity>
        </View> */}

        {/* <View style={styles.card}>
          <Text style={styles.sectionTitle}>Rental Agreement</Text>
          <Text style={styles.subtitle}>
            View your Rental Agreement Details as PDF
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.outlineButton} onPress={() => navigation.navigate("AgreementViewScreen")}>
              <Text style={styles.outlineButtonText}>View</Text>
              <Image source={ViewIcon} resizeMode="contain" style={{ width: 20, height: 20, marginLeft: 8 }} />
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.primaryButtonSmall}>
              <Text style={styles.primaryButtonText}>Download</Text>
                 <Image  source={DownloadIcon} resizeMode="contain" style={{ width: 20, height: 20 , marginLeft:8 }}/>
            </TouchableOpacity> */}
        {/* <TouchableOpacity style={styles.primaryButtonSmall} onPress={handleDownload}>
              <Text style={styles.primaryButtonText}>Download</Text>
              <Image source={DownloadIcon} resizeMode="contain" style={{ width: 20, height: 20, marginLeft: 8 }} />
            </TouchableOpacity> */}


        {/* </View> */}
        {/* </View> */}

        <View style={styles.helpRow}>
          <Image source={InfoIcon} resizeMode="contain" style={{ width: 20, height: 20 }} />
          <Text style={styles.helpText}>Help & Information</Text>
        </View>

        <View style={{ marginTop: 20, }}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Image source={LogoutIcon} resizeMode="contain" style={{ width: 20, height: 20 }} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>


    </View>
  );
};

export default CustomerProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 30,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
    marginBottom: 5,
  },
  header: {
    fontSize: 22,
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
   initialText: {
  color: '#788fed',
  fontSize: 20,
  fontWeight: 'bold',
},

initialContainer: {
  backgroundColor: '#eef1ff',
  justifyContent: 'center',
  alignItems: 'center',
},
  profileName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
   lastName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginLeft:5,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flex:1
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

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 12,
  },
  hostelHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  cards: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 12,
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
  },
  detailLabel: {
    marginBottom: 5,
    color: "#555",
    fontWeight: "500",
    flex: 1,
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

  warningText: {
    backgroundColor: 'rgba(255, 246, 244, 1)',
    color: "rgba(255, 0, 0, 1)",
    fontSize: 13,
    marginBottom: 10,
    padding: 5
  },
  primaryButton: {
    backgroundColor: "#0057FF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButtonSmall: {
    flex: 1,
    backgroundColor: "#0057FF",
    paddingVertical: 10,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'center'
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 10,
  },
  outlineButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#0057FF",
    paddingVertical: 10,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'center'
  },
  outlineButtonText: {
    color: "#0057FF",
    fontWeight: "600",
  },
  subtitle: {
    color: "#777",
    fontSize: 13,
  },
  helpRow: {
    flexDirection: "row",
    alignItems: "left",
    justifyContent: "left",
    marginTop: 20,
    gap: 5,
  },
  helpText: {
    color: "#555",
  },
  logoutButton: {
    width: "100%",
    flexDirection: "row",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#FFF0F0",
    paddingLeft: 5,
    borderRadius: 7
  },
  logoutText: {
    color: "#ff3b30",
    fontWeight: "600",
    marginLeft: 6,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' }
});

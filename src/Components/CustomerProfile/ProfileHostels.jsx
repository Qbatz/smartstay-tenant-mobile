import React, { useContext, useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Animated, PanResponder, Dimensions, Keyboard, TouchableWithoutFeedback, NativeModules, Linking, FlatList } from "react-native";
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
import { getHostelRentalDetails, getRentalDetials } from "../../Action/CustomerAction";
import { LoginContexts } from "../../Context/LoginContext";
import rightArrow from "../../assets/Images/LeftArrow.png"
import exclamation from "../../assets/Images/ExclamationCircle.png"
import AlertIcon from "../../assets/Images/AlertIcon.png"
import CallIcon from "../../assets/Images/call.png"
import { getToken, updateFCMToken } from "../../Action/LoginAction";
import { storeData } from "../../Utils/Storage";
import { ACCESS_TOKEN } from "../../Utils/Constant";
import SwitchIcon from "../../assets/Images/SwitchIcon.png"
import AppLoader from "../ToastFile/LoaderPage";
import UserIcon from "../../assets/Images/userIcon.png"
import LocationGreyIcon from "../../assets/Images/locationIcon.png"
import CalenderIcon from "../../assets/Images/calendar.png"
import Pdf from "../../assets/Images/pdf.png";
import Buildings from "../../assets/Images/buildings.png"
import EyeIcon from "../../assets/Images/view.png";
import DownloadIcon from "../../assets/Images/downloadDark.png"
import DocumentViewer from "../DocumentsView/DocumentViewer";
import NoticePeriodRequestRise from "../../Components/CustomerProfile/NoticePeriodRequestRise"



const SCREEN_HEIGHT = Dimensions.get("window").height;
const ProfileHostels = () => {


  const navigation = useNavigation();
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const { NotificationModule, CommonModule } = NativeModules;
  const userContext = useContext(UsersContext)
  const { getCustomerDetail, updateHostelDetail, getHostelList } = useContext(UsersContext)
  const loginContext = useContext(LoginContexts)
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedHostel, setSelectedHostel] = useState("");
  const [rentDetails, setRentalDetails] = useState();
  const [hostelRental, setHostelRental] = useState([])
  const [hostelList, setHostelList] = useState([]);
  const [showMoreDetail, setShowMoreDetail] = useState("")
  const [documents, setDocuments] = useState([])
  const [otherHostel, setOtherHostels] = useState([])
  const [showSwithtoSheet, setShowSwithToSheet] = useState(false)
  const [selectedSwitchHostel, setSelectedSwithcHostel] = useState("")
  const [fcmToken, setFcmToken] = useState();
  const [loading, setLoading] = useState(false)
  const [previousStay, setPreviousStay] = useState([])
  const [docsViewerIndex,setDocsViewerIndex]=useState("")
  const [docsViewer,setDocsViewer]=useState(false)
  const [showRequestNoticeSheet,setShowRequestNoticeSheet]=useState(false)
  

  console.log(selectedHostel?.rentalDetails)
  console.log(userContext)
  console.log(showMoreDetail)
  console.log("activeHostelList",hostelList)
  console.log("otherHostel", otherHostel)
  console.log("selectedSwitchHostel", selectedSwitchHostel)
  console.log("loginContxt", loginContext)
  console.log("previous",previousStay)


  const hostels = [
    { id: 1, name: "Smartstay Hostel", location: "11/40 Kandanchavadi,TamilNadu,43423", floor: "G1", room: "R1", bed: "B1", checkin: "11/04/2024", checkout: "95/44/4545", duration: "5month", monthlyRent: "6000", advancePaid: "20000", advancerefunded: "10000", checkoutreson: 'Changed to another place' },
    { id: 2, name: "StayEasy Hostel", location: "14/30 Velachery", floor: "G2", room: "R2", bed: "B4", checkin: "15/04/2026", checkout: "95/44/4545", duration: "6month", monthlyRent: "6000", advancePaid: "20000", advancerefunded: "10000", checkoutreson: 'Changed to another place' },
    { id: 3, name: "ComfortNest", location: "Thoraipakkam", floor: "G1", room: "R3", bed: "B3", checkin: "11/05/2024", checkout: "95/44/4545", duration: "5month", monthlyRent: "6000", advancePaid: "30000", advancerefunded: "20000", checkoutreson: 'Changed to another place' },
  ];

  useEffect(() => {
    setLoading(true)
    try {
      getHostelRentalDetails(loginContext.getUserId, loginContext.getToken).then(r => {
        setHostelList(r.data.activeStays)
        setPreviousStay(r?.data?.previousStays)
        console.log(r)
        if (r.status === 200) {
          const newRentals = r.data?.activeStays.find(i => i?.hostelId === userContext?.getHostelDetail?.hostelId)
          setSelectedHostel(newRentals)
          console.log("newRent", newRentals)
          setLoading(false)
        }
      })
    } catch (error) {
      console.log(error)
      setLoading(false)
    }


    // getRentalDetials(userContext?.getHostelDetail?.hostelId, loginContext.getToken)
    // .then(res => {
    //   setRentalDetails(res.data);
    //   console.log(res)
    // })


  }, [])

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: showSwithtoSheet ? 0 : SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showSwithtoSheet]);

  /* ================= DRAG DOWN ================= */
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 10,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 150) {
          Keyboard.dismiss();
          // onClose && onClose();
          setShowSwithToSheet(false)
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const fetchFcmTokenAsync = () => {
    NotificationModule.fetchFcmToken().then(r => {
      console.log(r)
      setFcmToken(r)
    })
      .catch(error => {
        console.log(error);
        setFcmToken(null)
      })

  }

  const fetchFCMToken = async (authToken) => {
    if (fcmToken != null) {
      await updateFCMToken(loginContext.getUserId, fcmToken, authToken);
    }

  }


  const switchHostel = (hostelId) => {
    console.log(hostelId)
    const res = hostelList.filter((i) => i.hostelId != hostelId)
    console.log("deselecthos", res)
    setOtherHostels(res)
    if (res) {
      setShowSwithToSheet(true)
    }
  }

  const handleSelectHostel = (hostel) => {
    console.log(hostel)
    console.log("hanan", hostel)
    if (hostel) {
      const data = {
        xuid: loginContext?.getUserId,
        hostelId: hostel.hostelId,
      }

      getToken(data).then(r => {
        console.log("token", r)
        if (r.status == 200) {
          fetchFCMToken(r.data);
          loginContext.updateToken(r.data)
          storeData(ACCESS_TOKEN, r.data)
          CommonModule.storeCredentials(r.data)
          const updateHostel=getHostelList.find(item=>item?.hostelId == hostel?.hostelId)
          updateHostelDetail(updateHostel)
        }
      })
      const res = hostelList.find((item) => item.hostelId === hostel.hostelId)
      console.log("changedHostel",res)
      setSelectedHostel(res);

    }
    setShowSwithToSheet(false);
    setDropdownVisible(false);

    console.log(hostel.hostelId)
  };

  const formatDate = (joiningDate) => {

    if (!joiningDate) return "";

    const normalized = joiningDate.replace(/-/g, "/");

    const [day, month, year] = normalized.split("/");

    const date = new Date(`${year}-${month}-${day}`);

    const options = { day: "2-digit", month: "short", year: "2-digit" };

    return date.toLocaleDateString("en-GB", options);

  }

  const handleShowDetail = (id) => {
    setShowMoreDetail((prev) => (prev === id ? null : id))

  }



  //   useEffect(() => {
  //   if (!selectedHostel?.hostelId) return;

  //   getRentalDetials(selectedHostel.hostelId, loginContext.getToken)
  //     .then(res => {
  //       setRentalDetails(res.data);
  //     })
  //     .catch(err => console.log("Error:", err));
  // }, [selectedHostel]); 

  const handleBack = () => navigation.goBack();

  const previousHostelCount= previousStay.length ;
  return <View style={styles.container}>
    <AppLoader visible={loading} />
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Image
          source={LeftArrow}
          style={{ height: 25, width: 25 }}
        />
      </TouchableOpacity>
      <Text style={styles.header}>Hostels</Text>
    </View>

    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
      <View style={styles.card}>
        <View
          style={styles.hostelHeader}>
          {selectedHostel?.hostelPic ? (
            <Image
              source={{ uri: selectedHostel?.hostelPic }}
              style={styles.profileImage} />
          ) : (
            <View style={[styles.profileImage, styles.initialContainer]}>
              <Text style={styles.initialText}>
                {selectedHostel?.hostelInitial}
              </Text>
            </View>
          )}

          <View style={{ flex: 1, paddingLeft: 5 }}>
            <Text style={styles.hostelTitle}>{selectedHostel?.hostelName}</Text>
            <View style={styles.locationRow}>
              <Image
                source={LocationIcon}
                resizeMode="contain" style={{ width: 20, height: 20 }}
              />
              <Text style={styles.locationText}>{selectedHostel?.city}</Text>
            </View>
          </View>


          {hostelList.length > 1 && (
            <TouchableOpacity onPress={() => switchHostel(selectedHostel?.hostelId)}
              activeOpacity={0.8} style={{ marginRight: 8 }}>
              <Image source={SwitchIcon} style={{ width: 23, height: 23 }} />
            </TouchableOpacity>
          )}
        </View>

        {dropdownVisible && (
          <View style={styles.dropdown}>
            <ScrollView>
              {hostelList.map((item) => (
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


        {/* <View style={styles.divider} />

      <Text style={styles.sectionTitle}>Rental Details</Text>

      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Joined Date</Text>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Image
            source={DateIcon}
            resizeMode="contain" style={{ width: 20, height: 20 }}
          />
          <Text style={styles.detailValue}>{selectedHostel?.rentalDetails?.joiningDate != null ? selectedHostel?.rentalDetails?.joiningDate : "N/A"}</Text>
        </View>
      </View>

      <View style={styles.detailRow}>

        <Text style={styles.detailLabel}>Advance Paid</Text>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Image
            source={MoneyIcon}
            resizeMode="contain" style={{ width: 20, height: 20 }}
          />
          <Text style={styles.detailValue}>{selectedHostel?.rentalDetails?.advancePaidAmount != 0 ? selectedHostel?.rentalDetails?.advancePaidAmount : 'N/A'}</Text>
        </View>
      </View>

      <View style={styles.detailRow}>

        <Text style={styles.detailLabel}>Monthly Rent</Text>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Image
            source={RentAmountIcon}
            resizeMode="contain" style={{ width: 20, height: 20 }}
          />
          <Text style={styles.detailValue}>₹{selectedHostel?.rentalDetails?.rentAmount}</Text>
        </View>
      </View>

      <View style={styles.detailRow}>

        <Text style={styles.detailLabel}>Billing Date</Text>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Image
            source={DateIcon}
            resizeMode="contain" style={{ width: 20, height: 20 }}
          />
          <Text style={styles.detailValue}>{selectedHostel?.currentStatus != "INACTIVE" ? selectedHostel?.rentalDetails?.dueDate : "N/A"}</Text>
        </View>
      </View> */}

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 18 }}>
          <View style={styles.hostelDetailBox}>
            <Text style={styles.hstlDtlHeaderTxt}>Room</Text>
            <Text style={styles.hstlDtlValueTxt}>{selectedHostel?.rentalDetails?.roomName}</Text>
          </View>
          <View style={styles.hostelDetailBox}>
            <Text style={styles.hstlDtlHeaderTxt}>Bed</Text>
            <Text style={styles.hstlDtlValueTxt}>{selectedHostel?.rentalDetails?.bedName}</Text>
          </View>
          <View style={styles.hostelDetailBox}>
            <Text style={styles.hstlDtlHeaderTxt}>Joined</Text>
            <Text style={styles.hstlDtlValueTxt}> {formatDate(selectedHostel?.rentalDetails?.joiningDate) || "N/A"}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
          <View style={styles.hostelDetailBox}>
            <Text style={styles.hstlDtlHeaderTxt}>Montly Rent</Text>
            <Text style={styles.hstlDtlValueTxt}>₹ {selectedHostel?.rentalDetails?.rentAmount || "N/A"}</Text>
          </View>
          <View style={styles.hostelDetailBox}>
            <Text style={styles.hstlDtlHeaderTxt}>Security Deposit</Text>
            <Text style={styles.hstlDtlValueTxt}>₹ {selectedHostel?.rentalDetails?.advancePaidAmount || "N/A"}</Text>
          </View>
        </View>

        <View style={{ display: 'flex', flexDirection: 'row', marginTop: 14, alignItems: 'center' }}>
          <Image
            source={LocationGreyIcon}
            resizeMode="contain" style={{ width: 15, height: 15 }}
          />
          <Text style={[styles.detailValue, { lineHeight: 20 }]}>{selectedHostel?.fullAddress}  {selectedHostel?.pincode}</Text>

        </View>
        {/* <Text style={styles.detailValue}>{selectedHostel?.state}, {selectedHostel?.pincode} </Text> */}

        <View style={{ display: 'flex', flexDirection: 'row', marginTop: 16, alignItems: 'center' }}>
          <Image
            source={UserIcon}
            resizeMode="contain" style={{ width: 14, height: 14 }}
          />
          <Text style={styles.detailValue}>{selectedHostel?.ownerName || "N/A"}</Text>
        </View>

        <View style={{ flexDirection: 'row', marginTop: 16, alignItems: 'center', alignItems: 'center' }}>
          <Image
            source={CallIcon}
            resizeMode="contain" style={{ width: 15, height: 15, tintColor: '#4B4B4B' }}
          />
          <Text style={styles.detailValue}>{selectedHostel?.hostelMobile || "N/A"}</Text>
        </View>

        {
          selectedHostel?.currentStatus != "BOOKED" && (
            <TouchableOpacity onPress={()=>setShowRequestNoticeSheet(true)}
            style={{
              paddingVertical: 16, backgroundColor: '#D41515', borderRadius: 8, justifyContent: "center",
              alignItems: "center", flexDirection: 'row', paddingHorizontal: 12, marginTop: 20,
            }}>
              <Image source={AlertIcon} style={{ width: 15, height: 15, marginRight: 5 }} />
              <Text style={{ color: '#FFFFFF', fontSize: 16, fontFamily: 'Gilroy-Medium' }}>Request Notice Period</Text>
            </TouchableOpacity>

          )
        }



        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15,backgroundColor:'#E7F1FF',
                    paddingVertical:10,paddingHorizontal:10,borderRadius:8,flex:1 }}>
          <Image source={exclamation} style={{ width: 16, height: 16, tintColor: '#4B4B4B' }} />
          {
            selectedHostel?.currentStatus != "BOOKED" && (
              <Text style={{ fontSize: 12, fontFamily: 'Gilroy-Regular', color: '#4B4B4B', marginLeft: 10,flexShrink:1,lineHeight:18 }}>
                Notice Period Serving Days is must be 30 Days from the Request</Text>
            )
          }
          {
            selectedHostel?.currentStatus == "BOOKED" && (
              <Text style={{ fontSize: 12, fontFamily: 'Gilroy-Regular', color: '#4B4B4B', 
                            marginLeft: 10,}}>
                Please be check-in on time</Text>
            )
          }

        </View>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 14, justifyContent: 'space-between', marginBottom: 15 }}>
        <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Semibold' }}>Previous Stays</Text>

        {previousStay.length>0 && (
        <Text style={{ paddingVertical: 3, paddingHorizontal: 5, fontSize: 12, fontFamily: 'Gilroy-Medium', color: '#1E45E1', backgroundColor: "#F3F5FF" }}>
          {previousStay?.length} hostel</Text>
          )}
      </View>

      {previousStay.length > 0 ? (
        previousStay.map((item) => (
          <View
            key={item.customerId}
            style={styles.prvsHostelList}
          // onPress={() => handleSelectHostel(item)}
          >
            <View style={{ flexDirection: 'row', }}>
              <View >
                {item?.hostelPi ?
                  <Image source={{ uri: item?.hostelPic }} style={{ width: 50, height: 50, borderRadius: 25 }} />
                  :
                  <View style={{ width: 50, height: 50, backgroundColor: '#F0F0F0', borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Semibold' }}>{item?.hostelInitial}</Text>
                  </View>}
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                  <Text style={[styles.dropdownText, { flex: 1 }]} numberOfLines={1} ellipsizeMode="tail">
                    {item.hostelName}</Text>
                  <View style={{
                    paddingVertical: 3, paddingHorizontal: 10, backgroundColor: "#F0F0F0",
                    borderRadius: 20, flexDirection: 'row', alignItems: 'center'
                  }}>
                    <View style={{ width: 6, height: 6, backgroundColor: '#4B4B4B', borderRadius: 3, marginRight: 4 }} />
                    <Text style={{ fontSize: 12, fontFamily: 'Gilroy-Medium', color: "#4B4B4B" }}>
                      {item?.currentStatus === "VACATED" ? "Checked out" : item?.currentStatus}
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                  <Image source={CalenderIcon} style={{ width: 14, height: 14, tintColor: '#292D32', marginRight: 4 }} />
                  <Text style={styles.dropdownSub}>
                    {item?.rentalDetails?.joiningDate} - {item?.rentalDetails?.checkoutDate}</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                  <Text style={{ fontSize: 13, fontFamily: 'Gilroy-Medium', color: '#1E45E1' }}>
                    Stayed for {item?.rentalDetails?.displayDuration}</Text>

                  <TouchableOpacity onPress={() => handleShowDetail(item?.customerId)}>
                    <Ionicons name={showMoreDetail == item.customerId ? "chevron-up" : "chevron-down"} size={22}
                      color="#000" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>


            {showMoreDetail == item.customerId && (
              <>
                <View style={{ borderWidth: 1, marginVertical: 14, borderColor: '#EEEEEE' }} />

                <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Regular', color: '#1E45E1' }}>PROPERTY INFORMATION</Text>

                <Text style={[styles.stayLabelTxt, { marginTop: 10 }]}>Hostels</Text>
                <Text style={{ fontSize: 15, fontFamily: 'Gilroy-Medium', color: "#222222", marginTop: 7 }}>
                  {item.hostelName}</Text>

                <Text style={[styles.stayLabelTxt, { marginTop: 10 }]}>Address</Text>
                <Text style={{ fontSize: 15, fontFamily: 'Gilroy-Medium', color: "#222222", marginTop: 7 }}>
                  {item?.fullAddress}</Text>

                <View style={{ borderWidth: 1, marginVertical: 14, borderColor: '#EEEEEE' }} />


                <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Regular', color: '#1E45E1' }}>STAY INFORMATION</Text>
                <View style={styles.styInfoField}>
                  <Text style={styles.stayLabelTxt}>Stay</Text>
                  <Text style={styles.stayValueTxt}>{item?.rentalDetails?.floorName}, {item?.rentalDetails?.roomName}</Text>
                </View>

                <View style={styles.styInfoField}>
                  <Text style={styles.stayLabelTxt}>Bed</Text>
                  <Text style={styles.stayValueTxt}>{item?.rentalDetails?.bedName || "N/A"}</Text>
                </View>

                <View style={styles.styInfoField}>
                  <Text style={styles.stayLabelTxt}>Check-In</Text>
                  <Text style={styles.stayValueTxt}>{item?.rentalDetails?.joiningDate || "N/A"}</Text>
                </View>

                <View style={styles.styInfoField}>
                  <Text style={styles.stayLabelTxt}>Check-Out</Text>
                  <Text style={styles.stayValueTxt}>{item?.rentalDetails?.checkoutDate || "N/A"}</Text>
                </View>

                <View style={styles.styInfoField}>
                  <Text style={styles.stayLabelTxt}>Total Duration</Text>
                  <Text style={styles.stayValueTxt}>{item?.rentalDetails?.displayDuration || "N/A"}</Text>
                </View>

                <View style={styles.styInfoField}>
                  <Text style={styles.stayLabelTxt}>Monthly Rent</Text>
                  <Text style={styles.stayValueTxt}>{item?.rentalDetails?.rentAmount || "N/A"}</Text>
                </View>

                <View style={styles.styInfoField}>
                  <Text style={styles.stayLabelTxt}>Advance Paid</Text>
                  <Text style={styles.stayValueTxt}>{item?.rentalDetails?.advancePaidAmount || "N/A"}</Text>
                </View>

                <View style={styles.styInfoField}>
                  <Text style={styles.stayLabelTxt}>Advance Refunded</Text>
                  <Text style={styles.stayValueTxt}>{item?.rentalDetails?.advanceRefundedAmount || "N/A"}</Text>
                </View>

                <View style={{
                  borderWidth: 1, borderColor: '#F0F0F0', backgroundColor: '#F2F2F29C',
                  marginTop: 8, padding: 10, borderRadius: 10
                }}>
                  <Text style={{ fontSize: 13, fontFamily: 'Gilroy-Regular', color: '#4B4B4B' }}>
                    Checkout Reason
                  </Text>
                  <Text style={{ fontSize: 15, fontFamily: 'Gilroy-Medium', marginTop: 8 }}>{item?.rentalDetails?.checkOutReason || "N/A"}</Text>
                </View>

                <View style={{ borderWidth: 1, marginVertical: 14, borderColor: '#EEEEEE' }} />

                <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Regular', color: '#1E45E1' }}>DOCUMENTS</Text>

                {item?.customerHostelDocs?.length > 0 ? (
                   item?.customerHostelDocs.map((docs,index) => (
                      <>
                        <View key={index}
                          style={{
                            borderWidth: 1, paddingVertical: 20, borderColor: '#eaeaec', borderRadius: 10, paddingHorizontal: 10,
                            backgroundColor: "#f9fafc", flexDirection: "row", alignItems: "center", marginBottom: 5,
                            justifyContent: 'space-between', marginTop: 10
                          }}>

                          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 5 }}>

                            <View style={{backgroundColor:'#ffffff',padding:10,justifyContent:'center',marginRight:5,
                                        alignItems:'center',borderRadius:10,elevation:2, shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 2,},shadowOpacity: 0.15,shadowRadius: 3,}}>
                              <Image source={Buildings} style={{ width: 18, height: 18}} />
                            </View>
                            <View style={{ marginLeft: 3, flex: 1 }}>
                              <Text style={{ fontSize: 13, color: "#111928", fontFamily: 'Gilroy-Medium', flexShrink: 1 }}>
                                {docs?.docFileType}</Text>
                              <Text style={{ fontSize: 12, color: "#6B7280", fontFamily: 'Gilroy-Semibold', marginTop: 4 }}>
                                         {docs?.docFileSize} • PDF
                              </Text>
                            </View>

                          </View>

                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity
                              onPress={() => {
                                if (docs?.docFileType === "PDF") {
                                  Linking.openURL(docs?.docFileUrl)
                                } else {
                                  const index = selectedHostel?.customerHostelDocs.findIndex((i) =>
                                    i.documentId === docs.documentId)
                                  setDocsViewerIndex(index);
                                  setDocsViewer(true);
                                }
                              }}>
                              <Image source={EyeIcon} style={{ width: 20, height: 20, tintColor: '#28303F', marginRight: 5 }} />
                            </TouchableOpacity>


                            <Image source={DownloadIcon} style={{ width: 20, height: 20, marginLeft: 8, tintColor: '#28303F' }} />
                          </View>


                        </View>
                        {/* <TouchableOpacity onPress={() => removeDocument(item?.documentId)}
                          style={{
                            position: "absolute", top: 2, right: 1, width: 20, height: 20, borderRadius: 10,
                            alignItems: 'center', justifyContent: 'center', backgroundColor: "#E0E0E0"
                          }}>
                          <Text style={{ fontSize: 18, textAlign: 'center', lineHeight: 18 }}>x</Text>
                        </TouchableOpacity> */}
                      </>
                   ))
                ) : (
                  <>
                    <View style={{
                      borderWidth: 1, borderColor: '#F0F0F0', backgroundColor: '#F2F2F29C',
                      marginTop: 10, padding: 10, borderRadius: 10
                    }}>
                      <Text style={{ fontSize: 13, fontFamily: 'Gilroy-Medium', textAlign: 'center' }}>
                        No documents available
                      </Text>
                    </View>
                  </>)}
              </>
            )}
          </View>
        ))
      ) : (
        <View style={{alignItems:'center',justifyContent:'center',marginTop:15}}>

          <Text style={{fontSize:14,fontFamily:'Gilroy-Medium'}}>No Previous hostel</Text>

        </View>
      )
      }

    </ScrollView>

    {showSwithtoSheet && (
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={() => setShowSwithToSheet(false)}>
          <View style={StyleSheet.absoluteFillObject} />
        </TouchableWithoutFeedback>
        <Animated.View
          {...panResponder.panHandlers}
          style={[styles.sheet, { transform: [{ translateY }] }]}>
          <View {...panResponder.panHandlers}>
            <View style={styles.dragindictor} />
          </View>

          <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
            <Text style={{ fontSize: 20, fontFamily: 'Gilroy-Semibold', marginTop: 14, marginBottom: 16 }}>Switch to</Text>

            {otherHostel.length > 0 && (
              otherHostel.map(i => (
                <TouchableOpacity onPress={() => setSelectedSwithcHostel(i)}
                  key={i?.hostelId} style={[styles.swthHostelCard, selectedSwitchHostel?.hostelId == i?.hostelId && { borderColor: "#1E45E1" }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {i?.hostelPic ? <Image source={{ uri: i?.hostelPic }} style={{ width: 56, height: 56.5, borderRadius: 28 }} /> :
                      <View style={{
                        backgroundColor: '#e7e6ee', width: 56, height: 56, borderRadius: 28,
                        alignItems: 'center', justifyContent: 'center'
                      }}>
                        <Text style={{ fontSize: 16, fontFamily: "Gilroy-Bold" }}>{i?.hostelInitial}</Text>
                      </View>}
                    <View style={{ marginLeft: 6 }}>
                      <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Semibold' }}>{i?.hostelName}</Text>

                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                        <Image source={LocationIcon} style={{ width: 15, height: 15 }} />
                        <Text style={{ fontSize: 13, fontFamily: 'Gilroy-Medium', marginLeft: 2 }}>{i?.city}</Text>
                        <Text style={{
                          fontSize: 13, fontFamily: 'Gilroy-Medium', backgroundColor: '#FFEFCF', borderRadius: 8,
                          paddingVertical: 3.5, paddingHorizontal: 7.5, marginLeft: 8
                        }}>
                          {i?.currentStatus}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {selectedSwitchHostel?.hostelId === i?.hostelId && (
                    <View style={{
                      borderWidth: 1, borderRadius: 10, width: 20, height: 20, alignItems: 'center',
                      justifyContent: 'center', marginRight: 10, borderColor: '#1E45E1'
                    }}>
                      <View style={{ backgroundColor: '#1E45E1', borderRadius: 7, width: 14, height: 14 }} />
                    </View>
                  )}
                </TouchableOpacity>
              ))
            )}

            <View style={{ flexDirection: 'row', alignItems: "center", flex: 1, marginTop: 25 }}>
              <TouchableOpacity onPress={() => {
                setShowSwithToSheet(false)
                setSelectedSwithcHostel("")
              }}
                style={{
                  flex: 1, borderWidth: 1, borderRadius: 10, borderColor: "#E7E7E7", paddingVertical: 18,
                  paddingHorizontal: 14, marginRight: 4, alignItems: 'center', justifyContent: 'center'
                }}>
                <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Medium' }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleSelectHostel(selectedSwitchHostel)}
                style={{
                  flex: 1, backgroundColor: '#1E45E1', borderRadius: 10, paddingVertical: 18,
                  paddingHorizontal: 14, marginLeft: 4, alignItems: 'center', justifyContent: 'center'
                }}>
                <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Medium', color: '#FFFFFF' }}>Confirm</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>


        </Animated.View>
      </View>
    )}
     <DocumentViewer
                visible={docsViewer}
                documents={selectedHostel?.customerHostelDocs}
                initialIndex={docsViewerIndex}
                onClose={() => setDocsViewer(false)}
            />

      <NoticePeriodRequestRise
        visible={showRequestNoticeSheet}
        onClose={()=>{setShowRequestNoticeSheet(false)}}/>
    

  </View>
}

const styles = StyleSheet.create({

  textdesign: {
    color: 'grey'
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 30,
    // paddingVertical: 20,
    paddingHorizontal: 20
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
    marginBottom: 5,
  },
  header: {
    fontSize: 20,
    fontFamily: 'Gilroy-Semibold',
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
    marginTop: 20
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
    fontFamily: 'Gilroy-Semibold',
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
    fontFamily: 'Gilroy-Regular'
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 20

  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Gilroy-Semibold',
    color: "#000",
    marginBottom: 8,
  },
  detailRow: {
    alignItems: "left",
    marginBottom: 8,
    marginTop: 8,
  },
  detailLabel: {
    marginBottom: 5,
    color: "#555",
    fontSize: 13,
    fontFamily: 'Gilroy-Medium',
  },
  detailValue: {
    color: "#000",
    fontFamily: 'Gilroy-Medium', fontSize: 14,
    marginLeft: 8
  },
  dropdown: {
    marginTop: 10,
    backgroundColor: "#F8F9FF",
    borderRadius: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    overflow: "hidden",
    maxHeight: 60 * 3,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dropdownText: {
    fontSize: 15,
    fontFamily: 'Gilroy-Semibold',
  },
  dropdownSub: {
    fontSize: 13,
    fontFamily: 'Gilroy-Regular',
    color: "#777",
  },
  hostelDetailBox: {
    flex: 1, borderWidth: 1, borderColor: '#F0F0F0', backgroundColor: '#F2F2F29C',
    margin: 5, padding: 10, borderRadius: 10
  },
  hstlDtlHeaderTxt: { fontSize: 12, fontFamily: 'Gilroy-Regular', color: '#6D6D6D' },
  hstlDtlValueTxt: { fontSize: 15, fontFamily: 'Gilroy-Medium', color: "#222222", marginTop: 8 },
  prvsHostelList: {
    padding: 12,
    borderWidth: 1,backgroundColor:'#FFFFFF',
    borderColor: "#eee", marginVertical: 8, borderRadius: 12,elevation:2
  },
  styInfoField: {
    flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between', marginVertical: 8
  },
  stayLabelTxt: {
    fontSize: 13, fontFamily: 'Gilroy-Regular', color: '#4B4B4B'
  },
  stayValueTxt: {
    fontSize: 14, fontFamily: 'Gilroy-Medium', color: "#222222"
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 16,
    maxHeight: "98%",
    overflow: 'hidden'
    // dynamic height limit
  },
  dragindictor: { width: 50, height: 4, backgroundColor: "#ccc", borderRadius: 2, alignSelf: "center", marginBottom: 10 },
  swthHostelCard: {
    flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderColor: '#E7E7E7',
    borderRadius: 10, paddingVertical: 14, paddingHorizontal: 16, alignItems: 'center', marginTop: 8
  },
})
export default ProfileHostels;
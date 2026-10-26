import React, { useContext, useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
  PanResponder,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
  NativeModules,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import LocationIcon from "../../assets/Images/location.png";
import LeftArrow from "../../assets/Images/LeftArrow.png";
import { UsersContext } from "../../Context/UserContext";
import { getHostelRentalDetails } from "../../Action/CustomerAction";
import { LoginContexts } from "../../Context/LoginContext";
import exclamation from "../../assets/Images/ExclamationCircle.png";
import AlertIcon from "../../assets/Images/AlertIcon.png";
import CallIcon from "../../assets/Images/call.png";
import { getToken, updateFCMToken } from "../../Action/LoginAction";
import { storeData } from "../../Utils/Storage";
import { ACCESS_TOKEN } from "../../Utils/Constant";
import SwitchIcon from "../../assets/Images/SwitchIcon.png";
import AppLoader from "../ToastFile/LoaderPage";
import UserIcon from "../../assets/Images/userIcon.png";
import LocationGreyIcon from "../../assets/Images/locationIcon.png";
import CalenderIcon from "../../assets/Images/calendar.png";
import Ionicons from "react-native-vector-icons/Ionicons";
import DocumentViewer from "../DocumentsView/DocumentViewer";
import NoticePeriodRequestRise from "../../Components/CustomerProfile/NoticePeriodRequestRise";



const SCREEN_HEIGHT = Dimensions.get("window").height;

const ProfileHostels = () => {
  // Navigation & Native Modules
  const navigation = useNavigation();
  const { CommonModule } = NativeModules;

  // Context
  const userContext = useContext(UsersContext);
  const { updateHostelDetail, getHostelList } = userContext;
  const loginContext = useContext(LoginContexts);

  // Animations & Gestures
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 10,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 150) {
          Keyboard.dismiss();
          setShowSwithToSheet(false);
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // State Management
  const [hostelList, setHostelList] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [previousStay, setPreviousStay] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSwithtoSheet, setShowSwithToSheet] = useState(false);
  const [selectedSwitchHostel, setSelectedSwitchHostel] = useState(null);
  const [otherHostel, setOtherHostels] = useState([]);
  const [showMoreDetail, setShowMoreDetail] = useState(null);
  const [showRequestNoticeSheet, setShowRequestNoticeSheet] = useState(false);
  const [docsViewer, setDocsViewer] = useState(false);
  const [docsViewerIndex, setDocsViewerIndex] = useState(0);
  const [fcmToken, setFcmToken] = useState(null);

  // Format date from different formats to readable date
  const formatDate = useCallback((joiningDate) => {
    if (!joiningDate) return "";

    const normalized = joiningDate.replace(/-/g, "/");
    const [day, month, year] = normalized.split("/");
    const date = new Date(`${year}-${month}-${day}`);
    const options = { day: "2-digit", month: "short", year: "2-digit" };

    return date.toLocaleDateString("en-GB", options);
  }, []);

  console.log("PreviousStay", previousStay)
  // Fetch hostel details from API
  const fetchDetails = useCallback(() => {
    setLoading(true);
    getHostelRentalDetails(loginContext.getUserId, loginContext.getToken)
      .then((res) => {
        if (res?.status === 200) {
          const activeStays = res.data?.activeStays || [];
          const previousStaysData = res.data?.previousStays || [];
          const allStays = [...activeStays, ...previousStaysData];

          setHostelList(allStays);

          const currentHostel = allStays.find(
            (i) => i?.hostelId === userContext?.getHostelDetail?.hostelId
          );
          setSelectedHostel(currentHostel || allStays[0]);

          const otherStays = allStays?.filter(
            (item) => item?.hostelId !== userContext?.getHostelDetail?.hostelId
          );
          setPreviousStay(otherStays);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching hostel details:", error);
        setLoading(false);
      });
  }, [loginContext, userContext]);


  // Initialize fetch on component mount
  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  // Handle switch hostel modal animation
  useEffect(() => {
    Animated.timing(translateY, {
      toValue: showSwithtoSheet ? 0 : SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showSwithtoSheet, translateY]);

  // Update FCM token for new hostel
  const updateFCMTokenForHostel = useCallback(
    async (authToken) => {
      if (fcmToken) {
        await updateFCMToken(loginContext.getUserId, fcmToken, authToken);
      }
    },
    [fcmToken, loginContext]
  );

  // Handle switching to a different hostel
  const switchHostel = useCallback((hostelId) => {
    const otherHostels = hostelList.filter((i) => i.hostelId !== hostelId);
    setOtherHostels(otherHostels);
    if (otherHostels.length > 0) {
      setShowSwithToSheet(true);
    }
  }, [hostelList]);

  // Handle hostel selection and token update
  const handleSelectHostel = useCallback(
    (hostel) => {
      if (!hostel?.hostelId) return;

      // Update UI immediately (optimistic update)
      const selectedHosatel = hostelList.find(
        (item) => item.hostelId === hostel.hostelId
      );
      setSelectedHostel(selectedHosatel);
      setShowSwithToSheet(false);
      setShowMoreDetail(null); // Close expanded details

      // Fetch token in background (non-blocking)
      const data = {
        xuid: loginContext?.getUserId,
        hostelId: hostel.hostelId,
      };

      getToken(data)
        .then((res) => {
          if (res?.status === 200) {
            updateFCMTokenForHostel(res.data);
            loginContext.updateToken(res.data);
            storeData(ACCESS_TOKEN, res.data);
            CommonModule.storeCredentials(res.data);

            const updateHostel = getHostelList?.find(
              (item) => item?.hostelId === hostel?.hostelId
            );
            if (updateHostel) {
              updateHostelDetail(updateHostel);
            }
          }
        })
        .catch((error) => {
          console.error("Error updating token:", error);
        });
    },
    [loginContext, getHostelList, updateHostelDetail, hostelList, updateFCMTokenForHostel, CommonModule]
  );

  // Toggle detailed view for previous stays
  const handleShowDetail = useCallback((id) => {
    setShowMoreDetail((prev) => (prev === id ? null : id));
  }, []);

  // Handle back navigation
  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  if (!selectedHostel) {
    return (
      <View style={styles.container}>
        <AppLoader visible={loading} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppLoader visible={loading} />
      <HeaderBar onBack={handleBack} />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        <CurrentHostelCardWithDetails
          hostel={selectedHostel}
          hostelCount={hostelList.length}
          // onSwitch={switchHostel}
          formatDate={formatDate}
          onRequestNotice={() => setShowRequestNoticeSheet(true)}
        />

        <PreviousStaysSection
          stays={previousStay}
          expandedId={showMoreDetail}
          onToggleDetail={handleShowDetail}
          onSelectHostel={setSelectedSwitchHostel}
          onConfirm={() => handleSelectHostel(selectedSwitchHostel)}
        />

      </ScrollView>

      {/* <SwitchHostelModal
        visible={showSwithtoSheet}
        hostels={otherHostel}
        selectedHostel={selectedSwitchHostel}
        onSelectHostel={setSelectedSwitchHostel}
        onConfirm={() => handleSelectHostel(selectedSwitchHostel)}
        onCancel={() => {
          setShowSwithToSheet(false);
          setSelectedSwitchHostel(null);
        }}
        panResponder={panResponder}
        translateY={translateY}
      /> */}

      <DocumentViewer
        visible={docsViewer}
        documents={selectedHostel?.customerHostelDocs}
        initialIndex={docsViewerIndex}
        onClose={() => setDocsViewer(false)}
      />

      <NoticePeriodRequestRise
        visible={showRequestNoticeSheet}
        onClose={() => {
          fetchDetails();
          setShowRequestNoticeSheet(false);
        }}
      />
    </View>
  );
};

// ============ COMPONENT: Header ============
const HeaderBar = ({ onBack }) => (
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <TouchableOpacity style={styles.backButton} onPress={onBack}>
      <Image source={LeftArrow} style={{ height: 25, width: 25 }} />
    </TouchableOpacity>
    <Text style={styles.header}>Hostels</Text>
  </View>
);

// ============ COMPONENT: Current Hostel Card With Details ============
const CurrentHostelCardWithDetails = ({ hostel, hostelCount, onSwitch, formatDate, onRequestNotice }) => (
  <View style={styles.card}>
    {/* Hostel Header Section */}
    <View style={styles.hostelHeader}>
      {hostel?.hostelPic ? (
        <Image source={{ uri: hostel?.hostelPic }} style={styles.profileImage} />
      ) : (
        <View style={[styles.profileImage, styles.initialContainer]}>
          <Text style={styles.initialText}>{hostel?.hostelInitial}</Text>
        </View>
      )}

      <View style={{ flex: 1, paddingLeft: 5 }}>
        <Text style={styles.hostelTitle}>{hostel?.hostelName}</Text>
        <View style={styles.locationRow}>
          <Image source={LocationIcon} resizeMode="contain" style={{ width: 20, height: 20 }} />
          <Text style={styles.locationText}>{hostel?.city}</Text>
        </View>
      </View>

      {/* {hostelCount > 1 && (
        <TouchableOpacity onPress={() => onSwitch(hostel?.hostelId)} activeOpacity={0.8} style={{ marginRight: 8 }}>
          <Image source={SwitchIcon} style={{ width: 23, height: 23 }} />
        </TouchableOpacity>
      )} */}
    </View>

    {/* Hostel Details Section */}
    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 18 }}>
      <DetailBox label="Room" value={hostel?.rentalDetails?.roomName} />
      <DetailBox label="Bed" value={hostel?.rentalDetails?.bedName} />
      <DetailBox label="Joined" value={formatDate(hostel?.rentalDetails?.joiningDate)} />
    </View>

    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}>
      <DetailBox label="Monthly Rent" value={`₹ ${hostel?.rentalDetails?.rentAmount || "N/A"}`} />
      <DetailBox label="Security Deposit" value={`₹ ${hostel?.rentalDetails?.advancePaidAmount || "N/A"}`} />
    </View>

    <InfoRow icon={LocationGreyIcon} text={`${hostel?.fullAddress} ${hostel?.pincode}`} />
    <InfoRow icon={UserIcon} text={hostel?.ownerName || "N/A"} />
    <InfoRow icon={CallIcon} text={hostel?.hostelMobile || "N/A"} color="#4B4B4B" />

    {hostel?.currentStatus !== "VACATED" && (
      <>
        {hostel?.currentStatus !== "BOOKED" && (
          <TouchableOpacity
            onPress={onRequestNotice}
            disabled={!hostel?.canRaiseNotice}
            style={[styles.noticeButton, !hostel?.canRaiseNotice && { opacity: 0.6 }]}
          >
            <Image source={AlertIcon} style={{ width: 15, height: 15, marginRight: 5 }} />
            <Text style={styles.noticeButtonText}>Request Notice Period</Text>
          </TouchableOpacity>
        )}

        <AlertBox
          icon={exclamation}
          message={
            hostel?.currentStatus !== "BOOKED"
              ? "Notice Period Serving Days is must be 30 Days from the Request"
              : "Please be check-in on time"
          }
        />
      </>
    )}
  </View>
);

// ============ COMPONENT: Previous Stays Section ============
const PreviousStaysSection = ({ stays, expandedId, onToggleDetail, onSelectHostel, onConfirm }) => (
  <>
    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 14, justifyContent: "space-between", marginBottom: 15 }}>
      <Text style={{ fontSize: 16, fontFamily: "Gilroy-Semibold" }}>Your Stays</Text>
      {stays.length > 0 && (
        <Text style={styles.hostelCountBadge}>{stays?.length} hostel</Text>
      )}
    </View>

    {stays.length > 0 ? (
      stays.map((item) => (
        <PreviousStayCard
          key={item.customerId}
          hostel={item}
          isExpanded={expandedId === item.customerId}
          onToggle={() => {
            onToggleDetail(item.customerId)
            onSelectHostel(item)
          }}
          onConfirm={onConfirm}

        />
      ))
    ) : (
      <EmptyState message="No Previous hostel" />
    )}
  </>
);

// ============ COMPONENT: Previous Stay Card ============
const PreviousStayCard = ({ hostel, isExpanded, onToggle, onConfirm }) => (
  <View style={styles.prvsHostelList}>
    <View style={{ flexDirection: "row" }}>
      <HostelAvatar hostel={hostel} />
      <View style={{ flex: 1, marginLeft: 8 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", flex: 1 }}>
          <Text style={[styles.dropdownText, { flex: 1 }]} numberOfLines={1} ellipsizeMode="tail">
            {hostel.hostelName}
          </Text>
          <StatusBadge status={hostel?.currentStatus} />
        </View>
        <DateRange joining={hostel?.rentalDetails?.joiningDate} checkout={hostel?.rentalDetails?.checkoutDate}
          status={hostel?.currentStatus} bookingDate={hostel?.rentalDetails?.bookingDate} />
        <StayFooter duration={hostel?.rentalDetails?.displayDuration} isExpanded={isExpanded} onToggle={onToggle} status={hostel?.currentStatus} />
      </View>
    </View>

    {isExpanded && (
      <ExpandedStayDetails
        hostel={hostel}
        onConfirm={onConfirm}
        isLoading={false}
      />
    )}
  </View>
);

// ============ COMPONENT: Expanded Stay Details ============
const ExpandedStayDetails = ({ hostel, onConfirm, isLoading }) => (
  <>
    <View style={{ borderWidth: 1, marginVertical: 14, borderColor: "#EEEEEE" }} />
    <Text style={{ fontSize: 14, fontFamily: "Gilroy-Regular", color: "#1E45E1" }}>PROPERTY INFORMATION</Text>

    <Text style={[styles.stayLabelTxt, { marginTop: 10 }]}>Hostel</Text>
    <Text style={{ fontSize: 15, fontFamily: "Gilroy-Medium", color: "#222222", marginTop: 7 }}>
      {hostel.hostelName}
    </Text>

    <Text style={[styles.stayLabelTxt, { marginTop: 10 }]}>Address</Text>
    <Text style={{ fontSize: 15, fontFamily: "Gilroy-Medium", color: "#222222", marginTop: 7 }}>
      {hostel?.fullAddress}
    </Text>

    <View style={{ borderWidth: 1, marginVertical: 14, borderColor: "#EEEEEE" }} />
    <Text style={{ fontSize: 14, fontFamily: "Gilroy-Regular", color: "#1E45E1" }}>STAY INFORMATION</Text>

    <InfoField label="Stay" value={`${hostel?.rentalDetails?.floorName}, ${hostel?.rentalDetails?.roomName}`} />
    <InfoField label="Bed" value={hostel?.rentalDetails?.bedName || "N/A"} />
    <InfoField
      label={hostel?.currentStatus === "BOOKED" ? "Joining Date" : "Check-In"}
      value={hostel?.currentStatus === "BOOKED" ? hostel?.rentalDetails?.expJoiningDate : hostel?.rentalDetails?.joiningDate || "N/A"}
    />

    {hostel?.currentStatus != "BOOKED" && (
      <>
        <InfoField label="Check-Out" value={hostel?.rentalDetails?.checkoutDate || "N/A"} />
        <InfoField label="Total Duration" value={hostel?.rentalDetails?.displayDuration || "N/A"} />
        <InfoField label="Monthly Rent" value={hostel?.rentalDetails?.rentAmount || "N/A"} />
        <InfoField label="Advance Paid" value={hostel?.rentalDetails?.advancePaidAmount || "N/A"} />
        <InfoField label="Advance Refunded" value={hostel?.rentalDetails?.totalRefundedAmount || "N/A"} />
      </>
    )}
    {hostel?.currentStatus === "BOOKED" && (
      <>
        <InfoField label="Booking Date" value={hostel?.rentalDetails?.bookingDate || "N/A"} />
        <InfoField label="Booking Amount" value={hostel?.rentalDetails?.bookingPaidAmount || "N/A"} />
      </>
    )}
    {hostel?.currentStatus === "VACATED" &&
      <View style={styles.checkoutReasonBox}>
        <Text style={{ fontSize: 13, fontFamily: "Gilroy-Regular", color: "#4B4B4B" }}>Checkout Reason</Text>
        <Text style={{ fontSize: 15, fontFamily: "Gilroy-Medium", marginTop: 8 }}>
          {hostel?.rentalDetails?.checkOutReason || "N/A"}
        </Text>
      </View>
    }
    <TouchableOpacity
      onPress={onConfirm}
      disabled={isLoading}
      style={[styles.switchHostelBtn, isLoading && { opacity: 0.6 }]}
    >
      <Text style={styles.switchHostelTxt}>
        {isLoading ? "Switching..." : "Switch Hostel"}
      </Text>
    </TouchableOpacity>
  </>
);

// ============ COMPONENT: Switch Hostel Modal ============
const SwitchHostelModal = ({
  visible,
  hostels,
  selectedHostel,
  onSelectHostel,
  onConfirm,
  onCancel,
  panResponder,
  translateY,
}) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={StyleSheet.absoluteFillObject} />
      </TouchableWithoutFeedback>
      <Animated.View {...panResponder.panHandlers} style={[styles.sheet, { transform: [{ translateY }] }]}>
        <View {...panResponder.panHandlers}>
          <View style={styles.dragIndicator} />
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          <Text style={{ fontSize: 20, fontFamily: "Gilroy-Semibold", marginTop: 14, marginBottom: 16 }}>Switch to</Text>

          {hostels.map((hostel) => (
            <SwitchHostelCard
              key={hostel?.hostelId}
              hostel={hostel}
              isSelected={selectedHostel?.hostelId === hostel?.hostelId}
              onSelect={() => onSelectHostel(hostel)}
            />
          ))}
        </ScrollView>

        <ModalButtonGroup onCancel={onCancel} onConfirm={onConfirm} />
      </Animated.View>
    </View>
  );
};

// ============ COMPONENT: Switch Hostel Card ============
const SwitchHostelCard = ({ hostel, isSelected, onSelect }) => (
  <TouchableOpacity onPress={onSelect} style={[styles.swthHostelCard, isSelected && { borderColor: "#1E45E1" }]}>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <HostelAvatar hostel={hostel} size={56} />
      <View style={{ marginLeft: 6 }}>
        <Text style={{ fontSize: 16, fontFamily: "Gilroy-Semibold" }}>{hostel?.hostelName}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
          <Image source={LocationIcon} style={{ width: 15, height: 15 }} />
          <Text style={{ fontSize: 13, fontFamily: "Gilroy-Medium", marginLeft: 2 }}>{hostel?.city}</Text>
          <Text style={styles.statusTag}>{hostel?.currentStatus}</Text>
        </View>
      </View>
    </View>

    {isSelected && <SelectionCheckbox />}
  </TouchableOpacity>
);

// ============ SUB-COMPONENTS ============

const DetailBox = ({ label, value }) => (
  <View style={styles.hostelDetailBox}>
    <Text style={styles.hstlDtlHeaderTxt}>{label}</Text>
    <Text style={styles.hstlDtlValueTxt} numberOfLines={1}>
      {value || "N/A"}
    </Text>
  </View>
);

const InfoRow = ({ icon, text, color }) => (
  <View style={{ display: "flex", flexDirection: "row", marginTop: 16, alignItems: "center" }}>
    <Image source={icon} resizeMode="contain" style={{ width: 14, height: 14, tintColor: color }} />
    <Text style={styles.detailValue}>{text}</Text>
  </View>
);

const AlertBox = ({ icon, message }) => (
  <View style={styles.alertBox}>
    <Image source={icon} style={{ width: 16, height: 16, tintColor: "#4B4B4B" }} />
    <Text style={styles.alertText}>{message}</Text>
  </View>
);

const HostelAvatar = ({ hostel, size = 50 }) => (
  <View>
    {hostel?.hostelPic ? (
      <Image source={{ uri: hostel?.hostelPic }} style={{ width: size, height: size, borderRadius: size / 2 }} />
    ) : (
      <View style={{ width: size, height: size, backgroundColor: "#F0F0F0", borderRadius: size / 2, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 16, fontFamily: "Gilroy-Semibold" }}>{hostel?.hostelInitial}</Text>
      </View>
    )}
  </View>
);

const StatusBadge = ({ status }) => (
  <View style={styles.statusBadge}>
    <View style={{ width: 6, height: 6, backgroundColor: "#4B4B4B", borderRadius: 3, marginRight: 4 }} />
    <Text style={{ fontSize: 12, fontFamily: "Gilroy-Medium", color: "#4B4B4B" }}>
      {status === "VACATED" ? "Checked out" : status}
    </Text>
  </View>
);

const DateRange = ({ joining, checkout, status, bookingDate }) => (
  <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
    <Image source={CalenderIcon} style={{ width: 14, height: 14, tintColor: "#292D32", marginRight: 4 }} />
    {status === "VACATED" &&
      <Text style={styles.dropdownSub}>
        {joining} - {checkout}
      </Text>
    }
    {status != "VACATED" &&
      <Text style={styles.dropdownSub}>{status === "BOOKED" ? bookingDate : joining}</Text>}
  </View>
);

const StayFooter = ({ duration, isExpanded, onToggle, status }) => (
  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 6}}>
    {/* {status === "VACATED" && */}
      <Text style={{ fontSize: 13, fontFamily: "Gilroy-Medium", color: "#1E45E1" }}>
        {status === "VACATED" ? `Stayed for ${duration}` : status === "BOOKED" ? "Stay Info" : `Staying for ${duration}`} </Text>
    {/* } */}
    <TouchableOpacity onPress={onToggle} style={{alignSelf:'flex-end'}}>
      <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={22} color="#000" />
    </TouchableOpacity>
  </View>
);

const InfoField = ({ label, value }) => (
  <View style={styles.styInfoField}>
    <Text style={styles.stayLabelTxt}>{label}</Text>
    <Text style={styles.stayValueTxt}>{value}</Text>
  </View>
);

const SelectionCheckbox = () => (
  <View style={styles.selectionCheckbox}>
    <View style={{ backgroundColor: "#1E45E1", borderRadius: 7, width: 14, height: 14 }} />
  </View>
);

const ModalButtonGroup = ({ onCancel, onConfirm }) => (
  <View style={{ flexDirection: "row", alignItems: "center", paddingTop: 10, backgroundColor: "#ffffff", bottom: 15 }}>
    <TouchableOpacity onPress={onCancel} style={styles.modalCancelButton}>
      <Text style={{ fontSize: 16, fontFamily: "Gilroy-Medium" }}>Cancel</Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={onConfirm} style={styles.modalConfirmButton}>
      <Text style={{ fontSize: 16, fontFamily: "Gilroy-Medium", color: "#FFFFFF" }}>Confirm</Text>
    </TouchableOpacity>
  </View>
);

const EmptyState = ({ message }) => (
  <View style={{ alignItems: "center", justifyContent: "center", marginTop: 15 }}>
    <Text style={{ fontSize: 14, fontFamily: "Gilroy-Medium" }}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  // ========== LAYOUT ==========
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 30,
    paddingHorizontal: 20,
  },

  // ========== HEADER ==========
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
    marginBottom: 5,
  },
  header: {
    fontSize: 20,
    fontFamily: "Gilroy-Semibold",
    marginLeft: 10,
  },

  // ========== CARDS & SECTIONS ==========
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 12,
    marginTop: 20,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  initialContainer: {
    backgroundColor: "#eef1ff",
    justifyContent: "center",
    alignItems: "center",
  },
  initialText: {
    color: "#788fed",
    fontSize: 20,
    fontWeight: "bold",
  },

  // ========== HOSTEL HEADER ==========
  hostelHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  hostelTitle: {
    fontSize: 16,
    fontFamily: "Gilroy-Semibold",
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
    fontFamily: "Gilroy-Regular",
  },

  // ========== DETAIL BOXES ==========
  hostelDetailBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    backgroundColor: "#F2F2F29C",
    margin: 5,
    padding: 10,
    borderRadius: 10,
  },
  hstlDtlHeaderTxt: {
    fontSize: 12,
    fontFamily: "Gilroy-Regular",
    color: "#6D6D6D",
  },
  hstlDtlValueTxt: {
    fontSize: 15,
    fontFamily: "Gilroy-Medium",
    color: "#222222",
    marginTop: 8,
  },
  detailValue: {
    color: "#000",
    fontFamily: "Gilroy-Medium",
    fontSize: 14,
    marginLeft: 8,
  },

  // ========== BUTTONS ==========
  noticeButton: {
    paddingVertical: 16,
    backgroundColor: "#D41515",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 12,
    marginTop: 20,
  },
  noticeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Gilroy-Medium",
  },

  // ========== ALERT BOX ==========
  alertBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    backgroundColor: "#E7F1FF",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    flex: 1,
  },
  alertText: {
    fontSize: 12,
    fontFamily: "Gilroy-Regular",
    color: "#4B4B4B",
    marginLeft: 10,
    flexShrink: 1,
    lineHeight: 18,
  },

  // ========== PREVIOUS STAYS ==========
  hostelCountBadge: {
    paddingVertical: 3,
    paddingHorizontal: 5,
    fontSize: 12,
    fontFamily: "Gilroy-Medium",
    color: "#1E45E1",
    backgroundColor: "#F3F5FF",
  },
  prvsHostelList: {
    padding: 12,
    borderWidth: 1,
    backgroundColor: "#FFFFFF",
    borderColor: "#eee",
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
  },
  dropdownText: {
    fontSize: 15,
    fontFamily: "Gilroy-Semibold",
  },
  dropdownSub: {
    fontSize: 13,
    fontFamily: "Gilroy-Regular",
    color: "#777",
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  // ========== EXPANDED DETAILS ==========
  styInfoField: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  stayLabelTxt: {
    fontSize: 13,
    fontFamily: "Gilroy-Regular",
    color: "#4B4B4B",
  },
  stayValueTxt: {
    fontSize: 14,
    fontFamily: "Gilroy-Medium",
    color: "#222222",
  },
  checkoutReasonBox: {
    borderWidth: 1,
    borderColor: "#F0F0F0",
    backgroundColor: "#F2F2F29C",
    marginTop: 8,
    padding: 10,
    borderRadius: 10,
  },

  // ========== MODAL / OVERLAY ==========
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
    overflow: "hidden",
  },
  dragIndicator: {
    width: 50,
    height: 4,
    backgroundColor: "#ccc",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 10,
  },

  // ========== SWITCH HOSTEL CARD ==========
  swthHostelCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E7E7E7",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    marginTop: 8,
  },
  statusTag: {
    fontSize: 13,
    fontFamily: "Gilroy-Medium",
    backgroundColor: "#FFEFCF",
    borderRadius: 8,
    paddingVertical: 3.5,
    paddingHorizontal: 7.5,
    marginLeft: 8,
  },
  selectionCheckbox: {
    borderWidth: 1,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    borderColor: "#1E45E1",
  },

  // ========== MODAL BUTTONS ==========
  modalCancelButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#E7E7E7",
    paddingVertical: 18,
    paddingHorizontal: 14,
    marginRight: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  modalConfirmButton: {
    flex: 1,
    backgroundColor: "#1E45E1",
    borderRadius: 10,
    paddingVertical: 18,
    paddingHorizontal: 14,
    marginLeft: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  switchHostelBtn: {
    flex: 1,
    backgroundColor: "#1E45E1",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginLeft: 4,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16
  },
  switchHostelTxt: {
    fontFamily: "Gilroy-Medium", fontSize: 16,
    color: '#ffffff'
  }
});
export default ProfileHostels;
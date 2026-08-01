import React, { useContext, useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image, Linking, Alert,
    BackHandler,
    Animated,
    Dimensions,
    PanResponder,
    Pressable,
    RefreshControl,
    ActivityIndicator
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
import { ACCESS_TOKEN, CUSTOMERDETAIL, CUSTOMERINITIALS, CUSTOMERPROFILEPIC, LOGGEDIN, LOGGEDOUT, PHONE_NO } from "../../Utils/Constant";
import { customerDetails, verifyNowKyc } from "../../Action/CustomerAction";
import buildings from '../../assets/Images/buildings.png'
import paperclip from '../../assets/Images/paperclip.png'
import sideframe from '../../assets/Images/sideframe.png'
import { LoginContexts } from "../../Context/LoginContext";
import logoutSetup from '../../Action/LogoutAction';
import { NativeModules } from "react-native";
import Svg, { Circle } from "react-native-svg";
import DotIcon from "../../assets/Images/dot.png"
import { TouchableWithoutFeedback } from "@gorhom/bottom-sheet";
import CloseIcon from "../../assets/Images/close.png";
import GreenAddIcon from "../../assets/Images/GreenAddIcon.png"
import LinearGradient from "react-native-linear-gradient";
import MessageDocIcon from "../../assets/Images/MessageDocIcon.png"
import UserAccountDetails from "../../assets/Images/userAccount.png";
import Building from '../../assets/Images/buildin.png'
import BedIconNew from "../../assets/Images/bedIconNew.png";
import RoomIconNew from "../../assets/Images/roomIconNew.png"
import RightArrow from "../../assets/Images/arrow-right.png"
import SuccessModal from "../ToastFile/TostFilePage";




const CustomerProfileNew = (route) => {

    const context = useContext(UsersContext)
    const loginContext = useContext(LoginContexts)

    const navigation = useNavigation();
    const [customer, setCustomers] = useState()
    const { NotificationModule, CommonModule } = NativeModules;
    const [penditnActionBottomSheet, setPendingActionSheet] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState("");
    const [showModalType, setShowModalType] = useState("")
    const [refreshing, setRefreshing] = useState(false)

    const SCREEN_HEIGHT = Dimensions.get("window").height;

    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

    const radius = 48;
    const strokeWidth = 6;
    const circumference = 2 * Math.PI * radius;

    const percent = 70

    const progress = circumference - (circumference * percent) / 100;

    useEffect(() => {
        const onBackPress = () => {

            if (penditnActionBottomSheet) {
                setPendingActionSheet(false);
                return true;
            }
            navigation.goBack();
            return true;
        }

        const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

        return () => backHandler.remove();
    }, [navigation, penditnActionBottomSheet])

    const fetchCustomerDetail = () => {
        customerDetails(loginContext.getToken).then(r => {
            console.log(r.data)
            context.updateCustomer(r.data)
            storeData(CUSTOMERDETAIL, JSON.stringify(r.data))

            storeData(CUSTOMERINITIALS, r.data.initials)
            if (r.data.profilePic != null) {
                storeData(CUSTOMERPROFILEPIC, r.data.profilePic)
            }
        }).catch(error => {
            console.log(error)
        })
    }


    useEffect(() => {
        fetchCustomerDetail();
    }, [context.getHostelDetail, loginContext.getToken])

    const onRefresh = async () => {
        setRefreshing(true);
        fetchCustomerDetail();
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);


    };


    const openSheet = () => {
        Animated.timing(translateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }

    const closeSheet = () => {
        Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 250,
            useNativeDriver: true,
        }).start(() => setPendingActionSheet(false));
    }

    useEffect(() => {
        if (penditnActionBottomSheet) {
            openSheet();
        }
    }, [penditnActionBottomSheet]);

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gesture) => gesture.dy > 10,

            onPanResponderMove: (_, gesture) => {
                if (gesture.dy > 0) {
                    translateY.setValue(gesture.dy);
                }
            },

            onPanResponderRelease: (_, gesture) => {
                if (gesture.dy > 120) {
                    closeSheet();
                } else {
                    openSheet();
                }
            }
        })
    ).current;

    //  const panResponder = useRef(
    //       PanResponder.create({
    //           onMoveShouldSetPanResponder: (_, g) => g.dy > 10,
    //           onPanResponderMove: (_, g) => {
    //               if (g.dy > 0) translateY.setValue(g.dy);
    //           },
    //           onPanResponderRelease: (_, g) => {
    //               if (g.dy > 150) {
    //                  closeSheet();
    //               } else {
    //                   Animated.spring(translateY, {
    //                       toValue: 0,
    //                       useNativeDriver: true,
    //                   }).start();
    //               }
    //           },
    //       })
    //   ).current;




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
        console.log(loginContext)

        const data = {
            xuid: loginContext.getUserId,
        }

        logoutSetup(data, loginContext.getToken).then(r => {
            console.log(r)
        })
        storeData(LOGGEDOUT, "true")
        loginContext.logout('false')
        // remoteData(ACCESS_TOKEN)
        // remoteData(PHONE_NO) 
        storeData(LOGGEDIN, "false")
        // loginContext.updateToken(null)
        NotificationModule.logout();



        // navigation.navigate("SplashScreen");
    }

    const HostelClick = () => {
        navigation.navigate('ProfileHostels')
    }




    const handleBack = () => navigation.goBack();

    const handleKyc = async () => {

        const res = await verifyNowKyc(loginContext.getToken)

        const accessTokenId = res?.data?.accessTokenId;
        const entityId = res?.data?.entityId;
        const tenantMobileNo = res?.data?.tenantMobile;

        console.log(accessTokenId)
        console.log(entityId)
        console.log(tenantMobileNo)

        if (res?.status === 200) {
            CommonModule.verifyKyc(tenantMobileNo, entityId, accessTokenId)
        } else {
            console.log(res.message)
            setShowSuccessModal(true)
            setShowSuccessMessage(res?.message || "Something Failed")
            setShowModalType("error")

            setTimeout(() => {
                setShowSuccessModal(false)
            }, 1000);
        }
    }

    if (refreshing) {
        return <View style={{ flex: 1, backgroundColor: '#fff' }} >
            <LinearGradient
                colors={["#c0e3ff", "#FFFFFF"]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={{ width: "100%", height: "25%" }}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <ActivityIndicator size="large" color="#1E45E1" />
                </View>
            </LinearGradient>
        </View>;
    }
    return (

        <View style={styles.container}>
            <SuccessModal
                visible={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                message={showSuccessMessage}
                type={showModalType} />

            <ScrollView contentContainerStyle={styles.scrollContainer}
                refreshControl={<RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh} />}>

                <View>
                    <LinearGradient
                        colors={["#c0e3ff", "#FFFFFF"]}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                        style={{ width: "100%", }}
                    >
                        <View style={{ paddingHorizontal: 20, paddingTop: 10, }}>

                            {/* Header */}
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                                    <Image source={LeftArrow} style={{ height: 25, width: 25 }} />
                                </TouchableOpacity>
                            </View>

                            {/* Profile */}
                            <View style={{ alignItems: 'center', marginTop: 10 }}>
                                {context.getCustomerDetail?.profilePic ? (
                                    <Image
                                        source={{ uri: context.getCustomerDetail?.profilePic }}
                                        style={styles.profileImage}
                                    />
                                ) : (
                                    <View style={[styles.profileImage, styles.initialContainer]}>
                                        <Text style={styles.initialText}>
                                            {context.getCustomerDetail?.initials}
                                        </Text>
                                    </View>
                                )}
                            </View>

                            {/* Name */}
                            <View style={{ alignItems: 'center', marginTop: 20, paddingHorizontal: 30 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.profileName} numberOfLines={1}>
                                        {context.getCustomerDetail?.firstName}{" "}
                                        {context.getCustomerDetail?.lastName}
                                    </Text>
                                    <Image source={VerifyIcon} style={{ marginLeft: 4, height: 20, width: 20, tintColor: '#1E45E1' }} />
                                </View>

                                {/* Info */}

                                <View style={styles.infoRow}>
                                    <View style={styles.FloorBadgePending}>
                                        <Image
                                            source={Building}
                                            style={{ height: 18, width: 18, marginRight: 2 }}
                                            resizeMode="contain"
                                        />
                                        <Text numberOfLines={1} ellipsizeMode="clip"
                                            style={{ fontSize: 14, color: 'black', textAlign: 'center', fontFamily: 'Gilroy-Medium', flexShrink: 1 }}>
                                            {context.getCustomerDetail?.bookingDetails?.floorName}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                        <Image
                                            source={RoomIconNew}
                                            style={{ height: 18.5, width: 18.5, marginRight: 4 }}
                                            resizeMode="contain"
                                        />
                                        <Text style={{ flexShrink: 1, fontFamily: 'Gilroy-Medium' }}
                                            numberOfLines={2}
                                            ellipsizeMode="tail">{context.getCustomerDetail?.bookingDetails?.roomName}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                        <Image
                                            source={BedIconNew}
                                            style={{ height: 19, width: 19, marginRight: 4 }}
                                            resizeMode="contain"
                                        />
                                        <Text style={{ flexShrink: 1, fontFamily: 'Gilroy-Medium' }}
                                            numberOfLines={2}
                                            ellipsizeMode="tail">{context.getCustomerDetail?.bookingDetails?.bedName}</Text>
                                    </View>


                                </View>

                            </View>

                        </View>
                    </LinearGradient>


                    <View style={{ paddingTop: 20, paddingHorizontal: 20 }}>

                        {context.getCustomerDetail?.kyc?.currentStatus != "VERIFIED" && (

                            <View style={{
                                borderRadius: 12, borderWidth: 1, borderColor: "#DCDCDC", padding: 20, marginTop: 12, elevation: 2,
                                shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.08, shadowRadius: 4, backgroundColor: '#ffffff'
                            }}>

                                <Image source={MessageDocIcon} style={{ width: 92, height: 51 }} />
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 11 }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 15, fontFamily: 'Gilroy-Medium', color: '#000000', flexShrink: 1 }}>
                                            Complete your KYC Verification</Text>

                                        <Text style={{ fontSize: 11, fontFamily: 'Gilroy-Regular', color: '#4B4B4B', flexShrink: 1, marginTop: 8, lineHeight: 16 }}>
                                            Enter your Aadhar/PAN Documents and Complete the status</Text>

                                    </View>




                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12, alignItems: 'center' }}>
                                    {/* <View style={{backgroundColor:'#E5FFE0',paddingHorizontal:2.5,paddingVertical:2,borderRadius:5}}>
                                    <Text style={{fontSize:12,fontFamily:'Gilroy-Regular',color:'#00A32E'}}>
                                       ↑  50 %</Text>
                                </View> */}

                                    <TouchableOpacity onPress={handleKyc}
                                        style={{
                                            backgroundColor: '#1E45E1', paddingHorizontal: 22, paddingVertical: 10,
                                            borderRadius: 8, flexDirection: 'row', alignItems: 'center'
                                        }}>
                                        <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Semibold', color: '#ffffff' }}>Verify now</Text>
                                        <Image source={RightArrow} style={{ width: 14.06, height: 14.06, marginLeft: 5 }} />
                                    </TouchableOpacity>
                                </View>

                            </View>
                        )}





                        <View style={styles.cards}>

                            <TouchableOpacity onPress={HostelClick} style={styles.row}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={buildings} style={{ width: 25, height: 25 }} />
                                    <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Medium', marginLeft: 5 }}>
                                        Hostels</Text>
                                </View>

                                <Image source={sideframe} style={{ width: 23, height: 23 }} />
                            </TouchableOpacity>

                            {/* <View style={styles.divider} /> */}

                            <TouchableOpacity onPress={() => navigation.navigate("AccountDetails", { customer: context.getCustomerDetail })}
                                style={[styles.row, { marginTop: 30 }]}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={UserAccountDetails} style={{ width: 25, height: 25 }} />
                                    <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Medium', marginLeft: 5 }}>
                                        Account Details</Text>
                                </View>

                                <Image source={sideframe} style={{ width: 23, height: 23 }} />
                            </TouchableOpacity>

                            {
                                context.getCustomerDetail?.bookingDetails?.currentStatus != "BOOKED" && (
                                    <>
                                        {/* <View style={styles.divider} /> */}

                                        <TouchableOpacity onPress={() => navigation.navigate('ComingSoonPage')} style={[styles.row, { marginTop: 30 }]}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Image source={paperclip} style={{ width: 25, height: 25 }} />
                                                <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Medium', marginLeft: 5 }}>Rental Agreement</Text>
                                            </View>

                                            <Image source={sideframe} style={{ width: 23, height: 23 }} />
                                        </TouchableOpacity>
                                    </>

                                )
                            }

                            <TouchableOpacity onPress={() => navigation.navigate("Privacy&Security")}
                                style={[styles.row, { marginTop: 30 }]}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={UserAccountDetails} style={{ width: 25, height: 25 }} />
                                    <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Medium', marginLeft: 5 }}>
                                        Privacy & Security</Text>
                                </View>

                                <Image source={sideframe} style={{ width: 23, height: 23 }} />
                            </TouchableOpacity>

                        </View>
                    </View>
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
                <View style={styles.divider} />
                <View style={{ paddingHorizontal: 20, marginLeft: 5 }}>
                    <View style={styles.helpRow}>
                        <Image source={InfoIcon} resizeMode="contain" style={{ width: 20, height: 20 }} />
                        <Text style={styles.helpText}>Help & Information</Text>
                    </View>

                    <View style={{ marginTop: 20, }}>
                        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                            <Image source={LogoutIcon} resizeMode="contain" style={{ width: 25, height: 25, transform: [{ rotate: '180deg' }] }} />
                            <Text style={styles.logoutText}>Logout</Text>
                        </TouchableOpacity>
                    </View>

                </View>

            </ScrollView>

            {
                penditnActionBottomSheet && (
                    <View style={styles.overlay}>
                        <Pressable
                            style={StyleSheet.absoluteFillObject}
                            onPress={closeSheet}
                        />

                        <Animated.View
                            {...panResponder.panHandlers}
                            style={[styles.sheet,
                            {
                                transform: [{ translateY }]
                            }]}>


                            <View style={styles.dragindictor} />

                            <View style={{ marginTop: 5, marginBottom: 20 }}>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 20, fontFamily: 'Gilroy-Semibold' }}>Pending Action</Text>

                                    <TouchableOpacity onPress={closeSheet}>
                                        <Image source={CloseIcon} style={{ width: 22, height: 22 }} />
                                    </TouchableOpacity>
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 18, justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium' }}>Profile completed</Text>
                                    <Text style={{
                                        fontSize: 12, fontFamily: 'Gilroy-Medium', paddingVertical: 3, backgroundColor: '#FFF4DD',
                                        paddingHorizontal: 10, color: '#FF9900', borderRadius: 14.5
                                    }}>
                                        {percent}%</Text>
                                </View>

                                <View style={styles.progressContainer}>
                                    <View style={[styles.progressFill, { width: `${percent}%` }]} />
                                </View>

                                <View style={{ width: '100%', borderWidth: 0.8, borderColor: '#E5E7EB', marginTop: 20, marginBottom: 10 }} />

                                <TouchableOpacity onPress={handleEditProfile}
                                    style={styles.touchableAction}>
                                    <Text style={styles.actionText}>Update profile</Text>
                                    <Image source={GreenAddIcon} style={{ width: 24, height: 24 }} />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => navigation.navigate("ComingSoonPage")}
                                    style={styles.touchableAction}>
                                    <Text style={styles.actionText}>Kyc Verification</Text>
                                    <Image source={GreenAddIcon} style={{ width: 24, height: 24 }} />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => navigation.navigate('ComingSoonPage')}
                                    style={styles.touchableAction}>
                                    <Text style={styles.actionText}>Rental Aggrement</Text>
                                    <Image source={GreenAddIcon} style={{ width: 24, height: 24 }} />
                                </TouchableOpacity>

                            </View>

                        </Animated.View>

                    </View>
                )
            }

        </View>
    );
};

export default CustomerProfileNew;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 20,
    },
    scrollContainer: {
        // padding: 20,
        paddingBottom: 50,
        flexGrow: 1,
        // justifyContent: "space-between"
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
        flex: 1,
        justifyContent: 'center', alignItems: 'center'
    },
    profileRow: {
        flexDirection: "row",
        flex: 1,
        marginTop: 15, alignItems: 'center',
    },
    profileImage: {
        width: 82,
        height: 82,
        borderRadius: 41,
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
        marginLeft: 5,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        flex: 1,
        marginTop: 10,
        backgroundColor: '#F3F5FF', paddingHorizontal: 10,
        paddingVertical: 5, borderRadius: 12
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
        // backgroundColor: "rgba(255, 239, 207, 1)",
        // paddingVertical: 4,
        // paddingHorizontal: 5,
        // borderRadius: 20,
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row'
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
        padding: 5,
        // borderRadius: 12,
        // borderWidth: 1,
        borderColor: "#eee",
        marginBottom: 12,
        marginTop: 30
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
        marginVertical: 12, marginHorizontal: 14,

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
        fontFamily: 'Gilroy-Regular',
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
        fontFamily: 'Gilroy-Semibold', fontSize: 14,
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
        alignItems: "center",
        justifyContent: "left",
        marginTop: 20,
        gap: 5,
    },
    helpText: {
        color: "#4B4B4B", fontSize: 16,
        fontFamily: 'Gilroy-Medium', marginLeft: 7
    },
    logoutButton: {
        width: "100%",
        flexDirection: "row",
        paddingVertical: 15,
        alignItems: 'center',
        // borderTopWidth: 1,
        // borderColor: "#eee",
        // backgroundColor: "#FFF0F0",
        // paddingLeft: 5,
        borderRadius: 7
    },
    logoutText: {
        // color: "#ff3b30",
        fontFamily: 'Gilroy-Medium', fontSize: 16,
        marginLeft: 7,
    },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
        zIndex: 999
    },
    sheet: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 16,
        maxHeight: "90%",
        overflow: 'hidden'
        // dynamic height limit
    },
    dragindictor: { width: 50, height: 4, backgroundColor: "#ccc", borderRadius: 2, alignSelf: "center", marginBottom: 10 },
    progressContainer: {
        width: "100%",
        height: 6,
        backgroundColor: "#E6E6E6",
        borderRadius: 10,
        overflow: "hidden",
        marginTop: 12
    },

    progressFill: {
        height: "100%",
        backgroundColor: "#F58B00",
        borderRadius: 10
    },
    touchableAction: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: '#F9FAFB', paddingVertical: 10, marginTop: 10, borderRadius: 10,
        paddingHorizontal: 10
    },
    actionText: {
        fontSize: 16, fontFamily: 'Gilroy-Semibold'
    }

});

import React, { useState, useMemo, useCallback, useRef, useEffect, useContext } from "react";
import {
  View, Text, Dimensions, Image, TouchableOpacity, Button, FlatList,
  TextInput, StyleSheet, BackHandler, TouchableWithoutFeedback, Platform, PanResponder,
  Animated, ScrollView, Alert, KeyboardAvoidingView, Keyboard
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import MyStay from '../DashboardPage/MyStay';
import Services from '../DashboardPage/Services'
import Payment from '../Payment'
import Building from '../../assets/Images/buildin.png'
import Location from '../../assets/Images/location.png'
import Flash from '../../assets/Images/flash.png'
import MobilePayment from '../../assets/Images/payment.png'
import Edit from '../../assets/Images/edit.png'
import Delete from '../../assets/Images/trash.png'
import Trash from '../../assets/Images/trash 01.png'
import CommentMesg from '../../assets/Images/commentMessage.png'
import Group from '../../assets/Images/Group.png'
import Customer from "../../assets/Images/Customer_Icon.png"
import SendButton from '../../assets/Images/Send.png'
import Ionicons from 'react-native-vector-icons/Ionicons'
import CameraPic from '../../assets/Images/cameraPic.png'
import { launchImageLibrary } from "react-native-image-picker";
import Exclamation from '../../assets/Images/exclamation.png'
import DeleteIcon from '../../assets/Images/deleteIcon.png'
import HostelProfile from "../../assets/Images/Group 1.png"
import { addComment, complaints, deleteComplaint, getAmenties, getComplaints, getComplaintTypes, getInvoices, hostelDetails, postRequestBedChange, postRquestAmenties } from "../../Action/HostelAction";
import { customerDetails, postComplaint } from "../../Action/CustomerAction";
import { UsersContext } from "../../Context/UserContext";
import { LoginContexts } from '../../Context/LoginContext'
import SuccessModal from "../ToastFile/TostFilePage";
import DownloadSide from "../../assets/Images/downloadSide.png"
import DownloadIcon from "../../assets/Images/download.png"
import DownloadBlueIcon from "../../assets/Images/download_Blue.png";
import ShareIcon from "../../assets/Images/Union.png";
import PaidIcon from "../../assets/Images/Checkboxes.png";
import ViewIcon from "../../assets/Images/view.png";
import ArrowRightIcon from "../../assets/Images/arrow-right.png";
import LinearGradient from "react-native-linear-gradient";
import { compliantContexts } from "../../Context/ComplaintContext";
import { paymentContexts } from "../../Context/PaymentContext";
import EditComplaintSheet from "./BottomSheet/EditComplaint";
import FilterPayments from "./BottomSheet/filterPayments";
import RequestBedChange from "./BottomSheet/RequestBed";
import AddComplaint from "./BottomSheet/AddComplaint";
import { SafeAreaView } from "react-native-safe-area-context";
import ReceiptPic from "../../assets/Images/ReceiptPic.png"
import AmenitiesBottomSheet from "./BottomSheet/AmenitiesSheet";
import ReopennComplaint from "./Popup/ReopenComplaint";

const { width, height } = Dimensions.get("window");

function Dashboard(props) {

  const context = useContext(UsersContext)
  const loginContext = useContext(LoginContexts)
  const complaintContext = useContext(compliantContexts)
  const paymentContext = useContext(paymentContexts)
  const { width } = Dimensions.get('window');

  const navigation = useNavigation();
  const [index, setindex] = useState(0);
  const [selectedComplaint, setSelectComplaint] = useState(null);
  const [comment, setComment] = useState(false)
  const [imageid, setimageid] = useState();
  const [selectedValue, setSelectedValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [mediaimage, setmediaImage] = useState([])
  const [tag, setTag] = useState(null);
  const [showAmenities, setShowAmenities] = useState(false)
  const [myAmenitis, setmyAminites] = useState(null)
  const [available, setAvailable] = useState(null)
  const [showPopUp, setShowPopUp] = useState(false)
  const [selectedReason, setSelectedReason] = useState(null);
  const [monthlyplan, setPlan] = useState();
  const [deletevisible, setdeleteVisible] = useState(false)
  const [complaintDescription, setDespriction] = useState()
  const [imageuri, setImageuri] = useState([])
  const [changeBed, setChangeBed] = useState(null);
  const [bedType, setBedType] = useState(null)
  const [urgencyType, setUrgencyType] = useState(null)
  const [complaintId, setComplaintId] = useState()
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [toastMessage, setToastMessage] = useState()
  const [modelType, setModelType] = useState()
  const [showSheet, setShowSheet] = useState(false)
  const [addComplaints, setAddComplaint] = useState(false)
  const [showBedChange, setShowBedChange] = useState(false)
  const [editCompliant, setShowEditComplaint] = useState(false)
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [sendComment, setSendComment] = useState(null)
  const [complaintType, setComplaintTypes] = useState([])
  const [selectedComplaintTypeId, setSelectedComplaintTypeId] = useState(0);
  const [editCompliantBottomsheet, setEditCompliantBottomSheet] = useState(false);
  const [showDownloadOption, setShowOption] = useState(false)
  const [selected, setSelected] = useState("invoice");
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [filterBottomsheet, setFilterBottomSheet] = useState(false)
  const [showVisible, setShowVisible] = useState(false);
  const[reopenComplaint,setReopenComplaint]=useState(false)



  const sheetY = useRef(new Animated.Value(500)).current;
  const keyboardY = useRef(new Animated.Value(0)).current;



  const refundable = [{ list: "Last Rent paid(30 days", amount: "2400" }, { list: "Actual stay days", amount: "4000" }]

  const visible = showSheet || addComplaints || showBedChange || editCompliantBottomsheet || showAmenities ||
    modalVisible || showDownloadOption || filterBottomsheet

  useEffect(() => {
    if (showSheet || addComplaints || showBedChange || editCompliantBottomsheet || showAmenities ||
      modalVisible || showDownloadOption || filterBottomsheet) {
      setTimeout(() => {

        Animated.timing(sheetY, {
          toValue: visible ? 0 : 500,
          duration: 250,
          useNativeDriver: true,
        }).start();
      },);
    }
  }, [showSheet, addComplaints, showBedChange, editCompliantBottomsheet,
    showAmenities, modalVisible, showDownloadOption, filterBottomsheet]);

  useEffect(() => {
    const backAction = () => {

      if (showBedChange || addComplaints || showSheet || editCompliantBottomsheet || showDownloadOption ||
        showAmenities || modalVisible || filterBottomsheet || reopenComplaint) {
        setShowBedChange(false);
        setAddComplaint(false);
        setShowSheet(false);
        setShowAmenities(false);
        setModalVisible(false);
        setShowOption(false)
        setEditCompliantBottomSheet(false)
        setComment(false)
        setSendComment(null)
        setFilterBottomSheet(false)
        setReopenComplaint(false)
        return true;
      }

      if (index > 0) {
        setindex(index - 1);
        return true;
      }

      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [
    index,
    showBedChange,
    addComplaints,
    showSheet,
    editCompliantBottomsheet,
    showDownloadOption,
    showAmenities,
    modalVisible,
    comment,
    filterBottomsheet,
    reopenComplaint,
  ]);


  function onClose() {
    Keyboard.dismiss();
    Animated.timing(sheetY, {
      toValue: 0,
      duration: 230,
      useNativeDriver: true,
    }).start(() => {
      setShowSheet(false); setSelectComplaint(null);
      setComment(false); setAddComplaint(false);
      setmediaImage([]); setSelectedValue(null);
      setDespriction(null); setImageuri([]);
      setShowBedChange(false); setShowEditComplaint(false);
      setShowAmenities(false); setAvailable(null);
      setmyAminites(null); setModalVisible(false)
      setSendComment(null); setChangeBed(null)
      setBedType(null); setUrgencyType(null)
      setSelectedComplaintTypeId(0); setPlan(null)
      setShowOption(false); setEditCompliantBottomSheet(false);
      setFilterBottomSheet(false)
    });
  }

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 6,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) sheetY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) {
          onClose();
        } else {
          Animated.spring(sheetY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });

    const hide = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);




  useEffect(() => {

    getComplaintTypes(context.getHostelDetail.hostelId, loginContext.getToken).then(r => {
      console.log(r)
      setComplaintTypes(r.data)
    })

    customerDetails(loginContext.getToken).then(r => {
      console.log(r.data)
      context.updateCustomer(r.data)
    }).catch(error => {
      console.log(error)
    })
  }, [])



  // const openEdit = () => setEditCompliantbot(true);
  const closeEdit = () => setEditCompliantBottomSheet(false);


  const handleNotificationShow = () => {
    navigation.navigate("Notification");
  };

  const handleProfile = () => {
    navigation.navigate("CustomerProfile");
  };

  const handle = (complaint) => {


    setShowSheet(true)

    getComplaints(context.getHostelDetail.hostelId, complaint.complaintId, loginContext.getToken).then(r => {
      console.log(r.data)
      setSelectComplaint(r.data)
      console.log(r.data)
      complaintContext.updateComplaint(r.data)
      complaintContext.updateComments(r.data?.comments)
    })
  }

  const commentclick = () => {
    setComment(true)
  }

  const imageclick = (id) => {
    setdeleteVisible(true)
    setimageid(id)
  }

  const sendclick = () => {

    const data = {
      message: sendComment,
      hostelId: context.getHostelDetail.hostelId
    }

    console.log(selectedComplaint)

    addComment(selectedComplaint?.complaintId, loginContext.getToken, data).then(r => {
      console.log(r)
      setSendComment(null)

      getComplaints(context.getHostelDetail.hostelId, selectedComplaint?.complaintId, loginContext.getToken).then(r => {
        setSelectComplaint(r.data)
        complaintContext.updateComments(r.data?.comments)
      })

    })
  }


  // ------Add complaint

  const addComplaint = () => {
    setAddComplaint(true)
  }

  const onCloseAddComplaint = () => {
    setAddComplaint(false)
  }

  const uploadimage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaTypes: 'photo',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      setmediaImage([...mediaimage, result.assets[0].uri])
      setImageuri([...imageuri, result.assets[0]])
    } catch (error) {
      console.log(error)

    }
  }



  // ----Delete complaint click-----

  const deleteClick = (complaintId) => {
    setShowPopUp(true)
    setComplaintId(complaintId)
  }
  const deleteClose = () => {

    setShowPopUp(false)
    setSelectedReason(null)
  }

  const reasons = [
    "Issue already getting solved",
    "Complaint raised by mistake",
    "Not required now",
    "I’ll raise a new request instead",
    "Other",
  ];

  const cancel = () => {
    setShowPopUp(false)
    setSelectedReason(null)
  }
  const deleteItem = (complaintiId) => {

    deleteComplaint(context.getHostelDetail.hostelId, complaintiId, loginContext.getToken, selectedReason).then(r => {
      console.log(r)
      if (r.status == 200) {
        setShowSuccessModal(true);

        setTimeout(() => {
          setShowSuccessModal(false);
          setShowPopUp(false)
          setSelectedReason(null)
          setShowSheet(false)

          complaints(context.getHostelDetail.hostelId, loginContext.getToken).then(r => {
            complaintContext.updateComplaintList(r?.data?.content)
          })
        }, 2000);

      }
    })
  }

  // -------Request bed change-----

  const bedfn = () => {
    setShowBedChange(true)
  }

  const onCloseBedChange = () => { setShowBedChange(false) }

  // ---------Amenities----------

  const handleAmenity = (item, tag) => {
    console.log(item.amenityId)
    if (tag == 'My-Amenities') {
      setShowAmenities(true)
      setTag(tag)

      getAmenties(context.getHostelDetail.hostelId, item.amenityId, loginContext.getToken).then(r => {
        console.log(r)
        setmyAminites(r.data)
      })

    }
    else {
      setShowAmenities(true)
      setTag(null)
      getAmenties(context.getHostelDetail.hostelId, item.amenityId, loginContext.getToken).then(r => {
        console.log(r)
        setAvailable(r.data)
      })

    }
  }

  // ------Payment---------

  const viewPay = (item) => {
    console.log("item", item);

    setSelectedPayment(item);
    setModalVisible(true);

    getInvoices(context.getHostelDetail.hostelId, item.invoiceId, loginContext.getToken).then(r => {
      console.log(r)

      paymentContext.updateInvoice(r.data)
    })
  };

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

  const handleReceiptPdfDownload = (invoiceType) => {
    if(invoiceType === "Booking"){
      navigation.navigate("BookingInvoice");
    }
    else{
        navigation.navigate("InvoiceDesign");
    }
    
  };

  const handlePaymentReceipt = (transcationId,invoiceType) => {

    console.log(transcationId)
    if(invoiceType === "Booking"){
         navigation.navigate('BookingReceipt', { transcationId: transcationId })
    }
    else{
        navigation.navigate('ReceiptPdfView', { transcationId: transcationId })
    }
    
  }

  const downloadOption = () => {
    setShowOption(true)
  }

  const filterpay = () => {
    setFilterBottomSheet(true)
  }

  // ---------------------------
  const routes = [{ key: 'mystay', title: 'MyStay', icon: Building }, { key: 'services', title: 'Services', icon: Flash }, { key: 'payment', title: 'Payment', icon: MobilePayment }]
  const renderTabBar = props => (<TabBar {...props}
    indicatorStyle={{ backgroundColor: '#0227B5' }} style={{ backgroundColor: '#ffffff' }}
    inactiveColor="black"
    activeColor="blue"
    renderLabel={({ route, color }) => (<Text style={{ color: color }}>
      {route.title}
    </Text>)} />)

  const renderScene = ({ route, jumpTo }) => {
    switch (route.key) {
      case 'mystay':
        return <MyStay onRequestBedChange={bedfn} hostel={props?.route?.params?.hostel} jumpTo={jumpTo} />;
      case 'services':
        return <Services onOpen={handle} onSheet={addComplaint} onAmenities={handleAmenity} jumpTo={jumpTo} hostel={props?.route?.params?.hostel} />;
      case 'payment':
        return <Payment onPayment={viewPay} onFilterPayment={filterpay} hostel={props?.route?.params?.hostel} jumpTo={jumpTo} />;
      default:
        return null;
    }
  };

  // ----------

  console.log(paymentContext.getInvoiceDetail)



  return <SafeAreaView style={style.mainDashb}>

    <LinearGradient
      colors={["#DAEEFF", "#FFFFFF"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ paddingTop: 10, width: "100%", height: Platform.OS == "android" ? 90 : 130 }}
    >
      <View >
        <View style={{ flexDirection: 'row', paddingLeft: 16, paddingRight: 10 }}>

          <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>

            {context.getHostelDetail?.hostelPic ? (
              <Image
                source={{ uri: context.getHostelDetail.hostelPic }}
                style={style.hostelImage} />
            ) : (
              <View style={[style.hostelImage, style.initialContainer]}>
                <Text style={style.initialText}>
                  {context.getHostelDetail.hostelInitial}
                </Text>
              </View>
            )}

            <View style={{ paddingLeft: 2, flex: 1 }}>
              <Text numberOfLines={1} ellipsizeMode="tail"
                style={{ fontSize: 18, fontWeight: '600', fontFamily: 'gilroy-semibold', color: '#1B1D21', flexShrink: 1 }}>
                {context.getHostelDetail?.hostelName}
                {/* maxWidth: '90%' */}
              </Text>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={Location} style={{ width: 16, height: 16 }} />
                <Text style={{ marginLeft: 7, fontSize: 14, color: '#4B4B4B' }}>
                  {context.getHostelDetail.city}
                </Text>
              </View>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={handleNotificationShow} style={{ marginRight: 10 }}>
              <Image source={require("../../assets/Images/notification.png")} style={{ height: 50, width: 50 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleProfile}>
              {context.getCustomerDetail?.profilePic ? (
                <Image
                  source={{ uri: context.getCustomerDetail?.profilePic }}
                  style={style.hostelImage} />
              ) : (
                <View style={[style.hostelImage, style.initialContainer]}>
                  <Text style={style.initialText}>
                    {context.getCustomerDetail?.initials}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

    </LinearGradient>

    <View style={{ flex: 1, paddingLeft: 20, paddingRight: 20, }}>
      <TabView navigationState={{ index: index, routes }}
        commonOptions={{
          icon: ({ route, color }) => (<Image source={route.icon} style={{ width: 21.12, height: 21.12, tintColor: color }} />)
        }}
        renderTabBar={renderTabBar}
        renderScene={renderScene}
        onIndexChange={setindex}
        initialLayout={{ width: Dimensions.get('window').width }}
        style={{ flex: 1, justifyContent: 'center' }} />

    </View>

    {showSheet && (
      <View style={style.sheetOverlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>

        <Animated.View style={[selectedComplaint?.images?.length > 0 ? style.bottomSheetwithimage : style.bottomSheet, { transform: [{ translateY: sheetY }], paddingBottom: keyboardHeight }]}
          {...panResponder.panHandlers}>

          {/* { transform: [{ translateY: sheetY }] } */}

          <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
            <View {...panResponder.panHandlers}>
              <View style={style.dragindictor} />
            </View>

            {comment ? (
              <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: 400 }}>Comments</Text>
                  {/* Divider */}
                  <View style={{ height: 1, backgroundColor: "#eee", marginVertical: 10 }} />

                  {complaintContext?.getComplaintComments?.length > 0 ?
                    <FlatList keyExtractor={(item) => item.commentId} showsVerticalScrollIndicator={false}
                      keyboardShouldPersistTaps="handled"
                      data={complaintContext?.getComplaintComments} style={{ marginBottom: 20 }}
                      renderItem={({ item }) => {
                        return <View style={{ paddingTop: 15, flexDirection: 'row', flex: 1 }}>
                          <View>
                            {item.profileUrl != null ? (
                              <Image source={{ uri: item.profileUrl }} style={{ width: 36, height: 36, borderRadius: 18 }} />
                            ) : (
                              <View style={{
                                width: 36,
                                height: 36, borderRadius: 18, backgroundColor: '#eef1ff', justifyContent: 'center',
                                alignItems: 'center',
                              }} key={item.commentId}>
                                <Text style={{ color: '#788fed', fontSize: 14, fontWeight: 'bold', }}>
                                  {item.initials}</Text>
                              </View>
                            )}
                            {/* <Image source={Customer} style={{ width: 35, height: 35 }} /> */}
                          </View>
                          <View style={{ paddingLeft: 10, flex: 1 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                              <Text style={{ fontSize: 12, color: '#4B4B4B', fontWeight: 400 }}>{item.userName}</Text>
                              <Text style={{ fontSize: 10, fontWeight: 400, color: '#6E6E6E' }}>{item.commentDate}</Text>
                            </View>
                            <Text style={{ fontSize: 14, fontWeight: 400, marginTop: 5 }}>{item.comment}</Text>
                          </View>
                        </View>
                      }} />
                    :
                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                      <Text style={{ fontSize: 16, fontWeight: 600 }}>No Comments Yet</Text>
                      <Text style={{ fontSize: 14, fontWeight: 400, color: '#8E8E93', marginTop: 5 }}>
                        Start Your Conversation
                      </Text>
                    </View>}
                </View>


                <View style={{ paddingBottom: 20 }}>
                  <View style={{ paddingTop: 3, paddingBottom: 4, borderWidth: 1, borderColor: '#C3CFFF29', backgroundColor: '#f4f7fe', borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TextInput value={sendComment} placeholder="Post your Reply here" onChangeText={setSendComment}
                      multiline
                      blurOnSubmit={false}
                      style={{ flex: 1 }} />
                    {
                      sendComment && <TouchableOpacity onPress={sendclick} style={{ paddingRight: 10 }}>
                        <Image source={SendButton} style={{ width: 34, height: 34 }} />
                      </TouchableOpacity>
                    }

                  </View>

                </View>

              </View>
            ) : (
              <View style={{ flex: 1 }}>
                {complaintContext.getComplaintDetail && (
                  <ScrollView style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                  >
                    <View style={{marginBottom:10}} >
                      <View >
                        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingLeft: 5, paddingRight: 8, marginBottom: 10, paddingTop: 10, }}>
                          <View>
                            <Text style={{ fontSize: 18, fontWeight: "500", fontFamily: "gilroy-semibold", }} >
                              {complaintContext.getComplaintDetail?.complaintTypeName}
                            </Text>
                            <Text style={{ fontSize: 12.8, fontWeight: "400", color: "#424242", marginTop: 6 }}>
                              {complaintContext.getComplaintDetail?.complaintDate}
                            </Text>
                          </View>

                          <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <TouchableOpacity onPress={() => { setEditCompliantBottomSheet(true) }} style={{ paddingRight: 10 }}>
                              <Image source={Edit} style={{ width: 17.72, height: 17.72 }} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => deleteClick(selectedComplaint.complaintId)} style={{ paddingLeft: 10 }}>
                              <Image source={Delete} style={{ width: 17.72, height: 17.72 }} />
                            </TouchableOpacity>
                          </View>
                        </View>

                        <View style={{ height: 1, backgroundColor: "#eee", marginVertical: 10 }} />

                        <View style={{ paddingTop: 5 }}>
                          <Text style={{ fontSize: 12, fontWeight: "400", color: "#4B4B4B" }}>Description </Text>
                          <Text style={{ fontSize: 16, fontWeight: "400", marginTop: 9 }}>
                            {complaintContext.getComplaintDetail?.description}
                          </Text>
                        </View>

                        <View style={{ paddingTop: 10 }}>
                          <Text style={{ fontSize: 12, fontWeight: "400", color: "#4B4B4B" }}> Assigned to</Text>

                          <View style={{ flexDirection: "row", justifyContent: "space-between", paddingTop: 8, }}>
                            {complaintContext.getComplaintDetail?.assigneeName != "Unassigned" ? <Text style={{ fontSize: 15, fontWeight: "500" }}>
                              {complaintContext.getComplaintDetail?.assigneeName}</Text>
                              : <Text style={{ fontSize: 14, fontWeight: "500", color: "#FF3B30", }}>
                                Not Assigned Yet
                              </Text>
                            }

                            {complaintContext.getComplaintDetail?.assigneeMobileNumber != null ?
                              <Text style={{ fontSize: 12, color: "#1E45E1", fontWeight: "400" }}>
                                {complaintContext.getComplaintDetail?.assigneeMobileNumber}
                              </Text> : null}
                          </View>
                        </View>

                        {/* ATTACHED IMAGES */}
                        <View style={{ paddingTop: 15 }}>
                          <Text style={{ fontSize: 12, fontWeight: "400", color: "#4B4B4B" }}> Attached images</Text>

                          <FlatList horizontal
                            style={{ paddingTop: 15 }}
                            keyExtractor={(item) => item.id.toString()}
                            data={complaintContext.getComplaintDetail?.images}
                            renderItem={({ item }) => {
                              return <View key={item.id}
                                style={{ paddingLeft: 10, position: "relative" }}>

                                <TouchableOpacity onPress={() => imageclick(item.id)}>
                                  <Image source={{ uri: item.imageUrl }} style={{ width: 90, height: 70, borderRadius: 5 }} />
                                  {imageid === item.id && deletevisible && (
                                    <TouchableOpacity style={{ position: "absolute", bottom: 25, right: 35, }} >
                                      <Image source={Trash} style={{ width: 21.09, height: 21.09, }} />
                                    </TouchableOpacity>
                                  )}
                                </TouchableOpacity>
                              </View>
                            }}
                          />

                        </View>
                      </View>


                      {["ASSIGNED", "assigned"].includes(complaintContext.getComplaintDetail?.status) ?
                        <View style={{ borderWidth: 1, borderRadius: 10, borderColor: '#DCDCDC', paddingVertical: 10, paddingHorizontal: 15, marginTop: 15 }}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 15, fontWeight: 600 }}>Complaint Assigned</Text>

                            <View style={{
                              flexDirection: 'row', borderRadius: 10, paddingVertical: 5, paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center',
                              backgroundColor: complaintContext.getComplaintDetail?.status === "PENDING" ? "#FFEEEEA3" : complaintContext.getComplaintDetail?.status === "Inpogress" ? "#FFF6E7" : "lightgreen",
                            }}>
                              <Image source={Group}
                                style={{
                                  width: 12.95, height: 13, marginTop: 2,
                                  tintColor: complaintContext.getComplaintDetail?.status === "PENDING" ? "#FF3B30" : complaintContext.getComplaintDetail?.status === "Inpogress" ? "#FF9500" : "green",
                                }} />

                              <Text style={{
                                fontSize: 12, fontWeight: 600, marginLeft: 5,
                                color: complaintContext.getComplaintDetail?.status === "PENDING" ? "#FFEEEEA3" : complaintContext.getComplaintDetail?.status === "Inpogress" ? "#FFF6E7" : "green"
                              }}>
                                {complaintContext.getComplaintDetail?.status}</Text>
                            </View>

                          </View>

                          <View style={{ height: 1, backgroundColor: "#eee", marginVertical: 15 }} />

                          <TouchableOpacity onPress={() => navigation.navigate('Updates')}
                            style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 10 }}>
                            <Text style={{ color: "#00A1FF", fontSize: 14, fontWeight: 600 }}>
                              See all updates
                            </Text>
                          </TouchableOpacity>

                        </View> : null}

                        {complaintContext.getComplaintDetail?.status == "resolved" ?
                        <View style={{ borderWidth: 1, borderRadius: 10, borderColor: '#DCDCDC', paddingVertical: 10, paddingHorizontal: 15, marginTop: 15 }}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 15, fontWeight: 600 }}>Your complaint was Resolved</Text>

                            <View style={{
                              flexDirection: 'row', borderRadius: 10, paddingVertical: 5, paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center',
                              backgroundColor: complaintContext.getComplaintDetail?.status === "PENDING" ? "#FFEEEEA3" : complaintContext.getComplaintDetail?.status === "Inpogress" ? "#FFF6E7" : "lightgreen",
                            }}>
                              <Image source={Group}
                                style={{
                                  width: 12.95, height: 13, marginTop: 2,
                                  tintColor: complaintContext.getComplaintDetail?.status === "PENDING" ? "#FF3B30" : complaintContext.getComplaintDetail?.status === "Inpogress" ? "#FF9500" : "green",
                                }} />

                              <Text style={{
                                fontSize: 12, fontWeight: 600, marginLeft: 5,
                                color: complaintContext.getComplaintDetail?.status === "PENDING" ? "#FFEEEEA3" : complaintContext.getComplaintDetail?.status === "Inpogress" ? "#FFF6E7" : "green"
                              }}>
                                {complaintContext.getComplaintDetail?.status}</Text>
                            </View>

                          </View>

                          <View style={{ height: 1, backgroundColor: "#eee", marginVertical: 15 }} />

                          <TouchableOpacity onPress={() => setReopenComplaint(true)}
                            style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 10 }}>
                            <Text style={{ color: "#2E70E8", fontSize: 14, fontWeight: 600 }}>
                              Want to Reopen
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity onPress={() => navigation.navigate('Updates')}
                            style={{ justifyContent: 'center', alignItems: 'center',backgroundColor:'#1E45E1',
                                    padding:10,borderRadius:8 }}>
                            <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: 600 }}>
                              See all updates
                            </Text>
                          </TouchableOpacity>

                        </View> : null}

                      <View style={{ marginTop: 10 }} >
                        {/* COMMENT INPUT */}
                        <View style={{ paddingTop: 22 }}>
                          <View style={{ padding: 4, borderRadius: 10, borderWidth: 1, justifyContent: "space-between", flexDirection: "row", alignItems: "center", borderColor: '#DCDCDC' }} >
                            <TextInput value={sendComment} placeholder="Add your Comment" onChangeText={setSendComment} multiline
                              blurOnSubmit={false}
                              style={{ flex: 1 }} />
                            <TouchableOpacity onPress={sendComment ? sendclick : commentclick}>
                              <Image
                                source={sendComment ? SendButton : CommentMesg}
                                style={{ width: 23, height: 23, marginRight: 15, }} />
                            </TouchableOpacity>
                          </View>
                        </View>

                        {/* STATUS BUTTON */}

                        {complaintContext.getComplaintDetail?.status === "PENDING" &&
                          <TouchableOpacity>
                            <View
                              style={{
                                padding: 13, borderRadius: 10, borderWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 15, marginBottom: 20,
                                backgroundColor: complaintContext.getComplaintDetail?.status === "PENDING" ? "#FFEEEEA3" : complaintContext.getComplaintDetail?.status === "Inpogress" ? "#FFF6E7" : "lightgreen",
                                borderColor: complaintContext.getComplaintDetail?.status === "PENDING" ? "#FFD5D5" : complaintContext.getComplaintDetail?.status === "Inpogress" ? "#FFE7C6" : "lightgreen",
                              }}>
                              <Image source={Group}
                                style={{
                                  width: 17.93, height: 18, marginTop: 4,
                                  tintColor: complaintContext.getComplaintDetail?.status === "PENDING" ? "#FF3B30" : complaintContext.getComplaintDetail?.status === "Inpogress" ? "#FF9500" : "green",
                                }} />
                              <Text
                                style={{
                                  color: complaintContext.getComplaintDetail?.status === "PENDING" ? "#FF3B30" : complaintContext.getComplaintDetail?.status === "Inpogress" ? "#FF9500" : "green",
                                  fontSize: 14.11, fontWeight: "600", marginLeft: 10,
                                }}>
                                {complaintContext.getComplaintDetail?.status}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        }


                      </View>
                    </View>
                  </ScrollView>
                )}
              </View>
            )}
          </SafeAreaView>

        </Animated.View>
      </View>
    )}


    {/* ------ReopenComplaint----- */}

    <ReopennComplaint 
    visible={reopenComplaint}
    onClose={()=>setReopenComplaint(false)}/>

    {/* -----Edit complaint-------- */}

    <EditComplaintSheet
      visible={editCompliantBottomsheet}
      onClose={closeEdit}
      complaintType={complaintType}
      selectedComplaint={selectedComplaint}
      selectedComplaintTypeId={selectedComplaintTypeId}
      setSelectedComplaintTypeId={setSelectedComplaintTypeId}
      mediaimage={mediaimage}
      uploadimage={uploadimage}
      isFocus={isFocus}
      setIsFocus={setIsFocus}
      panResponder={panResponder}
      sheetY={sheetY}
    />



    {/* -----Delete complaint----- */}

    {showPopUp && <View style={{ position: 'absolute', backgroundColor: '#rgba(0, 0, 0, 0.1)', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message="Complaint Deleted Successfully!"
        type="sucess"
      />
      <View style={{ width: '90%', backgroundColor: '#ffffff', borderWidth: 1, borderRadius: 8, borderColor: '#E5E7EB', paddingBottom: 15 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 13, }}>
          <View style={{ flexDirection: 'row' }}>
            <Image source={Exclamation} style={{ width: 25, height: 25 }} />
            <Text style={{ fontSize: 18, fontWeight: 400, marginLeft: 6 }}> Delete Complaint?  </Text>
          </View>

          <TouchableOpacity onPress={deleteClose} style={{ justifyContent: 'center', paddingTop: 5 }}>
            <Image source={DeleteIcon} style={{ width: 20, height: 20 }} />
          </TouchableOpacity>

        </View>

        <View style={{ height: 1, width: '100%', backgroundColor: "#eee", marginTop: 4 }} />

        <View style={{ paddingHorizontal: 20, paddingVertical: 13 }}>
          <Text style={{ flexWrap: 'wrap', width: "80%", color: '#4B4B4B', flexShrink: 1, lineHeight: 24 }}>
            Please let us know the reason before deleting.</Text>

          <View style={{ paddingTop: 15 }}>
            {reasons.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedReason(item)}
                style={{
                  flexDirection: "row", alignItems: "center",
                  backgroundColor:
                    selectedReason === item ? "#F5F7FF" : "#FAFAFA",
                  borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12,
                  marginBottom: 10,
                  borderWidth: selectedReason === item ? 1 : 0,
                  borderColor: "#1E45E1",
                }}
              >
                <View style={{
                  height: 20, width: 20, borderRadius: 10, borderWidth: 2,
                  borderColor: selectedReason === item ? "#1E45E1" : "#ccc",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 10,
                }} >

                  {selectedReason === item && (
                    <View
                      style={{
                        height: 10, width: 10, borderRadius: 5,
                        backgroundColor: "#1E45E1",
                      }}
                    />
                  )}
                </View>
                <Text style={{ color: "#000", fontSize: 14 }}>{item}</Text>
              </TouchableOpacity>
            ))}

            {selectedReason == 'Other' ? <View style={{ borderRadius: 10, backgroundColor: '#FAFAFA', height: 80 }}>
              <TextInput placeholder="Enter the reason" style={{ marginLeft: 5 }} multiline
                blurOnSubmit={false} />
            </View> : null}

          </View>

        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 13, }}>
          <TouchableOpacity onPress={cancel} style={{ paddingRight: 10, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 15, justifyContent: 'center' }}>
            <Text style={{ fontSize: 14, fontWeight: 400, color: '#4B4B4B' }}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => deleteItem(complaintId)}
            disabled={selectedReason == null ? true : false} style={{
              backgroundColor: selectedReason != null ? '#1E45E1' : '#788fed',
              borderWidth: 2, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 15, borderColor: '#C3DDFD'
            }}>
            <Text style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF' }}>Delete</Text>
          </TouchableOpacity>
        </View>



      </View>
    </View>}
    {/* -------Add complaint----- */}

    <AddComplaint
      visible={addComplaints}
      onClose={onCloseAddComplaint}
      panResponder={panResponder}
      sheetY={sheetY} />

    {/* ------show Amenities-------- */}

    <AmenitiesBottomSheet
      visible={showAmenities}
      onClose={()=>setShowAmenities(false)}
      tag={tag}
      myAmenitis={myAmenitis}
      available={available}
      panResponder={panResponder}
      sheetY={sheetY}
      />

    {/* -----Request bed change--------- */}

    <RequestBedChange
      visible={showBedChange}
      onClose={onCloseBedChange}
      panResponder={panResponder}
      sheetY={sheetY} />

    {/* ----------Payment------ */}

    {modalVisible && (
      <View style={style.sheetOverlay}>

        {/* Tap outside to close */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[(paymentContext.getInvoiceDetail?.status === "Partial Payment" ||
            paymentContext.getInvoiceDetail?.status === "Paid") ? style.bottomSheetPaid : style.bottomSheetPay,
          { transform: [{ translateY: sheetY }] }]}
          {...panResponder.panHandlers}
        >
          <View {...panResponder.panHandlers}>
            <View style={style.dragindictor} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {paymentContext.getInvoiceDetail && ["Rent", "Advance", "Booking", "Reassign_rent"].includes(
              paymentContext.getInvoiceDetail.invoiceType
            ) ? (
              <>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={style.modalTitle}>{paymentContext.getInvoiceDetail?.invoiceType}</Text>

                  <View style={{ flexDirection: "row" }}>
                    <Text style={style.invoiceId}>{paymentContext.getInvoiceDetail?.invoiceNumber}</Text>
                    <TouchableOpacity
                      onPress={()=>handleReceiptPdfDownload(paymentContext.getInvoiceDetail.invoiceType)}
                    >
                      <Image
                        source={ViewIcon}
                        style={{ width: 15, height: 15, marginLeft: 5, marginTop: 2 }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>


                {/* Amount Section */}
                <View style={style.amountSection}>
                  <Text style={style.label}>Total Amount</Text>

                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={style.totalAmount}>
                      ₹{paymentContext.getInvoiceDetail?.totalAmount.toFixed(2)}
                    </Text>

                    {paymentContext.getInvoiceDetail?.status === "Pending" && (
                      <View
                        style={[
                          style.statusBadge,
                          { backgroundColor: "rgba(254,243,198,1)" },
                        ]}
                      >
                        <Text
                          style={[
                            style.statusText,
                            { color: "rgba(187,77,0,1)" },
                          ]}
                        >
                          Pending
                        </Text>
                      </View>
                    )}

                    {(paymentContext.getInvoiceDetail?.status === "Partial Payment" ||
                      paymentContext.getInvoiceDetail?.status === "Paid") && (
                        <View style={{ flexDirection: "row", marginTop: 6 }}>
                          <Image
                            source={PaidIcon}
                            style={{ width: 20, height: 20 }}
                          />
                          <Text style={{ fontSize: 14, marginLeft: 6 }}>
                            {paymentContext.getInvoiceDetail.status === "Paid"
                              ? "Full Paid"
                              : "Partial Payment"}
                          </Text>
                        </View>
                      )}
                  </View>
                </View>



                {/* Details */}
                <View style={style.detailsSection}>
                  {(paymentContext.getInvoiceDetail?.status === "Partial Payment" ||
                    paymentContext.getInvoiceDetail?.status === "Paid") && (
                      paymentContext.getInvoiceDetail?.invoiceItems.map(i => {
                        return (
                          <View style={style.row}>
                            <TouchableOpacity >
                              <Text style={style.detailLabel}>{i.invoiceItem}</Text>
                            </TouchableOpacity>
                            <Text style={style.detailValue}>₹{i.amount}</Text>
                          </View>
                        )
                      })
                    )}
                  {/* <View style={style.row}>
                    <Text style={style.detailLabel}>Actual Rent</Text>
                    <Text style={style.detailValue}>₹{ }</Text>
                  </View>

                  <View style={style.row}>
                    <Text style={style.detailLabel}>Taxes GST 10%</Text>
                    <Text style={style.detailValue}>₹{paymentContext.getInvoiceDetail.gst}</Text>
                  </View> */}

                  {(paymentContext.getInvoiceDetail?.status === "Partial Payment" ||
                    paymentContext.getInvoiceDetail?.status === "Paid") && (
                      <>
                        <Text style={[style.detailLabel,{marginTop:10}]}>Paid Amount</Text>
                        {paymentContext.getInvoiceDetail?.receipts.map(i => {
                          return (
                            <View key={i.transactionId} style={style.row}>
                              <TouchableOpacity onPress={() => handlePaymentReceipt(i.transactionId,paymentContext.getInvoiceDetail.invoiceType)}>
                                <Text style={{ fontSize: 8, color: "#1e45e2" }}>{i.transactionId}</Text>
                              </TouchableOpacity>
                              <Text style={style.detailValue}>₹{i.paidAmount}</Text>
                            </View>
                          )
                        })}

                      </>
                    )}

                  {paymentContext.getInvoiceDetail.status === "Partial Payment" && (
                    <>
                      <View style={style.row}>
                        <Text style={style.detailLabel}>Remain</Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={style.payBillText}>Pay Bill</Text>
                        <Text style={style.detailValue}>₹{paymentContext.getInvoiceDetail?.dueAmount}</Text>
                      </View>
                    </>
                  )
                  }
                </View>

                <View
                  style={{
                    borderBottomWidth: 0.4,
                    borderBottomColor: "grey",
                    opacity: 0.4,
                    marginVertical: 10,
                  }}
                />

                {/* Paid / Due Date */}
                <View style={style.Billbottom}>
                  <Text style={style.paiddetailLabel}>
                    {paymentContext.getInvoiceDetail.status === "Pending" ? "Due Date" : "Paid Date"}
                  </Text>
                  <Text style={style.paiddetailValue}>
                    {paymentContext.getInvoiceDetail.status === "Pending" ? paymentContext.getInvoiceDetail.dueDate
                      : paymentContext.getInvoiceDetail.lastPaidDate}
                  </Text>
                </View>

                {/* Notes */}
                {paymentContext.getInvoiceDetail.status === "Pending" && (
                  <View style={{ marginTop: 10 }}>
                    <Text style={{ fontSize: 13, color: "rgba(60,60,67,0.6)" }}>
                      Notes & Instructions
                    </Text>
                    <Text style={style.noteText}>
                      Kindly pay on or before the due date
                    </Text>
                    <Text style={style.noteText}>
                      Late fee may apply after 3 days of due date
                    </Text>
                    <Text style={style.noteText}>
                      For any billing errors, contact hostel admin
                    </Text>
                  </View>
                )}

                {/* Payment mode section */}
                {paymentContext.getInvoiceDetail.status !== "Pending" && (
                  <View style={{ marginTop: 10 }}>
                    <View style={style.Billbottom}>
                      <Text style={style.paiddetailLabel}>Payment Mode</Text>
                      <Text style={style.paiddetailValue}>{paymentContext?.getInvoiceDetail?.receipts[0]?.paymentMode}</Text>
                      {/* {paymentContext.getInvoiceDetail.receipts.map(i => {
                        console.log(i)
                        return (

                          <Text key={i.transactionId} style={style.paiddetailValue}>{i.paymentMode}</Text>
                        )

                      })} */}

                    </View>
                    {console.log(paymentContext.getInvoiceDetail.receipts)}
                    <View style={[style.Billbottom, { paddingTop: 10 }]}>
                      <Text style={style.paiddetailLabel}>Reference number</Text>
                      <Text>{paymentContext?.getInvoiceDetail?.lastReferenceId}</Text>
                      {/* {paymentContext.getInvoiceDetail.receipts.map(i => {
                        return (
                          <Text key={i.transactionId} style={style.paiddetailValue}>{i.referenceNumber}</Text>
                        )

                      })} */}
                    </View>
                  </View>
                )}

                {/* Buttons */}
                <View style={style.buttonRow}>
                  {paymentContext.getInvoiceDetail.status === "Pending" ? (
                    <>
                      <TouchableOpacity
                        style={style.shareBtn}
                        onPress={downloadOption}
                      >
                        <Text style={{ fontWeight: "600", color: "#071C70" }}>
                          Download Bill
                        </Text>
                        <Image
                          source={DownloadBlueIcon}
                          style={{ width: 17, height: 17, marginLeft: 8 }}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity style={style.downloadBtn}>
                        <Text style={style.downloadText}>Pay Now</Text>
                        <Image
                          source={ArrowRightIcon}
                          style={{ width: 20, height: 20, marginLeft: 8 }}
                        />
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity style={style.shareBtn}>
                        <Text style={style.shareText}>Share</Text>
                        <Image
                          source={ShareIcon}
                          style={{ width: 17, height: 17, marginLeft: 8 }}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={style.downloadBtn}
                        onPress={downloadOption}
                      // handleDownload
                      >
                        <Text style={style.downloadText}>Download</Text>
                        <Image
                          source={DownloadIcon}
                          style={{ width: 20, height: 20, marginLeft: 8 }}
                        />
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </>
            ) :
              <>
                <View style={style.row}>
                  <Text style={style.modalTitle}>{paymentContext?.getInvoiceDetail?.invoiceType}</Text>

                  <View style={{
                    flexDirection: "row", backgroundColor: '#F1F4FF', paddingVertical: 3, paddingHorizontal: 5,
                    borderRadius: 5, alignItems: 'center'
                  }}>
                    <Text style={{ fontSize: 13, color: "#0057FF", fontWeight: "600" }}>{paymentContext?.getInvoiceDetail?.invoiceNumber}</Text>
                    <TouchableOpacity

                    >
                      <Image
                        source={ViewIcon}
                        style={{ width: 15, height: 15, marginLeft: 5, marginTop: 2 }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View
                  style={{
                    borderBottomWidth: 0.4,
                    borderBottomColor: "grey",
                    opacity: 0.4,
                    marginVertical: 10,
                  }}
                />

                <View style={style.row}>
                  <Text style={style.modalTitle}>Total Refund</Text>

                  <Text style={{ fontSize: 16, fontWeight: 700 }}>₹ {paymentContext?.getInvoiceDetail?.totalAmount}</Text>
                </View>

                <View style={style.row}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, fontWeight: 400, color: '#1E45E1' }}>Re-c120</Text>
                    <Image source={ReceiptPic} style={{ width: 16, height: 16, marginLeft: 5 }} resizeMode="contain" />
                  </View>


                  <Text style={{ fontSize: 12, fontWeight: 400, color: '#038C3D' }}>{paymentContext?.getInvoiceDetail?.status}</Text>
                </View>

                <View style={[style.row, { paddingTop: 10 }]}>
                  <Text style={{ fontSize: 14, fontWeight: 400 }}>Advance paid</Text>

                  <Text style={{ fontSize: 16, fontWeight: 700 }}>₹ 8000</Text>
                </View>

                <View style={style.row}>
                  <TouchableOpacity onPress={() => setShowVisible(!showVisible)}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{ fontSize: 14, fontWeight: 400 }}>Refundable Rent</Text>
                      <Ionicons
                        name={showVisible ? "chevron-up" : "chevron-down"}
                        size={20}
                        color="#000"
                        style={{ marginLeft: 6 }}
                      />
                    </View>
                  </TouchableOpacity>

                  <Text style={{ fontSize: 16, fontWeight: 700 }}>₹ 5000</Text>
                </View>

                {showVisible && (
                  refundable.map(i => {
                    return (
                      <View style={style.row}>
                        <Text style={{ fontSize: 14, fontWeight: 300, color: '#2F2F2F' }}>{i.list}</Text>
                        <Text style={{ fontSize: 14, fontWeight: 300, color: '#2F2F2F' }}>₹ {i.amount}</Text>
                      </View>
                    )
                  })

                )}

                <View style={[style.row, { marginTop: 10 }]}>
                  <Text style={{ fontSize: 14, fontWeight: 400 }}>Maintanence</Text>

                  <Text style={{ fontSize: 16, fontWeight: 700 }}>₹ 9000</Text>
                </View>

                <View
                  style={{
                    borderBottomWidth: 0.4,
                    borderBottomColor: "grey",
                    opacity: 0.4,
                    marginVertical: 10,
                  }}
                />

                <View style={style.Billbottom}>
                  <Text style={style.paiddetailLabel}>
                    Paid Date
                  </Text>
                  <Text style={style.paiddetailValue}>
                   {paymentContext?.getInvoiceDetail?.lastPaidDate}
                  </Text>
                </View>

                <View style={{ marginTop: 10 }}>
                  <View style={style.Billbottom}>
                    <Text style={style.paiddetailLabel}>Payment Mode</Text>
                    <Text style={style.paiddetailValue}>{paymentContext?.getInvoiceDetail?.lastPaymentMode}</Text>

                  </View>

                  <View style={[style.Billbottom, { paddingTop: 10 }]}>
                    <Text style={style.paiddetailLabel}>Reference number</Text>

                    <Text>{paymentContext?.getInvoiceDetail?.lastReferenceId}</Text>
                    {/* {paymentContext.getInvoiceDetail.receipts.map(i => {
                      return (
                        <Text key={i.transactionId} style={style.paiddetailValue}>{i.referenceNumber}</Text>
                      )

                    })} */}
                  </View>
                </View>

                {/* {---------Button--} */}

                <View style={style.buttonRow}>
                  <TouchableOpacity style={style.shareBtn}>
                    <Text style={style.shareText}>Share</Text>
                    <Image
                      source={ShareIcon}
                      style={{ width: 17, height: 17, marginLeft: 8 }}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={style.downloadBtn}
                    onPress={downloadOption}
                  // handleDownload
                  >
                    <Text style={style.downloadText}>Download</Text>
                    <Image
                      source={DownloadIcon}
                      style={{ width: 20, height: 20, marginLeft: 8 }}
                    />
                  </TouchableOpacity>

                </View>

              </>
            }
          </ScrollView>
        </Animated.View>
      </View>
    )}

    {showDownloadOption && (
      <View style={style.sheetOverlay}>

        {/* Tap outside to close */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[style.bottomSheetoption, { transform: [{ translateY: sheetY }] }]}
          {...panResponder.panHandlers}
        >
          <SafeAreaView style={{flex:1}} edges={['bottom']}>
            <View {...panResponder.panHandlers}>
              <View style={style.dragindictor} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={style.title}>Select option</Text>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setSelected('invoice')}
                style={
                  selected === 'invoice'
                    ? [style.card, style.cardSelected]
                    : style.card
                }
                accessibilityRole="radio"
                accessibilityState={{ selected: selected === 'invoice' }}
              >
                <View style={style.cardInner}>
                  <View style={style.cardTextContainer}>
                    <Text style={style.cardTitle}>Invoice Bill Summary</Text>
                    <Text style={style.cardSubtitle}>
                      Brief summary of total bill with taxes.
                    </Text>
                  </View>


                  <View style={selected === 'invoice' ? [style.radioOuter, style.radioOuterSelected] :
                    style.radioOuter}>
                    <View
                      style={
                        selected === 'invoice'
                          ? [style.radioInner, style.radioInnerSelected]
                          : style.radioInner
                      }
                    />
                  </View>
                </View>
              </TouchableOpacity>


              <View style={style.secondOptionContainer}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setSelected('receipt')}
                  style={
                    selected === 'receipt'
                      ? [style.card, style.cardSelected]
                      : style.card
                  }
                  accessibilityRole="radio"
                  accessibilityState={{ selected: selected === 'receipt' }}
                >
                  <View style={style.cardInner}>
                    <View style={style.cardTextContainer}>
                      <Text style={style.cardTitle}>Payment Receipt</Text>
                      <Text style={style.cardSubtitle}>
                        Receipt of payments made for the bill
                      </Text>
                    </View>


                    <View style={selected === 'receipt' ? [style.radioOuter, style.radioOuterSelected] :
                      style.radioOuter}>
                      <View
                        style={
                          selected === 'receipt'
                            ? [style.radioInner, style.radioInnerSelected]
                            : style.radioInner
                        }
                      />
                    </View>
                  </View>
                </TouchableOpacity>

              </View>


              <View style={style.footer}>
                <TouchableOpacity
                  onPress={handleDownload}
                  activeOpacity={0.9}

                >

                  <View style={style.downloadContent}>
                    <Image source={DownloadSide} style={{ width: 20, height: 20 }} />
                    <Text style={style.downloadText}> Download</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Animated.View>
      </View >
    )
    }
    <FilterPayments
      visible={filterBottomsheet}
      onClose={() => { setFilterBottomSheet(false) }}
      sheetY={sheetY}
      panResponder={panResponder} />

  </SafeAreaView >

}

const style = StyleSheet.create({
  mainDashb: { flex: 1, backgroundColor: '#FFFFFF', position: 'relative' },
  container: { flexDirection: 'row', paddingTop: 10, paddingLeft: 16, paddingRight: 16, justifyContent: 'space-between', paddingLeft: 10, alignItems: 'center' },
  sheetOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",

  },
  bottomSheetwithimage: {
    height: height * 0.60,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 5,
    overflow: 'hidden'
  },
  bottomSheet: {
    height: height * 0.55,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10
  },
  bottomsheets: {
    height: '90%', backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 20,
    paddingTop: 20, paddingBottom: 10
  },
  dragindictor: { width: 50, height: 4, backgroundColor: "#ccc", borderRadius: 2, alignSelf: "center", marginBottom: 10 },
  amenitiesBottomSheet: {
    height: '50%', backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 18,
    paddingTop: 20, paddingBottom: 10
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  dragIndicator: {
    width: 50,
    height: 4,
    backgroundColor: "#ccc",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 10,
  },
  modalTitle: { fontSize: 20, fontWeight: "600", color: "#000" },
  invoiceId: {
    fontSize: 13,
    color: "#0057FF",
    fontWeight: "600",
    marginBottom: 6,
  },
  amountSection: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: { fontSize: 20, color: "rgba(31, 38, 51, 1)", fontWeight: "600" },
  totalAmount: { fontSize: 16, fontWeight: "700", color: "#000" },
  detailsSection: { marginVertical: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
    alignItems: 'center'
  },
  detailLabel: { fontSize: 13, color: "rgba(31, 38, 51, 1)" },
  detailValue: { fontSize: 15, fontWeight: "600", color: "rgba(31, 38, 51, 1)" },
  payBillText: { fontSize: 13, color: "#0057FF", fontWeight: "600" },
  paiddetailLabel: { fontSize: 13, color: "rgba(60, 60, 67, 0.6)" },
  paiddetailValue: { fontSize: 13, color: "black", fontWeight: "600", },
  Billbottom: { display: 'flex', flexDirection: 'row', justifyContent: "space-between", },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  shareBtn: {
    flex: 1,
    backgroundColor: "#F3F5FF",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    display: 'flex',
    flexDirection: 'row',
    marginRight: 10,
    justifyContent: 'center'
  },
  shareText: { color: "#000", fontWeight: "600" },
  downloadBtn: {
    flex: 1,
    backgroundColor: "#0057FF",
    paddingVertical: 10,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'center'
  },
  downloadText: { color: "#fff", fontWeight: "600" },
  filterFab: {
    position: 'absolute',
    bottom: 40,
    right: 10,
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    width: 60,
    height: 60,
  },

  bottomSheetPay: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: "50%",
  },
  bottomSheetPaid: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: "55%",
  },
  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginTop: 6,
    alignItems: 'center'
  },
  statusText: { fontSize: 12, fontWeight: "500" },
  hostelImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
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
  bottomSheetoption: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: "50%",
  },


  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(12,12,13,0.45)',
    justifyContent: 'flex-end',
  },
  fullFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 22,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    paddingTop: 12,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -6 },
  },
  grabberContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  grabber: {
    width: 44,
    height: 4,
    borderRadius: 4,
    backgroundColor: '#E6E9EE',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0E1726',
    marginBottom: 18,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
  },
  cardSelected: {
    borderWidth: 1.5,
    borderColor: '#2E44FF',
    backgroundColor: '#F8FAFB',
    shadowColor: '#2E44FF',
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTextContainer: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#0E1726' },
  cardSubtitle: { fontSize: 14, color: '#8A97A8', marginTop: 8 },
  radioOuter: {
    width: 28,
    height: 28,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#CFD8E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: { borderColor: '#2E44FF' },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  radioInnerSelected: {
    backgroundColor: '#2E44FF',
    borderRadius: 20,

  },
  secondOptionContainer: { marginBottom: 26 },
  rowOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

  },
  rowLeft: { flex: 1 },
  rowTitle: { fontSize: 18, fontWeight: '700', color: '#0E1726' },
  rowSubtitle: { fontSize: 14, color: '#8A97A8', marginTop: 6 },
  radioOutline: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#C4CBD9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInnerSmall: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'transparent' },
  radioInnerSmallSelected: { backgroundColor: '#2E44FF' },


  footer: {
    marginTop: 4,
    alignItems: 'center',
    width: '100%',
    borderRadius: 28,
    paddingVertical: 14,
    backgroundColor: '#2E44FF',

  },
  downloadbutton: {
    width: '100%',
    borderRadius: 28,
    paddingVertical: 14,
    shadowColor: '#2E44FF',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },

  downloadContent: { alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  downloadText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
})
export default Dashboard;
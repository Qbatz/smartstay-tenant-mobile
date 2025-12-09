import React, { useState, useMemo, useCallback, useRef, useEffect, useContext } from "react";
import { View, Text, Dimensions, Image, TouchableOpacity, Button, FlatList, TextInput, StyleSheet, BackHandler, TouchableWithoutFeedback, Platform, PanResponder, Animated, ScrollView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import MyStay from '../DashboardPage/MyStay';
import Services from '../DashboardPage/Services'
import Payment from '../Payment'
import Building from '../../assets/Images/buildin.png'
import Location from '../../assets/Images/location.png'
import Flash from '../../assets/Images/flash.png'
import MobilePayment from '../../assets/Images/payment.png'
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import Edit from '../../assets/Images/edit.png'
import Delete from '../../assets/Images/trash.png'
import Trash from '../../assets/Images/trash 01.png'
import CommentMesg from '../../assets/Images/commentMessage.png'
import Group from '../../assets/Images/Group.png'
import Customer from "../../assets/Images/Customer_Icon.png"
import SendButton from '../../assets/Images/Send.png'
import { Dropdown } from "react-native-element-dropdown";
import Ionicons from 'react-native-vector-icons/Ionicons'
import CameraPic from '../../assets/Images/cameraPic.png'
import File from '../../assets/Images/files.png'
import Damage1 from '../../assets/Images/damage1.png'
import Damage2 from '../../assets/Images/damage2.png'
import Damage3 from '../../assets/Images/damage3.png'
import Dot from '../../assets/Images/dot.png'
import calenderTick from '../../assets/Images/calendar-tick.png'
import { launchImageLibrary } from "react-native-image-picker";
import Exclamation from '../../assets/Images/exclamation.png'
import DeleteIcon from '../../assets/Images/deleteIcon.png'
import HostelProfile from "../../assets/Images/Group 1.png"
import { addComment, complaints, deleteComplaint, getAmenties, getComplaints, getComplaintTypes, getInvoices, hostelDetails, postRequestBedChange, postRquestAmenties } from "../../Action/HostelAction";
import { customerDetails, postComplaint } from "../../Action/CustomerAction";
import { UsersContext } from "../../Context/UserContext";
import { LoginContexts } from '../../Context/LoginContext'
import Room from '../../assets/Images/Room.png'
import Bed from '../../assets/Images/Bed_Icon.png'
import SuccessModal from "../ToastFile/TostFilePage";
import { add } from "react-native/types_generated/Libraries/Animated/AnimatedExports";
import AppLoader from "../ToastFile/LoaderPage";

import DownloadIcon from "../../assets/Images/download.png"
import DownloadBlueIcon from "../../assets/Images/download_Blue.png";
import ShareIcon from "../../assets/Images/Union.png";
import PaidIcon from "../../assets/Images/Checkboxes.png";
import ViewIcon from "../../assets/Images/view.png";
import ArrowRightIcon from "../../assets/Images/arrow-right.png";
import LinearGradient from "react-native-linear-gradient";
import { compliantContexts } from "../../Context/ComplaintContext";
import { paymentContexts } from "../../Context/PaymentContext";

const { width, height } = Dimensions.get("window");

function Dashboard(props) {

  const context = useContext(UsersContext)
  const loginContext = useContext(LoginContexts)
  const complaintContext = useContext(compliantContexts)
  const paymentContext = useContext(paymentContexts)
  const { width } = Dimensions.get('window');
  const bedDropdownRef = useRef(null)
  const bedTypeDropdow = useRef(null)
  const urgencyDropdown = useRef(null)
  console.log(props)

  const navigation = useNavigation();
  const [index, setindex] = useState(0);
  const [selectedComplaint, setSelectComplaint] = useState(null);
  const [comment, setComment] = useState(false)
  const [imageid, setimageid] = useState();
  const [commentnote, setCommentNote] = useState(null)
  const [commentMessage, setCommentmessage] = useState();
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
  const [focusReason, setFocusReason] = useState(false);
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

  const sheetY = useRef(new Animated.Value(700)).current;

  console.log(focusReason)
  console.log(selectedComplaintTypeId)

  const bed = [{ label: 'Disturbance in current room', value: 'Disturbance in current room' }, { label: 'Roommate issues', value: 'Roommate issues' }, { label: 'Need more privacy/space', value: 'Need more privacy/space' },
  { label: 'Maintanence issues', value: 'Maintanence issues' }, { label: 'Prefer other sharing type', value: 'Prefer other sharing type' }, { label: 'Others', value: 'Others' }]

  const selectBed = [{ label: 'Single Sharing', value: 'Single Sharing' }, { label: 'Double Sharing', value: '2' }, { label: 'Triple Sharing', value: '3' }]

  const urgency = [{ label: 'Within 2-3 days', value: '1' }, { label: 'Within 1 Week', value: '2' }, { label: 'Next Month Start', value: '3' }]

  const staticReceiptData = {
    configurations: {
      hostelLogo: "https://example.com/logo.png",
      receiptType: "Rent",
      address: "123, Main Road, Chennai",
      signatureUrl: "https://example.com/signature.png",
    },
    stayInfo: {
      hostelName: "Smart Stay Hostel",
      floorName: "2nd Floor",
      roomName: "Room 202",
      bedName: "B2",
    },
    customerInfo: {
      fullName: "Pon Allwin",
      customerMobileNo: "9876543210",
      countryCode: "91",
      fullAddress: "No. 45, Anna Nagar, Chennai",
    },
    receiptInfo: {
      paidAmount: 5500,
      receiptNumber: "RCP-1023",
      transactionDate: "03/11/2025",
      transactionTime: "10:45 AM",
    },
    accountDetails: { bankName: "Cash" },
  };

  useEffect(() => {
    if (showSheet || addComplaints || showBedChange || editCompliant || showAmenities || modalVisible) {
      setTimeout(() => {
        sheetY.setValue(700)
        Animated.timing(sheetY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }, 10);
    }
  }, [showSheet, addComplaints, showBedChange, editCompliant, showAmenities, modalVisible]);

  useEffect(() => {
    const backAction = () => {

      // 1️⃣ Close bottom sheets/modals first
      if (showBedChange || addComplaints || showSheet || editCompliant || showAmenities || modalVisible) {
        setShowBedChange(false);
        setAddComplaint(false);
        setShowSheet(false);
        setShowAmenities(false);
        setModalVisible(false);
        return true;
      }

      // 2️⃣ Handle tab navigation
      if (index > 0) {
        setindex(index - 1); // move back to previous tab
        return true;
      }

      // 3️⃣ If already on MyStay tab → go back to VerifyKYC
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
    editCompliant,
    showAmenities,
    modalVisible,
  ]);


  function onClose() {
    Animated.timing(sheetY, {
      toValue: 700,
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
      setSelectedComplaintTypeId(0)
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



  const handleNotificationShow = () => {
    navigation.navigate("Notification", { hostel: props.route.params.hostel });
  };

  const handleProfile = () => {
    navigation.navigate("CustomerProfile");
  };

  const handle = (complaint) => {

    setShowSheet(true)

    getComplaints(context.getHostelDetail.hostelId, complaint.complaintId, loginContext.getToken).then(r => {
      setSelectComplaint(r.data)
      complaintContext.updateComplaint(r.data)
      complaintContext.updateComments(r.data.comments)
    })
  }

  const commentclick = () => {
    setComment(true)
  }

  const imageclick = (id) => {
    setdeleteVisible(true)
    setimageid(id)
  }


  const textmessage = (value) => {
    setCommentmessage(value)
  }
  const sendclick = () => {

    const data = {
      message: sendComment,
      hostelId: context.getHostelDetail.hostelId
    }



    addComment(selectedComplaint.complaintId, loginContext.getToken, data).then(r => {
      setSendComment(null)

      getComplaints(context.getHostelDetail.hostelId, selectedComplaint?.complaintId, loginContext.getToken).then(r => {
        setSelectComplaint(r.data)
        complaintContext.updateComments(r.data.comments)
      })

    })
  }



  // ------Add complaint

  const addComplaint = () => {
    setAddComplaint(true)

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

  const submitClick = () => {
    const payloads = {
      complaintTypeId: selectedComplaintTypeId,
      description: complaintDescription,
    }

    console.log(payloads)

    const formData = new FormData();

    const jsonBase64 = btoa(JSON.stringify(payloads));

    formData.append("payloads", {
      uri: "data:application/json;base64," + jsonBase64,
      type: "application/json",
      name: "payload.json",
    });

    if (imageuri) {

      console.log(imageuri)
      // let complaitImages = []
      // imageuri.forEach(img => {
      //   complaitImages.push({
      //     uri: img.uri,
      //     type: img.type,
      //     name: img.fileName
      //   })
      // })
      // console.log(complaitImages)


      formData.append("complaintImage", imageuri)

      imageuri.forEach((img, index) => {
        formData.append("complaintImage", {
          uri: img.uri,
          type: img.type,
          name: img.fileName,
        })

      })
    }
    if (selectedComplaintTypeId != 0) {
      if (complaintDescription.trim().length > 15) {
        postComplaint(context.getHostelDetail.hostelId, loginContext.getToken, formData).then(r => {
          setLoading(true)

          setTimeout(() => {
            setLoading(false)
            if (r.status == 201) {
              setShowSuccessModal(true)
              setToastMessage("Complaint Added Successfully!")
              setModelType('success')

              setTimeout(() => {
                setShowSuccessModal(false);
                setShowSheet(false)
                setSelectedComplaintTypeId(0)
                setDespriction('')
                setAddComplaint(false)

                complaints(context.getHostelDetail.hostelId, loginContext.getToken).then(r => {
                  complaintContext.updateComplaintList(r?.data?.content)
                })
              }, 2000);

            }

          }, 2000);


        })

      }
      else if (complaintDescription.trim().length < 15) {
        setShowSuccessModal(true)
        setToastMessage("Comment should be above 15 letters")
        setModelType('error')

        setTimeout(() => {
          setShowSuccessModal(false)
        }, 2000);

      }

    } else {
      setShowSuccessModal(true)
      setToastMessage('select Complaint type')
      setModelType('error')

      setTimeout(() => {
        setShowSuccessModal(false)
      }, 2000);
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

  const bedRequestSubmit = () => {

    const data = {
      title: changeBed,
      description: bedType,
    }

    if (changeBed != null && bedType != null && urgencyType != null) {
      postRequestBedChange(context.getHostelDetail.hostelId, data, loginContext.getToken).then(r => {
        setLoading(true)

        setTimeout(() => {
          setLoading(false)

          if (r.status == 200) {
            setShowSuccessModal(true)
            setToastMessage('Request raised')
            setModelType('success')

            setTimeout(() => {
              setShowBedChange(false)
              setShowSuccessModal(false)
              setBedType(null)
              setChangeBed(null)
              setUrgencyType(null)
            }, 2000);
          }
          else if (r.status == 400) {
            setShowSuccessModal(true)
          }

        }, 2000);
      })

    }
    else {
      setShowSuccessModal(true)
      setToastMessage('Fill all Fields')
      setModelType('error')

      setTimeout(() => {
        setShowSuccessModal(false)
      }, 2000);
    }

  }

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
  const plan = (id) => {
    setPlan(id)
  }

  const onRequestAmenities = (amenityId) => {

    postRquestAmenties(context.getHostelDetail.hostelId, loginContext.getToken, amenityId).then(r => {
      console.log(r)
    })
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

  const handleReceiptPdfDownload = () => {
    setModalVisible(false);
    navigation.navigate("ReceiptPdfView");
  };

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
        return <MyStay onRequestBedChange={bedfn} hostel={props.route.params.hostel} jumpTo={jumpTo} />;
      case 'services':
        return <Services onOpen={handle} onSheet={addComplaint} onAmenities={handleAmenity} jumpTo={jumpTo} hostel={props.route.params.hostel} />;
      case 'payment':
        return <Payment onPayment={viewPay} hostel={props.route.params.hostel} jumpTo={jumpTo} />;
      default:
        return null;
    }
  };

  // ----------

  return <View style={style.mainDashb}>
    <LinearGradient
      colors={["#DAEEFF", "#FFFFFF"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ paddingTop: 25, paddingBottom: 15, width: "100%" }}
    >

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, width: width }}>

        <View style={{ flexDirection: 'row', width:width*0.67 }}>

           {context.getHostelDetail.hostelPic ? (
                    <Image
                      source={{ uri: context.getHostelDetail.hostelPic }}
                      style={style.hostelImage}/>
                  ) : (
                    <View style={[style.hostelImage, style.initialContainer]}>
                      <Text style={style.initialText}>
                        {context.getHostelDetail.hostelInitial?.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}

          <View style={{ marginLeft: 7 }}>
            <Text numberOfLines={1} ellipsizeMode="tail"
              style={{ fontSize: 18, fontWeight: '600', fontFamily: 'gilroy-semibold', color: '#1B1D21', flexShrink: 1, maxWidth: '90%' }}>
              {context.getHostelDetail.hostelName}
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={Location} style={{ width: 12.75, height: 14.17 }} />
              <Text style={{ marginLeft: 7, fontSize: 14, color: '#4B4B4B' }}>
                {context.getHostelDetail.city}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={handleNotificationShow} style={{marginRight:10}}>
            <Image source={require("../../assets/Images/notification.png")} style={{ height: 50, width: 50 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleProfile} style={{ marginRight: 10 }}>
                    {context.getCustomerDetail?.profilePic ? (
                    <Image
                      source={{ uri: context.getCustomerDetail?.profilePic }}
                      style={style.hostelImage}/>
                  ) : (
                    <View style={[style.hostelImage, style.initialContainer]}>
                      <Text style={style.initialText}>
                        {context.getCustomerDetail?.initials?.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}
          </TouchableOpacity>
        </View>
      </View>

    </LinearGradient>

    <View style={{ flex: 1, paddingLeft: 20, paddingRight: 20 }}>
      <TabView navigationState={{ index: index, routes }}
        commonOptions={{
          icon: ({ route, color }) => (<Image source={route.icon} style={{ width: 21.12, height: 21.12, tintColor: color }} />)
        }}
        renderTabBar={renderTabBar}
        renderScene={renderScene}
        onIndexChange={setindex}
        initialLayout={{ width: Dimensions.get('window').width }}
        style={{ flex: 1, justifyContent: 'center', marginTop: 10 }} />

    </View>

    {showSheet && (
      <View style={style.sheetOverlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>

        <Animated.View style={[selectedComplaint?.images?.length > 0 ? style.bottomSheetwithimage : style.bottomSheet, { transform: [{ translateY: sheetY }] }]}
          {...panResponder.panHandlers}>

          <View style={{ flex: 1 }}>
            <View {...panResponder.panHandlers}>
              <View style={style.dragindictor} />
            </View>

            {comment ? (
              <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: 400 }}>Comments</Text>
                  {/* Divider */}
                  <View style={{ height: 1, backgroundColor: "#eee", marginVertical: 10 }} />

                  <FlatList keyExtractor={(item) => item.commentId} showsVerticalScrollIndicator={false}
                    data={complaintContext.getComplaintComments} style={{ marginBottom: 20 }}
                    renderItem={({ item }) => {
                      return <View style={{ paddingTop: 15, flexDirection: 'row', flex: 1 }}>
                        <View>
                          <Image source={Customer} style={{ width: 35, height: 35 }} />
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
                </View>


                <View style={{ paddingBottom: 20 }}>
                  <View style={{ paddingTop: 3, paddingBottom: 4, borderWidth: 1, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TextInput value={sendComment} placeholder="Post your Reply here" onChangeText={setSendComment} />
                    <TouchableOpacity onPress={sendclick} style={{ paddingRight: 10 }}>
                      <Image source={SendButton} style={{ width: 34, height: 34 }} />
                    </TouchableOpacity>
                  </View>

                </View>

              </View>
            ) : (
              <View style={{ flex: 1 }}>
                {selectedComplaint && (
                  <ScrollView style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false} >
                    <View style={{ justifyContent: 'flex-end', flex: 1 }}>
                      <View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingLeft: 5, paddingRight: 8, marginBottom: 10, paddingTop: 10, }}>
                          <View>
                            <Text style={{ fontSize: 18, fontWeight: "500", fontFamily: "gilroy-semibold", }} >
                              {selectedComplaint.complaintTypeName}
                            </Text>
                            <Text style={{ fontSize: 12.8, fontWeight: "400", color: "#424242", marginTop: 6 }}>
                              {selectedComplaint.complaintDate}
                            </Text>
                          </View>

                          <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <TouchableOpacity onPress={() => { setShowEditComplaint(true) }} style={{ paddingRight: 10 }}>
                              <Image source={Edit} style={{ width: 17.72, height: 17.72 }} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => deleteClick(selectedComplaint.complaintId)} style={{ paddingLeft: 10 }}>
                              <Image source={Delete} style={{ width: 17.72, height: 17.72 }} />
                            </TouchableOpacity>
                          </View>
                        </View>

                        {/* -----Divider */}
                        <View style={{ height: 1, backgroundColor: "#eee", marginVertical: 10 }} />

                        {/* DESCRIPTION */}
                        <View style={{ paddingTop: 5 }}>
                          <Text style={{ fontSize: 12, fontWeight: "400", color: "#4B4B4B" }}>Description </Text>
                          <Text style={{ fontSize: 16, fontWeight: "400", marginTop: 9 }}>
                            {selectedComplaint.description}
                          </Text>
                        </View>

                        {/* ASSIGNED TO */}
                        <View style={{ paddingTop: 10 }}>
                          <Text style={{ fontSize: 12, fontWeight: "400", color: "#4B4B4B" }}> Assigned to</Text>

                          <View style={{ flexDirection: "row", justifyContent: "space-between", paddingTop: 8, }}>
                            {selectedComplaint.assigneeName != null ? <Text style={{ fontSize: 15, fontWeight: "500" }}>
                              {selectedComplaint.assigneeName}</Text>
                              : <Text style={{ fontSize: 14, fontWeight: "500", color: "#FF3B30", }}>
                                Not Assigned Yet
                              </Text>
                            }

                            {selectedComplaint.PhoneNO != null ?
                              <Text style={{ fontSize: 12, color: "#1E45E1", fontWeight: "400" }}>
                                {selectedComplaint.PhoneNO}
                              </Text> : null}
                          </View>
                        </View>

                        {/* ATTACHED IMAGES */}
                        <View style={{ paddingTop: 15 }}>
                          <Text style={{ fontSize: 12, fontWeight: "400", color: "#4B4B4B" }}> Attached images</Text>

                          <FlatList horizontal
                            style={{ paddingTop: 15 }}
                            keyExtractor={(item) => item.id.toString()}
                            data={selectedComplaint.images}
                            renderItem={({ item }) => {
                              console.log(item)
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

                      <View style={{ marginTop: 10 }} >
                        {/* COMMENT INPUT */}
                        <View style={{ paddingTop: 22 }}>
                          <View style={{ padding: 4, borderRadius: 10, borderWidth: 1, justifyContent: "space-between", flexDirection: "row", alignItems: "center", }} >
                            <TextInput value={sendComment} placeholder="Add your Comment" onChangeText={setSendComment} />
                            <TouchableOpacity onPress={sendComment ? sendclick : commentclick}>
                              <Image
                                source={sendComment ? SendButton : CommentMesg}
                                style={{ width: 23, height: 23, marginRight: 15, }} />
                            </TouchableOpacity>
                          </View>
                        </View>

                        {/* STATUS BUTTON */}
                        <TouchableOpacity>
                          <View
                            style={{
                              padding: 13, borderRadius: 10, borderWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 15, marginBottom: 20,
                              backgroundColor: selectedComplaint.status === "PENDING" ? "#FFEEEEA3" : selectedComplaint.status === "Inpogress" ? "#FFF6E7" : "lightgreen",
                              borderColor: selectedComplaint.status === "PENDING" ? "#FFD5D5" : selectedComplaint.status === "Inpogress" ? "#FFE7C6" : "lightgreen",
                            }}>
                            <Image source={Group}
                              style={{
                                width: 17.93, height: 18, marginTop: 4,
                                tintColor: selectedComplaint.status === "PENDING" ? "#FF3B30" : selectedComplaint.status === "Inpogress" ? "#FF9500" : "green",
                              }} />
                            <Text
                              style={{
                                color: selectedComplaint.status === "PENDING" ? "#FF3B30" : selectedComplaint.status === "Inpogress" ? "#FF9500" : "green",
                                fontSize: 14.11, fontWeight: "600", marginLeft: 10,
                              }}>
                              {selectedComplaint.status}
                            </Text>
                          </View>
                        </TouchableOpacity>

                      </View>
                    </View>
                  </ScrollView>
                )}
              </View>
            )}
          </View>

        </Animated.View>
      </View>
    )}

    {/* -----Edit complaint-------- */}

    {editCompliant && (
      <View style={style.sheetOverlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>

        <Animated.View style={[style.bottomsheets, { transform: [{ translateY: sheetY }] }]}
          {...panResponder.panHandlers}>

          <View style={{ flex: 1 }}>

            <View {...panResponder.panHandlers}>
              <View style={style.dragindictor} />
            </View>

            <AppLoader visible={loading} />
            <SuccessModal
              visible={showSuccessModal}
              onClose={() => setShowSuccessModal(false)}
              message="Complaint Added Successfully!"
              type="sucess"
            />

            <View style={{ paddingLeft: 5, paddingRight: 5, paddingTop: 20, justifyContent: 'space-between', flex: 1 }}>
              <View>
                <Text style={{ fontSize: 20, fontWeight: 600 }}>Edit complaint</Text>

                <View style={{ paddingTop: 20 }}>
                  <Text>Complaint type</Text>

                  <Dropdown style={{ borderWidth: 1, borderRadius: 10, paddingVertical: 10, marginTop: 10, borderColor: '#e5e5e5' }}
                    onFocus={() => setIsFocus(true)} onBlur={() => setIsFocus(false)}
                    data={complaintType}
                    containerStyle={{ borderRadius: 10, paddingLeft: 10 }}
                    placeholderStyle={{ fontSize: 14, paddingLeft: 10 }}
                    placeholder="Select a type"
                    labelField="complaintTypeName"
                    valueField="complaintTypeId"
                    value={selectedValue}

                    onChange={item => {

                      setSelectedValue(item.value)
                    }}
                    renderRightIcon={() => (
                      <Ionicons name={isFocus ? "chevron-up" : "chevron-down"}
                        size={22}
                        color="#000"
                        style={{ paddingRight: 10 }}
                      />
                    )} />
                </View>

                <View style={{ paddingTop: 16 }}>
                  <Text style={{ fontSize: 14, fontWeight: 400 }}>Complaint message</Text>
                  <View style={{ borderWidth: 1, borderRadius: 10, marginTop: 8, paddingTop: 7, paddingLeft: 10, borderColor: '#e5e5e5' }}>
                    <TextInput placeholder="Enter message" />
                  </View>
                </View>

                <View style={{ paddingTop: 16 }}>
                  <Text>Add Proof</Text>
                  <View >
                    <TouchableOpacity onPress={uploadimage} style={{
                      borderWidth: 1, borderRadius: 9, paddingTop: 22, paddingBottom: 22,
                      paddingLeft: 24, paddingRight: 24, borderColor: '#e5e5e5', marginTop: 8, flexDirection: 'row', alignItems: 'center'
                    }}>
                      <View>
                        <Image source={CameraPic} style={{ width: 32.77, height: 32.77 }} />
                      </View>
                      <View style={{ paddingLeft: 22 }}>
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={{ color: '#1E45E1', fontSize: 12, fontWeight: 500 }}>Choose file</Text>
                          <Text style={{ fontSize: 12, fontWeight: 500 }}> to Upload</Text>
                        </View>
                        <Text style={{ fontSize: 11, fontWeight: 400, marginTop: 5 }}>Must be in PNG, JPG Format </Text>
                      </View>
                    </TouchableOpacity>

                  </View>
                </View>

                <View>
                  {mediaimage.length > 0 ? <FlatList horizontal showsHorizontalScrollIndicator={true} style={{ paddingTop: 20 }} key={(item) => item.id}
                    data={mediaimage}
                    renderItem={({ item }) => {
                      console.log(item)
                      return <View style={{ padding: 5 }}>
                        <Image source={{ uri: item }} style={{ width: 80, height: 70, borderRadius: 5 }} />
                      </View>
                    }} /> : null}
                </View>

              </View>


              <View style={{ paddingBottom: 20 }}>
                <TouchableOpacity style={{ paddingTop: 12, paddingBottom: 12, borderWidth: 1, borderRadius: 22, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1E45E1', borderColor: '#1E45E1' }}>
                  <Text style={{ fontSize: 14, fontWeight: 600, color: '#ffffff' }}>Submit</Text>
                </TouchableOpacity>
              </View>

            </View>

          </View>

        </Animated.View>
      </View>
    )}


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
              <TextInput placeholder="Enter the reason" style={{ marginLeft: 5 }} />
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

    {addComplaints && (
      <View style={style.sheetOverlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>

        <Animated.View style={[style.bottomsheets, { transform: [{ translateY: sheetY }] }]}
          {...panResponder.panHandlers}>

          <View style={{ flex: 1 }}>

            <View {...panResponder.panHandlers}>
              <View style={style.dragindictor} />
            </View>

            <AppLoader visible={loading} />
            <SuccessModal
              visible={showSuccessModal}
              onClose={() => setShowSuccessModal(false)}
              message={toastMessage}
              type={modelType}
            />
            <View style={{ paddingTop: 10, justifyContent: 'space-between', flex: 1 }}>
              <View>
                <Text style={{ fontSize: 20, fontWeight: 600 }}>Add complaint</Text>

                <View style={{ paddingTop: 20 }}>
                  <Text>Complaint type
                    <Text style={{ color: 'red' }}> *</Text>
                  </Text>

                  <Dropdown style={{ borderWidth: 1, borderRadius: 10, paddingVertical: 10, marginTop: 10, borderColor: '#e5e5e5', paddingLeft: 15 }}
                    onFocus={() => setIsFocus(true)} onBlur={() => setIsFocus(false)}
                    data={complaintType}
                    containerStyle={{ borderRadius: 10, paddingLeft: 10 }}
                    placeholderStyle={{ fontSize: 14 }}
                    placeholder="Select a type"
                    labelField="complaintTypeName"
                    valueField="complaintTypeId"
                    value={selectedComplaintTypeId}

                    onChange={item => {
                      setSelectedComplaintTypeId(item.complaintTypeId)
                      setSelectedValue(item.value)
                    }}
                    renderRightIcon={() => (
                      <Ionicons name={isFocus ? "chevron-up" : "chevron-down"}
                        size={22}
                        color="#000"
                        style={{ paddingRight: 10 }}
                      />
                    )} />
                </View>

                <View style={{ paddingTop: 16 }}>
                  <Text style={{ fontSize: 14, fontWeight: 400 }}>Complaint message
                    <Text style={{ color: 'red' }}> *</Text>
                  </Text>
                  <View style={{ borderWidth: 1, borderRadius: 10, marginTop: 8, paddingTop: 7, paddingLeft: 10, borderColor: '#e5e5e5', height: 80 }}>
                    <TextInput value={complaintDescription} placeholder="Enter message" onChangeText={(value) => setDespriction(value)} />
                  </View>
                </View>

                <View style={{ paddingTop: 16 }}>
                  <Text>Add Proof</Text>
                  <View >
                    <TouchableOpacity onPress={uploadimage} style={{
                      borderWidth: 1, borderRadius: 9, paddingTop: 22, paddingBottom: 22,
                      paddingLeft: 24, paddingRight: 24, borderColor: '#e5e5e5', marginTop: 8, flexDirection: 'row', alignItems: 'center'
                    }}>
                      <View>
                        <Image source={CameraPic} style={{ width: 32.77, height: 32.77 }} />
                      </View>
                      <View style={{ paddingLeft: 22 }}>
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={{ color: '#1E45E1', fontSize: 12, fontWeight: 500 }}>Choose file</Text>
                          <Text style={{ fontSize: 12, fontWeight: 500 }}> to Upload</Text>
                        </View>
                        <Text style={{ fontSize: 11, fontWeight: 400, marginTop: 5 }}>Must be in PNG, JPG Format </Text>
                      </View>
                    </TouchableOpacity>

                  </View>
                </View>


                <View>
                  {mediaimage.length > 0 ? <FlatList horizontal showsHorizontalScrollIndicator={true} style={{ paddingTop: 20 }} key={(item) => item.id}
                    data={mediaimage}
                    // keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => {
                      console.log(item)
                      return <View style={{ padding: 5 }}>
                        <Image source={{ uri: item }} style={{ width: 80, height: 70, borderRadius: 5 }} />
                      </View>
                    }} /> : null}
                </View>

              </View>

              <View style={{ paddingBottom: 20 }}>
                <TouchableOpacity onPress={submitClick}

                  style={{
                    paddingTop: 12, paddingBottom: 12, borderRadius: 22, justifyContent: 'center',
                    backgroundColor: selectedComplaintTypeId === 0 || !complaintDescription || complaintDescription.trim().length < 15 ? '#9EB3FF' : '#1E45E1',
                    alignItems: 'center'
                  }}>
                  <Text style={{ fontSize: 14, fontWeight: 600, color: '#ffffff' }}>Submit</Text>
                </TouchableOpacity>
              </View>

            </View>

          </View>

        </Animated.View>
      </View>
    )}

    {/* ------show Amenities-------- */}

    {showAmenities && (
      <View style={style.sheetOverlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>

        <Animated.View style={[style.amenitiesBottomSheet, { transform: [{ translateY: sheetY }] }]}
          {...panResponder.panHandlers}>

          <View style={{ flex: 1 }}>

            <View {...panResponder.panHandlers}>
              <View style={style.dragindictor} />
            </View>

            <SuccessModal
              visible={showSuccessModal}
              onClose={() => setShowSuccessModal(false)}
              message="Complaint Added Successfully!"
              type="sucess"
            />

            <View style={{ paddingLeft: 10, paddingRight: 15, flex: 1 }}>
              {tag == 'My-Amenities' ? (<View>
                <View style={{ paddingTop: 12 }}>
                  {myAmenitis && <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 23, fontWeight: 500, fontStyle: 'Gilroy-Semibold' }}>{myAmenitis.amenityName}</Text>
                      <View style={{ justifyContent: 'center', paddingTop: 7 }}>
                        <Image source={Dot} style={{ width: 30.85, height: 30.85 }} />

                      </View>

                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 5 }}>
                      <View style={{ width: '58%', height: 1, backgroundColor: "#eee", marginTop: 10 }} />
                      <View >
                        <TouchableOpacity style={{
                          borderWidth: 1, borderColor: '#eee', paddingTop: 9, paddingBottom: 14, paddingHorizontal: 20,
                          borderRadius: 5, flexDirection: 'row', justifyContent: 'center'
                        }}>
                          <Image source={calenderTick} style={{ width: 16, height: 16, marginTop: 3 }} />
                          <Text style={{ marginLeft: 5, fontSize: 14, fontWeight: 400 }}>Make Deactive</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View>
                      <Text style={{ fontSize: 12, fontWeight: 40, color: '#4B4B4B' }}>Description</Text>
                      <Text style={{ marginTop: 13, fontSize: 16, fontWeight: 400 }}>
                        Airtel Fiber 5G/100mpb
                      </Text>
                    </View>

                    <View style={{ paddingTop: 18 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 12, fontWeight: 400, color: '#4B4B4B' }}>Price plans</Text>
                        <TouchableOpacity>
                          <Text style={{ fontSize: 12, color: '#1E45E1' }}>Change Plan</Text>
                        </TouchableOpacity>
                      </View>
                      <Text style={{ fontSize: 16, fontWeight: 600, marginTop: 9 }}>{'\u20B9'}{myAmenitis.amenityAmount} /month</Text>
                    </View>

                    <View style={{ paddingTop: 15 }}>
                      <Text style={{ fontSize: 12, fontWeight: 400, color: '#4B4B4B' }}>Next Bill</Text>
                      <Text style={{ fontSize: 16, fontWeight: 600, marginTop: 9 }}>10 sept Bill</Text>
                    </View>

                    <TouchableOpacity style={{ paddingVertical: 13, borderWidth: 1, borderRadius: 10, alignItems: 'center', backgroundColor: '#F5FFF8', borderColor: '#77D391', marginTop: 30 }}>
                      <Text style={{ fontSize: 14.11, fontWeight: 600, color: '#00A32E' }}>Active</Text>
                    </TouchableOpacity>


                  </View>}


                </View>
              </View>) : tag == null ? (<View style={{ flex: 1 }}>

                {available && <View style={{ paddingTop: 10, flex: 1, paddingBottom: 20 }}>
                  <Text style={{ fontSize: 23, fontWeight: 500 }}>{available.amenityName}</Text>
                  <View style={{ width: '100%', height: 1, backgroundColor: "#eee", marginTop: 18 }} />
                  <View style={{ justifyContent: 'space-between', flex: 1 }}>
                    <View style={{ paddingTop: 10 }}>
                      <Text style={{ fontSize: 12, fontWeight: 400, color: '#4B4B4B' }}>Description</Text>

                      <View style={{ paddingTop: 14 }}>
                        <Text style={{ fontSize: 16, fontWeight: 400, marginBottom: 2 }}>Gear,Non Gear</Text>
                        <Text style={{ fontSize: 16, fontWeight: 400, marginTop: 2 }}>24/7 Access, pickup lopp from lobby</Text>
                      </View>

                      <View style={{ paddingTop: 20 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <Text style={{ fontSize: 12, fontWeight: 400, color: '#4B4B4B' }}>Price Plans</Text>
                          <TouchableOpacity>
                            <Text style={{ fontSize: 12, fontWeight: 400, color: '#1E45E1', textDecorationLine: 'underline' }}>Select plan</Text>
                          </TouchableOpacity>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <View style={{ paddingTop: 10, flexDirection: 'row' }}>
                            <Text style={{ fontSize: 16, fontWeight: 600 }}>{'\u20B9'}{available.amenityAmount}</Text>
                            <Text style={{ fontSize: 16, fontWeight: 400, color: '#4B4B4B' }}>/month</Text>
                          </View>

                          <TouchableOpacity onPress={() => plan('plan')} style={{
                            borderWidth: 2, width: 20, height: 20, borderRadius: 10,
                            borderColor: plan == 'plan' ? borderColor : monthlyplan == 'plan' ? "#1E45E1" : "#ccc", justifyContent: 'center', marginTop: 12
                          }}>

                            <View style={{ justifyContent: 'center', alignItems: 'center' }}  >

                              {monthlyplan === 'plan' && (
                                <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: "#1E45E1" }} />
                              )}
                            </View>
                          </TouchableOpacity>

                        </View>

                      </View>
                    </View>
                    <View >
                      <TouchableOpacity onPress={() => onRequestAmenities(available.amenityId)}
                        style={{ backgroundColor: '#1d41d5', paddingVertical: 12, alignItems: 'center', borderRadius: 20 }}>
                        <Text style={{ fontSize: 14.11, fontWeight: 600, color: '#ffffff' }}>Request Amenity</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                </View>}
              </View>) : null}


            </View>

          </View>

        </Animated.View>
      </View>
    )}

    {/* -----Request bed change--------- */}

    {showBedChange && (
      <View style={style.sheetOverlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>

        <Animated.View style={[style.bottomsheets, { transform: [{ translateY: sheetY }] }]}
          {...panResponder.panHandlers}>

          <View style={{ flex: 1 }}>

            <View {...panResponder.panHandlers}>
              <View style={style.dragindictor} />
            </View>

            <AppLoader visible={loading} />
            <SuccessModal
              visible={showSuccessModal}
              onClose={() => setShowSuccessModal(false)}
              message={toastMessage}
              type={modelType}
            />

            <View style={{ paddingTop: 15, justifyContent: 'space-between', flex: 1 }}>
              <View>
                <Text style={{ fontSize: 20, fontWeight: 600 }}>Request Bed Change</Text>

                <View style={{ paddingTop: 20 }}>
                  <Text style={{ fontSize: 12, fontWeight: 400 }}>Current Bed</Text>

                  <View style={{
                    backgroundColor: '#F6F8FF', borderRadius: 10, paddingVertical: 17,
                    paddingHorizontal: 8, marginTop: 10, flexDirection: 'row'
                  }}>
                    <View style={{ backgroundColor: '#F9D796', paddingVertical: 4.64, paddingHorizontal: 9.28, alignSelf: 'flex-start', borderRadius: 46.38 }}>
                      <Text style={{ color: '#642B00', fontSize: 10.82, fontWeight: 400 }}>
                        {context.getCustomerDetail?.bookingDetails?.floorName}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', paddingLeft: 20, alignItems: 'center' }}>
                      <Image source={Room} style={{ width: 21.17, height: 21.17 }} />
                      <Text style={{ marginLeft: 10, fontSize: 15.97, fontWeight: 400 }}>
                        {context.getCustomerDetail?.bookingDetails?.roomName}
                      </Text>
                    </View>

                    <View style={{ flexDirection: 'row', paddingLeft: 10, alignItems: 'center' }}>
                      <Image source={Bed} style={{ width: 21.17, height: 21.17 }} />
                      <Text style={{ marginLeft: 10, fontSize: 15.97, fontWeight: 400 }}>
                        {context.getCustomerDetail?.bookingDetails?.bedName}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={{ paddingTop: 15 }}>
                  <Text style={{ fontSize: 14, fontWeight: 400 }}>Reason for Bed change
                    <Text style={{ color: 'red' }}> *</Text>
                  </Text>

                  <Dropdown ref={bedDropdownRef}
                    style={{
                      borderWidth: 1,
                      borderRadius: 10,
                      paddingVertical: 15,
                      marginTop: 10,
                      borderColor: '#e5e5e5',
                      paddingLeft: 10,
                    }}
                    onClose={focusReason}
                    data={bed}
                    labelField="label"
                    valueField="value"
                    value={changeBed}
                    placeholder="Select Reason"
                    placeholderStyle={{ fontSize: 14, paddingRight: 10 }}
                    selectedTextStyle={{ fontSize: 15, fontWeight: '400' }}
                    containerStyle={{ borderRadius: 10, paddingLeft: 10 }}

                    onFocus={() => setFocusReason(true)}
                    onBlur={() => setFocusReason(false)}

                    onChange={item => {
                      setChangeBed(item.value);
                    }}

                    renderRightIcon={() => (
                      <Ionicons
                        name={focusReason ? 'chevron-up' : 'chevron-down'}
                        size={22}
                        color="#000"
                        style={{ paddingRight: 10 }}
                      />
                    )}

                    renderItem={(item) => {
                      const isSelected = item.value === changeBed;
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            setChangeBed(item.value);
                            setFocusReason(false); // Close dropdown on item press
                            bedDropdownRef.current?.close();
                          }}
                          style={{
                            paddingVertical: 14,
                            paddingHorizontal: 14,
                            borderRadius: 10,
                            marginVertical: 5,
                            marginRight: 10,
                            marginTop: 10,
                            backgroundColor: isSelected ? '#1D4ED8' : '#F5F5F5',
                          }}
                        >
                          <Text style={{ color: isSelected ? '#fff' : '#000', fontSize: 15 }}>
                            {item.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    }}
                  />


                </View>

                <View style={{ paddingTop: 15 }}>
                  <Text style={{ fontSize: 14, fontWeight: 400 }}>Preffered Bed Type
                    <Text style={{ color: 'red' }}> *</Text>
                  </Text>

                  <Dropdown ref={bedTypeDropdow}
                    style={{
                      borderWidth: 1, borderRadius: 10, paddingVertical: 15,
                      marginTop: 10, borderColor: '#e5e5e5', paddingLeft: 10
                    }}
                    onFocus={() => setIsFocus(true)} onBlur={() => setIsFocus(false)}
                    data={selectBed}
                    containerStyle={{ borderRadius: 10, paddingLeft: 10 }}
                    placeholderStyle={{ fontSize: 14, paddingRight: 10 }}
                    selectedTextStyle={{ fontSize: 15, fontWeight: 400 }}
                    placeholder="Select Reason"
                    labelField='label'
                    valueField='value'
                    value={bedType}

                    onChange={item => {
                      setBedType(item.value)
                    }}

                    renderRightIcon={() => (
                      <Ionicons name={isFocus ? "chevron-up" : "chevron-down"} size={22} color="#000"
                        style={{ paddingRight: 10 }} />
                    )}

                    renderItem={(item, index) => {
                      const isSelected = item.value === bedType;

                      return (
                        <TouchableOpacity onPress={() => {
                          setBedType(item.value)
                          setFocusReason(false)
                          bedTypeDropdow.current?.close();
                        }}
                          style={{
                            paddingVertical: 14,
                            paddingHorizontal: 14,
                            borderRadius: 10,
                            marginVertical: 5,
                            marginRight: 10,
                            marginTop: 10,
                            backgroundColor: isSelected ? "#1D4ED8" : "#F5F5F5",
                          }}
                        >
                          <Text
                            style={{ color: isSelected ? "#fff" : "#000", fontSize: 15, }}>
                            {item.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    }}

                  />
                </View>

                <View style={{ paddingTop: 15 }}>
                  <Text>Bed Change Urgency
                    <Text style={{ color: 'red' }}> *</Text>
                  </Text>

                  <Dropdown ref={urgencyDropdown}
                    style={{
                      borderWidth: 1, borderRadius: 10, paddingVertical: 15, borderColor: '#e5e5e5',
                      marginTop: 10, paddingLeft: 10
                    }}
                    onFocus={() => setIsFocus(true)} onBlur={() => setIsFocus(false)}
                    data={urgency}
                    containerStyle={{ borderRadius: 10, paddingLeft: 10 }}
                    placeholderStyle={{ fontSize: 14, paddingRight: 10 }}
                    selectedTextStyle={{ fontSize: 15, fontWeight: 400 }}
                    placeholder="Select Reason"
                    labelField="label"
                    valueField="value"
                    value={urgencyType}

                    onChange={item => {
                      setUrgencyType(item.value)
                    }}

                    renderRightIcon={() => (
                      <Ionicons name={focusReason ? "chevron-up" : "chevron-down"} size={22} color="#000"
                        style={{ paddingRight: 10 }} />
                    )}

                    renderItem={(item, index) => {
                      const isSelected = item.value === urgencyType;

                      return (
                        <TouchableOpacity onPress={() => {
                          setUrgencyType(item.value)
                          setFocusReason(false)
                          urgencyDropdown.current?.close();
                        }}
                          style={{
                            paddingVertical: 14, paddingHorizontal: 14, borderRadius: 10,
                            marginVertical: 5, marginRight: 10, marginTop: 10,
                            backgroundColor: isSelected ? "#1D4ED8" : "#F5F5F5",
                          }}
                        >
                          <Text
                            style={{ color: isSelected ? "#fff" : "#000", fontSize: 15, fontWeight: 400 }}>
                            {item.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    }}
                  />
                </View>

              </View>

              <TouchableOpacity onPress={bedRequestSubmit}
                style={{
                  paddingVertical: 16, paddingHorizontal: 32, borderRadius: 50,
                  backgroundColor: changeBed != null && bedType != null && urgencyType != null ? '#1E45E1' : '#788fed',
                  alignItems: 'center', marginBottom: 15
                }} disabled={changeBed == null && bedType == null && urgencyType == null ? true : false}>
                <Text style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF' }}>Submit Request</Text>
              </TouchableOpacity>

            </View>
          </View>
        </Animated.View>

      </View>
    )}

    {/* ----------Payment------ */}

    {modalVisible && (
      <View style={style.sheetOverlay}>

        {/* Tap outside to close */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[style.bottomSheetPay, { transform: [{ translateY: sheetY }] }]}
          {...panResponder.panHandlers}
        >
          <View {...panResponder.panHandlers}>
            <View style={style.dragindictor} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {paymentContext.getInvoiceDetail && (
              <>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                  <Text style={style.modalTitle}>{paymentContext.getInvoiceDetail.title}</Text>

                  <View style={{ flexDirection: "row" }}>
                    <Text style={style.invoiceId}>{paymentContext.getInvoiceDetail.invoiceNumber}</Text>
                    <TouchableOpacity
                      onPress={() => handleReceiptPdfDownload(staticReceiptData)}
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

                  <View>
                    <Text style={style.totalAmount}>
                      ₹{paymentContext.getInvoiceDetail.totalAmount.toFixed(2)}
                    </Text>

                    {paymentContext.getInvoiceDetail.status === "Pending" && (
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

                    {(paymentContext.getInvoiceDetail.status === "Partially Paid to" ||
                      paymentContext.getInvoiceDetail.status === "Paid to") && (
                        <View style={{ flexDirection: "row", marginTop: 6 }}>
                          <Image
                            source={PaidIcon}
                            style={{ width: 20, height: 20 }}
                          />
                          <Text style={{ fontSize: 14, marginLeft: 6 }}>
                            {paymentContext.getInvoiceDetail.status === "Partially Paid to"
                              ? "Partially Paid"
                              : "Full Paid"}
                          </Text>
                        </View>
                      )}
                  </View>
                </View>

                {/* Details */}
                <View style={style.detailsSection}>
                  <View style={style.row}>
                    <Text style={style.detailLabel}>Actual Rent</Text>
                    <Text style={style.detailValue}>₹{}</Text>
                  </View>

                  <View style={style.row}>
                    <Text style={style.detailLabel}>Taxes GST 10%</Text>
                    <Text style={style.detailValue}>₹{paymentContext.getInvoiceDetail.gst}</Text>
                  </View>

                  {paymentContext.getInvoiceDetail.paid === "partial" && (
                    <>
                      <View style={style.row}>
                        <Text style={style.detailLabel}>Paid Amount</Text>
                        <Text style={style.detailValue}>₹3500.00</Text>
                      </View>

                      <View style={style.row}>
                        <Text style={style.detailLabel}>Remain</Text>
                        <View>
                          <Text style={style.detailValue}>₹2500.00</Text>
                          <Text style={style.payBillText}>Pay Bill</Text>
                        </View>
                      </View>
                    </>
                  )}
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
                    {selectedPayment.status === "Pending" ? "Due Date" : "Paid Date"}
                  </Text>
                  <Text style={style.paiddetailValue}>{paymentContext.getInvoiceDetail.dueDate}</Text>
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
                      <Text style={style.paiddetailValue}>UPI</Text>
                    </View>

                    <View style={style.Billbottom}>
                      <Text style={style.paiddetailLabel}>Reference number</Text>
                      <Text style={style.paiddetailValue}>#RSIN001</Text>
                    </View>
                  </View>
                )}

                {/* Buttons */}
                <View style={style.buttonRow}>
                  {paymentContext.getInvoiceDetail.status === "Pending" ? (
                    <>
                      <TouchableOpacity
                        style={style.shareBtn}
                        onPress={handleDownload}
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
                        onPress={handleDownload}
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
            )}
          </ScrollView>
        </Animated.View>
      </View>
    )}

  </View>

}

const style = StyleSheet.create({
  mainDashb: { flex: 1, backgroundColor: '#ffffff', position: 'relative' },
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
    height: height * 0.65,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 5
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
    height: '50%', backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 20,
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
    marginVertical: 3,
  },
  detailLabel: { fontSize: 13, color: "rgba(31, 38, 51, 1)" },
  detailValue: { fontSize: 15, fontWeight: "600", color: "rgba(31, 38, 51, 1)" },
  payBillText: { fontSize: 13, color: "#0057FF", fontWeight: "600", marginLeft: 10, marginTop: 5 },
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
  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginTop: 6,
    alignItems:'center'
  },
  statusText: { fontSize: 12, fontWeight: "500" },
  hostelImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
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
})
export default Dashboard;
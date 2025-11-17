import React, { useState, useMemo, useCallback, useRef, useEffect, useContext } from "react";
import { View, Text, Dimensions, Image, TouchableOpacity, Button, FlatList, TextInput, StyleSheet } from "react-native";
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
import { getComplaints, hostelDetails } from "../../Action/HostelAction";
import { UsersContext } from "../../Context/UserContext";


function Dashboard(props) {

  const context=useContext(UsersContext)

  console.log(props)

  const navigation = useNavigation();
  const [index, setindex] = useState(0);
  const [type, setType] = useState();
  const [data, setData] = useState();
  const [selectedComplaint, setSelectComplaint] = useState(null);
  const [comment, setComment] = useState(false)
  const [imageid, setimageid] = useState();
  const [commentnote, setCommentNote] = useState(null)
  const [commentMessage, setCommentmessage] = useState();
  const [selectedValue, setSelectedValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [mediaimage, setmediaImage] = useState([])
  const [tag, setTag] = useState(null);
  const [myAmenitis, setmyAminites] = useState(null)
  const [available, setAvailable] = useState(null)
  const [showPopUp, setShowPopUp] = useState(false)
  const [selectedReason, setSelectedReason] = useState(null);
  const [monthlyplan,setPlan]=useState();
  const [deletevisible,setdeleteVisible]=useState(false)



  const complainttype = [{ label: 'Plumbing', value: '1' }, { label: 'Electricity', value: '2' }, { label: 'Room Maintanence', value: '3' }, { label: 'Canteen food', value: '4' }, { label: 'Canteen food', value: '4' }]


  const images = [{ id: 1, source: Damage1 }, { id: 2, source: Damage2 }, { id: 3, source: Damage3 }]
  useEffect(() => {
    const data = [{ id: 1, person: 'You', comment: 'When will solve', date: '20 Jan -12.35pm' }, { id: 2, person: 'Priya', comment: 'Complaint assigned and rectify soon', date: '21 Jan -11.35pm' }, { id: 3, person: 'You', comment: 'Thank you', date: '21 Jan -2.35pm' }]
    setCommentNote(data)
  }, [])


  const handleNotificationShow = () => {
    navigation.navigate("Notification");
  };



  const handleProfile = () => {
    navigation.navigate("CustomerProfile");
  };

  const sheetRef = useRef(null)
  const snapPoints = useMemo(() => ['25%', '60%'], [])

  const handleOpen = (complaint, value) => {

    sheetRef.current?.snapToIndex(value);

    getComplaints(props.route.params.hostel[0].hostelId,complaint.complaintId,context.getToken).then(r=>{
      setSelectComplaint(r.data)
    })
    
  }

  const commentclick = () => {
    setComment(true)
  }

  const imageclick = (id) => {
    setdeleteVisible(true)
    setimageid(id)
  }

  const handleClose = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  const textmessage = (value) => {
    setCommentmessage(value)
  }
  const sendclick = () => {
    const data = {
      id: 4, person: 'you', comment: commentMessage, date: '24 Jan -12.35pm'
    }
    setCommentNote(data)
  }

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior='close'
        opacity={0.4} // optional if you want darker tint
        enableTouchThrough={false}
        style={{ ...StyleSheet.absoluteFillObject }}
        onPress={()=>{
          setComment(false)
          setSelectComplaint()
        }}

      />
    ),
    []
  );
  // ---------Add compalint-----
  const shetRef = useRef(null)

  const snappoint = useMemo(() => ['90%'], [])

  const handle = (value) => {

    shetRef.current?.snapToIndex(value);

  }

  const uploadimage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaTypes: 'photo',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      console.log(result)
      setmediaImage([...mediaimage, result.assets[0].uri])
    } catch (error) {
      console.log(error)

    }
  }

  // -------Amenities click------
  const ref = useRef(null)

  const snap = useMemo(() => ['50%'], [])

  const handleAmenity = (item, value, tag) => {
    if (tag == 'My-Amenities') {
      ref.current?.snapToIndex(value);
      setmyAminites(item)
      setTag(tag)
    }
    else {
      ref.current?.snapToIndex(value)
      setAvailable(item)
      setTag(null)
    }
  }

  const plan=(id)=>{
    setPlan(id)
  }
  // -----Editclick Bottom sheet-----

  const shtRef = useRef(null)
  const snappint = useMemo(() => ['90%'], [])

  const editClick = (value) => {
    shtRef.current?.snapToIndex(value)

  }
  // -----
  const deleteClick = () => {
    setShowPopUp(true)
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

  const cancel=()=>{
    setShowPopUp(false)
    setSelectedReason(null)
  }
  const deleteItem=()=>{
    setShowPopUp(false)
    setSelectedReason(null)
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

  const renderScene = ({ route,jumpTo }) => {
    switch (route.key) {
      case 'mystay':
        return <MyStay hostel={props.route.params.hostel} jumpTo={jumpTo}/>;
      case 'services':
        return <Services  onOpen={handleOpen} onSheet={handle} onAmenities={handleAmenity} jumpTo={jumpTo} hostel={props.route.params.hostel}/>;
      case 'payment':
        return <Payment jumpTo={jumpTo} />;
      default:
        return null;
    }
  };

  // ----------

 

console.log(available)

  return <View style={style.mainDashb}>
    <View style={style.container}>
      <View style={{display: 'flex', flexDirection: 'row' }}>

        <View >
          <Image source={HostelProfile} resizeMode="contain" style={{ marginTop: 2, marginLeft: 4, height: 44, width: 44 }} />
        </View>

        <View style={{ paddingLeft: 7 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', paddingBottom: 5, fontFamily: 'gilroy-semibold', color: '#1B1D21' }}>
            {props.route.params.hostel[0].hostelName}
          </Text>

          <View style={{flexDirection: 'row', alignItems: 'center' }}>

            <Image source={Location} style={{ width: 12.75, height: 14.17 }} />

            <Text style={{ marginLeft: 7, fontSize: 14, alignItems: 'center', color: '#4B4B4B' }}>
              {props.route.params.hostel[0].city}
            </Text>
          </View>

        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <View >
          <TouchableOpacity onPress={handleNotificationShow}>
            <Image source={require("../../assets/Images/notification.png")} resizeMode="contain" style={{ height: 44, width: 44 }} />
          </TouchableOpacity>
        </View>

        <View style={{ paddingLeft: 10 }}>
          <TouchableOpacity onPress={handleProfile}>
            <Image source={require("../../assets/Images/Customer_Icon.png")} resizeMode="contain" style={{ width: 44, height: 44, borderRadius: 22 }} />
          </TouchableOpacity>
        </View>
      </View>
    </View>

    <View style={{ flex: 1, paddingLeft: 20, paddingRight: 20 }}>
      <TabView navigationState={{ index, routes }}
        commonOptions={{
          icon: ({ route, color }) => (<Image source={route.icon} style={{ width: 21.12, height: 21.12, tintColor: color }} />)
        }}
        renderTabBar={renderTabBar}
        renderScene={renderScene}
        onIndexChange={setindex}
        initialLayout={{ width: Dimensions.get('window').width }}
        style={{ flex: 1, justifyContent: 'center', marginTop: 10 }} />

    </View>

    {/* -------BOTTOMSHEET--------- */}

    <BottomSheet ref={sheetRef} index={-1} snapPoints={snapPoints} enableDynamicSizing={false} enablePanDownToClose={true}
      backgroundStyle={{
        backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, borderWidth: 1,
        borderColor: '#ccc'
      }} handleIndicatorStyle={{ backgroundColor: '#aaa' }} backdropComponent={renderBackdrop}>

      <View style={{ flex: 1, paddingLeft: 20, paddingRight: 20 }}>
        {comment ? (
          <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <View>
              <Text style={{fontSize:18,fontWeight:400}}>Comments</Text>
              {/* Divider */}
              <View style={{ height: 1, backgroundColor: "#eee", marginVertical: 10 }} />

              <FlatList keyExtractor={(item) => item.id}
                data={commentnote}
                renderItem={({ item }) => {
                  return <View style={{ paddingTop: 15, flexDirection: 'row', flex: 1 }}>
                    <View>
                      <Image source={Customer} style={{ width: 35, height: 35 }} />
                    </View>
                    <View style={{ paddingLeft: 10, flex: 1 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 12, color: '#4B4B4B', fontWeight: 400 }}>{item.person}</Text>
                        <Text style={{fontSize:10,fontWeight:400,color:'#6E6E6E'}}>{item.date}</Text>
                      </View>
                      <Text style={{fontSize: 14, fontWeight: 400, marginTop: 5}}>{item.comment}</Text>
                    </View>
                  </View>
                }} />
            </View>


            <View style={{ paddingBottom: 20 }}>
              <View style={{ paddingTop: 3, paddingBottom: 4, borderWidth: 1, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <TextInput value={commentMessage} placeholder="Post your Reply here" onChangeText={textmessage} />
                <TouchableOpacity onPress={sendclick} style={{ paddingRight: 10 }}>
                  <Image source={SendButton} style={{ width: 34, height: 34 }} />
                </TouchableOpacity>

              </View>

            </View>



          </View>
        ) : (
          <View style={{flex:1}}>
            {selectedComplaint && (
              <View style={{justifyContent:'space-between',flex:1}} >
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
                    <TouchableOpacity onPress={() => editClick(0)} style={{ paddingRight: 10 }}>
                      <Image source={Edit} style={{ width: 17.72, height: 17.72 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={deleteClick} style={{ paddingLeft: 10 }}>
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
                    data={images}
                    renderItem={({ item }) => (
                      <View key={item.id}
                        style={{ paddingLeft: 10, position: "relative" }}>
                        <TouchableOpacity onPress={() => imageclick(item.id)}>
                          <Image source={item.source} style={{ width: 90, height: 70, borderRadius: 5 }} />
                          {imageid === item.id && deletevisible && (
                            <TouchableOpacity style={{ position: "absolute", bottom: 25, right: 35, }} >
                              <Image source={Trash} style={{ width: 21.09, height: 21.09, }} />
                            </TouchableOpacity>
                          )}
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                  </View>
                </View>
                
              <View>
                      {/* COMMENT INPUT */}
                <View style={{ paddingTop: 22 }}>
                  <View style={{ padding: 4, borderRadius: 10, borderWidth: 1, justifyContent: "space-between", flexDirection: "row", alignItems: "center", }} >
                    <TextInput placeholder="Add your Comment" />
                    <TouchableOpacity onPress={commentclick}>
                      <Image
                        source={CommentMesg}
                        style={{ width: 23, height: 23, marginRight: 15, }} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* STATUS BUTTON */}
                <TouchableOpacity>
                  <View
                    style={{
                      padding: 13, borderRadius: 10, borderWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 15,marginBottom:20,
                      backgroundColor: selectedComplaint.status === "Pending" ? "#FFEEEEA3" : selectedComplaint.status === "Inpogress" ? "#FFF6E7" : "lightgreen",
                      borderColor: selectedComplaint.status === "Pending" ? "#FFD5D5" : selectedComplaint.status === "Inpogress" ? "#FFE7C6" : "lightgreen",
                    }}>
                    <Image source={Group}
                      style={{
                        width: 17.93, height: 18, marginTop: 4,
                        tintColor: selectedComplaint.status === "Pending" ? "#FF3B30" : selectedComplaint.status === "Inpogress" ? "#FF9500" : "green",
                      }} />
                    <Text
                      style={{
                        color: selectedComplaint.status === "Pending" ? "#FF3B30" : selectedComplaint.status === "Inpogress" ? "#FF9500" : "green",
                        fontSize: 14.11, fontWeight: "600", marginLeft: 10,
                      }}>
                      {selectedComplaint.status}
                    </Text>
                  </View>
                </TouchableOpacity>

              </View>
                
              </View>
            )}
          </View>
        )}
      </View>

    </BottomSheet>

    {/* ---------Add complain sheet------ */}

    <BottomSheet ref={shetRef} index={-1} snapPoints={snappoint} enableDynamicSizing={false} enablePanDownToClose={true}
      backdropComponent={renderBackdrop} backgroundStyle={{
        backgroundColor: "#fff", borderRadius: 20, borderWidth: 1,
        borderColor: '#ccc'
      }} handleIndicatorStyle={{ backgroundColor: '#aaa' }}>
      <View style={{ paddingTop: 10, paddingLeft: 20, paddingRight: 20, justifyContent: 'space-between', flex: 1 }}>
        <View>
          <Text style={{ fontSize: 20, fontWeight: 600 }}>Add complaint</Text>

          <View style={{ paddingTop: 20 }}>
            <Text>Complaint type</Text>

            <Dropdown style={{ borderWidth: 1, borderRadius: 10, paddingVertical: 10, marginTop: 10, borderColor: '#e5e5e5' }}
              onFocus={() => setIsFocus(true)} onBlur={() => setIsFocus(false)}
              data={complainttype}
              containerStyle={{ borderRadius: 10, paddingLeft: 10 }}
              placeholderStyle={{ fontSize: 14, paddingLeft: 10 }}
              placeholder="Select a type"
              labelField="label"
              valueField="value"
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
            <View style={{ borderWidth: 1, borderRadius: 10, marginTop: 8, paddingTop: 7, paddingLeft: 10, borderColor: '#e5e5e5',height:80 }}>
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
    </BottomSheet>

    {/* --------Amenities------- */}

    <BottomSheet ref={ref} index={-1} snapPoints={snap} enableDynamicSizing={false} enablePanDownToClose={true}
      backdropComponent={renderBackdrop} backgroundStyle={{
        backgroundColor: "#fff", borderRadius: 20, borderWidth: 1,
        borderColor: '#ccc'
      }} handleIndicatorStyle={{ backgroundColor: '#aaa' }}>
      <View style={{ paddingLeft: 25, paddingRight: 30,flex:1 }}>
        {tag == 'My-Amenities' ? (<View>
          <View style={{ paddingTop: 12 }}>
            {myAmenitis && <View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 23, fontWeight: 500, fontStyle: 'Gilroy-Semibold' }}>{myAmenitis.Amenities}</Text>
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
                <Text style={{ fontSize: 16, fontWeight: 600, marginTop: 9 }}>399 /month</Text>
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
        </View>) : tag == null  ? (<View style={{flex:1}}>

          {available && <View style={{paddingTop:10,flex:1,paddingBottom:20}}>
            <Text style={{fontSize: 23, fontWeight: 500}}>{available.Available}</Text>
            <View style={{ width: '100%', height: 1, backgroundColor: "#eee", marginTop:18 }} />
            <View style={{justifyContent:'space-between',flex:1}}>
                  <View style={{paddingTop:10}}>
                  <Text style={{fontSize:12,fontWeight:400,color:'#4B4B4B'}}>Description</Text>

                  <View style={{paddingTop:14}}>
                      <Text style={{fontSize:16,fontWeight:400,marginBottom:2}}>Gear,Non Gear</Text>
                      <Text style={{fontSize:16,fontWeight:400,marginTop:2}}>24/7 Access, pickup lopp from lobby</Text>
                  </View>

                  <View style={{paddingTop:20}}>
                        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                            <Text style={{fontSize:12,fontWeight:400,color:'#4B4B4B'}}>Price Plans</Text>
                            <TouchableOpacity>
                                  <Text style={{fontSize:12,fontWeight:400,color:'#1E45E1',textDecorationLine:'underline'}}>Select plan</Text>
                            </TouchableOpacity>
                        </View>

                      <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                          <View style={{paddingTop:10,flexDirection:'row'}}>
                            <Text style={{fontSize:16,fontWeight:600}}>399</Text>
                            <Text style={{fontSize:16,fontWeight:400,color:'#4B4B4B'}}>/month</Text>
                        </View> 

                        <TouchableOpacity onPress={()=>plan('plan')} style={{borderWidth:2,width:20,height:20,borderRadius:10, 
                          borderColor:plan=='plan'? borderColor: monthlyplan=='plan' ? "#1E45E1" : "#ccc",justifyContent:'center',marginTop:12}}>

                              <View style={{justifyContent:'center',alignItems:'center'}}  >

                              {monthlyplan === 'plan' && (
                             <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: "#1E45E1" }} />
                              )}
                            </View>
                        </TouchableOpacity>

                      </View>
                                           
                  </View>
            </View>
             <View >
                           <TouchableOpacity style={{backgroundColor:'#1d41d5',paddingVertical:12,alignItems:'center',borderRadius:20}}>
                              <Text style={{fontSize:14.11,fontWeight:600,color:'#ffffff'}}>Request Amenity</Text>
                           </TouchableOpacity>
              </View>
            </View>
            
          </View>}
        </View>) : null}


      </View>

    </BottomSheet>

    {/* -------editclick bottomsheet---------- */}

    <BottomSheet ref={shtRef} index={-1} snapPoints={snappint} enableDynamicSizing={false} enablePanDownToClose={true}
      backdropComponent={renderBackdrop} backgroundStyle={{
        backgroundColor: "#fff", borderRadius: 20, borderWidth: 1,
        borderColor: '#ccc'
      }} handleIndicatorStyle={{ backgroundColor: '#aaa' }}>

      <View style={{ paddingLeft: 25, paddingRight: 30, paddingTop: 20, justifyContent: 'space-between', flex: 1 }}>
        <View>
          <Text style={{ fontSize: 20, fontWeight: 600 }}>Edit complaint</Text>

          <View style={{ paddingTop: 20 }}>
            <Text>Complaint type</Text>

            <Dropdown style={{ borderWidth: 1, borderRadius: 10, paddingVertical: 10, marginTop: 10, borderColor: '#e5e5e5' }}
              onFocus={() => setIsFocus(true)} onBlur={() => setIsFocus(false)}
              data={complainttype}
              containerStyle={{ borderRadius: 10, paddingLeft: 10 }}
              placeholderStyle={{ fontSize: 14, paddingLeft: 10 }}
              placeholder="Select a type"
              labelField="label"
              valueField="value"
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

    </BottomSheet>

    {showPopUp && <View style={{ position: 'absolute', backgroundColor: '#rgba(0, 0, 0, 0.1)', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ width: '90%', backgroundColor: '#ffffff', borderWidth: 1, borderRadius: 8, borderColor: '#E5E7EB',paddingBottom:15 }}>
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

          <View style={{paddingTop:15}}>
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
              <View style={{ height: 20, width: 20, borderRadius: 10, borderWidth: 2,
                         borderColor: selectedReason === item ? "#1E45E1" : "#ccc",
                        alignItems: "center",
                         justifyContent: "center",
                         marginRight: 10,}} >

                {selectedReason === item && (
                  <View
                    style={{ height: 10, width: 10, borderRadius: 5,
                      backgroundColor: "#1E45E1",
                    }}
                  />
                )}
              </View>
              <Text style={{ color: "#000", fontSize: 14 }}>{item}</Text>
            </TouchableOpacity>
          ))}

          {selectedReason=='Other'?<View style={{borderRadius:10,backgroundColor:'#FAFAFA',height:80}}>
            <TextInput placeholder="Enter the reason" style={{marginLeft:5}}/>
          </View>:null}

          </View>
          
        </View>

        <View style={{flexDirection:'row',justifyContent:'flex-end',paddingRight:13,}}>
            <TouchableOpacity onPress={cancel} style={{paddingRight:10,borderRadius:8,paddingVertical:8,paddingHorizontal:15,justifyContent:'center'}}>
                  <Text style={{fontSize:14,fontWeight:400,color:'#4B4B4B'}}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={deleteItem}
            disabled={selectedReason==null?true:false} style={{backgroundColor: selectedReason!=null?'#1E45E1':'#788fed',
              borderWidth:2,borderRadius:8,paddingVertical:8,paddingHorizontal:15,borderColor:'#C3DDFD'
            }}>
                  <Text style={{fontSize:14,fontWeight:600,color:'#FFFFFF'}}>Delete</Text>
            </TouchableOpacity>
        </View>



      </View>
    </View>}

  </View>

}

const style=StyleSheet.create({
  mainDashb:{ flex: 1, backgroundColor: '#ffffff', paddingTop: 10, position: 'relative' },
  container: { flexDirection: 'row', paddingTop: 10, paddingLeft: 16, paddingRight: 16, justifyContent: 'space-between', paddingLeft: 10, alignItems: 'center' }
})
export default Dashboard;
import React, { useEffect, useRef, useContext, useState } from "react";
import {
    View,
    StyleSheet,
    Animated,
    PanResponder,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    ScrollView,
    TouchableOpacity, Image,
    TextInput,
    Text,
    Dimensions,
    FlatList,
    NativeModules,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { paymentContexts } from "../../../Context/PaymentContext";
import Dot from '../../../assets/Images/dot.png';
import calenderTick from '../../../assets/Images/calendar-tick.png'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useNavigation } from "@react-navigation/native";
import { UsersContext } from "../../../Context/UserContext";
import { LoginContexts } from "../../../Context/LoginContext";
import AppLoader from "../../ToastFile/LoaderPage";
import CallIcon from "../../../assets/Images/call.png"
import DeleteIcon from "../../../assets/Images/deleteIcon.png"


const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function RequestViewSheet({
    visible,
    onClose,
    requestDetail

}) {
    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const navigation = useNavigation();


    const { CommonModule } = NativeModules;
    const context = useContext(UsersContext)
    const loginContext = useContext(LoginContexts)
    console.log(requestDetail)

    // useEffect(() => {
    //     if (visible && selectedComplaintSend) {
    //         setCurrentComplaint(selectedComplaintSend);
    //     }
    // }, [visible, selectedComplaintSend]);
    // console.log(selectedComplaint)

    // useEffect(() => {
    //     if (!visible) {
    //         setComment(false)
    //     }
    // }, [visible])


    /* ================= OPEN / CLOSE ================= */
    useEffect(() => {
        Animated.timing(translateY, {
            toValue: visible ? 0 : SCREEN_HEIGHT,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [visible]);

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
                    onClose && onClose();
                } else {
                    Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;


   const formatDate = (dateString) => {
    const [day, month, year] = dateString.split(/[-/]/); 

    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };





    if (!visible) return null;

    return (
        <View style={style.overlay}>
            {/* <AppLoader visible={paymentContext.getLoading}/> */}
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={StyleSheet.absoluteFillObject} />
            </TouchableWithoutFeedback>

            <Animated.View
                {...panResponder.panHandlers}
                style={[
                    style.sheet,
                    { transform: [{ translateY }] },
                ]}
            >

                <SafeAreaView edges={["bottom"]}  >

                    {/* ================= YOUR CONTENT HERE ================= */}

                    <View {...panResponder.panHandlers}>
                        <View style={style.dragindictor} />
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {requestDetail?.type === "Amenity request" ? (
                            <>
                                <View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between',marginTop:12 }}>
                                        <Text style={{ fontSize: 23, fontFamily: 'Gilroy-Semibold' }}>{requestDetail.title}</Text>
                                        <View style={{ justifyContent: 'center', paddingTop: 7 }}>
                                            <Image source={Dot} style={{ width: 30.85, height: 30.85 }} />

                                        </View>

                                    </View>


                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 5 }}>
                                        {/* <View style={{height: 1, backgroundColor: "#eee", marginTop: 10}} /> */}

                                        <View >
                                            <TouchableOpacity style={{
                                                borderWidth: 1, borderColor: '#eee', paddingTop: 9, paddingBottom: 14, paddingHorizontal: 15,
                                                borderRadius: 5, flexDirection: 'row', justifyContent: 'center',alignItems:'center'
                                            }}>
                                                <Image source={DeleteIcon} style={{ width: 16, height: 18,tintColor:'#EB6617' }} />
                                                <Text style={{ marginLeft: 5, fontSize: 14, fontFamily: 'Gilroy-Medium' }}>Cancel Request</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View>
                                        <Text style={{ fontSize: 13, fontFamily: 'Gilroy-Regular', color: '#4B4B4B' }}>Description</Text>
                                        <Text style={{ marginTop: 13, fontSize: 16, fontFamily: 'Gilroy-Medium' }}>
                                            {requestDetail?.description || requestDetail?.reason || "N/A"}
                                        </Text>
                                    </View>

                                    <View style={{ paddingTop: 18 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{ fontSize: 13, fontFamily: 'Gilroy-Regular', color: '#4B4B4B' }}>Selected plans</Text>
                                            {/* <TouchableOpacity>
                                                <Text style={{ fontSize: 12, color: '#1E45E1', fontFamily: 'Gilroy-Medium' }}>Change Plan</Text>
                                            </TouchableOpacity> */}
                                        </View>
                                        <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Semibold', marginTop: 9 }}>{'\u20B9'}{requestDetail?.amenityAmount} /month</Text>
                                    </View>

                                    <View style={{ paddingTop: 15 }}>
                                        <Text style={{ fontSize: 13, fontFamily: 'Gilroy-Regular', color: '#4B4B4B' }}>Raised On</Text>
                                        <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Semibold', marginTop: 9 }}>{formatDate(requestDetail?.requestedDate)}</Text>
                                    </View>

                                    <TouchableOpacity style={{ paddingVertical: 13, borderWidth: 1, borderRadius: 10, alignItems: 'center', backgroundColor: '#FFFDF5', borderColor: '#E27625', marginTop: 30 }}>
                                        <Text style={{ fontSize: 14.11, fontFamily: 'Gilroy-Semibold', color: '#EB6617' }}>Request Raised</Text>
                                    </TouchableOpacity>


                                </View>
                            </>
                        ) : (
                            <>
                                <View style={{marginHorizontal:8}}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between',marginTop:12 }}>
                                        <Text style={{ fontSize: 23, fontFamily: 'Gilroy-Semibold' }}>{requestDetail.title}</Text>
                                        <View style={{ justifyContent: 'center', paddingTop: 7 }}>
                                            <Image source={Dot} style={{ width: 30.85, height: 30.85 }} />

                                        </View>

                                    </View>


                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 5 }}>
                                        {/* <View style={{height: 1, backgroundColor: "#eee", marginTop: 10}} /> */}

                                        <View >
                                            <TouchableOpacity style={{
                                                borderWidth: 1, borderColor: '#eee', paddingTop: 9, paddingBottom: 14, paddingHorizontal: 15,
                                                borderRadius: 5, flexDirection: 'row', justifyContent: 'center',alignItems:'center'
                                            }}>
                                                <Image source={DeleteIcon} style={{ width: 16, height: 18,tintColor:"#EB6617" }} />
                                                <Text style={{ marginLeft: 5, fontSize: 14, fontFamily: 'Gilroy-Medium' }}>Cancel Request</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View>
                                        <Text style={{ fontSize: 13, fontFamily: 'Gilroy-Regular', color: '#4B4B4B' }}>Reason for Bed Change</Text>
                                        <Text style={{ marginTop: 13, fontSize: 16, fontFamily: 'Gilroy-Medium' }}>
                                            {requestDetail?.description || requestDetail?.reason || "N/A"}
                                        </Text>
                                    </View>

                                    <View style={{ paddingTop: 18 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{ fontSize: 13, fontFamily: 'Gilroy-Regular', color: '#4B4B4B' }}>Preferred Bed type</Text>
                                            {/* <TouchableOpacity>
                                                <Text style={{ fontSize: 12, color: '#1E45E1', fontFamily: 'Gilroy-Medium' }}>Change Plan</Text>
                                            </TouchableOpacity> */}
                                        </View>
                                        <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Semibold', marginTop: 9 }}>{'\u20B9'}{requestDetail?.amenityAmount} /month</Text>
                                    </View>


                                    <View style={{ paddingTop: 15 }}>
                                        <Text style={{ fontSize: 13, fontFamily: 'Gilroy-Regular', color: '#4B4B4B' }}>Bed Change Urgency</Text>
                                        <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Semibold', marginTop: 9 }}>{formatDate(requestDetail?.requestedDate)}</Text>
                                    </View>

                                    <View style={{ paddingTop: 15 }}>
                                        <Text style={{ fontSize: 13, fontFamily: 'Gilroy-Regular', color: '#4B4B4B' }}>Raised On</Text>
                                        <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Semibold', marginTop: 9 }}>{formatDate(requestDetail?.requestedDate)}</Text>
                                    </View>

                                    <View style={{ paddingTop: 15 }}>
                                        <Text style={{ fontSize: 13, fontFamily: 'Gilroy-Regular', color: '#4B4B4B' }}>Current Status</Text>
                                        <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Semibold', marginTop: 9,color:'#EB6617' }}>{formatDate(requestDetail?.requestedDate)}</Text>
                                    </View>

                                    <TouchableOpacity style={{ paddingVertical: 13, borderRadius: 10, alignItems: 'center', backgroundColor: '#1E45E1', 
                                                               marginTop: 30,alignItems:'center',flexDirection:'row',justifyContent:'center' }}>
                                        <Image source={CallIcon} style={{width:20,height:20,tintColor:'#FFFFFF'}}/>
                                        <Text style={{ fontSize: 14.11, fontFamily: 'Gilroy-Semibold', color: '#EB6617',color:"#FFFFFF",marginLeft:5 }}>
                                            Contact Hostel Admin</Text>
                                    </TouchableOpacity>


                                </View>
                            </>
                        )}
                    </ScrollView>


                </SafeAreaView>

            </Animated.View>
        </View>

    );

}



const style = StyleSheet.create({
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
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 12,
        minHeight: 45,
        textAlignVertical: "top",
    },
    dragindictor: { width: 50, height: 4, backgroundColor: "#ccc", borderRadius: 2, alignSelf: "center", marginBottom: 10 },

});
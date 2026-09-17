import React, { useContext, useEffect, useRef, useState } from "react";
import { Dimensions, Image, KeyboardAvoidingView, Text, TouchableOpacity } from "react-native";
import { Animated, Keyboard, PanResponder, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import AlertIcon from "../../assets/Images/AlertIcon.png"
import Ionicons from "react-native-vector-icons/Ionicons";
import { TextInput } from "react-native";
import SendingIcon from "../../assets/Images/sendIcon.png"
import ErrorMessage from "../ToastFile/ErrorMessage";
import { getNoticeReason, raiseNoticePeriodRequest } from "../../Action/CustomerAction";
import { LoginContexts } from "../../Context/LoginContext";
import { UsersContext } from "../../Context/UserContext";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import AppLoader from "../ToastFile/LoaderPage";
import SuccessModal from "../ToastFile/TostFilePage";
import { SafeAreaView } from "react-native-safe-area-context";



const SCREEN_HEIGHT = Dimensions.get("window").height;

const { height } = Dimensions.get("window");
const SHEET_HEIGHT = height * 0.60;

const NoticePeriodRequestRise = ({
    visible,
    onClose,
}) => {


    const [openReason, setOpenReason] = useState(false)
    const [selectedReason, setSelectedReasonType] = useState("")
    const [remarks, setRemarks] = useState("")
    const [errormsg, setErrorMsg] = useState("")
    const { getToken } = useContext(LoginContexts)
    const { getHostelDetail } = useContext(UsersContext)
    const [noticeReason, setNoticeReason] = useState([])
    const [loading, setLoading] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [showMessage, setShowMessage] = useState("")
    const [modalType, setModalType] = useState("")
    const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;

    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const safeKeyboardHeight = keyboardHeight > 0 ? 260 : 0;
    Keyboard.addListener("keyboardDidShow", (e) => {
        setKeyboardHeight(e.endCoordinates.height);
    });
    Keyboard.addListener("keyboardDidHide", () => {
        setKeyboardHeight(0);
    })


    // const reasonType = [{ id: 1, type: "Job Switch" }, { id: 2, type: "Hostel is not Good" },
    // { id: 3, type: "Very Expensive" }, { id: 4, type: "Others" }
    // ]

    const handleClose = () => {

        setSelectedReasonType("")
        setRemarks("")
        setErrorMsg("")
        onClose()
    }


    useEffect(() => {
        if (visible) {
            Animated.timing(translateY, {
                toValue: 0,               // 🔥 FULLY OPEN
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const closeSheet = () => {
        Animated.timing(translateY, {
            toValue: SHEET_HEIGHT,
            duration: 250,
            useNativeDriver: true,
        }).start(onClose);
    };


    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 5,
            onPanResponderMove: (_, g) => {
                if (g.dy > 0) {
                    translateY.setValue(g.dy);
                }
            },
            onPanResponderRelease: (_, g) => {
                g.dy > 120
                    ? handleClose()
                    : Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
            },
        })
    ).current;



    useFocusEffect(
        useCallback(() => {
            try {
                getNoticeReason(getToken).then(r => {
                    console.log(r)
                    if (r?.status == 200) {
                        setNoticeReason(r?.data || [])
                    }
                })
            } catch (error) {
                console.log(error)
            }
        }, [])
    )

    const handleRiseRequest = async () => {

        if (!selectedReason) {
            setErrorMsg("Please select reason")
            return;
        }

        const payload = {
            reason: selectedReason?.key,
            remarks: remarks,
        }

        try {
            setLoading(true)
            const res = await raiseNoticePeriodRequest(getHostelDetail?.hostelId, getToken, payload)
            console.log("sinatha", res)
            setLoading(false)
            if (res?.status === 200) {
                setShowSuccessModal(true)
                setShowMessage(res?.data || "Request Raised")
                setModalType("success")
                setTimeout(() => {
                    setShowSuccessModal(false)
                    onClose();
                }, 1200);
            } else {
                setShowSuccessModal(true)
                setShowMessage(res?.data || res?.message || "Request Raise Failed")
                setModalType("error")
                setTimeout(() => {
                    setShowSuccessModal(false)
                    onClose();
                }, 1200);
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
        }

    }



    if (!visible) return null;

    return (

        // <View style={styles.overlay}>
        //     <AppLoader visible={loading} />
        //     <SuccessModal
        //         visible={showSuccessModal}
        //         message={showMessage}
        //         type={modalType} />
        //     <TouchableWithoutFeedback onPress={handleClose}>
        //         <View style={StyleSheet.absoluteFillObject} />
        //     </TouchableWithoutFeedback>
        //    <Animated.View
        //   {...panResponder.panHandlers}
        //   style={[
        //     styles.sheet,
        //     {
        //       transform: [
        //         {
        //           translateY: Animated.subtract(
        //             translateY,
        //             new Animated.Value(safeKeyboardHeight)
        //           ),
        //         },
        //       ],
        //     },
        //   ]}
        // >
        //         <View {...panResponder.panHandlers}>
        //             <View style={styles.dragindictor} />
        //         </View>

        //         {/* <KeyboardAvoidingView
        //             style={{ flex: 1 }}
        //             behavior={Platform.OS === "ios" ? "padding" : "height"}
        //             keyboardVerticalOffset={0}
        //         > */}

        //             <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        //                 <View style={{ flexDirection: 'row', marginTop: 13, }}>
        //                     <Image source={AlertIcon} style={{ width: 17.5, height: 17.5, tintColor: '#E27625', marginTop: 4 }} />
        //                     <View style={{ marginLeft: 12 }}>
        //                         <Text style={styles.headerTxt}>Rise notice period</Text>
        //                         <Text style={styles.subTxt}>
        //                             Notice period serving days must be <Text style={{ color: '#222222', fontSize: 13.5, fontFamily: 'Gilroy-Semibold' }}>
        //                                 30 days</Text> from the requested date</Text>
        //                     </View>
        //                 </View>

        //                 <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', marginTop: 15 }}>
        //                     Reason <Text style={{ color: 'red' }}> *</Text></Text>

        //                 <TouchableOpacity onPress={() => {
        //                     setOpenReason(!openReason)
        //                     setErrorMsg("")
        //                 }}
        //                     style={styles.inputBox}>
        //                     <Text style={styles.valueTxt}>{selectedReason ? selectedReason?.value : "Select reason"}</Text>
        //                     <Ionicons name={openReason ? "chevron-up" : "chevron-down"} size={18} />
        //                 </TouchableOpacity>

        //                 {errormsg && <ErrorMessage message={errormsg} type="error" />}


        //                 {openReason && (
        //                     <View style={{
        //                         borderWidth: 1, borderRadius: 10, marginTop: 8, borderColor: '#D9D9D9', elevation: 1,
        //                         backgroundColor: '#ffffff', paddingVertical: 4, paddingHorizontal: 18
        //                     }}>
        //                         {noticeReason.map((i, index) => (
        //                             <TouchableOpacity key={index} onPress={() => {
        //                                 setSelectedReasonType(i)
        //                                 setOpenReason(false)
        //                             }}
        //                                 style={{ marginVertical: 10 }}>
        //                                 <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium' }}>{i?.value}</Text>
        //                             </TouchableOpacity>
        //                         ))}
        //                     </View>
        //                 )}

        //                 <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', marginTop: 16 }}>Remarks if any</Text>

        //                 <TextInput
        //                     style={styles.remarkInputbox}
        //                     value={remarks}
        //                     placeholder="Max 100 characters"
        //                     textAlignVertical="top"
        //                     onChangeText={(text) => {
        //                         const onlyLetters = text.replace(/[^A-Za-z/.,'\s]/g, "")
        //                         setRemarks(onlyLetters)
        //                     }} />


        //             </ScrollView>
        //         {/* </KeyboardAvoidingView> */}

        //             <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>
        //                 <TouchableOpacity onPress={handleClose}
        //                     style={{
        //                         borderWidth: 1, borderColor: "#E8E8E8", paddingHorizontal: 10, paddingVertical: 12,
        //                         borderRadius: 10, flex: 1, alignItems: 'center', marginRight: 8
        //                     }}>
        //                     <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Medium' }}>Cancel</Text>
        //                 </TouchableOpacity>


        //                 <TouchableOpacity onPress={handleRiseRequest}
        //                     style={{
        //                         backgroundColor: "#D41515", alignItems: 'center', flexDirection: 'row', alignSelf: 'center', justifyContent: 'center',
        //                         paddingHorizontal: 10, paddingVertical: 12, borderRadius: 10, flex: 1, marginLeft: 8
        //                     }}>
        //                     <Image source={SendingIcon} style={{ width: 21, height: 21 }} />
        //                     <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Medium', color: '#ffffff', marginLeft: 8 }}>
        //                         Raise Request</Text>
        //                 </TouchableOpacity>

        //             </View>


        //     </Animated.View>
        // </View>

        <>
            {/* <SuccessModal visible={showSuccess} message={message} type={modalType} /> */}
            <View style={styles.root} pointerEvents="box-none">
                <AppLoader visible={loading} />
                <SuccessModal
                    visible={showSuccessModal}
                    message={showMessage}
                    type={modalType} />

                <TouchableWithoutFeedback onPress={handleClose}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>




                <Animated.View
                    {...panResponder.panHandlers}
                    style={[
                        styles.sheet,
                        {
                            transform: [
                                {
                                    translateY: Animated.subtract(
                                        translateY,
                                        new Animated.Value(safeKeyboardHeight)
                                    ),
                                },
                            ],
                        },
                    ]}
                >


                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : undefined}
                        style={{ flex: 1 }}
                    >
                        <ScrollView contentContainerStyle={{ flex: 1, paddingBottom: 40, }}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}>

                            <View {...panResponder.panHandlers} style={{ alignItems: 'center' }}>
                                <View style={styles.dragindictor} />
                            </View>

                            <View style={{ flexDirection: 'row', marginTop: 13, }}>
                                <Image source={AlertIcon} style={{ width: 17.5, height: 17.5, tintColor: '#E27625', marginTop: 4 }} />
                                <View style={{ marginLeft: 12 }}>
                                    <Text style={styles.headerTxt}>Rise notice period</Text>
                                    <Text style={styles.subTxt}>
                                        Notice period serving days must be <Text style={{ color: '#222222', fontSize: 13.5, fontFamily: 'Gilroy-Semibold' }}>
                                            30 days</Text> from the requested date</Text>
                                </View>
                            </View>

                            <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', marginTop: 15 }}>
                                Reason <Text style={{ color: 'red' }}> *</Text></Text>

                            <TouchableOpacity onPress={() => {
                                setOpenReason(!openReason)
                                setErrorMsg("")
                            }}
                                style={styles.inputBox}>
                                <Text style={styles.valueTxt}>{selectedReason ? selectedReason?.value : "Select reason"}</Text>
                                <Ionicons name={openReason ? "chevron-up" : "chevron-down"} size={18} />
                            </TouchableOpacity>

                            {errormsg && <ErrorMessage message={errormsg} type="error" />}


                            {openReason && (
                                <View style={{
                                    borderWidth: 1, borderRadius: 10, marginTop: 8, borderColor: '#D9D9D9', elevation: 1,
                                    backgroundColor: '#ffffff', paddingVertical: 4, paddingHorizontal: 18
                                }}>
                                    {noticeReason.map((i, index) => (
                                        <TouchableOpacity key={index} onPress={() => {
                                            setSelectedReasonType(i)
                                            setOpenReason(false)
                                        }}
                                            style={{ marginVertical: 10 }}>
                                            <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium' }}>{i?.value}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}

                            <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', marginTop: 16 }}>Remarks if any</Text>

                            <TextInput
                                style={styles.remarkInputbox}
                                value={remarks}
                                placeholder="Max 100 characters"
                                textAlignVertical="top"
                                onChangeText={(text) => {
                                    const onlyLetters = text.replace(/[^A-Za-z/.,'\s]/g, "")
                                    setRemarks(onlyLetters)
                                }} />


                        </ScrollView>


                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>
                            <TouchableOpacity onPress={handleClose}
                                style={{
                                    borderWidth: 1, borderColor: "#E8E8E8", paddingHorizontal: 10, paddingVertical: 12,
                                    borderRadius: 10, flex: 1, alignItems: 'center', marginRight: 8
                                }}>
                                <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Medium' }}>Cancel</Text>
                            </TouchableOpacity>


                            <TouchableOpacity onPress={handleRiseRequest}
                                style={{
                                    backgroundColor: "#D41515", alignItems: 'center', flexDirection: 'row', alignSelf: 'center', justifyContent: 'center',
                                    paddingHorizontal: 10, paddingVertical: 12, borderRadius: 10, flex: 1, marginLeft: 8
                                }}>
                                <Image source={SendingIcon} style={{ width: 21, height: 21 }} />
                                <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Medium', color: '#ffffff', marginLeft: 8 }}>
                                    Raise Request</Text>
                            </TouchableOpacity>

                        </View>
                    </KeyboardAvoidingView>
                </Animated.View>


            </View>
        </>

    )

}

export default NoticePeriodRequestRise;

const styles = StyleSheet.create({
    container: { ...StyleSheet.absoluteFillObject, zIndex: 999 },
    root: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 9999,          // 🔥 VERY IMPORTANT
        elevation: 9999,      // 🔥 Android
    },

    overlay: {
        ...StyleSheet.absoluteFillObject,  // 🔥 FULL SCREEN
        backgroundColor: "rgba(0,0,0,0.5)",
    },

    sheet: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,            // 🔥 IMPORTANT
        height: SHEET_HEIGHT,
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 16,
    },
    dragindictor: {
        width: 50, height: 4, backgroundColor: "#ccc", borderRadius: 2
    },
    handle: {
        width: 40,
        height: 5,
        backgroundColor: "#D1D5DB",
        borderRadius: 3,
        alignSelf: "center",
        marginBottom: 12,
    },
    headerTxt: {
        fontSize: 19.5, fontFamily: 'Gilroy-Medium'
    },
    subTxt: {
        fontSize: 13.5, fontFamily: 'Gilroy-Regular', color: '#3C3C4399',
        marginTop: 12, lineHeight: 20
    },
    inputBox: {
        borderWidth: 1, borderRadius: 8, borderColor: '#D9D9D9', paddingVertical: 16,
        paddingHorizontal: 14, marginTop: 14, flexDirection: 'row',
        justifyContent: 'space-between', fontSize: 15,
        fontFamily: "Gilroy-Medium",
    },
    valueTxt: {
        fontSize: 15, fontFamily: "Gilroy-Medium", color: '#222222'
    },
    remarkInputbox: {
        borderWidth: 1, borderRadius: 8, borderColor: '#D9D9D9', paddingVertical: 16,
        paddingHorizontal: 14, marginTop: 14, flexDirection: 'row', fontSize: 15,
        fontFamily: "Gilroy-Medium", height: 100, justifyContent: 'flex-start', alignItems: 'flex-start'
    },
})
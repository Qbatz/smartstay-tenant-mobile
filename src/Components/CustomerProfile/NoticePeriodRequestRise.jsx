import React, { useContext, useEffect, useRef, useState } from "react";
import { Dimensions, Image, Text, TouchableOpacity } from "react-native";
import { Animated, Keyboard, PanResponder, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import AlertIcon from "../../assets/Images/AlertIcon.png"
import Ionicons from "react-native-vector-icons/Ionicons";
import { TextInput } from "react-native";
import SendingIcon from "../../assets/Images/sendIcon.png"
import ErrorMessage from "../ToastFile/ErrorMessage";
import { raiseNoticePeriodRequest } from "../../Action/CustomerAction";
import { LoginContexts } from "../../Context/LoginContext";
import { UsersContext } from "../../Context/UserContext";



const SCREEN_HEIGHT = Dimensions.get("window").height;

const NoticePeriodRequestRise = ({
    visible,
    onClose,
}) => {

    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const [openReason, setOpenReason] = useState(false)
    const [selectedReason, setSelectedReasonType] = useState("")
    const [remarks, setRemarks] = useState("")
    const [errormsg,setErrorMsg]=useState("")
    const {getToken}=useContext(LoginContexts)
    const {getHostelDetail}=useContext(UsersContext)


    const reasonType = [{ id: 1, type: "Job Switch" }, { id: 2, type: "Hostel is not Good" },
    { id: 3, type: "Very Expensive" }, { id: 4, type: "Others" }
    ]

     const handleClose=()=>{

        setSelectedReasonType("")
        setRemarks("")
        setErrorMsg("")
        onClose()
    }

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
                    // onClose();
                    handleClose();
                } else {
                    Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    const handleRiseRequest=async()=>{

        if(!selectedReason){
            setErrorMsg("Please select reason")
             return;
        }

       

        console.log("maadu")

        const payload={
            reason: selectedReason
        }

        try{
            const res=await raiseNoticePeriodRequest(getHostelDetail?.hostelId,getToken,payload)
            console.log("sinatha",res)
        }catch(error){
            console.log(error)
        }

    }

   

    if (!visible) return null;

    return (
        <View style={styles.overlay}>
            <TouchableWithoutFeedback onPress={handleClose}>
                <View style={StyleSheet.absoluteFillObject} />
            </TouchableWithoutFeedback>
            <Animated.View
                {...panResponder.panHandlers}
                style={[styles.sheet, { transform: [{ translateY }] }]}>
                <View {...panResponder.panHandlers}>
                    <View style={styles.dragindictor} />
                </View>

                <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

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

                    <TouchableOpacity onPress={() => {setOpenReason(!openReason)
                        setErrorMsg("")
                    }}
                        style={styles.inputBox}>
                        <Text style={styles.valueTxt}>{selectedReason ? selectedReason : "Select reason"}</Text>
                        <Ionicons name={openReason ? "chevron-up" : "chevron-down"} size={18} />
                    </TouchableOpacity>

                    {errormsg && <ErrorMessage message={errormsg} type="error"/>}


                    {openReason && (
                        <View style={{
                            borderWidth: 1, borderRadius: 10, marginTop: 8, borderColor: '#D9D9D9', elevation: 1,
                            backgroundColor: '#ffffff', paddingVertical: 4, paddingHorizontal: 18
                        }}>
                            {reasonType.map((i, index) => (
                                <TouchableOpacity key={index} onPress={() => {
                                    setSelectedReasonType(i?.type)
                                    setOpenReason(false)
                                }}
                                    style={{ marginVertical: 10 }}>
                                    <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium' }}>{i.type}</Text>
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
                            const onlyLetters = text.replace(/[^A-Za-z\s]/g, "")
                            setRemarks(onlyLetters)
                        }} />


                </ScrollView>

                <View style={{ flexDirection: 'row', alignItems: 'center',marginBottom:30 }}>
                    <TouchableOpacity onPress={handleClose}
                    style={{borderWidth:1,borderColor:"#E8E8E8",paddingHorizontal:10,paddingVertical:12,
                        borderRadius:10,flex:1,alignItems:'center',marginRight:8
                    }}>
                        <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Medium' }}>Cancel</Text>
                    </TouchableOpacity>


                    <TouchableOpacity onPress={handleRiseRequest}
                     style={{backgroundColor:"#D41515",alignItems:'center',flexDirection:'row',alignSelf:'center',justifyContent:'center',
                                            paddingHorizontal:10,paddingVertical:12, borderRadius:10,flex:1,marginLeft:8 }}>
                        <Image source={SendingIcon} style={{ width: 21, height: 21 }} />
                        <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Medium', color: '#ffffff',marginLeft:8 }}>
                            Raise Request</Text>
                    </TouchableOpacity>

                </View>


            </Animated.View>
        </View>
    )

}

export default NoticePeriodRequestRise;

const styles = StyleSheet.create({
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
        minHeight: "60%",
        overflow: 'hidden'
        // dynamic height limit
    },
    dragindictor: {
        width: 50, height: 4, backgroundColor: "#ccc", borderRadius: 2,
        alignSelf: "center", marginBottom: 10
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
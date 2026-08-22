import React, { useContext, useRef, useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Animated, NativeModules, Platform } from "react-native";
import Sm_logo from '../../assets/Images/Sm_logo.png'
import { useNavigation } from "@react-navigation/native";
import { UsersContext } from "../../Context/UserContext";
import { getToken, updateFCMToken, verifyMPin } from "../../Action/LoginAction";
import SuccessModal from "../ToastFile/TostFilePage";
import { retriveData, storeData } from "../../Utils/Storage";
import { ACCESS_TOKEN, CUSTOMERDETAIL, HOSTELDETAIL, HOSTELLIST, LOGGEDIN } from "../../Utils/Constant";
import { LoginContexts } from "../../Context/LoginContext";
import WaveIcon from '../../assets/Images/HiIcon.png';
import ErrorMessage from "../ToastFile/ErrorMessage";
import AppLogo from "../../assets/Images/AppLogo.png"


const EnterMPin = (props) => {
    console.log(props)

    const { NotificationModule, CommonModule } = NativeModules;
    const context = useContext(UsersContext)
    const loginContext = useContext(LoginContexts)
    const navigation = useNavigation()
    const [createMpin, setCreateMpin] = useState(["", "", "", ""])
    const [mPinNumber, setmPinNumber] = useState(null)
    const inputs = useRef([])
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showModelMessage, setShowModelMessage] = useState()
    const [modelType, setModelType] = useState();
    const [hostelList, setHostelList] = useState([]);
    const [enterPinError, setEnterPinError] = useState()

    const [customerName, setCustomerName] = useState();
    const [fcmToken, setFcmToken] = useState();

    const rotation = useRef(new Animated.Value(0)).current;

    console.log(createMpin)
    console.log(loginContext)
    console.log(context)

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(rotation, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(rotation, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    useEffect(() => {
        retriveData(CUSTOMERDETAIL).then(r => {
            const customerDetail = r ? JSON.parse(r) : null
            setCustomerName(customerDetail?.firstName)
        })
    }, [])

    const rotateInterpolate = rotation.interpolate({
        inputRange: [-1, 1],
        outputRange: ["0deg", "10deg"], // waving angle
    });

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

    useEffect(() => {
        if (Platform.OS == 'android') {
            fetchFcmTokenAsync();
        }

    }, [])

    const fetchFCMToken = async (authToken) => {
        if (fcmToken != null) {
            await updateFCMToken(loginContext.getUserId, fcmToken, authToken);
        }

    }


    const handlePinChange = async (text, index) => {
        const cleanText = text.replace(/[^0-9]/g, "");
        const newPin = [...createMpin];
        newPin[index] = cleanText;
        setCreateMpin(newPin);

        if (cleanText && index < 3) {
            inputs.current[index + 1].focus();
        }

        if (newPin.every((digit) => digit !== "")) {
            const pinNumber = newPin.join("");
            setmPinNumber(pinNumber)
            setEnterPinError("")
            console.log(pinNumber)

            const data = {
                xuid: loginContext.getUserId,
                mPin: pinNumber,
            }

            verifyMPin(data).then(res => {
                console.log(res)
                if (res.status == 200) {
                    console.log("hostelList", res.data)
                    setHostelList(res.data)
                    console.log("manuallyselecthostel", res.data?.[0])


                    setShowSuccessModal(true)
                    setShowModelMessage("Login Successfully")
                    setModelType('success')
                    context.updateHostelList(res.data)
                    storeData(HOSTELLIST, JSON.stringify(res.data))

                    setTimeout(() => {
                        setShowSuccessModal(false);
                        storeData(LOGGEDIN, "true")
                        loginContext.loggedin('true')

                        // navigation.navigate('HostelList')
                    
                        if (res.data.length == 1 && res.data?.[0].currentStatus !== "INACTIVE") {
                            const data = {
                                xuid: loginContext.getUserId,
                                hostelId: res.data?.[0].hostelId,
                            }
                            console.log(data)

                            getToken(data).then(r => {
                                console.log("token", r)
                                if (r?.status == 200) {
                                    fetchFCMToken(r.data);
                                    loginContext.updateToken(r.data)
                                    storeData(ACCESS_TOKEN, r.data)
                                    storeData(HOSTELDETAIL, JSON.stringify(res.data?.[0]))
                                    context.updateHostelDetail(res.data?.[0])
                                    // navigation.navigate("Dashboard");
                                    CommonModule.storeCredentials(r.data)
                                    setTimeout(() => {
                                          props.callbackMpin()
                                    }, 200);

                                }
                            })
                        }else{
                             props.callbackMpin()
                        }
                    }, 2000);
                }
                else if (res.status == 400) {
                    setShowSuccessModal(true)
                    setShowModelMessage("Incorrect MPIN")
                    setModelType('error')
                    setCreateMpin(["", "", "", ""])

                    setTimeout(() => {
                        setShowSuccessModal(false);
                        inputs.current[0].focus();
                    }, 2000);
                }
            })
        } else {
            setmPinNumber("")
        }
    }


    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === "Backspace") {
            const newPin = [...createMpin];

            if (newPin[index] === "" && index > 0) {
                inputs.current[index - 1].focus();

                newPin[index - 1] = "";
                setCreateMpin(newPin)
            } else {
                newPin[index] = "";
                setCreateMpin(newPin)
            }
        }
    }

    const handleFocus = (index) => {
        const firstEmptyIndex = createMpin.findIndex((digit) => digit === "");

        console.log(firstEmptyIndex)

        if (firstEmptyIndex !== -1 && index > firstEmptyIndex) {
            inputs.current[firstEmptyIndex].focus();
        }
    };

    // const handleKeyPress = (e, index) => {
    //     if (e.nativeEvent.key === "Backspace" && createMpin[index] === "" && index > 0) {
    //         inputs.current[index - 1].focus();
    //     }
    // };

    const validateForm = () => {
        let valid = true;

        setEnterPinError("")

        const isValid = createMpin.every(digit => digit !== "");

        if (!isValid) {
            setEnterPinError("Please enter a valid 4-digit MPIN");
            return false;
        }

        // const pin = createMpin.join("");

        // if (!/^\d{4}$/.test(pin)) {
        //     setEnterPinError("Please enter a valid 4-digit MPIN");
        //     return false;
        // }


        return valid;
    }

    const enterPinClick = () => {
        if (!validateForm()) return;

        const data = {
            xuid: loginContext.getUserId,
            mPin: mPinNumber,
        }

        verifyMPin(data).then(r => {
            console.log(r)
            if (r.status == 200) {
                console.log(r.data)
                setHostelList(r.data)
                storeData(LOGGEDIN, "true")
                loginContext.loggedin('true')
                context.updateHostelList(r.data)

                setShowSuccessModal(true)
                setShowModelMessage("Login Successfully")
                setModelType('success')

                setTimeout(() => {
                    setShowSuccessModal(false);
                    // navigation.navigate('HostelList')
                    props.callbackMpin()
                }, 2000);
            }
            else if (r.status == 400) {
                setShowSuccessModal(true)
                setShowModelMessage("Incorrect MPIN")
                setModelType('error')

                setTimeout(() => {
                    setShowSuccessModal(false);
                }, 2000);
            }
        })
    }

    const forgotMpinClick = () => {

        navigation.navigate('EnterNumber')
    }

    return <View style={{ paddingHorizontal: 20, flex: 1, backgroundColor: '#FFFFFF' }}>
        <SuccessModal
            visible={showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
            message={showModelMessage}
            type={modelType}
        />
        <View style={{ paddingTop: 70 }} >


            {/* <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 15 }}>
                <Text style={style.title}>Welcome Back</Text>

                <Animated.Image
                    source={WaveIcon}
                    style={[
                        style.hand,
                        {
                            width: 25,
                            height: 25,
                            marginTop: 8,
                            marginLeft: 5,
                            transform: [{ rotate: rotateInterpolate }],
                        },
                    ]}
                />

            </View> */}

            <View style={{ alignItems: 'center' }}>

                <Image source={AppLogo} style={style.logo} />

                {/* <Text style={style.createText}>Hi,{customerName}</Text> */}

                <Text style={style.createText} numberOfLines={2}>
                    {customerName ? `Hi,${customerName}` : "Welcome to SmartStay"}</Text>

                <Text style={style.subtitle}>{loginContext?.getPhoneNo ? "Enter 4 Digit mPin for" : "Please enter 4 Digit the mPIN"}
                    {loginContext?.getPhoneNo &&
                        <Text
                            style={{ fontSize: 16, fontFamily: 'Gilroy-Semibold', color: '#222222' }}>
                            {""} +91 {loginContext?.getPhoneNo}
                        </Text>}
                </Text>



            </View>



            <View style={style.pinContainer}>
                {createMpin.map((digit, index) => (
                    <TextInput
                        key={index}
                        ref={(ref) => (inputs.current[index] = ref)}
                        keyboardType="number-pad"
                        style={style.pinBox}
                        maxLength={1}
                        value={digit}
                        onChangeText={(text) => handlePinChange(text, index)}
                        onFocus={() => handleFocus(index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                    />
                ))}
            </View>
            {enterPinError && <ErrorMessage message={enterPinError} type="error" />}
            <View style={{ alignItems: 'flex-end', paddingTop: 20, paddingRight: 20 }}>
                <TouchableOpacity onPress={forgotMpinClick}
                >
                    <Text style={{ color: '#1E45E1', fontSize: 14, fontFamily: 'Gilroy-Medium', textDecorationLine: 'underline', }}>
                        Forgot Mpin</Text>
                </TouchableOpacity>
            </View>



        </View>


        {/* <View style={{ flex: 1, justifyContent: "center", }}>
            <TouchableOpacity onPress={enterPinClick} style={style.nextButton}>
                <Text style={style.nextText}>Enter mPIN</Text>
            </TouchableOpacity>
        </View> */}



    </View>

}

const style = StyleSheet.create({
    logo: { width: 66.32, height: 66.25, resizeMode: 'contain' },
    createText: { fontSize: 24, fontFamily: 'Gilroy-Semibold', color: '#222222', marginTop: 20, textAlign: 'center' },
    subtitle: { fontSize: 14, fontFamily: 'Gilroy-Medium', color: '#4B4B4B', marginTop: 15 },
    pinContainer: {
        flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 10,
        paddingRight: 10, marginBottom: 5, marginTop: 40, height: 60
    },
    pinBox: {
        width: 60, heiht: 60, borderWidth: 1, borderColor: "#ccc", borderRadius: 12, textAlign: "center",
        fontSize: 24, color: "#000", fontFamily: 'Gilroy-Medium'
    },
    nextButton: { backgroundColor: '#1A73E8', borderRadius: 8, paddingVertical: 20, alignItems: 'center' },
    nextText: { color: '#ffffff', fontSize: 16, fontWeight: 600 },
    title: {
        fontSize: 28,
        fontWeight: "600",
        marginTop: 10,
    },

})

export default EnterMPin
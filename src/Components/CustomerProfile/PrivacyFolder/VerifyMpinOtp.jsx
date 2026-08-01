import { CommonActions, useNavigation, useNavigationState } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { Image, NativeModules, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import LeftArrow from "../../../assets/Images/LeftArrow.png"
import { LoginContexts } from "../../../Context/LoginContext";
import { resendMpinOtp, verifyOtpMpin } from "../../../Action/LoginAction";
import SuccessModal from "../../ToastFile/TostFilePage";
import { storeData } from "../../../Utils/Storage";
import { ACCESS_TOKEN } from "../../../Utils/Constant";



const VerifyMpinOtp = ({ route }) => {

    const routes = useNavigationState(state => state.routes);

useEffect(() => {
  console.log("Routes:", routes.map(r => r.name));
}, [routes]);

    const navigation = useNavigation();
    const { NotificationModule,CommonModule } = NativeModules;
    const loginContext = useContext(LoginContexts)
    const [otp, setOtp] = useState("")
    const { mPin } = route?.params

    const [time, setTime] = useState(60);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showModelMessage, setShowModelMessage] = useState()
    const [modelType, setModelType] = useState();
    const [loading,setLoading]=useState(false)
    console.log("verifyroute", route)
    console.log(otp)

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(prev => {
                if (prev === 0) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [time]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;

        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

    const clickConfirm = async () => {

        if (otp.trim().length < 6) {
            return;
        }
       

        const data = {
            mpin: mPin,
            otp: otp
        }
        setLoading(true)
        try {
            const res = await verifyOtpMpin(data, loginContext?.getToken)
            console.log(res)
            if (res?.status == 200) {
                setLoading(false)
                setShowSuccessModal(true)
                setShowModelMessage("Mpin Changed")
                setModelType("success")
               loginContext.updateToken(res.data)
               storeData(ACCESS_TOKEN, res.data)
               CommonModule.storeCredentials(res.data)
                setTimeout(() => {
                    setShowSuccessModal(false)
                     navigation.pop(2);
                }, 1000);
            } else {
                setLoading(false)
                setShowSuccessModal(true)
                setShowModelMessage(res?.message)
                setModelType("error")
                setTimeout(() => {
                    setShowSuccessModal(false)
                }, 1200);
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
        }


    }

    const resendOtp = async () => {
        try {
            const res = await resendMpinOtp(loginContext?.getToken)
            console.log("resendotp", res)
            if (res?.status == 200) {
                setShowSuccessModal(true)
                setShowModelMessage(res?.data)
                setModelType("success")
                setTimeout(() => {
                    setShowSuccessModal(false)
                }, 1200);
            } else {
                setShowSuccessModal(true)
                setShowModelMessage(res?.data)
                setModelType("error")
                setTimeout(() => {
                    setShowSuccessModal(false)
                }, 1200);
            }

        } catch (error) {
            console.log(error)
        }

    }



    return (
        <View style={styles.mainContainer}>
            <SuccessModal
                visible={showSuccessModal}
                onClose={() => { setShowSuccessModal(false) }}
                message={showModelMessage}
                type={modelType} />
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image source={LeftArrow} style={{ width: 20, height: 20, marginTop: 25 }} />
            </TouchableOpacity>

            <Text style={styles.headerTxt}>Verify your mPin with OTP </Text>

            <Text style={styles.subTxt}>
                A 6 digit OTP has been sent to +91 {loginContext?.getPhoneNo}
            </Text>

            <TextInput
                style={styles.inputBox}
                value={otp}
                placeholder="Enter OTP"
                maxLength={6}
                keyboardType="number-pad"
                onChangeText={(text) => {
                    const cleanText = text.replace(/[^0-9]/g, "");
                    setOtp(cleanText)
                }} />

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', color: '#353B41' }}>Didn't receive OTP?</Text>
                    <TouchableOpacity style={[{ marginLeft: 5 }, time != 0 && { opacity: 0.3 }]} onPress={() => {
                        resendOtp()
                        setTime(60)
                    }}
                        disabled={time != 0 ? true : false}>
                        <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', color: '#1E45E1' }}>Resend</Text>
                    </TouchableOpacity>
                </View>


                <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', color: '#4B4B4B' }}>{formatTime(time)}</Text>
            </View>

            <TouchableOpacity onPress={clickConfirm}
                style={{
                    backgroundColor: '#1E45E1', borderRadius: 10, marginTop: 60, paddingVertical: 18,
                    paddingHorizontal: 14, justifyContent: 'center', alignItems: 'center'
                }}>
                <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Semibold', color: '#FFFFFF' }}>Confirm</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: '#FFFFFF',
        flex: 1, paddingHorizontal: 20,
        paddingVertical: 20
    },
    headerField: {
        marginTop: 18, flexDirection: 'row', alignItems: 'center', marginBottom: 6
    },
    headerTxt: {
        fontSize: 26, fontFamily: 'Gilroy-Semibold', marginTop: 26
    },
    chngePinTxt: {
        fontSize: 16, fontFamily: 'Gilroy-Medium', marginLeft: 6
    },
    subTxt: {
        fontSize: 14, fontFamily: 'Gilroy-Regular', color: '#4B4B4B', marginTop: 20, lineHeight: 20
    },
    inputBox: {
        borderWidth: 1, borderColor: '#DCDCDC', borderRadius: 8, paddingVertical: 11.9, paddingHorizontal: 16,
        fontSize: 18, fontFamily: 'Gilroy-Regular', marginTop: 24
    }
})

export default VerifyMpinOtp;
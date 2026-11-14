import React, { useState, useContext, useRef } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import SuccessModal from "../ToastFile/TostFilePage";
import { UsersContext } from "../../Context/UserContext";
import { LoginContexts } from "../../Context/LoginContext";
import Sm_logo from '../../assets/Images/Sm_logo.png'
import { useNavigation } from "@react-navigation/native";
import { postMPin } from "../../Action/LoginAction";
import { storeData } from "../../Utils/Storage";
import { ACCESS_TOKEN, LOGGEDIN } from "../../Utils/Constant";
import AppLoader from "../ToastFile/LoaderPage";
import ErrorMessage from "../ToastFile/ErrorMessage";



const ResetNewMpin = (props) => {

    console.log(props)

    const navigation = useNavigation();
    const context = useContext(UsersContext)
    const loginContext = useContext(LoginContexts)
    const [createMpin, setCreateMpin] = useState(["", "", "", ""])
    const [mPinNumber, setmPinNumber] = useState(null)
    const inputs = useRef([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showModelMessage, setShowModelMessage] = useState()
    const [modelType, setModelType] = useState();
    const [loading, setLoading] = useState(false)
      const [enterPinError, setEnterPinError] = useState()
      const [mpinStatus, setMpinStatus] = useState('default');
          const [focusedmpinIndex, setFocusedMpinIndex] = useState(null);

           const getOtpBorderColor = (index) => {

     
        if (mpinStatus === 'error') {
            return '#EF4444';
        }
        if (focusedmpinIndex === index) {
            return '#2563EB';
        }



        if (mpinStatus === 'success') {
            return '#16A34A';
        }

        return '#D1D5DB';
    };

    console.log(context.getUserId)

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
        }
    }

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === "Backspace" && createMpin[index] === "" && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

       const validateForm=()=>{
        let valid=true;

        setEnterPinError("")

        const isValid = createMpin.every(digit => digit !== "");

        if (!isValid) {
            setEnterPinError("Please enter a valid 4-digit MPIN");
            return false;
        }
        return valid;        
    }

    const savePinClick = () => {
        if(!validateForm()) return;

        if (mPinNumber) {
            const data = {
                xuid: loginContext.getUserId,
                mPin: mPinNumber,
            }
            postMPin(data).then(r => {

                console.log(r)

                setLoading(true)

                setTimeout(() => {
                    setLoading(false)

                    if (r.status == 200) {

                        storeData(LOGGEDIN, "true")
                        // loginContext.updateRoute("confirmMPin")
                        context.updateHostelList(r.data)

                        setShowSuccessModal(true)
                        setShowModelMessage("Mpin Changed Successfully")
                        setModelType('success')

                        setTimeout(() => {
                            setShowSuccessModal(false);
                            //   navigation.navigate('EnterMPin')
                            navigation.reset({
                                index: 0,
                                routes: [{ name: "EnterMPin" }],
                            });

                            loginContext.loggedin('true')
                        }, 2000);
                    }

                }, 2000);

            })
        }
        else {
            setShowSuccessModal(true)
            setShowModelMessage("Invalid MPIN")
            setModelType('error')

            setTimeout(() => {
                setShowSuccessModal(false);
            }, 2000);
        }
    }

    return <View style={{ paddingHorizontal: 20, flex: 1 }}>
        <AppLoader visible={loading} />
        <SuccessModal
            visible={showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
            message={showModelMessage}
            type={modelType}
        />
        <View>
            <Image source={Sm_logo} style={style.logo} />

            <Text style={style.createText}>Change mPIN</Text>

            <Text style={style.subtitle}>Please enter the same mPIN again for confirmation</Text>

            <View style={style.pinContainer}>
                {createMpin.map((digit, index) => (
                    <TextInput
                        key={index}
                        ref={(ref) => (inputs.current[index] = ref)}
                        keyboardType="number-pad"
                        style={[style.pinBox,{
                            borderColor: getOtpBorderColor(index),
                            borderWidth: focusedmpinIndex === index ? 2 : 1.5,
                        }]}
                        maxLength={1}
                        value={digit}
                        onChangeText={(text) => handlePinChange(text, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        onFocus={()=> setFocusedMpinIndex(index)}
                        onBlur={() => setFocusedMpinIndex(null)}
                    />
                ))}
            </View>
            {enterPinError && <ErrorMessage message={enterPinError} type="error"/>}

        </View>



        <TouchableOpacity onPress={savePinClick} style={style.nextButton}>
            <Text style={style.nextText}>Save mPIN</Text>
        </TouchableOpacity>


    </View>

}

const style = StyleSheet.create({
    logo: { width: 151, height: 28.22, marginTop: 70, },
    createText: { fontSize: 26,fontFamily:'Gilroy-Semibold', color: '#222222', marginTop: 20 },
    subtitle: { fontSize: 14,fontFamily: 'Gilroy-Medium', color: '#4B4B4B', marginTop: 15 },
      pinContainer: {
        flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 10,
        paddingRight: 10, marginBottom: 5, marginTop: 40, height: 60
    },
    pinBox: {
        width: 60, heiht: 60, borderWidth: 1, borderColor: "#ccc", borderRadius: 12, textAlign: "center",
        fontSize: 24, color: "#000", fontFamily: 'Gilroy-Medium'
    },
    nextButton: { backgroundColor: '#00A32E', borderRadius: 12, paddingVertical: 18, alignItems: 'center', marginTop: 250 },
    nextText: { color: '#ffffff', fontSize: 16,fontFamily:'Gilroy-Bold' }

})

export default ResetNewMpin;
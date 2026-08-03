import React, { useContext, useRef, useState } from "react";
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import Sm_logo from '../../assets/Images/Sm_logo.png'
import { useNavigation } from "@react-navigation/native";
import { postMPin } from "../../Action/LoginAction";
import { UsersContext } from "../../Context/UserContext";
import SuccessModal from "../ToastFile/TostFilePage";
import { storeData } from "../../Utils/Storage";
import { ACCESS_TOKEN,HOSTELLIST,LOGGEDIN } from "../../Utils/Constant";
import { LoginContexts } from "../../Context/LoginContext";
import ErrorMessage from "../ToastFile/ErrorMessage";

const ConfirmMPin = (props) => {
    console.log(props)

    const navigation = useNavigation();
    const context = useContext(UsersContext)
    const loginContext=useContext(LoginContexts)
    const [createMpin, setCreateMpin] = useState(["", "", "", ""])
    const [mPinNumber, setmPinNumber] = useState(null)
    const inputs = useRef([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showModelMessage, setShowModelMessage] = useState()
    const [modelType, setModelType] = useState();
    const [enterPinError, setEnterPinError] = useState()

    console.log(context.getUserId)

    const handlePinChange = async (text, index) => {
        const newPin = [...createMpin];
        newPin[index] = text;
        setCreateMpin(newPin);

        if (text && index < 3) {
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

        if (props.route.params.mPinNumber == mPinNumber) {
            const data = {
                xuid: loginContext.getUserId,
                mPin: mPinNumber,
            }
            postMPin(data).then(r => {
                console.log(r)
                if (r.status == 200) {

                    storeData(LOGGEDIN, "true")
                    loginContext.updateRoute("confirmMPin")
                    context.updateHostelList(r.data)
                    storeData(HOSTELLIST, JSON.stringify(r.data))

                    setShowSuccessModal(true)
                    setShowModelMessage("Login Successfully")
                    setModelType('success')

                    setTimeout(() => {
                        setShowSuccessModal(false);
                        loginContext.loggedin('true')
                    }, 2000);
                }
            })
        }
        else {
            setShowSuccessModal(true)
            setShowModelMessage("Incorrect MPIN")
            setModelType('error')

            setTimeout(() => {
                setShowSuccessModal(false);
            }, 2000);
        }
    }

    return <View style={{ paddingHorizontal: 20, flex: 1,backgroundColor:'#ffffff' }}>
        <SuccessModal
            visible={showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
            message={showModelMessage}
            type={modelType}
        />
        <View>
            <Image source={Sm_logo} style={style.logo} />

            <Text style={style.createText}>Confirm mPIN</Text>

            <Text style={style.subtitle}>Please enter the same mPIN again for confirmation</Text>

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
                        onKeyPress={(e) => handleKeyPress(e, index)}
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
    createText: { fontSize: 28,fontFamily:'Gilroy-Semibold', color: '#222222', marginTop: 20 },
    subtitle: { fontSize: 14,fontFamily:'Gilroy-Medium', color: '#4B4B4B', marginTop: 15 },
    // pinContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 20,
    //      paddingLeft: 10, paddingRight: 10,marginBottom:5,height:60 },
    pinContainer: {
       flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 10,
        paddingRight: 10, marginBottom: 5, marginTop: 30, height: 60
    },
    pinBox: {
        width: 60, heiht: 60, borderWidth: 1, borderColor: "#ccc", borderRadius: 12, textAlign: "center",
        color: "#000",fontFamily:'Gilroy-Medium',fontSize:24
    },
    nextButton: { backgroundColor: '#00A32E', borderRadius: 8, paddingVertical: 20, alignItems: 'center', marginTop: 250 },
    nextText: { color: '#ffffff', fontSize: 16,fontFamily:'Gilroy-Semibold'}

})

export default ConfirmMPin;
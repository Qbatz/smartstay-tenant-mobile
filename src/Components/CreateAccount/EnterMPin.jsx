import React, { useContext, useRef, useState } from "react";
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import Sm_logo from '../../assets/Images/Sm_logo.png'
import { useNavigation } from "@react-navigation/native";
import { UsersContext } from "../../Context/UserContext";
import { verifyMPin } from "../../Action/LoginAction";
import SuccessModal from "../ToastFile/TostFilePage";
import { storeData } from "../../Utils/Storage";
import { ACCESS_TOKEN,LOGGEDIN } from "../../Utils/Constant";

const EnterMPin = () => {

    const context = useContext(UsersContext)
    const navigation=useNavigation()
    const [createMpin, setCreateMpin] = useState(["", "", "", ""])
    const [mPinNumber, setmPinNumber] = useState(null)
    const inputs = useRef([])
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showModelMessage, setShowModelMessage] = useState()
    const [modelType, setModelType] = useState();


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
            console.log(pinNumber)
        }
    }

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === "Backspace" && createMpin[index] === "" && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    const enterPinClick = () => {

        const data = {
            userId: context.getUserId,
            newMpin: mPinNumber,
        }

        verifyMPin(data).then(r => {
            console.log(r)
            if (r.status == 200) {
                storeData(ACCESS_TOKEN, r.data)
                storeData(LOGGEDIN, "true")
                context.updateToken(r.data)

                setShowSuccessModal(true)
                setShowModelMessage("Login Successfully")
                setModelType('success')

                setTimeout(() => {
                    setShowSuccessModal(false);
                    navigation.navigate('HostelList')
                }, 2000);
            }
            else if (r.status == 401) {
                setShowSuccessModal(true)
                setShowModelMessage("Incorrect MPIN")
                setModelType('error')

                setTimeout(() => {
                    setShowSuccessModal(false);
                }, 2000);
            }
        })
    }

    return <View style={{ paddingHorizontal: 20, flex: 1 }}>
        <SuccessModal
            visible={showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
            message={showModelMessage}
            type={modelType}
        />
        <View>
            <Image source={Sm_logo} style={style.logo} />

            <Text style={style.createText}>Enter mPIN</Text>

            <Text style={style.subtitle}>Please enter the mPIN </Text>

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

        </View>



        <TouchableOpacity onPress={enterPinClick} style={style.nextButton}>
            <Text style={style.nextText}>Enter mPIN</Text>
        </TouchableOpacity>


    </View>

}

const style = StyleSheet.create({
    logo: { width: 151, height: 28.22, marginTop: 70, },
    createText: { fontSize: 27, fontWeight: 600, color: '#222222', marginTop: 20 },
    subtitle: { fontSize: 14, fontWeight: 400, color: '#4B4B4B', marginTop: 15 },
    pinContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 20, paddingLeft: 20, paddingRight: 80 },
    pinBox: {
        width: 50, heiht: 50, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, textAlign: "center",
        fontSize: 20, color: "#000"
    },
    nextButton: { backgroundColor: '#1A73E8', borderRadius: 8, paddingVertical: 20, alignItems: 'center', marginTop: 250 },
    nextText: { color: '#ffffff', fontSize: 16, fontWeight: 600 }

})

export default EnterMPin
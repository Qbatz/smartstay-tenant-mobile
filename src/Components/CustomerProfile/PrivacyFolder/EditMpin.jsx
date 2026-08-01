import React, { useContext, useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LeftArrow from "../../../assets/Images/LeftArrow.png"
import { TextInput } from "react-native";
import { changePostMpin, verifyMPin } from "../../../Action/LoginAction";
import { UsersContext } from "../../../Context/UserContext";
import { LoginContexts } from "../../../Context/LoginContext";
import { useNavigation } from "@react-navigation/native";
import SuccessModal from "../../ToastFile/TostFilePage";




const EditMpin = () => {

    const context = useContext(UsersContext)
    const navigation = useNavigation();
    const loginContext = useContext(LoginContexts)
    const [createMpin, setCreateMpin] = useState(["", "", "", ""])
    const [mPinNumber, setmPinNumber] = useState(null)
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showModelMessage, setShowModelMessage] = useState()
    const [modelType, setModelType] = useState();
    const inputs = useRef([])
    const [enterPinError, setEnterPinError] = useState()


    console.log(mPinNumber)
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
                mpin: pinNumber,
            }

            changePostMpin(data, loginContext?.getToken).then(r => {
                console.log(r)
                if (r.status == 200) {
                    console.log(r.data)
                    // setHostelList(r.data)


                    setShowSuccessModal(true)
                    setShowModelMessage(r.data)
                    setModelType('success')

                    setTimeout(() => {
                        setShowSuccessModal(false);
                        navigation.navigate("VerifyMpinOtp",{mPin: pinNumber})
                        // storeData(LOGGEDIN, "true")
                        // loginContext.loggedin('true')
                        // context.updateHostelList(r.data)
                        // storeData(HOSTELLIST, JSON.stringify(r.data))
                        // navigation.navigate('HostelList')
                        // props.callbackMpin()
                    }, 2000);
                }
                else if (r.status == 400) {
                    setShowSuccessModal(true)
                    setShowModelMessage(r?.message || "Incorrect MPIN")
                    setModelType('error')
                    setCreateMpin(["", "", "", ""])

                    setTimeout(() => {
                        setShowSuccessModal(false);
                        inputs.current[0].focus();
                    }, 2000);
                }
                else {
                    setShowSuccessModal(true)
                    setShowModelMessage(r?.message)
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


    return (
        <View style={styles.mainContainer}>
            <SuccessModal
                visible={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                message={showModelMessage}
                type={modelType} />

            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image source={LeftArrow} style={{ width: 20, height: 20, marginTop: 25 }} />
            </TouchableOpacity>

            <Text style={styles.headerTxt}>Create your new mPin</Text>

            <Text style={styles.subTxt}>
                To keep your details secure, enter the new mPin you wish to use, we'll ask for this
                mPin every time when you open the app
            </Text>

            <View style={styles.pinContainer}>
                {createMpin.map((digit, index) => (
                    <TextInput
                        key={index}
                        ref={(ref) => (inputs.current[index] = ref)}
                        keyboardType="number-pad"
                        style={styles.pinBox}
                        maxLength={1}
                        value={digit}
                        onChangeText={(text) => handlePinChange(text, index)}
                        onFocus={() => handleFocus(index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                    />
                ))}
            </View>

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
        fontSize: 26, fontFamily: 'Gilroy-Semibold', marginTop: 20
    },
    chngePinTxt: {
        fontSize: 16, fontFamily: 'Gilroy-Medium', marginLeft: 6
    },
    subTxt: {
        fontSize: 14, fontFamily: 'Gilroy-Regular', color: '#4B4B4B', marginTop: 20, lineHeight: 20
    },
    pinContainer: {
        flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 10,
        paddingRight: 10, marginBottom: 5, marginTop: 30, height: 60
    },
    pinBox: {
        width: 60, heiht: 60, borderWidth: 1, borderColor: "#ccc", borderRadius: 12, textAlign: "center",
        color: "#000", fontFamily: 'Gilroy-Medium', fontSize: 24
    },
})
export default EditMpin;
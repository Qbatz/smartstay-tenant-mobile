import React, { useState, useRef, useContext } from "react";
import { View, Text, TextInput, StyleSheet, Image, Alert, TouchableOpacity, } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LoginContext } from "../../Context/LoginContext";
import { postResendOtp, verifyOtp } from "../../Action/LoginAction";
import { UsersContext } from "../../Context/UserContext";
import { storeData } from "../../Utils/Storage";
import { ACCESS_TOKEN, PHONE_NO, LOGGEDIN, USERID } from "../../Utils/Constant";
import SuccessModal from "../ToastFile/TostFilePage";
import { LoginContexts } from "../../Context/LoginContext";

const OtpDesign = ({ route }) => {

  const navigation = useNavigation();
  const { phone } = route.params;
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showModelMessage, setShowModelMessage] = useState()
  const [modelType, setModelType] = useState();


  const context = useContext(UsersContext)
  const loginContext = useContext(LoginContexts)
  console.log(loginContext.SerialNo)
  // const { verifyOtp , resendOtp } = useContext(LoginContext); 

  const handleOtpChange = async (text, index) => {
     const cleanText = text.replace(/[^0-9]/g, "");
    const newOtp = [...otp];
    newOtp[index] = cleanText;
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }



    if (newOtp.every((digit) => digit !== "")) {
      const otpValue = newOtp.join("");
      console.log("Entered OTP:", otpValue);
      const data = await verifyOtp(route.params.phone, otpValue, context.SerialNo)
      console.log(data)
      if (data.status == 200) {
        console.log(data.data)
        loginContext.userId(data.data.xuid)
        loginContext.phoneNo(route.params.phone)
        storeData(PHONE_NO, route.params.phone)
        storeData(LOGGEDIN, 'true')
        storeData(USERID, data.data.xuid)

        if (data.data.isMpinVerified == true) {
          loginContext.loggedin('true')
        }
        else {
          navigation.navigate('CreateMpin')
        }
      }
      else if (data.status == 401) {
        setShowSuccessModal(true)
        setShowModelMessage("Invalid OTP")
        setModelType('error')

        setTimeout(() => {
          setShowSuccessModal(false);
        }, 2000);
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const resendOtp = () => {

    postResendOtp(loginContext.getUserId).then(r => {
      console.log(r)

      if (r.status == 200) {
        setShowSuccessModal(true)
        setShowModelMessage(r.data)
        setModelType('success')

        setTimeout(() => {
          setShowSuccessModal(false)
        }, 4000);
      }else{
        setShowSuccessModal(true)
        setShowModelMessage('Invalid Otp')
        setModelType('error')

        setTimeout(() => {
          setShowSuccessModal(false)
        }, 2000);
      }

    })
  }

  return (
    <View style={styles.container}>
      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={showModelMessage}
        type={modelType}
      />
      <Image source={require("../../assets/Images/Sm_logo.png")} />
      <Text style={styles.title}>Otp Validation</Text>
      <Text style={styles.subtitle}>
        Enter the 4 digit otp sent on +91 {phone} to proceed
      </Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputs.current[index] = ref)}
            style={styles.otpBox}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleOtpChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
          />
        ))}
      </View>

      <Text style={styles.resendText}>
        Didn’t receive OTP?
        <TouchableOpacity onPress={resendOtp} >
          <Text style={styles.resendLink}>Resend</Text></TouchableOpacity>
      </Text>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 25, paddingTop: 50 },
  title: { fontSize: 22, fontWeight: "700", color: "#000", marginBottom: 5 },
  subtitle: { color: "#555", marginBottom: 25 },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  otpBox: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 20,
    color: "#000",
  },
  resendText: { color: "#555" },
  resendLink: { color: "#0057FF", fontWeight: "600" },
});

export default OtpDesign;

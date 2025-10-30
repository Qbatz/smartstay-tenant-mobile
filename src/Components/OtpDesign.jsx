import React, { useState, useRef } from "react";
import { View, Text, TextInput, StyleSheet, Image } from "react-native";

const OtpDesign = ({ route }) => {
  const { phone } = route.params;
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs = useRef([]);

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 3) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/Images/Sm_logo.png")} />
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
        Didn’t receive OTP? <Text style={styles.resendLink}>Resend</Text>
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
    width: 55,
    height: 55,
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

import React, { useContext, useRef, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    SafeAreaView,
} from "react-native";
import Sm_logo from '../../assets/Images/Sm_logo.png'
import { UsersContext } from "../../Context/UserContext";


const LoginMobileScreen = () => {
    const context=useContext(UsersContext)
    const [countryCode, setCountryCode] = useState("IN");
    const [callingCode, setCallingCode] = useState("91");
    const [phone, setPhone] = useState("");
    const [mpin, setMPIN] = useState(["", "", "", ""]);
    const[otp,setOTP]=useState(null);
    const inputRefs = useRef([]);

    console.log(mpin)

    const handleMPIN = (text, index) => {
        const updated = [...mpin];
        updated[index] = text;
        setMPIN(updated);

        if (text !== "" && index < 3) {
            inputRefs.current[index + 1].focus();
        }
        if (text === "" && index > 0) {
            inputRefs.current[index - 1].focus();
        }

        if(updated.every((digit)=>digit !== "")){
            const getOTP=updated.join("");
            setOTP(getOTP)
            console.log(getOTP)
        }
    };

    const GetOTPClick=()=>{
        context.loggedin('true')
    }

    return (
        <SafeAreaView style={styles.container}>
            <Image source={Sm_logo} style={styles.logo} />

            <View style={styles.card}>
                <Text style={styles.title}>Login with Mobile</Text>

                <Text style={styles.subtitle}>
                    Enter your mobile number to get OTP{"\n"}Verification
                </Text>

                <Text style={styles.label}>Phone number *</Text>

                <View style={styles.inputBox}>
                    
                    <Text style={styles.countryCode}>+{callingCode}</Text>

                    <TextInput
                        style={styles.phoneInput}
                        keyboardType="number-pad"
                        placeholder="98765 43210"
                        value={phone}
                        onChangeText={setPhone}
                        maxLength={10}
                    />
                </View>

                <Text style={styles.label}>Enter mPIN *</Text>

                <View style={styles.mpinContainer}>
                    {mpin.map((value, i) => (
                        <TextInput
                            key={i}
                            ref={(ref) => (inputRefs.current[i] = ref)}
                            style={styles.mpinBox}
                            keyboardType="number-pad"
                            secureTextEntry
                            maxLength={1}
                            value={value}
                            onChangeText={(text) => handleMPIN(text, i)}
                        />
                    ))}
                </View>

                <TouchableOpacity style={styles.forgotView}>
                    <Text  style={styles.forgotText}>Forgot PIN?</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={GetOTPClick}
              style={[styles.otpBtn,!otp&&styles.disabledbutton]} disabled={!otp}>
                <Text style={styles.otpText}>Get OTP →</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default LoginMobileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        paddingHorizontal:25,
        paddingTop:30
    },
    logo: {
        width: 180,
        height: 45,
        resizeMode: "contain",
        marginBottom: 10,
        marginTop: 10,
    },
    card: {
        width: "100%",
        marginTop: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: "600",
        marginBottom: 6,
        color: "#222",
    },
    subtitle: {
        fontSize: 14,fontWeight:400,
        color: "#444",
        marginBottom: 15,marginTop:15
    },
    label: {
        fontSize: 12,
        marginBottom: 4,color:'#222222',    
        fontWeight: "400",
    },
    inputBox: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        height: 55,
        paddingHorizontal: 12,
        marginBottom: 18,
    },
    countryCode: {
        marginLeft: 4,
        fontSize: 16,
        fontWeight: "600",
    },
    phoneInput: {
        flex: 1,
        fontSize: 16,
        marginLeft: 12,
    },
    mpinContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    mpinBox: {
        width: 60,
        height: 55,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        fontSize: 22,
        textAlign: "center",
        fontWeight: "600",
    },
    forgotView: {
        alignSelf: "flex-end",
        marginTop: 4,
    },
    forgotText: {
        fontSize: 14,
        color: "#2A57F7",
        fontWeight: "600",
        textDecorationLine:'underline'
    },
    otpBtn: {
        width: "100%",
        height: 55,
        backgroundColor:'blue',
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 80,
    },
    otpText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
    },
    disabledbutton:{
        backgroundColor: "#A8C1FF",
    }
});

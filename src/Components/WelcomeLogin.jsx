import React, { useState, useRef, useEffect, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    CheckBox,
    Image, Animated
} from "react-native";
import Sm_logo from '../assets/Images/Sm_logo.png';
import WaveIcon from '../assets/Images/HiIcon.png'
import { UsersContext } from "../Context/UserContext";

const LoginScreen = () => {

    const context=useContext(UsersContext)
    const [mpin, setMPIN] = useState(["", "", "", ""]);
    const [otp, setOTP] = useState(null);
    const inputRefs = useRef([]);

    const rotation = useRef(new Animated.Value(0)).current;

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

    const rotateInterpolate = rotation.interpolate({
        inputRange: [-1, 1],
        outputRange: ["0deg", "10deg"], // waving angle
    });

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

        if (updated.every((digit) => digit !== "")) {
            const getOTP = updated.join("");
            setOTP(getOTP)
            console.log(getOTP)
        }
    };

    const LoginClick=()=>{
            context.loggedin('true')
    }



    return <View style={styles.container}>
        <Image source={Sm_logo} style={{ width: 151, height: 28.23, marginTop: 2 }} />

        <View style={{ flexDirection: 'row', alignItems: 'center',paddingTop:15 }}>
            <Text style={styles.title}>Welcome Back</Text>

            <Animated.Image
                source={WaveIcon}
                style={[
                    styles.hand,
                    {
                        width: 25,
                        height: 25,
                        marginTop: 8,
                        marginLeft: 5,
                        transform: [{ rotate: rotateInterpolate }],
                    },
                ]}
            />

        </View>

        <Text style={styles.subtitle}>Enter 4 Digit Login PIN for  +91 89765 65756</Text>

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

        <View style={styles.row}>
            


                <Text style={styles.otpText}>Login with OTP</Text>

        <TouchableOpacity style={styles.forgotBtn}>
          <Text style={styles.forgotText}>Forgot PIN?</Text>
        </TouchableOpacity>            
        </View>

        <TouchableOpacity onPress={LoginClick} disabled={otp==null?true:false}
         style={styles.loginBtn}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
    </View>


        ;
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingTop: 50,paddingBottom:30
    },
    logoText: {
        fontSize: 26,
        fontWeight: "700",
        color: "#1A73E8",
        marginBottom: 20,
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
    mpinContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: "600",
        marginTop: 10,
    },
    subtitle: {
        color: "#555",
        marginTop: 25,
        marginBottom: 30,
    },
    pinContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 20,
    },
    pinBox: {
        width: 60,
        height: 60,
        borderRadius: 10,
        borderWidth: 1,
        textAlign: "center",
        fontSize: 22,
        borderColor: "#ddd",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 30,
    },
    otpText: {
        marginLeft: 8,
        color: "#000",
    },
    forgotBtn: {
        marginLeft: "auto",
    },
    forgotText: {
        color: "#1A73E8",
        fontWeight: "600",
    },
    loginBtn: {
        backgroundColor: "#1A46E8",
        paddingVertical: 16,
        borderRadius: 10,
        alignItems: "center",
        marginTop: "50%",
    },
    loginText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
});

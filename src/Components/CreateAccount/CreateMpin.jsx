import React, { useRef, useState } from "react";
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity,Dimensions } from "react-native";
import Sm_logo from '../../assets/Images/Sm_logo.png'
import { useNavigation } from "@react-navigation/native";
import ErrorMessage from "../ToastFile/ErrorMessage";

const { width } = Dimensions.get("window");

const CreateMpin = (props) => {

    const navigation=useNavigation();

    const [createMpin, setCreateMpin] = useState(["", "", "", ""])
    const [mPinNo,setmPinNo]=useState(null);
    const inputs = useRef([])
    const isFilled = createMpin.every((n) => n !== "");
    const [enterPinError, setEnterPinError] = useState()

    console.log(createMpin)
    console.log(props)

    const handlePinChange = async (text, index) => {
        const newPin = [...createMpin];
        newPin[index] = text;
        setCreateMpin(newPin);

        if (text && index < 3) {
            inputs.current[index + 1].focus();
        }

        if(newPin.every((digit)=>digit !== "")){
            const pinNumber=newPin.join("");
            setmPinNo(pinNumber)
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

    const nextClick=()=>{
        if(!validateForm()) return;

        navigation.navigate('ConfirmMPin',{mPinNumber:mPinNo})
    }

    return <View style={{ paddingHorizontal: 20,flex:1,backgroundColor:'#ffffff'}}>
        <View>
             <Image source={Sm_logo} style={style.logo} />

        <Text style={style.createText}>Create mPIN</Text>

        <Text style={style.subtitle}>Create your 4-digit unique mPin for smooth signin</Text>

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

       

        <TouchableOpacity onPress={nextClick} style={[style.nextButton, !isFilled && style.disabledButton]}
        >
            <Text style={style.nextText}>Next</Text>
        </TouchableOpacity>


    </View>

}

const style = StyleSheet.create({
    logo: { width: 151, height: 28.22, marginTop: 70, },
    createText: { fontSize: 28,fontFamily:'Gilroy-Semibold', color: '#222222', marginTop: 20 },
    subtitle: { fontSize: 14,fontFamily:'Gilroy-Medium', color: '#4B4B4B', marginTop: 15 },
    // pinContainer: { flexDirection: 'row',justifyContent:'space-between',paddingTop:20,paddingLeft:10,
    //                 paddingRight:10,marginBottom:5,height:60},
    pinContainer: {
        flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 10,
        paddingRight: 10, marginBottom: 5, marginTop: 30, height: 60
    },
    pinBox: {
        width: 60, height: 60, borderWidth: 1, borderColor: "#ccc", borderRadius: 12, textAlign: "center",
       color: "#000",fontFamily:'Gilroy-Medium',fontSize:24
    },
    nextButton:{backgroundColor: "#1E45E1",
        borderRadius: 10,
        paddingVertical: 14,
        marginTop: 250,
        alignItems: "center",},
    nextText:{color:'#ffffff',fontSize:16,fontFamily:'Gilroy-Semibold'},
    disabledButton: {
        backgroundColor: "#A8C1FF",
    },

})

export default CreateMpin;
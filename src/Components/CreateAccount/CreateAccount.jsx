import React, { useState , useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { verifyPhoneNo } from "../../Action/LoginAction";
import SuccessModal from "../ToastFile/TostFilePage";
import { LoginContexts } from "../../Context/LoginContext";

const CreateAccount = ({ navigation }) => {

  const loginContext=useContext(LoginContexts)
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const[otp,setOtp]=useState();
  

 const handlePhoneChange = (text) => { 
  const numericText = text.replace(/[^0-9]/g, '');
  setPhoneNumber(numericText);
  setIsButtonDisabled(numericText.length < 10);

};


const handleGetOtp = async () => {
  if (phoneNumber.length === 10) {

    const dat= await verifyPhoneNo(phoneNumber)
    console.log(dat)
    setOtp(dat.data.otp)
    loginContext.userId(dat.data.xuid)

    if(dat.status==200){

    
      setShowSuccessModal(true)
      setTimeout(() => {
            setShowSuccessModal(false);
              navigation.navigate("OtpDesign", { phone: phoneNumber });
            
            }, 4000);       
    }
  }
};



  return (
    <View style={styles.container}>
      <SuccessModal visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={otp}
        type="success"/>
      <View style={styles.topContent}>
        <Image
          source={require("../../assets/Images/Sm_logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Create Your Account</Text>
        <Text style={styles.subtitle}>
          Fill in the details below to create your {"\n"}SmartStay account.
        </Text>

        <Text style={styles.label}>
          Phone number <Text style={styles.required}>*</Text>
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.countryCode}>+91</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            placeholder="98765 43210" 
            value={phoneNumber}
            onChangeText={handlePhoneChange}
            maxLength={10}
          />
        </View>
      </View>

      <View style={styles.centerButtonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            isButtonDisabled ? styles.buttonDisabled : styles.buttonEnabled,
          ]}
          disabled={isButtonDisabled}
          onPress={handleGetOtp}
        >
          <Text style={styles.buttonText}>Get OTP →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 25,
  },
  topContent: {
    paddingTop: 50,
  },
  logo: {
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
    marginBottom: 5,
  },
  subtitle: {
    color: "#555",
    marginBottom: 25,
  },
  label: {
    fontWeight: "500",
    color: "#000",
    marginBottom: 8,
  },
  required: {
    color: "red",
  },
  inputContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    alignItems: "center",
    marginBottom: 25,
  },
  countryCode: {
    fontWeight: "600",
    fontSize: 16,
    color: "#000",
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  centerButtonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#bfc9ca",
  },
  buttonEnabled: {
    backgroundColor: "#0057FF",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CreateAccount;

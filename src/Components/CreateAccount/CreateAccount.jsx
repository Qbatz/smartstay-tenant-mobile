import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { verifyPhoneNo } from "../../Action/LoginAction";
import SuccessModal from "../ToastFile/TostFilePage";
import { LoginContexts } from "../../Context/LoginContext";
import ErrorMessage from "../ToastFile/ErrorMessage";
import AppLogo from "../../assets/Images/AppLogo.png"
import Ionicons from 'react-native-vector-icons/Ionicons'


const CreateAccount = ({ navigation }) => {

  const loginContext = useContext(LoginContexts)
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [otp, setOtp] = useState();
  const [modelTpe, setModelType] = useState()
  const [phoneNoError, setPhoneNoError] = useState()
  const [showDropdown, setShowDropdown] = useState(false)
  const [isFocus, setIsFocus] = useState(false)

  const countries = [
    { name: "India", code: "IN", dial_code: "+91" },
    { name: "United States", code: "US", dial_code: "+1" },
    { name: "United Kingdom", code: "GB", dial_code: "+44" },
    { name: "Australia", code: "AU", dial_code: "+61" },
  ];

  const [selectedCountry, setSelectedCountry] = useState(countries[0]);

  const handlePhoneChange = (text) => {
    const numericText = text.replace(/[^0-9]/g, '');
    setPhoneNumber(numericText);
    setPhoneNoError("")
    setIsButtonDisabled(numericText.length < 10);

  };

  const validateForm = () => {
    let valid = true

    setPhoneNoError("")

    if (phoneNumber.length != 10) {
      setPhoneNoError("Please enter valid mobile Number")
      valid = false;
    }

    return valid;
  }


  const handleGetOtp = async () => {
    if (!validateForm()) return;

    if (phoneNumber.length === 10) {

      const dat = await verifyPhoneNo(phoneNumber)
      console.log(dat)



      if (dat.status == 200) {
        loginContext.userId(dat.data.xuid)


        if (dat?.data?.otp) {
          setOtp(dat.data.otp)
          setModelType('success')
          setShowSuccessModal(true)
          setTimeout(() => {
            setShowSuccessModal(false);
            navigation.navigate("OtpDesign", { phone: phoneNumber });

          }, 4000);
        }
        else {
          navigation.navigate("OtpDesign", { phone: phoneNumber });
        }

      }
      else if (dat.status == 400) {
        setShowSuccessModal(true)
        setOtp(dat.message || "You are not belongs to any hostels")
        setModelType('error')

        setTimeout(() => {
          setShowSuccessModal(false)
        }, 2000);
      }
      else if (dat.status == dat.status) {
        setShowSuccessModal(true)
        setOtp(dat.message || "Something Went Wrong")
        setModelType('error')

        setTimeout(() => {
          setShowSuccessModal(false)
        }, 2000);
      }
    }
    else {
      setShowSuccessModal(true)
      setOtp("Please enter Valid Number")
      setModelType('error')
      setTimeout(() => {
        setShowSuccessModal(false)
      }, 1500);
    }
  };



  return (
    <View style={styles.container}>
      <SuccessModal visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={otp}
        type={modelTpe} />
      <View style={styles.topContent}>
        <Image
          source={AppLogo}
          style={styles.logo}
        />
        <Text style={styles.title}>Login With Mobile</Text>
        <Text style={styles.subtitle}>
          Enter your mobile number to get OTP {"\n"}verification
          {/* Fill in the details below to create your {"\n"}SmartStay account. */}
        </Text>

        <Text style={styles.label}>
          Phone number <Text style={styles.required}>*</Text>
        </Text>

        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.codeContainer}
            onPress={() => {
              if (!showDropdown) {
                setShowDropdown(true)
              } else {
                setShowDropdown(false)
              }
            }}
          >
            <Text style={styles.countryCode}>{selectedCountry.dial_code}</Text>
            <Ionicons
              name={isFocus ? "chevron-up" : "chevron-down"}
              size={22}
              color="#000"
              style={{ paddingRight: 3 }}
            />

          </TouchableOpacity>

          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            placeholder="98765 43210"
            value={phoneNumber}
            onChangeText={handlePhoneChange}
            onFocus={() => setIsFocus(true)}
            maxLength={10}
          />
        </View>
        {
          showDropdown && (
            <>
              <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
                <View style={styles.dropdownOverlay} />
              </TouchableWithoutFeedback>
              <View style={styles.overlay}>
                <ScrollView keyboardShouldPersistTaps="handled"
                  style={styles.dropdownBox}>
                  {
                    countries.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.countryItem}
                        onPress={() => setSelectedCountry(item)}>
                        <Text style={{ fontFamily: 'Gilroy-Medium', fontSize: 15 }}>{item.name} {item.dial_code}</Text>
                      </TouchableOpacity>
                    ))
                  }
                </ScrollView>
              </View>
            </>
          )
        }
        {phoneNoError && <ErrorMessage message={phoneNoError} type="error" />}
      </View>

      <View style={styles.centerButtonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            isButtonDisabled ? styles.buttonDisabled : styles.buttonEnabled,
          ]}
          // disabled={isButtonDisabled}
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
    width: 45,
    height: 45,
    resizeMode: 'contain'
  },
  title: {
    fontSize: 22,
    fontFamily: 'Gilroy-Semibold',
    color: "#000",
    marginBottom: 5,
    marginTop: 14
  },
  subtitle: {
    color: "#555",
    marginBottom: 25,
    fontFamily: 'Gilroy-Medium'
  },
  label: {
    fontFamily: 'Gilroy-Medium',
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
    marginBottom: 5,
  },
  codeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10
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
    fontFamily: 'Gilroy-Medium',
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
    fontFamily: 'Gilroy-Semibold',
  },
  overlay: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    zIndex: 1000,
    marginTop: 1,
  },

  dropdownBox: {
    //  width: 260,
    height: 200,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 10,
    elevation: 5,
  },
  countryItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderColor: "#eee",
  },
});

export default CreateAccount;

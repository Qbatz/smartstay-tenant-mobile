import React, { useState, useContext, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image, TextInput, TouchableWithoutFeedback, Keyboard, ScrollView } from "react-native";
import { LoginContexts } from "../../Context/LoginContext";
import SuccessModal from "../ToastFile/TostFilePage";
import { verifyPhoneNo } from "../../Action/LoginAction";
import ErrorMessage from "../ToastFile/ErrorMessage";
import { retriveData } from "../../Utils/Storage";
import { PHONE_NO } from "../../Utils/Constant";
import DirectionDown from "../../assets/Images/direction-down.png"
import Logo from "../../assets/Images/Sm_logo.png"



const EnterNumber = ({ navigation }) => {

  const loginContext = useContext(LoginContexts)
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [otp, setOtp] = useState();
  const [modelTpe, setModelType] = useState()
  const [phoneNoError, setPhoneNoError] = useState()
  const [showDropdown, setShowDropdown] = useState(false)


  const countries = [
    { name: "India", code: "IN", dial_code: "+91" },
    { name: "United States", code: "US", dial_code: "+1" },
    { name: "United Kingdom", code: "GB", dial_code: "+44" },
    { name: "Australia", code: "AU", dial_code: "+61" },
  ];

  const [selectedCountry, setSelectedCountry] = useState(countries[0]);

  useEffect(() => {
    retriveData(PHONE_NO).then(r => {
      setPhoneNumber(r)
    })
    setIsButtonDisabled(phoneNumber.trim().length !== 10);
  }, [phoneNumber])

  console.log(phoneNumber)
  const handlePhoneChange = (text) => {
    const numericText = text.replace(/[^0-9]/g, '');
    setPhoneNumber(numericText);
    setPhoneNoError("")
    console.log(numericText)
    // if (phoneNumber.trim().length != 9) { 
    //   setIsButtonDisabled(true);
    //  } 
    // else { setIsButtonDisabled(false) }


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
          setOtp(dat?.data?.otp)
        } else {
          setOtp("OTP Sent")
        }
        setModelType('success')
        setShowSuccessModal(true)
        setTimeout(() => {
          setShowSuccessModal(false);
          navigation.navigate("ForgotMpinOtp", { phone: phoneNumber });

        }, 1500);
      }
      else if (dat.status == 403) {
        setShowSuccessModal(true)
        setOtp('Invalid number')
        setModelType('error')

        setTimeout(() => {
          setShowSuccessModal(false)
        }, 2000);
      }
    }
  };



  // The iOS number pad has no return key, so tapping outside the field closes it.
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <SuccessModal visible={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          message={otp}
          type={modelTpe} />
        <View style={styles.topContent}>
          <Image
            source={Logo}
            style={styles.logo}
          />
          <Text style={styles.title}>Enter your mobile Number</Text>
          <Text style={styles.subtitle}>
            Fill in the details below to change your {"\n"} password.
          </Text>

          <Text style={styles.label}>
            Phone number <Text style={styles.required}>*</Text>
          </Text>

          {/* <View style={styles.inputContainer}>
          <Text style={styles.countryCode}>+91</Text>
          <View style={{borderWidth:0.8,height:"100%",marginRight:14,borderColor: "#ccc",}}/>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            placeholder="98765 43210"
            value={phoneNumber}
            onChangeText={handlePhoneChange}
            maxLength={10}
          />
        </View> */}
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

              <Image source={DirectionDown}
                style={{
                  width: 22, height: 22,
                  transform: [{ rotate: showDropdown ? '180deg' : '0deg' }],
                }} tintColor="#000"
              />

            </TouchableOpacity>

            <View style={{ borderWidth: 0.8, height: "100%", marginRight: 14, borderColor: "#ccc", }} />

            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              placeholder="98765 43210"
              value={phoneNumber}
              onChangeText={handlePhoneChange}
              maxLength={10}
            />
          </View>
          {
            showDropdown && (
              <>
                <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
                  <View style={StyleSheet.absoluteFill} />
                </TouchableWithoutFeedback>
                <View style={styles.overlay}>
                  <ScrollView keyboardShouldPersistTaps="handled"
                    style={styles.dropdownBox}>
                    {
                      countries.map((item, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.countryItem}
                          onPress={() => {
                            setSelectedCountry(item)
                            setShowDropdown(false)
                          }}>
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

        {console.log(isButtonDisabled)}
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
    </TouchableWithoutFeedback>
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
    borderRadius: 10,
    paddingHorizontal: 10,
    alignItems: "center",
    marginBottom: 5,
    height: 50,
  },
  codeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 6
  },

  countryCode: {
    fontWeight: "600",
    fontSize: 16,
    color: "#000",
    marginRight: 8,
  },
  input: {
    flex: 1,
    alignSelf: "stretch",
    paddingVertical: 0,
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


export default EnterNumber;
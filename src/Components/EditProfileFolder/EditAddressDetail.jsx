import React, { useContext, useEffect, useState } from "react";
import { Image, Text, TouchableOpacity } from "react-native";
import { StyleSheet, View } from "react-native";
import LeftArrow from "../../assets/Images/LeftArrow.png"
import { TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { UsersContext } from "../../Context/UserContext";
import ErrorMessage from "../ToastFile/ErrorMessage";
import SuccessModal from "../ToastFile/TostFilePage";
import { customerDetails, editProfile } from "../../Action/CustomerAction";
import { LoginContexts } from "../../Context/LoginContext";
import AppLoader from "../ToastFile/LoaderPage";


const EditAddressDetail = ({ }) => {

    const navigation = useNavigation();
    const { getCustomerDetail, updateCustomer } = useContext(UsersContext)
    const { getToken } = useContext(LoginContexts)

    const [houseNo, setHouseNo] = useState(getCustomerDetail?.houseNo || "")
    const [street, setStreet] = useState(getCustomerDetail?.street || "")
    const [landmark, setLandmark] = useState(getCustomerDetail?.landmark || "")
    const [city, setCity] = useState(getCustomerDetail?.city || "")
    const [pincode, setPincode] = useState(getCustomerDetail?.pincode?.toString() || "")
    const [initialHouseNo, setInitialHouseNo] = useState("")
    const [initialStreet, setInitialStreet] = useState("")
    const [initialLandmark, setInitialLandmark] = useState("")
    const [initialCity, setInitialCity] = useState("")
    const [initialPincode, setInitialPincode] = useState("")
    const [pincodeError, setPincodeError] = useState("")
    const [showSuccesModal, setShowSuccessModal] = useState(false)
    const [showSuccessMessage, setShowSuccessMessage] = useState("")
    const [modalType, setModalType] = useState("")
    const [loading, setLoading] = useState(false)

    console.log(getCustomerDetail)
    console.log(pincode, "pincode")

    useEffect(() => {
        if (getCustomerDetail) {
            setInitialHouseNo(getCustomerDetail?.houseNo)
            setInitialStreet(getCustomerDetail?.street)
            setInitialLandmark(getCustomerDetail?.landmark)
            setInitialCity(getCustomerDetail?.city)
            setInitialPincode(getCustomerDetail?.pincode)
        }
    }, [])

    const validateForm = () => {
        let isValid = true;
        console.log("fdsd")
        if (!pincode) {
            setPincodeError("Please Enter Pincode");
            isValid = false;
        }
        if (pincode.length < 6) {
            setPincodeError("Pincode should not be below 6 digit");
            isValid = false;
        }

        if ((houseNo ?? "").trim() === (initialHouseNo ?? "").trim() &&
            (street ?? "").trim() === (initialStreet ?? "").trim() &&
            (landmark ?? "").trim() === (initialLandmark ?? "").trim() &&
            (city ?? "").trim() === (initialCity ?? "").trim() &&
            String(pincode ?? "") === String(initialPincode ?? "")) {
            setShowSuccessModal(true)
            setShowSuccessMessage("No Changes Detected")
            setModalType("warning")
            setTimeout(() => {
                setShowSuccessModal(false)
            }, 1200);
            isValid = false;
        }
        return isValid;
    }

    const handleSave = () => {
        if (!validateForm()) return;

        console.log("sona")

        const payload = {
            houseNo: houseNo,
            street: street,
            landmark: landmark,
            city: city,
            pincode: pincode,
            // state: state,
        }
        console.log(payload)
        const formData = new FormData();

        const jsonBase64 = btoa(JSON.stringify(payload))

        formData.append("payloads", {
            uri: "data:application/json;base64," + jsonBase64,
            type: "application/json",
            name: "payload.json",
        })


        editProfile(getToken, formData).then(r => {
            console.log("editSucess",r)
            setLoading(true)

            setTimeout(() => {
                setLoading(false)

                if (r.status == 200) {
                    setShowSuccessModal(true)
                    setShowSuccessMessage('Updated Successfully')
                    setModalType('success')

                    setTimeout(() => {
                        customerDetails(getToken).then(r => {
                            console.log(r.data)
                            updateCustomer(r.data)

                        })
                        setShowSuccessModal(false)
                        navigation.goBack();
                    }, 2000);
                }
            }, 2000);

        })

    }


    return (
        <View style={styles.mainContainer}>
            <AppLoader visible={loading} />
            <SuccessModal
                visible={showSuccesModal}
                message={showSuccessMessage}
                type={modalType} />
            <View>
                <View style={styles.mainHeader}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={LeftArrow} style={{ height: 23.5, width: 23.5 }} />
                    </TouchableOpacity>
                    <Text style={styles.headerTxt}>Edit Address Details</Text>
                </View>


                <Text style={[styles.labelTxt, { marginTop: 18 }]}>HouseNo/Apartment
                    <Text style={{ color: 'red' }}> *</Text>
                </Text>
                <TextInput
                    value={houseNo}
                    style={styles.input}
                    placeholder="Enter HouseNo"
                    onChangeText={(text) => {
                        const onlyLetters = text.replace(/[^A-Za-z\s]/g, "")
                        setFirstName(onlyLetters)
                        setFirstNameError("")

                    }} />

                <Text style={[styles.labelTxt, { marginTop: 12 }]}>Street / Area</Text>
                <TextInput
                    value={street}
                    style={styles.input}
                    placeholder="Enter Street Name"
                    onChangeText={(text) => {
                        const onlyLetters = text.replace(/[^A-Za-z\s]/g, "")
                        setStreet(onlyLetters)

                    }} />

                <Text style={[styles.labelTxt, { marginTop: 12 }]}>Landmark</Text>
                <TextInput
                    value={landmark}
                    style={styles.input}
                    placeholder="Enter landmark"
                    onChangeText={(text) => {
                        const onlyLetters = text.replace(/[^A-Za-z\s]/g, "")
                        setLandmark(onlyLetters)

                    }} />

                <Text style={[styles.labelTxt, { marginTop: 12 }]}>City</Text>
                <TextInput
                    value={city}
                    style={styles.input}
                    placeholder="Enter City"
                    onChangeText={(text) => {
                        const onlyLetters = text.replace(/[^0-9\s]/g, "")
                        setCity(onlyLetters)

                    }} />

                <Text style={[styles.labelTxt, { marginTop: 12 }]}>Pincode</Text>
                <TextInput
                    value={pincode}
                    maxLength={6}
                    style={styles.input}
                    placeholder="Enter Pincode"
                    keyboardType="number-pad"
                    onChangeText={(text) => {
                        const onlyLetters = text.replace(/[^0-9\s]/g, "")
                        setPincode(onlyLetters)
                    }} />
                {pincodeError && <ErrorMessage message={pincodeError} type="error" />}
            </View>



            <TouchableOpacity onPress={handleSave}
                style={styles.saveBtn}>
                <Text style={styles.saveTxt}>Save Changes</Text>
            </TouchableOpacity>

        </View>
    )

}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 20,
        paddingVertical: 20, justifyContent: 'space-between'
    },
    mainHeader: {
        flexDirection: 'row', alignItems: 'center', marginTop: 12, marginBottom: 10
    },
    headerTxt: {
        fontSize: 20, fontFamily: 'Gilroy-Semibold', marginLeft: 6
    },
    input: {
        fontSize: 15,
        color: '#111827',
        paddingVertical: 14, paddingHorizontal: 10,
        marginTop: 10,
        fontFamily: 'Gilroy-Regular',
        borderWidth: 1, borderColor: '#EEEEEE', borderRadius: 8,
    },
    labelTxt: {
        fontSize: 14, fontFamily: "Gilroy-Medium", color: '#4B4B4B'
    },
    saveBtn: {
        backgroundColor: '#1E45E1', borderRadius: 10,
        paddingVertical: 14, alignItems: 'center', marginBottom: 40
    },
    saveTxt: {
        fontSize: 16, fontFamily: 'Gilroy-Semibold', color: '#ffffff'
    }
})
export default EditAddressDetail;
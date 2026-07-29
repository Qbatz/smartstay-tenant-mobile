import React, { useContext, useEffect, useState } from "react";
import { Image, Keyboard, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
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
import Ionicons from "react-native-vector-icons/Ionicons";



const EditAddressDetail = ({ route }) => {

    const navigation = useNavigation();
    const { getCustomerDetail, updateCustomer } = useContext(UsersContext)
    const { getToken } = useContext(LoginContexts)
    const { mode } = route?.params
    console.log(route)

    const [houseNo, setHouseNo] = useState(getCustomerDetail?.houseNo || "")
    const [street, setStreet] = useState(getCustomerDetail?.street || "")
    const [landmark, setLandmark] = useState(getCustomerDetail?.landmark || "")
    const [city, setCity] = useState(getCustomerDetail?.city || "")
    const [pincode, setPincode] = useState("")
    const [initialHouseNo, setInitialHouseNo] = useState("")
    const [initialStreet, setInitialStreet] = useState("")
    const [initialLandmark, setInitialLandmark] = useState("")
    const [initialCity, setInitialCity] = useState("")
    const [initialPincode, setInitialPincode] = useState("")
    const [initialState,setInitialState]=useState("")
    const [pincodeError, setPincodeError] = useState("")
    const [showSuccesModal, setShowSuccessModal] = useState(false)
    const [showSuccessMessage, setShowSuccessMessage] = useState("")
    const [modalType, setModalType] = useState("")
    const [loading, setLoading] = useState(false)
    const [selectedState, setSelectedState] = useState("");
    const [stateQuery, setStateQuery] = useState("");

    const [stateOpen, setStateOpen] = useState(false);

    console.log(getCustomerDetail)
    console.log(pincode, "pincode")
    console.log("selectedstate",selectedState)

    useEffect(() => {
        if (getCustomerDetail) {
            setInitialHouseNo(getCustomerDetail?.houseNo)
            setInitialStreet(getCustomerDetail?.street)
            setInitialLandmark(getCustomerDetail?.landmark)
            setInitialCity(getCustomerDetail?.city)
            setInitialPincode(getCustomerDetail?.pincode)
            setInitialState(getCustomerDetail?.state)
            setSelectedState(getCustomerDetail?.state)
            setPincode(
                getCustomerDetail.pincode === 0 ? "" : String(getCustomerDetail.pincode)
            );
        }
    }, [getCustomerDetail])

    const stateList = [
        { label: "Andhra Pradesh", value: "Andhra Pradesh" },
        { label: "Arunachal Pradesh", value: "Arunachal Pradesh" },
        { label: "Assam", value: "Assam" },
        { label: "Bihar", value: "Bihar" },
        { label: "Chhattisgarh", value: "Chhattisgarh" },
        { label: "Goa", value: "Goa" },
        { label: "Gujarat", value: "Gujarat" },
        { label: "Haryana", value: "Haryana" },
        { label: "Himachal Pradesh", value: "Himachal Pradesh" },
        { label: "Jharkhand", value: "Jharkhand" },
        { label: "Karnataka", value: "Karnataka" },
        { label: "Kerala", value: "Kerala" },
        { label: "Madhya Pradesh", value: "Madhya Pradesh" },
        { label: "Maharashtra", value: "Maharashtra" },
        { label: "Manipur", value: "Manipur" },
        { label: "Meghalaya", value: "Meghalaya" },
        { label: "Mizoram", value: "Mizoram" },
        { label: "Nagaland", value: "Nagaland" },
        { label: "Odisha", value: "Odisha" },
        { label: "Punjab", value: "Punjab" },
        { label: "Rajasthan", value: "Rajasthan" },
        { label: "Sikkim", value: "Sikkim" },
        { label: "Tamil Nadu", value: "Tamil Nadu" },
        { label: "Telangana", value: "Telangana" },
        { label: "Tripura", value: "Tripura" },
        { label: "Uttar Pradesh", value: "Uttar Pradesh" },
        { label: "Uttarakhand", value: "Uttarakhand" },
        { label: "West Bengal", value: "West Bengal" },
    ];

    const filteredStateList = stateList
        .filter((s) =>
            s.label.toLowerCase().includes(stateQuery.toLowerCase())
        )
        .sort((a, b) => {
            const aStart = a.label.toLowerCase().startsWith(stateQuery.toLowerCase());
            const bStart = b.label.toLowerCase().startsWith(stateQuery.toLowerCase());
            return bStart - aStart;
        });

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
            String(pincode ?? "") === String(initialPincode ?? "") && 
            (selectedState ?? "").trim() === (initialState ?? "").trim()) {
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
            state: selectedState,
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
            console.log("editSucess", r)
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
                    <Text style={styles.headerTxt}>{mode === "edit" ? "Edit" : "Add"} Address Details</Text>
                </View>


                <Text style={[styles.labelTxt, { marginTop: 18 }]}>HouseNo/Apartment
                    <Text style={{ color: 'red' }}> *</Text>
                </Text>
                <TextInput
                    value={houseNo}
                    style={styles.input}
                    placeholder="Enter HouseNo"
                    onChangeText={(text) => {
                        const onlyLetters = text.replace(/[^A-Za-z0-9"/,-\s]/g, "")
                        setHouseNo(onlyLetters)

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

                <Text style={[styles.labelTxt, { marginTop: 12 }]}>State</Text>

                <View style={{ position: "relative",marginTop:10 }}>
                    <TextInput
                        style={styles.select}
                        placeholder="Select state"
                        placeholderTextColor="#9CA3AF"
                        value={stateOpen ? stateQuery : selectedState}

                        onFocus={() => {
                            setStateOpen(true);
                            setStateQuery("");   // 🔥 cursor focus panna fresh search
                        }}
                        onChangeText={(t) => {
                            const sanitized = t.replace(/[^a-zA-Z\s]/g, "");
                            setStateQuery(sanitized);    // 🔥 typing always search
                            setStateOpen(true);
                        }}
                    />


                    <TouchableOpacity
                        style={styles.arrowTouch}
                        activeOpacity={0.7}
                        onPress={() => {
                            Keyboard.dismiss();  // ✅ keyboard hide
                            setStateOpen((prev) => !prev);

                            // ✅ close pannumbothu query reset
                            if (stateOpen) setStateQuery("");
                        }}
                    >
                        <Ionicons name="chevron-up" size={16}/>
                    </TouchableOpacity>

                    {stateOpen && (
                        <>
                            <TouchableWithoutFeedback
                                onPress={() => {
                                    setStateOpen(false);
                                    setStateQuery("");
                                }}
                            >
                                <View style={{
                                    position: "absolute",
                                    top: -1000,
                                    left: -1000,
                                    right: -1000,
                                    bottom: -1000,
                                    backgroundColor: "transparent",
                                    zIndex: 999,
                                }} />
                            </TouchableWithoutFeedback>

                            <View style={{
                                borderWidth: 1,
                                borderColor: "#ddd",
                                borderRadius: 12,
                                zIndex: 1000,
                                marginTop: 6,
                                maxHeight: 180,
                                backgroundColor: "#fff",
                            }}>
                                <ScrollView
                                    keyboardShouldPersistTaps="always"
                                    nestedScrollEnabled={true}
                                    showsVerticalScrollIndicator={true}
                                >
                                    {filteredStateList.length > 0 ? (
                                        filteredStateList.map((v, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                style={[styles.option, selectedState === v.label
                                                    && { backgroundColor: "#E6F0FF" }]}
                                                onPress={() => {
                                                    setSelectedState(v.label);
                                                    setStateQuery("");
                                                    setStateOpen(false);
                                                }}
                                            >
                                                {console.log(v)}
                                                <Text style={styles.optionText}>{v.label}</Text>
                                            </TouchableOpacity>
                                        ))
                                    ) : (
                                        <Text style={styles.noResult}>No state found</Text>
                                    )}

                                    {/* 🔴 CLEAR OPTION */}
                                    {selectedState && (
                                        <TouchableOpacity
                                            style={{ padding: 12, alignItems: "center" }}
                                            onPress={() => {
                                                setSelectedState("");
                                                setStateQuery("");
                                                setStateOpen(false);
                                            }}
                                        >
                                            <Text style={{ color: "red", fontFamily: "Gilroy-Semibold" }}>
                                                Clear selection
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </ScrollView>
                            </View>
                        </>
                    )}
                </View>
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
    },
    select: {
        height:51,
        borderWidth: 1,
        borderColor: "#EEEEEE",
        borderRadius: 8,
        paddingHorizontal: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",fontSize: 15,
        color: '#111827', fontFamily: 'Gilroy-Regular',
    },
    arrowTouch: {
        position: "absolute",
        right: 12,
        top: 12,
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
    },
      option: {
        paddingVertical: 12,
        paddingHorizontal: 14,
    },

    selectText: { color: "#555" },
      optionText: {
        fontSize: 15,
        color: "#000",
        fontFamily: "Gilroy-Regular",
    },
})
export default EditAddressDetail;
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


const EditBasicDetail = ({ }) => {

    const navigation = useNavigation();
    const { getCustomerDetail, updateCustomer } = useContext(UsersContext)
    const { getToken } = useContext(LoginContexts)

    const [firstName, setFirstName] = useState(getCustomerDetail?.firstName || "")
    const [lastName, setLastName] = useState(getCustomerDetail?.lastName || "")
    const [mailId, setMailId] = useState(getCustomerDetail?.emailId || "")
    const [mobileNo, setMobileNo] = useState(getCustomerDetail?.mobile || "")
    const [initialFirstName, setInitialFirstName] = useState("")
    const [initialLastName, setInitialLastName] = useState("")
    const [initialMailid, setInitialMailid] = useState("")
    const [firstNameError, setFirstNameError] = useState("")
    const [showSuccesModal, setShowSuccessModal] = useState(false)
    const [showSuccessMessage, setShowSuccessMessage] = useState("")
    const [modalType, setModalType] = useState("")
    const [loading, setLoading] = useState(false)

    console.log(getCustomerDetail)

    useEffect(() => {
        if (getCustomerDetail) {
            setInitialFirstName(getCustomerDetail?.firstName)
            setInitialLastName(getCustomerDetail?.lastName)
            setInitialMailid(getCustomerDetail?.emailId)
        }
    }, [])
    console.log(firstNameError)

    const validateForm = () => {
        let isValid = true;
        console.log("fdsd")
        if (!firstName) {
            setFirstNameError("Please Enter First Name");
            isValid = false;
        }

        if ((firstName ?? "").trim() === (initialFirstName ?? "").trim() && 
            (lastName ?? "").trim() === (initialLastName ?? "").trim() && (mailId ?? "").trim() === (initialMailid ?? "").trim()) {
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
            firstName: firstName,
            lastName: lastName,
            emailId: mailId,
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
            console.log(r)
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
                    <Text style={styles.headerTxt}>Edit Basic Details</Text>
                </View>


                <Text style={[styles.labelTxt, { marginTop: 18 }]}>First Name
                    <Text style={{ color: 'red' }}> *</Text>
                </Text>
                <TextInput
                    value={firstName}
                    style={styles.input}
                    placeholder="Enter firstname"
                    onChangeText={(text) => {
                        const onlyLetters = text.replace(/[^A-Za-z\s]/g, "")
                        setFirstName(onlyLetters)
                        setFirstNameError("")

                    }} />
                {firstNameError && <ErrorMessage message={firstNameError} type="error" />}

                <Text style={[styles.labelTxt, { marginTop: 12 }]}>Last Name</Text>
                <TextInput
                    value={lastName}
                    style={styles.input}
                    placeholder="Enter lastname"
                    onChangeText={(text) => {
                        const onlyLetters = text.replace(/[^A-Za-z\s]/g, "")
                        setLastName(onlyLetters)

                    }} />

                <Text style={[styles.labelTxt, { marginTop: 12 }]}>Mail ID</Text>
                <TextInput
                    value={mailId}
                    style={styles.input}
                    placeholder="Enter mailId"
                    onChangeText={(text) => {
                        const noEmojis = text.replace(
                            /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "");
                        setMailId(noEmojis)

                    }} />

                <Text style={[styles.labelTxt, { marginTop: 12 }]}>Mobile No</Text>
                <TextInput
                    value={mobileNo}
                    style={styles.input}
                    editable={false}
                    placeholder="Enter mobileNo"
                // onChangeText={(text) => {
                //                 const onlyLetters = text.replace(/[^0-9\s]/g, "")
                //                 setMobileNo(onlyLetters)

                //             }}
                />
                <View style={{ paddingHorizontal: 10, paddingVertical: 5, backgroundColor: "#F5F9FF", 
                              alignSelf: "flex-start", borderRadius: 8,marginTop:5 }}>
                    <Text style={{ fontSize: 12, fontFamily: 'Gilroy-Regular', color: '#1E45E1' }}>Mobile No not editable</Text>
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
    }
})
export default EditBasicDetail;
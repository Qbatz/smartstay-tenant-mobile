import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, Image, TextInput, ScrollView, TouchableOpacity } from "react-native";
import LeftArrow from "../../assets/Images/LeftArrow.png"
import { useNavigation } from "@react-navigation/native";
import { customerDetails, editProfile } from "../../Action/CustomerAction";
import { UsersContext } from "../../Context/UserContext";
import { LoginContexts } from "../../Context/LoginContext";
import { Dropdown } from "react-native-element-dropdown";
import Ionicons from 'react-native-vector-icons/Ionicons';
import EditSmallIcon from "../../assets/Images/editSmallIcon.png"
import AppLoader from "../ToastFile/LoaderPage";
import SuccessModal from "../ToastFile/TostFilePage";




const BackgroundDetails = (route) => {

    const navigation = useNavigation();
    const context = useContext(UsersContext)
    const loginContext = useContext(LoginContexts)

    console.log(route)

    const [guardianFullName, setGuardianFullName] = useState(route.route?.params?.customer?.additionalContacts[0]?.name || "");
    // const [relationship, setRelationship] = useState("");
    const [occupation, setOccupation] = useState(route.route?.params?.customer?.additionalContacts[0]?.occupation || "")
    const [guardianMobileNo, setGuardianMobileNo] = useState(route.route?.params?.customer?.additionalContacts[0]?.mobile || "");
    const [countyCode, setCountryCode] = useState("");

    const [loading, setLoading] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [toastMessage, setToastMessage] = useState()
    const [modelType, setModelType] = useState();
    const [selectedRelationType, setSelectedRelationType] = useState(route.route?.params?.customer?.additionalContacts[0]?.relationship || "");
    const [selectedEmployment, setSelectedEmployment] = useState(0);
    const [isFocus, setIsFocus] = useState(false);
    const [contactId, setContactId]=useState(route.route?.params?.customer?.additionalContacts[0]?.contactId)
    console.log(selectedRelationType)

    const relationshipList = [{ id: 0, relationType: "Father" }, { id: 1, relationType: "Mother" }, { id: 2, relationType: "Others" }]

    const employmentTypes = [{ id: 0, employmentType: 'Self employment' }, { id: 1, employmentType: 'Private Job' }, { id: 2, employmentType: 'Public Job' }]

    const handleEdit = () => {

        const payload = {
            additionalContacts: [
                {
                    contactId: contactId,
                    name: guardianFullName,
                    relationship: selectedRelationType,
                    occupation: occupation,
                    mobile: guardianMobileNo,
                }
            ]
        }

        console.log(payload)

        const formData = new FormData();

        const jsonBase64 = btoa(JSON.stringify(payload))


        formData.append("payloads", {
            uri: "data:application/json;base64," + jsonBase64,
            type: "application/json",
            name: "payload.json",
        })

        editProfile(loginContext.getToken, formData).then(r => {
            console.log(r)
            setLoading(true)

            setTimeout(() => {
                setLoading(false)

                if (r.status == 200) {
                    setShowSuccessModal(true)
                    setToastMessage('Updated Successfully')
                    setModelType('success')

                    setTimeout(() => {
                        customerDetails(loginContext.getToken).then(r => {
                            console.log(r.data)
                            context.updateCustomer(r.data)
                        })
                        navigation.goBack();
                    }, 2000);
                }
            }, 2000);

        })

    }


    return <View style={{ backgroundColor: '#ffffff', flex: 1 }}>
         <AppLoader visible={loading} />
        <SuccessModal
            visible={showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
            message={toastMessage}
            type={modelType}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 30 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={LeftArrow} style={{ height: 25, width: 25 }} />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontFamily: 'Gilroy-Semibold', marginLeft: 8 }}>Background Details</Text>
            </View>

            <TouchableOpacity onPress={handleEdit}
                style={{ backgroundColor: '#E7F1FF', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5, flexDirection: 'row' }}>
                <Image source={EditSmallIcon} style={{ width: 16, height: 16 }} />
                <Text style={{ fontSize: 12, fontFamily: 'Gilroy-Regular', color: '#1E45E1', marginLeft: 6 }}>Edit</Text>
            </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 80 }}>

            <Text style={{ fontSize: 18, fontFamily: 'Gilroy-Semibold', marginTop: 15 }}>Parent/Guardian Details</Text>

            <View style={[styles.fieldContainer, { marginTop: 15 }]}>
                <Text style={styles.label}>Guardian Full Name</Text>

                <TextInput
                    value={guardianFullName}
                    placeholder="Enter fullName"
                    style={styles.input}
                    onChangeText={(text) => {
                        const onlyLetters = text.replace(/[^A-Za-z\s]/g, "")
                        setGuardianFullName(onlyLetters)
                    }}
                />
            </View>

            <View style={styles.fieldContainer}>
                <Text style={styles.label}>Relationship</Text>


                <Dropdown
                    style={{
                        marginTop: 5,
                        borderColor: '#e5e5e5',
                        paddingLeft: 5,
                    }}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    data={relationshipList}
                    containerStyle={{ borderRadius: 10 }}
                    placeholderStyle={{ fontSize: 15, fontFamily: 'Gilroy-Medium', color: '#9C9C9C' }}
                    selectedTextStyle={{ fontSize: 15, fontFamily: 'Gilroy-Medium' }}
                    itemTextStyle={{ fontSize: 14, fontFamily: 'Gilroy-Medium' }}
                    placeholder="Select a relation"
                    labelField="relationType"
                    valueField="id"
                    value={selectedRelationType}
                    onChange={item => {
                        setSelectedRelationType(item.id);
                    }}
                    renderRightIcon={() => (
                        <Ionicons
                            name={isFocus ? "chevron-up" : "chevron-down"}
                            size={22}
                            color="#000"
                            style={{ paddingRight: 10 }}
                        />
                    )}
                />

                {/* <TextInput
                    value={relationship}
                    placeholder="Enter relationship"
                    style={styles.input}
                    onChangeText={(text) => {
                        const onlyLetters = text.replace(/[^A-Za-z\s]/g, "")
                        setRelationship(onlyLetters)
                    }}
                /> */}
            </View>

            <View style={styles.fieldContainer}>
                <Text style={styles.label}>Guardian Occupation</Text>

                <TextInput
                    value={occupation}
                    placeholder="Enter Occupation"
                    style={styles.input}
                    onChangeText={(text) => {
                        const onlyLetters = text.replace(/[^A-Za-z\s]/g, "")
                        setOccupation(onlyLetters)
                    }}
                />
            </View>

            <View style={styles.fieldContainer}>
                <Text style={styles.label}>Mobile No</Text>

                <TextInput
                    value={guardianMobileNo}
                    placeholder="Enter mobileNo"
                    style={styles.input}
                    maxLength={10}
                    onChangeText={(text) => {
                        const onlyNum = text.replace(/[^0-9]/g, "")
                        setGuardianMobileNo(onlyNum)
                    }}
                />
            </View>

            {/* <Text style={{ fontSize: 18, fontFamily: 'Gilroy-Semibold', marginTop: 15 }}>Job Details</Text>

            <View style={[styles.fieldContainer, { marginTop: 15 }]}>
                <Text style={styles.label}>Employment Status</Text>

                <TextInput
                    // value={firstName}
                    placeholder="Enter house No"
                    style={styles.input}
                />
            </View>

            <View style={styles.fieldContainer}>
                <Text style={styles.label}>Company/College Name</Text>

                <TextInput
                    // value={firstName}
                    placeholder="Enter street name"
                    style={styles.input}
                />
            </View>

            <View style={styles.fieldContainer}>
                <Text style={styles.label}>Job Role</Text>

                <TextInput
                    // value={firstName}
                    placeholder="Enter landmark"
                    style={styles.input}
                />
            </View>

            <View style={styles.fieldContainer}>
                <Text style={styles.label}>Work Location</Text>

                <TextInput
                    // value={firstName}
                    placeholder="Enter city name"
                    style={styles.input}
                />
            </View>

            <View style={styles.fieldContainer}>
                <Text style={styles.label}>Shift Timing</Text>

                <TextInput
                    // value={firstName}
                    placeholder="Enter pincode"
                    style={styles.input}
                />
            </View>

            <View style={styles.fieldContainer}>
                <Text style={styles.label}>Vehicle Type</Text>

                <TextInput
                    // value={firstName}
                    placeholder="Enter state"
                    style={styles.input}
                />
            </View>

            <View style={styles.fieldContainer}>
                <Text style={styles.label}>Vehicle Number</Text>

                <TextInput
                    // value={firstName}
                    placeholder="Enter state"
                    style={styles.input}
                />
            </View> */}
        </ScrollView>

    </View>

}

const styles = StyleSheet.create({
    fieldContainer: {
        marginBottom: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB', // light gray line
        paddingBottom: 6,
        // marginTop:15
    },

    label: {
        fontSize: 14,
        color: '#4B4B4B',
        marginBottom: 4,
        fontFamily: 'Gilroy-Medium',
    },

    input: {
        fontSize: 15,
        color: '#111827',
        paddingVertical: 4,
        fontFamily: 'Gilroy-Regular',
    },
})
export default BackgroundDetails;
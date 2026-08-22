import React, { useContext, useState } from "react";
import { View, Image, TouchableOpacity, ScrollView, Text, StyleSheet, TextInput } from "react-native";
import { UsersContext } from "../../Context/UserContext";
import { FlatList } from "react-native-gesture-handler";
import LeftArrow from "../../assets/Images/LeftArrow.png"
import { useNavigation } from "@react-navigation/native";
import { addGuardian, customerDetails, deleteContact, editProfile } from "../../Action/CustomerAction";
import AppLoader from "../ToastFile/LoaderPage";
import SuccessModal from "../ToastFile/TostFilePage";
import { LoginContexts } from "../../Context/LoginContext";
import DeleteIcon from "../../assets/Images/trash.png";
import Ionicons from 'react-native-vector-icons/Ionicons';
import ErrorMessage from "../ToastFile/ErrorMessage";




const AddGuardianDetails = ({ route }) => {

    const navigation = useNavigation();
    const mode = route?.params?.mode;
    const { getCustomerDetail, updateCustomer } = useContext(UsersContext)
    const { getToken } = useContext(LoginContexts)
    const itemsBox = {
        guardianName: "",
        guardianRelation: "",
        guardianOccupation: "",
        guardianMobile: "",
    }
    // const [items, setItems] = useState([...itemsBox])
    console.log(getCustomerDetail)
    console.log(mode)
    const [items, setItems] = useState(() => {
        const contact = getCustomerDetail.additionalContacts;
        console.log(contact, "sig")


        if (mode === "edit" && contact.length > 0) {
            return contact.map(contact => ({
                guardianName: contact?.name,
                guardianRelation: contact?.relationship,
                guardianOccupation: contact?.occupation,
                guardianMobile: contact?.mobile,
                contactId: contact.contactId,
            }))
        }

        return [{
            guardianName: "",
            guardianRelation: "",
            guardianOccupation: "",
            guardianMobile: "",
        }]
    })

    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [toastMessage, setToastMessage] = useState()
    const [modelType, setModelType] = useState();
    const [selectedContactId, setSelectedContactId] = useState(items.map(item => item.contactId))
    const [errors, setErrors] = useState([])

    console.log(items)
    const handleChange = (index, key, value) => {
        console.log(index, key, value)
        const updated = [...items];
        console.log(updated)

        updated[index][key] = value;
        setItems(updated);
        setErrors(prev => ({
            ...prev,[index]: {...prev[index],[key]: "",
            },
        }));
    }

    const toggleCount = (contactId) => {
        setSelectedContactId(prev => {
            if (prev.includes(contactId)) {
                return prev.filter(id => id != contactId)
            } else {
                return [...prev, contactId]
            }
        })
    }

    const handleDeleteContact = (contactId) => {
        console.log(contactId)

        const payload = [
            {
                contactId: contactId,
            },
        ];

        console.log(payload)
        deleteContact(getToken, payload).then(res => {
            console.log(res)
            if (res?.status == 200) {
                setItems((prev) =>
                    prev.filter((item) => item.contactId !== contactId)
                );
                setShowSuccessModal(true)
                setToastMessage(res.data || "Deleted Successfully")
                setModelType("success")
                setTimeout(() => {
                    setShowSuccessModal(false)
                }, 1000);
            }
            else {
                showSuccessModal(true)
                setToastMessage(res?.message || "Failed to delete")
                setModelType("error")
                setTimeout(() => {
                    setShowSuccessModal(false)
                }, 1000);
            }
        })
    }

    const renderContactCard = (item, index) => {
        const count = index + 1;

        return (

            <View style={{ borderWidth: 1, borderRadius: 10, padding: 16, borderColor: '#E7E7E7', marginVertical: 10 }}
                key={index}>

                <TouchableOpacity onPress={() => toggleCount(item.contactId)}
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 18, fontFamily: 'Gilroy-Semibold', marginTop: 6 }}>Contact - {count}</Text>
                    <Ionicons name={selectedContactId.includes(item.contactId) ? "chevron-up" : "chevron-down"} size={17} />
                </TouchableOpacity>


                {selectedContactId.includes(item.contactId) && (<>

                    <View style={[styles.fieldContainer, { marginTop: 15 }]}>
                        <Text style={styles.label}>Guardian Full Name <Text style={{ color: "red", }}>*</Text></Text>

                        <TextInput
                            value={item.guardianName}
                            placeholder="Enter fullName"
                            style={styles.input}
                            onChangeText={(text) => {
                                const onlyLetters = text.replace(/[^A-Za-z\s]/g, "")
                                handleChange(index, "guardianName", onlyLetters)
                                // setGuardianFullName(onlyLetters)
                                // setErrorMsg((prev) => ({ ...prev, fullName: "" }))
                            }}
                        />

                        {errors[index]?.guardianName && (
                            <ErrorMessage message={errors[index].guardianName} type="error" />
                        )}
                    </View>

                    {/* {errorMsg.fullName && (<ErrorMessage message={errorMsg.fullName} type="error" />)} */}

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={[styles.rltnOccptField, { marginRight: 3 }]}>
                            <Text style={styles.label}>Relationship <Text style={{ color: "red", }}>*</Text></Text>

                            <TextInput
                                value={item?.guardianRelation}
                                placeholder="Enter Relation"
                                style={styles.input}
                                onChangeText={(text) => {
                                    const onlyLetters = text.replace(/[^A-Za-z\s]/g, "")
                                    // setOccupation(onlyLetters)
                                    handleChange(index, "guardianRelation", onlyLetters)
                                    // setErrorMsg((prev) => ({ ...prev, occupation: "" }))
                                }}
                            />

                            {errors[index]?.guardianRelation && (
                                <ErrorMessage message={errors[index].guardianRelation} type="error" />
                            )}

                        </View>
                        {/* {errorMsg.relationType && (<Error message={errorMsg.relationType} type="error" />)} */}

                    </View>
                    {/* {errorMsg.occupation && (<ErrorMessage message={errorMsg.occupation} type="error" />)} */}

                    <View style={[styles.rltnOccptField, { marginLeft: 3 }]}>
                        <Text style={styles.label}>Guardian Occupation</Text>

                        <TextInput
                            value={item?.guardianOccupation}
                            placeholder="Enter Occupation"
                            style={styles.input}
                            onChangeText={(text) => {
                                const onlyLetters = text.replace(/[^A-Za-z\s]/g, "")
                                // setOccupation(onlyLetters)
                                handleChange(index, "guardianOccupation", onlyLetters)
                                // setErrorMsg((prev) => ({ ...prev, occupation: "" }))
                            }}
                        />


                    </View>

                    <View style={styles.fieldContainer}>
                        <Text style={styles.label}>Mobile No <Text style={{ color: "red", }}>*</Text></Text>

                        <View style={{
                            flexDirection: 'row', alignItems: 'center', paddingVertical: 5, paddingHorizontal: 10,
                            marginTop: 10, borderWidth: 1, borderColor: '#EEEEEE', borderRadius: 8,
                        }}>
                            <Text style={{ fontFamily: 'Gilroy-Regular', fontSize: 15, color: '#111827', }}>+91</Text>
                            <Ionicons name="chevron-down" size={16} style={{ marginLeft: 3 }} />

                            <TextInput
                                value={item?.guardianMobile}
                                placeholder="Enter mobileNo"
                                style={{ fontFamily: 'Gilroy-Regular', fontSize: 15, color: '#111827', marginLeft: 4 }}
                                maxLength={10}
                                onChangeText={(text) => {
                                    const onlyNum = text.replace(/[^0-9]/g, "")
                                    // setGuardianMobileNo(onlyNum)
                                    handleChange(index, "guardianMobile", onlyNum)
                                    // setErrorMsg((prev) => ({ ...prev, guardianMobileNo: "" }))
                                }}
                            />
                        </View>
                        {errors[index]?.guardianMobile && (
                            <ErrorMessage message={errors[index].guardianMobile} type="error" />
                        )}
                    </View>

                    {mode === "edit" && (
                        <TouchableOpacity onPress={() => handleDeleteContact(item?.contactId)}
                            style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginTop: 8 }}>
                            <Image source={DeleteIcon} style={{ width: 16, height: 16, tintColor: '#FF0000' }} />
                            <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', color: '#222222', marginLeft: 5 }}>
                                Remove</Text>
                        </TouchableOpacity>
                    )}

                </>)}

            </View>
        )

    }

    const validateForm = () => {
        const errors = {};

        items.forEach((item, index) => {
            const itemErrors = {};

            if (!item?.guardianName?.trim()) {
                itemErrors.guardianName = "Guardian name is required";
            }

            if (!item?.guardianRelation) {
                itemErrors.guardianRelation = "Relationship is required";
            }

            if (!item?.guardianMobile) {
                itemErrors.guardianMobile = "Mobile number is required";
            }
             if (item?.guardianMobile.length < 10) {
                itemErrors.guardianMobile = "Mobile should not below 10 number";
            }
             if (item?.guardianMobile?.trim() === "0000000000") {
                itemErrors.guardianMobile = "Mobile should not be 0";
            }

            if (Object.keys(itemErrors).length > 0) {
                errors[index] = itemErrors;
            }
        });

        // if (Object.keys(errors).length > 0) {
        //     setErrors(errors);
        //     return;
        // }
        setErrors(errors);
       return Object.keys(errors).length === 0;

    }

    console.log(errors)
    const handleEdit = () => {

        if (!validateForm()) return;



        // const payload = {
        //     additionalContacts: [
        //         {
        //             contactId: contactId,
        //             name: guardianFullName,
        //             relationship: selectedRelation,
        //             occupation: occupation,
        //             mobile: guardianMobileNo,
        //         }
        //     ]
        // }

        const payload = {
            additionalContacts: items.map(item =>
            ({
                contactId: item.contactId,
                name: item?.guardianName,
                relationship: item?.guardianRelation,
                occupation: item?.guardianOccupation,
                mobile: item?.guardianMobile,
            }))
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
                    setToastMessage(r.data || 'Updated Successfully')
                    setModelType('success')

                    setTimeout(() => {
                        customerDetails(getToken).then(r => {
                            updateCustomer(r.data)
                        })
                        navigation.goBack();
                        setShowSuccessModal(false)
                    }, 2000);
                }
            }, 2000);

        })

    }

    const handleSave = () => {

        // if (!validateForm()) return;
         const isValid = validateForm();
    console.log("isValid:", isValid);

    if (!isValid) return;



        const payload = items.map(item =>
        ({
            name: item?.guardianName,
            relationship: item?.guardianRelation,
            occupation: item?.guardianOccupation,
            mobile: item?.guardianMobile,
        }))



        console.log(payload)

        addGuardian(getToken, payload).then(r => {
            console.log(r)
            setLoading(true)

            setTimeout(() => {
                setLoading(false)

                if (r.status == 200) {
                    setShowSuccessModal(true)
                    setToastMessage(r.data || 'Updated Successfully')
                    setModelType('success')

                    setTimeout(() => {
                        customerDetails(getToken).then(r => {
                            console.log(r.data)
                            updateCustomer(r.data)
                        })
                        navigation.goBack();
                        setShowSuccessModal(false)
                    }, 2000);
                }
            }, 2000);

        })


    }



    return <View style={styles.mainContainer}>
        <AppLoader visible={loading} />
        <SuccessModal
            visible={showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
            message={toastMessage}
            type={modelType} />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image source={LeftArrow} style={{ height: 23.5, width: 23.5 }} />
            </TouchableOpacity>
            <Text style={styles.mainheader}>{mode === "edit" ? "Edit" : "Add"} Parent/Guardian Details</Text>
        </View>

        <FlatList
            data={items}
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => renderContactCard(item, index)} />

        <TouchableOpacity onPress={mode === "edit" ? handleEdit : handleSave}
            style={styles.saveChngs}>
            <Text style={styles.saveChangesTxt}>Save Changes</Text>
        </TouchableOpacity>
    </View>



}

const styles = StyleSheet.create({
    mainContainer: {
        padding: 20, backgroundColor: '#FFFFFF', flex: 1
    },
    mainheader: {
        fontSize: 20, fontFamily: 'Gilroy-Semibold', marginTop: 15, marginBottom: 10,
        marginLeft: 5
    },
    fieldContainer: {
        // marginBottom: 18,

        // borderWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 6,
        marginTop: 15
    },
    rltnOccptField: {
        // borderBottomWidth: 1,
        // borderBottomColor: '#E5E7EB',
        flex: 1, marginTop: 15, paddingBottom: 6
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
        paddingVertical: 14, paddingHorizontal: 10,
        marginTop: 10,
        fontFamily: 'Gilroy-Regular',
        borderWidth: 1, borderColor: '#EEEEEE', borderRadius: 8,
    },
    saveChngs: {
        backgroundColor: '#1E45E1', marginBottom: 20, alignItems: 'center',
        paddingVertical: 10, borderRadius: 10
    },
    saveChangesTxt: {
        fontSize: 16, fontFamily: 'Gilroy-Semibold', color: '#FFFFFF'
    }
})
export default AddGuardianDetails;
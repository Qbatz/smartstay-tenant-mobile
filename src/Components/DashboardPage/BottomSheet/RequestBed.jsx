import React, { useState, useContext, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, TouchableWithoutFeedback, Animated, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import SuccessModal from "../../ToastFile/TostFilePage";
import AppLoader from "../../ToastFile/LoaderPage";
import CameraPic from '../../../assets/Images/cameraPic.png'
import { launchImageLibrary } from "react-native-image-picker";
import { putComplaint } from "../../../Action/CustomerAction";
import { UsersContext } from "../../../Context/UserContext";
import { LoginContexts } from "../../../Context/LoginContext";
import { compliantContexts } from "../../../Context/ComplaintContext";
import { postRequestBedChange } from "../../../Action/HostelAction";
import Room from '../../../assets/Images/Room.png'
import Bed from '../../../assets/Images/Bed_Icon.png'
import { Dropdown } from "react-native-element-dropdown";
import { SafeAreaView } from "react-native-safe-area-context";
import ErrorMessage from "../../ToastFile/ErrorMessage";



const RequestBedChange = ({ visible,
    onClose,
    complaintType,
    selectedComplaint,
    panResponder,
    sheetY, }) => {

    const bed = [{ label: 'Disturbance in current room', value: 'Disturbance in current room' }, { label: 'Roommate issues', value: 'Roommate issues' }, { label: 'Need more privacy/space', value: 'Need more privacy/space' },
    { label: 'Maintanence issues', value: 'Maintanence issues' }, { label: 'Prefer other sharing type', value: 'Prefer other sharing type' }, { label: 'Others', value: 'Others' }]

    const selectBed = [{ label: 'Single Sharing', value: 'Single Sharing' }, { label: 'Double Sharing', value: '2' }, { label: 'Triple Sharing', value: '3' }]

    const urgency = [{ label: 'Within 2-3 days', value: '1' }, { label: 'Within 1 Week', value: '2' }, { label: 'Next Month Start', value: '3' }]

    const bedDropdownRef = useRef(null)
    const bedTypeDropdow = useRef(null)
    const urgencyDropdown = useRef(null)

    const context = useContext(UsersContext)
    const loginContext = useContext(LoginContexts)
    const complaintContext = useContext(compliantContexts)
    const [isFocus, setIsFocus] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [toastMessage, setToastMessage] = useState()
    const [modelType, setModelType] = useState()
    const [changeBed, setChangeBed] = useState(null);
    const [focusReason, setFocusReason] = useState(false);
    const [bedType, setBedType] = useState(null)
    const [urgencyType, setUrgencyType] = useState(null)
    const [bedChangeReasonError, setBedChangeReasonError] = useState()
    const [bedTypeError, setBedTypeError] = useState()
    const [urgencyError, setUrgencyError] = useState()


    useEffect(() => {
        if (!visible) {
            setChangeBed(null);
            setBedType(null);
            setUrgencyType(null);
            setIsFocus(false);

            setBedChangeReasonError("")
            setBedTypeError("")
            setUrgencyError("")
        }
    }, [visible]);

    const validateForm = () => {
        let valid = true;

        setBedChangeReasonError("")
        setBedTypeError("")
        setUrgencyError("")

        if (changeBed == null) {
            setBedChangeReasonError("Select bed change reason");
            valid = false;
        }

        if (bedType == null) {
            setBedTypeError("Select preferred bed type");
            valid = false;
        }
        if (urgencyType === null) {
            setUrgencyError("Select urgency of change in bed");
            valid = false;
        }

        return valid;
    }


    const bedRequestSubmit = () => {
        if (!validateForm()) return;

        const data = {
            title: changeBed,
            description: bedType,
        }

        if (changeBed != null && bedType != null && urgencyType != null) {
            postRequestBedChange(context.getHostelDetail.hostelId, data, loginContext.getToken).then(r => {
                setLoading(true)
                console.log(r)

                setTimeout(() => {
                    setLoading(false)

                    if (r.status == 200) {
                        setShowSuccessModal(true)
                        setToastMessage('Request raised')
                        setModelType('success')

                        setTimeout(() => {
                            setShowSuccessModal(false)
                            setBedType(null)
                            setChangeBed(null)
                            setUrgencyType(null)
                            onClose();
                        }, 2000);
                    }
                    else if (r.status == r.status) {
                        setShowSuccessModal(true)
                        setToastMessage(r.message)
                        setModelType('error')

                        setTimeout(() => {
                            setShowSuccessModal(false)
                            setBedType(null)
                            setChangeBed(null)
                            setUrgencyType(null)
                            onClose();
                        }, 2000);
                    }

                }, 2000);
            })

        }
        else {
            // setShowSuccessModal(true)
            // setToastMessage('Fill all Fields')
            // setModelType('error')

            // setTimeout(() => {
            //     setShowSuccessModal(false)
            // }, 2000);
        }

    }

    if (!visible) return null;

    return (
        <View style={style.sheetOverlay}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={StyleSheet.absoluteFill} />
            </TouchableWithoutFeedback>

            <Animated.View style={[style.bottomsheets, { transform: [{ translateY: sheetY }] }]}
                {...panResponder.panHandlers}>

                <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>

                    <View {...panResponder.panHandlers}>
                        <View style={style.dragindictor} />
                    </View>

                    <AppLoader visible={loading} />
                    <SuccessModal
                        visible={showSuccessModal}
                        onClose={() => setShowSuccessModal(false)}
                        message={toastMessage}
                        type={modelType}
                    />
                    <ScrollView showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <View style={{ paddingTop: 15, justifyContent: 'space-between', flex: 1 }}>
                            <View>
                                <Text style={{ fontSize: 20, fontWeight: 600 }}>Request Bed Change</Text>

                                <View style={{ paddingTop: 20 }}>
                                    <Text style={{ fontSize: 12, fontWeight: 400 }}>Current Bed</Text>

                                    <View style={{
                                        backgroundColor: '#F6F8FF', borderRadius: 10, paddingVertical: 17,
                                        paddingHorizontal: 8, marginTop: 10, flexDirection: 'row'
                                    }}>
                                        <View style={{ backgroundColor: '#F9D796', flex: 1, paddingVertical: 4.64, paddingHorizontal: 9.28, alignSelf: 'flex-start', borderRadius: 46.38 }}>
                                            <Text style={{ color: '#642B00', fontSize: 10.82, fontWeight: 400, textAlign: 'center' }}>
                                                {context.getCustomerDetail?.bookingDetails?.floorName}</Text>
                                        </View>

                                        <View style={{ flexDirection: 'row', paddingLeft: 20, flex: 1, alignItems: 'center' }}>
                                            <Image source={Room} style={{ width: 21.17, height: 21.17 }} />
                                            <Text style={{ marginLeft: 10, fontSize: 15.97, fontWeight: 400 }}>
                                                {context.getCustomerDetail?.bookingDetails?.roomName}
                                            </Text>
                                        </View>

                                        <View style={{ flexDirection: 'row', paddingLeft: 10, alignItems: 'center', flex: 1 }}>
                                            <Image source={Bed} style={{ width: 21.17, height: 21.17 }} />
                                            <Text style={{ marginLeft: 10, fontSize: 15.97, fontWeight: 400 }}>
                                                {context.getCustomerDetail?.bookingDetails?.bedName}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={{ paddingTop: 15 }}>
                                    <Text style={{ fontSize: 14, fontWeight: 400 }}>Reason for Bed change
                                        <Text style={{ color: 'red' }}> *</Text>
                                    </Text>

                                    <Dropdown ref={bedDropdownRef}
                                        style={{
                                            borderWidth: 1,
                                            borderRadius: 10,
                                            paddingVertical: 15,
                                            marginTop: 10,
                                            borderColor: '#e5e5e5',
                                            paddingLeft: 10,
                                        }}
                                        onClose={focusReason}
                                        data={bed}
                                        labelField="label"
                                        valueField="value"
                                        value={changeBed}
                                        placeholder="Select Reason"
                                        placeholderStyle={{ fontSize: 14, paddingRight: 10 }}
                                        selectedTextStyle={{ fontSize: 15, fontWeight: '400' }}
                                        containerStyle={{ borderRadius: 10, paddingLeft: 10 }}

                                        onFocus={() => setFocusReason(true)}
                                        onBlur={() => setFocusReason(false)}

                                        onChange={item => {
                                            setChangeBed(item.value);
                                        }}

                                        renderRightIcon={() => (
                                            <Ionicons
                                                name={focusReason ? 'chevron-up' : 'chevron-down'}
                                                size={22}
                                                color="#000"
                                                style={{ paddingRight: 10 }}
                                            />
                                        )}

                                        renderItem={(item) => {
                                            const isSelected = item.value === changeBed;
                                            return (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setChangeBed(item.value);
                                                        setFocusReason(false);
                                                        if (bedChangeReasonError) {
                                                            setBedChangeReasonError("")
                                                        }
                                                        bedDropdownRef.current?.close();
                                                    }}
                                                    style={{
                                                        paddingVertical: 14,
                                                        paddingHorizontal: 14,
                                                        borderRadius: 10,
                                                        marginVertical: 5,
                                                        marginRight: 10,
                                                        marginTop: 10,
                                                        backgroundColor: isSelected ? '#1D4ED8' : '#F5F5F5',
                                                    }}
                                                >
                                                    <Text style={{ color: isSelected ? '#fff' : '#000', fontSize: 15 }}>
                                                        {item.label}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        }}
                                    />
                                    {bedChangeReasonError && <ErrorMessage message={bedChangeReasonError} type="error" />}


                                </View>

                                <View style={{ paddingTop: 15 }}>
                                    <Text style={{ fontSize: 14, fontWeight: 400 }}>Preffered Bed Type
                                        <Text style={{ color: 'red' }}> *</Text>
                                    </Text>

                                    <Dropdown ref={bedTypeDropdow}
                                        style={{
                                            borderWidth: 1, borderRadius: 10, paddingVertical: 15,
                                            marginTop: 10, borderColor: '#e5e5e5', paddingLeft: 10
                                        }}
                                        onFocus={() => setIsFocus(true)} onBlur={() => setIsFocus(false)}
                                        data={selectBed}
                                        containerStyle={{ borderRadius: 10, paddingLeft: 10 }}
                                        placeholderStyle={{ fontSize: 14, paddingRight: 10 }}
                                        selectedTextStyle={{ fontSize: 15, fontWeight: 400 }}
                                        placeholder="Select Reason"
                                        labelField='label'
                                        valueField='value'
                                        value={bedType}

                                        onChange={item => {
                                            setBedType(item.value)
                                        }}

                                        renderRightIcon={() => (
                                            <Ionicons name={isFocus ? "chevron-up" : "chevron-down"} size={22} color="#000"
                                                style={{ paddingRight: 10 }} />
                                        )}

                                        renderItem={(item, index) => {
                                            const isSelected = item.value === bedType;

                                            return (
                                                <TouchableOpacity onPress={() => {
                                                    setBedType(item.value)
                                                    setFocusReason(false)
                                                    if (bedTypeError) {
                                                        setBedTypeError("")
                                                    }
                                                    bedTypeDropdow.current?.close();
                                                }}
                                                    style={{
                                                        paddingVertical: 14,
                                                        paddingHorizontal: 14,
                                                        borderRadius: 10,
                                                        marginVertical: 5,
                                                        marginRight: 10,
                                                        marginTop: 10,
                                                        backgroundColor: isSelected ? "#1D4ED8" : "#F5F5F5",
                                                    }}
                                                >
                                                    <Text
                                                        style={{ color: isSelected ? "#fff" : "#000", fontSize: 15, }}>
                                                        {item.label}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        }}

                                    />
                                    {bedTypeError && <ErrorMessage message={bedTypeError} type="error" />}
                                </View>

                                <View style={{ paddingTop: 15 }}>
                                    <Text>Bed Change Urgency
                                        <Text style={{ color: 'red' }}> *</Text>
                                    </Text>

                                    <Dropdown ref={urgencyDropdown}
                                        style={{
                                            borderWidth: 1, borderRadius: 10, paddingVertical: 15, borderColor: '#e5e5e5',
                                            marginTop: 10, paddingLeft: 10
                                        }}
                                        onFocus={() => setIsFocus(true)} onBlur={() => setIsFocus(false)}
                                        data={urgency}
                                        containerStyle={{ borderRadius: 10, paddingLeft: 10 }}
                                        placeholderStyle={{ fontSize: 14, paddingRight: 10 }}
                                        selectedTextStyle={{ fontSize: 15, fontWeight: 400 }}
                                        placeholder="Select Reason"
                                        labelField="label"
                                        valueField="value"
                                        value={urgencyType}

                                        onChange={item => {
                                            setUrgencyType(item.value)
                                        }}

                                        renderRightIcon={() => (
                                            <Ionicons name={focusReason ? "chevron-up" : "chevron-down"} size={22} color="#000"
                                                style={{ paddingRight: 10 }} />
                                        )}

                                        renderItem={(item, index) => {
                                            const isSelected = item.value === urgencyType;

                                            return (
                                                <TouchableOpacity onPress={() => {
                                                    setUrgencyType(item.value)
                                                    setFocusReason(false)
                                                    if (urgencyError) {
                                                        setUrgencyError("")
                                                    }
                                                    urgencyDropdown.current?.close();
                                                }}
                                                    style={{
                                                        paddingVertical: 14, paddingHorizontal: 14, borderRadius: 10,
                                                        marginVertical: 5, marginRight: 10, marginTop: 10,
                                                        backgroundColor: isSelected ? "#1D4ED8" : "#F5F5F5",
                                                    }}
                                                >
                                                    <Text
                                                        style={{ color: isSelected ? "#fff" : "#000", fontSize: 15, fontWeight: 400 }}>
                                                        {item.label}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        }}
                                    />
                                    {urgencyError && <ErrorMessage message={urgencyError} type="error" />}
                                </View>

                            </View>

                            <TouchableOpacity onPress={bedRequestSubmit}
                                style={{
                                    paddingVertical: 16, paddingHorizontal: 32, borderRadius: 50,
                                    backgroundColor: changeBed != null && bedType != null && urgencyType != null ? '#1E45E1' : '#788fed',
                                    alignItems: 'center', marginBottom: 15
                                }}>
                                <Text style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF' }}>Submit Request</Text>
                            </TouchableOpacity>

                        </View>
                    </ScrollView>
                </SafeAreaView>
            </Animated.View>

        </View>
    )
}
export default RequestBedChange;

const style = StyleSheet.create({
    sheetOverlay: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
    },
    bottomsheets: {
        height: '90%', backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 20,
        paddingTop: 20, paddingBottom: 10
    },
})
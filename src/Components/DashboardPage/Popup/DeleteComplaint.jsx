import React, { useContext, useState, useEffect } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, KeyboardAvoidingView, ScrollView, StyleSheet } from "react-native";
import SuccessModal from "../../ToastFile/TostFilePage";
import Exclamation from '../../../assets/Images/exclamation.png'
import DeleteIcon from '../../../assets/Images/deleteIcon.png'
import { complaints, deleteComplaint } from "../../../Action/HostelAction";
import { Modal } from "react-native";
import { UsersContext } from "../../../Context/UserContext";
import { LoginContexts } from "../../../Context/LoginContext";
import { compliantContexts } from "../../../Context/ComplaintContext";
import ErrorMessage from "../../ToastFile/ErrorMessage";

const DeleteComplaint = ({
    visible,
    onClose,
    complaintId,
    setShowSheet,
}) => {


    const context = useContext(UsersContext)
    const loginContext = useContext(LoginContexts)
    const complaintContext = useContext(compliantContexts)
    const [selectedReason, setSelectedReason] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    // const [toastMessage, setToastMessage] = useState()
    // const [modelType, setModelType] = useState()
    const [deletComplaintError, setDeleteComplaintError] = useState()
    const [otherReason, setOtherReason] = useState('');

    const reasons = [
        "Issue already getting solved",
        "Complaint raised by mistake",
        "Not required now",
        "I’ll raise a new request instead",
        "Other",
    ];

    const cancel = () => {
        setShowPopUp(false)
        setSelectedReason(null)
        setDeleteComplaintError("")
    }

    const validateForm = () => {
        let valid = true;

        if (!selectedReason) {
            setDeleteComplaintError("Select Reason to delete complaint");
            valid = false;
        }

        if (selectedReason === "Other" && !otherReason.trim()){
            setDeleteComplaintError("Please enter the reason")
            valid =false;
        }
        return valid;
    }
    const deleteItem = (complaintiId) => {

        if (!validateForm()) return;

        deleteComplaint(context.getHostelDetail.hostelId, complaintiId, loginContext.getToken, selectedReason).then(r => {
            console.log(r)
            if (r.status == 200) {
                setShowSuccessModal(true);

                setTimeout(() => {
                    setShowSuccessModal(false);
                    onClose();
                    setSelectedReason(null)
                    setShowSheet(false)

                    complaints(context.getHostelDetail.hostelId, loginContext.getToken).then(r => {
                        complaintContext.updateComplaintList(r?.data?.content)
                    })
                }, 2000);

            }
        })
    }


    if (!visible) return null;

    return <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={onClose}
    >
        <View style={styles.overlay}>
            <SuccessModal
                visible={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                message="Complaint Deleted Successfully!"
                type="success"
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ width: '100%' }}
            >
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: 'flex-end', alignItems: 'center',
                        paddingBottom: 20,
                    }}
                >
                    <View style={styles.popup}>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 13, }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Image source={Exclamation} style={{ width: 25, height: 25 }} />
                                <Text style={{ fontSize: 18, fontWeight: 400, marginLeft: 6 }}> Delete Complaint?  </Text>
                            </View>

                            <TouchableOpacity onPress={onClose} style={{ justifyContent: 'center', paddingTop: 5 }}>
                                <Image source={DeleteIcon} style={{ width: 20, height: 20 }} />
                            </TouchableOpacity>

                        </View>

                        <View style={{ height: 1, width: '100%', backgroundColor: "#eee", marginTop: 4 }} />

                        <View style={{ paddingHorizontal: 20, paddingVertical: 13 }}>
                            <Text style={{ flexWrap: 'wrap', width: "80%", color: '#4B4B4B', flexShrink: 1, lineHeight: 24 }}>
                                Please let us know the reason before deleting.</Text>

                            {deletComplaintError && <ErrorMessage message={deletComplaintError} type="error" />}

                            <View style={{ paddingTop: 15 }}>
                                {reasons.map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            setSelectedReason(item)
                                            setDeleteComplaintError("")
                                        }}
                                        style={{
                                            flexDirection: "row", alignItems: "center",
                                            backgroundColor:
                                                selectedReason === item ? "#F5F7FF" : "#FAFAFA",
                                            borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12,
                                            marginBottom: 10,
                                            borderWidth: selectedReason === item ? 1 : 0,
                                            borderColor: "#1E45E1",
                                        }}
                                    >
                                        <View style={{
                                            height: 20, width: 20, borderRadius: 10, borderWidth: 2,
                                            borderColor: selectedReason === item ? "#1E45E1" : "#ccc",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginRight: 10,
                                        }} >

                                            {selectedReason === item && (
                                                <View
                                                    style={{
                                                        height: 10, width: 10, borderRadius: 5,
                                                        backgroundColor: "#1E45E1",
                                                    }}
                                                />
                                            )}
                                        </View>
                                        <Text style={{ color: "#000", fontSize: 14 }}>{item}</Text>
                                    </TouchableOpacity>
                                ))}

                                {selectedReason == 'Other' ? <View style={{ borderRadius: 10, backgroundColor: '#FAFAFA', height: 80 }}>
                                    <TextInput placeholder="Enter the reason"
                                        value={otherReason}
                                        style={{ marginLeft: 5 }}
                                        onChangeText={(text) => {
                                            setOtherReason(text);
                                            setDeleteComplaintError('');
                                        }} 
                                        multiline
                                        blurOnSubmit={false} />
                                </View> : null}

                            </View>

                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 13, }}>
                            <TouchableOpacity onPress={onClose} style={{ paddingRight: 10, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 15, justifyContent: 'center' }}>
                                <Text style={{ fontSize: 14, fontWeight: 400, color: '#4B4B4B' }}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => deleteItem(complaintId)}
                                style={{
                                    backgroundColor: selectedReason != null ? '#1E45E1' : '#788fed',
                                    borderWidth: 2, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 15, borderColor: '#C3DDFD'
                                }}>
                                <Text style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF' }}>Delete</Text>
                            </TouchableOpacity>
                        </View>




                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    </Modal>

    // <View style={{ position: 'absolute', backgroundColor: '#rgba(0, 0, 0, 0.1)', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
    //     <SuccessModal
    //         visible={showSuccessModal}
    //         onClose={() => setShowSuccessModal(false)}
    //         message="Complaint Deleted Successfully!"
    //         type="success"
    //     />
    //     <KeyboardAvoidingView
    //         behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    //         style={{justifyContent:'center'}}>


    //             <ScrollView keyboardShouldPersistTaps="handled"
    //              contentContainerStyle={{width:'90%', backgroundColor: '#ffffff', borderWidth: 1, borderRadius: 8, borderColor: '#E5E7EB', paddingBottom: 15 }}>
    //                 <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 13, }}>
    //                     <View style={{ flexDirection: 'row' }}>
    //                         <Image source={Exclamation} style={{ width: 25, height: 25 }} />
    //                         <Text style={{ fontSize: 18, fontWeight: 400, marginLeft: 6 }}> Delete Complaint?  </Text>
    //                     </View>

    //                     <TouchableOpacity onPress={onClose} style={{ justifyContent: 'center', paddingTop: 5 }}>
    //                         <Image source={DeleteIcon} style={{ width: 20, height: 20 }} />
    //                     </TouchableOpacity>

    //                 </View>

    //                 <View style={{ height: 1, width: '100%', backgroundColor: "#eee", marginTop: 4 }} />

    //                 <View style={{ paddingHorizontal: 20, paddingVertical: 13 }}>
    //                     <Text style={{ flexWrap: 'wrap', width: "80%", color: '#4B4B4B', flexShrink: 1, lineHeight: 24 }}>
    //                         Please let us know the reason before deleting.</Text>

    //                     {deletComplaintError && <ErrorMessage message={deletComplaintError} type="error" />}

    //                     <View style={{ paddingTop: 15 }}>
    //                         {reasons.map((item, index) => (
    //                             <TouchableOpacity
    //                                 key={index}
    //                                 onPress={() => {
    //                                     setSelectedReason(item)
    //                                     setDeleteComplaintError("")
    //                                 }}
    //                                 style={{
    //                                     flexDirection: "row", alignItems: "center",
    //                                     backgroundColor:
    //                                         selectedReason === item ? "#F5F7FF" : "#FAFAFA",
    //                                     borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12,
    //                                     marginBottom: 10,
    //                                     borderWidth: selectedReason === item ? 1 : 0,
    //                                     borderColor: "#1E45E1",
    //                                 }}
    //                             >
    //                                 <View style={{
    //                                     height: 20, width: 20, borderRadius: 10, borderWidth: 2,
    //                                     borderColor: selectedReason === item ? "#1E45E1" : "#ccc",
    //                                     alignItems: "center",
    //                                     justifyContent: "center",
    //                                     marginRight: 10,
    //                                 }} >

    //                                     {selectedReason === item && (
    //                                         <View
    //                                             style={{
    //                                                 height: 10, width: 10, borderRadius: 5,
    //                                                 backgroundColor: "#1E45E1",
    //                                             }}
    //                                         />
    //                                     )}
    //                                 </View>
    //                                 <Text style={{ color: "#000", fontSize: 14 }}>{item}</Text>
    //                             </TouchableOpacity>
    //                         ))}

    //                         {selectedReason == 'Other' ? <View style={{ borderRadius: 10, backgroundColor: '#FAFAFA', height: 80 }}>
    //                             <TextInput placeholder="Enter the reason" style={{ marginLeft: 5 }} multiline
    //                                 blurOnSubmit={false} />
    //                         </View> : null}

    //                     </View>

    //                 </View>

    //                 <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 13, }}>
    //                     <TouchableOpacity onPress={onClose} style={{ paddingRight: 10, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 15, justifyContent: 'center' }}>
    //                         <Text style={{ fontSize: 14, fontWeight: 400, color: '#4B4B4B' }}>Cancel</Text>
    //                     </TouchableOpacity>

    //                     <TouchableOpacity onPress={() => deleteItem(complaintId)}
    //                         style={{
    //                             backgroundColor: selectedReason != null ? '#1E45E1' : '#788fed',
    //                             borderWidth: 2, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 15, borderColor: '#C3DDFD'
    //                         }}>
    //                         <Text style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF' }}>Delete</Text>
    //                     </TouchableOpacity>
    //                 </View>



    //             </ScrollView>


    //     </KeyboardAvoidingView>

    // </View>

}
const styles = StyleSheet.create({
    overlay: {
        backgroundColor: '#rgba(0, 0, 0, 0.1)', justifyContent: 'center', alignItems: 'center', flex: 1

    },
    popup: {

        width: '90%', backgroundColor: '#ffffff', borderWidth: 1, borderRadius: 8, borderColor: '#E5E7EB', paddingBottom: 15,
    },
});


export default DeleteComplaint;
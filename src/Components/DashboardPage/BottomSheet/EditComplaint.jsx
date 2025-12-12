import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, TouchableWithoutFeedback, Animated } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Ionicons from "react-native-vector-icons/Ionicons";
import SuccessModal from "../../ToastFile/TostFilePage";
import AppLoader from "../../ToastFile/LoaderPage";
import CameraPic from '../../../assets/Images/cameraPic.png'
import { launchImageLibrary } from "react-native-image-picker";
import { putComplaint } from "../../../Action/CustomerAction";
import { UsersContext } from "../../../Context/UserContext";
import { LoginContexts } from "../../../Context/LoginContext";
import { compliantContexts } from "../../../Context/ComplaintContext";


const EditComplaintSheet = ({
    visible,
    onClose,
    complaintType,
    selectedComplaint,
    //   selectedComplaintTypeId,
    //   setSelectedComplaintTypeId,
    //   mediaimage,
    // uploadimage,
    //   isFocus,
    //   setIsFocus,
    panResponder,
    sheetY,
    //   loading,
    //   showSuccessModal,
    //   setShowSuccessModal
}) => {
    const context = useContext(UsersContext)
    const loginContext = useContext(LoginContexts)
    const complaintContext = useContext(compliantContexts)
    const [selectedComplaintTypeId, setSelectedComplaintTypeId] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [mediaimage, setMediaimage] = useState([]);
    const [description, setDespriction] = useState("");
    const [imageuri, setImageuri] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [toastMessage, setToastMessage] = useState()
    const [modelType, setModelType] = useState()


    console.log(selectedComplaintTypeId)
    console.log(selectedComplaint)
    console.log(mediaimage)

    useEffect(() => {
        if (selectedComplaint?.complaintTypeId) {
            console.log(selectedComplaint.images)
            setSelectedComplaintTypeId(selectedComplaint.complaintTypeId);
            setDespriction(selectedComplaint.description)
            setMediaimage(selectedComplaint.images)
        }
    }, [selectedComplaint]);

    const uploadimage = async () => {
        try {
            const result = await launchImageLibrary({
                mediaTypes: 'photo',
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });
            setMediaimage([...mediaimage, result.assets[0].uri])
            setImageuri([...imageuri, result.assets[0]])
        } catch (error) {
            console.log(error)

        }
    }

    console.log(imageuri)
    const submitBtn = () => {

        const noChanges = selectedComplaint.complaintTypeId === selectedComplaintTypeId &&
            selectedComplaint.description === description

        if (noChanges) {
            setShowSuccessModal(true)
            setToastMessage('No changes Made')
            setModelType('error')

            setTimeout(() => {
                setShowSuccessModal(false)
            }, 2000);
        }
        const payloads = {
            complaintTypeId: selectedComplaintTypeId,
            description: description,
        }

        console.log(payloads)

        console.log(imageuri)


        const formData = new FormData();

        const jsonBase64 = btoa(JSON.stringify(payloads));

        formData.append("payloads", {
            uri: "data:application/json;base64," + jsonBase64,
            type: "application/json",
            name: "payload.json",
        });

        if (imageuri) {

            console.log(imageuri)
            // let complaitImages = []
            // imageuri.forEach(img => {
            //   complaitImages.push({
            //     uri: img.uri,
            //     type: img.type,
            //     name: img.fileName
            //   })
            // })
            // console.log(complaitImages)


            formData.append("complaintImage", imageuri)

            imageuri.forEach((img, index) => {
                formData.append("complaintImage", {
                    uri: img.uri,
                    type: img.type,
                    name: img.fileName,
                })

            })
        }

        putComplaint(context.getHostelDetail.hostelId, complaintContext.getComplaintDetail.complaintId, loginContext.getToken, formData).
            then(r => {

                console.log(r)

                setLoading(true)

                setTimeout(() => {
                     setLoading(false)
                    if (r.status == 200) {      
                        setShowSuccessModal(true)
                        setToastMessage("Updated Successfully")
                        setModelType('success')

                        setTimeout(() => {
                            setShowSuccessModal(false)
                            onClose();
                        }, 2000);
                    }
                    else if(r.status == r.status){
                        setShowSuccessModal(true)
                        setToastMessage(r.message)
                        setModelType('error')

                        setTimeout(() => {
                            setShowSuccessModal(false)
                            onClose();

                        }, 2000);
                    }


                }, 2000);
            })


    }

    useEffect(() => {
        if (!visible) {
            setSelectedComplaintTypeId(selectedComplaint?.complaintTypeId || null);

            setDespriction(selectedComplaint?.description || "");
            setImageuri([])
            setMediaimage(selectedComplaint?.images || []);
            setIsFocus(false);
        }
    }, [visible]);

    // ---------

    if (!visible) return null;

    return (
        <View style={styles.sheetOverlay}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={StyleSheet.absoluteFill} />
            </TouchableWithoutFeedback>

            <Animated.View
                style={[styles.bottomSheet, { transform: [{ translateY: sheetY }] }]}
                {...panResponder.panHandlers}
            >
                <View style={{ flex: 1 }}>
                    <View {...panResponder.panHandlers}>
                        <View style={styles.dragindictor} />
                    </View>

                    {/* Loader, Success */}
                    <AppLoader visible={loading} />
                    <SuccessModal
                        visible={showSuccessModal}
                        onClose={() => setShowSuccessModal(false)}
                        message={toastMessage}
                        type={modelType}
                    />

                    <View style={{ padding: 20, justifyContent: 'space-between', flex: 1 }}>

                        <View>
                            <Text style={{ fontSize: 20, fontWeight: 600 }}>Edit complaint</Text>

                            <View style={{ paddingTop: 20 }}>
                                <Text>Complaint type</Text>

                                <Dropdown
                                    style={styles.dropdown}
                                    onFocus={() => setIsFocus(true)}
                                    onBlur={() => setIsFocus(false)}
                                    data={complaintType}
                                    containerStyle={{ borderRadius: 10, paddingLeft: 10 }}
                                    placeholder="Select a type"
                                    labelField="complaintTypeName"
                                    valueField="complaintTypeId"
                                    value={selectedComplaintTypeId}
                                    onChange={(item) => setSelectedComplaintTypeId(item.complaintTypeId)}
                                    renderRightIcon={() => (
                                        <Ionicons
                                            name={isFocus ? "chevron-up" : "chevron-down"}
                                            size={22}
                                            color="#000"
                                            style={{ paddingRight: 10 }}
                                        />
                                    )}
                                />
                            </View>

                            <View style={{ paddingTop: 16 }}>
                                <Text>Complaint message</Text>
                                <View style={styles.textInputBox}>
                                    <TextInput value={description} placeholder="Enter message" onChangeText={setDespriction}
                                        multiline={true}
                                        numberOfLines={4}
                                        style={{ textAlignVertical: "top" }} />
                                </View>
                            </View>

                            <View style={{ paddingTop: 16 }}>
                                <Text>Add Proof</Text>
                                <TouchableOpacity onPress={uploadimage} style={styles.uploadBox}>
                                    <Image source={CameraPic} style={{ width: 32, height: 32 }} />
                                    <View style={{ paddingLeft: 22 }}>
                                        <Text style={{ color: '#1E45E1' }}>Choose file</Text>
                                        <Text style={{ fontSize: 11 }}>Must be PNG, JPG</Text>
                                    </View>
                                </TouchableOpacity>

                                {mediaimage?.length > 0 && (
                                    <FlatList
                                        horizontal
                                        style={{ paddingTop: 20 }}
                                        data={mediaimage}
                                        renderItem={({ item }) => (
                                            <Image
                                                source={{ uri: item.imageUrl || item }}
                                                style={{ width: 80, height: 70, marginRight: 8, borderRadius: 5 }}
                                            />
                                        )}
                                    />
                                )}
                            </View>

                        </View>

                        <TouchableOpacity onPress={submitBtn} style={styles.submitBtn}>
                            <Text style={styles.submitText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        </View>
    );
};

export default EditComplaintSheet;

const styles = StyleSheet.create({
    dropdown: {
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 10,
        marginTop: 10,
        borderColor: '#e5e5e5',
        paddingLeft: 10
    },

    bottomSheet: {
        height: '90%', backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 5,
        paddingTop: 20, paddingBottom: 10
    },
    dragindictor: { width: 50, height: 4, backgroundColor: "#ccc", borderRadius: 2, alignSelf: "center", marginBottom: 10 },
    textInputBox: {
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 8,
        padding: 10,
        borderColor: '#e5e5e5'
    },
    uploadBox: {
        borderWidth: 1,
        borderRadius: 9,
        padding: 22,
        borderColor: '#e5e5e5',
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    submitBtn: {
        paddingVertical: 12,
        borderWidth: 1,
        borderRadius: 22,
        backgroundColor: '#1E45E1',
        borderColor: '#1E45E1',
        alignItems: 'center'
    },
    submitText: {
        color: '#fff',
        fontWeight: 600
    },
    sheetOverlay: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",

    },
});

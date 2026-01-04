import React, { useState, useEffect, useContext } from "react";
import { View, Text, Image, TouchableOpacity, Animated, StyleSheet, TouchableWithoutFeedback, ScrollView, TextInput, FlatList } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import AppLoader from "../../ToastFile/LoaderPage";
import SuccessModal from "../../ToastFile/TostFilePage";
import { Dropdown } from "react-native-element-dropdown";
import { UsersContext } from "../../../Context/UserContext";
import { LoginContexts } from "../../../Context/LoginContext";
import { compliantContexts } from "../../../Context/ComplaintContext";
import { complaints, getComplaintTypes } from "../../../Action/HostelAction";
import { postComplaint } from "../../../Action/CustomerAction";
import Ionicons from 'react-native-vector-icons/Ionicons'
import CameraPic from '../../../assets/Images/cameraPic.png'
import { SafeAreaView } from "react-native-safe-area-context";


const AddComplaint = ({
    visible,
    onClose,
    panResponder,
    sheetY
}) => {

    const context = useContext(UsersContext)
    const loginContext = useContext(LoginContexts)
    const complaintContext = useContext(compliantContexts)

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [toastMessage, setToastMessage] = useState()
    const [modelType, setModelType] = useState()
    const [mediaimage, setmediaImage] = useState([])
    const [imageuri, setImageuri] = useState([])
    const [selectedComplaintTypeId, setSelectedComplaintTypeId] = useState(0);
    const [complaintDescription, setDespriction] = useState()
    const [loading, setLoading] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [complaintType, setComplaintTypes] = useState([])

    useEffect(() => {
        if (visible) {
            getComplaintTypes(context.getHostelDetail.hostelId, loginContext.getToken).then(r => {
                console.log(r)
                setComplaintTypes(r.data)
            })
        }

    }, [visible])

    useEffect(() => {
        if (!visible) {
            setSelectedComplaintTypeId(0);
            setDespriction(null)
            setImageuri([])
            setmediaImage([])
        }
    }, [visible])



    const uploadimage = async () => {
        try {
            const result = await launchImageLibrary({
                mediaTypes: 'photo',
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });
            setmediaImage([...mediaimage, result.assets[0].uri])
            setImageuri([...imageuri, result.assets[0]])
        } catch (error) {
            console.log(error)

        }
    }

    const submitClick = () => {
        const payloads = {
            complaintTypeId: selectedComplaintTypeId,
            description: complaintDescription,
        }

        console.log(payloads)

        const formData = new FormData();


        const base64EncodeUnicode = (str) => {
            return btoa(
                encodeURIComponent(str).replace(
                    /%([0-9A-F]{2})/g,  
                    (_, p1) => String.fromCharCode('0x' + p1)
                )
            );
        };


        const jsonBase64 = base64EncodeUnicode(JSON.stringify(payloads));

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
        if (selectedComplaintTypeId === 0) {
            setShowSuccessModal(true);
            setToastMessage('Select complaint type');
            setModelType('error');
            setTimeout(() => setShowSuccessModal(false), 2000);
            return;
        }

        const desc = complaintDescription?.trim() ?? "";

        if (!desc) {
            setShowSuccessModal(true);
            setToastMessage("Comment cannot be empty");
            setModelType('error');
            setTimeout(() => setShowSuccessModal(false), 2000);
            return;
        }

        if (desc.length < 15) {
            setShowSuccessModal(true);
            setToastMessage("Comment should be above 15 letters");
            setModelType('error');
            setTimeout(() => setShowSuccessModal(false), 2000);
            return;
        }

        postComplaint(context.getHostelDetail.hostelId, loginContext.getToken, formData).then(r => {
            setLoading(true);
            console.log(r)

            setTimeout(() => {
                setLoading(false);

                if (r.status === 201) {
                    setShowSuccessModal(true);
                    setToastMessage("Complaint Added Successfully!");
                    setModelType('success');

                    setTimeout(() => {
                        setShowSuccessModal(false);
                        setSelectedComplaintTypeId(0);
                        setDespriction('');
                        onClose();

                        complaints(context.getHostelDetail.hostelId, loginContext.getToken).then(r => {
                            complaintContext.updateComplaintList(r?.data?.content);
                        });

                    }, 2000);
                }
                else {
                    setShowSuccessModal(true);
                    setToastMessage(r.message || "Something went wrong");
                    setModelType('error');
                    setTimeout(() => {
                        setShowSuccessModal(false);
                        onClose();
                    }, 2000);
                }

            }, 2000);
        });



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

                    <ScrollView style={{ flex: 1 }}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom: 20, flexGrow: 1
                        }}>
                        <View style={{ paddingTop: 10, justifyContent: 'space-between', flex: 1 }}>
                            <View>
                                <Text style={{ fontSize: 20, fontWeight: 600 }}>Add complaint</Text>

                                <View style={{ paddingTop: 20 }}>
                                    <Text>Complaint type
                                        <Text style={{ color: 'red' }}> *</Text>
                                    </Text>

                                    <Dropdown style={{ borderWidth: 1, borderRadius: 10, paddingVertical: 10, marginTop: 10, borderColor: '#e5e5e5', paddingLeft: 15 }}
                                        onFocus={() => setIsFocus(true)} onBlur={() => setIsFocus(false)}
                                        data={complaintType}
                                        containerStyle={{ borderRadius: 10 }}
                                        placeholderStyle={{ fontSize: 14 }}
                                        placeholder="Select a type"
                                        labelField="complaintTypeName"
                                        valueField="complaintTypeId"
                                        value={selectedComplaintTypeId}

                                        onChange={item => {
                                            setSelectedComplaintTypeId(item.complaintTypeId)
                                            setSelectedValue(item.value)
                                        }}
                                        renderRightIcon={() => (
                                            <Ionicons name={isFocus ? "chevron-up" : "chevron-down"}
                                                size={22}
                                                color="#000"
                                                style={{ paddingRight: 10 }}
                                            />
                                        )} />
                                </View>

                                <View style={{ paddingTop: 16 }}>
                                    <Text style={{ fontSize: 14, fontWeight: 400 }}>Complaint message
                                        <Text style={{ color: 'red' }}> *</Text>
                                    </Text>
                                    <View style={{ borderWidth: 1, borderRadius: 10, marginTop: 8, paddingTop: 7, paddingLeft: 10, borderColor: '#e5e5e5', height: 80 }}>
                                        <TextInput value={complaintDescription} placeholder="Enter message" onChangeText={(value) => setDespriction(value)}
                                            multiline
                                            textAlignVertical="top"
                                            style={{ flex: 1, padding: 0 }} />
                                    </View>
                                </View>

                                <View style={{ paddingTop: 16 }}>
                                    <Text>Add Proof</Text>
                                    <View >
                                        <TouchableOpacity onPress={uploadimage} style={{
                                            borderWidth: 1, borderRadius: 9, paddingTop: 22, paddingBottom: 22,
                                            paddingLeft: 24, paddingRight: 24, borderColor: '#e5e5e5', marginTop: 8, flexDirection: 'row', alignItems: 'center'
                                        }}>
                                            <View>
                                                <Image source={CameraPic} style={{ width: 32.77, height: 32.77 }} />
                                            </View>
                                            <View style={{ paddingLeft: 22 }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={{ color: '#1E45E1', fontSize: 12, fontWeight: 500 }}>Choose file</Text>
                                                    <Text style={{ fontSize: 12, fontWeight: 500 }}> to Upload</Text>
                                                </View>
                                                <Text style={{ fontSize: 11, fontWeight: 400, marginTop: 5 }}>Must be in PNG, JPG Format </Text>
                                            </View>
                                        </TouchableOpacity>

                                    </View>
                                </View>


                                <View>
                                    {mediaimage.length > 0 ? <FlatList horizontal showsHorizontalScrollIndicator={true} style={{ paddingTop: 20 }} key={(item) => item.id}
                                        data={mediaimage}
                                        // keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item }) => {
                                            console.log(item)
                                            return <View style={{ padding: 5 }}>
                                                <Image source={{ uri: item }} style={{ width: 80, height: 70, borderRadius: 5 }} />
                                            </View>
                                        }} /> : null}
                                </View>

                            </View>

                            <View style={{ paddingBottom: 20 }}>
                                <TouchableOpacity onPress={submitClick}

                                    style={{
                                        paddingTop: 12, paddingBottom: 12, borderRadius: 22, justifyContent: 'center',
                                        backgroundColor: selectedComplaintTypeId === 0 || !complaintDescription || complaintDescription.trim().length < 15 ? '#9EB3FF' : '#1E45E1',
                                        alignItems: 'center'
                                    }}>
                                    <Text style={{ fontSize: 14, fontWeight: 600, color: '#ffffff' }}>Submit</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </ScrollView>

                </SafeAreaView>


            </Animated.View>
        </View>
    )
}

export default AddComplaint;

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
    dragindictor: { width: 50, height: 4, backgroundColor: "#ccc", borderRadius: 2, alignSelf: "center", marginBottom: 10 },
    bottomsheets: {
        height: '90%', backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 20,
        paddingTop: 20, paddingBottom: 10
    },
})
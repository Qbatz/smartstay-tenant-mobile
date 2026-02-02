import React, { useState, useEffect, useContext, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, TouchableWithoutFeedback, Animated, ScrollView } from "react-native";
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
import ErrorMessage from "../../ToastFile/ErrorMessage";
import { useFocusEffect } from "@react-navigation/native";
import Trash from "../../../assets/Images/trash 01.png"



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
    const [compliantTypeError, setComplaintTypeError] = useState();
    const [commentError, setCommentError] = useState()
    const [commentNoChanges, setCommentNoChanges] = useState()
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [deleteVisible, setDeleteVisible] = useState(false);


    useEffect(() => {
        if (visible && selectedComplaint) {
            setSelectedComplaintTypeId(selectedComplaint.complaintTypeId ?? null);
            setDespriction(selectedComplaint.complaintDescription ?? "");
            setMediaimage(selectedComplaint.complaintImages ?? []);
            setImageuri([]);
            setSelectedIndex(null);
            setDeleteVisible(false);
        }
    }, [visible, selectedComplaint]);


    // const uploadimage = async () => {
    //     try {
    //         const result = await launchImageLibrary({
    //             mediaTypes: 'photo',
    //             allowsEditing: true,
    //             // aspect: [1, 1],
    //             maxHeight: 100, maxWidth: 100,
    //             quality: 0.5,
    //         });
    //         setMediaimage([...mediaimage, result.assets[0].uri])
    //         setImageuri([...imageuri, result.assets[0]])
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    const uploadimage = async () => {
        try {
            const result = await launchImageLibrary({
                mediaType: 'photo',
                maxWidth: 500,
                maxHeight: 500,
                selectionLimit: 0,
                quality: 0.5,
                selectionLimit: 0,
            });
            if (result?.assets && result.assets.length > 0) {
                const uris = result.assets.map(item => item?.uri).filter(Boolean); 
                    
                if (uris.length === 0) return;

                setMediaimage(prev => [...prev, ...uris]);
                setImageuri(prev => [...prev, ...uris]);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const imageClick = (index) => {
        if (selectedIndex === index) {
            setDeleteVisible(!deleteVisible)
        }
        else {
            setSelectedIndex(index)
            setDeleteVisible(true)
        }
    }

    const removeImage = (index) => {
        setMediaimage(prev => prev.filter((_, i) => i !== index));
        setImageuri(prev => prev.filter((_, i) => i !== index));

        setSelectedIndex(null);
        setDeleteVisible(false);
    }


    const validateForm = () => {
        let valid = true;

        setComplaintTypeError("")
        setCommentError("")
        setCommentNoChanges("")

        if (selectedComplaintTypeId === 0) {
            setComplaintTypeError("Select complaint type");
            valid = false;
        }


        const desc = description?.trim() ?? "";

        if (!desc) {
            setCommentError("Enter comment && above 15 letters")
            valid = false;
        }

        if (desc.length < 15) {
            setCommentError("Enter comment && above 15 letters")
            valid = false;
        }

        // const noChanges = selectedComplaint.complaintTypeId === selectedComplaintTypeId &&
        //     selectedComplaint.description === description && mediaimage.length ===(selectedComplaint?.complaintImages?.length || 0)

        // if (noChanges) {
        //    setCommentNoChanges("No changes made in comment")
        //    valid =false;
        // }

        return valid;
    }
    const submitBtn = () => {
        if (!validateForm()) return;



        //  if (selectedComplaintTypeId === 0) {
        //     setShowSuccessModal(true);
        //     setToastMessage('Select complaint type');
        //     setModelType('error');
        //     setTimeout(() => setShowSuccessModal(false), 2000);
        //     return;
        // }

        // const desc = description?.trim() ?? "";

        // if (!desc) {
        //     setShowSuccessModal(true);
        //     setToastMessage("Comment cannot be empty");
        //     setModelType('error');
        //     setTimeout(() => setShowSuccessModal(false), 2000);
        //     return;
        // }

        // if (desc.length < 15) {
        //     setShowSuccessModal(true);
        //     setToastMessage("Comment should be above 15 letters");
        //     setModelType('error');
        //     setTimeout(() => setShowSuccessModal(false), 2000);
        //     return;
        // }


        const noChanges = selectedComplaint.complaintTypeId === selectedComplaintTypeId &&
            selectedComplaint.complaintDescription === description && mediaimage.length === (selectedComplaint?.complaintImages?.length || 0)

        if (noChanges) {
            setShowSuccessModal(true)
            setToastMessage('No changes Made')
            setModelType('error')

            setTimeout(() => {
                setShowSuccessModal(false)
            }, 2000);
            return;
        }
        const payloads = {
            complaintTypeId: selectedComplaintTypeId,
            description: description,
        }


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


            // formData.append("complaintImage", imageuri)

            imageuri.forEach((img, index) => {
                formData.append("complaintImage", {
                    uri: img,
                    type: "image/jpeg",
                    name: "profile.jpg",
                })

            })
        }

        putComplaint(context.getHostelDetail.hostelId, complaintContext.getComplaintDetail.complaintId, loginContext.getToken, formData).
            then(r => {


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
                    else if (r.status == r.status) {
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

            setComplaintTypeError("")
            setCommentError("")
            setCommentNoChanges("")
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

                    <AppLoader visible={loading} />
                    <SuccessModal
                        visible={showSuccessModal}
                        onClose={() => setShowSuccessModal(false)}
                        message={toastMessage}
                        type={modelType}
                    />
                    <ScrollView showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <View style={{ padding: 20, justifyContent: 'space-between', flex: 1 }}>

                            <View>
                                <Text style={{ fontSize: 20, fontWeight: 600 }}>Edit complaint</Text>

                                <View style={{ paddingTop: 20 }}>
                                    <Text>Complaint type
                                        <Text style={{ color: 'red' }}> *</Text>
                                    </Text>

                                    <Dropdown
                                        style={styles.dropdown}
                                        onFocus={() => setIsFocus(true)}
                                        onBlur={() => setIsFocus(false)}
                                        data={complaintType}
                                        containerStyle={{ borderRadius: 10, paddingLeft: 0 }}
                                        placeholder="Select a type"
                                        labelField="complaintTypeName"
                                        valueField="complaintTypeId"
                                        value={selectedComplaintTypeId}
                                        onChange={(item) => {
                                            setSelectedComplaintTypeId(item.complaintTypeId)
                                            if (compliantTypeError) {
                                                setComplaintTypeError("")
                                            }
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
                                </View>
                                {compliantTypeError && <ErrorMessage message={compliantTypeError} type="error" />}

                                <View style={{ paddingTop: 16 }}>
                                    <Text>Complaint message
                                        <Text style={{ color: 'red' }}> *</Text>
                                    </Text>
                                    <View style={styles.textInputBox}>
                                        <TextInput value={description} placeholder="Enter message" onChangeText={(value) => {
                                            setDespriction(value)
                                            if (commentError) {
                                                setCommentError("")
                                            }
                                            if (commentNoChanges) { setCommentNoChanges("") }
                                        }}
                                            multiline={true}
                                            numberOfLines={4}
                                            style={{ textAlignVertical: "top" }} />
                                    </View>
                                    {commentError && <ErrorMessage message={commentError} type="error" />}
                                    {commentNoChanges && <ErrorMessage message={commentNoChanges} type="error" />}
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
                                            renderItem={({ item, index }) => (
                                                <TouchableOpacity onPress={() => imageClick(index)}>
                                                    <Image
                                                        source={{ uri: item?.imageUrl || item }}
                                                        style={{ width: 80, height: 70, marginRight: 8, borderRadius: 5 }}
                                                    />
                                                    {selectedIndex === index && deleteVisible && (
                                                        <TouchableOpacity onPress={() => removeImage(index)}
                                                            style={{
                                                                position: 'absolute', top: 0, bottom: 0, left: 0,
                                                                right: 0, alignItems: 'center', justifyContent: 'center',
                                                            }}>
                                                            <Image source={Trash} style={{ width: 17.72, height: 17.72 }} />

                                                        </TouchableOpacity>
                                                    )}
                                                </TouchableOpacity>
                                            )}
                                        />
                                    )}
                                </View>

                            </View>

                            <TouchableOpacity onPress={submitBtn} style={styles.submitBtn}>
                                <Text style={styles.submitText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
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

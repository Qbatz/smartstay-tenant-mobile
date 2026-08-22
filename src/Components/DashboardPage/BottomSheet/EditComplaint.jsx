import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, TouchableWithoutFeedback, Animated, ScrollView, Modal, Dimensions } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Ionicons from "react-native-vector-icons/Ionicons";
import SuccessModal from "../../ToastFile/TostFilePage";
import AppLoader from "../../ToastFile/LoaderPage";
import CameraPic from '../../../assets/Images/cameraPic.png'
import { launchImageLibrary } from "react-native-image-picker";
import { deleteImage, putComplaint } from "../../../Action/CustomerAction";
import { UsersContext } from "../../../Context/UserContext";
import { LoginContexts } from "../../../Context/LoginContext";
import { compliantContexts } from "../../../Context/ComplaintContext";
import ErrorMessage from "../../ToastFile/ErrorMessage";
import { useFocusEffect } from "@react-navigation/native";
import Trash from "../../../assets/Images/trash 01.png"
import { getComplaints } from "../../../Action/HostelAction";



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

    const SCREEN_WIDTH = Dimensions.get("window").width;
    const SCREEN_HEIGHT = Dimensions.get("window").height;

    const flatListRef = useRef(null);
    const [viewerVisible, setViewerVisible] = useState(false);
    const [selectedViewIndex, setSelectedViewIndex] = useState(0);

    console.log("mediaimg", mediaimage)
    console.log(imageuri)

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

    const removeImage = (index, imageId) => {
        console.log(index, imageId);

        if (index !== null && index !== undefined) {
            setMediaimage(prev => prev.filter((_, i) => i !== index));
            setImageuri(prev => prev.filter((_, i) => i !== index));
        }

        setSelectedIndex(null);
        setDeleteVisible(false);

        if (imageId) {
            deleteImage(imageId, complaintContext.getComplaintDetail.complaintId, loginContext.getToken, context.getHostelDetail.hostelId
            ).then(r => {
                console.log("Deleted from server", r);

                getComplaints(context.getHostelDetail.hostelId, complaintContext.getComplaintDetail.complaintId, loginContext.getToken)
                    .then(r => {
                        console.log(r)
                        complaintContext.updateComplaint(r.data)
                        complaintContext.updateComments(r.data?.comments)
                    })

            });
        }
    };



    // setMediaimage(prev => prev.filter((_, i) => i !== index));
    // setImageuri(prev => prev.filter((_, i) => i !== index));

    // setSelectedIndex(null);
    // setDeleteVisible(false);



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
                        getComplaints(context.getHostelDetail.hostelId, complaintContext.getComplaintDetail.complaintId, loginContext.getToken)
                            .then(r => {
                                console.log(r)
                                complaintContext.updateComplaint(r.data)
                                complaintContext.updateComments(r.data?.comments)
                            })

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

    const openViewer = (index) => {
        setSelectedViewIndex(index);
        setViewerVisible(true);
    }

    const deleteSpecificImage = () => {
        const deletedImage = mediaimage[selectedViewIndex];

        console.log("Delete Image Id:", deletedImage.imageId);

        if (deletedImage?.imageId) {
            deleteImage(deletedImage.imageId, complaintContext.getComplaintDetail.complaintId, loginContext.getToken, context.getHostelDetail.hostelId
            ).then(r => {
                console.log("Deleted from server", r);

                getComplaints(context.getHostelDetail.hostelId, complaintContext.getComplaintDetail.complaintId, loginContext.getToken)
                    .then(r => {
                        console.log(r)
                        complaintContext.updateComplaint(r.data)
                        complaintContext.updateComments(r.data?.comments)
                    })

            });
        }

        const updatedImages = mediaimage.filter(
            (_, index) => index !== selectedViewIndex
        );

        setMediaimage(updatedImages);
        setImageuri(updatedImages)

        if (updatedImages.length === 0) {
            setViewerVisible(false);
            return;
        }

        if (selectedViewIndex >= updatedImages.length) {
            setSelectedViewIndex(updatedImages.length - 1);
        }
    };

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
                                <Text style={{ fontSize: 20, fontFamily: "Gilroy-Semibold" }}>Edit complaint</Text>

                                <View style={{ paddingTop: 20 }}>
                                    <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium' }}>Complaint type
                                        <Text style={{ color: 'red' }}> *</Text>
                                    </Text>

                                    <Dropdown
                                        style={styles.dropdown}
                                        onFocus={() => setIsFocus(true)}
                                        onBlur={() => setIsFocus(false)}
                                        data={complaintType}
                                        containerStyle={{ borderRadius: 10, paddingLeft: 0 }}
                                        placeholderStyle={{ fontSize: 14, fontFamily: 'Gilroy-Medium' }}
                                        selectedTextStyle={{ fontSize: 14, fontFamily: 'Gilroy-Medium' }}
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
                                        renderItem={(item) => (
                                            <View
                                                style={{
                                                    padding: 15,
                                                    borderRadius: 15,
                                                    backgroundColor:
                                                        item.complaintTypeId === selectedComplaintTypeId
                                                            ? "#E8F0FE"
                                                            : "#FFF",
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: 16,
                                                        fontFamily: "Gilroy-Medium",
                                                    }}
                                                >
                                                    {item.complaintTypeName}
                                                </Text>
                                            </View>
                                        )}
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
                                    <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium' }}>Complaint message
                                        <Text style={{ color: 'red' }}> *</Text>
                                    </Text>
                                    <View style={styles.textInputBox}>
                                        <TextInput value={description}
                                            placeholder="Enter message"
                                            onChangeText={(value) => {
                                                setDespriction(value)
                                                if (commentError) {
                                                    setCommentError("")
                                                }
                                                if (commentNoChanges) { setCommentNoChanges("") }
                                            }}
                                            multiline={true}
                                            numberOfLines={4}
                                            style={{ textAlignVertical: "top", fontSize: 14, fontFamily: "Gilroy-Medium", }} />
                                    </View>
                                    {commentError && <ErrorMessage message={commentError} type="error" />}
                                    {commentNoChanges && <ErrorMessage message={commentNoChanges} type="error" />}
                                </View>

                                <View style={{ paddingTop: 16 }}>
                                    <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium' }}>Add Proof</Text>
                                    <TouchableOpacity onPress={uploadimage} style={styles.uploadBox}>
                                        <Image source={CameraPic} style={{ width: 32, height: 32 }} />
                                        <View style={{ paddingLeft: 22 }}>
                                            <Text style={{ color: '#1E45E1', fontSize: 13, fontFamily: 'Gilroy-Medium' }}>Choose file</Text>
                                            <Text style={{ fontSize: 12, fontFamily: 'Gilroy-Regular' }}>Must be PNG, JPG</Text>
                                        </View>
                                    </TouchableOpacity>

                                    {mediaimage?.length > 0 && (
                                        <FlatList
                                            horizontal
                                            data={mediaimage}
                                            keyExtractor={(item, index) => index.toString()}
                                            showsHorizontalScrollIndicator={false}
                                            contentContainerStyle={{ paddingTop: 20 }}
                                            renderItem={({ item, index }) => (
                                                <TouchableOpacity onPress={() => openViewer(index)}
                                                    style={styles.imageContainer}>
                                                    <Image
                                                        source={{ uri: item?.imageUrl || item }}
                                                        style={styles.image}
                                                    />

                                                    <TouchableOpacity
                                                        onPress={() => removeImage(index, item?.imageId)}
                                                        style={styles.deleteBtn}
                                                    >
                                                        <Image source={Trash} style={styles.deleteIcon} />
                                                    </TouchableOpacity>
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

                <Modal
                    visible={viewerVisible}
                    transparent={false}
                    animationType="fade"
                    onShow={() => {
                        flatListRef.current?.scrollToIndex({
                            index: selectedIndex,
                            animated: false,
                        });
                    }}
                >

                    <View
                        style={{
                            marginTop: 50,
                            paddingHorizontal: 20,
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}
                    >

                        <TouchableOpacity
                            onPress={() => setViewerVisible(false)}
                        >
                            <Text>←</Text>
                        </TouchableOpacity>

                        <Text>
                            {selectedViewIndex + 1} / {mediaimage.length}
                        </Text>

                    </View>

                    <FlatList
                        ref={flatListRef}
                        data={mediaimage}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}

                        renderItem={({ item }) => (

                            <Image
                                source={{
                                    uri: item.imageUrl || item
                                }}
                                resizeMode="contain"
                                style={{
                                    width: SCREEN_WIDTH,
                                    height: SCREEN_HEIGHT - 150
                                }}
                            />

                        )}

                        keyExtractor={(item, index) => index.toString()}

                        onMomentumScrollEnd={(e) => {

                            const index = Math.round(
                                e.nativeEvent.contentOffset.x /
                                SCREEN_WIDTH
                            );

                            setSelectedViewIndex(index);

                        }}
                    />

                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            marginBottom: 50, marginHorizontal: 20
                        }}
                    >

                        <TouchableOpacity onPress={deleteSpecificImage}
                            style={{
                                borderWidth: 1, borderRadius: 10, paddingVertical: 14, flex: 1, alignItems: 'center',
                                justifyContent: 'center', marginRight: 4
                            }}>
                            <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium' }}>Delete</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                backgroundColor: "#0565FF", borderRadius: 10, paddingVertical: 14, flex: 1,
                                alignItems: 'center', justifyContent: 'center', marginLeft: 4
                            }}>
                            <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', color: '#ffffff' }}>
                                Replace</Text>
                        </TouchableOpacity>

                    </View>
                </Modal>
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
    imageContainer: {
        width: 120,
        height: 120,
        marginRight: 12,
        position: "relative",
    },

    image: {
        width: "100%",
        height: "100%",
        borderRadius: 8,
    },

    deleteBtn: {
        position: "absolute",
        bottom: 8,
        right: 8,
        width: 34,
        height: 34,
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",

        elevation: 4, // Android

        shadowColor: "#000", // iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },

    deleteIcon: {
        width: 18,
        height: 18,
        resizeMode: "contain",
        tintColor: '#FF0000'
    },

});

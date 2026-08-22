import React, { useState, useEffect, useContext, useRef } from "react";
import { View, Text, Image, TouchableOpacity, Animated, StyleSheet, TouchableWithoutFeedback, ScrollView, TextInput, FlatList, Dimensions, Modal } from "react-native";
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
import ErrorMessage from "../../ToastFile/ErrorMessage";
import Trash from "../../../assets/Images/trash 01.png"


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
    const [compliantTypeError, setComplaintTypeError] = useState();
    const [commentError, setCommentError] = useState()
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [deleteVisible, setDeleteVisible] = useState(false);

    const SCREEN_WIDTH = Dimensions.get("window").width;
    const SCREEN_HEIGHT = Dimensions.get("window").height;

    const flatListRef = useRef(null);
    const [viewerVisible, setViewerVisible] = useState(false);
    const [selectedViewIndex, setSelectedViewIndex] = useState(0);

    useEffect(() => {
        if (visible) {
            getComplaintTypes(context.getHostelDetail.hostelId, loginContext.getToken).then(r => {
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
            setComplaintTypeError('')
            setCommentError("")
        }
    }, [visible])

    const uploadimage = async () => {
        try {
            const result = await launchImageLibrary({
                mediaTypes: 'photo',
                // allowsEditing: true,
                // aspect: [1, 1],
                maxWidth: 500,
                maxHeight: 500,
                quality: 0.6,
                selectionLimit: 0,
            });

            if (!result.canceled) {
                setmediaImage(prev =>
                    prev.concat(result.assets?.map(item => item.uri))
                );

                setImageuri(prev =>
                    prev.concat(result.assets?.map(item => item.uri))
                );
            }
        } catch (error) {
            console.log(error);
        }
    };

    console.log("mediaimg", mediaimage)
    console.log(imageuri)



    // const uploadimage = async () => {
    //     try {
    //         const result = await launchImageLibrary({
    //             mediaTypes: 'photo',
    //             allowsEditing: true,
    //             aspect: [1, 1],
    //             quality: 0.6,
    //             selectionLimit: 0,
    //         });
    //         console.log(result)
    //         if (!result.canceled) {
    //             setmediaImage(result.assets.map(item => item.uri));
    //             setImageuri(result.assets);
    //         }
    //         // setmediaImage([...mediaimage, result.assets[0].uri])
    //         // setImageuri([...imageuri, result.assets[0]])
    //     } catch (error) {
    //         console.log(error)

    //     }
    // }

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
        setmediaImage(prev => prev.filter((_, i) => i !== index));
        setImageuri(prev => prev.filter((_, i) => i !== index));

        setSelectedIndex(null);
        setDeleteVisible(false);
    };



    const validateForm = () => {
        let valid = true;

        setComplaintTypeError("")
        setCommentError("")

        if (selectedComplaintTypeId === 0) {
            setComplaintTypeError("Select Complaint Type");
            valid = false;
        }

        const desc = complaintDescription?.trim() ?? "";

        if (!desc) {
            setCommentError("Enter comment && above 15 letters");
            valid = false;
        }

        if (desc.length < 15) {
            setCommentError("Enter comment && above 15 letters");
            valid = false;
        }

        return valid;
    }

    const submitClick = () => {

        if (!validateForm()) return;

        const payloads = {
            complaintTypeId: selectedComplaintTypeId,
            description: complaintDescription,
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

            // let complaitImages = []
            // imageuri.forEach(img => {
            //   complaitImages.push({
            //     uri: img.uri,
            //     type: img.type,
            //     name: img.fileName
            //   })
            // })
            // console.log(complaitImages)
            //   formData.append("complaintImage", {
            //         uri: imageuri.uri,
            //         type: imageuri.type || "image/jpeg",
            //         name: imageuri.fileName || "profile.jpg",
            //     })


            // formData.append("complaintImage", imageuri)

            imageuri.forEach((img, index) => {
                formData.append("complaintImage", {
                    uri: img,
                    type: "image/jpeg",
                    name: "profile.jpg",
                })

            })
        }


        // if (selectedComplaintTypeId === 0) {
        //     setShowSuccessModal(true);
        //     setToastMessage('Select complaint type');
        //     setModelType('error');
        //     setTimeout(() => setShowSuccessModal(false), 2000);
        //     return;
        // }

        // const desc = complaintDescription?.trim() ?? "";

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

        postComplaint(context.getHostelDetail.hostelId, loginContext.getToken, formData).then(r => {
            setLoading(true);

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

    const openViewer = (index) => {
        setSelectedViewIndex(index);
        setViewerVisible(true);
    }

    const deleteImage = () => {
        const deletedImage = mediaimage[selectedViewIndex];

        console.log("Delete Image Id:", deletedImage.imageId);

        const updatedImages = mediaimage.filter(
            (_, index) => index !== selectedViewIndex
        );

        setmediaImage(updatedImages);
        setImageuri(updatedImages)

        if (updatedImages.length === 0) {
            setViewerVisible(false);
            return;
        }

        if (selectedViewIndex >= updatedImages.length) {
            setSelectedViewIndex(updatedImages.length - 1);
        }
    };

    // const replaceImage = async () => {

    //     const result = await launchImageLibrary({
    //         mediaType: "photo",
    //         maxWidth: 500,
    //         maxHeight: 500,
    //         quality: 0.6,
    //         // selectionLimit: 0,
    //     });

    //     if (result.didCancel) return;

    //     if (!result.assets || result.assets.length === 0) return;

    //     const newImage = result.assets[0];

    //     const updatedImages = [...mediaimage];

    //     updatedImages[selectedViewIndex] = {
    //         ...updatedImages[selectedViewIndex],

    //         imageUrl: newImage.uri,

    //         fileName: newImage.fileName,
    //         type: newImage.type,
    //     };
    //     const currentItem = updatedImages[selectedViewIndex];
    //     updatedImages[selectedViewIndex] =
    //         typeof currentItem === "string"
    //             ? {
    //                 imageUrl: newImage.uri,
    //                 fileName: newImage.fileName,
    //                 type: newImage.type,
    //             }
    //             : {
    //                 ...currentItem,
    //                 imageUrl: newImage.uri,
    //                 fileName: newImage.fileName,
    //                 type: newImage.type,
    //             };

    //     console.log("uploadedimg", updatedImages)

    //     setmediaImage(updatedImages);
    //     setImageuri(updatedImages)
    // };

    const replaceImage = async () => {
    const result = await launchImageLibrary({
        mediaType: "photo",
        maxWidth: 500,
        maxHeight: 500,
        quality: 0.6,
    });

    if (result.didCancel) return;

    if (!result.assets?.length) return;

    const updatedImages = [...mediaimage];

    // Replace the selected image URI
    updatedImages[selectedViewIndex] = result.assets[0].uri;

    setmediaImage(updatedImages);
    setImageuri(updatedImages);

    console.log(updatedImages);
};

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
                                <Text style={{ fontSize: 20, fontFamily: 'Gilroy-Semibold' }}>Add complaint</Text>

                                <View style={{ paddingTop: 20 }}>
                                    <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium' }}>Complaint type
                                        <Text style={{ color: 'red' }}> *</Text>
                                    </Text>

                                    {complaintType && complaintType.length > 0 ? (
                                        <Dropdown
                                            style={{
                                                borderWidth: 1,
                                                borderRadius: 10,
                                                paddingVertical: 10,
                                                marginTop: 10,
                                                borderColor: '#e5e5e5',
                                                paddingLeft: 15,
                                            }}
                                            onFocus={() => setIsFocus(true)}
                                            onBlur={() => setIsFocus(false)}
                                            data={complaintType}
                                            containerStyle={{ borderRadius: 15 }}
                                            placeholderStyle={{ fontSize: 14, fontFamily: 'Gilroy-Medium' }}
                                            selectedTextStyle={{ fontSize: 14, fontFamily: 'Gilroy-Medium' }}
                                            placeholder="Select a type"
                                            labelField="complaintTypeName"
                                            valueField="complaintTypeId"
                                            value={selectedComplaintTypeId}

                                            onChange={item => {
                                                setSelectedComplaintTypeId(item.complaintTypeId);
                                                setSelectedValue(item.value);

                                                if (compliantTypeError) {
                                                    setComplaintTypeError("");
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
                                    ) : (
                                        <Text
                                            style={{
                                                marginTop: 10,
                                                paddingVertical: 12,
                                                paddingLeft: 15,
                                                borderWidth: 1,
                                                borderRadius: 10,
                                                borderColor: '#e5e5e5',
                                                fontSize: 14,
                                                color: '#9e9e9e',
                                                fontFamily: 'Gilroy-Medium'
                                            }}
                                        >
                                            No data available
                                        </Text>
                                    )}


                                    {/* <Dropdown style={{ borderWidth: 1, borderRadius: 10, paddingVertical: 10, marginTop: 10, borderColor: '#e5e5e5', paddingLeft: 15 }}
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

                                            if(compliantTypeError){
                                                setComplaintTypeError("")
                                            }
                                        }}
                                        renderRightIcon={() => (
                                            <Ionicons name={isFocus ? "chevron-up" : "chevron-down"}
                                                size={22}
                                                color="#000"
                                                style={{ paddingRight: 10 }}
                                            />
                                        )} /> */}
                                </View>
                                {compliantTypeError && <ErrorMessage message={compliantTypeError} type="error" />}

                                <View style={{ paddingTop: 16 }}>
                                    <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium' }}>Complaint message
                                        <Text style={{ color: 'red' }}> *</Text>
                                    </Text>
                                    <View style={{ borderWidth: 1, borderRadius: 10, marginTop: 8, paddingTop: 7, paddingLeft: 10, borderColor: '#e5e5e5', height: 80 }}>
                                        <TextInput value={complaintDescription} placeholder="Enter message"
                                            onChangeText={(value) => {
                                                setDespriction(value);
                                                if (value.trim().length >= 15) {
                                                    setCommentError("")
                                                }
                                            }}
                                            multiline
                                            textAlignVertical="top"
                                            style={{ flex: 1, padding: 0, textAlignVertical: "top", fontSize: 14, fontFamily: "Gilroy-Medium", }} />
                                    </View>
                                </View>

                                {commentError && <ErrorMessage message={commentError} type="error" />}

                                <View style={{ paddingTop: 16 }}>
                                    <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium' }}>Add Proof</Text>
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
                                                    <Text style={{ color: '#1E45E1', fontSize: 13, fontFamily: 'Gilroy-Medium' }}>Choose file</Text>
                                                    <Text style={{ fontSize: 13, fontFamily: 'Gilroy-Medium' }}> to Upload</Text>
                                                </View>
                                                <Text style={{ fontSize: 12, fontFamily: 'Gilroy-Medium', marginTop: 5 }}>Must be in PNG, JPG Format </Text>
                                            </View>
                                        </TouchableOpacity>

                                    </View>
                                </View>


                                <View>
                                    {mediaimage.length > 0 ?
                                        <FlatList horizontal showsHorizontalScrollIndicator={true}
                                            style={{ paddingTop: 20 }} key={(item) => item.id}
                                            data={mediaimage}
                                            // keyExtractor={(item, index) => index.toString()}
                                            renderItem={({ item, index }) => (
                                                <TouchableOpacity onPress={() => openViewer(index)}
                                                    style={style.imageContainer}>
                                                    <Image
                                                        source={{ uri: item?.imageUrl || item }}
                                                        style={style.image}
                                                    />

                                                    <TouchableOpacity
                                                        onPress={() => removeImage(index)}
                                                        style={style.deleteBtn}
                                                    >
                                                        <Image source={Trash} style={style.deleteIcon} />
                                                    </TouchableOpacity>
                                                </TouchableOpacity>
                                            )} /> : null}
                                </View>

                            </View>

                            <View style={{ paddingBottom: 20 }}>
                                <TouchableOpacity onPress={submitClick}

                                    style={{
                                        paddingTop: 12, paddingBottom: 12, borderRadius: 22, justifyContent: 'center',
                                        backgroundColor: selectedComplaintTypeId === 0 || !complaintDescription || complaintDescription.trim().length < 15 ? '#9EB3FF' : '#1E45E1',
                                        alignItems: 'center'
                                    }}>
                                    <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Semibold', color: '#ffffff' }}>Submit</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </ScrollView>

                </SafeAreaView>

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

                        <TouchableOpacity onPress={deleteImage}
                            style={{
                                borderWidth: 1, borderRadius: 10, paddingVertical: 14, flex: 1, alignItems: 'center',
                                justifyContent: 'center', marginRight: 4
                            }}>
                            <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium' }}>Delete</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={replaceImage}
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
})
import React, { useContext, useEffect, useRef, useState } from "react";
import { View, Text, Image, StyleSheet, TextInput, ScrollView, TouchableOpacity, Pressable, PanResponder, Animated, Dimensions, KeyboardAvoidingView, Platform } from "react-native";
import LeftArrow from "../../assets/Images/LeftArrow.png"
import { useNavigation } from "@react-navigation/native";
import { customerDetails, editProfile, removeProfilePic } from "../../Action/CustomerAction";
import { UsersContext } from "../../Context/UserContext";
import { LoginContexts } from "../../Context/LoginContext";
import AppLoader from "../ToastFile/LoaderPage";
import SuccessModal from "../ToastFile/TostFilePage";
import CameraIcon from "../../assets/Images/camera_Icon.png"
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import CameraPic from "../../assets/Images/CameraIcon.png";
import Gallery from "../../assets/Images/gallery-add.png";
import CloseIcon from "../../assets/Images/close.png";
import sideframe from '../../assets/Images/sideframe.png';
import RemoveIcon from "../../assets/Images/removeIcon.png";
import EditSmallIcon from "../../assets/Images/editSmallIcon.png"
import NoResultPic from "../../assets/Images/NoResultPic.png"
import Ionicons from "react-native-vector-icons/Ionicons";





const PersonalDetails = (route) => {

    const navigation = useNavigation();
    const context = useContext(UsersContext)
    const { getCustomerDetail } = useContext(UsersContext)
    const loginContext = useContext(LoginContexts)

    const [firstname, setfirstName] = useState(route.route?.params?.customer?.firstName);
    const [lastName, setLastName] = useState(route.route?.params?.customer?.lastName || "");
    const [mailId, setMailId] = useState(route.route?.params?.customer?.emailId || "");
    const [mobile, setMobileNo] = useState(route.route?.params?.customer?.mobile || "");
    const [houseNo, setHouseNo] = useState(route.route?.params?.customer?.houseNo || "");
    const [streetName, setStreetName] = useState(route.route?.params?.customer?.street || "");
    const [landmark, setLandmark] = useState(route.route?.params?.customer?.landmark || "");
    const [city, setCity] = useState(route.route?.params?.customer?.city || "");
    const [pincode, setPincode] = useState("");
    const [state, setState] = useState(route.route?.params?.customer?.state || "")
    const [initials, setInitials] = useState(route.route?.params?.customer?.initials)
    const [profileImage, setProfileImage] = useState(null);
    const [profilePic, setProfilePic] = useState(route.route?.params?.customer?.profilePic || null)

    const [loading, setLoading] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [toastMessage, setToastMessage] = useState()
    const [modelType, setModelType] = useState();

    const [showCameraIcon, setShowCameraIcon] = useState(false);
    const [selectPicUpload, setSelectPicUpload] = useState(false);
    const SCREEN_HEIGHT = Dimensions.get("window").height;
    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    // const scrollRef = useRef(null);
    const scrollRef = React.useRef(null);
    const handleFocus = (event) => {
        event.target.measure((x, y, width, height, pageX, pageY) => {
            scrollRef.current?.scrollTo({
                y: pageY - 180, // Adjust this value if needed
                animated: true,
            });
        });
    };
    const houseNoRef = useRef(null);
    const streetRef = useRef(null);
    const landmarkRef = useRef(null);
    const cityRef = useRef(null);
    const PincodeRef = useRef(null);
    const stateRef = useRef(null);

    const scrollToField = (ref) => {
        if (!ref?.current || !scrollRef.current) return;

        ref.current.measureLayout(
            scrollRef.current,
            (x, y) => {
                scrollRef.current.scrollTo({
                    y: y - 100,
                    animated: true,
                });
            },
            () => { }
        );
    };

    useEffect(() => {
        if (getCustomerDetail) {
            setfirstName(getCustomerDetail?.firstName)
            setLastName(getCustomerDetail?.lastName)
            setMailId(getCustomerDetail?.emailId)
            setHouseNo(getCustomerDetail?.houseNo)
            setStreetName(getCustomerDetail?.street)
            setLandmark(getCustomerDetail?.landmark)
            setCity(getCustomerDetail?.city)
            setPincode(String(getCustomerDetail?.pincode))
            setState(getCustomerDetail?.state)
        }
    }, [getCustomerDetail])



    const openSheet = () => {
        Animated.timing(translateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }

    const closeSheet = () => {
        Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 250,
            useNativeDriver: true,
        }).start(() => setSelectPicUpload(false));
    }

    useEffect(() => {
        if (selectPicUpload) {
            openSheet();
        }
    }, [selectPicUpload]);

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gesture) => gesture.dy > 10,

            onPanResponderMove: (_, gesture) => {
                if (gesture.dy > 0) {
                    translateY.setValue(gesture.dy);
                }
            },

            onPanResponderRelease: (_, gesture) => {
                if (gesture.dy > 120) {
                    closeSheet();
                } else {
                    openSheet();
                }
            }
        })
    ).current;

    const isAddressEmpty =
  !houseNo?.trim() &&
  !streetName?.trim() &&
  !landmark?.trim() &&
  !city?.trim() &&
  pincode?.trim() ==="0" &&
  !state?.trim();

  console.log(houseNo,streetName,landmark,city,pincode,state)


    const handleImagePick = async () => {
        try {
            const result = await launchImageLibrary({
                mediaTypes: 'photo',
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });
            setProfileImage({ uri: result.assets[0] })
        } catch (error) {
            console.log(error)
        }
    }

    const openCamera = async () => {
        const options = {
            mediaType: 'photo',
            quality: 0.8,
            saveToPhotos: true,
        };

        const result = await launchCamera(options);

        if (result.didCancel) {
            console.log("User cancelled camera");
        } else if (result.errorCode) {
            console.log("Camera Error:", result.errorMessage);
        } else {
            console.log("Camera Image:", result.assets);
            setProfileImage(result?.assets[0])
            // 👉 use result.assets[0]
        }
    };

    const openGallery = async () => {
        const options = {
            mediaType: 'photo',
            quality: 0.8,
        };

        const result = await launchImageLibrary(options);

        if (result.didCancel) {
            console.log("User cancelled gallery");
        } else if (result.errorCode) {
            console.log("Gallery Error:", result.errorMessage);
        } else {
            console.log("Gallery Image:", result.assets);
            setProfileImage(result?.assets[0])
            // 👉 use result.assets[0]
        }
    };

    const removePic = () => {
        setProfileImage("")
        setProfilePic("")

        removeProfilePic(loginContext.getToken).then(r => {
            console.log(r)

            if (r.status == 200) {
                customerDetails(loginContext.getToken).then(r => {
                    console.log(r.data)
                    context.updateCustomer(r.data)
                })
            }
        })
    }

    const handleEdit = () => {

        const payload = {
            firstName: firstname,
            lastName: lastName,
            emailId: mailId,
            houseNo: houseNo,
            street: streetName,
            landmark: landmark,
            city: city,
            state: state,
        }

        const formData = new FormData();

        const jsonBase64 = btoa(JSON.stringify(payload))

        formData.append("payloads", {
            uri: "data:application/json;base64," + jsonBase64,
            type: "application/json",
            name: "payload.json",
        })

        if (profileImage) {
            formData.append("profilePic", {
                uri: profileImage.uri,
                type: "image/jpeg",
                name: "profile.jpg",
            })
        }

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

    console.log(route)

    // const imageSource = profileImage ? profileImage.uri : profilePic ? profilePic : null;

    const imageSource = profileImage ? { uri: profileImage.uri } : profilePic
        ? { uri: profilePic } : null;

    console.log(imageSource)
    return <View style={{ backgroundColor: '#ffffff', flex: 1, }}>
        <AppLoader visible={loading} />
        <SuccessModal
            visible={showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
            message={toastMessage}
            type={modelType}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 30 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={LeftArrow} style={{ height: 25, width: 25 }} />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontFamily: 'Gilroy-Semibold', marginLeft: 8 }}>Personal Details</Text>
            </View>

            {/* <TouchableOpacity onPress={handleEdit}
                style={{ backgroundColor: '#E7F1FF', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5, flexDirection: 'row' }}>
                <Image source={EditSmallIcon} style={{ width: 16, height: 16 }} />
                <Text style={{ fontSize: 12, fontFamily: 'Gilroy-Regular', color: '#1E45E1', marginLeft: 6 }}>Edit</Text>
            </TouchableOpacity> */}
        </View>
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
            style={{ flex: 1 }}>
            <ScrollView
                ref={scrollRef}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 80 }}>

                <View style={{ alignItems: 'center', paddingVertical: 15 }}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => setSelectPicUpload(true)}
                        onPressIn={() => setShowCameraIcon(true)}
                        onPressOut={() => setShowCameraIcon(false)}
                    >
                        <View style={styles.imageWrapper}>

                            {
                                imageSource ? <Image source={imageSource} style={styles.profileImage} /> :
                                    <View style={[styles.profileImage, { alignItems: 'center', justifyContent: 'center', backgroundColor: '#eef1ff', }]}>
                                        <Text style={{ fontSize: 20, fontFamily: 'Gilroy-Bold' }}>{initials}</Text>


                                        {showCameraIcon && (
                                            <View style={styles.cameraOverlay}>
                                                <Image
                                                    source={CameraIcon}
                                                    style={{ width: 28, height: 28, tintColor: "#fff" }}
                                                />
                                            </View>
                                        )}
                                    </View>


                            }
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", marginTop: 15 }}>
                    <Text style={{ fontSize: 18, fontFamily: 'Gilroy-Semibold', }}>Basic Info</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("EditBasicDetail")}
                        style={{ backgroundColor: '#E7F1FF', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 8, flexDirection: 'row' }}>
                        <Image source={EditSmallIcon} style={{ width: 16, height: 16 }} />
                        <Text style={{ fontSize: 12, fontFamily: 'Gilroy-Regular', color: '#1E45E1', marginLeft: 6 }}>Edit</Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.fieldContainer, { marginTop: 15 }]}>
                    <Text style={styles.label}>First name</Text>

                    <TextInput
                        value={firstname}
                        editable={false}
                        placeholder="Enter first name"
                        style={styles.input}
                        onChangeText={(text) => {
                            const onlyLetters = text.replace(/[^A-Za-z\s]/g, "")
                            setfirstName(onlyLetters)
                        }}
                    />
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Last name</Text>

                    <TextInput
                        value={lastName}
                        editable={false}
                        placeholder="Enter last name"
                        style={styles.input}
                        onChangeText={(text) => {
                            const onlyLetters = text.replace(/[^A-Za-z\s]/g, "")
                            setLastName(onlyLetters)
                        }}
                    />
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Mail Id</Text>

                    <TextInput
                        value={mailId}
                        placeholder="Enter mailId"
                        editable={false}
                        style={styles.input}
                        onChangeText={(text) => {
                            const noEmojis = text.replace(
                                /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "");
                            setMailId(noEmojis)
                        }}
                    />
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Mobile No</Text>
                    
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Text  style={styles.input}>+91</Text>
                    <Ionicons name="chevron-down" size={16}/>
                    <TextInput
                        value={mobile}
                        placeholder="Enter first name"
                        style={[styles.input,{marginLeft:5}]}
                        disableFullscreenUI
                    />
                    </View>
                </View>
                <View style={{ paddingHorizontal: 10, paddingVertical: 5, backgroundColor: "#F5F9FF", alignSelf: "flex-start", borderRadius: 8 }}>
                    <Text style={{ fontSize: 12, fontFamily: 'Gilroy-Regular', color: '#1E45E1' }}>Mobile No not editable</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", marginTop: 15 }}>
                    <Text style={{ fontSize: 18, fontFamily: 'Gilroy-Semibold' }}>Address Details</Text>

                   {(houseNo || streetName || landmark || city || pincode !=0 || state) && (
                    <TouchableOpacity onPress={() => navigation.navigate("EditAddressDetail", {mode:"edit"})}
                        style={{ backgroundColor: '#E7F1FF', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 8, flexDirection: 'row' }}>
                        <Image source={EditSmallIcon} style={{ width: 16, height: 16 }} />
                        <Text style={{ fontSize: 12, fontFamily: 'Gilroy-Regular', color: '#1E45E1', marginLeft: 6 }}>Edit</Text>
                    </TouchableOpacity>
                    )}
                </View>

                {isAddressEmpty ? (
                    <View style={{ borderWidth: 1, borderRadius: 10, padding: 16, borderColor: '#E7E7E7', alignItems: 'center', marginTop: 20 }}>
                        <Image source={NoResultPic} style={{ width: 100, height: 100 }} />
                        <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', textAlign: 'center', lineHeight: 20, marginTop: 12 }}>
                            Your Address Details are missing 
                        </Text>

                        <TouchableOpacity onPress={() => navigation.navigate("EditAddressDetail", {mode:"add"})}
                            style={{
                                backgroundColor: "#1E45E1", borderRadius: 10, width: '100%', paddingVertical: 10,
                                marginHorizontal: 14, marginTop: 16, alignItems: 'center'
                            }}>
                            <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Semibold', color: '#FFFFFF' }}>
                                Add Address Details</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>

                        <View style={[styles.fieldContainer, { marginTop: 15 }]}>
                            <Text style={styles.label}>House No / Apartment</Text>

                            <Text style={[styles.input, { marginLeft: 4 }]}>{houseNo || "--"}</Text>
                        </View>

                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>Street / Area</Text>

                            <Text style={[styles.input, { marginLeft: 4 }]}>{streetName || "--"}</Text>
                        </View>

                        <View ref={landmarkRef} style={styles.fieldContainer}>
                            <Text style={styles.label}>Landmark</Text>

                            <Text style={[styles.input, { marginLeft: 4 }]}>{landmark || "--"}</Text>

                            {/* <TextInput
                        value={landmark}
                        placeholder="Enter landmark"
                        style={styles.input}
                        editable={false}
                        onFocus={() => {
                            setTimeout(() => {
                                scrollToField(landmarkRef);
                            }, 200);
                        }}
                    /> */}
                        </View>

                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>City</Text>

                            <Text style={[styles.input, { marginLeft: 4 }]}>{city || "--"}</Text>
                        </View>

                        <View style={styles.fieldContainer} >
                            <Text style={styles.label}>Pincode</Text>

                            <Text style={[styles.input, { marginLeft: 4 }]}>{pincode == 0 ? "--" : pincode}</Text>
                        </View>

                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>State</Text>

                            <Text style={[styles.input, { marginLeft: 4 }]}>{state || "--"}</Text>
                        </View>
                    </>
                )}
            </ScrollView>
        </KeyboardAvoidingView>

        {
            selectPicUpload && (
                <View style={styles.overlay}>
                    <Pressable
                        style={StyleSheet.absoluteFillObject}
                        onPress={closeSheet}
                    />

                    <Animated.View
                        {...panResponder.panHandlers}
                        style={[styles.sheet,
                        {
                            transform: [{ translateY }]
                        }]}>


                        <View style={styles.dragindictor} />

                        <View style={{ marginTop: 5, marginBottom: 20 }}>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ fontSize: 20, fontFamily: 'Gilroy-Semibold' }}>Change Profile Picture</Text>

                                <TouchableOpacity onPress={closeSheet}>
                                    <Image source={CloseIcon} style={{ width: 22, height: 22 }} />
                                </TouchableOpacity>
                            </View>


                            <View style={{ width: '100%', borderWidth: 0.8, borderColor: '#E5E7EB', marginTop: 20, marginBottom: 10 }} />

                            <TouchableOpacity onPress={openCamera}
                                style={styles.touchableAction}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={CameraPic} style={{ width: 24, height: 24 }} />
                                    <Text style={styles.actionText}>Take Picture</Text>
                                </View>

                                <Image source={sideframe} style={{ width: 23, height: 23 }} />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={openGallery}
                                style={styles.touchableAction}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={Gallery} style={{ width: 24, height: 24 }} />
                                    <Text style={styles.actionText}>Select from Gallery</Text>
                                </View>

                                <Image source={sideframe} style={{ width: 23, height: 23 }} />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={removePic}
                                style={styles.touchableAction}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={RemoveIcon} style={{ width: 24, height: 24 }} />
                                    <Text style={styles.actionText}>Remove Picture</Text>
                                </View>


                            </TouchableOpacity>

                        </View>

                    </Animated.View>

                </View>
            )
        }
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
    cameraOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    imageWrapper: {
        position: "relative",

    },
    sheet: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 16,
        maxHeight: "90%",
        overflow: 'hidden'
        // dynamic height limit
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
        zIndex: 999
    },
    dragindictor: { width: 50, height: 4, backgroundColor: "#ccc", borderRadius: 2, alignSelf: "center", marginBottom: 10 },
    touchableAction: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: '#F9FAFB', paddingVertical: 10, marginTop: 10, borderRadius: 10,
        paddingHorizontal: 10
    },
    actionText: {
        fontSize: 16, fontFamily: 'Gilroy-Semibold', marginLeft: 8
    }

})
export default PersonalDetails;
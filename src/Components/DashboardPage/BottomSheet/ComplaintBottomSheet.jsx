import React, { useEffect, useRef, useContext, useState } from "react";
import {
    View,
    StyleSheet,
    Animated,
    PanResponder,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    ScrollView,
    TouchableOpacity, Image,
    TextInput,
    Text,
    Dimensions,
    FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { compliantContexts } from "../../../Context/ComplaintContext";
import { useNavigation } from "@react-navigation/native";
import { deleteImage } from "../../../Action/CustomerAction";
import { addComment, getComplaints } from "../../../Action/HostelAction";
import Edit from '../../../assets/Images/edit.png'
import Delete from '../../../assets/Images/trash.png'
import Group from '../../../assets/Images/Group.png'
import CommentMesg from '../../../assets/Images/commentMessage.png';
import SendButton from '../../../assets/Images/Send.png';
import Trash from '../../../assets/Images/trash 01.png'
import { UsersContext } from "../../../Context/UserContext";
import { LoginContexts } from "../../../Context/LoginContext";
import DeleteComplaint from "../Popup/DeleteComplaint";
import ReopennComplaint from "../Popup/ReopenComplaint";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function ComplaintBottomSheet({
    visible,
    onClose,
    selectedComplaintSend, setEditCompliantBottomSheet, setShowSheet
}) {
    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const complaintContext = useContext(compliantContexts)
    const context = useContext(UsersContext)
    const loginContext = useContext(LoginContexts)
    const [comment, setComment] = useState(false)
    const navigation = useNavigation();
    const [sendComment, setSendComment] = useState(null)
    const [selectedComplaint, setSelectComplaint] = useState(null);
    const [currentComplaint, setCurrentComplaint] = useState(null);
    const [imageid, setimageid] = useState();
    const [deletevisible, setdeleteVisible] = useState(false)
    const [complaintId, setComplaintId] = useState()
    const [showPopUp, setShowPopUp] = useState(false)
    const [reopenComplaint, setReopenComplaint] = useState(false)

    useEffect(() => {
        if (visible && selectedComplaintSend) {
            setCurrentComplaint(selectedComplaintSend);
        }
    }, [visible, selectedComplaintSend]);
    console.log(selectedComplaint)

    useEffect(() => {
        if (!visible) {
            setComment(false)
        }
    }, [visible])


    /* ================= OPEN / CLOSE ================= */
    useEffect(() => {
        Animated.timing(translateY, {
            toValue: visible ? 0 : SCREEN_HEIGHT,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [visible]);

    /* ================= DRAG DOWN ================= */
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, g) => g.dy > 10,
            onPanResponderMove: (_, g) => {
                if (g.dy > 0) translateY.setValue(g.dy);
            },
            onPanResponderRelease: (_, g) => {
                if (g.dy > 150) {
                    Keyboard.dismiss();
                    onClose && onClose();
                } else {
                    Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    const commentclick = () => {
        setComment(true)
    }
    const imageclick = (id) => {
        setdeleteVisible(true)
        setimageid(id)
    }

    const onImageDelete = (imageId, complaintId) => {
        console.log(imageId, complaintId)

        deleteImage(imageId, complaintId, loginContext.getToken, context.getHostelDetail.hostelId).then(r => {
            console.log(r)

            getComplaints(context.getHostelDetail.hostelId, complaintId, loginContext.getToken).then(r => {
                setSelectComplaint(r.data)
                complaintContext.updateComplaint(r.data)
                complaintContext.updateComments(r.data?.comments)
            })
        })


    }

    const sendclick = () => {

        if (!sendComment?.trim()) return;

        const data = {
            message: sendComment,
            hostelId: context.getHostelDetail.hostelId
        }


        addComment(currentComplaint?.complaintId, loginContext.getToken, data).then(r => {
            setSendComment(null)

            getComplaints(context.getHostelDetail.hostelId, currentComplaint?.complaintId, loginContext.getToken).then(r => {
                setSelectComplaint(r.data)
                complaintContext.updateComments(r.data?.comments)
            })

        })
    }

    const seeAllUpdates = (complaintId) => {
        navigation.navigate('Updates', { complaintId: complaintId })
    }

    const deleteClick = (complaintId) => {
        setShowPopUp(true)
        setComplaintId(complaintId)
    }

    if (!visible) return null;

    return (
        <View style={styles.overlay}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={StyleSheet.absoluteFillObject} />
            </TouchableWithoutFeedback>

            <Animated.View
                {...panResponder.panHandlers}
                style={[
                    styles.sheet,
                    { transform: [{ translateY }] },
                ]}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
                >
                    <SafeAreaView edges={["bottom"]}  >

                        {/* ================= YOUR CONTENT HERE ================= */}

                        <View {...panResponder.panHandlers}>
                            <View style={styles.dragindictor} />
                        </View>

                        {comment ? (
                            <ScrollView
                                keyboardShouldPersistTaps="handled"
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ flexGrow: 1 }}
                            >
                                {/* Comments Section */}
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 18, fontWeight: "400" }}>
                                        Comments
                                    </Text>

                                    <View
                                        style={{
                                            height: 1,
                                            backgroundColor: "#eee",
                                            marginVertical: 10,
                                        }}
                                    />

                                    {complaintContext?.getComplaintComments?.length > 0 ? (
                                        complaintContext?.getComplaintComments.map((item, index) => (
                                            <View
                                                key={item.commentId}
                                                style={{ paddingTop: 15, flexDirection: "row" }}>
                                                <View>
                                                    {item.profilePic ? (
                                                        <Image
                                                            source={{ uri: item.profilePic }}
                                                            style={{ width: 36, height: 36, borderRadius: 18, }} />
                                                    ) : (
                                                        <View
                                                            style={{
                                                                width: 36, height: 36, borderRadius: 18, backgroundColor: "#eef1ff",
                                                                justifyContent: "center", alignItems: "center"
                                                            }}>
                                                            <Text
                                                                style={{
                                                                    color: "#788fed",
                                                                    fontSize: 14,
                                                                    fontWeight: "bold",
                                                                }}
                                                            >
                                                                {item.initials}
                                                            </Text>
                                                        </View>
                                                    )}
                                                </View>

                                                <View style={{ paddingLeft: 10, flex: 1 }}>
                                                    <View style={{ flexDirection: "row" }}>
                                                        <Text
                                                            style={{
                                                                flex: 1,
                                                                fontSize: 12,
                                                                color: "#4B4B4B",
                                                            }}
                                                            numberOfLines={1}
                                                        >
                                                            {item.commentdBy}
                                                        </Text>

                                                        <Text
                                                            style={{
                                                                flex: 1,
                                                                fontSize: 10,
                                                                color: "#6E6E6E",
                                                                textAlign: "right",
                                                            }}
                                                            numberOfLines={1}
                                                        >
                                                            {item.commentedAt} - {item?.time}
                                                        </Text>
                                                    </View>

                                                    <Text
                                                        style={{
                                                            fontSize: 14,
                                                            marginTop: 5,
                                                        }}
                                                    >
                                                        {item.comment}
                                                    </Text>
                                                </View>
                                            </View>
                                        ))
                                    ) : (
                                        <View
                                            style={{
                                                height: 250, // 👈 fixed height only when empty
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Text style={{ fontSize: 16, fontWeight: "600" }}>
                                                No Comments Yet
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: 14,
                                                    color: "#8E8E93",
                                                    marginTop: 5,
                                                }}
                                            >
                                                Start Your Conversation
                                            </Text>
                                        </View>
                                    )}
                                </View>

                                {/* Input Section */}
                                <View style={{ paddingVertical: 20 }}>
                                    <View
                                        style={{
                                            borderWidth: 1,
                                            borderColor: "#C3CFFF29",
                                            backgroundColor: "#f4f7fe",
                                            borderRadius: 10,
                                            flexDirection: "row",
                                            alignItems: "center",
                                            paddingHorizontal: 8,
                                        }}
                                    >
                                        <TextInput
                                            value={sendComment}
                                            placeholder="Post your Reply here"
                                            onChangeText={setSendComment}
                                            multiline
                                            style={{ flex: 1 }}
                                        />

                                        {sendComment?.trim().length > 0 && (
                                            <TouchableOpacity onPress={sendclick}>
                                                <Image
                                                    source={SendButton}
                                                    style={{ width: 34, height: 34 }}
                                                />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            </ScrollView>
                        ) : (
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps="handled"
                            //  style={{maxHeight: SCREEN_HEIGHT * 0.75}}
                            >
                                {complaintContext.getComplaintDetail && (

                                    <View style={{ marginBottom: 10 }} >
                                        <View >
                                            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingLeft: 5, paddingRight: 8, marginBottom: 10, paddingTop: 10, }}>
                                                <View>
                                                    <Text style={{ fontSize: 18, fontWeight: "500", fontFamily: "gilroy-semibold", }} >
                                                        {complaintContext.getComplaintDetail?.complaintType}
                                                    </Text>
                                                    <Text style={{ fontSize: 12.8, fontWeight: "400", color: "#424242", marginTop: 6 }}>
                                                        {complaintContext.getComplaintDetail?.raisedAt}{"  "} {complaintContext.getComplaintDetail?.time}
                                                    </Text>
                                                </View>

                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                    <TouchableOpacity onPress={() => { setEditCompliantBottomSheet(true) }} style={{ paddingRight: 10 }}>
                                                        <Image source={Edit} style={{ width: 17.72, height: 17.72 }} />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => deleteClick(currentComplaint?.complaintId)} style={{ paddingLeft: 10 }}>
                                                        <Image source={Delete} style={{ width: 17.72, height: 17.72 }} />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>

                                            <View style={{ height: 1, backgroundColor: "#eee", marginVertical: 10 }} />

                                            <View style={{ paddingTop: 5 }}>
                                                <Text style={{ fontSize: 12, fontWeight: "400", color: "#4B4B4B" }}>Description </Text>
                                                <Text style={{ fontSize: 16, fontWeight: "400", marginTop: 9 }}>
                                                    {complaintContext.getComplaintDetail?.complaintDescription}
                                                </Text>
                                            </View>

                                            <View style={{ paddingTop: 10 }}>
                                                <Text style={{ fontSize: 12, fontWeight: "400", color: "#4B4B4B" }}> Assigned to</Text>

                                                <View style={{ flexDirection: "row", justifyContent: "space-between", paddingTop: 8, }}>
                                                    {complaintContext.getComplaintDetail?.assignee != null ? <Text style={{ fontSize: 15, fontWeight: "500" }}>
                                                        {complaintContext.getComplaintDetail?.assignee?.firstName}{""}{complaintContext.getComplaintDetail?.assignee?.lastName}
                                                    </Text>
                                                        : <Text style={{ fontSize: 14, fontWeight: "500", color: "#FF3B30", }}>
                                                            Not Assigned Yet
                                                        </Text>
                                                    }

                                                    {complaintContext.getComplaintDetail?.assignee?.mobile != null ?
                                                        <Text style={{ fontSize: 12, color: "#1E45E1", fontWeight: "400" }}>
                                                            {complaintContext.getComplaintDetail?.assignee?.mobile}
                                                        </Text> : null}
                                                </View>
                                            </View>

                                            {/* ATTACHED IMAGES */}
                                            <View style={{ paddingTop: 15 }}>
                                                <Text style={{ fontSize: 12, fontWeight: "400", color: "#4B4B4B" }}> Attached images</Text>

                                                <FlatList horizontal
                                                    style={{ paddingTop: 15 }}
                                                    keyExtractor={(item) => item.imageId.toString()}
                                                    data={complaintContext.getComplaintDetail?.complaintImages}
                                                    renderItem={({ item }) => {
                                                        return <View key={item.imageId}
                                                            style={{ paddingLeft: 10, position: "relative" }}>

                                                            <TouchableOpacity onPress={() => imageclick(item.imageId)}>
                                                                <Image source={{ uri: item.imageUrl }} style={{ width: 90, height: 70, borderRadius: 5 }} />
                                                                {imageid === item.imageId && deletevisible && (
                                                                    <TouchableOpacity onPress={() => onImageDelete(item.imageId, currentComplaint.complaintId)}
                                                                        style={{ position: "absolute", bottom: 25, right: 35, }} >
                                                                        <Image source={Trash} style={{ width: 21.09, height: 21.09, }} />
                                                                    </TouchableOpacity>
                                                                )}
                                                            </TouchableOpacity>
                                                        </View>
                                                    }}
                                                />

                                            </View>
                                        </View>


                                        {["ASSIGNED", "assigned"].includes(complaintContext.getComplaintDetail?.currentStatus) ?
                                            <View style={{ borderWidth: 1, borderRadius: 10, borderColor: '#DCDCDC', paddingVertical: 10, paddingHorizontal: 15, marginTop: 15 }}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <Text style={{ fontSize: 15, fontWeight: 600 }}>Complaint Assigned</Text>

                                                    <View style={{
                                                        flexDirection: 'row', borderRadius: 10, paddingVertical: 5, paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center',
                                                        backgroundColor: complaintContext.getComplaintDetail?.currentStatus === "PENDING" ? "#FFEEEEA3" : complaintContext.getComplaintDetail?.currentStatus === "Inpogress" ? "#FFF6E7" : "lightgreen",
                                                    }}>
                                                        <Image source={Group}
                                                            style={{
                                                                width: 12.95, height: 13, marginTop: 2,
                                                                tintColor: complaintContext.getComplaintDetail?.currentStatus === "PENDING" ? "#FF3B30" : complaintContext.getComplaintDetail?.currentStatus === "Inpogress" ? "#FF9500" : "green",
                                                            }} />

                                                        <Text style={{
                                                            fontSize: 12, fontWeight: 600, marginLeft: 5,
                                                            color: complaintContext.getComplaintDetail?.currentStatus === "PENDING" ? "#FFEEEEA3" : complaintContext.getComplaintDetail?.currentStatus === "Inpogress" ? "#FFF6E7" : "green"
                                                        }}>
                                                            {complaintContext.getComplaintDetail?.currentStatus}</Text>
                                                    </View>

                                                </View>

                                                <View style={{ height: 1, backgroundColor: "#eee", marginVertical: 15 }} />

                                                <TouchableOpacity onPress={() => seeAllUpdates(complaintContext.getComplaintDetail?.complaintId)}
                                                    style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 10 }}>
                                                    <Text style={{ color: "#00A1FF", fontSize: 14, fontWeight: 600 }}>
                                                        See all updates
                                                    </Text>
                                                </TouchableOpacity>

                                            </View> : null}

                                        {complaintContext.getComplaintDetail?.currentStatus == "resolved" ?
                                            <View style={{ borderWidth: 1, borderRadius: 10, borderColor: '#DCDCDC', paddingVertical: 10, paddingHorizontal: 15, marginTop: 15 }}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <Text style={{ fontSize: 15, fontWeight: 600 }}>Your complaint was Resolved</Text>

                                                    <View style={{
                                                        flexDirection: 'row', borderRadius: 10, paddingVertical: 5, paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center',
                                                        backgroundColor: complaintContext.getComplaintDetail?.currentStatus === "PENDING" ? "#FFEEEEA3" : complaintContext.getComplaintDetail?.currentStatus === "Inpogress" ? "#FFF6E7" : "lightgreen",
                                                    }}>
                                                        <Image source={Group}
                                                            style={{
                                                                width: 12.95, height: 13, marginTop: 2,
                                                                tintColor: complaintContext.getComplaintDetail?.currentStatus === "PENDING" ? "#FF3B30" : complaintContext.getComplaintDetail?.currentStatus === "Inpogress" ? "#FF9500" : "green",
                                                            }} />

                                                        <Text style={{
                                                            fontSize: 12, fontWeight: 600, marginLeft: 5,
                                                            color: complaintContext.getComplaintDetail?.currentStatus === "PENDING" ? "#FFEEEEA3" : complaintContext.getComplaintDetail?.currentStatus === "Inpogress" ? "#FFF6E7" : "green"
                                                        }}>
                                                            {complaintContext.getComplaintDetail?.currentStatus}</Text>
                                                    </View>

                                                </View>

                                                <View style={{ height: 1, backgroundColor: "#eee", marginVertical: 15 }} />

                                                <TouchableOpacity onPress={() => setReopenComplaint(true)}
                                                    style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 10 }}>
                                                    <Text style={{ color: "#2E70E8", fontSize: 14, fontWeight: 600 }}>
                                                        Want to Reopen
                                                    </Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity onPress={() => { seeAllUpdates(complaintContext.getComplaintDetail?.complaintId) }}
                                                    style={{
                                                        justifyContent: 'center', alignItems: 'center', backgroundColor: '#1E45E1',
                                                        padding: 10, borderRadius: 8
                                                    }}>
                                                    <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: 600 }}>
                                                        See all updates
                                                    </Text>
                                                </TouchableOpacity>

                                            </View> : null}

                                        <View style={{ marginTop: 10 }} >
                                            {/* COMMENT INPUT */}
                                            <View style={{ paddingTop: 22 }}>
                                                <View style={{ padding: 4, borderRadius: 10, borderWidth: 1, justifyContent: "space-between", flexDirection: "row", alignItems: "center", borderColor: '#DCDCDC' }} >
                                                    <TextInput value={sendComment} placeholder="Add your Comment" onChangeText={setSendComment} multiline
                                                        blurOnSubmit={false}
                                                        style={{ flex: 1 }} />
                                                    <TouchableOpacity onPress={sendComment ? sendclick : commentclick} style={{ flexDirection: 'row', marginRight: 14 }}>
                                                        <Image
                                                            source={sendComment?.trim().length > 0 ? SendButton : CommentMesg}
                                                            style={{ width: 23, height: 23, marginRight: 3 }} />
                                                        {sendComment?.trim().length > 0 ? null : complaintContext?.getComplaintComments?.length > 0 && (
                                                            <Text style={{ color: '#2E70E8' }}>
                                                                {complaintContext.getComplaintComments.length}
                                                            </Text>
                                                        )}

                                                    </TouchableOpacity>
                                                </View>
                                            </View>

                                            {/* STATUS BUTTON */}

                                            {["OPENED", "PENDING"].includes(complaintContext.getComplaintDetail?.currentStatus) &&
                                                <TouchableOpacity>
                                                    <View
                                                        style={{
                                                            padding: 13, borderRadius: 10, borderWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 15, marginBottom: 20,
                                                            backgroundColor: complaintContext.getComplaintDetail?.currentStatus === "PENDING" ? "#FFEEEEA3" : complaintContext.getComplaintDetail?.currentStatus === "Inpogress" ? "#FFF6E7" : "lightgreen",
                                                            borderColor: complaintContext.getComplaintDetail?.currentStatus === "PENDING" ? "#FFD5D5" : complaintContext.getComplaintDetail?.currentStatus === "Inpogress" ? "#FFE7C6" : "lightgreen",
                                                        }}>
                                                        <Image source={Group}
                                                            style={{
                                                                width: 17.93, height: 18, marginTop: 4,
                                                                tintColor: complaintContext.getComplaintDetail?.currentStatus === "PENDING" ? "#FF3B30" : complaintContext.getComplaintDetail?.currentStatus === "Inpogress" ? "#FF9500" : "green",
                                                            }} />
                                                        <Text
                                                            style={{
                                                                color: complaintContext.getComplaintDetail?.currentStatus === "PENDING" ? "#FF3B30" : complaintContext.getComplaintDetail?.currentStatus === "Inpogress" ? "#FF9500" : "green",
                                                                fontSize: 14.11, fontWeight: "600", marginLeft: 10,
                                                            }}>
                                                            {complaintContext.getComplaintDetail?.currentStatus}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            }


                                        </View>
                                    </View>

                                )}
                            </ScrollView>
                        )}

                        {/* ======================================================= */}
                    </SafeAreaView>
                </KeyboardAvoidingView>
                <DeleteComplaint
                    visible={showPopUp}
                    onClose={() => setShowPopUp(false)}
                    complaintId={complaintId}
                    setShowSheet={onClose} />

                <ReopennComplaint
                    visible={reopenComplaint}
                    onClose={() => setReopenComplaint(false)} />
            </Animated.View>
        </View>

    );

}



const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
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
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 12,
        minHeight: 45,
        textAlignVertical: "top",
    },
    dragindictor: { width: 50, height: 4, backgroundColor: "#ccc", borderRadius: 2, alignSelf: "center", marginBottom: 10 },
});
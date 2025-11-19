import React, { useState, useEffect, useCallback, useRef, useMemo, useContext } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, SafeAreaView, FlatList, Pressable, Modal, TouchableWithoutFeedback, TextInput, Button } from "react-native";
import AddComplaint from '../../assets/Images/addComplaint.png'
import RightDirection from '../../assets/Images/direction-right.png'
import AddSquare from '../../assets/Images/add-square.png'
import MessagePic from '../../assets/Images/Group (1).png'
import Edit from '../../assets/Images/edit.png'
import Delete from '../../assets/Images/trash.png'
import Damage1 from '../../assets/Images/damage1.png'
import Damage2 from '../../assets/Images/damage2.png'
import Damage3 from '../../assets/Images/damage3.png'
import Trash from '../../assets/Images/trash 01.png'
import CommentMesg from '../../assets/Images/commentMessage.png'
import Group from '../../assets/Images/Group.png'
import Customer from "../../assets/Images/Customer_Icon.png"
import SendButton from '../../assets/Images/Send.png'
import { Dropdown } from "react-native-element-dropdown";
import Ionicons from 'react-native-vector-icons/Ionicons'
import CameraPic from '../../assets/Images/cameraPic.png'
import File from '../../assets/Images/files.png'
import { launchImageLibrary } from "react-native-image-picker";
import AmenitiesPic from '../../assets/Images/amenities.png'
import { UsersContext } from "../../Context/UserContext";
import BottomSheet,{BottomSheetView} from "@gorhom/bottom-sheet";
import { assignAmenities, complaints, unassignAmeties } from "../../Action/HostelAction";

function Services(props) {
    console.log(props)

    const commonContext = useContext(UsersContext)

    console.log(commonContext.Complaint)
    console.log(props)
    const [complaintsList,setComplaintsList]=useState([])
    const [selectedfield, setselectfield] = useState(0);
    const [modulevisible, setModalVisible] = useState(false)
    const [comment, setComment] = useState(false)

    const [commentnote, setCommentNote] = useState(null)
    const [commentMessage, setCommentmessage] = useState();
    const [selectedValue, setSelectedValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

    const[assignedAmenities,setAssignedAmenity]=useState([])
    const[unassignedAmenities,setUnasignedAmenities]=useState([])

    console.log(selectedfield)


    useEffect(() => {
        const data = [{ id: 1, person: 'You', comment: 'When will solve', date: '20 Jan -12.35pm' }, { id: 2, person: 'Priya', comment: 'Complaint assigned and rectify soon', date: '21 Jan -11.35pm' }, { id: 3, person: 'You', comment: 'Thank you', date: '21 Jan -2.35pm' }]
        setCommentNote(data)
    }, [])

    useEffect(() => {
        firstclick('Complaint')
    }, [])


    const list2 = [{ id: 1, Amenities: 'wifi', Amount: '339/Month' }, { id: 2, Amenities: 'Laundry', Amount: '299/month' }, { id: 3, Amenities: 'Food', Amount: '1500/month' }]

    const list3 = [{ id: 1, Available: 'Parking' }, { id: 2, Available: 'Gym Access' }, { id: 3, Available: 'Cycle Rentals' }, { id: 4, Available: 'Cleaning' }]

    const complainttype = [{ label: 'Plumbing', value: '1' }, { label: 'Electricity', value: '2' }, { label: 'Room Maintanence', value: '3' }, { label: 'Canteen food', value: '4' }, { label: 'Canteen food', value: '4' }]


    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
            case 'inprogress':
                return {
                    backgroundColor: '#FFE5B4',
                    textColor: '#8B4513',
                };
            case 'resolved':
                return {
                    backgroundColor: '#C1F0C1',
                    textColor: '#06470C',
                };
            default:
                return {
                    backgroundColor: '#E0E0E0',
                    textColor: '#333',
                };
        }
    };

    useEffect(()=>{
        complaints(props.hostel[0].hostelId,commonContext.getToken).then(r=>{
            setComplaintsList(r?.data?.content)
            console.log(r)
        })

        assignAmenities(props.hostel[0].hostelId,commonContext.getToken).then(r=>{
            setAssignedAmenity(r.data)
            console.log(r)
        })

        unassignAmeties(props.hostel[0].hostelId,commonContext.getToken).then(r=>{
            setUnasignedAmenities(r.data)
            console.log(r)
        })
    },[])

    useEffect(() => {
        console.log(commonContext.Complaint)
        if (commonContext.Complaint == 'complaint') {
            firstclick('Complaint')
            console.log('nothissdfsd')
        }
    }, [commonContext.Complaint])

    function firstclick(value) {
        console.log(value)
        setselectfield(value)
    }
    function secondclick(value) {
        console.log(value)
        setselectfield(value)
        commonContext.Amenities('amenities')
    }

    // const handleOpen = useCallback((complaint) => {
    //     sheetRef.current?.snapToIndex();
    //     console.log('nothing happing')
    //     console.log(sheetRef)
    //     setselectComplaint(complaint)
    // }, []);

    // const bottomOpen = (complaint) => {
    //     console.log(complaint)
    //     setModalVisible(true)
    //     setselectComplaint(complaint)

    // }
    const bottomClose = () => {
        setModalVisible(false)
        setComment(false)
    }
   

    const sendclick = () => {
        const data = {
            id: 4, person: 'you', comment: commentMessage, date: '24 Jan -12.35pm'
        }
        setCommentNote(data)
    }
    const uploadimage = async () => {
        try {
            result = await launchImageLibrary({
                mediaTypes: 'photo',
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });
            console.log(result)
        } catch (error) {
            console.log(error)

        }


    }
    return <View style={{ flex: 1, position: 'relative' }}>
        <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => firstclick("Complaint")} style={{
                backgroundColor: selectedfield === "Complaint" ? '#1E45E1' : 'white',
                flex: 1,
                borderRadius: 10,
                paddingTop: 13,
                paddingBottom: 13,
                borderColor: '#f4f4f4',
                borderWidth: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 5,
            }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ borderWidth: 1, borderRadius: 4, paddingTop: 4, paddingBottom: 4, paddingLeft: 4, paddingRight: 4, backgroundColor: '#ffff', borderColor: '#ffffff' }}>
                        <Image source={MessagePic} style={{ tintColor: selectedfield === 'Complaint' ? '#1E45E1' : "#4B4B4B", width: 18.67, height: 17.8 }} />
                    </View>

                    <Text style={{ color: selectedfield == 'Complaint' ? "white" : 'black', fontSize: 16, fontWeight: '400', marginLeft: 10 }}>Complaints</Text>
                </View>

            </TouchableOpacity>
            <TouchableOpacity onPress={() => secondclick('Amenities')} style={{
                backgroundColor: selectedfield === 'Amenities' ? '#1E45E1' : 'white',
                flex: 1,
                borderRadius: 10,
                borderColor: '#f4f4f4',
                paddingTop: 13,
                paddingBottom: 13,
                borderWidth: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 5,
            }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ borderWidth: 1, borderRadius: 4, paddingTop: 4, paddingBottom: 4, paddingLeft: 4, paddingRight: 4, backgroundColor: '#ffff', borderColor: '#ffffff' }}>
                        <Image source={AmenitiesPic} style={{ width: 18, height: 17, tintColor: selectedfield === 'Amenities' ? '#1E45E1' : '#4B4B4B' }} />
                    </View>
                    <Text style={{ color: selectedfield == 'Amenities' ? "white" : 'black', fontSize: 16, fontWeight: '400', marginLeft: 10 }}>Amenities</Text>
                </View>
            </TouchableOpacity>
        </View>

        {selectedfield ==  'Complaint'  ? complaintsList.length>0? <FlatList showsVerticalScrollIndicator={false}
            style={{ marginTop: 10, position: 'relative' }}
            keyExtractor={(item) => item.complaintId}
            data={complaintsList}
            renderItem={({ item }) => {
                const { backgroundColor, textColor } = getStatusColor(item.status);
                return <View key={item.complaintId}  >
                <TouchableOpacity onPress={() => props.onOpen(item,1)}>
                        <View style={{
                            borderWidth: 1, borderRadius: 8, marginTop: 10, flexDirection: 'row',
                            justifyContent: 'space-between', borderColor: '#f4f4f4',
                        }}>
                            <View style={{ paddingLeft: 20, paddingTop: 20, paddingBottom: 20, flex: 1 }}>
                                <Text numberOfLines={1} ellipsizeMode="tail"
                                    style={{ fontSize: 16, fontWeight: '600', maxWidth: '90%' }}>
                                    {item.description}
                                </Text>

                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                                    <Image source={require('../../assets/Images/bill.png')}
                                        style={{ width: 16, height: 16 }} />
                                    <Text style={{ marginLeft: 8, fontSize: 14, fontWeight: '400' }}>
                                        {item.complaintTypeName}
                                    </Text>
                                </View>
                            </View>

                            <View style={{ justifyContent: 'flex-end', paddingRight: 10, paddingTop: 20, paddingBottom: 16 }}>
                                <Text style={{ bottom: 10, color: '#9C9C9C', fontSize: 12, fontWeight: '400' }}>
                                    {item.complaintDate}
                                </Text>
                                <View
                                    style={{ borderRadius: 15, paddingHorizontal: 10, paddingVertical: 3, backgroundColor: backgroundColor, marginTop: 2 }}>
                                    <Text style={{ color: textColor }}>{item.status}</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>

                </View>

            }} /> : <Text>No Complaints Found</Text>  : 
            <ScrollView
                style={{ marginTop: 10 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 80 }}
            >
                {/* MY AMENITIES */}
                <View style={{ paddingTop: 10 }}>
                    <Text style={{ fontSize: 14, fontWeight: '400' }}>My Amenities</Text>
                </View>

                <FlatList
                    data={assignedAmenities}
                    keyExtractor={(item) => item.amenityId}
                    scrollEnabled={false} // important! to avoid conflict with parent ScrollView
                    renderItem={({ item }) => (
                        <View style={{ paddingTop: 10 }}>
                            <TouchableOpacity onPress={()=>props.onAmenities(item,0,'My-Amenities')}>
                                 <View
                                style={{
                                    paddingTop: 10,
                                    paddingBottom: 12,
                                    borderWidth: 1,
                                    borderRadius: 10,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: 14,
                                    alignItems: 'center',
                                    borderColor: '#edf3ff',
                                }}
                            >
                                <View>
                                    <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.amenityName}</Text>
                                    <View style={{ paddingTop: 7 }}>
                                        <Text style={{ fontSize: 14, color: '#4B4B4B' }}>{'\u20B9'}{item.amenityAmount}/month</Text>
                                    </View>
                                </View>
                                <Image source={RightDirection} style={{ width: 26, height: 26 }} />
                            </View>

                            </TouchableOpacity>
                           
                        </View>
                    )}
                />

                {/* AVAILABLE AMENITIES */}
                <View style={{ paddingTop: 12 }}>
                    <Text style={{ fontSize: 14, fontWeight: '400' }}>Available Amenities</Text>
                </View>

                <FlatList
                    data={unassignedAmenities}
                    keyExtractor={(item) => item.amenityId}
                    scrollEnabled={false} // disable inner scrolling
                    renderItem={({ item }) => (
                        <View style={{ paddingTop: 10 }}>
                            <TouchableOpacity onPress={()=>props.onAmenities(item,0,'available')}>
                                 <View
                                style={{
                                    paddingTop: 11,
                                    paddingBottom: 13,
                                    borderWidth: 1,
                                    borderRadius: 10,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: 14,
                                    alignItems: 'center',
                                    borderColor: '#edf3ff',
                                }}
                            >
                                <Text style={{ fontSize: 16, fontWeight: '500' }}>{item.amenityName}</Text>
                                <Image source={AddSquare} style={{ width: 22, height: 22 }} />
                            </View>

                            </TouchableOpacity>
                           
                        </View>
                    )}
                />
            </ScrollView>}


        {/* {selectedfield === list2.length ? (
            
        ) : null} */}




        {selectedfield == 'Complaint' && <View style={{ position: 'absolute', bottom: 35, right: -3 }}>
            <TouchableOpacity onPress={()=>props.onSheet(0)}>
                <Image source={AddComplaint} style={{ width: 48, height: 47 }} />
            </TouchableOpacity>
        </View>}

        {/* // ----Modal----- */}
      

        


    </View>





}
const style = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        borderColor: '#e5e5e5',
        paddingHorizontal: 8,
        marginTop: 10
    },
})


export default Services;
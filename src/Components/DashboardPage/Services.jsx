import React, { useState, useEffect, useCallback, useRef, useMemo, useContext } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, SafeAreaView, FlatList, Pressable, Modal, TouchableWithoutFeedback, TextInput, Button } from "react-native";
import AddComplaint from '../../assets/Images/addComplaint.png'
import RightDirection from '../../assets/Images/direction-right.png'
import AddSquare from '../../assets/Images/add-square.png'
import MessagePic from '../../assets/Images/Group (1).png'
import AmenitiesPic from '../../assets/Images/amenities.png'
import { UsersContext } from "../../Context/UserContext";
import { complaints, getAmenitiesList } from "../../Action/HostelAction";
import NoResultPic from '../../assets/Images/NoResultPic.png'
import { LoginContexts } from "../../Context/LoginContext";
import { compliantContexts } from "../../Context/ComplaintContext";
import { amenitiesContexts } from "../../Context/AmenitiesContext";
import { useFocusEffect } from "@react-navigation/native";

function Services(props) {

    const commonContext = useContext(UsersContext)
    const loginContext = useContext(LoginContexts)
    const complaintContext = useContext(compliantContexts)
    const amenitiesContext = useContext(amenitiesContexts)

    console.log(commonContext.Complaint)
    console.log(props)
    const [complaintsList, setComplaintsList] = useState([])
    const [selectedfield, setselectfield] = useState(0);
    const [modulevisible, setModalVisible] = useState(false)
    const [comment, setComment] = useState(false)

    // const [assignedAmenities, setAssignedAmenity] = useState([])
    // const [unassignedAmenities, setUnasignedAmenities] = useState([])




    useEffect(() => {
        firstclick('Complaint')
    }, [])

    const noAmenities =
        (!amenitiesContext.getAssignedAmenities || amenitiesContext.getAssignedAmenities.length === 0) &&
        (!amenitiesContext.getUnassignedAmenities || amenitiesContext.getUnassignedAmenities.length === 0);


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

    const fetchServiceData = () => {
        complaints(commonContext.getHostelDetail.hostelId, loginContext.getToken)
            .then(r => {
                console.log("Complaints API:", r);
                complaintContext.updateComplaintList(r?.data?.content);
            })
            .catch(err => console.log("Error:", err));

        getAmenitiesList(commonContext.getHostelDetail.hostelId, loginContext.getToken).then(r => {
            amenitiesContext.updateAssignedAmenities(r.data.assignedAmenities)
            amenitiesContext.updateUnassginedAmenites(r.data.unassignedAmenities)
        })
    };

    useEffect(()=>{
        fetchServiceData();
    },[])
    // useFocusEffect(
    //     useCallback(() => {
    //         fetchServiceData();

    //         const intervalId = setInterval(() => {
    //             fetchServiceData();
    //         }, 6000)

    //         return () => clearInterval(intervalId)
    //     }, [])
    // )


    useEffect(() => {
        console.log(commonContext.Complaint)
        if (commonContext.Complaint == 'complaint') {
            firstclick('Complaint')
            console.log('nothissdfsd')
        }
    }, [commonContext.Complaint])

    function firstclick(value) {
        setselectfield(value)
    }
    function secondclick(value) {
        setselectfield(value)
        commonContext.Amenities('amenities')
    }

    const bottomClose = () => {
        setModalVisible(false)
        setComment(false)
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

        {selectedfield == 'Complaint' ? complaintContext.getComplaintList?.length > 0 ? <FlatList showsVerticalScrollIndicator={false}
            style={{ marginTop: 10, position: 'relative', marginBottom: 10 }}
            keyExtractor={(item) => item.complaintId}
            data={complaintContext.getComplaintList}
            renderItem={({ item }) => {
                const { backgroundColor, textColor } = getStatusColor(item.status);
                return <View key={item.complaintId}>
                    <TouchableOpacity onPress={() => props.onOpen(item)}
                        style={style.complaintStyle}>
                        {/* LEFT SIDE */}
                        <View style={{ flex: 1, paddingRight: 10 }}>
                            <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={{
                                    fontSize: 16, fontWeight: '600', color: '#1C1C1C', marginBottom: 10
                                }}
                            >
                                {item.description}
                            </Text>

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image
                                    source={require('../../assets/Images/bill.png')}
                                    style={{ width: 18, height: 18, tintColor: '#1E45E1' }}
                                />
                                <Text
                                    style={{
                                        marginLeft: 8, fontSize: 14, fontWeight: '400', color: '#505050',
                                    }}
                                >
                                    {item.complaintTypeName}
                                </Text>
                            </View>
                        </View>

                        {/* RIGHT SIDE */}
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text
                                style={{
                                    fontSize: 12, color: '#A4A4A4', marginBottom: 8, fontWeight: '400',
                                }}
                            >
                                {item.complaintDate}
                            </Text>

                            <View
                                style={{
                                    backgroundColor: backgroundColor,
                                    paddingVertical: 4,
                                    paddingHorizontal: 12,
                                    borderRadius: 20,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 12,
                                        fontWeight: '500',
                                        color: textColor,
                                    }}
                                >
                                    {item.status}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>


            }} /> : <View style={style.noResult}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image
                    source={NoResultPic}
                    style={{ width: 324, height: 221, resizeMode: 'contain', marginBottom: 20, }}
                />
                <Text style={{ fontSize: 22, fontWeight: '700', color: '#000', marginBottom: 8, }}>
                    No Results Found!
                </Text>
                <Text style={{ fontSize: 15, color: '#555', textAlign: 'center', width: 260, lineHeight: 18, }}>
                    Try adjusting your search or filters to see more options.
                </Text>
            </View>
        </View>

            :
            noAmenities ? (
                <View style={style.noResult}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            source={NoResultPic}
                            style={{ width: 324, height: 221, resizeMode: 'contain', marginBottom: 20 }}
                        />
                        <Text style={{ fontSize: 22, fontWeight: '700', color: '#000', marginBottom: 8 }}>
                            No Results Found!
                        </Text>
                        <Text style={{ fontSize: 15, color: '#555', textAlign: 'center', width: 260, lineHeight: 18 }}>
                            Try adjusting your search or filters to see more options.
                        </Text>
                    </View>
                </View>
            ) : (
                <ScrollView
                    style={{ marginTop: 10 }}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 80 }}
                >
                    {/* MY AMENITIES */}
                    {amenitiesContext.getAssignedAmenities?.length > 0 && (
                        <>
                            <View style={{ paddingTop: 10 }}>
                                <Text style={{ fontSize: 14, fontWeight: '400' }}>My Amenities</Text>
                            </View>

                            <FlatList
                                data={amenitiesContext.getAssignedAmenities}
                                keyExtractor={(item) => item.amenityId}
                                scrollEnabled={false}
                                renderItem={({ item }) => (
                                    <View style={{ paddingTop: 10 }}>
                                        <TouchableOpacity onPress={() => props.onAmenities(item, 'My-Amenities')}>
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
                                                    <Text style={{ fontSize: 16, fontWeight: '600' }}>
                                                        {item.amenityName}
                                                    </Text>
                                                    <View style={{ paddingTop: 7 }}>
                                                        <Text style={{ fontSize: 14, color: '#4B4B4B' }}>
                                                            {'\u20B9'}{item.amenityAmount}/month
                                                        </Text>
                                                    </View>
                                                </View>
                                                <Image source={RightDirection} style={{ width: 26, height: 26 }} />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </>
                    )}

                    {/* AVAILABLE AMENITIES */}
                    {amenitiesContext.getUnassignedAmenities?.length > 0 && (
                        <>
                            <View style={{ paddingTop: 12 }}>
                                <Text style={{ fontSize: 14, fontWeight: '400' }}>Available Amenities</Text>
                            </View>

                            <FlatList
                                data={amenitiesContext.getUnassignedAmenities}
                                keyExtractor={(item) => item.amenityId}
                                scrollEnabled={false}
                                renderItem={({ item }) => (
                                    <View style={{ paddingTop: 10 }}>
                                        <TouchableOpacity onPress={() => props.onAmenities(item, 'available')}>
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
                        </>
                    )}
                </ScrollView>
            )
        }




        {selectedfield == 'Complaint' && <View style={{ position: 'absolute', bottom: 35, right: -3 }}>
            <TouchableOpacity onPress={() => props.onSheet()}>
                <Image source={AddComplaint} style={{ width: 48, height: 47 }} />
            </TouchableOpacity>
        </View>}
    </View>
}
const style = StyleSheet.create({

    complaintStyle: {
        borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 12, marginTop: 12, paddingVertical: 16,
        paddingHorizontal: 18, backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08, shadowRadius: 4, elevation: 2, flexDirection: 'row', justifyContent: 'space-between',
    },
    noResult: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 20 }

})
export default Services;
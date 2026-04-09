import React, { useRef, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { View, Text, Image, FlatList, TouchableOpacity, ScrollView, StyleSheet, Button, BackHandler, Platform, Dimensions, PanResponder, Animated } from "react-native";
import Swiper from "react-native-swiper";
import LinearGradient from "react-native-linear-gradient";
import Electricity from '../../assets/Images/electricity.png';
import Frame from '../../assets/Images/Frame.png'
import FrameAdd from '../../assets/Images/Frameadd.png'
import Receipt from '../../assets/Images/receipt.png'
import { TabActions, useFocusEffect, useNavigation } from "@react-navigation/native";
import { Screen } from "react-native-screens";
import { UsersContext } from "../../Context/UserContext";
import { hostelDetails } from "../../Action/HostelAction";
import { LoginContexts } from "../../Context/LoginContext";
import requestProfile from '../../assets/Images/profile-2user.png'
import { getRequestRaised } from "../../Action/CustomerAction";
import Clippath from '../../assets/Images/Clippath.png'
import RoomIcon from "../../assets/Images/Room.png"
import BedIcon from "../../assets/Images/Bed_Icon.png"
import ExclamationCircle from "../../assets/Images/ExclamationCircle.png"
import callIcon from "../../assets/Images/call.png"
import WaveIcon from '../../assets/Images/HiIcon.png'
import { SkeletonLoader } from "../ToastFile/SkeletonLoader";





function MyStay(props) {

    const context = useContext(UsersContext);
    const loginContext = useContext(LoginContexts)
    const { width } = Dimensions.get('window');


    const [complaints, setComplaints] = useState([])
    const [rentBill, setRentBill] = useState([])
    const [request, setRequest] = useState([])

    const [isLoading,setIsLoading]=useState(false)

    console.log(context.getRequestRaised)

    const announcements = [
        { id: 1, text: 'Hello water maintenance on 5th June' },
        { id: 2, text: 'field2' },
        { id: 3, text: 'field3' }
    ];

    useEffect(()=>{
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
        }, 500);
    },[])
    const fetchMystayData = () => {
        hostelDetails(context.getHostelDetail.hostelId, loginContext.getToken).then(r => {
            console.log(r.data)
            setComplaints(r.data?.complaints)
            setRentBill(r.data.currentMonthBills)
            context.updateCurrentMonthBills(r.data.currentMonthBills)
            context.updatePreviousMonth(r.data.previousMonthBills)
        })

        getRequestRaised(context.getHostelDetail.hostelId, loginContext.getToken).then(r => {
            console.log(r)
            context.updateRequestRaised(r.data)
        })
    }
    useEffect(() => {
        fetchMystayData();
    }, [])

    // useFocusEffect(
    //     useCallback(()=>{
    //         fetchMystayData();

    //         const intervalId=setInterval(()=>{
    //             fetchMystayData();
    //         },6000)
    //         return ()=>clearInterval(intervalId)
    //     },[])
    // )


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


    function viewallclick() {
        props.jumpTo('services')
        context.jumpComplain('complaint')

    }

    function complaintsClick() {
        props.jumpTo('services')
        context.jumpComplain('complaint')
    }

    return (
        <>
     <SkeletonLoader loading={isLoading}>
            {context.getCustomerDetail?.bookingDetails?.currentStatus === "BOOKED" && (
                <ScrollView style={{ backgroundColor: '#ffffff', flex: 1, width: '100%' }}>

                    <View style={{ height: 130, marginTop: 15, marginRight: width * 0.10, overflow: 'hidden', width: width * 0.97 }}>
                        <View style={{ marginRight: 10, flex: 1 }}>
                            <Swiper loop showsPagination
                                index={0} paginationStyle={{ width: "100%", paddingRight: 22 }}
                                style={{ borderRadius: 10 }} >


                                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#10267B', '#0227B5']}
                                    style={{ width: width * 0.9, height: '65%', borderRadius: 10, paddingHorizontal: 20, paddingTop: 10 }} >
                                    <View style={{flexDirection:'row',alignItems:'center'}}>
                                         <Text style={{ color: '#ffffff', fontSize: 17, lineHeight: 24 }}>
                                        Hi, {context.getCustomerDetail?.firstName} {context.getCustomerDetail?.lastName}
                                    </Text>
                                    <Image source={WaveIcon} style={{width:18.13,height:18.13,marginLeft:8}}/>
                                    </View>
                                   

                                    <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: 400, lineHeight: 24, marginTop: 10 }}>
                                        Your Bed have been reserved
                                    </Text>
                                </LinearGradient>
                            </Swiper>
                        </View>
                    </View>

                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 14, fontWeight: 400, color: '#3C3C4399' }}>
                                Room No/ Bed No
                            </Text>

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={RoomIcon} style={{ width: 17, height: 17, resizeMode: 'contain' }} />
                                <Text style={{ fontSize: 14, fontWeight: 400, marginRight: 4, marginLeft: 3 }}>
                                    {context.getCustomerDetail?.bookingDetails?.roomName}</Text>

                                <Image source={BedIcon} style={{ width: 17, height: 17, resizeMode: 'contain', marginLeft: 4 }} />
                                <Text style={{ fontSize: 14, fontWeight: 400, marginLeft: 3 }}>
                                    {context.getCustomerDetail?.bookingDetails?.bedName}
                                </Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 15 }}>
                            <Text style={{ fontSize: 14, fontWeight: 400, color: '#3C3C4399' }}>
                                Check in date
                            </Text>


                            <Text style={{ fontSize: 14, fontWeight: 600 }}>
                                {context.getCustomerDetail?.expJoiningDate}
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 15 }}>
                            <Text style={{ fontSize: 14, fontWeight: 400, color: '#3C3C4399' }}>
                                Room Type
                            </Text>


                            <Text style={{ fontSize: 14, fontWeight: 600 }}>
                                N/A
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 15 }}>
                            <Text style={{ fontSize: 14, fontWeight: 400, color: '#3C3C4399' }}>
                                PG Contact Number
                            </Text>


                            <Text style={{ fontSize: 14, fontWeight: 600 }}>
                                {context.getCustomerDetail?.hostel?.mobile ? `+91 ${context.getCustomerDetail?.hostel?.mobile}` : "N/A"}
                            </Text>
                        </View>
                    </View>

                    <View style={{
                        backgroundColor: '#F5F9FF', paddingVertical: 15, flexDirection: 'row', alignItems: 'center',
                        borderRadius: 5, paddingRight: 25, paddingLeft: 14, marginTop: 20
                    }}>
                        <Image source={ExclamationCircle} style={{ width: 14, height: 14, resizeMode: 'contain' }} />
                        <Text style={{ fontSize: 12, fontWeight: 400, color: '#1E45E1', marginLeft: 7, lineHeight: 20 }}>
                            Tenants have beed must follow the PG Rules and checkin on date properly</Text>
                    </View>

                    <TouchableOpacity style={{
                        backgroundColor: '#1E45E1', borderRadius: 8, justifyContent: 'center', alignItems: 'center',
                        marginTop: 25, flexDirection: 'row', paddingVertical: 20, paddingHorizontal: 40,marginHorizontal:10
                    }}>
                        <Image source={callIcon} style={{ width: 20, height: 20, tintColor: '#ffffff' }} />
                        <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Medium', marginLeft: 8, color: '#ffffff',marginLeft:10 }}>
                            Contact Hostel Admin</Text>
                    </TouchableOpacity>
                </ScrollView>
            )}

            {context.getCustomerDetail?.bookingDetails?.currentStatus != "BOOKED" && (
                <ScrollView style={{ backgroundColor: '#ffffff', flex: 1, width: '100%' }}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}>

                    {/* <View style={{height:130, marginTop: 15,marginRight:width*0.10,overflow: 'hidden', width: width*0.97  }}>
            <View style={{marginRight:10,flex:1}}> 
            <Swiper loop showsPagination
                index={0} paginationStyle={{ bottom: 10,width: "100%",paddingRight:22}}
                removeClippedSubviews={false}
                dotStyle={{ width: 10, height: 10, borderRadius: 5, backgroundColor: 'transparent', borderWidth: 1.5, 
                           borderColor: '#CFCFCF', marginHorizontal: 5,alignItems:'center',justifyContent:'center' }}
                activeDotColor="#1E45E1" 
                style={{ borderRadius: 10 }} >

                {announcements.map((item) =>
                (<LinearGradient key={item.id} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#10267B', '#0227B5']}
                    style={{ width: width * 0.9, height: '75%', borderRadius: 10, paddingHorizontal: 20, paddingTop: 10 }} >
                    <Text style={{ color: '#ffffff', fontSize: 17, lineHeight: 24 }}>
                        {item.text}
                    </Text>
                </LinearGradient>))}
            </Swiper>
            </View>
        </View> */}
                    {console.log(context?.getCustomerDetail)}

                    {context?.getCustomerDetail?.bookingDetails?.currentStatus === "BOOKED" && (
                        <View style={{ flex: 1 }}>
                            <Text>hfhf</Text>
                        </View>
                    )}

                    <View style={style.wrapper}>
                        <View style={style.row}>

                            <View style={style.cardboc}>
                                <View style={style.content}>
                                    <Text style={style.amount} numberOfLines={1}>
                                        ₹ {context.getPreviousMonthBills?.eb ?? 'N/A'}
                                    </Text>

                                    <Text style={style.subText}>
                                        Last Month EB Bill
                                    </Text>

                                    <View style={style.inlineRow}>
                                        <Text style={style.label}>Paid On:</Text>
                                        <Text style={style.value} numberOfLines={1}>
                                            {context.getPreviousMonthBills?.invoiceGeneratedDate ?? 'N/A'}
                                        </Text>
                                    </View>
                                </View>

                                <Image source={Electricity} style={style.icon} />
                            </View>

                            <View style={style.cardboc}>
                                <View style={style.content}>
                                    <Text style={style.amount} numberOfLines={1}>
                                        ₹ {context.getPreviousMonthBills?.rent ?? 'N/A'}
                                    </Text>

                                    <Text style={style.subText}>
                                        Last Month Rent
                                    </Text>

                                    <View style={style.inlineRow}>
                                        <Text style={style.label}>Paid On:</Text>
                                        <Text style={style.value} numberOfLines={1}>
                                            {context.getPreviousMonthBills?.invoiceGeneratedDate ?? 'N/A'}
                                        </Text>
                                    </View>
                                </View>

                                <Image source={Frame} style={style.icon} />
                            </View>

                        </View>

                        <View style={style.row}>

                            <View style={style.cardboc}>
                                <View style={style.content}>
                                    <Text style={style.amount} numberOfLines={1}>
                                        ₹ {context.getCurrentMonthBills?.eb ?? 'N/A'}
                                    </Text>

                                    <Text style={style.highlightText}>
                                        New Bill Generated
                                    </Text>

                                    <View style={style.inlineRow}>
                                        <Text style={style.label}>Due date:</Text>
                                        <Text style={style.value} numberOfLines={1}>
                                            {context.getCurrentMonthBills?.invoiceDueDate ?? 'N/A'}
                                        </Text>
                                    </View>
                                </View>

                                <Image source={Electricity} style={style.icon} />
                            </View>

                            <View style={style.cardboc}>
                                <View style={style.content}>
                                    <Text style={style.amount} numberOfLines={1}>
                                        ₹ {context.getCurrentMonthBills?.rent ?? 'N/A'}
                                    </Text>

                                    <Text style={style.highlightText}>
                                        New Bill Generated
                                    </Text>

                                    <View style={style.inlineRow}>
                                        <Text style={style.label}>Due date:</Text>
                                        <Text style={style.value} numberOfLines={1}>
                                            {context.getCurrentMonthBills?.invoiceDueDate ?? 'N/A'}
                                        </Text>
                                    </View>
                                </View>

                                <Image source={Frame} style={style.icon} />
                            </View>

                        </View>
                    </View>



                    {/* <View style={{marginTop:30}}>
            <View style={{ flexDirection: 'row',flex:1}}>

                <View style={style.EbContainer}>
                    <View> 
                        <Text style={{ fontSize: 22, fontWeight: '700', color: '#1C1C1E' }}>
                            {'\u20B9'} {context.getPreviousMonthBills?.eb != null ? context.getPreviousMonthBills?.eb : "N/A"}
                        </Text>

                        <Text style={{ fontSize: 13, fontWeight: '400', color: '#AEAEB2', marginTop: 5 }}>
                            Last Month EB Bill
                        </Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <Text style={{ fontSize: 11, fontWeight: '400', color: '#8E8E93' }}>
                                Paid On:
                            </Text>
                            <Text style={{ fontSize: 12, fontWeight: '600', marginLeft: 4 }}>
                                {context.getPreviousMonthBills?.invoiceGeneratedDate != null ? context.getPreviousMonthBills?.invoiceGeneratedDate : "N/A"}
                            </Text>
                        </View>
                    </View>

                    <View style={{ paddingRight: 10, marginTop: -12}}>
                        <Image source={Electricity} style={{ width: 28, height: 28 }} />
                    </View>
                </View>

                <View style={style.container}>
                    <View>
                        <Text style={{ fontSize: 22, fontWeight: '700', color: '#1C1C1E' }}>
                            {'\u20B9'} {context.getPreviousMonthBills?.rent != null ? context.getPreviousMonthBills?.rent : "N/A"}
                        </Text>

                        <Text style={{ fontSize: 13, fontWeight: '400', color: '#AEAEB2', marginTop: 5 }}>
                            Last Month Rent
                        </Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <Text style={{ fontSize: 11, fontWeight: '400', color: '#8E8E93' }}>Paid On:</Text>
                            <Text style={{ fontSize: 12, fontWeight: '600', marginLeft: 4 }}>
                                {context.getPreviousMonthBills?.invoiceGeneratedDate != null ? context.getPreviousMonthBills?.invoiceGeneratedDate : "N/A"}
                            </Text>
                        </View>
                    </View>

                    <View style={{ paddingRight: 10, marginTop: -12 }}>
                        <Image source={Frame} style={{ width: 28, height: 28 }} />
                    </View>
                </View>

            </View>

            <View style={{ flexDirection: 'row', paddingTop: 15 }}>

                <View style={style.EbContainer}>
                    <View>
                        <Text style={{ fontSize: 22, fontWeight: '700', color: '#1C1C1E' }}>
                            {'\u20B9'} {context.getCurrentMonthBills?.eb !=null?context.getCurrentMonthBills?.eb:'N/A'}
                        </Text>

                        <Text style={{ fontSize: 13, fontWeight: '500', color: '#FF9500', marginTop: 5 }}>
                            New Bill Generated
                        </Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <Text style={{ fontSize: 11, fontWeight: '400', color: '#8E8E93' }}>Due date:</Text>
                            <Text style={{ fontSize: 12, fontWeight: '600', marginLeft: 4 }}>{context.getCurrentMonthBills?.invoiceDueDate}</Text>
                        </View>
                    </View>

                    <View style={{ paddingRight: 10, marginTop: -12 }}>
                        <Image source={Electricity} style={{ width: 28, height: 28 }} />
                    </View>
                </View>

                <View style={style.container}>
                    <View>
                        <Text style={{ fontSize: 22, fontWeight: '700', color: '#1C1C1E' }}>
                            {'\u20B9'} {context.getCurrentMonthBills?.paidAmount !=null?context.getCurrentMonthBills?.paidAmount:'N/A'}
                        </Text>

                        <Text style={{ fontSize: 13, fontWeight: '500', color: '#FF9500', marginTop: 5 }}>
                            New Bill Generated
                        </Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <Text style={{ fontSize: 11, fontWeight: '400', color: '#8E8E93' }}>Due date:</Text>
                            <Text style={{ fontSize: 12, fontWeight: '600', marginLeft: 4 }}>{context.getCurrentMonthBills?.invoiceDueDate}</Text>
                        </View>
                    </View>

                    <View style={{ paddingRight: 10, marginTop: -12 }}>
                        <Image source={Frame} style={{ width: 28, height: 28 }} />
                    </View>
                </View>

            </View>
        </View> */}



                    <View>
                        <View style={{ marginTop: 20 }}>
                            <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Semibold' }}>Quick Links</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={() => props.onSheet()}
                                style={{
                                    borderWidth: 1, borderRadius: 10, flex: 1, justifyContent: 'center',
                                    alignItems: 'center', marginRight: 10, padding: 10, borderColor: '#EFF2FF',
                                }}>
                                <View style={{ marginBottom: 10 }}>
                                    <Image source={Receipt} style={{ width: 26, height: 26 }} />
                                </View>
                                <Text style={{ fontSize: 10, marginTop: 5, fontFamily: 'Gilroy-Medium' }}>Complaint</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => props.onRequestBedChange()}
                                style={{
                                    borderWidth: 1, borderRadius: 10, flex: 1, justifyContent: 'center', alignItems: 'center',
                                    marginLeft: 5, padding: 10, borderColor: '#EFF2FF'
                                }}>
                                <View>
                                    <Image source={FrameAdd} style={{ width: 24, height: 24 }} />
                                </View>
                                <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 5 }}>
                                    <Text style={{ fontSize: 10, fontFamily: 'Gilroy-Regular' }}>Request</Text>
                                    <Text style={{ fontSize: 10, fontFamily: 'Gilroy-Regular' }}>Bed change</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                    </View>

                    <View style={{ paddingTop: 15 }}>
                        <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Semibold' }}>Request</Text>


                        {context.getRequestRaised && context.getRequestRaised.length > 0 ?

                            context.getRequestRaised.map(i => {
                                return <View key={i?.requestId}
                                    style={{
                                        borderWidth: 1, borderRadius: 10, flexDirection: 'row', paddingVertical: 15,
                                        borderColor: '#EFF2FF', justifyContent: 'space-between', marginTop: 10
                                    }}>
                                    <View style={{ paddingLeft: 12, paddingRight: 10,flex:1 }}>
                                        <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Semibold', marginBottom: 5 }}>
                                            {i.type}
                                        </Text>

                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                            <Image source={Clippath} style={{ width: 20, height: 20 }} />

                                            <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', marginLeft: 10 }}>
                                                {i.reason}</Text>
                                        </View>

                                    </View>

                                    <View style={{ paddingRight: 10 }}>
                                        <Text style={{ color: '#9C9C9C', fontSize: 11, fontFamily: 'Gilroy-Medium', marginBottom: 5 }}>
                                            {i.requestedDateDisplay}
                                        </Text>

                                        <Text style={{
                                            fontSize: 12, fontFamily: 'Gilroy-Medium', paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#FFF8EC',
                                            color: '#FF9500', borderRadius: 28, textAlign: 'center', textAlignVertical: 'center', marginTop: 8
                                        }}>
                                            {i.status}
                                        </Text>
                                    </View>
                                </View>
                            })
                            :
                            <View style={{
                                borderWidth: 1, borderRadius: 10, flexDirection: 'row', paddingVertical: 15, borderColor: '#EFF2FF',
                                justifyContent: 'space-between', marginTop: 10
                            }}>
                                <View style={{ paddingLeft: 12, paddingRight: 10 }}>
                                    <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Semibold', marginBottom: 5 }}>
                                        No Request yet
                                    </Text>
                                    <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', color: '#4B4B4B', marginTop: 5 }}>
                                        You have'nt raised any request</Text>
                                </View>

                                <Image source={requestProfile} style={{ width: 44, height: 44, marginRight: 12, marginTop: 5 }} />
                            </View>}

                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12 }}>
                        <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Semibold' }}>Complaints</Text>
                        <TouchableOpacity onPress={viewallclick}>
                            <Text style={{ color: '#1E45E1', marginRight: 2, fontSize: 14, fontFamily: 'Gilroy-Semibold' }}>view all</Text>
                        </TouchableOpacity>

                    </View>

                    {complaints && complaints?.length > 0 ?
                        complaints?.map(i => {
                            const { backgroundColor, textColor } = getStatusColor(i.status)

                            return (
                                <View key={i.complaintId}>

                                    <TouchableOpacity onPress={() => props.onViewComplaint(i.complaintId)}
                                        style={{
                                            borderWidth: 1, borderRadius: 12, marginTop: 12, flexDirection: 'row', justifyContent: 'space-between',
                                            borderColor: '#EFF2FF', backgroundColor: '#FFFFFF',
                                        }}>

                                        {/* LEFT SECTION */}
                                        <View style={{
                                            paddingLeft: 20, paddingTop: 18, paddingBottom: 20, flex: 1
                                        }}>
                                            <Text
                                                numberOfLines={1}
                                                ellipsizeMode="tail"
                                                style={{
                                                    fontSize: 17, fontFamily: 'Gilroy-Semibold', color: '#1C1C1E', maxWidth: '90%'
                                                }}
                                            >
                                                {i.description}
                                            </Text>

                                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                                                <Image
                                                    source={require('../../assets/Images/bill.png')}
                                                    style={{ width: 18, height: 18 }}
                                                />
                                                <Text style={{
                                                    marginLeft: 8, fontSize: 14, fontFamily: 'Gilroy-Medium', color: '#6C6C70'
                                                }}>
                                                    {i.complaintTypeName}
                                                </Text>
                                            </View>
                                        </View>

                                        {/* RIGHT SECTION */}
                                        <View style={{
                                            justifyContent: 'center', alignItems: 'flex-end', paddingRight: 18, paddingTop: 18, paddingBottom: 20
                                        }}>
                                            <Text style={{
                                                color: '#9C9C9C', fontSize: 12, fontFamily: 'Gilroy-Medium', marginBottom: 18
                                            }}>
                                                {i?.complaintDateDisplay}
                                            </Text>

                                            <View style={{
                                                borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, backgroundColor: backgroundColor
                                            }}>
                                                <Text style={{ fontSize: 12, fontFamily: 'Gilroy-Medium', color: textColor }}>
                                                    {i.status}
                                                </Text>
                                            </View>
                                        </View>

                                    </TouchableOpacity>

                                </View>
                            )
                        }) : <View style={{
                            borderWidth: 1, borderRadius: 10, flexDirection: 'row', paddingVertical: 15, borderColor: '#EFF2FF',
                            justifyContent: 'space-between', marginTop: 10
                        }}>
                            <View style={{ paddingLeft: 12, paddingRight: 10 }}>
                                <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Semibold', marginBottom: 5 }}>
                                    No Complaints yet
                                </Text>
                                <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', color: '#4B4B4B', marginTop: 5 }}>
                                    You have'nt raised any Complaints</Text>
                            </View>

                            <Image source={requestProfile} style={{ width: 44, height: 44, marginRight: 12, marginTop: 5 }} />
                        </View>

                    }

                </ScrollView>
            )}
            </SkeletonLoader>
        </>
    )

}

const style = StyleSheet.create({
    EbContainer: {
        borderWidth: 1,
        flex: 1,
        paddingTop: 14,
        paddingLeft: 15,
        paddingBottom: 16,
        borderRadius: 12,
        marginRight: 7,
        borderColor: '#E5E5EA',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF'
    },
    container: {
        borderWidth: 1, flex: 1, paddingTop: 14, paddingLeft: 15, paddingBottom: 16, borderRadius: 12, marginLeft: 7,
        borderColor: '#E5E5EA', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF'
    },
    card: { marginTop: 10, paddingTop: 12, paddingLeft: 20, borderRadius: 10, height: "70%" },
    wrapper: {
        marginTop: 30,
    },

    row: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 15,
    },

    cardboc: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 110,
        borderWidth: 1,
        borderColor: '#E5E5EA',
        elevation: 2,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08, shadowRadius: 4,
    },

    content: {
        flex: 1,
    },

    amount: {
        fontSize: 20,
        fontFamily: "Gilroy-Bold",
        // fontWeight: '700',
        color: '#1C1C1E',
    },

    subText: {
        fontSize: 13,
        color: '#AEAEB2',
        marginTop: 4,
        fontFamily: 'Gilroy-Medium'
    },

    highlightText: {
        fontSize: 13,
        color: '#FF9500',
        marginTop: 4,
        fontFamily: 'Gilroy-Medium'
    },

    inlineRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        flexWrap: 'wrap',
    },

    label: {
        fontSize: 11,
        color: '#8E8E93',
        fontFamily: 'Gilroy-Medium'
    },

    value: {
        fontSize: 12,
        fontFamily: 'Gilroy-Semibold',
        marginLeft: 4,
        flexShrink: 1,
    },

    icon: {
        width: 26,
        height: 26,
        marginLeft: 8,
        resizeMode: 'contain',
    },
})


export default MyStay;
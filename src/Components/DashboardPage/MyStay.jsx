import React, { useRef, useContext, useEffect, useState, useMemo } from "react";
import { View, Text, Image, FlatList, TouchableOpacity, ScrollView, StyleSheet, Button, BackHandler, TouchableWithoutFeedback, Platform, Dimensions, PanResponder, Animated } from "react-native";
import Swiper from "react-native-swiper";
import LinearGradient from "react-native-linear-gradient";
import Electricity from '../../assets/Images/electricity.png';
import Frame from '../../assets/Images/Frame.png'
import FrameAdd from '../../assets/Images/Frameadd.png'
import Receipt from '../../assets/Images/receipt.png'
import { TabActions, useNavigation } from "@react-navigation/native";
import { Screen } from "react-native-screens";
import { UsersContext } from "../../Context/UserContext";
import { hostelDetails } from "../../Action/HostelAction";
import BottomSheet from "@gorhom/bottom-sheet";
function MyStay(props) {

    const context = useContext(UsersContext);

    const [complaints, setComplaints] = useState([])
    const [rentBill, setRentBill] = useState([])
    const [showSheet, setShowSheet] = useState(false)

    console.log(rentBill)

    useEffect(() => {
        hostelDetails(props.hostel[0].hostelId, context.getToken).then(r => {
            console.log(r)
            setComplaints(r.data.complaints)

            const dat = r.data.currentMonthBills.filter(i => i.invoiceItem === "RENT")
            setRentBill(dat)
            console.log(dat)
        })
    }, [])

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

    return <View style={{ backgroundColor: '#ffffff', flex: 1, width: '100%' }}>

        <View style={{ height: 140, marginTop: 5 }}>
            <Swiper loop showsPagination paginationStyle={{ bottom: 10 }} removeClippedSubviews index={0}
                dotStyle={{width: 10, height: 10, borderRadius: 5, backgroundColor: 'transparent', borderWidth: 1.5, borderColor: '#CFCFCF',
                    marginHorizontal: 5
                }} activeDotColor="#1E45E1"
                style={{ height: 110, borderRadius: 10, overflow: 'hidden', alignSelf: 'center' }} >
                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#10267B', '#0227B5']} style={{ paddingTop: 20, paddingBottom: 40, paddingLeft: 12, borderRadius: 10, height: "70%" }}>
                    <Text style={{ color: '#ffffff', fontSize: 16 }}>Hello water matainence on 5th June</Text>
                </LinearGradient>
                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#10267B', '#0227B5']} style={{ paddingTop: 20, paddingBottom: 40, paddingLeft: 12, borderRadius: 10, height: "70%" }}>
                    <Text style={{ color: '#ffffff', fontSize: 16 }}>field2</Text>
                </LinearGradient>
                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#10267B', '#0227B5']} style={{ paddingTop: 20, paddingBottom: 40, paddingLeft: 12, borderRadius: 10, height: "70%" }}>
                    <Text style={{ color: '#ffffff', fontSize: 16 }}> field3</Text>
                </LinearGradient>
            </Swiper>
        </View>

        <View>
            <View style={{ flexDirection: 'row', width: '100%' }}>

                <View style={style.EbContainer}>
                    <View>
                        <Text style={{ fontSize: 22, fontWeight: '700', color: '#1C1C1E' }}>
                            {'\u20B9'} 350.00
                        </Text>

                        <Text style={{ fontSize: 13, fontWeight: '400', color: '#AEAEB2', marginTop: 5 }}>
                            Last Month EB Bill
                        </Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <Text style={{ fontSize: 11, fontWeight: '400', color: '#8E8E93' }}>
                                Paid On:
                            </Text>
                            <Text style={{ fontSize: 12, fontWeight: '600', marginLeft: 4 }}>
                                03 June
                            </Text>
                        </View>
                    </View>

                    <View style={{ paddingRight: 10, marginTop: -12 }}>
                        <Image source={Electricity} style={{ width: 28, height: 28 }} />
                    </View>
                </View>

                <View style={style.container}>
                    <View>
                        <Text style={{ fontSize: 22, fontWeight: '700', color: '#1C1C1E' }}>
                            {'\u20B9'} {rentBill[0]?.amount}
                        </Text>

                        <Text style={{ fontSize: 13, fontWeight: '400', color: '#AEAEB2', marginTop: 5 }}>
                            Last Month Rent
                        </Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <Text style={{ fontSize: 11, fontWeight: '400', color: '#8E8E93' }}>Paid On:</Text>
                            <Text style={{ fontSize: 12, fontWeight: '600', marginLeft: 4 }}>02 June</Text>
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
                            {'\u20B9'} 322.00
                        </Text>

                        <Text style={{ fontSize: 13, fontWeight: '500', color: '#FF9500', marginTop: 5 }}>
                            New Bill Generated
                        </Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <Text style={{ fontSize: 11, fontWeight: '400', color: '#8E8E93' }}>Due date:</Text>
                            <Text style={{ fontSize: 12, fontWeight: '600', marginLeft: 4 }}>05 Nov</Text>
                        </View>
                    </View>

                    <View style={{ paddingRight: 10, marginTop: -12 }}>
                        <Image source={Electricity} style={{ width: 28, height: 28 }} />
                    </View>
                </View>

                <View style={style.container}>
                    <View>
                        <Text style={{ fontSize: 22, fontWeight: '700', color: '#1C1C1E' }}>
                            {'\u20B9'} 7400.00
                        </Text>

                        <Text style={{ fontSize: 13, fontWeight: '500', color: '#FF9500', marginTop: 5 }}>
                            New Bill Generated
                        </Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <Text style={{ fontSize: 11, fontWeight: '400', color: '#8E8E93' }}>Due date:</Text>
                            <Text style={{ fontSize: 12, fontWeight: '600', marginLeft: 4 }}>05 Nov</Text>
                        </View>
                    </View>

                    <View style={{ paddingRight: 10, marginTop: -12 }}>
                        <Image source={Frame} style={{ width: 28, height: 28 }} />
                    </View>
                </View>

            </View>
        </View>



        <View>
            <View style={{ marginTop: 20 }}>
                <Text style={{ fontSize: 14, fontWeight: '600' }}>Quick Links</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' }}>
                <TouchableOpacity style={{
                    borderWidth: 1, borderRadius: 10, flex: 1, justifyContent: 'center',
                    alignItems: 'center', marginRight: 10, padding: 10, borderColor: '#EFF2FF'
                }}>
                    <View style={{ marginBottom: 10 }}>
                        <Image source={Receipt} style={{ width: 26, height: 26 }} />
                    </View>
                    <Text style={{ fontSize: 10, marginTop: 5 }}>Complaint</Text>
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
                        <Text style={{ fontSize: 10 }}>Request</Text>
                        <Text style={{ fontSize: 10 }}>Bed change</Text>
                    </View>
                </TouchableOpacity>
            </View>

        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: 600 }}>Complaints</Text>
            <TouchableOpacity onPress={viewallclick}>
                <Text style={{ color: '#1E45E1', marginRight: 2, fontSize: 14, fontWeight: 500 }}>view all</Text>
            </TouchableOpacity>

        </View>

        <ScrollView showsVerticalScrollIndicator={false}>

    {complaints.map(i => {
        const { backgroundColor, textColor } = getStatusColor(i.status)

        return (
            <View key={i.complaintId}>

                <View style={{
                    borderWidth: 1,borderRadius: 12,marginTop: 12,flexDirection: 'row',justifyContent: 'space-between',
                    borderColor: '#E5E5EA',backgroundColor: '#FFFFFF',
                }}>

                    {/* LEFT SECTION */}
                    <View style={{
                        paddingLeft: 20,paddingTop: 18,paddingBottom: 20,flex: 1
                    }}>
                        <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={{
                                fontSize: 17,fontWeight: '600',color: '#1C1C1E', maxWidth: '90%'}}
                        >
                            {i.description}
                        </Text>

                        <View style={{flexDirection: 'row', alignItems: 'center', paddingTop: 10}}>
                            <Image
                                source={require('../../assets/Images/bill.png')}
                                style={{ width: 18, height: 18 }}
                            />
                            <Text style={{
                                marginLeft: 8,fontSize: 14,fontWeight: '400',color: '#6C6C70'
                            }}>
                                {i.complaintTypeName}
                            </Text>
                        </View>
                    </View>

                    {/* RIGHT SECTION */}
                    <View style={{
                        justifyContent: 'center',alignItems: 'flex-end',paddingRight: 18,paddingTop: 18,paddingBottom: 20
                    }}>
                        <Text style={{
                            color: '#9C9C9C',fontSize: 12,fontWeight: '400',marginBottom: 18
                        }}>
                            {i.complaintDate}
                        </Text>

                        <View style={{
                            borderRadius: 20,paddingHorizontal: 12,paddingVertical: 4,backgroundColor: backgroundColor
                        }}>
                            <Text style={{fontSize: 12,fontWeight: '500',color: textColor}}>
                                {i.status}
                            </Text>
                        </View>
                    </View>

                </View>

            </View>
        )
    })}

</ScrollView>




    </View>

}

const style = StyleSheet.create({
    EbContainer: {borderWidth: 1,
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
            backgroundColor: '#FFFFFF'},
    container: {
        borderWidth: 1, flex: 1, paddingTop: 14, paddingLeft: 15, paddingBottom: 16, borderRadius: 12, marginLeft: 7,
        borderColor: '#E5E5EA', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF'
    }
})


export default MyStay;
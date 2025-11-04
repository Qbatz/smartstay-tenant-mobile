import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, SafeAreaView, FlatList, Pressable } from "react-native";
import AddComplaint from '../../assets/Images/addComplaint.png'
import RightDirection from '../../assets/Images/direction-right.png'
import AddSquare from '../../assets/Images/add-square.png'


function Services(props) {
    const [selectedfield, setselectfield] = useState(0);



    const list1 = [{ id: 1, title: 'Washing machine', issue: 'Plumbing', status: 'Pending' },
    { id: 2, title: 'Water Tap Leakage', issue: 'Plumbing', status: 'Pending' }, { id: 3, title: 'Charging port was not working', issue: 'Electricity', status: 'Resolved' }, { id: 4, title: 'Room maintanence', issue: 'Maintanence', status: 'Pending' }, { id: 5, title: 'Locker Problem', issue: 'Maintanence', status: 'Resolved' }, { id: 6, title: 'Shower not working', issue: 'Plumbing', status: 'Resolved' }, { id: 7, title: 'Home not clean', issue: 'Maintanence', status: 'Resolved' },
    { id: 8, title: 'Electricity', issue: 'Electricity', status: 'Pending' }, { id: 9, title: 'Water Tap Leakage', issue: 'Plumbing', status: 'Pending' }, { id: 10, title: 'Charging port was not working', issue: 'Electricity', status: 'Resolved' }]
    const list2 = [{ id: 1, Amenities: 'wifi', Amount: '339/Month' }, { id: 2, Amenities: 'Laundry', Amount: '299/month' }, { id: 3, Amenities: 'Food', Amount: '1500/month' }]

    const list3 = [{ id: 1, Available: 'Parking' }, { id: 2, Available: 'Gym Access' }, { id: 3, Available: 'Cycle Rentals' }, { id: 4, Available: 'Cleaning' }]


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


    useEffect(() => {
        firstclick(list1.length)
        console.log('nothissdfsd')
    }, [])

    function firstclick(id) {
        console.log(id)
        setselectfield(id)
    }
    function secondclick(id) {
        console.log(id)
        setselectfield(id)
    }
    return <View style={{ flex: 1, position: 'relative' }}>
        <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => firstclick(list1.length)} style={{
                backgroundColor: selectedfield === list1.length ? '#1E45E1' : 'white',
                flex: 1,
                borderRadius: 10,
                paddingTop: 15,
                paddingBottom: 15,
                borderColor: '#f4f4f4',
                borderWidth: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 5,
            }}>
                <View style={{ flexDirection: 'row' }}>
                    <Image source={require('../../assets/Images/Messagef.png')} style={{ color: selectedfield === list1.length ? 'blue' : "black", width: 25, height: 25 }} />
                    <Text style={{ color: selectedfield == list1.length ? "white" : 'black', fontSize: 16, fontWeight: '400', marginLeft: 10 }}>Complaints</Text>
                </View>

            </TouchableOpacity>
            <TouchableOpacity onPress={() => secondclick(list2.length)} style={{
                backgroundColor: selectedfield === list2.length ? '#1E45E1' : 'white',
                flex: 1,
                borderRadius: 10,
                borderColor: '#f4f4f4',
                paddingTop: 15,
                paddingBottom: 15,
                borderWidth: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 5,
            }}>
                <View style={{ flexDirection: 'row' }}>
                    <Image source={require('../../assets/Images/Messagef.png')} style={{ width: 25, height: 25 }} />
                    <Text style={{ color: selectedfield == list2.length ? "white" : 'black', fontSize: 16, fontWeight: '400', marginLeft: 10 }}>Amenities</Text>
                </View>
            </TouchableOpacity>
        </View>

        {selectedfield == list1.length && list1.length > 0 ? <ScrollView showsVerticalScrollIndicator={false}
        style={{ marginTop: 10, position: 'relative' }}>
            {list1.map(i => {
                const { backgroundColor, textColor } = getStatusColor(i.status);
                return <View key={i.id} >
                    <TouchableOpacity>
                        <View style={{ borderWidth: 1, borderRadius: 8, marginTop: 10, padding: 20, flexDirection: 'row', justifyContent: 'space-between', borderColor: '#f4f4f4' }}>
                            <View>
                                <Text style={{ fontSize: 16, fontWeight: '600' }}>{i.title}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                                    <Image source={require('../../assets/Images/bill.png')} style={{ width: 16, height: 16 }} />
                                    <Text>{i.issue}</Text>
                                </View>
                            </View>
                            <View >
                                <Text style={{ bottom: 10, color: '#9C9C9C', left: 10, marginBottom: 10 }}>02 hrs ago</Text>
                                <View style={{ borderRadius: 15, paddingLeft: 10, paddingRight: 10, paddingTop: 3, paddingBottom: 3, backgroundColor: backgroundColor }}>
                                    <Text style={{ color: textColor }}>{i.status}</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>

                </View>

            })}

        </ScrollView> : null}

        {selectedfield === list2.length ? <View>
            <View style={{ paddingTop: 10 }}>
                <Text style={{ fontSize: 14, fontWeight: 400 }}>My Amenities</Text>
            </View>

            <FlatList data={list2}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    return <View style={{ paddingTop: 10 }}>
                        <View style={{ paddingTop: 10, paddingBottom: 12, borderWidth: 1, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', paddingRight: 14, paddingLeft: 14, alignItems: 'center', borderColor: '#edf3ff' }}>
                            <View>
                                <Text style={{ fontSize: 16, fontWeight: 600 }}>{item.Amenities}</Text>
                                <View style={{ flexDirection: 'row', paddingTop: 7 }}>
                                    <Text style={{ fontSize: 14, fontWeight: 400, color: '#4B4B4B' }}>{'\u20B9'}</Text>
                                    <Text style={{ fontSize: 14, fontWeight: 400, color: '#4B4B4B' }}>{item.Amount}</Text>
                                </View>
                            </View>

                            <View >
                                <Image source={RightDirection} style={{ width: 26, height: 26 }} />
                            </View>


                        </View>
                    </View>
                }} /></View> : null

        }
        {
            selectedfield === list2.length ?
                <View>
                    <View style={{paddingTop:12}}>
                        <Text style={{fontSize:14,fontWeight:400}}>Available Amenities</Text>
                    </View>
                    <FlatList
                        data={list3}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => {
                            return <View style={{paddingTop:10}}>
                                <View style={{ paddingTop: 11, paddingBottom: 13, borderWidth: 1, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', paddingRight: 14, paddingLeft: 14, alignItems: 'center', borderColor: '#edf3ff' }}>
                                <Text style={{fontSize:16, fontWeight:500}}>{item.Available}</Text>
                                <Image source={AddSquare} style={{width:22, height:22}}/>
                                </View>
                            </View>
                        }} /></View> : null
        }



        <View style={{ position: 'absolute', bottom: 35, right: -3 }}>
            <TouchableOpacity>
                <Image source={AddComplaint} style={{ width: 48, height: 47 }} />
            </TouchableOpacity>
        </View>

    </View>

}


export default Services;
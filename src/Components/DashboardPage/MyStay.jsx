import React,{useRef} from "react";
import { View, Text, Image, FlatList, TouchableOpacity, ScrollView, StyleSheet, Button } from "react-native";
import Swiper from "react-native-swiper";
import LinearGradient from "react-native-linear-gradient";
import Electricity from '../../assets/Images/electricity.png';
import Frame from '../../assets/Images/Frame.png'
import FrameAdd from '../../assets/Images/Frameadd.png'
import Receipt from '../../assets/Images/receipt.png'
import { TabActions, useNavigation } from "@react-navigation/native";
import { Screen } from "react-native-screens";
function MyStay(props) {

    console.log(props)

    const data =  [{id: 1, title:'Washing machine', issue:'Plumbing', status:'Pending'},
       { id:2,title: 'Water Tap Leakage', issue:'Plumbing', status:'Pending'}, {id:3, title: 'Charging port was not working', issue:'Electricity', status:'Resolved'}, {id:4, title:'Room maintanence', issue:'Maintanence', status:'Pending'}, {id:5, title:'Locker Problem', issue:'Maintanence', status:'Resolved'}, {id:6, title:'Shower not working', issue:'Plumbing', status:'Resolved'},{id:7, title:'Home not clean', issue:'Maintanence', status:'Resolved'},
    {id:8, title:'Electricity', issue:'Electricity', status:'Pending'},{ id:9,title: 'Water Tap Leakage', issue:'Plumbing', status:'Pending'}, {id:10, title: 'Charging port was not working', issue:'Electricity', status:'Resolved'}]

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


        function viewallclick(id) {
            props.jumpTo('services', {complaint: id})

        }

    return <View style={{ backgroundColor: '#ffffff', flex: 1 }}>
        <View style={{ height: 110, marginTop: 20 }}>
            <Swiper loop={true} paginationStyle={{ bottom: 10 }} loadMinimal={false} index={0} >
                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#10267B', '#0227B5']} style={{ paddingTop: 20, paddingBottom: 35, paddingLeft: 10, borderRadius: 10 }}>
                    <Text style={{ color: '#ffffff', fontSize: 16 }}>Hello water matainence on 5th June</Text>
                </LinearGradient>
                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#10267B', '#0227B5']} style={{ paddingTop: 20, paddingBottom: 35, paddingLeft: 10, borderRadius: 10 }}>
                    <Text style={{ color: '#ffffff', fontSize: 16 }}>field2</Text>
                </LinearGradient>
                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#10267B', '#0227B5']} style={{ paddingTop: 20, paddingBottom: 35, paddingLeft: 10, borderRadius: 10 }}>
                    <Text style={{ color: '#ffffff', fontSize: 16 }}> field3</Text>
                </LinearGradient>

            </Swiper>
        </View>

        <View>
            <View style={{ flexDirection: 'row', width: '100%' }}>
                <View style={{ borderWidth: 1, flex: 1, paddingTop: 18, paddingLeft: 15, paddingBottom: 18, borderRadius: 10, marginRight: 7, borderColor: '#dcdcdc', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View>
                        <Text style={{ fontSize: 20, fontWeight: '700', color: '#222222' }}> {'\u20B9'} 350</Text>
                        <Text style={{ fontSize: 12, color: '#b2b2b4' }}>Last Month EB Bill </Text>
                   <View style={{flexDirection:'row',alignItems:'center',marginTop:10}}>
                            <Text style={{ fontSize: 10, color: '#b2b2b4' }}>Paid On: </Text>
                            <Text style={{fontSize:12,fontWeight:600}}>03 Jun</Text>
                        </View>
                    </View>

                    <View style={{ paddingLeft: 20, paddingRight: 10 }}>
                        <Image source={Electricity} style={{ width: 26, height: 26, bottom: 10 }} />
                    </View>
                </View>

                <View style={{ borderWidth: 1, flex: 1, paddingTop: 18, paddingLeft: 15, paddingBottom: 18, borderRadius: 10, marginLeft: 7, borderColor: '#dcdcdc', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View >
                        <Text style={{ fontSize: 20, fontWeight: '700', color: '#222222' }}>{'\u20B9'} 350</Text>
                        <Text style={{ fontSize: 12, color: '#b2b2b4' }}>Last Month Rent</Text>
                        <View style={{flexDirection:'row',alignItems:'center',marginTop:10}}>
                            <Text style={{ fontSize: 10, color: '#b2b2b4' }}>Paid On: </Text>
                            <Text style={{fontSize:12,fontWeight:600}}>03 Jun</Text>
                        </View>
                        
                    </View>

                    <View style={{ paddingLeft: 20, paddingRight: 10 }}>
                        <Image source={Frame} style={{ width: 26, height: 26, bottom: 10 }} />
                    </View>
                </View>
            </View>

            <View style={{ flexDirection: 'row', paddingTop:15 }}>
                <View style={{ borderWidth: 1, flex: 1, paddingTop: 18, paddingLeft: 15, paddingBottom: 18, borderRadius: 10, marginRight: 7, borderColor: '#dcdcdc', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View >
                        <Text style={{ fontSize: 20, fontWeight: '700', color: '#222222' }}>{'\u20B9'} 7333</Text>
                        <Text style={{ fontSize: 12, color: '#FF9500' }}>New Bill Generated</Text>
                         <View style={{flexDirection:'row',alignItems:'center',marginTop:10}}>
                            <Text style={{ fontSize: 10, color: '#b2b2b4' }}>Due date: </Text>
                            <Text style={{fontSize:12,fontWeight:600}}>03 Jun</Text>
                        </View>
                        
                    </View>
                    <View style={{ paddingLeft: 20, paddingRight: 10 }}>
                        <Image source={Electricity} style={{ width: 26, height: 26, bottom: 10 }} />
                    </View>
                </View>

                <View style={{ flex: 1, borderWidth: 1, paddingTop: 18, paddingLeft: 15, paddingBottom: 18, borderRadius: 10, marginLeft: 7, borderColor: '#dcdcdc', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View>
                        <Text style={{ fontSize: 20, fontWeight: '700', color: '#222222' }}>{'\u20B9'} 8000</Text>
                        <Text style={{ fontSize: 12, color: '#FF9500' }}>New Bill Generated</Text>
                         <View style={{flexDirection:'row',alignItems:'center',marginTop:10}}>
                           <Text style={{ fontSize: 10, color: '#b2b2b4' }}>Due date:</Text>
                            <Text style={{fontSize:12,fontWeight:600,marginLeft:5}}>05 Feb</Text>
                        </View>
                    </View>

                    <View style={{ paddingLeft: 20, paddingRight: 10 }}>
                        <Image source={Frame} style={{ width: 26, height: 26, bottom: 10 }} />
                    </View>
                </View>
            </View>
        </View>


        <View>
            <View style={{ marginTop: 20 }}>
                <Text style={{ fontSize: 14, fontWeight: '600' }}>Quick Links</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <View style={{ borderWidth: 1, borderRadius: 10, flex: 1, justifyContent: 'center', alignItems: 'center', marginRight: 5, padding: 10, borderColor: '#EFF2FF' }}>
                    <View style={{ marginBottom: 10 }}>
                        <Image source={Receipt} style={{ width: 26, height: 26 }} />
                    </View>
                    <Text style={{ fontSize: 10, marginTop: 5 }}>Complaint</Text>
                </View>
                <View style={{ borderWidth: 1, borderRadius: 10, flex: 1, justifyContent: 'center', alignItems: 'center', marginLeft: 5, padding: 10, borderColor: '#EFF2FF' }}>
                    <View>
                        <Image source={FrameAdd} style={{ width: 24, height: 24 }} />
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 5 }}>
                        <Text style={{ fontSize: 10 }}>Request</Text>
                        <Text style={{ fontSize: 10 }}>Bed change</Text>
                    </View>
                </View>
            </View>

        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: 600 }}>Complaints</Text>
            <TouchableOpacity onPress={()=>viewallclick('complaints')}>
                <Text style={{ color: '#1E45E1', marginRight: 2, fontSize: 14, fontWeight: 500 }}>view all</Text>
            </TouchableOpacity>

        </View>

        <ScrollView showsVerticalScrollIndicator={false} >

            {data.map(i => {
                const { backgroundColor, textColor } = getStatusColor(i.status)
                return <View key={i.id}>
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

                </View>
            })}
        </ScrollView>
    </View>

}
export default MyStay;
import React from "react";
import { View, Text } from "react-native";
import Swiper from "react-native-swiper";
import LinearGradient from "react-native-linear-gradient";
function MyStay(props) {
    return <View style={{ backgroundColor:'#ffffff'}}>
        <View style={{ height: 120, marginTop:20}}>
            <Swiper>
                <LinearGradient colors={['#0227B5', '#10267B']} style={{ justifyContent: 'center', alignItems: 'center', borderRadius: 10, height: 70 }}>
                    <Text style={{ color: '#ffffff' }}>hello</Text>
                </LinearGradient>
                <LinearGradient colors={['#0227B5', '#10267B']} style={{ justifyContent: 'center', alignItems: 'center', borderRadius: 10, height: 70 }}>
                    <Text style={{ color: '#ffffff' }}>field2</Text>
                </LinearGradient>
                <LinearGradient colors={['#0227B5', '#10267B']} style={{ justifyContent: 'center', alignItems: 'center', borderRadius: 10, height: 70 }}>
                    <Text style={{ color: '#ffffff' }}> field3</Text>
                </LinearGradient>
            </Swiper>
        </View>

        <View>
            <View style={{ flexDirection: 'row', width: '100%' }}>
                <View style={{ borderWidth:1, flex: 1, paddingTop: 18, paddingLeft: 15, paddingBottom: 18, borderRadius: 10, marginRight: 7, borderColor:'#b2b2b4' }}>
                    <Text style={{ fontSize: 12, color:'#b2b2b4' }}>Last Month EB Bill </Text>
                    <Text style={{ fontSize: 10, color:'#b2b2b4',marginTop:10 }}>Paid On</Text>
                </View>

                <View style={{ borderWidth:1, flex: 1, paddingTop: 18, paddingLeft: 15, paddingBottom: 18, borderRadius: 10, marginLeft: 7,borderColor:'#b2b2b4' }}>
                    <Text style={{ fontSize: 12, color:'#b2b2b4' }}>Last Month Rent</Text>
                    <Text style={{ fontSize: 10, color:'#b2b2b4',marginTop:10}}>Paid On</Text>
                </View>
            </View>

            <View style={{ flexDirection: 'row', marginTop: 11 }}>
                <View style={{ borderWidth:1, flex: 1, paddingTop: 18, paddingLeft: 15, paddingBottom: 18, borderRadius: 10, marginRight: 7,borderColor:'#b2b2b4' }}>
                    <Text style={{ fontSize: 12, color:'#FF9500' }}>New Bill Generated</Text>
                    <Text style={{ fontSize: 10, color:'#b2b2b4',marginTop:10 }}>Due date</Text>
                </View>

                <View style={{ flex: 1,borderWidth:1, paddingTop: 18, paddingLeft: 15, paddingBottom: 18, borderRadius: 10, marginLeft: 7,borderColor:'#b2b2b4' }}>
                    <Text style={{ fontSize: 12, color:'#FF9500'}}>New Bill Generated</Text>
                    <Text style={{ fontSize: 10,color:'#b2b2b4', marginTop:10 }}>Due date:</Text>
                </View>
            </View>
        </View>

        
        <View>
            <View style={{marginTop:20}}>
                <Text style={{fontSize:14, fontWeight:'600'}}>Quick Links</Text>
            </View>
            <View style={{flexDirection:'row', marginTop:10}}>
                <View style={{borderWidth:1, borderRadius:10, flex:1, justifyContent:'center', alignItems:'center', marginRight:5, padding:10, borderColor:'#EFF2FF'}}>
                    <Text style={{fontSize:10}}>Complaint</Text>
                </View>
                <View style={{borderWidth:1, borderRadius:10, flex:1,justifyContent:'center', alignItems:'center', marginLeft:5,padding:10, borderColor:'#EFF2FF'}}>
                     <View style={{width:20, height:20, borderWidth:1.5, borderRadius:10, borderColor:'#1E45E1', justifyContent:'center', alignItems:'center'}}>
                        <Text style={{color:'#1E45E1', }}>+</Text></View>
                    <View style={{justifyContent:'center', alignItems:'center'}}>   
                         <Text style={{fontSize:10}}>Request</Text>
                         <Text style={{fontSize:10}}>Bed change</Text>
                    </View>
                </View>
            </View>

        </View>


    </View>

}
export default MyStay;
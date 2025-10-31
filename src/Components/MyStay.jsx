import React from "react";
import { View, Text, Image, FlatList, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import Swiper from "react-native-swiper";
import LinearGradient from "react-native-linear-gradient";
import Electricity from '../assets/Images/electricity.png';
import Frame from '../assets/Images/Frame.png'
import FrameAdd from '../assets/Images/Frameadd.png'
import Receipt from '../assets/Images/receipt.png'
import { TabActions, useNavigation } from "@react-navigation/native";
import { Screen } from "react-native-screens";
import Services from "./Services";
function MyStay(props) {

    console.log(props)

    const navigation=useNavigation();
    const data = [{id: 1, title:'Washing machine'},
       { id:2,title: 'plumbing'}, {id:3, title: 'kitchen'}, {id:4, title:'nothing'}, {id:5, title:'happing'}, {id:6, title:'happing'},{id:7, title:'happing'},
    {id:8, title:'thhhht'}]

function viewallclick(){
    props.jumpTo('services')
   
}

    return <View style={{ backgroundColor: '#ffffff', flex:1 }}>
        <View style={{height:110, marginTop: 20 }}>
            <Swiper loop={true} paginationStyle={{bottom:10}} loadMinimal={false} index={0} > 
                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#10267B', '#0227B5']} style={{paddingTop:20, paddingBottom:35, paddingLeft:10, borderRadius: 10  }}>
                    <Text style={{ color: '#ffffff', fontSize:16 }}>Hello water matainence on 5th June</Text>
                </LinearGradient>
                <LinearGradient start={{ x: 0, y: 0 }}end={{ x: 1, y: 0 }} colors={['#10267B', '#0227B5']} style={{ paddingTop:20,paddingBottom:35, paddingLeft:10,borderRadius: 10}}>
                    <Text style={{ color: '#ffffff',fontSize:16 }}>field2</Text>
                </LinearGradient>
                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#10267B', '#0227B5']} style={{paddingTop:20,paddingBottom:35, paddingLeft:10, borderRadius: 10 }}>
                    <Text style={{ color: '#ffffff',fontSize:16 }}> field3</Text>
                </LinearGradient>
                
            </Swiper>
        </View>

        <View>
            <View style={{ flexDirection: 'row', width: '100%' }}>
                <View style={{ borderWidth: 1, flex: 1, paddingTop: 18, paddingLeft: 15, paddingBottom: 18, borderRadius: 10, marginRight: 7, borderColor: '#dcdcdc', flexDirection: 'row', alignItems: 'center',justifyContent:'space-between'  }}>
                    <View>
                        <Text style={{ fontSize: 18, fontWeight: '800' }}> {'\u20B9'} 350</Text>
                        <Text style={{ fontSize: 12, color: '#b2b2b4' }}>Last Month EB Bill </Text>
                        <Text style={{ fontSize: 10, color: '#b2b2b4', marginTop: 10 }}>Paid On</Text>
                    </View>

                    <View style={{ paddingLeft: 20,paddingRight:10 }}>
                        <Image source={Electricity} style={{ width: 26, height: 26, bottom:10 }} />
                    </View>
                </View>

                <View style={{ borderWidth: 1, flex: 1, paddingTop: 18, paddingLeft: 15, paddingBottom: 18, borderRadius: 10, marginLeft: 7, borderColor: '#dcdcdc', flexDirection: 'row', alignItems: 'center',justifyContent:'space-between' }}>
                    <View>
                        <Text style={{ fontSize: 18, fontWeight: '800' }}>{'\u20B9'} 350</Text>
                        <Text style={{ fontSize: 12, color: '#b2b2b4' }}>Last Month Rent</Text>
                        <Text style={{ fontSize: 10, color: '#b2b2b4', marginTop: 10 }}>Paid On</Text>
                    </View>

                    <View style={{ paddingLeft: 20, paddingRight:10 }}>
                        <Image source={Frame} style={{ width: 26, height: 26,bottom:10 }} />
                    </View>
                </View>
            </View>

            <View style={{ flexDirection: 'row', marginTop: 11 }}>
                <View style={{ borderWidth: 1, flex: 1, paddingTop: 18, paddingLeft: 15, paddingBottom: 18, borderRadius: 10, marginRight: 7, borderColor: '#dcdcdc', flexDirection: 'row', alignItems: 'center',justifyContent:'space-between'  }}>
                    <View >
                        <Text style={{ fontSize: 18, fontWeight: '800' }}>{'\u20B9'} 7333</Text>
                        <Text style={{ fontSize: 12, color: '#FF9500' }}>New Bill Generated</Text>
                        <Text style={{ fontSize: 10, color: '#b2b2b4', marginTop: 10 }}>Due date</Text>
                    </View>
                    <View style={{ paddingLeft: 20,paddingRight:10 }}>
                        <Image source={Electricity} style={{ width: 26, height: 26,bottom:10}} />
                    </View>
                </View>

                <View style={{ flex: 1, borderWidth: 1, paddingTop: 18, paddingLeft: 15, paddingBottom: 18, borderRadius: 10, marginLeft: 7, borderColor: '#dcdcdc', flexDirection:'row', alignItems:'center', justifyContent:'space-between' }}>
                    <View>
                        <Text style={{ fontSize: 18, fontWeight: '800' }}>{'\u20B9'} 8000</Text>
                        <Text style={{ fontSize: 12, color: '#FF9500' }}>New Bill Generated</Text>
                        <Text style={{ fontSize: 10, color: '#b2b2b4', marginTop: 10 }}>Due date:</Text>
                    </View>

                    <View style={{ paddingLeft: 20,paddingRight:10  }}>
                        <Image source={Frame} style={{ width: 26, height: 26,bottom:10 }} />
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
                    <View style={{marginBottom:10}}>
                        <Image source={Receipt} style={{width:26, height:26}}/>
                    </View>
                    <Text style={{ fontSize: 10, marginTop:5 }}>Complaint</Text>
                </View>
                <View style={{ borderWidth: 1, borderRadius: 10, flex: 1, justifyContent: 'center', alignItems: 'center', marginLeft: 5, padding: 10, borderColor: '#EFF2FF' }}>
                    <View>
                        <Image source={FrameAdd} style={{width:24, height:24}}/>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop:5 }}>
                        <Text style={{ fontSize: 10 }}>Request</Text>
                        <Text style={{ fontSize: 10 }}>Bed change</Text>
                    </View>
                </View>
            </View>

        </View>

            <View style={{flexDirection:'row', justifyContent:'space-between', paddingTop:12}}>
                <Text style={{fontSize:16, fontWeight:600}}>Complaints</Text>
                <TouchableOpacity onPress={viewallclick}>
                    <Text style={{color:'#1E45E1', marginRight:2, fontSize:14, fontWeight:500}}>view all</Text>
                </TouchableOpacity>
                
            </View>
            
         <ScrollView  showsVerticalScrollIndicator={false} >

                {data.map(i=>{
                    return   <View key={i.id} style={{marginTop:10}}>
                    <View style={{borderWidth:1, borderRadius:10, padding:20, borderColor:'#eff2ff'}}>
                        <Text>{i.title}</Text>
                    </View>
                </View>
                })}
            </ScrollView>
         
        


    </View>

}
export default MyStay;
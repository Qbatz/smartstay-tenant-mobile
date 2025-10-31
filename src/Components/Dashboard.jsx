import React, { useState, useEffect } from "react";
import { View, Text, Dimensions, Image } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import MyStay from './MyStay';
import Services from './Services'
import Payment from './Payment'
import Building from '../assets/Images/build.png'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storeData } from '../Utils/Storage'
import Location from '../assets/Images/location.png'
import Notification from '../assets/Images/Notify.png'
import Flash from '../assets/Images/flash.png'
import MobilePayment from '../assets/Images/payment.png'

function Dashboard(props) {

    const [index, setindex] = useState(0);

        


    useEffect(() => {
        storeData("token", "waitttt");
    }, [])





    const routes = [{ key: 'mystay', title: 'MyStay', icon: Building}, { key: 'services', title: 'Services', icon:Flash }, { key: 'payment', title: 'Payment', icon:MobilePayment }]
    
    const renderTabBar = props => (<TabBar {...props} 
        indicatorStyle={{ backgroundColor: '#0227B5' }} style={{backgroundColor:'#ffffff'}}
        inactiveColor="black"
        activeColor="blue"
        // renderIcon={renderIcon}
        renderLabel={({ route, color }) => (<Text style={{ color: color }}>
            {route.title}
        </Text>)} 
        />)

    return <View style={{ flex: 1, backgroundColor: '#ffffff'}}>
        <View style={{ flexDirection: 'row', paddingTop: 10, paddingLeft: 16, paddingRight:16, alignItems: 'center', justifyContent:'space-between' }}>
            <View style={{flexDirection:'row'}}>
                <View  >
                    <Image source={require('../assets/Images/hostelpic.png')} style={{ width: 50, height: 50, borderRadius: 25 }} />
                </View>
                <View style={{ paddingLeft: 10 }}>
                    <Text style={{ fontSize: 18, fontWeight: '600', paddingBottom: 5, fontFamily: 'Gilroy-SemiBold', color: '#1B1D21' }}>Smartstay Hostel</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={Location} style={{ width: 12.75, height: 14.17 }} />
                        <Text style={{ marginLeft: 7, fontSize: 14, alignItems: 'center', color: '#4B4B4B' }}>Kandanchavadi</Text>
                    </View>
                </View>
            </View>

            <View style={{flexDirection:'row'}}>
                <Image source={Notification} style={{width:44, height:44,borderRadius:22, marginRight:6}}/>
                <Image source={require('../assets/Images/personPic.png')} style={{width: 44, height: 44, borderRadius: 22, marginLeft:6}}/>

            </View>
        </View>
        <View style={{flex:1, paddingLeft:20, paddingRight:20}}>
            <TabView navigationState={{ index, routes }}
             inactiveColor="black"
             activeColor="blue"
            commonOptions={{
                icon: ({ route, color }) => (<Image source={route.icon} style={{width:21.12, height:21.12, tintColor:color}} />)
            }}
            options={{mystay:{labelText:'MyStay'}}}
            renderTabBar={renderTabBar}
            renderScene={SceneMap({ mystay: MyStay, services: Services, payment: Payment })} 
            onIndexChange={setindex}
            initialLayout={{ width: Dimensions.get('window').width }}
            style={{flex: 1, justifyContent: 'center', marginTop:10 }} /> 
        </View>
                   

    </View>

}
export default Dashboard;
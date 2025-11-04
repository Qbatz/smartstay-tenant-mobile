import React, { useState, useMemo, useCallback } from "react";
import { View, Text, Dimensions, Image, TouchableOpacity, Button} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import MyStay from '../DashboardPage/MyStay';
import Services from '../DashboardPage/Services'
import Payment from '../DashboardPage/Payment'
import Building from '../../assets/Images/buildin.png'
import Location from '../../assets/Images/location.png'
import Flash from '../../assets/Images/flash.png'
import MobilePayment from '../../assets/Images/payment.png'


function Dashboard(props) {

  const navigation = useNavigation();
  const [index, setindex] = useState(0);


  const handleNotificationShow = () => {
    navigation.navigate("Notification");
  };


  const handleProfile = () => {
    navigation.navigate("CustomerProfile");
  };


  const routes = [{ key: 'mystay', title: 'MyStay', icon: Building }, { key: 'services', title: 'Services', icon: Flash }, { key: 'payment', title: 'Payment', icon: MobilePayment }]
  const renderTabBar = props => (<TabBar {...props}
    indicatorStyle={{ backgroundColor: '#0227B5' }} style={{ backgroundColor: '#ffffff' }}
    inactiveColor="black"
    activeColor="blue"
    renderLabel={({ route, color }) => (<Text style={{ color: color }}>
      {route.title}
    </Text>)} />)

  return <View style={{ flex: 1, backgroundColor: '#ffffff', paddingTop:10 }}>
    <View style={{ flexDirection: 'row', paddingTop: 10, paddingLeft: 16, paddingRight: 16, justifyContent: 'space-between', paddingLeft: 10, alignItems: 'center' }}>
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <View >
          <Image source={require("../../assets/Images/Group 1.png")} resizeMode="contain" style={{ marginTop: 2, marginLeft: 4, height: 44, width: 44 }} />
        </View>
        <View style={{ paddingLeft: 7 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', paddingBottom: 5, fontFamily: 'gilroy-semibold', color: '#1B1D21' }}>Smartstay Hostel</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={Location} style={{ width: 12.75, height: 14.17 }} />
            <Text style={{marginLeft: 7, fontSize: 14, alignItems: 'center', color: '#4B4B4B' }}>Kandanchavadi</Text>
          </View>

        </View>
      </View>
      <View style={{flexDirection: 'row'}}>
        <View style={{}}>
          <TouchableOpacity onPress={handleNotificationShow}>
            <Image source={require("../../assets/Images/notification.png")} resizeMode="contain" style={{  height: 44, width: 44 }} />
          </TouchableOpacity>
        </View>

        <View style={{ paddingLeft:10 }}>
          <TouchableOpacity onPress={handleProfile}>
            <Image source={require("../../assets/Images/Customer_Icon.png")} resizeMode="contain" style={{ width:44, height:44,borderRadius:22 }} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
    
    <View style={{ flex: 1, paddingLeft: 20, paddingRight: 20 }}>
      <TabView navigationState={{ index, routes }}
        commonOptions={{
          icon: ({ route, color }) => (<Image source={route.icon} style={{ width: 21.12, height: 21.12, tintColor: color }} />)
        }}
        renderTabBar={renderTabBar}
        renderScene={SceneMap({ mystay: MyStay, services: Services, payment: Payment })}
        onIndexChange={setindex}
        initialLayout={{ width: Dimensions.get('window').width }}
        style={{ flex: 1, justifyContent: 'center', marginTop:10}} />

    </View>


  </View>

}
export default Dashboard;
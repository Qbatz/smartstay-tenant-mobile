import React,{useState} from "react";
import { View, Text, Dimensions, Image  ,  TouchableOpacity,} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import MyStay from './MyStay';
import Services from './Services'
import Payment from './Payment'
import Building from '../assets/Images/buildin.png'

function Dashboard(props) {
    
     const navigation = useNavigation();
    const[index, setindex]=useState(0);


  const handleNotificationShow = () => {
     navigation.navigate("Notification"); 
  };


  const handleProfile = () => {
    navigation.navigate("CustomerProfile"); 
  };


    const routes=[{key:'mystay', title:'MyStay'},{key:'services', title:'Services'}, {key:'payment', title:'Payment'}]
    const renderTabBar=props=>(<TabBar {...props}
    indicatorStyle={{backgroundColor:'#0227B5'}} style={{backgroundColor:'#ffffff'}}
    inactiveColor="black"
    activeColor="blue"  
    renderLabel={({route, color })=>(<Text style={{color:color}}>
        {route.title}
    </Text>)}  />)

    return <View  style={{flex:1, backgroundColor:'#ffffff'}}>
        <View style={{flexDirection:'row', paddingTop:30, justifyContent:'space-between', paddingLeft:10, alignItems:'center'}}>
            <View style={{display:'flex', flexDirection:'row'}}>
            <View >
           <Image source={require("../assets/Images/Group 1.png")} resizeMode="contain" style={{marginTop:2 , marginLeft:4 , height:44 , width:44}}/>
            </View>
            <View style={{paddingLeft:7}}>
                 <Text style={{fontSize:18, fontWeight:'500'}}>Smartstay Hostel</Text>
            <Text style={{marginTop:5, fontSize:14}}>Puthukkadai</Text>       
            </View>
            </View>
            <View style={{display:'flex', flexDirection:'row'}}>
             <View style={{ padding: 3}}>
                      <TouchableOpacity onPress={handleNotificationShow}>
                        <Image source={require("../assets/Images/notification.png")} resizeMode="contain" style={{marginTop:2 , marginLeft:4 , height:44 , width:44}}/>
                      </TouchableOpacity>
                    </View>
            
                    <View style={{ padding: 3 , marginLeft:4, marginRight:30}}>
                         <TouchableOpacity onPress={handleProfile}>
                    <Image  source={require("../assets/Images/Customer_Icon.png")} resizeMode="contain" style={{marginTop:2 , marginLeft:4 , height:44 , width:44}}/>
                      </TouchableOpacity>
                    </View>
                    </View>
           

        </View>
        <TabView navigationState={{index, routes}}
        commonOptions={{
            icon:({route, color})=>(<Image source={Building} style={{color:color, width:21.12, height:21.12}} name={route.icon}/>)
        }}
        renderTabBar={renderTabBar}
        renderScene={SceneMap({mystay:MyStay, services:Services, payment:Payment })}
        onIndexChange={setindex}
        initialLayout={{width:Dimensions.get('window').width}}
         style={{ flex:1, width:380, left:10, justifyContent:'center'}}/>
             
    </View>

}
export default Dashboard;
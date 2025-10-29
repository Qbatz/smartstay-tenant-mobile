import React,{useState} from "react";
import { View, Text, Dimensions, Image } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import MyStay from './MyStay';
import Services from './Services'
import Payment from './Payment'
import Building from '../assets/Images/buildin.png'

function Dashboard(props) {

    const[index, setindex]=useState(0);

    const routes=[{key:'mystay', title:'MyStay'},{key:'services', title:'Services'}, {key:'payment', title:'Payment'}]
    const renderTabBar=props=>(<TabBar {...props}
    indicatorStyle={{backgroundColor:'#0227B5'}} style={{backgroundColor:'#ffffff'}}
    inactiveColor="black"
    activeColor="blue"  
    renderLabel={({route, color })=>(<Text style={{color:color}}>
        {route.title}
    </Text>)}  />)

    return <View  style={{flex:1, backgroundColor:'#ffffff'}}>
        <View style={{flexDirection:'row', paddingTop:30, paddingLeft:10, alignItems:'center'}}>
            <View style={{borderWidth:1, width:40, height:40, borderRadius:20}}></View>
            <View style={{paddingLeft:10}}>
                 <Text style={{fontSize:18, fontWeight:'500'}}>SmartHotel</Text>
            <Text style={{marginTop:5, fontSize:14}}>Puthukkadai</Text>       
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
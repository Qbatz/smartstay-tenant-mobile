import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import SmartStayLogo from "../../assets/Images/SmartStayLogo.png"
import CustometIcon from "../../assets/Images/Customer_Icon.png"
const WelcomeBackPage = () => {


    return <View style={{ flex: 1,padding:20,backgroundColor:'#ffffff' }}>

        <View style={{ alignItems: 'center', paddingTop: 70, justifyContent: 'center' }}>
            <Image source={SmartStayLogo} style={{ width: 180, height: 43, resizeMode: 'contain', marginTop: 30 }} />

            <View style={{ marginTop: 80, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={CustometIcon} style={{ width: 70, height: 70 }} />

                <Text style={{fontSize:24,fontWeight:600,marginTop:30}}>Welcome back</Text>
            </View>
        </View>

        <View  style={{flex:1,justifyContent:'center',alignItems: "center",backgroundColor:'#ffffff'}}>
           

            <TouchableOpacity   activeOpacity={1} 
            style={{borderWidth:1,borderColor:'#E6E6E6',paddingVertical:15,width:'100%',
            borderRadius:8,alignItems:'center',backgroundColor:'#1E45E1',marginBottom:5}}>
                <Text style={{fontSize:14,fontWeight:600,color:'#ffffff'}}>Login as</Text>
            </TouchableOpacity>

            <TouchableOpacity   activeOpacity={1} 
            style={{borderWidth:1,borderColor:'#E6E6E6',paddingVertical:15,width:'100%',
            borderRadius:8,alignItems:'center',backgroundColor:'#ffffff',marginTop:5}}>
                <Text style={{fontSize:14,fontWeight:600}}>Login with another Mobile.no</Text>
            </TouchableOpacity>

           

        </View>
        





    </View>

}
export default WelcomeBackPage;
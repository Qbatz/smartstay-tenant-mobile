import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import SmartStayLogo from "../../assets/Images/SmartStayLogo.png"
import CustometIcon from "../../assets/Images/Customer_Icon.png"
import { remoteData, retriveData, storeData } from "../../Utils/Storage";
import { CUSTOMERDETAIL, CUSTOMERINITIALS, CUSTOMERPROFILEPIC, LOGGEDIN, LOGGEDOUT, PHONE_NO } from "../../Utils/Constant";
import { LoginContexts } from "../../Context/LoginContext";
import { UsersContext } from "../../Context/UserContext";
import RightArrow from "../../assets/Images/arrow-right.png"
import { useNavigation } from "@react-navigation/native";
const WelcomeBackPage = () => {

    const loginContext = useContext(LoginContexts)
    const userContext = useContext(UsersContext)
    const navigation = useNavigation();

    console.log(loginContext)
    console.log(userContext)
    const [customerName, setCustomerName] = useState();
    const [customerProfilePic,setCustomerProfilePic]=useState();
    const [customerInitials,setCustomerInitials]=useState();

    useEffect(() => {
        retriveData(CUSTOMERDETAIL).then(r => {
            console.log(r)
            setCustomerName(r)
        })
         retriveData(CUSTOMERPROFILEPIC).then(r=>{
            console.log(r)
            setCustomerProfilePic(r)
         })

         retriveData(CUSTOMERINITIALS).then(r=>{
            console.log(r)
            setCustomerInitials(r)
         })
    }, [])


    const handleLoginAs = () => {
        //  loginContext.loggedin("true")
        //         storeData(LOGGEDIN,"true")
        retriveData(PHONE_NO).then(r => {
            console.log(r)
            if (r != null) {
                navigation.navigate("EnterMPin")
                  remoteData(CUSTOMERPROFILEPIC)
                   remoteData(CUSTOMERINITIALS)
                // loginContext.loggedin("true")
                // storeData(LOGGEDIN, "true")
            }
        })
    }

    const handleLoginWithAnotherNo = () => {
        // loginContext.logout("false")
        storeData(LOGGEDIN, "false")
        remoteData(PHONE_NO)
        remoteData(CUSTOMERPROFILEPIC)
        storeData(LOGGEDOUT, "false")
        remoteData(CUSTOMERINITIALS)

        loginContext.logout("temp");
        setTimeout(() => {
            loginContext.logout("false");
        }, 0);
    }


    return <View style={{ flex: 1, padding: 20, backgroundColor: '#ffffff' }}>

        <View style={{ alignItems: 'center', paddingTop: 70, justifyContent: 'center' }}>
            <Image source={SmartStayLogo} style={{ width: 180, height: 43, resizeMode: 'contain', marginTop: 30 }} />

            <View style={{ marginTop: 80, justifyContent: 'center', alignItems: 'center' }}>

                {customerProfilePic ? 

                    <Image source={{uri:customerProfilePic}} style={{ width: 70, height: 70,borderRadius:35,resizeMode:'cover'}} /> :

                    <View style={{width:70,height:70,borderRadius:35,backgroundColor: '#eef1ff',alignItems:'center',justifyContent:'center'}}>
                        <Text style={{fontSize:22,fontWeight:600, color: '#788fed',}}>{customerInitials}</Text>
                    </View>

                    

                }
                {/* <Image source={{uri:customerProfilePic}} style={{ width: 70, height: 70,borderRadius:35 }} /> */}

                <Text style={{ fontSize: 24,fontFamily:'Gilroy-Semibold', marginTop: 30, textAlign: 'center' }}>
                    Welcome back, {customerName} </Text>
            </View>
        </View>



        <View style={{ flex: 1, justifyContent: 'center', alignItems: "center" }}>
            <TouchableOpacity onPress={handleLoginAs}
                style={{
                    borderWidth: 1, borderColor: '#E6E6E6', paddingVertical: 15, width: '100%',
                    borderRadius: 8, alignItems: 'center', backgroundColor: '#1E45E1', marginBottom: 5,
                    flexDirection:"row",alignItems:'center',justifyContent:'center'
                }}>
                <Text style={{ fontSize: 14,fontFamily:'Gilroy-Semibold', color: '#ffffff'}}>
                    Login as
                </Text>
                <Image source={RightArrow} style={{ width: 16, height: 16, resizeMode: "contain",marginHorizontal:5, }} />
                <Text style={{ fontSize: 14,fontFamily:'Gilroy-Semibold', color: '#ffffff' }}>
                   +91 {loginContext.getPhoneNo}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLoginWithAnotherNo}
                style={{
                    borderWidth: 1, borderColor: '#E6E6E6', paddingVertical: 15, width: '100%',
                    borderRadius: 8, alignItems: 'center', backgroundColor: '#ffffff', marginTop: 5
                }}>
                <Text style={{ fontSize: 14,fontFamily:'Gilroy-Semibold'}}>Login with another Mobile.no</Text>
            </TouchableOpacity>

        </View>






    </View>

}
export default WelcomeBackPage;
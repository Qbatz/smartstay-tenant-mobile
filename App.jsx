/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View,Text,Image, TouchableOpacity,Dimensions } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import Dashboard from './src/Components/DashboardPage/Dashboard'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HostelList from './src/Components/HostelList'
import MystayPage from './src/Components/MystayPage';
import CreateAccount from "./src/Components/CreateAccount/CreateAccount";
import OtpDesign from './src/Components/CreateAccount/OtpDesign';
import SplashScreen from "./src/Components/WelComePage/SplashScreen";
import LogoScreen from "./src/Components/WelComePage/LogoScreen";
import OnboardingScreen from "./src/Components/WelComePage/OnboardingScreen";
import { UsersContext } from './src/Context/UserContext'
import React, { useContext, useEffect, useState } from 'react';
import UserContext from './src/Context/UserContext'
import { LoginProvider } from "./src/Context/LoginContext";
import VerifyKYC from './src/Components/KycDocuments/VerifyKYC';
import SuccessModal from './src/Components/ToastFile/TostFilePage'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NativeModules } from 'react-native';


// import VerifyKYC from './src/Components/KycDocuments/VerifyKYC'

import KYCUpload from './src/Components/KycDocuments/UploadKYC'
import KycSuccessDesign from './src/Components/KycDocuments/KycSuccess';
import CustomerProfile from './src/Components/CustomerProfile/CustomerProfile';
import Notification from './src/Components/Notification/Notification';
import EditProfile from './src/Components/CustomerProfile/EditProfile'
import Agreement from './src/Components/RentalAggreements/Aggreements';
import SignatureScreen from './src/Components/RentalAggreements/SignatureScreen'
import ReceiptPdfView from './src/Components/ReceiptPdfviewer';
import AgreementViewScreen from './src/Components/RentalAggreements/AggreementView';
import NOCBillPdf from './src/Components/NocBillPdf';
import NOCReceiptPdf from './src/Components/NocReceipt';
import InvoiceDesign from './src/Components/Payments/BillPDF';
import { ACCESS_TOKEN, FCM_TOKEN, LOGGEDIN, PHONE_NO, SHOULD_TOKEN_UPDATE, USERID } from './src/Utils/Constant';
import CreateMpin from './src/Components/CreateAccount/CreateMpin';
import ConfirmMPin from './src/Components/CreateAccount/ConfirmMPin';
import LoginPage from './src/Components/CreateAccount/LoginPage';
import LoginMobileScreen from './src/Components/CreateAccount/LoginPage';
import MotorRoom from './src/Components/WelcomeLogin';
import LoginScreen from './src/Components/WelcomeLogin';
import ProfileHostels from './src/Components/CustomerProfile/ProfileHostels';
import EnterMPin from './src/Components/CreateAccount/EnterMPin';
import NoInternet from './src/assets/Images/noInternet.png'
import { LoginContexts } from './src/Context/LoginContext';
import RentalAgreement from './src/Components/CustomerProfile/RentalAgreement';
import ComplaintContext from './src/Context/ComplaintContext';
import AmenitiesContext from './src/Context/AmenitiesContext';

import { storeData, retriveData } from './src/Utils/Storage';
import PaymentContext from './src/Context/PaymentContext';
import SuccessFlow from './src/SuccessFlow';



const { width, height } = Dimensions.get("window");

function App() {

  const isDarkMode = useColorScheme() === 'dark';


  const [loggedIn, setloggein] = useState()
  const [token, setToken] = useState();

  useEffect(() => {
    retriveData(LOGGEDIN).then(r => {
      setloggein(r)
    })

    retriveData(ACCESS_TOKEN).then(r => {
      setToken(r)
    })
  }, [])





  return (
    // 


    //   </SafeAreaProvider>

    //  <SafeAreaProvider>
    //   <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
    //   <UserContext>
    //     <AppContent />
    //   </UserContext>
    // </SafeAreaProvider>
    <GestureHandlerRootView>

      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
           <LoginProvider>
              <UserContext>
                <ComplaintContext>
                  <AmenitiesContext>
                    <PaymentContext>
                        <AppContent isLoggedIn={loggedIn} token={token} />
                    </PaymentContext>
                  </AmenitiesContext>                 
                </ComplaintContext>
              </UserContext>
            </LoginProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>


  );
}

function AppContent(props) {
  
  const Navigation = createStackNavigator();
  const { NotificationModule, CommonModule } = NativeModules;

  const context = useContext(UsersContext);
  const loginContext=useContext(LoginContexts)
  const [isLoggedIn, setIsLoggedIn] = useState()
  const [initialRoute,setInitialRoute]=useState()
  const [fcmToken, setFCMToken] = useState()
  const [isMpinVerified, setMpinVerified]=useState(false)

  //  const initialRoute = loginContext.getRoute === "confirmMPin" ? "HostelList": "EnterMPin";

  const getFCMToken = async ( newToken ) => {
    const token = await retriveData(FCM_TOKEN)
     if (token !== newToken || token === null || token === undefined) {
          console.log("******")
          storeData(FCM_TOKEN, newToken)
          storeData(SHOULD_TOKEN_UPDATE, "true")
        }
    return token;
  }


    useEffect(() => {
      NotificationModule.fetchFcmToken().then(r => {
      if (r != null) {
        setFCMToken(fcmToken)
        getFCMToken(r);
       
      }
    }).catch(error => {
      console.log(error)
    })
    }, [])


  useEffect(() => {

    CommonModule.fetchSerialNumber().then(r => {
      loginContext.serialNo(r)
      console.log(r)
    }).catch(error => {
      console.log(error)
    })

    CommonModule.checkInternet().then(r=>{
    loginContext.internet(r)
    }).catch(error=>{
      console.log(error)
    })

    if(props.token!=null){
      loginContext.updateToken(props.token)
    }

    retriveData(LOGGEDIN).then(r=>{
      if(r=="true"){
        setIsLoggedIn('true')
        loginContext.updateRoute("null")
      }
    })

  }, [loginContext.loggedIn])

  useEffect(() => {
    if (loginContext.LoggedIn) {
      setIsLoggedIn(loginContext.LoggedIn)
    }

    retriveData(ACCESS_TOKEN).then(r=>{
      loginContext.updateToken(r)
    })
    retriveData(PHONE_NO).then(r=>{
      loginContext.phoneNo(r)
    })

    retriveData(USERID).then(r=>{
      loginContext.userId(r)
    })
  }, [loginContext.LoggedIn])

  const checkInternet=()=>{
    CommonModule.checkInternet().then(r=>{
      loginContext.internet(r)
    }).catch((error)=>{
      console.log(error)
    })
  }

  const verifiedmpin=()=>{
    setMpinVerified(true)
  }

  return (

    <View style={styles.container}>
      {isLoggedIn === "true" ? 
        
        <SuccessFlow/>
         
      //   
      : <NavigationContainer>

        <Navigation.Navigator screenOptions={{ headerShown: false }} initialRouteName='SplashScreen'>
          {/* <Navigation.Screen name='WelcomeBack' component={LoginScreen}/> */}
          <Navigation.Screen name="LogoScreen" component={LogoScreen} />
          <Navigation.Screen name="SplashScreen" component={SplashScreen} />
          <Navigation.Screen name="OnboardingScreen" component={OnboardingScreen} />
          <Navigation.Screen name="CreateAccount" component={CreateAccount} />
          <Navigation.Screen name="OtpDesign" component={OtpDesign} />
          <Navigation.Screen name='CreateMpin' component={CreateMpin}/>
          <Navigation.Screen name='ConfirmMPin' component={ConfirmMPin}/>
          <Navigation.Screen name='LoginPage' component={LoginMobileScreen}/>
          
        </Navigation.Navigator>
      </NavigationContainer>}

     {loginContext.getNetworkConnectivity !=true && <View style={styles.noInternetContainer}>
                  <View style={{ justifyContent: 'center', alignItems: 'center',flex:1 }}>
                      
                      <Image source={NoInternet} style={{width:350,height:246}} />
                      <Text style={{fontSize: 22,fontWeight: '700',color: '#000',marginBottom: 8,marginTop:20}}>
                          You're Offline
                      </Text>
                      <Text style={styles.content}>
                         No Internet Connection found! Check your Connection or try again
                      </Text>
                      
                      <TouchableOpacity onPress={checkInternet} style={styles.tryagain}>
                              <Text style={{fontSize:16,fontWeight:400,color:'#ffffff'}}>Try again</Text>
                      </TouchableOpacity>
                  </View>
              </View>} 




      {/* <NavigationContainer >
      <Navigation.Navigator screenOptions={{headerShown:false}} initialRouteName='SplashScreen'>

        <Navigation.Screen name="HostelList" component={HostelList} />
        <Navigation.Screen name='Dashboard' component={Dashboard}/>  
        <Navigation.Screen name='MyStayPage' component={MystayPage}/> 
        <Navigation.Screen name="SplashScreen" component={SplashScreen} />
        <Navigation.Screen name="LogoScreen" component={LogoScreen} />
        <Navigation.Screen name="OnboardingScreen" component={OnboardingScreen} />
        <Navigation.Screen name="CreateAccount" component={CreateAccount} />
        <Navigation.Screen name="OtpDesign" component={OtpDesign} />
        <Navigation.Screen name="VerifyKYC" component={VerifyKYC} />
        <Navigation.Screen name="KYCUpload" component={KYCUpload} />
        <Navigation.Screen name="KycSuccess" component={KycSuccessDesign} />
        <Navigation.Screen name="CustomerProfile" component={CustomerProfile} />
        <Navigation.Screen name="Notification" component={Notification} />
        <Navigation.Screen name="EditProfile" component={EditProfile} />
        <Navigation.Screen name="Agreement" component={Agreement} />
        <Navigation.Screen name="SignatureScreen" component={SignatureScreen} />
        <Navigation.Screen name="ReceiptPdfView" component={ReceiptPdfView} />
        <Navigation.Screen name="AgreementViewScreen" component={AgreementViewScreen} />
        <Navigation.Screen name="SuccessModal" component={SuccessModal} />

        <Navigation.Screen name="NocBillPdf" component={NOCBillPdf} />
        <Navigation.Screen name="NocReceiptPdf" component={NOCReceiptPdf} />
         <Navigation.Screen name="InvoiceDesign" component={InvoiceDesign} />


        
      </Navigation.Navigator>
    </NavigationContainer> */}





      {/* <Dashboard
        templateFileName="App.jsx"
        safeAreaInsets={safeAreaInsets}
      /> */}
    </View>
  );

}




const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noInternetContainer:{
     position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      flex:1,
      alignItems: "center",
      backgroundColor: "#fff", // Optional: removes overlap visibility
      paddingHorizontal: 16,
      zIndex: 999, // ensures it appears on top
  },
  content: { fontSize: 16, fontWeight:400, color: '#555', textAlign: 'center', width: 270, lineHeight: 18,marginTop:10 },
  tryagain:{backgroundColor:'#1E45E1',justifyContent:'center',alignItems:'center',paddingVertical:15, marginTop:height*0.1,
                        width:width*0.8,borderRadius:10}
});



export default App;


// <NavigationContainer>
      //   <Navigation.Navigator screenOptions={{ headerShown: false }} initialRouteName= 'Dashboard'>
      //     <Navigation.Screen name='EnterMPin' component={EnterMPin}/>
      //     <Navigation.Screen name='HostelList' component={HostelList} />
      //     <Navigation.Screen name="KYCUpload" component={KYCUpload} />
      //     <Navigation.Screen name='VerifyKYC' component={VerifyKYC}/>
      //     <Navigation.Screen name="KycSuccess" component={KycSuccessDesign} />
      //     <Navigation.Screen name='Dashboard' component={Dashboard} />
      //     <Navigation.Screen name="CustomerProfile" component={CustomerProfile} />
      //     <Navigation.Screen name='ProfileHostels' component={ProfileHostels}/>
      //     <Navigation.Screen name='RentalAgreement' component={RentalAgreement}/>
      //     <Navigation.Screen name="Notification" component={Notification} />
      //     <Navigation.Screen name="EditProfile" component={EditProfile} />
      //     <Navigation.Screen name="Agreement" component={Agreement} />
      //     <Navigation.Screen name="SignatureScreen" component={SignatureScreen} />
      //     <Navigation.Screen name="ReceiptPdfView" component={ReceiptPdfView} />
      //     <Navigation.Screen name="AgreementViewScreen" component={AgreementViewScreen} />
      //     <Navigation.Screen name="SuccessModal" component={SuccessModal} />
      //     <Navigation.Screen name="NocBillPdf" component={NOCBillPdf} />
      //     <Navigation.Screen name="NocReceiptPdf" component={NOCReceiptPdf} />
      //     <Navigation.Screen name="InvoiceDesign" component={InvoiceDesign} />
      //   </Navigation.Navigator>

      // </NavigationContainer> 
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
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
import React, { useContext, useEffect } from 'react';
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




function App() {

  const isDarkMode = useColorScheme() === 'dark';



  console.log(NativeModules)

  const { NotificationModule }=NativeModules;
  const{CommonModule}=NativeModules;
  

  useEffect(()=>{
    NotificationModule.fetchFcmToken().then(r=>{
      console.log(r)
    }).catch(error=>{
      console.log(error)
    })

    CommonModule.fetchSerialNumber().then(r=>{
      console.log(r)
    }).catch(error=>{
      console.log(error)
    })
  },[])



  return (
  //   <SafeAreaProvider>
  //     <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
  //      <UserContext>
  //   <AppContent />
  // </UserContext>
      

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
          <AppContent />
        </UserContext>
      </LoginProvider>
    </SafeAreaProvider>
    </GestureHandlerRootView>


  );
}

function AppContent() {

  const Navigation = createStackNavigator();
  const { NotificationModule,CommonModule }=NativeModules;

  const context = useContext(UsersContext);

  useEffect(()=>{
    NotificationModule.fetchFcmToken().then(r=>{
      console.log(r)
    }).catch(error=>{
      console.log(error)
    })

    CommonModule.fetchSerialNumber().then(r=>{
      context.serialNo(r)
    }).catch(error=>{
      console.log(error)
    })
  },[])




  // // enable this when ontime login is setup

  // <NavigationContainer>
  //       <Navigation.Navigator>
  //         <Navigation.Screen name='Login' component={Login}/>
  //         <Navigation.Screen name='EmailAddresspage' component={EmailAddressPage}/>
  //         <Navigation.Screen name='ForgotPassword' component={ForgotPassword}/>         
  //       </Navigation.Navigator>
  //   </NavigationContainer>

  return (

    <View style={styles.container}>
    <NavigationContainer >
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
    </NavigationContainer>

    


  
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
});



export default App;

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
import React, { useContext } from 'react';
import UserContext from './src/Context/UserContext'

import VerifyKYC from './src/Components/KycDocuments/VerifyKYC'


// import VerifyKYC from './src/Components/KycDocuments/VerifyKYC'

import KYCUpload from './src/Components/KycDocuments/UploadKc'
import KycSuccessDesign from './src/Components/KycDocuments/KycSuccess';
import CustomerProfile from './src/Components/CustomerProfile/CustomerProfile';
import Notification from './src/Components/Notification/Notification';
import EditProfile from './src/Components/CustomerProfile/EditProfile'
import Agreement from './src/Components/RentalAggreements/Aggreements';
import SignatureScreen from './src/Components/RentalAggreements/SignatureScreen'
import AgreementViewScreen from './src/Components/RentalAggreements/AggreementView';



function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const context = useContext(UsersContext);

  console.log(context)

  

  return (
  //   <SafeAreaProvider>
  //     <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
  //      <UserContext>
  //   <AppContent />
  // </UserContext>
      

  //   </SafeAreaProvider>

     <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <UserContext>
        <AppContent />
      </UserContext>
    </SafeAreaProvider>


  );
}

function AppContent() {

  const Navigation = createStackNavigator();


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

     
    

      <Navigation.Navigator screenOptions={{headerShown:false}} initialRouteName='Dashboard'>
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
         <Navigation.Screen name="AgreementViewScreen" component={AgreementViewScreen} />


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

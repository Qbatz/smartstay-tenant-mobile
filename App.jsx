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
import Dashboard from './src/Components/Dashboard';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HostelList from './src/Components/HostelList'
import MystayPage from './src/Components/MystayPage';
import SplashScreen from "./src/Components/WelComePage/SplashScreen";
import LogoScreen from "./src/Components/WelComePage/LogoScreen";
import OnboardingScreen from "./src/Components/WelComePage/OnboardingScreen";

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const Navigation=createStackNavigator();

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

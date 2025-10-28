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
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Dashboard from './Pages/Dashboard';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

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
  const safeAreaInsets = useSafeAreaInsets();
  const Navigation=createStackNavigator();

  return (
    <View style={styles.container}>
    <NavigationContainer >
      <Navigation.Navigator screenOptions={{headerShown:false}}>
        <Navigation.Screen name='Dashboard' component={Dashboard } />
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

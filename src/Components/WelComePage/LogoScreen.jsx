import React, { useRef, useEffect } from "react";
import { View, Text, Image, Animated, StyleSheet } from "react-native";
import Logo from '../../assets/Images/Logo.png'
import SmartStayLogo from '../../assets/Images/SmartStayLogo.png'

export default function Splash({navigation}) {
  const scale = useRef(new Animated.Value(8)).current; // already zoomed in
  const logoMove = useRef(new Animated.Value(20)).current; // start slightly lower

  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineMove = useRef(new Animated.Value(150)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(logoMove, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(taglineMove, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    const timer= setTimeout(() => {
        navigation.replace('OnboardingScreen')
    }, 3000);

    return()=> clearTimeout(timer)
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          alignItems: "center",
          transform: [{ scale }, { translateY: logoMove }],
        }}
      >
            <Image source={SmartStayLogo} style={styles.logo} />
            
      </Animated.View>

      <Animated.Text
        style={[
          styles.subtitle,
          {
            opacity: taglineOpacity,
            transform: [{ translateY: taglineMove }],
          },
        ]}
      >
        Meet all your needs
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 257.99,
    height: 67.68,
    resizeMode: "contain",
  },
  subtitle: {
    position: "absolute",
    fontSize: 19.35,
    fontWeight:400,
    marginTop:150,
    color:'#393939'
  },
});

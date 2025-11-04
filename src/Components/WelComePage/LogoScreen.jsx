import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Image } from "react-native";
import smartlogo from "../../assets/Images/smartlogo.png"

export default function LogoScreen({ navigation }) {
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      navigation.replace("OnboardingScreen");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={smartlogo}
        style={[styles.logo, { transform: [{ scale: scaleAnim }] }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
});

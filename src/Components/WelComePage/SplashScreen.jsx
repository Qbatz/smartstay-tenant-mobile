import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("LogoScreen");
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.bigText}>Smartstay</Text>
      <Text style={styles.tagline}>All Your Needs</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8fc",
    justifyContent: "center",
    alignItems: "center",
  },
  bigText: {
    position: "absolute",
    fontSize: width * 0.25,
    color: "#000",
    opacity: 0.05,
    fontWeight: "bold",
    textAlign: "center",
  },
  tagline: {
    position: "absolute",
    bottom: 80,
    fontSize: 18,
    color: "#000",
    opacity: 0.04,
    fontWeight: "500",
  },
});

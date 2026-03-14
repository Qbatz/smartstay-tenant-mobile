import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import ComingSoonPic from "../../assets/Images/ComingSoonPic.png"


const ComingSoon=({ navigation })=> {
  return (
    <View style={styles.container}>
      {/* Illustration */}
      <Image
        source={ComingSoonPic} 
        style={styles.illustration}
        resizeMode="contain"
      />

      {/* Title */}
      <Text style={styles.title}>
        We’re still working on this{"\n"}feature!
      </Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Our team is building something helpful for you.
        {"\n"}
        Check back again shortly.
      </Text>

      {/* Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>←   Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  illustration: {
    width: 314.27,
    height: 221.87,
    marginBottom: 36,
    marginTop: -40,
  },

  title: {
    fontSize: 22,
    fontFamily:'Gilroy-Semibold',
    color: "#1B1C1E",
    textAlign: "center",
    marginBottom: 14,
  },

  subtitle: {
    fontSize: 15,
    fontFamily:'Gilroy-Medium',
    color: "#6F6F6F",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 40,
  },

  button: {
    backgroundColor: "#1447FF",
    width: "88%",
    height: 54,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    fontSize: 17,
    fontFamily:'Gilroy-Semibold',
    color: "#FFFFFF",
  },
});

export default ComingSoon;

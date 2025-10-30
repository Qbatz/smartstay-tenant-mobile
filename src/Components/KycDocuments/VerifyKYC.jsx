import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

export default function VerifyKYC({ navigation }) {
  return (
    <View style={styles.container}>
    
    <TouchableOpacity
  style={styles.skipButton}
  onPress={() => navigation.navigate("Dashboard")}
>
  <Text style={styles.skipText}>Skip</Text>
</TouchableOpacity>

    
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/Images/Sm_logo.png")}
        
          resizeMode="contain"
        />
       
      </View>

    
      <Image
        source={require("../../assets/Images/kyc.png")}
        style={styles.kycImage}
        resizeMode="contain"
      />

    
      <View style={styles.text}>
        <Text style={styles.title}>Verify Your KYC</Text>

    
      <Text style={styles.subtitle}>
        We Need to Verify Your KYC Before you{"\n"}can enter your Profile.
      </Text>
      </View>

    
      {/* <TouchableOpacity style={styles.verifyButton}>
        <Text style={styles.verifyButtonText}>Verify →</Text>
      </TouchableOpacity> */}
      <TouchableOpacity
  style={styles.verifyButton}
  onPress={() => navigation.navigate("KYCUpload")} 
>
  <Text style={styles.verifyButtonText}>Verify →</Text>
</TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  skipButton: {
    position: "absolute",
    top: 60,
    right: 25,
  },
  text:{
marginBottom:260
  },
  skipText: {
    color: "#000",
    fontSize: 15,
    fontWeight: "500",
  },
  logoContainer: {
    alignItems: "center",
    position: "absolute",
    top: 120,
  },
 
  logoText: {
    color: "#1A73E8",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 8,
  },
  kycImage: {
    width: 120,
    height: 120,
   
    
  
  },
  title: {
    fontSize: 25,
    fontWeight: "700",
    color: "#000",
    textAlign:"center"
  
    
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22,
  },
  verifyButton: {
    backgroundColor: "#1A73E8",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 10,
  marginBottom:60,
    alignItems: "center",
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

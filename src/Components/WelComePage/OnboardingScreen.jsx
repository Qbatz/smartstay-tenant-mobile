import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import onboardImg from "../../assets/Images/image 6345209.png"

export default function OnboardingScreen({ navigation }) {

  const handleCreateAccount = () => {
    navigation.navigate("CreateAccount");
  }
  return (
    <View style={styles.container}>
     

      <View style={styles.card}>
        <Image
          source={onboardImg}
          style={styles.image}
        />
        <Text style={styles.title}>Manage Your Stay Smartly</Text>
        <Text style={styles.desc}>
          Access your room info, stay duration, and communicate seamlessly with
          your host. Stay updated and connected with your property.
        </Text>

        <View style={styles.dots}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => console.log("Go to login or home")}
        >
          <Text style={styles.buttonText} onPress={handleCreateAccount}>Get Started →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center" },
  logo: { width: 120, height: 50, marginTop: 60, resizeMode: "contain" },
  card: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
  },
  image: { width: 220, height: 180, resizeMode: "contain", marginVertical: 20 },
  title: { fontSize: 20, fontWeight: "bold", color: "#000", marginBottom: 10 },
  desc: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    lineHeight: 20,
  },
  dots: { flexDirection: "row", marginBottom: 30 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  activeDot: { backgroundColor: "#007bff" },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

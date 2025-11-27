import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import Swiper from "react-native-swiper";
import onboardImg from "../../assets/Images/image 6345209.png";
import Logo from "../../assets/Images/Logo.png";

const { width } = Dimensions.get("screen");

export default function OnboardingScreen({ navigation }) {
  const goNext = () => {
    navigation.navigate("CreateAccount");
  };

  return (
    <View style={styles.container}>

      <View style={styles.logoRow}>
        <Image source={Logo} style={styles.logo} />
        <Text style={styles.logoText}>Smartstay</Text>
      </View>
      <View style={styles.tag}>
        <Text style={styles.tagText}>TENANT APP</Text>
      </View>

      <Swiper
        loop
        showsPagination
        autoplay autoplayTimeout={3}
        dot={<View style={styles.dot} />}
        activeDot={<View style={styles.activeDot} />}
        paginationStyle={{ bottom: 200 }}
      >
        <View style={styles.card}>
          <Image source={onboardImg} style={styles.image} />

          <Text style={styles.title}>Manage Your Stay</Text>
          <Text style={styles.title}>Smartly</Text>

          <Text style={styles.desc}>
            Access your room info, stay duration, and announcements anytime
            with just a tap. Stay updated and connected with your property.
          </Text>
        </View>

        <View style={styles.card}>
          <Image source={onboardImg} style={styles.image} />

          <Text style={styles.title}>Quick Access</Text>
          <Text style={styles.title}>To Everything</Text>

          <Text style={styles.desc}>
            Stay aware of payments, services, and hostel updates easily.
          </Text>
        </View>
      </Swiper>

      <TouchableOpacity style={styles.button} onPress={goNext}>
        <Text style={styles.buttonText}>Get Started →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 70,
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: { width: 36, height: 36, resizeMode: "contain", marginRight: 8 },
  logoText: { fontSize: 24, fontWeight: "700", color: "#000" },
  tag: {
    backgroundColor: "#1E45E1",
    borderRadius: 3,
    paddingHorizontal: 12,
    paddingVertical: 3,
    marginTop: 6,
    marginLeft:60
  },
  tagText: { fontSize: 11, color: "#fff", fontWeight: "600" },

  card: {
    width: width * 0.8,
    alignSelf: "center",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    paddingHorizontal: 22,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: "#E3E7FF",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
    marginTop:100
  },

  image: { width: 280, height: 220, resizeMode: "contain", marginBottom: 25 },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
    lineHeight: 28,
  },
  desc: {
    textAlign: "center",
    fontSize: 13,
    color: "#555",
    marginTop: 14,
    width: width * 0.75,
    lineHeight: 20,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#C9CCD6",
    marginHorizontal: 5,
  },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1E45E1",
  },

  button: {
    backgroundColor: "#1E45E1",
    width: width * 0.8,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    position: "absolute",
    bottom: 30,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});

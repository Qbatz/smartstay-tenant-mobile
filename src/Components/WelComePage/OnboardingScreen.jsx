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

const { width, height } = Dimensions.get("window");

export default function OnboardingScreen({ navigation }) {
  const goNext = () => {
    navigation.navigate("CreateAccount");
  };

  return (
    <View style={styles.container}>
      {/* LOGO */}
      <View style={styles.logoContainer}>
        <Image source={Logo} style={styles.logo} />
        <Text style={styles.logoText}>Smartstay</Text>
      </View>

      <View style={styles.tag}>
        <Text style={styles.tagText}>TENANT APP</Text>
      </View>

      {/* SWIPER */}
      <View style={styles.swiperContainer}>
        <Swiper
          loop
          showsPagination
          activeDot={<View style={styles.activeDot} />}
          dot={<View style={styles.dot} />}
          paginationStyle={{ bottom: height*0.1}}
        >
          {/* SLIDE 1 */}
          <View style={styles.card}>
            <Image source={onboardImg} style={styles.image} />
            <Text style={styles.title}>Manage Your Stay</Text>
            <Text style={styles.title}>Smartly</Text>

            <Text style={styles.desc}>
              Access your room info, stay duration, and announcements anytime
              with just a tap. Stay updated and connected with your property.
            </Text>
          </View>

          {/* SLIDE 2 */}
          <View style={styles.card}>
            <Image source={onboardImg} style={styles.image} />
            <Text style={styles.title}>Quick Access</Text>
            <Text style={styles.title}>To Everything</Text>

            <Text style={styles.desc}>
              Stay aware of payments, services, and hostel updates easily.
            </Text>
          </View>
        </Swiper>
      </View>

      {/* BUTTON */}
      <View style={{flex:1}}>
          <TouchableOpacity style={styles.button} onPress={goNext}>
        <Text style={styles.buttonText}>Get Started →</Text>
      </TouchableOpacity>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: height * 0.08,
    alignItems: "center",
  },

  /* LOGO AREA */
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  logo: {
    width: 36,
    height: 36,
    resizeMode: "contain",
    marginRight: 8,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
  },
  tag: {
    backgroundColor: "#1E45E1",
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 3,
    marginBottom: 25,
    marginLeft:50,
  },
  tagText: {
    fontSize: 11,
    color: "#fff",
    fontWeight: "600",
  },

  /* SWIPER */
  swiperContainer: {
    flex:1,
    width: width,
    height: height * 0.3,
    justifyContent: "center",
    alignItems: "center",
    marginTop:width*0.2,
  },

  card: {
    width: width * 0.85,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: "#E3E7FF",
    alignSelf: "center",

    // subtle shadow
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },

  image: {
    width: width * 0.7,
    height: height * 0.22,
    resizeMode: "contain",
    marginBottom: 24,
  },

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
    marginTop: 12,
    lineHeight: 20,
    width: width * 0.75,
  },

  /* DOTS */
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#C9CCD6",
    marginHorizontal: 4,
  },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1E45E1",
  },

  /* BUTTON */
  button: {
     width: width * 0.85,
    backgroundColor: "#1E45E1",
    borderRadius: 12,
    paddingVertical: 16,
     borderRadius: 12,
     alignItems: "center",
    //  position: "absolute",
    
    // backgroundColor: "#1E45E1",
    // width: width * 0.85,
    // paddingVertical: 16,
    // borderRadius: 12,
    // alignItems: "center",
    // position: "absolute",
    // bottom: height * 0.05,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

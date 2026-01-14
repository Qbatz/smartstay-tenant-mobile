import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import Swiper from "react-native-swiper";

import onboardImg from "../../assets/Images/image 6345209.png";
import Logo from "../../assets/Images/Logo.png";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function OnboardingScreen({ navigation }) {
  const goNext = () => {
    navigation.navigate("CreateAccount");
  };

  return (
    <SafeAreaView style={{flex:1}} edges={['top','bottom']}>
      <View style={styles.container}>
        {/* SCROLLABLE CONTENT */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
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
              paginationStyle={{ bottom: height * 0.1 }}
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
                <Text style={styles.title}>Raise Services &</Text>
                <Text style={styles.title}>Track Easily</Text>

                <Text style={styles.desc}>
                  Report maintanence issue or request amenities effortlessly. Track your service status in real time - no waiting, no confusion
                </Text>
              </View>

              {/* {--slide 3--} */}
               <View style={styles.card}>
                <Image source={onboardImg} style={styles.image} />
                <Text style={styles.title}>View & Pay Bills</Text>
                <Text style={styles.title}>Seamlessly</Text>

                <Text style={styles.desc}>
                  Check your rent, electricity and other bills in one screen. Future ready for instant online payments and payment history tracking
                </Text>
              </View>
            </Swiper>
          </View>
        </ScrollView>

        {/* FIXED BOTTOM BUTTON */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={goNext}>
            <Text style={styles.buttonText}>Get Started →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: height * 0.03,
  },

  /* LOGO */
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
    marginLeft: 50,
  },

  tagText: {
    fontSize: 11,
    color: "#fff",
    fontWeight: "600",
  },

  /* SWIPER */
  swiperContainer: {
    flex: 1,
    width: width,
    height: height * 0.3,
    justifyContent: "center",
    alignItems: "center",
    marginTop: width * 0.2,
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
  buttonContainer: {
    paddingBottom: height * 0.04,
    alignItems: "center",
  },

  button: {
    width: width * 0.85,
    backgroundColor: "#1E45E1",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

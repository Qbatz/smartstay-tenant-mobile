import React, { useContext } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, NativeModules } from "react-native";
import { notificationContexts } from "../../Context/NotificationContext";
import { LoginContexts } from "../../Context/LoginContext";
import { useNavigation } from "@react-navigation/native";
const NotificationItem = ({ item }) => {
  const iconMap = {
    alert: require("../../assets/Images/money-check.png"),
    info: require("../../assets/Images/command.png"),
    bill: require("../../assets/Images/command.png"),
    user: require("../../assets/Images/user-add.png"),
    Complaint: require("../../assets/Images/NK.png"),
    resolved: require("../../assets/Images/money-check.png"),
  };

  const notificatioContext = useContext(notificationContexts)
  const loginContext = useContext(LoginContexts)
  const { CommonModule } = NativeModules;
  const navigation = useNavigation();
  console.log(CommonModule)
  console.log(loginContext.getToken)

  const handleKycRequest = (entityId, mobileNo, tokenId) => {
    console.log(entityId, mobileNo, tokenId)

    CommonModule.verifyKyc(mobileNo, entityId, tokenId)
  }

  const handleViewDetails = (sourceId, type) => {
    console.log("billana")
    console.log(sourceId, type)
    if (type === "INVOICE_GENERATION") {
      // navigation.navigate("Dashboard")
      navigation.navigate("Dashboard", {
        initialTab: "payment",
        sourceId: sourceId,
      });
    }
  }

  return (
    <TouchableOpacity
      onPress={() => {
        if (item?.fullNotificationType == "KYC_REQUEST") {
          (handleKycRequest(item?.kycInfo?.entityId, item?.kycInfo?.tenantMobile, item?.kycInfo?.accessTokenId))
        } else {
          handleViewDetails(item?.sourceId, item?.fullNotificationType)
        }
      }

      }


      style={styles.card}>
      <View style={styles.iconContainer}>
        {/* <Image source={iconMap[item.notificationType]} style={styles.iconImage} /> */}
        {notificatioContext?.getNotificationList?.hostelLogoUrl != null ?
          <Image source={{ uri: notificatioContext?.getNotificationList?.hostelLogoUrl }} style={styles.hostelImage} />
          :
          <View style={[styles.hostelImage, styles.initialContainer]}>
            <Text style={styles.initialText}>
              {notificatioContext?.getNotificationList?.hostelInitials}
            </Text>
          </View>}
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.time}>{item.createdDate}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationItem;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  iconImage: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Gilroy-Semibold',
    fontSize: 15,
    color: "#111827",
  },
  description: {
    color: "#6B7280",
    fontSize: 13,
    fontFamily: 'Gilroy-Regular',
    marginTop: 3,
  },
  time: {
    color: "#9CA3AF",
    fontSize: 12,
    fontFamily: 'Gilroy-Regular',
    marginTop: 5,
    alignSelf: "flex-end",
  },
  hostelImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  initialText: {
    color: '#788fed',
    fontSize: 20,
    fontWeight: 'bold',
  },

  initialContainer: {
    backgroundColor: '#eef1ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

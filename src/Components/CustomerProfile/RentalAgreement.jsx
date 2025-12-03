import React from "react";
import { View, Text, Image, StyleSheet,TouchableOpacity } from "react-native";
import ViewIcon from "../../assets/Images/view.png";
import DownloadIcon from "../../assets/Images/download.png";
import LeftArrow from "../../assets/Images/LeftArrow.png"
import { useNavigation } from "@react-navigation/native";




const RentalAgreement = () => {

    const navigation = useNavigation();

    const handleDownload = async () => {
        try {
          const response = await fetch("https://smartstaytestingapi.s3remotica.com/invoice/invoice-list-pdf", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTkzLCJzdWIiOjE5MywidXNlcl90eXBlIjoiYWRtaW4iLCJyb2xlX2lkIjowLCJwbGFuX2NvZGUiOiJvbmVfZGF5IiwicGxhbl9zdGF0dXMiOjEsImlhdCI6MTc2MjQxMDIzOSwiZXhwIjoxNzYyNDEyMDM5fQ.BNCXjNx4B9AH0UV9Yy_dXnnBLzjfDUY7qOJOzuxlS2E`,
            },
            body: JSON.stringify({
              Date: "2025-11-01",
              User_Id: "NOTI1629",
              id: 2148,
            }),
          });
    
          const data = await response.json();
    
          const pdfUrl = data?.pdf_url;
    
          if (pdfUrl) {
            const supported = await Linking.canOpenURL(pdfUrl);
            if (supported) {
              await Linking.openURL(pdfUrl);
            } else {
              Alert.alert("Error", "Cannot open this PDF link");
            }
          } else {
            Alert.alert("No PDF found in response");
          }
        } catch (error) {
          console.error("PDF open error:", error);
          Alert.alert("Error", "Failed to open PDF");
        }
      };

      const handleBack = () => navigation.goBack();


    return <View style={{ flex: 1,backgroundColor:'#ffffff',paddingTop:30,paddingHorizontal:20,paddingBottom:20 }}>

         <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                    <Image
                      source={LeftArrow}
                      style={{ height: 25, width: 25 }}
                    />
                  </TouchableOpacity>
                  <Text style={styles.header}>Customer Profile</Text>
                </View>

        <View style={styles.card}>
            <Text style={styles.sectionTitle}>Rental Agreement</Text>
            <Text style={styles.warningText}>
                Complete your Rental Agreement E-Sign to fully activate your account.
            </Text>
            <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate("Agreement")}>
                <Text style={styles.primaryButtonText}>Complete E-Sign Now</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.card}>
            <Text style={styles.sectionTitle}>Rental Agreement</Text>
            <Text style={styles.subtitle}>
                View your Rental Agreement Details as PDF
            </Text>
            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.outlineButton} onPress={() => navigation.navigate("AgreementViewScreen")}>
                    <Text style={styles.outlineButtonText}>View</Text>
                    <Image source={ViewIcon} resizeMode="contain" style={{ width: 20, height: 20, marginLeft: 8 }} />
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.primaryButtonSmall}>
                          <Text style={styles.primaryButtonText}>Download</Text>
                             <Image  source={DownloadIcon} resizeMode="contain" style={{ width: 20, height: 20 , marginLeft:8 }}/>
                        </TouchableOpacity> */}
                <TouchableOpacity style={styles.primaryButtonSmall} onPress={handleDownload}>
                    <Text style={styles.primaryButtonText}>Download</Text>
                    <Image source={DownloadIcon} resizeMode="contain" style={{ width: 20, height: 20, marginLeft: 8 }} />
                </TouchableOpacity>


            </View>
        </View>
    </View>

}

const styles = StyleSheet.create({
    backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
    marginBottom: 5,
  },
  header: {
    fontSize: 22,
    fontWeight: "600",
    marginLeft: 10,
  },
    card: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#eee",
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: "600",
        color: "#000",
        marginBottom: 8,
    },
    warningText: {
        backgroundColor: 'rgba(255, 246, 244, 1)',
        color: "rgba(255, 0, 0, 1)",
        fontSize: 13,
        marginBottom: 10,
        padding: 5
    },
    primaryButton: {
        backgroundColor: "#0057FF",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    primaryButtonText: {
        color: "#fff",
        fontWeight: "600",
    },
     subtitle: {
    color: "#777",
    fontSize: 13,
  },
   subtitle: {
    color: "#777",
    fontSize: 13,
  },
  outlineButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#0057FF",
    paddingVertical: 10,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'center'
  },
  outlineButtonText: {
    color: "#0057FF",
    fontWeight: "600",
  },
  primaryButtonSmall: {
    flex: 1,
    backgroundColor: "#0057FF",
    paddingVertical: 10,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'center'
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 10,
  },
})
export default RentalAgreement;


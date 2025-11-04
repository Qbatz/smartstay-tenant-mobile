import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import uploadimg from "../../assets/Images/camera.png"

export default function KYCUpload({ navigation }) {
  const [selectedType, setSelectedType] = useState("Aadhar");
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);

  const handleSelectType = (type) => setSelectedType(type);

  const handleImagePick = async (side) => {
    try {
      const result = await launchImageLibrary({
        mediaType: "photo",
        quality: 1,
      });

      if (result.didCancel) return;
      const selectedAsset = result.assets[0];
      if (side === "front") setFrontImage(selectedAsset.uri);
      else setBackImage(selectedAsset.uri);
    } catch (error) {
      Alert.alert("Error", "Unable to pick image. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Verify KYC</Text>

      {/* Document Type Selection */}
      <Text style={styles.subtitle}>Choose Document Type</Text>
      <View style={styles.typeContainer}>
        {["Aadhar", "Pan Card", "Others"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.typeButton,
              selectedType === type && styles.activeTypeButton,
            ]}
            onPress={() => handleSelectType(type)}
          >
            <Text
              style={[
                styles.typeText,
                selectedType === type && styles.activeTypeText,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Upload Section */}

      <Text style={styles.uploadTitle}>Upload ID Proof</Text>
      <Text style={styles.uploadSubtitle}>
        Please upload a valid government-issued ID proof (Aadhar, PAN, or others)
        to verify your identity and complete the registration process.
      </Text>

      <View style={styles.uploadContainer}>
        {/* Upload Front */}
        <TouchableOpacity
          style={styles.uploadBox}
          onPress={() => handleImagePick("front")}
        >
         {frontImage ? (
    <Image source={{ uri: frontImage }} style={styles.uploadedImage} />
  ) : (
    <View style={styles.placeholderContainer}>
      <Image
        source={uploadimg}
       style={styles.uploadedImG}
        resizeMode="contain"
      />
      <Text style={styles.uploadText}>Upload ID Front</Text>
    </View>
  )}
        </TouchableOpacity>

        {/* Upload Back */}
        <TouchableOpacity
          style={styles.uploadBox}
          onPress={() => handleImagePick("back")}
        >
          {/* {backImage ? (
            <Image source={{ uri: backImage }} style={styles.uploadedImage} />
          ) : (
            <Text style={styles.uploadText}>Upload ID Back</Text>
          )} */}

          {backImage ? (
    <Image source={{ uri: backImage }} style={styles.uploadedImage} />
  ) : (
    <View style={styles.placeholderContainer}>
      <Image
        source={uploadimg}
        style={styles.uploadedImG}
        resizeMode="contain"
      />
      <Text style={styles.uploadText}>Upload ID Front</Text>
    </View>
  )}
        </TouchableOpacity>
      </View>

   
    
<TouchableOpacity
  style={[
    styles.submitButton,
    !(frontImage || backImage) && styles.disabledButton,
  ]}
  disabled={!(frontImage || backImage)}
  onPress={() => navigation.navigate("KycSuccess")}
>
  <Text style={styles.submitText}>Submit KYC</Text>
</TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 70,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 10,
  },
  typeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 4,
  },
  activeTypeButton: {
    backgroundColor: "#1A73E8",
    borderColor: "#1A73E8",
  },
  typeText: {
    color: "#000",
    fontWeight: "500",
  },
  activeTypeText: {
    color: "#fff",
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 6,
  },
  uploadSubtitle: {
    fontSize: 12,
     color: "#7C7C7C",
    lineHeight: 20,
    marginBottom: 20,
    fontFamily:"Gilroy",
    fontWeight:400
  },
  uploadContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  uploadBox: {
    backgroundColor: "#fff",
    borderRadius: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    width: "47%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  uploadText: {
    
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  submitButton: {
    backgroundColor: "#1A73E8",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    width: "100%",
    marginTop:180
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
   disabledButton: {
    backgroundColor: "#A8C1FF", 
  },
  placeholderContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

   uploadedImG: {
    width: 40,
    height: 40,
    tintColor: "#2F66F6", 
    marginBottom: 8,
  },

});

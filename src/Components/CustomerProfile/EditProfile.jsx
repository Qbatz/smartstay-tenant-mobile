import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomerImage from "../../assets/Images/Customer_Icon.png";
import LeftArrow from "../../assets/Images/LeftArrow.png";
import CameraIcon from "../../assets/Images/camera_Icon.png"
import { pickSingleFile } from "../UploadFileScreen/uploadFilePage"; 
import { editProfile } from "../../Action/CustomerAction";
import { UsersContext } from "../../Context/UserContext";
import SuccessModal from "../ToastFile/TostFilePage";
import AppLoader from "../ToastFile/LoaderPage";
import { launchImageLibrary } from "react-native-image-picker";
import { LoginContexts } from "../../Context/LoginContext";



const EditProfile = (route) => {

  const context=useContext(UsersContext)
  const loginContext=useContext(LoginContexts)
  const navigation = useNavigation();
  const [name, setName] = useState(route.route.params.customer.firstName);
  const [gender, setGender] = useState(route.route.params.customer.gender);
  const [dob, setDob] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [showCameraIcon, setShowCameraIcon] = useState(false);
  const [loading, setLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  console.log(gender)
  console.log(dob)
  console.log(profileImage)

  const handleImagePick = async () => {
    try {
      const image = await pickSingleFile();
      
      if (image) {
        console.log("Selected image:", image);
        setProfileImage({ uri: image });
      } else {
        console.log("User cancelled image selection");
      }
    } catch (error) {
      console.log("Image pick error:", error);
    }
  };

  const handleSave = () => {

    console.log(dob)

    const payloads= {
        firstName: name,
        dob:dob.toLocaleDateString('en-GB').replaceAll("/","-"),
        gender:gender,
    } 

    console.log("Payloads:", payloads);

    const formDate=new FormData();

    const jsonBase64=btoa(JSON.stringify(payloads))

    formDate.append("payloads", {
       uri: "data:application/json;base64," + jsonBase64,
       type: "application/json",
       name: "payload.json",
    })

    if(profileImage){
      console.log(profileImage)

      formDate.append("profilePic", {
          uri: profileImage.uri.uri,
          type: profileImage.type || "image/jpeg",
          name: profileImage.name,
      })

    }

    editProfile(loginContext.getToken,formDate).then(r=>{
      console.log(r)
      setLoading(true)

      setTimeout(() => {
          setLoading(false)

          if(r.status==200){
            setShowSuccessModal(true)

            setTimeout(() => {
              navigation.goBack();
            }, 2000);
          }
      }, 2000);
      
    })
    console.log("Saved profile:", { name, gender, dob, profileImage });
    
  };
  
  // const handleImagePick = async () => {
  //     try {
  //       const result = await launchImageLibrary({
  //         mediaTypes: 'photo',
  //         allowsEditing: true,
  //         aspect: [1, 1],
  //         quality: 0.5,
  //       });
  //       setProfileImage({uri:result.assets[0]})
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }

 
  // const handleImagePick = () => {
  //   const options = {
  //     mediaType: "photo",
  //     quality: 1,
  //   };
  //   launchImageLibrary(options, (response) => {
  //     if (response.didCancel) {
  //       console.log("User cancelled image picker");
  //     } else if (response.errorCode) {
  //       console.log("ImagePicker Error:", response.errorMessage);
  //     } else {
  //       const uri = response.assets?.[0]?.uri;
  //       if (uri) setProfileImage({ uri });
  //     }
  //   });
  // };

  return (
    <View style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <AppLoader visible={loading}/> 
      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message="Updated Successfully"
        type="sucess"
      />
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={LeftArrow} style={{ width: 22, height: 22 }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileContainer}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleImagePick}
            onPressIn={() => setShowCameraIcon(true)}
            onPressOut={() => setShowCameraIcon(false)}
          >
            <View style={styles.imageWrapper}>
              <Image source={profileImage!=null?profileImage.uri:null} style={styles.profileImage} />
              {showCameraIcon && (
                <View style={styles.cameraOverlay}>
                  <Image
                    source={CameraIcon}
                    style={{ width: 28, height: 28, tintColor: "#fff" }}
                  />
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            Gender <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.dropdown}>
            <Picker
              selectedValue={gender}
              onValueChange={(value) => setGender(value)}
              style={{ color: "#000" }}
            >
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            Date of Birth <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ color: "#000" }}>
              {dob.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={dob}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDob(selectedDate);
              }}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  saveText: {
    color: "#0057FF",
    fontWeight: "600",
    fontSize: 16,
  },
  profileContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  imageWrapper: {
    position: "relative",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    marginBottom: 6,
  },
  required: {
    color: "red",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    color: "#000",
    fontSize: 15,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
});

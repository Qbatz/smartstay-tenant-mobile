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
  Alert,
  ImageBackground,
  TouchableWithoutFeedback,
  FlatList
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomerImage from "../../assets/Images/Customer_Icon.png";
import LeftArrow from "../../assets/Images/LeftArrow.png";
import CameraIcon from "../../assets/Images/camera_Icon.png"
import { pickSingleFile } from "../UploadFileScreen/uploadFilePage";
import { customerDetails, editProfile } from "../../Action/CustomerAction";
import { UsersContext } from "../../Context/UserContext";
import SuccessModal from "../ToastFile/TostFilePage";
import AppLoader from "../ToastFile/LoaderPage";
import { launchImageLibrary } from "react-native-image-picker";
import { LoginContexts } from "../../Context/LoginContext";
import RectangleBackground from "../../assets/Images/RectangleBackground.png";
import CameraPic from "../../assets/Images/cameraPic.png"
import { Dropdown } from "react-native-element-dropdown";
import Ionicons from 'react-native-vector-icons/Ionicons'
import { pick } from "@react-native-documents/picker";
import Pdf from "../../assets/Images/pdf.png";
import EyeIcon from "../../assets/Images/view.png";
import DownloadIcon from "../../assets/Images/download.png"

const EditProfile = (route) => {

  const context = useContext(UsersContext)
  const loginContext = useContext(LoginContexts)
  const navigation = useNavigation();
  const [firstname, setfirstName] = useState(route.route.params.customer.firstName);
  const [lastName, setLastName] = useState(route.route.params.customer?.lastName)
  const [gender, setGender] = useState(route.route.params.customer.gender);
  const [dob, setDob] = useState(new Date());
  const [maildId, setEmailId] = useState(route.route.params.customer.gender);
  const [mobileNo, setMobileNo] = useState(route.route.params.customer.gender)
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profilePic, setProfilePic] = useState(route.route.params?.customer?.profilePic)
  const [showCameraIcon, setShowCameraIcon] = useState(false);
  const [loading, setLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [toastMessage, setToastMessage] = useState()
  const [modelType, setModelType] = useState();
  const [houseNo, setHouseNo] = useState("")
  const [streetName, setStreetName] = useState("")
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState("");
  const [documents, setDocuments] = useState([]);
  const [isFocus, setIsFocus] = useState(false);
  const [selectedRelationType, setSelectedRelationType] = useState(0);
  const [selectedEmployment, setSelectedEmployment] = useState(0);
  const [isEmploymentFocus, setIsEmploymentFocus] = useState(false)


  console.log(gender)
  console.log(dob)
  console.log(profileImage)

  // const handleImagePick = async () => {
  //   try {
  //     const image = await pickSingleFile();

  //     if (image) {
  //       console.log("Selected image:", image);
  //       setProfileImage({ uri: image });
  //     } else {
  //       console.log("User cancelled image selection");
  //     }
  //   } catch (error) {
  //     console.log("Image pick error:", error);
  //   }
  // };
  const countries = [
    { name: "India", code: "IN", dial_code: "+91" },
    { name: "United States", code: "US", dial_code: "+1" },
    { name: "United Kingdom", code: "GB", dial_code: "+44" },
    { name: "Australia", code: "AU", dial_code: "+61" },
  ];
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [showDropdown, setShowDropdown] = useState(false);

  const relationship = [{ id: 0, relationType: "Father" }, { id: 1, relationType: "Mother" }, { id: 2, relationType: "Others" }]

  const employmentTypes = [{ id: 0, employmentType: 'Self employment' }, { id: 1, employmentType: 'Private Job' }, { id: 2, employmentType: 'Public Job' }]


  const pickFiles = async () => {
    try {
      const results = await pick({
        allowMultiSelection: true,
        type: ['*/*'],
        copyTo: 'cachesDirectory',
      });
      setDocuments(results)
      console.log(results)
    } catch (err) {
      console.log("Cancelled or error", err);
    }
  };

  console.log("Doucmn", documents)

  const handleSave = () => {

    console.log(context.getCustomerDetail)

    const original = context.getCustomerDetail;
    const formattedDob = dob.toLocaleDateString("en-GB").replaceAll("/", "-");

    const originalDobFormatted = original.dateOfBirth
      ? new Date(original.dateOfBirth).toLocaleDateString("en-GB").replaceAll("/", "-")
      : null;



    console.log(original.firstName)
    console.log(original.gender)
    console.log(originalDobFormatted)

    const noChanges =
      original.firstName === firstname && original.gender === gender
      ;


    if (noChanges) {
      setShowSuccessModal(true)
      setToastMessage('No changes made')
      setModelType('error')
    }


    const payloads = {
      firstName: firstname,
      dob: dob.toLocaleDateString('en-GB').replaceAll("/", "-"),
      gender: gender,
    }

    console.log("Payloads:", payloads);

    const formDate = new FormData();

    const jsonBase64 = btoa(JSON.stringify(payloads))

    formDate.append("payloads", {
      uri: "data:application/json;base64," + jsonBase64,
      type: "application/json",
      name: "payload.json",
    })

    if (profileImage) {
      console.log(profileImage)

      formDate.append("profilePic", {
        uri: profileImage.uri.uri,
        type: profileImage.type || "image/jpeg",
        name: profileImage.name,
      })

    }

    editProfile(loginContext.getToken, formDate).then(r => {
      console.log(r)
      setLoading(true)

      setTimeout(() => {
        setLoading(false)

        if (r.status == 200) {
          setShowSuccessModal(true)
          setToastMessage('Updated Successfully')
          setModelType('success')

          setTimeout(() => {
            customerDetails(loginContext.getToken).then(r => {
              console.log(r.data)
              context.updateCustomer(r.data)
            })
            navigation.goBack();
          }, 2000);
        }
      }, 2000);

    })


  };

  const handleImagePick = async () => {
    try {
      const result = await launchImageLibrary({
        mediaTypes: 'photo',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      setProfileImage({ uri: result.assets[0] })
    } catch (error) {
      console.log(error)
    }
  }


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

  const imageSource = profileImage ? profileImage.uri : profilePic ? profilePic : null;

  console.log("biil", route)

  return (
    <View style={styles.container}>
      <AppLoader visible={loading} />
      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={toastMessage}
        type={modelType}
      />

      {/* Header */}
      <ImageBackground source={RectangleBackground} style={{ height: 200, }}>
        <View style={[styles.header, { paddingHorizontal: 20 }]}>

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={LeftArrow} style={{ width: 22, height: 22 }} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          {/* <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity> */}
        </View>

        <View style={styles.profileContainer}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleImagePick}
            onPressIn={() => setShowCameraIcon(true)}
            onPressOut={() => setShowCameraIcon(false)}
          >
            <View style={styles.imageWrapper}>

              {
                imageSource ? <Image source={imageSource} style={styles.profileImage} /> :
                  <View style={[styles.profileImage, { alignItems: 'center', justifyContent: 'center', backgroundColor: '#eef1ff', }]}>
                    <Text style={{ fontSize: 20, fontFamily: 'Gilroy-Bold' }}>{route.route.params?.customer?.initials}</Text>


                    {showCameraIcon && (
                      <View style={styles.cameraOverlay}>
                        <Image
                          source={CameraIcon}
                          style={{ width: 28, height: 28, tintColor: "#fff" }}
                        />
                      </View>
                    )}
                  </View>


              }

              {/* <Image source={profileImage != null ? profileImage.uri : null} style={styles.profileImage} />
              {showCameraIcon && (
                <View style={styles.cameraOverlay}>
                  <Image
                    source={CameraIcon}
                    style={{ width: 28, height: 28, tintColor: "#fff" }}
                  />
                </View>
              )} */}
            </View>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 40, paddingBottom: 120 }}>

        <Text style={{ fontSize: 18, fontFamily: 'Gilroy-Semibold', marginBottom: 20 }}>Basic Detail</Text>


        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            First name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={firstname}
            onChangeText={setfirstName}
            placeholder="Enter your first name"
            placeholderTextColor="#999"
          />
        </View>

        {/* <View style={styles.fieldContainer}>
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
        </View> */}

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            Last name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter your name"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            Mail ID <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={maildId}
            onChangeText={setEmailId}
            placeholder="Enter your Mail Id"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            Mobile No <Text style={styles.required}>*</Text>
          </Text>

          <View style={styles.phoneContainer}>

            <TouchableOpacity
              style={styles.codeContainer}
              onPress={() => {
                if (!showDropdown) {
                  setShowDropdown(true)
                } else {
                  setShowDropdown(false)
                }
              }}
            >
              <Text style={styles.codeText}>{selectedCountry.dial_code}</Text>
              <Text style={{ marginLeft: 5 }}>▼</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.phoneInput}
              keyboardType="number-pad"
              placeholder="Enter mobile number"
              value={mobileNo}
              onChangeText={setMobileNo}
            />
          </View>

        </View>

        {
          showDropdown && (
            <>
              <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
                <View style={styles.dropdownOverlay} />
              </TouchableWithoutFeedback>
              <View style={styles.overlay}>
                <ScrollView keyboardShouldPersistTaps="handled"
                  style={styles.dropdownBox}>
                  {
                    countries.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.countryItem}
                        onPress={() => setSelectedCountry(item)}>
                        <Text style={{ fontFamily: 'Gilroy-Medium', fontSize: 15 }}>{item.name} {item.dial_code}</Text>
                      </TouchableOpacity>
                    ))
                  }
                </ScrollView>
              </View>
            </>
          )
        }


        <Text style={{ fontSize: 18, fontFamily: 'Gilroy-Semibold', marginBottom: 20, marginTop: 18 }}>Address Detail</Text>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            House No / Apartment
          </Text>
          <TextInput
            style={styles.input}
            value={houseNo}
            onChangeText={setHouseNo}
            placeholder="Enter your houseNo"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            Streat / Area
          </Text>
          <TextInput
            style={styles.input}
            value={streetName}
            onChangeText={setStreetName}
            placeholder="Enter your street"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            Landmark
          </Text>
          <TextInput
            style={styles.input}
            value={landmark}
            onChangeText={setLandmark}
            placeholder="Enter your landmark"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            City
          </Text>
          <TextInput
            style={styles.input}
            value={city}
            onChangeText={setCity}
            placeholder="Enter your city"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            Pincode
          </Text>
          <TextInput
            style={styles.input}
            value={pincode}
            onChangeText={setPincode}
            placeholder="Enter your pinNo"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            State
          </Text>
          <TextInput
            style={styles.input}
            value={state}
            onChangeText={setState}
            placeholder="Enter your state"
            placeholderTextColor="#999"
          />
        </View>

        <Text style={{ fontSize: 18, fontFamily: 'Gilroy-Semibold', marginTop: 18 }}>Documents</Text>
        <View style={{ marginTop: 10 }}>
          {
            documents.length === 0 && (
              <TouchableOpacity onPress={pickFiles}
                style={{
                  paddingVertical: 15, borderWidth: 1, backgroundColor: "#EEF1FA", paddingHorizontal: 15,
                  borderColor: "#E5E7EB", borderRadius: 14, flexDirection: 'row', alignItems: 'center'
                }}>
                <Image source={CameraPic} style={{ width: 32.77, height: 32.77 }} />

                <View style={{ marginLeft: 10 }}>
                  <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Semibold' }}>Choose Upload Doument</Text>
                  <Text style={{ fontSize: 12, fontFamily: 'Gilroy-Medium', marginTop: 8 }}>Upload Document from gallery or files</Text>
                </View>

              </TouchableOpacity>
            )
          }

          {
            documents.length > 0 && (
              <FlatList
                data={documents}
                scrollEnabled={false}
                nestedScrollEnabled
                renderItem={({ item }) => {
                  return (
                    <View
                      style={{
                        borderWidth: 1,paddingVertical: 20,borderColor: '#eaeaec',borderRadius: 10,paddingHorizontal: 10,
                        backgroundColor: "#f9fafc",flexDirection: "row",alignItems: "center",marginBottom: 5,
                        justifyContent:'space-between'}}>

                      <View style={{ flexDirection: 'row',alignItems:'center' }}>
                        <Image source={Pdf} style={{ width: 18, height: 18, marginRight: 8 }} />

                        <Text>{item.name}</Text>
                      </View>

                      <View style={{ flexDirection: 'row',alignItems:'center' }}>
                        <TouchableOpacity>
                             <Image source={EyeIcon} style={{width:20,height:20,tintColor:'#61636f',marginRight:5}}/>
                        </TouchableOpacity>
                       

                        <Image source={DownloadIcon} style={{width:20,height:20,marginLeft:8,tintColor:'#61636f'}}/>
                      </View>


                    </View>
                  );
                }}
              />
            )
          }
        </View>

        <Text style={{ fontSize: 18, fontFamily: 'Gilroy-Semibold', marginTop: 20, marginBottom: 18 }}>Parent/Guardian Details</Text>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            Guardian Full Name
          </Text>
          <TextInput
            style={styles.input}
            value={state}
            onChangeText={setState}
            placeholder="Enter Guardian Name"
            placeholderTextColor="#999"
          />
        </View>

        <View style={{ paddingTop: 6 }}>
          <Text style={styles.label}>Relationship
            <Text style={{ color: 'red' }}> *</Text>
          </Text>


          <Dropdown
            style={{
              borderWidth: 1,
              borderRadius: 10,
              paddingVertical: 10,
              marginTop: 3,
              borderColor: '#e5e5e5',
              paddingLeft: 15,
            }}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            data={relationship}
            containerStyle={{ borderRadius: 10 }}
            placeholderStyle={{ fontSize: 14, fontFamily: 'Gilroy-Medium' }}
            selectedTextStyle={{ fontSize: 14, fontFamily: 'Gilroy-Medium' }}
            itemTextStyle={{ fontSize: 14, fontFamily: 'Gilroy-Medium' }}
            placeholder="Select a relation"
            labelField="relationType"
            valueField="id"
            value={selectedRelationType}
            onChange={item => {
              setSelectedRelationType(item.id);
            }}
            renderRightIcon={() => (
              <Ionicons
                name={isFocus ? "chevron-up" : "chevron-down"}
                size={22}
                color="#000"
                style={{ paddingRight: 10 }}
              />
            )}
          />

        </View>

        <View style={{ paddingTop: 8 }}>
          <Text style={styles.label}>Guardian Occupation
            <Text style={{ color: 'red' }}> *</Text>
          </Text>


          <Dropdown
            style={{
              borderWidth: 1,
              borderRadius: 10,
              paddingVertical: 10,
              marginTop: 3,
              borderColor: '#e5e5e5',
              paddingLeft: 15,
            }}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            data={employmentTypes}
            containerStyle={{ borderRadius: 10 }}
            placeholderStyle={{ fontSize: 14, fontFamily: 'Gilroy-Medium' }}
            selectedTextStyle={{ fontSize: 14, fontFamily: 'Gilroy-Medium' }}
            itemTextStyle={{ fontSize: 14, fontFamily: 'Gilroy-Medium' }}
            placeholder="Select a relation"
            labelField="employmentType"
            valueField="id"
            value={selectedEmployment}
            onChange={item => {
              setSelectedEmployment(item.id);
            }}
            renderRightIcon={() => (
              <Ionicons
                name={isFocus ? "chevron-up" : "chevron-down"}
                size={22}
                color="#000"
                style={{ paddingRight: 10 }}
              />
            )}
          />

        </View>

        <View style={[styles.fieldContainer, { marginTop: 10 }]}>
          <Text style={styles.label}>
            Mobile no
          </Text>
          <TextInput
            style={styles.input}
            value={state}
            onChangeText={setState}
            placeholder="Enter mobile no"
            placeholderTextColor="#999"
          />
        </View>
      </ScrollView >

      <View style={[styles.bottomButtonContainer, { paddingBottom: 20 }]}>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>


    </View >
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // paddingHorizontal: 20,
    paddingTop: 30,
  },
  header: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Gilroy-Semibold',
    color: "#000", marginLeft: 5

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
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Gilroy-Medium',
    color: "#4B4B4B",
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
    fontFamily: 'Gilroy-Medium'
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 55,
    backgroundColor: "#EEF1FA"
  },

  codeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10
  },

  codeText: {
    fontSize: 15,
    fontFamily: 'Gilroy-Medium'
  },
  phoneInput: {
    flex: 1,
    fontSize: 15, fontFamily: 'Gilroy-Medium'
  },
  overlay: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    zIndex: 1000,
    marginTop: 1,
  },

  dropdownBox: {
    //  width: 260,
    height: 200,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 10,
    elevation: 5,
  },

  countryItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderColor: "#eee",
  },

  countryText: {
    fontSize: 16
  },
  bottomButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee"
  },
  saveButton: {
    backgroundColor: "#1E45E1",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center"
  },

  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Gilroy-Semibold"
  }


});

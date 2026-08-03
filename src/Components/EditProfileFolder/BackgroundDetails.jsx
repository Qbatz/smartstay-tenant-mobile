import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TextInput, ScrollView, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Dimensions } from "react-native";
import LeftArrow from "../../assets/Images/LeftArrow.png"
import { useNavigation } from "@react-navigation/native";
import { customerDetails, editProfile } from "../../Action/CustomerAction";
import { UsersContext } from "../../Context/UserContext";
import { LoginContexts } from "../../Context/LoginContext";
import { Dropdown } from "react-native-element-dropdown";
import Ionicons from 'react-native-vector-icons/Ionicons';
import EditSmallIcon from "../../assets/Images/editSmallIcon.png"
import AppLoader from "../ToastFile/LoaderPage";
import SuccessModal from "../ToastFile/TostFilePage";
import ErrorMessage from "../ToastFile/ErrorMessage";
import AddCircle from "../../assets/Images/add-circle.png"
import NoResultPic from "../../assets/Images/NoResultPic.png"
import Briefcase from "../../assets/Images/briefcase.png"
import EditIcon from "../../assets/Images/edit.png"





const BackgroundDetails = (route) => {

    const navigation = useNavigation();
    const context = useContext(UsersContext)
    const loginContext = useContext(LoginContexts)
    const { getCustomerDetail, updateCustomer } = useContext(UsersContext)

    console.log(route)
    const { width } = Dimensions.get("window")

    const [guardianFullName, setGuardianFullName] = useState(getCustomerDetail?.additionalContacts[0]?.name || "");
    // const [relationship, setRelationship] = useState("");
    const [occupation, setOccupation] = useState(getCustomerDetail?.additionalContacts[0]?.occupation || "")
    const [guardianMobileNo, setGuardianMobileNo] = useState(route.route?.params?.customer?.additionalContacts[0]?.mobile || "");
    const [countyCode, setCountryCode] = useState("");

    const [loading, setLoading] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [toastMessage, setToastMessage] = useState()
    const [modelType, setModelType] = useState();
    const [selectedRelationType, setSelectedRelationType] = useState(route.route?.params?.customer?.additionalContacts[0]?.relationship || "");
    const [selectedRelation, setSelectedRelation] = useState("")
    const [selectedEmployment, setSelectedEmployment] = useState(0);
    const [isFocus, setIsFocus] = useState(false);
    const [contactId, setContactId] = useState(route.route?.params?.customer?.additionalContacts[0]?.contactId)
    const [mode, setMode] = useState("add")
    const [isEmplyFocus, setIsEmpyFocus] = useState(false)
    const [selectedJobDetails,setSelectedJobDetails]=useState("")
    console.log(mode)

    const [errorMsg, setErrorMsg] = useState({})
    const itemsBox = {
        guardianName: "",
        guardianRelation: "",
        guardianOccupation: "",
        guardianMobile: "",
    }
    const [items, setItems] = useState(() => {
        const contact = getCustomerDetail?.additionalContacts;


        if (contact?.length > 0) {
            return contact.map(contact => ({
                guardianName: contact?.name,
                guardianRelation: contact?.relationship,
                guardianOccupation: contact?.occupation,
                guardianMobile: contact?.mobile,
                contactId: contact.contactId,
            }))
        }

        return [];
        // return [{
        //     guardianName: "",
        //     guardianRelation: "",
        //     guardianOccupation: "",
        //     guardianMobile: "",
        // }]
    })
    console.log(items)
    console.log(selectedRelationType)

    const relationshipList = [{ id: 0, relationType: "Father" }, { id: 1, relationType: "Mother" }, { id: 2, relationType: "Others" }]

    const employmentTypes = [{ id: 0, employmentType: 'Govt Employee' }, { id: 1, employmentType: 'Private Employee' },
    { id: 2, employmentType: 'Business / Self-employed' }, { id: 3, employmentType: 'Farmer' }, { id: 4, employmentType: 'Daily wage / Labor' },
    { id: 5, employmentType: 'Homemaker' }, { id: 6, employmentType: 'Retired Employee' }, { id: 7, employmentType: 'Abroad (Working Overseas' },
    { id: 8, employmentType: 'Other' }
    ]

    console.log(errorMsg)
    useEffect(() => {
        const contacts = getCustomerDetail.additionalContacts || [];

        if (contacts.length > 0) {
            const formatted = contacts.map(contact => {

                return {
                    contactId: contact.contactId,
                    guardianName: contact.name,
                    guardianRelation: contact?.relationship,
                    guardianOccupation: contact.occupation,
                    guardianMobile: contact.mobile,
                };
            });

            setItems(formatted);
        }
    }, [getCustomerDetail?.additionalContacts]);


    const handleChange = (index, key, value) => {
        console.log(index, key, value)
        const updated = [...items];
        console.log(updated)

        updated[index][key] = value;
        setItems(updated);
    }

    const guardianList = route.route?.params?.customer?.additionalContacts;
    const clickEdit = () => {
        setLoading(true)
        setTimeout(() => {
            if (guardianList.length > 0) {
                setMode("edit")
            } else {
                setMode("add")
            }
            setLoading(false)
        }, 800);

    }

    const handleAddRow = () => {
        setItems(prev => [...prev, { ...itemsBox }])
    }

    const renderContactCard = (item, index) => {
        const count = index + 1;

        return (

            <View style={{ borderWidth: 1, borderRadius: 10, padding: 16, borderColor: '#E7E7E7', marginVertical: 10 }}
                key={index}>
                <Text style={{ fontSize: 18, fontFamily: 'Gilroy-Semibold', marginTop: 6 }}>Contact - {count}</Text>

                <View style={[styles.fieldContainer, { marginTop: 15 }]}>
                    <Text style={styles.label}>Guardian Full Name</Text>

                    <TextInput
                        value={item.guardianName}
                        placeholder="Enter fullName"
                        editable={mode == "edit" ? true : false}
                        style={styles.input}
                        onChangeText={(text) => {
                            const onlyLetters = text.replace(/[^A-Za-z\s]/g, "")
                            handleChange(index, "guardianName", onlyLetters)
                            // setGuardianFullName(onlyLetters)
                            setErrorMsg((prev) => ({ ...prev, fullName: "" }))
                        }}
                    />
                </View>

                {errorMsg.fullName && (<ErrorMessage message={errorMsg.fullName} type="error" />)}

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[styles.rltnOccptField, { marginRight: 3 }]}>
                        <Text style={styles.label}>Relationship</Text>

                        <Text style={styles.input}>{item.guardianRelation || "N/A"}</Text>


                        {/* <Dropdown
                            style={{
                                marginTop: 12,
                                borderColor: '#e5e5e5',
                                paddingLeft: 5,
                            }}
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            data={relationshipList}
                            containerStyle={{ borderRadius: 10,marginTop:10  }}
                            placeholderStyle={{ fontSize: 15, fontFamily: 'Gilroy-Medium', color: '#9C9C9C' }}
                            selectedTextStyle={{ fontSize: 15, fontFamily: 'Gilroy-Medium' }}
                            itemTextStyle={{ fontSize: 14, fontFamily: 'Gilroy-Medium' }}
                             disable= {mode != "edit" ? true : false}
                            placeholder="Select a relation"
                            labelField="relationType"
                            valueField="id"
                            value={item?.guardianRelation}
                            onChange={item => {
                                // setSelectedRelationType(item.id);
                                handleChange(index, "guardianRelation", item.relationType)
                                setErrorMsg((prev) => ({ ...prev, relationType: "" }))
                            }}
                            renderRightIcon={() => (
                                <Ionicons
                                    name={isFocus ? "chevron-up" : "chevron-down"}
                                    size={22}
                                    color="#000"
                                    style={{ paddingRight: 10 }}
                                />
                            )}
                        /> */}


                    </View>
                    {errorMsg.relationType && (<ErrorMessage message={errorMsg.relationType} type="error" />)}

                    <View style={[styles.rltnOccptField, { marginLeft: 3 }]}>
                        <Text style={styles.label}>Guardian Occupation</Text>

                        <Text style={styles.input}>{item.guardianOccupation || "N/A"}</Text>
                        {/* <Dropdown
                            style={{
                                marginTop: 12,
                                borderColor: '#e5e5e5',
                                paddingLeft: 5,
                            }}
                            onFocus={() => setIsEmpyFocus(true)}
                            onBlur={() => setIsEmpyFocus(false)}
                            data={employmentTypes}
                            containerStyle={{ borderRadius: 10,marginTop:10 }}
                            placeholderStyle={{ fontSize: 15, fontFamily: 'Gilroy-Medium', color: '#9C9C9C' }}
                            selectedTextStyle={{ fontSize: 15, fontFamily: 'Gilroy-Medium' }}
                            itemTextStyle={{ fontSize: 14, fontFamily: 'Gilroy-Medium' }}
                            placeholder="Select a relation"
                            labelField="employmentType"          
                            disable= {mode != "edit" ? true : false}
                            valueField="id"
                            value={item?.guardianOccupation}
                            onChange={item => {
                                // setSelectedRelationType(item.id);
                                handleChange(index, "guardianOccupation", item.employmentType)
                                setErrorMsg((prev) => ({ ...prev, relationType: "" }))
                            }}
                            renderRightIcon={() => (
                                <Ionicons
                                    name={isEmplyFocus ? "chevron-up" : "chevron-down"}
                                    size={22}
                                    color="#000"
                                    style={{ paddingRight: 10 }}
                                />
                            )}
                        /> */}
                    </View>
                </View>
                {errorMsg.occupation && (<ErrorMessage message={errorMsg.occupation} type="error" />)}

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Mobile No</Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                        <Text style={{ fontSize: 15, fontFamily: 'Gilroy-Medium', color: '#0A0A0A' }}>+91</Text>
                        <Ionicons name="chevron-down" size={16} style={{marginLeft:3}}/>
                        <TextInput
                            value={item?.guardianMobile}
                            placeholder="Enter mobileNo"
                            editable={mode == "edit" ? true : false}
                            style={styles.mobileInpt}
                            maxLength={10}
                            onChangeText={(text) => {
                                const onlyNum = text.replace(/[^0-9]/g, "")
                                // setGuardianMobileNo(onlyNum)
                                handleChange(index, "guardianMobile", onlyNum)
                                setErrorMsg((prev) => ({ ...prev, guardianMobileNo: "" }))
                            }}
                        />
                    </View>
                </View>

            </View>
        )

    }
    const validateForm = () => {

        let newErrors = {};

        if (!guardianFullName && !guardianFullName.trim()) {
            newErrors.fullName = "Please Enter name"
        }

        if (!selectedRelationType) {
            newErrors.relationType = "Please Select Relation"
        }

        if (!occupation && !occupation.trim()) {
            newErrors.occupation = "Please Select Relation"
        }

        if (!guardianMobileNo && !guardianMobileNo.trim()) {
            newErrors.guardianNumber = "Please Enter Number"
        }



        setErrorMsg(newErrors)
        return;
    }

    const handleEdit = () => {

        // if (!validateForm()) return;



        // const payload = {
        //     additionalContacts: [
        //         {
        //             contactId: contactId,
        //             name: guardianFullName,
        //             relationship: selectedRelation,
        //             occupation: occupation,
        //             mobile: guardianMobileNo,
        //         }
        //     ]
        // }

        const payload = {
            additionalContacts: items.map(item =>
            ({
                contactId: item.contactId,
                name: item?.guardianName,
                relationship: item?.guardianRelation,
                occupation: item?.guardianOccupation,
                mobile: item?.guardianMobile,
            }))
        }

        console.log(payload)

        const formData = new FormData();

        const jsonBase64 = btoa(JSON.stringify(payload))


        formData.append("payloads", {
            uri: "data:application/json;base64," + jsonBase64,
            type: "application/json",
            name: "payload.json",
        })

        editProfile(loginContext.getToken, formData).then(r => {
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

    }


    return <View style={{ backgroundColor: '#ffffff', flex: 1 }}>
        <AppLoader visible={loading} />
        <SuccessModal
            visible={showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
            message={toastMessage}
            type={modelType}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 30 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={LeftArrow} style={{ height: 25, width: 25 }} />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontFamily: 'Gilroy-Semibold', marginLeft: 8 }}>
                    Background Details</Text>
            </View>

            {/* {mode == "edit" ?
                <TouchableOpacity onPress={handleEdit}
                    style={{ backgroundColor: '#E7F1FF', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5, flexDirection: 'row' }}>
                    <Image source={EditSmallIcon} style={{ width: 16, height: 16 }} />
                    <Text style={{ fontSize: 12, fontFamily: 'Gilroy-Regular', color: '#1E45E1', marginLeft: 6 }}>save</Text>
                </TouchableOpacity>

                :
                <TouchableOpacity onPress={clickEdit}
                    style={{ backgroundColor: '#E7F1FF', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5, flexDirection: 'row' }}>
                    <Image source={EditSmallIcon} style={{ width: 16, height: 16 }} />
                    <Text style={{ fontSize: 12, fontFamily: 'Gilroy-Regular', color: '#1E45E1', marginLeft: 6 }}>Edit</Text>
                </TouchableOpacity>
            } */}
        </View>
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled={true}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 80 }}>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 18, fontFamily: 'Gilroy-Semibold', marginTop: 15, marginBottom: 10 }}>Parent/Guardian Details</Text>


                    {items.length > 0 && (
                        <TouchableOpacity onPress={() => navigation.navigate("AddGuardianDetails", { mode: "edit" })}
                            style={{ backgroundColor: '#E7F1FF', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5, flexDirection: 'row' }}>
                            <Image source={EditSmallIcon} style={{ width: 16, height: 16 }} />
                            <Text style={{ fontSize: 12, fontFamily: 'Gilroy-Regular', color: '#1E45E1', marginLeft: 6 }}>Edit</Text>
                        </TouchableOpacity>
                    )
                    }
                </View>
                {/* {mode === "edit" ? (
                <>
                    {items.map((item, index) => (
                        <View key={index}>
                            {renderContactCard(item, index)}
                        </View>
                    ))}
                </>
            ) : ( */}

                {/* )} */}

                {items.length > 0 ? (
                    <>
                        <FlatList
                            horizontal
                            pagingEnabled
                            snapToAlignment="start"
                            decelerationRate="fast"
                            data={items}
                            keyExtractor={(item, index) => index.toString()}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item, index }) => (
                                <View
                                    style={{
                                        width: width - 40,
                                        marginRight: 10,
                                    }}
                                >
                                    {renderContactCard(item, index)}
                                </View>
                            )}
                        />

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                            <TouchableOpacity onPress={() => navigation.navigate("AddGuardianDetails", { mode: "add" })}
                                style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons
                                    name="add-circle-outline"
                                    size={18}
                                    color="#1E45E1"
                                />
                                <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', color: '#1E45E1', marginLeft: 5 }}>
                                    Add New Row</Text>
                            </TouchableOpacity>

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', color: '#0D1B8E' }}>Swipe</Text>
                                <View style={{ flexDirection: "row" }}>
                                    <Ionicons name="chevron-forward" size={14} color="#0D1B8E" />
                                    <Ionicons name="chevron-forward" size={14} color="#0D1B8E" style={{ marginLeft: -6 }} />
                                </View>
                            </View>
                        </View>
                    </>
                ) : (
                    <View style={{ borderWidth: 1, borderRadius: 10, padding: 16, borderColor: '#E7E7E7', alignItems: 'center', marginTop: 10 }}>
                        <Image source={NoResultPic} style={{ width: 100, height: 100 }} />
                        <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', textAlign: 'center', lineHeight: 20, marginTop: 12 }}>
                            Parent/Guardians missing for {`\n`} Emergency contacts
                        </Text>

                        <TouchableOpacity onPress={() => navigation.navigate("AddGuardianDetails", { mode: "add" })}
                            style={{
                                backgroundColor: "#1E45E1", borderRadius: 10, width: '100%', paddingVertical: 10,
                                marginHorizontal: 14, marginTop: 16, alignItems: 'center'
                            }}>
                            <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Semibold', color: '#FFFFFF' }}>
                                Add Guardian Details</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {mode == "edit" &&
                    <TouchableOpacity style={styles.addRowField} onPress={handleAddRow}>
                        <Image source={AddCircle} style={{ width: 17.35, height: 17.35, tintColor: '#1E45E1' }} />
                        <Text style={styles.addRowTxt}>Add New Row</Text>
                    </TouchableOpacity>}
                {/* <FlatList nestedScrollEnabled={true}
                data={items}
                contentContainerStyle={{flex:1}}
               
                horizontal
                renderItem={({item, index}) => {
{console.log(index)}
                    return (
                  
                    <View style={{borderWidth:1,borderRadius:10,padding:16,borderColor:'#E7E7E7',width:'100%'}} key={index}>
                        <Text style={{ fontSize: 18, fontFamily: 'Gilroy-Semibold', marginTop: 8 }}>Contact</Text>
  
                        <View style={[styles.fieldContainer, { marginTop: 15 }]}>
                            <Text style={styles.label}>Guardian Full Name</Text>

                            <TextInput
                                value={item.guardianName}
                                placeholder="Enter fullName"
                                style={styles.input}
                                onChangeText={(text) => {
                                    const onlyLetters = text.replace(/[^A-Za-z\s]/g, "")
                                    handleChange(index, "guardianName", text)
                                    setGuardianFullName(onlyLetters)
                                    setErrorMsg((prev) => ({ ...prev, fullName: "" }))
                                }}
                            />
                        </View>

                        {errorMsg.fullName && (<ErrorMessage message={errorMsg.fullName} type="error" />)}

                        <View style={{flexDirection:'row',alignItems:'center'}}>
                        <View style={styles.rltnOccptField}>
                            <Text style={styles.label}>Relationship</Text>


                            <Dropdown
                                style={{
                                    marginTop: 5,
                                    borderColor: '#e5e5e5',
                                    paddingLeft: 5,
                                }}
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                                data={relationshipList}
                                containerStyle={{ borderRadius: 10 }}
                                placeholderStyle={{ fontSize: 15, fontFamily: 'Gilroy-Medium', color: '#9C9C9C' }}
                                selectedTextStyle={{ fontSize: 15, fontFamily: 'Gilroy-Medium' }}
                                itemTextStyle={{ fontSize: 14, fontFamily: 'Gilroy-Medium' }}
                                placeholder="Select a relation"
                                labelField="relationType"
                                valueField="id"
                                value={selectedRelationType}
                                onChange={item => {
                                    setSelectedRelationType(item.id);
                                    setErrorMsg((prev) => ({ ...prev, relationType: "" }))
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
                        {errorMsg.relationType && (<ErrorMessage message={errorMsg.relationType} type="error" />)}

                        <View style={styles.rltnOccptField}>
                            <Text style={styles.label}>Guardian Occupation</Text>

                            <TextInput
                                value={occupation}
                                placeholder="Enter Occupation"
                                style={styles.input}
                                onChangeText={(text) => {
                                    const onlyLetters = text.replace(/[^A-Za-z\s]/g, "")
                                    setOccupation(onlyLetters)
                                    setErrorMsg((prev) => ({ ...prev, occupation: "" }))
                                }}
                            />
                        </View>
                        </View>
                        {errorMsg.occupation && (<ErrorMessage message={errorMsg.occupation} type="error" />)}

                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>Mobile No</Text>

                            <TextInput
                                value={guardianMobileNo}
                                placeholder="Enter mobileNo"
                                style={styles.input}
                                maxLength={10}
                                onChangeText={(text) => {
                                    const onlyNum = text.replace(/[^0-9]/g, "")
                                    setGuardianMobileNo(onlyNum)
                                    setErrorMsg((prev) => ({ ...prev, guardianMobileNo: "" }))
                                }}
                            />
                        </View>

                    </View>
                    )
                }} /> */}


                {errorMsg.guardianNumber && (<ErrorMessage message={errorMsg.guardianNumber} type="error" />)}

                <Text style={{ fontSize: 18, fontFamily: 'Gilroy-Semibold', marginTop: 25 }}>Employment Details</Text>

                {/* <View style={[styles.fieldContainer, { marginTop: 15 }]}>
                <Text style={styles.label}>Employment Status</Text>

                <TextInput
                    // value={firstName}
                    placeholder="Enter house No"
                    style={styles.input}
                />
            </View>

            <View style={styles.fieldContainer}>
                <Text style={styles.label}>Company/College Name</Text>

                <TextInput
                    // value={firstName}
                    placeholder="Enter street name"
                    style={styles.input}
                />
            </View>

            <View style={styles.fieldContainer}>
                <Text style={styles.label}>Job Role</Text>

                <TextInput
                    // value={firstName}
                    placeholder="Enter landmark"
                    style={styles.input}
                />
            </View>

            <View style={styles.fieldContainer}>
                <Text style={styles.label}>Work Location</Text>

                <TextInput
                    // value={firstName}
                    placeholder="Enter city name"
                    style={styles.input}
                />
            </View>

            <View style={styles.fieldContainer}>
                <Text style={styles.label}>Shift Timing</Text>

                <TextInput
                    // value={firstName}
                    placeholder="Enter pincode"
                    style={styles.input}
                />
            </View>

            <View style={styles.fieldContainer}>
                <Text style={styles.label}>Vehicle Type</Text>

                <TextInput
                    // value={firstName}
                    placeholder="Enter state"
                    style={styles.input}
                />
            </View>

            <View style={styles.fieldContainer}>
                <Text style={styles.label}>Vehicle Number</Text>

                <TextInput
                    // value={firstName}
                    placeholder="Enter state"
                    style={styles.input}
                />
            </View> */}

                {getCustomerDetail?.customerJobDetails.length > 0 ? (
                    <View style={{marginTop:12}}>
                        {getCustomerDetail?.customerJobDetails.map((i, index) => (
                            <>
                                <View style={{ flexDirection: 'row',flex:1,marginTop:14 }} key={index}>
                                    <View style={{
                                        backgroundColor: "#EFF0F1", borderRadius: 50, width: 45, height: 45, padding: 10,
                                        alignItems: 'center', justifyContent: 'center',marginTop:2
                                    }}>
                                        <Image source={Briefcase} style={{ width: 24, height: 24 }} />
                                    </View>

                                    <View style={{ width: '100%',marginLeft:16,flex:1}}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',flex:1 }}>
                                            <Text style={{fontSize:16,fontFamily:'Gilroy-Semibold',flexShrink:1}}
                                                numberOfLines={1} ellipsizeMode="tail">
                                                {i?.organizationName}</Text>
                                            <TouchableOpacity onPress={() => navigation.navigate("AddJobDetails", {
                                                selectedJobDetails: i,
                                                 mode: "edit" })}>                   
                                            <Image source={EditIcon} style={{ width: 16, height: 16, tintColor: '#9C9C9C',marginRight:6 }} />
                                            </TouchableOpacity>
                                        </View>

                                        <Text style={{fontSize:14,fontFamily:'Gilroy-Medium',color:'#1E293B',marginTop:12}}>
                                            {i?.workLocation}</Text>

                                        <Text style={{fontSize:13,fontFamily:'Girloy-Regular',color:'#475569',marginTop:10}}>
                                            {i?.shiftFrom} - {i?.shiftTo}</Text>

                                        {/* <Text style={{fontSize:13,fontFamily:'Girloy-Regular',color:'#475569',marginTop:10}}>April 2025 - present</Text> */}
                                    </View>
                                </View>
                            </>
                        ))}

                        <TouchableOpacity onPress={() => navigation.navigate("AddJobDetails", { mode: "add" })}
                        style={{flexDirection:'row',alignItems:'center',marginTop:16}}>
                            <Image source={AddCircle} style={{width:16,height:16,tintColor:'#031d7b'}}/>
                            <Text style={{fontSize:14,fontFamily:'Gilroy-Medium',color:'#1E45E1',marginLeft:4}}>
                                Add New Experience</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={{ borderWidth: 1, borderRadius: 10, padding: 16, borderColor: '#E7E7E7', alignItems: 'center', marginTop: 20 }}>
                        <Image source={NoResultPic} style={{ width: 100, height: 100 }} />
                        <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', textAlign: 'center', lineHeight: 20, marginTop: 12 }}>
                            Your Job Details are missing for {`\n`} Emergency contacts
                        </Text>

                        <TouchableOpacity onPress={() => navigation.navigate("AddJobDetails", { mode: "add" })}
                            style={{
                                backgroundColor: "#1E45E1", borderRadius: 10, width: '100%', paddingVertical: 10,
                                marginHorizontal: 14, marginTop: 16, alignItems: 'center'
                            }}>
                            <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Semibold', color: '#FFFFFF' }}>
                                Add Job Details</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>

    </View>

}

const styles = StyleSheet.create({
    fieldContainer: {
        // marginBottom: 18,

        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 6,
        marginTop: 15
    },
    rltnOccptField: {
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        flex: 1, marginTop: 15, paddingBottom: 6
    },

    label: {
        fontSize: 14,
        color: '#4B4B4B',
        marginBottom: 4,
        fontFamily: 'Gilroy-Medium',
    },

    input: {
        fontSize: 15,
        color: '#0A0A0A',
        paddingVertical: 4,
        marginTop: 10,
        fontFamily: 'Gilroy-Medium',
    },
    mobileInpt: {
        fontSize: 15,
        color: '#0A0A0A',
        paddingVertical: 4,
        fontFamily: 'Gilroy-Medium',marginLeft:5
    },
    addRowField: {
        flexDirection: 'row',
        alignItems: 'center', backgroundColor: '#EAEEFF',
        marginTop: 12, justifyContent: 'center',
        padding: 12, borderRadius: 5,
    },
    addRowTxt: {
        fontSize: 14,
        fontFamily: 'Gilroy-Semibold',
        color: '#1E45E1', marginLeft: 6,
    },
})
export default BackgroundDetails;
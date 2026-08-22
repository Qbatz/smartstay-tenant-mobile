import React, { useContext, useEffect, useState } from "react";
import { Alert, Image, KeyboardAvoidingView, NativeModules, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import LeftArrow from "../../assets/Images/LeftArrow.png"
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import CheckBox from "../../assets/Images/Checkboxes.png"
import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";
import { addJobDetails, customerDetails } from "../../Action/CustomerAction";
import { LoginContexts } from "../../Context/LoginContext";
import AppLoader from "../ToastFile/LoaderPage";
import SuccessModal from "../ToastFile/TostFilePage";
import { storeData } from "../../Utils/Storage";
import { CUSTOMERDETAIL } from "../../Utils/Constant";
import { UsersContext } from "../../Context/UserContext";
import TimerIcon from "../../assets/Images/timer.png"
import DatePicker from "react-native-date-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import ErrorMessage from "../ToastFile/ErrorMessage";


const AddJobDetails = ({ route }) => {

    const { mode } = route?.params;
    const { getToken } = useContext(LoginContexts)
    const { updateCustomer } = useContext(UsersContext);
    const navigation = useNavigation();
    const [companyName, setCompanyName] = useState("")
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    const [jobRole, setJobRole] = useState("")
    const [location, setLocation] = useState("")
    const [shiftType, setShiftType] = useState("")
    const [isTickIcon, setIsTickIcon] = useState(true)
    const [openCalendar, setOpenCalendar] = useState(false);
    const [calendarType, setCalendarType] = useState("");
    const today = dayjs();
    const shiftTypeList = [{ id: 1, type: "Morning Shift" }, { id: 2, type: "Night Shift" }]
    const [openShiftList, setOpenShiftList] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [showModalMessage, setShowModalMessage] = useState("")
    const [modalType, setModalType] = useState("")
    const [loading, setLoading] = useState(false)
    const [jobId, setJobId] = useState()
    const [employmentStatus, setEmploymentStatus] = useState("Working")
    const [shiftFrom, setShiftFrom] = useState(null)
    const [shiftTo, setShiftTo] = useState(null)
    const [openTimeBox, setOpenTimeBox] = useState(false);
    const [pickerType, setPickerType] = useState(null);
    const [errors, setErrors] = useState({})

    const { CommonModule } = NativeModules

    console.log(route)
    console.log("shiftFrom", shiftFrom)
    console.log(typeof shiftFrom); // string
    console.log(shiftFrom instanceof Date); // false
    console.log("errormsg", errors)

    const convertTimeToDate = (time) => {
        if (!time) return new Date();

        const cleanedTime = time.replace(/\u202F/g, " ").trim(); // Handles narrow no-break space

        const [timePart, period] = cleanedTime.split(" ");
        let [hours, minutes] = timePart.split(":").map(Number);

        if (period.toUpperCase() === "PM" && hours !== 12) hours += 12;
        if (period.toUpperCase() === "AM" && hours === 12) hours = 0;

        const date = new Date();
        date.setHours(hours, minutes, 0, 0);

        return date;
    };

    useEffect(() => {
        const selectedJobDetails = route?.params?.selectedJobDetails
        if (selectedJobDetails) {
            setJobId(selectedJobDetails?.jobId)
            setCompanyName(selectedJobDetails?.organizationName)
            setJobRole(selectedJobDetails?.role)
            setLocation(selectedJobDetails?.workLocation)
            setShiftType(selectedJobDetails?.shiftType)
            // setShiftFrom(selectedJobDetails?.shiftFrom)
            // setShiftTo(selectedJobDetails?.shiftTo)
            setShiftFrom(convertTimeToDate(selectedJobDetails.shiftFrom));
            setShiftTo(convertTimeToDate(selectedJobDetails.shiftTo));
        }

    }, [])

    const fetchCustomerDetail = () => {
        customerDetails(getToken).then(r => {
            console.log(r.data)
            updateCustomer(r.data)
            storeData(CUSTOMERDETAIL, JSON.stringify(r.data))
        }).catch(error => {
            console.log(error)
        })
    }

    const openStartCalendar = () => {
        setCalendarType("start");
        setOpenCalendar(true);
    };
    const openEndCalendar = () => {

        if (!startDate) {
            Alert.alert("Please select Start Date first");
            return;
        }

        setCalendarType("end");
        setOpenCalendar(true);
    };

    const onDateSelect = (day) => {

        if (calendarType === "start") {

            setStartDate(new Date(day.dateString));

            setEndDate(null);

        } else {

            const selectedEnd = new Date(day.dateString);

            if (selectedEnd < startDate) {
                Alert.alert("End Date cannot be before Start Date");
                return;
            }

            setEndDate(selectedEnd);
        }

        setOpenCalendar(false);
    };

    const openTimePicker = (type) => {
        setPickerType(type);
        setOpenTimeBox(true);
    };


    const onTimeChange = (event, selectedDate) => {
        setOpenTimeBox(false);

        if (event.type === 'dismissed') {
            return;
        }

        const date = selectedDate || new Date(event.nativeEvent.timestamp);

        if (pickerType === 'from') {
            setShiftFrom(date);
        } else {
            setShiftTo(date);
        }
    };

    const formatTime = (date) => {
        if (!date) return '';

        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    // const onCancel = () => {
    //     setOpen(false);
    // };

    const validateForm = () => {

        let newErrors = {};

        if (!companyName && !companyName.trim()) {
            newErrors.company = "Please Enter Companyname"
        }

        if (!location) {
            newErrors.location = "Please Enter Location "
        }

        if (!(formatTime(shiftFrom)) && !formatTime(shiftTo)) {
            newErrors.shiftTime = "Please Select Time"
        }

        // if (!guardianMobileNo && !guardianMobileNo.trim()) {
        //     newErrors.guardianNumber = "Please Enter Number"
        // }



        setErrors(newErrors)
        // return;
        return Object.keys(newErrors).length === 0;
    }

    const saveChanges = async () => {

        if (!validateForm()) return;



        if (mode === "add") {

            const payload = [
                {
                    organizationName: companyName,
                    role: jobRole,
                    workLocation: location,
                    workStartDate:startDate ? dayjs(startDate).format("DD-MM-YYYY") : "",
                    workEndDate:endDate ? dayjs(endDate).format("DD-MM-YYYY") : "" ,
                    shiftType: shiftType,
                    shiftFrom: formatTime(shiftFrom),
                    shiftTo: formatTime(shiftTo),
                }]

            console.log("payload", payload)
            setLoading(true)
            try {
                const res = await addJobDetails(getToken, payload)
                console.log(res)

                if (res?.status == 200) {
                    setShowSuccessModal(true)
                    setShowModalMessage(res?.data || "Created Successfully")
                    setModalType("success")
                    fetchCustomerDetail();
                    setTimeout(() => {
                        setShowSuccessModal(false)
                        navigation.goBack();
                    }, 1200);
                } else {
                    setShowSuccessModal(true)
                    setShowModalMessage(res?.message || "Something Went Wrong")
                    setModalType("error")
                    setTimeout(() => {
                        setShowSuccessModal(false)
                    }, 1000);
                }

            } catch (error) {
                console.log(error)
            }
        } else {
            const payload = [
                {
                    jobId: jobId,
                    employmentStatus: employmentStatus,
                    organizationName: companyName,
                    role: jobRole,
                    workLocation: location,
                    workStartDate:startDate ? dayjs(startDate).format("DD-MM-YYYY") : "",
                    workEndDate:endDate ? dayjs(endDate).format("DD-MM-YYYY") : "Select start Date",
                    shiftType: shiftType,
                    shiftFrom: formatTime(shiftFrom),
                    shiftTo: formatTime(shiftTo),
                }]
            setLoading(true)
            try {
                const res = await addJobDetails(getToken, payload)
                console.log(res)

                if (res?.status == 200) {
                    setShowSuccessModal(true)
                    setShowModalMessage(res?.data || "Created Successfully")
                    setModalType("success")
                    setTimeout(() => {
                        setShowSuccessModal(false)
                        fetchCustomerDetail();
                        navigation.goBack();
                    }, 1000);
                } else {
                    setShowSuccessModal(true)
                    setShowModalMessage(res?.message || "Something Went Wrong")
                    setModalType("error")
                    setTimeout(() => {
                        setShowSuccessModal(false)
                    }, 1000);
                }

            } catch (error) {
                console.log(error)
            }
        }


    }

    return (
        <View style={styles.mainContainer}>
            <AppLoader visible={loading} />
            <SuccessModal
                visible={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                message={showModalMessage}
                type={modalType} />


            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={LeftArrow} style={{ height: 23.5, width: 23.5 }} />
                </TouchableOpacity>
                <Text style={styles.mainheader}>{mode === "edit" ? "Edit" : "Add"} Job Details</Text>
            </View>

             <KeyboardAvoidingView
                    style={{ flex: 1, backgroundColor: "#fff" }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}  
                    keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
                >
            <ScrollView contentContainerStyle={{ justifyContent: 'space-between', flexGrow: 1,paddingBottom:150 }} 
            showsVerticalScrollIndicator={false}>
                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginTop: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <TouchableOpacity onPress={() => setEmploymentStatus("Student")}
                                style={[{
                                    width: 18, height: 18, borderRadius: 9, borderColor: '#9C9C9C',
                                    borderWidth: 1, justifyContent: 'center', alignItems: 'center'
                                }, employmentStatus === "Student" && { borderColor: '#1E45E1' }]}>
                                <View style={[{ width: 12, height: 12, borderRadius: 6 },
                                employmentStatus === "Student" && { backgroundColor: '#1E45E1', borderRadius: 6 }
                                ]} />
                            </TouchableOpacity>

                            <Text style={{ fontSize: 15, fontFamily: 'Gilroy-Medium', marginLeft: 10 }}>Student</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <TouchableOpacity onPress={() => setEmploymentStatus("Working")}
                                style={[{
                                    width: 18, height: 18, borderRadius: 9, borderColor: '#9C9C9C',
                                    borderWidth: 1, justifyContent: 'center', alignItems: 'center'
                                }, employmentStatus === "Working" && { borderColor: '#1E45E1' }]}>
                                <View style={[{ width: 12, height: 12 },
                                employmentStatus === "Working" && { backgroundColor: '#1E45E1', borderRadius: 6 }
                                ]} />
                            </TouchableOpacity>

                            <Text style={{ fontSize: 15, fontFamily: 'Gilroy-Medium', marginLeft: 10 }}>Working Professional</Text>
                        </View>
                    </View>
                    <Text style={styles.labelTxt}>{employmentStatus === "Student" ? "College Name" : "Company Name"}
                        <Text style={{ color: 'red' }}> *</Text>
                    </Text>

                    <View>
                        <TextInput
                            style={styles.inputBox}
                            value={companyName}
                            placeholder="Enter Name"
                            onChangeText={(text) => {
                                const onlyLetters = text.replace(/[^A-Za-z\s]/g, "")
                                setCompanyName(onlyLetters)
                            }} />
                    </View>

                    {errors.company && (<ErrorMessage message={errors.company} type="error" />)}


                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                        <TouchableOpacity onPress={() => setIsTickIcon(!isTickIcon)}
                            style={{
                                borderWidth: 1, borderColor: "#D9D9D9", width: 15, height: 15, borderRadius: 4,
                                alignItems: 'center', justifyContent: 'center'
                            }}>
                            {isTickIcon ? <Image source={CheckBox} style={{ width: 30, height: 30, borderRadius: 4 }} /> : null}
                        </TouchableOpacity>

                        <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', marginLeft: 8 }}>
                            {employmentStatus === "Student" ? "I'm Currently Studying on this college" : "I'm currently working on this role"}</Text>
                    </View>


                    <Text style={styles.labelTxt}>Start Date</Text>

                    <TouchableOpacity onPress={openStartCalendar}
                        style={styles.inputBox}>
                        <Text style={styles.valueTxt}>{startDate ? dayjs(startDate).format("DD-MM-YYYY") : "Select start Date"}</Text>
                    </TouchableOpacity>

                    {!isTickIcon && (
                        <>
                            <Text style={styles.labelTxt}>End Date</Text>

                            <TouchableOpacity onPress={openEndCalendar}
                                style={styles.inputBox}>
                                <Text style={styles.valueTxt}>{endDate ? dayjs(endDate).format("DD-MM-YYYY") : "Select end Date"}</Text>
                            </TouchableOpacity>
                        </>
                    )}


                    {employmentStatus !== "Student" && (
                        <>
                            <Text style={styles.labelTxt}>Job Role</Text>

                            <View>
                                <TextInput
                                    style={styles.inputBox}
                                    value={jobRole}
                                    placeholder="Enter Job Role"
                                    onChangeText={(text) => {
                                        const onlyLetters = text.replace(/[^A-Za-z\s]/g, "")
                                        setJobRole(onlyLetters)
                                    }} />
                            </View>
                        </>
                    )}


                    {employmentStatus !== "Student" && (
                        <>
                            <Text style={styles.labelTxt}>Shift Type </Text>

                            <TouchableOpacity onPress={() => setOpenShiftList(!openShiftList)}
                                style={styles.inputBox}>
                                <Text style={styles.valueTxt}>{shiftType ? shiftType : "Select Shift Type"}</Text>
                                <Ionicons name={openShiftList ? "chevron-up" : "chevron-down"} size={18} />
                            </TouchableOpacity>
                        </>
                    )}

                    {openShiftList && (
                        <View style={{
                            borderWidth: 1, borderRadius: 10, marginTop: 8, borderColor: '#D9D9D9', elevation: 1,
                            backgroundColor: '#ffffff', paddingVertical: 4, paddingHorizontal: 18
                        }}>
                            {shiftTypeList.map((i, index) => (
                                <TouchableOpacity key={index} onPress={() => {
                                    setShiftType(i?.type)
                                    setOpenShiftList(false)
                                }}
                                    style={{ marginVertical: 10 }}>
                                    <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium' }}>{i.type}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}


                    <Text style={styles.labelTxt}>{employmentStatus === "Student" ? "College/Institute Location" : "Work Location"}
                        <Text style={{ color: 'red' }}> *</Text>
                    </Text>

                    <View>
                        <TextInput
                            style={styles.inputBox}
                            value={location}
                            placeholder="Enter Location"
                            onChangeText={(text) => {
                                const onlyLetters = text.replace(/[^A-Za-z\s]/g, "")
                                setLocation(onlyLetters)
                            }} />
                    </View>

                    {errors.location && (<ErrorMessage message={errors.location} type="error" />)}

                    <Text style={styles.labelTxt}>{employmentStatus === "Student" ? "College Timing" : "Shift Timing"}
                        <Text style={{ color: 'red' }}> *</Text>
                    </Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <TouchableOpacity onPress={() => openTimePicker('from')}
                            style={[styles.shiftInputBox, { marginRight: 6 }]}>
                            <Text> {shiftFrom ? formatTime(shiftFrom) : "From"}</Text>
                            <Image source={TimerIcon} style={{ width: 22.5, height: 22.5 }} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => openTimePicker('to')}
                            style={[styles.shiftInputBox, { marginRight: 6 }]}>
                            <Text>  {shiftTo ? formatTime(shiftTo) : "To"}</Text>
                            <Image source={TimerIcon} style={{ width: 22.5, height: 22.5 }} />
                        </TouchableOpacity>
                    </View>

                    {errors.shiftTime && (<ErrorMessage message={errors.shiftTime} type="error" />)}
                </View>

            </ScrollView>
            </KeyboardAvoidingView>

            <View style={{
                backgroundColor: '#ffffff', width: '100%', position: 'absolute',
                alignSelf: "center", bottom: 0
            }}>

                <TouchableOpacity onPress={saveChanges}
                    style={{
                        backgroundColor: "#1E45E1", borderRadius: 8, justifyContent: 'center',
                        alignItems: 'center', paddingVertical: 15, marginBottom: 40, marginTop: 10
                    }}>
                    <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Semibold', color: '#FFFFFF' }}>Save Changes</Text>
                </TouchableOpacity>
            </View>

            {openCalendar && (
                <View style={styles.dateOverlay}>
                    <TouchableWithoutFeedback onPress={() => setOpenCalendar(false)}>
                        <View style={styles.overlayBg} />
                    </TouchableWithoutFeedback>

                    <View style={styles.calendarContainer}>
                        <Calendar
                            current={
                                calendarType === "start"
                                    ? (
                                        startDate
                                            ? dayjs(startDate).format("YYYY-MM-DD")
                                            : today.format("YYYY-MM-DD")
                                    )
                                    : (
                                        endDate
                                            ? dayjs(endDate).format("YYYY-MM-DD")
                                            : dayjs(startDate).format("YYYY-MM-DD")
                                    )
                            }

                            minDate={
                                calendarType === "end"
                                    ? dayjs(startDate).format("YYYY-MM-DD")
                                    : undefined
                            }

                            onDayPress={onDateSelect}

                            markedDates={{
                                ...(startDate && {
                                    [dayjs(startDate).format("YYYY-MM-DD")]: {
                                        selected: true,
                                        selectedColor: "#2563EB",
                                    },
                                }),

                                ...(endDate && {
                                    [dayjs(endDate).format("YYYY-MM-DD")]: {
                                        selected: true,
                                        selectedColor: "#16A34A",
                                    },
                                }),
                            }}

                            theme={{
                                todayTextColor: "#2563EB",
                                selectedDayBackgroundColor: "#2563EB",
                                selectedDayTextColor: "#FFF",
                                arrowColor: "#111827",
                            }}
                        />
                    </View>
                </View>
            )}

            {openTimeBox && (
                <DateTimePicker
                    value={
                        pickerType === 'from'
                            ? shiftFrom || new Date()
                            : shiftTo || new Date()
                    }
                    mode="time"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    is24Hour={false}
                    onChange={onTimeChange} />
            )}

        </View>
    )

}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1, paddingVertical: 20, paddingHorizontal: 20, backgroundColor: '#ffffff'
    },
    mainheader: {
        fontSize: 20, fontFamily: 'Gilroy-Bold', marginTop: 15, marginBottom: 10,
        marginLeft: 8
    },
    labelTxt: {
        fontSize: 14, fontFamily: "Gilroy-Medium", color: '#4B4B4B', marginTop: 14
    },
    valueTxt: {
        fontSize: 15, fontFamily: "Gilroy-Medium", color: '#222222'
    },
    inputBox: {
        borderWidth: 1, borderRadius: 8, borderColor: '#D9D9D9', paddingVertical: 16,
        paddingHorizontal: 14, marginTop: 12, flexDirection: 'row',
        justifyContent: 'space-between', fontSize: 15,
        fontFamily: "Gilroy-Medium",
    },
    shiftInputBox: {
        borderWidth: 1, borderRadius: 8, borderColor: '#D9D9D9', paddingVertical: 16,
        paddingHorizontal: 14, marginTop: 12, flexDirection: 'row',
        justifyContent: 'space-between', flex: 1

    },
    dateOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
    },

    overlayBg: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.3)",
    },

    calendarContainer: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 10,
        width: "85%",
        elevation: 10,
    },
})

export default AddJobDetails;
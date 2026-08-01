import React, { useContext, useState } from "react";
import { View, Text, TextInput, Image, TouchableWithoutFeedback, StyleSheet, Animated, ScrollView, TouchableOpacity, Platform, Alert } from "react-native";
import FilterSimpleIcon from '../../../assets/Images/filterSimple.png'
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";
import { getPaymentList } from "../../../Action/HostelAction";
import { LoginContexts } from "../../../Context/LoginContext";
import { UsersContext } from "../../../Context/UserContext";
import { paymentContexts } from "../../../Context/PaymentContext";


const FilterPayments = ({
    visible,
    onClose,
    panResponder,
    sheetY,

}) => {

    const { getToken } = useContext(LoginContexts)
    const { getHostelDetail } = useContext(UsersContext)
    const { updateInvoiceList } = useContext(paymentContexts)

    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    const [showPicker, setShowPicker] = useState(false);
    const [activeField, setActiveField] = useState(null);
    const [openCalendar, setOpenCalendar] = useState(false);
    const [calendarType, setCalendarType] = useState("");
    const today = dayjs();

    const [tempDate, setTempDate] = useState(new Date());
    const [selectedDays, setSelectedDays] = useState()


    const onCloseFilter = () => {
        setFromDate(null)
        setToDate(null)
        setSelectedDays("")
        onClose()
    }

    const openStartCalendar = () => {
        setCalendarType("start");
        setOpenCalendar(true);
    };
    const openEndCalendar = () => {

        if (!fromDate) {
            Alert.alert("Please select Start Date first");
            return;
        }

        setCalendarType("end");
        setOpenCalendar(true);
    };

    const onDateSelect = (day) => {

        if (calendarType === "start") {

            setFromDate(new Date(day.dateString));

            setToDate(null)
        } else {

            const selectedEnd = new Date(day.dateString);

            if (selectedEnd < fromDate) {
                Alert.alert("End Date cannot be before Start Date");
                return;
            }

            setToDate(selectedEnd);
        }

        setOpenCalendar(false);
    };

    const resetAll=()=>{
         setFromDate(null)
        setToDate(null)
        setSelectedDays("")
    }


    const formatDate = (date) => {
        if (!date) return 'DD-MM-YYYY';
        const d = String(date.getDate()).padStart(2, '0');
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const y = date.getFullYear();
        return `${d}-${m}-${y}`;
    };

    const onSelectDays = (value) => {
        setSelectedDays(value)
    }

    const onApplyFilter = () => {
        getPaymentList(getHostelDetail.hostelId, getToken, formatDate(fromDate), formatDate(toDate), String(selectedDays)).then(r => {
            console.log("PaymentList", r)

            if (r.status == 200) {
                updateInvoiceList(r.data)
                onClose()
            }else{
                updateInvoiceList("")
                onClose()
            }
        })
    }

    const resetAllFilter=()=>{
         setFromDate(null)
        setToDate(null)
        setSelectedDays("")
       
        setTimeout(() => {
             getPaymentList(getHostelDetail.hostelId, getToken, formatDate(fromDate), formatDate(toDate), String(selectedDays)).then(r => {
            console.log("PaymentList", r)

            if (r.status == 200) {
                updateInvoiceList(r.data)
                onClose()
            }else{
                updateInvoiceList("")
                onClose()
            }
        })
            
        }, 800);
       
    }




    if (!visible) return null;
    return <View style={styles.sheetOverlay}>
        <TouchableWithoutFeedback onPress={onCloseFilter}>
            <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>

        <Animated.View
            style={[styles.bottomSheet, { transform: [{ translateY: sheetY }] }]}
            {...panResponder.panHandlers}
        >
            <View style={{ flex: 1 }}>

                <View {...panResponder.panHandlers}>
                    <View style={styles.dragindictor} />
                </View>
                <ScrollView showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={{ padding: 20, flex: 1 }}>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={FilterSimpleIcon} style={{ width: 24, height: 24 }} />
                            <Text style={{ fontSize: 20,fontFamily:'Gilroy-Semibold', marginLeft: 10 }}>Filter by</Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 16 }}>
                            <Text style={{ fontSize: 14,fontFamily:'Gilroy-Medium' }}>Date Range</Text>

                            <TouchableOpacity onPress={resetAll}>
                                <Text style={{ fontSize: 14,fontFamily:'Gilroy-Medium', color: '#1E45E1' }}>Reset</Text>
                            </TouchableOpacity>
                        </View>


                        <View style={styles.row}>
                            {/* FROM DATE */}
                            <View style={styles.field}>
                                <Text style={styles.label}>From</Text>
                                <TouchableOpacity
                                    style={styles.input}
                                    onPress={openStartCalendar}
                                >
                                    <Text numberOfLines={1} ellipsizeMode="clip"
                                        style={[
                                            styles.text,
                                            fromDate && styles.selectedText,
                                        ]}
                                    >
                                        {formatDate(fromDate)}
                                    </Text>
                                    <View style={styles.iconBox}>
                                        <Ionicons
                                            name="calendar-outline"
                                            size={20}
                                            color="#1E2A5A"
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>

                            {/* TO DATE */}
                            <View style={styles.field}>
                                <Text style={styles.label}>To</Text>
                                <TouchableOpacity
                                    style={[
                                        styles.input,
                                        !fromDate && styles.disabledInput,
                                    ]}
                                    disabled={!fromDate}
                                    onPress={openEndCalendar}
                                >
                                    <Text numberOfLines={1} ellipsizeMode="clip"
                                        style={[
                                            styles.text,
                                            toDate && styles.selectedText,
                                        ]}
                                    >
                                        {formatDate(toDate)}
                                    </Text>
                                    <View style={styles.iconBox}>
                                        <Ionicons
                                            name="calendar-outline"
                                            size={20}
                                            color="#1E2A5A"
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* {showPicker && (
                            <DateTimePicker
                                value={tempDate}
                                mode="date"
                                display="calendar"
                                onChange={onDateChange}
                            />
                        )} */}



                        <View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, paddingTop: 15 }}>
                                <View style={{ paddingRight: 5, flex: 1 }}>
                                    <TouchableOpacity onPress={() => onSelectDays("Today")}
                                       style={[styles.daysContainer, selectedDays === "Today" && {borderColor:'#1E45E1'}]}>
                                        <Text style={styles.daysText}>Today</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ paddingLeft: 5, flex: 1 }}>
                                    <TouchableOpacity onPress={() => onSelectDays("This Week")}
                                        style={[styles.daysContainer, selectedDays === "This Week" && {borderColor:'#1E45E1'}]}>
                                        <Text style={styles.daysText}>This Week</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ paddingLeft: 10, flex: 1, }}>
                                    <TouchableOpacity onPress={() => onSelectDays("This Month")}
                                        style={[styles.daysContainer, selectedDays === "This Month" && {borderColor:'#1E45E1'}]}>
                                        <Text style={styles.daysText}>This Month</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <View style={{ paddingTop: 20 }}>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <View style={{ paddingRight: 5, flex: 1 }}>
                                    <TouchableOpacity onPress={resetAllFilter}
                                    style={{ borderRadius: 8, justifyContent: 'center',  paddingHorizontal:10,
                                                paddingVertical: 16, alignItems: 'center',backgroundColor:'#EFF2FF' }}>
                                        <Text style={{fontSize:14,fontFamily:'Gilroy-Medium',color:'#1E45E1'}}>Reset all</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ paddingLeft: 5, flex: 1 }}>
                                    <TouchableOpacity onPress={onApplyFilter}
                                        style={{borderRadius: 8, justifyContent: 'center', alignItems: 'center', paddingHorizontal:10,
                                                paddingVertical: 16,backgroundColor:'#1E45E1' }}>
                                        <Text style={{fontSize:14,fontFamily:'Gilroy-Medium',color:'#FFFFFF'}}>Apply</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>

                    </View>


                </ScrollView>


            </View>
        </Animated.View>
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
                                    fromDate
                                        ? dayjs(fromDate).format("YYYY-MM-DD")
                                        : today.format("YYYY-MM-DD")
                                )
                                : (
                                    toDate
                                        ? dayjs(toDate).format("YYYY-MM-DD")
                                        : dayjs(fromDate).format("YYYY-MM-DD")
                                )
                        }

                        minDate={
                            calendarType === "end"
                                ? dayjs(fromDate).format("YYYY-MM-DD")
                                : undefined
                        }

                        onDayPress={onDateSelect}

                        markedDates={{
                            ...(fromDate && {
                                [dayjs(formatDate).format("YYYY-MM-DD")]: {
                                    selected: true,
                                    selectedColor: "#2563EB",
                                },
                            }),

                            ...(toDate && {
                                [dayjs(toDate).format("YYYY-MM-DD")]: {
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

    </View>

}
export default FilterPayments;

const styles = StyleSheet.create({
    bottomSheet: {
        height: '45%', backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 5,
        paddingTop: 20, paddingBottom: 10
    },
    sheetOverlay: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
    },
    dragindictor: { width: 50, height: 4, backgroundColor: "#ccc", borderRadius: 2, alignSelf: "center", marginBottom: 10 },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 20
    },
    field: {
        width: '48%',
    },
    label: {
        fontSize: 13,
        color: '#9AA0A6',
        fontFamily:'Gilroy-Medium',
        marginBottom: 6,
    },
    input: {
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E3E7EF',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    text: {
        flex: 1,
        paddingLeft: 14,
        fontSize: 15,
        fontFamily:'Gilroy-Regular', 
        color: '#B0B4BB',
        includeFontPadding: false,
    },
    selectedText: {
        color: '#3C4043',
        fontFamily:'Gilroy-Regular' 
    },
    iconBox: {
        width: 44,
        height: '100%',
        backgroundColor: '#EEF2FF',
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    daysText: {
        fontSize: 13,fontFamily:'Gilroy-Medium', color: '#555E67'
    },
    daysContainer: {
        borderRadius: 10, borderWidth: 1, justifyContent: 'center', alignItems: 'center',
        paddingVertical: 14, borderColor: '#ECEDF0',paddingHorizontal:10
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
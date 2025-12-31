import React, { useState } from "react";
import { View, Text, TextInput, Image, TouchableWithoutFeedback, StyleSheet, Animated, ScrollView, TouchableOpacity, Platform } from "react-native";
import FilterSimpleIcon from '../../../assets/Images/filterSimple.png'
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';


const FilterPayments = ({
    visible,
    onClose,
    panResponder,
    sheetY,

}) => {

    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    const [showPicker, setShowPicker] = useState(false);
    const [activeField, setActiveField] = useState(null);

    const [tempDate, setTempDate] = useState(new Date());

    const openPicker = (field) => {
        setActiveField(field);

        if (field === 'from') {
            setTempDate(fromDate || new Date());
        } else {
            setTempDate(toDate || new Date());
        }

        setShowPicker(true);
    };

    const onDateChange = (event, selectedDate) => {
    if (event.type === 'dismissed') {
        setShowPicker(false);
        return;
    }

    if (event.type === 'set' && selectedDate) {
        setTempDate(selectedDate);

        if (activeField === 'from') {
            setFromDate(selectedDate);

            if (toDate && selectedDate > toDate) {
                setToDate(null);
            }
        }

        if (activeField === 'to') {
            setToDate(selectedDate);
        }

        setShowPicker(false);
    }
};


    const formatDate = (date) => {
        if (!date) return 'DD-MM-YYYY';
        const d = String(date.getDate()).padStart(2, '0');
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const y = date.getFullYear();
        return `${d}-${m}-${y}`;
    };




    if (!visible) return null;
    return <View style={styles.sheetOverlay}>
        <TouchableWithoutFeedback onPress={onClose}>
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
                            <Text style={{ fontSize: 20, fontWeight: 600, marginLeft: 10 }}>Filter by</Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 16 }}>
                            <Text style={{ fontSize: 14, fontWeight: 400 }}>Date Range</Text>

                            <TouchableOpacity>
                                <Text style={{ fontSize: 14, fontWeight: 400, color: '#1E45E1' }}>Reset</Text>
                            </TouchableOpacity>
                        </View>


                        <View style={styles.row}>
                            {/* FROM DATE */}
                            <View style={styles.field}>
                                <Text style={styles.label}>From</Text>
                                <TouchableOpacity
                                    style={styles.input}
                                    onPress={() => openPicker('from')}
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
                                    onPress={() => openPicker('to')}
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

                        {showPicker && (
                            <DateTimePicker
                                value={tempDate}
                                mode="date"
                                display="calendar"
                                onChange={onDateChange}
                            />
                        )}

                        <View>
                            <View style={{ flexDirection: 'row',justifyContent: 'space-between', flex: 1, paddingTop: 15 }}>
                                <View style={{ paddingRight:5, flex: 1 }}>
                                    <TouchableOpacity
                                        style={styles.daysContainer}>
                                        <Text style={styles.daysText}>Today</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ paddingLeft: 5, flex: 1 }}>
                                    <TouchableOpacity
                                        style={styles.daysContainer}>
                                        <Text style={styles.daysText}>This Week</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ paddingLeft: 10, flex: 1, }}>
                                    <TouchableOpacity
                                        style={styles.daysContainer}>
                                        <Text style={styles.daysText}>This Month</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <View style={{paddingTop:20}}>
                            <View style={{flexDirection:'row',flex:1}}>
                                <View style={{paddingRight:5,flex:1}}>
                                    <TouchableOpacity style={{borderWidth:1,borderRadius:8, justifyContent: 'center', alignItems: 'center', padding: 10}}>
                                        <Text>Reset all</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{paddingLeft:5,flex:1}}>
                                    <TouchableOpacity style={{borderWidth:1,borderRadius:8, justifyContent: 'center', alignItems: 'center', padding: 10}}>
                                        <Text>Apply</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>

                    </View>


                </ScrollView>


            </View>
        </Animated.View>

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
        color: '#B0B4BB',
        includeFontPadding:false,
    },
    selectedText: {
        color: '#3C4043',
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
    daysText:{
        fontSize:12,fontWeight:400,color:'#555E67'
    },
    daysContainer:{ borderRadius:10, borderWidth: 1, justifyContent: 'center', alignItems: 'center', padding: 10,borderColor:'#ECEDF0' }
})
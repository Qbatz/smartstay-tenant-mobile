import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import LeftArrow from "../../../assets/Images/LeftArrow.png"
import sideframe from '../../../assets/Images/sideframe.png'
import KeyIcon from "../../../assets/Images/KeyIcon.png"
import { useNavigation } from "@react-navigation/native";



const PrivacySecurity = ({ }) => {

    const navigation=useNavigation();

    return <View style={styles.mainContainer}>

        <View style={styles.headerField}>
            <TouchableOpacity onPress={()=>navigation.goBack()}>
                <Image source={LeftArrow} style={{ width: 20, height: 20 }} />
            </TouchableOpacity>
            <Text style={styles.headerTxt}>Privacy & Security</Text>
        </View>

        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: 30, justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={KeyIcon} style={{ width: 20, height: 20 }} />
                <Text style={styles.chngePinTxt}>Change mPin</Text>
            </View>

            <Image source={sideframe} style={{ width: 23, height: 23 }} />
        </TouchableOpacity>

    </View>

}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: '#FFFFFF',
        flex: 1, paddingHorizontal: 20,
        paddingVertical: 20
    },
    headerField: {
        marginTop: 18, flexDirection: 'row', alignItems: 'center',marginBottom:6
    },
    headerTxt: {
        fontSize: 20, fontFamily: 'Gilroy-Semibold', marginLeft: 6
    },
    chngePinTxt: {
        fontSize: 16, fontFamily: 'Gilroy-Medium', marginLeft: 6
    }
})

export default PrivacySecurity;
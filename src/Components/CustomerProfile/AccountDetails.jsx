import React, { useContext } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import sideframe from '../../assets/Images/sideframe.png'
import buildings from '../../assets/Images/buildings.png'
import LeftArrow from "../../assets/Images/LeftArrow.png"
import { useNavigation } from "@react-navigation/native";
import { UsersContext } from "../../Context/UserContext";
import userPersonalIcon from "../../assets/Images/userAccount.png"
import DocPersonalIcon from "../../assets/Images/docPersonal.png"


const AccountDetails = (route) => {

    const navigation= useNavigation();
     const context = useContext(UsersContext)

    const handlPersonalEdit=()=>{
        navigation.navigate("PersonalDetails", { customer: context.getCustomerDetail })
    }

    const handleBackgroundDetailsEdit=()=>{
        navigation.navigate("BackgroundDetails", { customer: context.getCustomerDetail })
    }

    const handleDocumentUpload=()=>{
        navigation.navigate("DocumentUpload", { customer: context.getCustomerDetail })
    }


    return <View style={{ backgroundColor: '#ffffff', flex: 1, padding: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 18 }}>
            <TouchableOpacity onPress={()=>navigation.goBack()}>
                <Image source={LeftArrow} style={{ height: 25, width: 25 }} />
            </TouchableOpacity>
            
            <Text style={{ fontSize: 20, fontFamily: 'Gilroy-Semibold', marginLeft: 8 }}>Account Details</Text>
        </View>
        <View style={styles.cards}>

            <TouchableOpacity onPress={handlPersonalEdit}
            style={styles.row}>
                <View style={{ flexDirection: 'row',alignItems:'center' }}>
                    <Image source={userPersonalIcon} style={{ width: 25, height: 25 }} />
                    <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Medium', marginLeft: 5 }}>
                        Personal Details</Text>
                </View>

                <Image source={sideframe} style={{ width: 23, height: 23 }} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity onPress={handleBackgroundDetailsEdit}
            style={styles.row}>
                <View style={{ flexDirection: 'row',alignItems:'center' }}>
                    <Image source={buildings} style={{ width: 25, height: 25 }} />
                    <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Medium', marginLeft: 5 }}>
                        Background Details</Text>
                </View>

                <Image source={sideframe} style={{ width: 23, height: 23 }} />
            </TouchableOpacity>


            <View style={styles.divider} />

            <TouchableOpacity onPress={handleDocumentUpload}
            disabled={route.route?.params?.customer?.currentStatus === "BOOKED" ? true : false}
            style={[styles.row,{opacity: route.route?.params?.customer?.currentStatus === "BOOKED" ? 0.5 : 1}]}>
                <View style={{ flexDirection: 'row',alignItems:'center' }}>
                    <Image source={DocPersonalIcon} style={{ width: 25, height: 25 }} />
                    <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Medium', marginLeft: 5 }}>
                       Documents</Text>
                </View>

                <Image source={sideframe} style={{ width: 23, height: 23 }} />
            </TouchableOpacity>




        </View>
    </View>

}

const styles = StyleSheet.create({
    cards: {
        backgroundColor: "#fff",
        padding: 5,
        borderColor: "#eee",
        marginBottom: 12,
        marginTop: 30
    },
    row: { flexDirection: 'row', justifyContent: 'space-between',alignItems:'center' },
    divider: {
        height: 1,
        backgroundColor: "#eee",
        marginVertical: 20

    },
})
export default AccountDetails;
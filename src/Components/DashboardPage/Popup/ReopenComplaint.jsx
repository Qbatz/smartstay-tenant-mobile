import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from "react-native";
import DeleteIcon from '../../../assets/Images/deleteIcon.png'


const ReopennComplaint = ({
    visible,
    onClose,
}) => {

    const reasonReopen = [{ id: '1', reason: "Issue wasn't getting solve yet" }, { id: '2', reason: 'Still the issue continues' }, { id: '3', reason: 'others' }]

    const [selectedReason, setSelectedReason] = useState()

    if (!visible) return null;

    return (
        <View style={style.layout}>
            <View style={style.container}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <View style={{flex:1}}>
                        <Text style={{ fontSize: 18, fontWeight: 600 }}>Reopen Complaint</Text>

                        <Text style={{ fontSize: 14, fontWeight: 400,marginTop:10 }}>Plumbing (#002)</Text>
                    </View>

                    <TouchableOpacity onPress={onClose} style={{ justifyContent: 'center', paddingTop: 5 }}>
                        <Image source={DeleteIcon} style={{ width: 20, height: 20 }} />
                    </TouchableOpacity>

                </View>


                <View style={{ height: 1, backgroundColor: "#eee", marginVertical: 10 }} />

                <Text style={{ fontSize: 13, fontWeight: 400,marginTop:10 }}>Please letus know the reason before reopen the complaint again!</Text>

                <View style={{ paddingTop: 20 }}>
                    {reasonReopen.map((item) => (
                        <TouchableOpacity key={item.id} onPress={() => setSelectedReason(item.reason)}
                            style={{
                                backgroundColor: '#FAFAFA', borderRadius: 8, paddingHorizontal: 12,
                                marginBottom: 10, flexDirection: 'row', alignItems: 'center', paddingVertical: 12
                            }} >
                            <View style={{
                                height: 20, width: 20, borderRadius: 10, borderWidth: 2,
                                borderColor: selectedReason === item.reason ? "#1E45E1" : "#ccc",
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: 10,
                            }} >

                                {selectedReason === item.reason && (
                                    <View
                                        style={{
                                            height: 10, width: 10, borderRadius: 5,
                                            backgroundColor: "#1E45E1",
                                        }}
                                    />
                                )}
                            </View>
                            <Text>{item.reason}</Text>
                        </TouchableOpacity>
                    ))}

                    {selectedReason === "others" ? <View style={{ borderRadius: 10, backgroundColor: '#FAFAFA', height: 80 }}>
                        <TextInput placeholder="Enter the reason" style={{ marginLeft: 5, flex: 1, textAlignVertical: 'top' }}
                            multiline
                            blurOnSubmit={false} />
                    </View> : null}

                    <View style={{flexDirection:'row',justifyContent:'flex-end',paddingTop:15}}>
                        <TouchableOpacity onPress={onClose}
                        style={{borderWidth:1,padding:10,borderRadius:5,marginRight:10}}>
                            <Text>Cancel</Text>
                        </TouchableOpacity>

                         <TouchableOpacity style={{borderWidth:1,padding:10,borderRadius:5}}>
                            <Text>Re-Open</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>

        </View>
    )
}

export default ReopennComplaint;

const style = StyleSheet.create({
    layout: {
        position: 'absolute',
        backgroundColor: '#rgba(0, 0, 0, 0.1)',
        width: '100%', height: "100%",
        justifyContent: 'center', alignItems: 'center'
    },
    container: {
        backgroundColor: '#ffffff',
        width: '90%',
        padding: 20,
        borderRadius: 10
    }
})
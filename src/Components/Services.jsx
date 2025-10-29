import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { ImageBackground } from "react-native/types_generated/index";

function Services(props) {
    const [selectedfield, setselectfield] = useState(0);

    const list1 = ['Washing machine', 'plumbing', 'kitchen']
    const list2 = ['wifi', 'laundry']

    function firstclick(id) {
        console.log(id)
        setselectfield(id)
    }
    function secondclick(id) {
        console.log(id)
        setselectfield(id)
    }
    return <View >
        <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => firstclick(list1.length)} style={{
                backgroundColor: selectedfield === list1.length ? '#1E45E1' : 'white',
                flex: 1,
                borderRadius: 10,
                paddingTop: 15,
                paddingBottom: 15,
                borderColor: '#f4f4f4',
                borderWidth: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 5,
            }}>
                <View style={{ flexDirection: 'row' }}>
                    <Image source={require('../assets/Images/Messagef.png')} style={{color:selectedfield===list1.length?'blue':"black", width: 25, height: 25 }} />
                    <Text style={{ color: selectedfield == list1.length ? "white" : 'black', fontSize:16, fontWeight:'400',marginLeft:10 }}>Complaints</Text>
                </View>

            </TouchableOpacity>
            <TouchableOpacity onPress={()=>secondclick (list2.length)} style={{
                backgroundColor: selectedfield === list2.length ? '#1E45E1' : 'white',
                flex: 1,
                borderRadius: 10,
                borderColor: '#f4f4f4',
                paddingTop: 15,
                paddingBottom: 15,
                borderWidth: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 5,
            }}>
                <View style={{ flexDirection: 'row' }}>
                    <Image source={require('../assets/Images/Messagef.png')} style={{ width: 25, height: 25 }} />
                    <Text style={{ color: selectedfield == list2.length ? "white" : 'black', fontSize:16, fontWeight:'400', marginLeft:10 }}>Amenities</Text>
                </View>
            </TouchableOpacity>
        </View>

        {selectedfield == list1.length && list1.length > 0 ? <ScrollView style={{ marginTop: 10 }}>
            {list1.map(i => {
                return <View key={i.length}>
                    <View style={{ borderWidth: 1, borderRadius: 8, marginTop: 10, padding: 20, flexDirection:'row', justifyContent:'space-between', borderColor:'#f4f4f4'}}>
                        <View>
                            <Text style={{ fontSize: 16, fontWeight: '600' }}>{i}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop:10 }}>
                                <Image source={require('../assets/Images/bill.png')} style={{ width: 16, height: 16 }} />
                                <Text>Pipe</Text>
                            </View>
                        </View>
                        <View>
                            <Text>2 hrs</Text>
                            <Text>Inprogress</Text>
                        </View>

                    </View>

                </View>

            })}

        </ScrollView> : null}
    </View>

}
export default Services;
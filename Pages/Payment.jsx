import React from "react";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";

function Payment(props) {

    const list = ['Sep Month Rental', 'July Month Rent', 'EB Bill', 'Wifi bill']
    const separator = (style) => { return <View style={[style.separatorstyle, style]} /> }

    return <View>
        <ScrollView>


            {list.map(i => {
                return <View key={i.length} style={{ flexDirection: 'row', borderWidth: 1, borderRadius: 10, marginTop: 10, padding: 10, flex:1, borderColor:'#b2b2b4'}}>
                    <View>
                        <Image source={require('../Images/sidearrow.png')} style={{ width: 26.66, height: 26.66 }} />
                    </View>
                    <View style={{flexDirection:'row', justifyContent:'space-between', flex:1, paddingLeft:10}}>
                        <View >
                            <Text>{i}</Text>
                            <Text style={{ marginTop: 10 }}>04 Aug 2025</Text>
                        </View>
                        <View style={{ marginRight:10, paddingLeft:20, paddingRight:15}}>
                            <Text>{'\u20B9'}6000</Text>
                            <Text style={{marginTop:10}}>Paid</Text>
                        </View>

                    </View>



                </View>

            })}
        </ScrollView>

    </View>
}


export default Payment;


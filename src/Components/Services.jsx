import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from "react-native";
// import { ImageBackground } from "react-native/types_generated/index";
import AddComplaint from '../assets/Images/addComplaint.png'
import BottomSheet from "@gorhom/bottom-sheet";
// import 'react-native-reanimated'

function Services(props) {
    const [selectedfield, setselectfield] = useState(0);

    const sheetRef=useRef();
    const snapPoints=useMemo(()=>['25%'],[])

    const list1 = [{id: 1, title:'Washing machine', issue:'Plumbing', status:'Pending'},
       { id:2,title: 'Water Tap Leakage', issue:'Plumbing', status:'Pending'}, {id:3, title: 'Charging port was not working', issue:'Electricity', status:'Resolved'}, {id:4, title:'Room maintanence', issue:'Maintanence', status:'Pending'}, {id:5, title:'Locker Problem', issue:'Maintanence', status:'Resolved'}, {id:6, title:'Shower not working', issue:'Plumbing', status:'Resolved'},{id:7, title:'Home not clean', issue:'Maintanence', status:'Resolved'},
    {id:8, title:'Electricity', issue:'Electricity', status:'Pending'},{ id:9,title: 'Water Tap Leakage', issue:'Plumbing', status:'Pending'}, {id:10, title: 'Charging port was not working', issue:'Electricity', status:'Resolved'}]
    const list2 = ['wifi', 'laundry']

    const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'pending':
    case 'inprogress':
      return {
          backgroundColor: '#FFE5B4', 
        textColor: '#8B4513', 
      };
    case 'resolved':
      return { backgroundColor: '#C1F0C1', 
        textColor: '#06470C',};
    default:
      return  {
        backgroundColor: '#E0E0E0',
        textColor: '#333',
      };
  }
};

const handleopen=useCallback(()=>{
    sheetRef.current?.expand();

}, [])



    useEffect(()=>{
        firstclick(list1.length)     
    },[])

    function firstclick(id) {
        console.log(id)
        setselectfield(id)
    }
    function secondclick(id) {
        console.log(id)
        setselectfield(id)
    }
    return <View  style={{flex:1, position:'relative'}}>
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

        {selectedfield == list1.length && list1.length > 0 ? <ScrollView style={{ marginTop: 10, position:'relative' }}>
            {list1.map(i => {
                const {backgroundColor, textColor} = getStatusColor(i.status);
                return <View key={i.id} >
                    <TouchableOpacity onPress={()=>handleopen(i.id, 0)}>                  
                    <View style={{ borderWidth: 1, borderRadius: 8, marginTop: 10, padding:20, flexDirection:'row', justifyContent:'space-between', borderColor:'#f4f4f4'}}>
                        <View>
                            <Text style={{ fontSize: 16, fontWeight: '600' }}>{i.title}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop:10 }}>
                                <Image source={require('../assets/Images/bill.png')} style={{ width: 16, height: 16 }} />
                                <Text>{i.issue}</Text>
                            </View>
                        </View>
                        <View >
                            <Text style={{bottom:10, color:'#9C9C9C', left:10, marginBottom:10}}>02 hrs ago</Text>
                            <View   style={{ borderRadius:15,paddingLeft:10, paddingRight:10, paddingTop:3, paddingBottom:3,backgroundColor:backgroundColor}}>
                                <Text style={{color:textColor}}>{i.status}</Text>
                            </View>                            
                        </View>
                    </View>
                     </TouchableOpacity>

                </View>

            })}

        </ScrollView> : null}
        <View style={{position:'absolute', bottom:35, right:-3}}>
            <TouchableOpacity>
                <Image source={AddComplaint} style={{width:48, height:47 }}/>
            </TouchableOpacity>
        </View>
        <BottomSheet ref={sheetRef} snapPoints={snapPoints} enableDynamicSizing={false}>

                <Text>Nothing</Text>
        </BottomSheet>
    </View>

}

export default Services;
import React, { useState,useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import NotificationItem from "./NotificationItem";
import { SwipeListView } from "react-native-swipe-list-view";
import Delete from '../../assets/Images/trash.png'
import { UsersContext } from "../../Context/UserContext";
import { getNotification } from "../../Action/HostelAction";

const notifications = [
  {
    id: "1",
    title: "Hostel Maintenance Alert",
    description:
      "Water supply will be interrupted on Oct 28th, 7 AM – 10 AM for maintenance. Kindly store sufficient water in advance.",
    time: "14h",
    date: "Today",
    type: "alert",
  },
  {
    id: "2",
    title: "Cleanliness Drive",
    description:
      "Common area cleaning is scheduled for Sunday, Oct 27th at 9 AM. Please keep your personal items inside rooms.",
    time: "Yesterday",
    date: "Yesterday",
    type: "info",
  },
  {
    id: "3",
    title: "Water Bill Issued",
    description:
      "Common area cleaning is scheduled for Sunday, Oct 27th at 9 AM. Please keep your personal items inside rooms.",
    time: "Yesterday",
    date: "Yesterday",
    type: "bill",
  },
  {
    id: "4",
    title: "New Tenant Added – Rahul D",
    description: "Tenant added to Ground Floor, Room 102.",
    time: "14h",
    date: "Yesterday",
    type: "user",
  },
  {
    id: "5",
    title: "SJ Suryah Raised a Complaint",
    description: "Issue reported: “Fan not working” in Room 303.",
    time: "15h",
    date: "Yesterday",
    type: "complaint",
  },
  {
    id: "6",
    title: "Complaint Marked Resolved by Admin",
    description: "Issue resolved: “Fan not working” in Room 303.",
    time: "Yesterday",
    date: "Yesterday",
    type: "resolved",
  },
];

const Notification = (props) => {
  console.log(props)
  const context=useContext(UsersContext)
  const navigation = useNavigation();
  const renderItem = ({ item }) => <NotificationItem item={item} />;
  const handleBack = () => navigation.goBack();

  const [listData, setListData] = useState([]);

  useEffect(()=>{
    getNotification(context.getHostelDetail.hostelId,context.getToken).then(r=>{
      console.log(r)
      setListData(r.data)
    })
  },[])


  const deleteRow = (rowMap, rowKey) => {
    const newData = listData.filter(item => item.id !== rowKey);
    setListData(newData);
  };

  return (
    <SafeAreaView style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center" , marginBottom:10}}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
       <Image
             source={require("../../assets/Images/LeftArrow.png")}
             style={{ height: 25, width: 25 }}
           />
       
      </TouchableOpacity>
       <Text style={styles.header}>Notifications</Text>
      </View>

      <SwipeListView
        data={listData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        // showsVerticalScrollIndicator={false}

        renderHiddenItem={(data,rowMap)=>(
          <View style={styles.rowBack}>

            <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]}
            onPress={() => deleteRow(rowMap, data.item.id)}>
                <Image source={Delete} style={{ width: 24, height: 24,tintColor:'#ffffff' }}/>

            </TouchableOpacity>
          </View>
  )}
        rightOpenValue={-75}
        disableRightSwipe
      />
    </SafeAreaView>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
    paddingTop:35
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 5,
  },
  header: {
    fontSize: 22,
    fontWeight: "600",
    marginLeft: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#d11a2a',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 15,
    borderRadius: 10,
    marginBottom: 11,
    overflow:"hidden"
  },
  backRightBtn: {
    alignItems: "center",
    justifyContent: "center",
    width: 75,
    height: "100%",
    borderRadius: 5
  },
  backRightBtnRight: {
    backgroundColor: "red",
    right: 0,
  },
});

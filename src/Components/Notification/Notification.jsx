import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import NotificationItem from "./NotificationItem";
import { SwipeListView } from "react-native-swipe-list-view";
import Delete from '../../assets/Images/trash.png'
import { UsersContext } from "../../Context/UserContext";
import { getNotification } from "../../Action/NotificationAction";
import { LoginContexts } from "../../Context/LoginContext";
import { notificationContexts } from "../../Context/NotificationContext";
import NoResultPic from "../../assets/Images/NoResultPic.png"

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
  const context = useContext(UsersContext)
  const loginContext = useContext(LoginContexts)
  const notificationContext = useContext(notificationContexts)
  const navigation = useNavigation();
  const renderItem = ({ item }) => <NotificationItem item={item} />;
  const handleBack = () => navigation.goBack();

  const [listData, setListData] = useState([]);

  const [notificationPage, setNotificationPage] = useState(1)
  const [hasMoreNotification, setHasMoreNotification] = useState(true)
  const [pageLoading, setPageLoading] = useState(false)
  const onEndReachedCalledDuringMomentum = useRef(true);

  useEffect(() => {
    const onBackPress = () => {
      navigation.goBack();
      return true;
    }

    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => BackHandler.addEventListener('hardwareBackPress', onBackPress);
  }, [navigation])

  console.log("notificationPagination", notificationPage, hasMoreNotification)
  console.log("onlyNotificationList", notificationContext?.getOnlyNotificationList)

  useEffect(() => {
    console.log(context.getHostelDetail.hostelId)
    getNotification(context.getHostelDetail.hostelId, loginContext.getToken).then(r => {
      console.log(r)
      setListData(r.data)
      if (r?.status === 200) {
        notificationContext.updateNoticationList(r.data)
        notificationContext.updateOnlyNotificationList(r.data?.notifications)
      }
      const currentPage = r?.data?.paginationData?.currentPage;
      const totalPage = r?.data?.paginationData?.totalPages;
      // const newNotificationList= r?.data?.paginationData?.notifications;

      setNotificationPage(notificationPage + 1)
      setHasMoreNotification(currentPage < totalPage)
    })
  }, [])


  const deleteRow = (rowMap, rowKey) => {
    const newData = listData.filter(item => item.id !== rowKey);
    setListData(newData);
  };

  const onEndReachFetchNotificationList = async (
    page = notificationPage,
    isRefresh = false
  ) => {
    const hostelId = context.getHostelDetail?.hostelId;

    if (!hostelId || pageLoading) {
      return;
    }

    if (!isRefresh && !hasMoreNotification) {
      return;
    }

    const requestPage = isRefresh ? 1 : page;
    console.log("hasana", requestPage)

    try {
      setPageLoading(true);

      const res = await getNotification(hostelId, loginContext.getToken, requestPage)
      console.log("paginatedList",res)

      if (res?.status === 200) {
        const responseData = res.data;
        const pagination = responseData?.paginationData;
        const currentPage = pagination?.currentPage ?? requestPage;
        const totalPages = pagination?.totalPages ?? currentPage;
        const oldNotificationList = notificationContext?.getOnlyNotificationList || [];
        const newNotificationList = responseData?.notifications || [];

        if (currentPage === 1) {
          notificationContext.updateNoticationList(res.data)
          notificationContext.updateOnlyNotificationList(newNotificationList)
        } else {
          notificationContext.updateOnlyNotificationList([...oldNotificationList, ...newNotificationList])
        }

        setNotificationPage(currentPage + 1);
        setHasMoreNotification(currentPage < totalPages);
      }
    } catch (error) {
      console.log("Invoice pagination error:", error);
    } finally {
      setPageLoading(false);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Image
            source={require("../../assets/Images/LeftArrow.png")}
            style={{ height: 25, width: 25 }}
          />

        </TouchableOpacity>
        <Text style={styles.header}>Notifications</Text>
      </View>


      {notificationContext?.getNotificationList?.notifications?.length > 0 ? <SwipeListView
        data={notificationContext?.getOnlyNotificationList} showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}

        onEndReached={() => {
          if (
            !onEndReachedCalledDuringMomentum.current &&
            !pageLoading &&
            hasMoreNotification
          ) {
            onEndReachedCalledDuringMomentum.current = true;

            onEndReachFetchNotificationList(notificationPage);
          }
        }}
        onEndReachedThreshold={0.2}
        onMomentumScrollBegin={() => {
          onEndReachedCalledDuringMomentum.current = false;
        }}
        ListFooterComponent={
          pageLoading ? <ActivityIndicator size="small" color="blue"/> : null
        }
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      // showsVerticalScrollIndicator={false}

      //       renderHiddenItem={(data,rowMap)=>(
      //         <View style={styles.rowBack}>

      //           <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]}
      //           onPress={() => deleteRow(rowMap, data.item.id)}>
      //               <Image source={Delete} style={{ width: 24, height: 24,tintColor:'#ffffff' }}/>

      //           </TouchableOpacity>
      //         </View>
      // )}
      // rightOpenValue={-75}
      // disableRightSwipe
      /> : <View style={styles.noResult}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image
            source={NoResultPic}
            style={{ width: 324, height: 221, resizeMode: 'contain', marginBottom: 20, }}
          />
          <Text style={{ fontSize: 22, fontFamily: 'Gilroy-Semibold', color: '#000', marginBottom: 8, }}>
            No Notification Available!
          </Text>
          <Text style={{ fontSize: 15, color: '#555', textAlign: 'center', width: 260, lineHeight: 18, fontFamily: 'Gilroy-Medium' }}>
            There is no records relevant to this field.
          </Text>
        </View>
      </View>}


    </SafeAreaView>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
    paddingTop: 35
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 5,
  },
  header: {
    fontSize: 22,
    fontFamily: 'Gilroy-Semibold',
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
    overflow: "hidden"
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
  noResult: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 20 }

});

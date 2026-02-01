import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  BackHandler,
} from 'react-native';
import SingleTickPic from '../../assets/Images/singleTick.png'
import DoubleTick from '../../assets/Images/doubleTick.png'
import InprogressLogo from '../../assets/Images/inprogresspic.png'
import PersonLogo from '../../assets/Images/personlogo.png'
import LeftArrow from "../../assets/Images/LeftArrow.png"
import { useFocusEffect } from '@react-navigation/native';
import { getComplaintsUpdates } from '../../Action/CustomerAction';
import { UsersContext } from '../../Context/UserContext';
import { LoginContexts } from '../../Context/LoginContext';
import { compliantContexts } from '../../Context/ComplaintContext';


const UPDATES = [
  {
    id: '1',
    type: 'RESOLVED',
    title: 'Complaint Resolved',
    description: 'Tenant confirmed the complaint is resolved.',
    time: '25 Oct 2025, 1:00 PM',
  },
  {
    id: '2',
    type: 'COMPLETED',
    title: 'Work Completed',
    description: 'Staff marked complaint as Completed.',
    time: '25 Oct 2025, 12:30 PM',
  },
  {
    id: '3',
    type: 'IN_PROGRESS',
    title: 'Complaint In Progress',
    description: 'Staff marked complaint as In Progress.',
    time: '24 Oct 2025, 11:00 AM',
    comment: 'Complaint will resolve by tomorrow',
    user: 'Nagarajan - Admin',
  },
  {
    id: '4',
    type: 'ASSIGNED',
    title: 'Complaint Assigned',
    description: 'Complaint assigned to Maintenance Staff - Rajesh',
    time: '23 Oct 2025, 9:30 AM',
  },
];


const STATUS = {
  ASSIGNED: { color: '#CBD5E1', icon: PersonLogo },
  IN_PROGRESS: { color: '#FDBA74', icon: InprogressLogo },
  COMPLETED: { color: '#86EFAC', icon: SingleTickPic },
  RESOLVED: { color: '#22C55E', icon: DoubleTick },
  OPENED: { color: '#CBD5E1', icon: PersonLogo }
};



const HistoryCommentsScreen = ({ route, navigation }) => {
  console.log(route)

  const userContext = useContext(UsersContext)
  const loginContext = useContext(LoginContexts)
  const complaintContext = useContext(compliantContexts)

  const [comment, setComment] = useState('');

  const isResolved = complaintContext.NewComplaintUpdates?.currentStatus === 'RESOLVED' || "resolved";

  //  UPDATES[0]?.type

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.goBack();
        return true;
      };

      const subcription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subcription.remove();
    }, [navigation])
  )

  useEffect(() => {
    getComplaintsUpdates(userContext.getHostelDetail?.hostelId, loginContext.getToken, route.params.complaintId).then(r => {
      console.log(r)
      complaintContext.complaintUpdates(r.data.complaintsUpdates)
    })
  }, [])

  console.log(complaintContext.NewComplaintUpdates)

  const renderItem = ({ item, index }) => {
    console.log(item)
    const isLast = index === UPDATES.length - 1;
    const config = STATUS[item?.status];

    return (
      <View style={styles.row}>
        <View style={styles.timeline}>
          <View style={[styles.circle, { backgroundColor: config?.color }]}>
            <Image source={config?.icon} style={{ width: 35, height: 35, resizeMode: 'contain' }} />
          </View>
          {!isLast && <View style={styles.line} />}
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{item.update}</Text>
          <Text style={styles.desc}>{item.description}</Text>
          <Text style={styles.time}>Added at {item?.updatedAt}, {item.updatedTime}</Text>

          {item.comments && (
            item.comments.map(r => {
              return <View style={styles.commentBox}>
                <View style={styles.commentHeader}>
                  {r.profilePic ? <Image
                    source={{ uri: r.profilePic }}
                    style={styles.avatarSmall}
                  /> :
                    <View style={{ width: 28, height: 28, borderRadius: 18, backgroundColor: '#eef1ff', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                      <Text style={{ fontSize: 16, fontWeight: 600, color: '#788fed', }}>
                        {r?.initials}
                      </Text>
                    </View>


                  }


                  <Text style={styles.commentUser}>{r?.commentdBy}</Text>
                </View>
                <Text style={styles.commentText}>{r?.comment}</Text>
              </View>
            })

          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backRow}
          onPress={() => navigation?.goBack()}
        >
          <Image source={LeftArrow} style={{ height: 25, width: 25 }} />
          <Text style={styles.headerTitle}>History & Comments</Text>
        </TouchableOpacity>

        <Text style={styles.complaintId}>Complaint Id - {route?.params?.complaintId}</Text>
      </View>

      {/* ---------- COMMENT INPUT (ONLY AFTER RESOLVED) ---------- */}
      {isResolved && (
        <View style={styles.inputWrapper}>
          <View style={styles.inputRow}>

            {complaintContext.NewComplaintUpdates?.profilePic ? <Image
              source={{ uri: complaintContext.NewComplaintUpdates[0]?.profilePic }}
              style={styles.avatar}
            /> :
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#eef1ff', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                <Text style={{ fontSize: 16, fontWeight: 600, color: '#788fed', }}>
                  {complaintContext.NewComplaintUpdates[0]?.initials}
                </Text>
              </View>}

            <TextInput
              placeholder="Add new comment"
              value={comment}
              onChangeText={setComment}
              multiline
              style={styles.input}
            />
          </View>

          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Add Comment</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={complaintContext.NewComplaintUpdates}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
  );
}

export default HistoryCommentsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 15
  },
  backRow: { flexDirection: 'row', alignItems: 'center' },
  backArrow: { fontSize: 20, marginRight: 8 },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  complaintId: { color: '#2563EB', marginTop: 6 },

  inputWrapper: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputRow: { flexDirection: 'row', alignItems: 'flex-start' },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  input: {
    flex: 1,
    minHeight: 80,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 10,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
  },
  addButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
    backgroundColor: '#2563EB',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: { color: '#fff', fontWeight: '600' },

  row: { flexDirection: 'row', marginBottom: 24 },
  timeline: { width: 40, alignItems: 'center' },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 12, color: '#fff' },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: '#E5E7EB',
    marginTop: 4,
  },

  content: {
    flex: 1,
    backgroundColor: '#fff',
    paddingLeft: 12,
  },
  title: { fontSize: 15, fontWeight: '600', color: '#0F172A' },
  desc: { fontSize: 14, color: '#334155', marginTop: 4 },
  time: { fontSize: 12, color: '#64748B', marginTop: 6 },

  commentBox: {
    marginTop: 10,
    backgroundColor: '#F1F5F9',
    padding: 10,
    borderRadius: 10,
  },
  commentHeader: { flexDirection: 'row', alignItems: 'center' },
  avatarSmall: { width: 28, height: 28, borderRadius: 18 , marginRight: 6 },
  commentUser: { fontSize: 12, fontWeight: '600',flexWrap:'wrap',flex:1 },
  commentText: { fontSize: 13, marginTop: 6 },
});

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform
} from "react-native";
// import dayjs from "dayjs";
import DateIcon from "../../assets/Images/calendar.png";


export default function ComplaintUpdatesScreen({ route, navigation }) {
  const { complaintId } = route.params.complaintId;
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [posting, setPosting] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    fetchUpdates();
  }, []);

  async function fetchUpdates() {
    try {
      setLoading(true);
      const res = await fetch(
        `https://your-api.com/complaints/${complaintId}/updates`
      );
      const data = await res.json();
      setUpdates(data?.updates || []);
    } catch (e) {
      console.log("ERROR →", e);
    } finally {
      setLoading(false);
    }
  }

  async function submitComment() {
    if (!comment.trim()) return;
    setPosting(true);

    const optimistic = {
      id: "temp-" + Date.now(),
      actorName: "You",
      message: comment,
      createdAt: new Date().toISOString(),
      isLocal: true
    };

    setUpdates([optimistic, ...updates]);
    setComment("");

    try {
      await fetch(`https://your-api.com/complaints/${complaintId}/updates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment }),
      });
      fetchUpdates();
    } catch (e) {
      console.log(e);
    }
    setPosting(false);
  }

  const renderUpdate = ({ item }) => (
    <View style={styles.updateItem}>
      <View style={styles.iconCircle}>
        <Image
          source={DateIcon}
          style={{ width: 20, height: 20, tintColor: "#4B74FF" }}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.updateTitle}>
          {item.title || "Complaint Update"}
        </Text>

        <Text style={styles.updateDesc}>{item.message}</Text>

        <Text style={styles.timeText}>
          {/* {dayjs(item.createdAt).format("DD MMM YYYY, hh:mm A")} */}
        </Text>

        {/* Avatar & Actor */}
        {item.actorName && (
          <View style={styles.actorRow}>
            <Image
              source={{
                uri:
                  item.actorAvatar ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png",
              }}
              style={styles.avatar}
            />
            <Text style={styles.actorName}>{item.actorName}</Text>
          </View>
        )}

        {/* Images */}
        {item.images?.length > 0 && (
          <FlatList
            horizontal
            data={item.images}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.attachment} />
            )}
            keyExtractor={(i, idx) => idx.toString()}
            style={{ marginTop: 10 }}
          />
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={DateIcon}
            style={{ width: 22, height: 22 }}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Plumbing <Text style={{ color: "#4B74FF" }}>(#{complaintId})</Text>
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4B74FF" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView style={{ flex: 1 }}>
          <Text style={styles.allUpdatesTitle}>All Updates</Text>

          <FlatList
            data={updates}
            renderItem={renderUpdate}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />

          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      {/* Comment Box */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.commentBar}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Add your comment..."
            value={comment}
            onChangeText={setComment}
          />

          <TouchableOpacity
            style={styles.sendBtn}
            onPress={submitComment}
            disabled={posting}
          >
            <Image
              source={DateIcon}
              style={{
                width: 24,
                height: 24,
                tintColor: posting ? "#999" : "#4B74FF",
              }}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

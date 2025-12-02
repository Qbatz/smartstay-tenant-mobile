import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { hostelList } from "../Action/HostelAction";
import { UsersContext } from "../Context/UserContext";
import { LoginContexts } from "../Context/LoginContext";
import { generateToken, getToken } from "../Action/LoginAction";
import { storeData } from "../Utils/Storage";
import { ACCESS_TOKEN } from "../Utils/Constant";
import { useNavigation } from "@react-navigation/native";


const HostelList = (route) => {

  const context=useContext(UsersContext)
  const loginContext=useContext(LoginContexts)
  const [hostels,setHostelList]=useState([]);
  const [selectedHostel, setSelectedHostel] = useState();
  const navigation=useNavigation()

  console.log(selectedHostel)




  const handleSelect = (hosteldetail) => {
    console.log("hostellist lall",hosteldetail)
    setSelectedHostel(hosteldetail);
  };

  const handleGo = () => {

    const data= {
      xuid:loginContext.getUserId,
      hostelId:selectedHostel?.hostelId,
    }
    console.log(data)

    getToken(data).then(r=>{
      if (r?.status==200) {
      console.log(selectedHostel)
      storeData(ACCESS_TOKEN,r.data)
      loginContext.updateToken(r.data)
      context.updateHostelDetail(selectedHostel)
      navigation.navigate("VerifyKYC");
    }
    })
    
  };

  const renderHostel = ({ item }) => {
    return <TouchableOpacity
      style={[
        styles.hostelCard,
        selectedHostel?.hostelId === item.hostelId&& styles.selectedCard,
      ]}
      onPress={() => handleSelect(item)}
    >
      <View style={styles.cardLeft}>
        <Image source={item.hostelPic} style={styles.hostelImage} />
        <View>
          <Text style={styles.hostelName}>{item.hostelName}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={16} color="#0057FF" />
            <Text style={styles.locationText}>{item.city}</Text>
          </View>
        </View>
      </View>

      {selectedHostel?.hostelId === item.hostelId ? (
        <Ionicons name="radio-button-on" size={22} color="#0057FF" />
      ) : (
        <Ionicons name="radio-button-off" size={22} color="#aaa" />
      )}
    </TouchableOpacity>
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Select Hostel</Text>
        <Text style={styles.subtitle}>Select Your Current Staying Hostel</Text>

        <FlatList
          data={context.getHostelList}
          keyExtractor={(item) => item.hostelId}
          renderItem={renderHostel}
          style={{ marginTop: 20 }}
        />
      </View>

      <View style={styles.goButtonContainer}>
        <TouchableOpacity
          style={styles.goButton}
          onPress={handleGo}
        >
          <Text style={styles.goButtonText}>Go</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 25,
    paddingTop: 50,
    justifyContent: "space-between", 
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
  },
  subtitle: {
    color: "#666",
    marginTop: 5,
    marginBottom: 20,
  },
  hostelCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedCard: {
    borderColor: "#0057FF",
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  hostelImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 15,
  },
  hostelName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  locationText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 4,
  },
  goButtonContainer: {
    flex: 1,
    justifyContent: "center", 
    alignItems: "center",
  },
  goButton: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0057FF",
  },
  goButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default HostelList;

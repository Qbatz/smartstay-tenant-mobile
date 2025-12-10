import React,{useRef,useEffect} from "react";
import { View, Text, StyleSheet, Image, ScrollView,TouchableOpacity } from "react-native";
import DocumentIcon from "../../assets/Images/document-text.png";
import LeftArrow from "../../assets/Images/Line arrow-left.png";
import ViewShot from "react-native-view-shot";
import RNFS from "react-native-fs";
import Share from "react-native-share";


export default function AgreementViewScreen({ route,navigation }) {
  // const { signature } = route.params || {};
   const { signature, download } = route.params || {};
  const viewRef = useRef();

 useEffect(() => {
  if (download) {
    // wait for layout
    setTimeout(() => {
      createPDF();
    }, 1200);
  }
}, [download]);


 const createPDF = async () => {
  try {
    const uri = await viewRef.current.capture();
    const filePath = `${RNFS.DownloadDirectoryPath}/Agreement_${Date.now()}.jpg`;

    await RNFS.copyFile(uri, filePath);

    await Share.open({
      url: `file://${filePath}`,
      type: "image/jpeg",
    });

    navigation.goBack();
  } catch (e) {
    console.log(e);
  }
};


  return (
    <ViewShot ref={viewRef} style={{ flex:1 }} options={{ format: "png", quality: 1 }}>
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} pointerEvents="auto">
     <View style={styles.headerContainer}>
  <TouchableOpacity onPress={() => navigation.navigate("SignatureScreen")}>
    <Image
      source={LeftArrow}
      resizeMode="contain"
      style={styles.backIcon}
    />
  </TouchableOpacity>

  <Text style={styles.headerText}>Agreement</Text>
</View>


      <View style={styles.sectionHeader}>
      <Image
        source={DocumentIcon}
        style={styles.sectionIcon}
        resizeMode="contain"
      />
      <Text style={styles.sectionTitle}>Rental Agreement</Text>
    </View>

      {/* Card box */}
      <View style={styles.card}>
        <Text style={styles.label}>Tenant Name: <Text style={styles.value}>Rajkumar M</Text></Text>
        <Text style={styles.label}>Hostel Address: <Text style={styles.value}>Ground Floor,</Text></Text>
        <Text style={styles.label}>Room No: <Text style={styles.value}>103, 3-Bed Sharing</Text></Text>
        <Text style={styles.label}>Advance Paid: <Text style={styles.value}>₹4,000</Text></Text>
        <Text style={styles.label}>Monthly Rent: <Text style={styles.value}>₹8,000</Text></Text>
        <Text style={styles.label}>Rent Due Date: <Text style={styles.value}>5th of Every Month</Text></Text>
        <Text style={styles.label}>Tenant's Occupation: <Text style={styles.value}>HCL Technologies</Text></Text>


         <Text style={[styles.label, { marginTop:20 }]}>Terms & Conditions:</Text>
      
      <View style={{ marginTop:10 }}>
        <Text style={styles.terms}>1. Tenant must pay the monthly rent of ₹8,000 on or before the 5th of every month.</Text>
        <Text style={styles.terms}>2. The advance amount of ₹2,000 is refundable at the time of checkout after deduction (if any) for damages or pending dues.</Text>
        <Text style={styles.terms}>3. The room allotted is Ground Floor, Room 103 (3-Bed Sharing).</Text>
        <Text style={styles.terms}>4. Tenant is responsible for maintaining cleanliness and avoiding damage to hostel property.</Text>
        <Text style={styles.terms}>5. Any violation of hostel rules may lead to cancellation of stay.</Text>
        <Text style={styles.terms}>6. Hostel management reserves the right to revise rental terms with prior notice.</Text>
      </View>
      </View>

     

      <Text style={{ marginTop:30, color:"#0A090B",fontFamily:"Gilroy",fontSize:16,fontWeight:400 }}>I will agree with All the Terms & Conditions</Text>

     
  <View style={{ alignItems:"flex-end", marginTop:30 }}>
     {signature && (
    <Image 
      source={{ uri: signature }} 
      style={{ width:120, height:60, resizeMode:"contain" }}
    />
    )}
    <Text style={{ fontSize:12, color:"#6B7280", marginTop:4 }}>
      Tenant's Signature
    </Text>
  </View>



      <View style={{ height:50 }} />
    </ScrollView>
    </ViewShot>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"#fff",
    padding:20,
    paddingTop:50
  },
  header:{
    fontSize:20,
    fontWeight:"600",
    color:"#111827",
    marginBottom:10
  },
  tab:{
    color:"#2563EB",
    fontWeight:"600",
    marginBottom:20,
    fontSize:14
  },
  card:{
    backgroundColor:"#F8FAFF",
    padding:15,
    borderRadius:10,
    borderWidth:1,
    borderColor:"#E5E9FF",
    marginTop:20
  },
  label:{
    fontSize:13,
    color:"#6B7280",
    marginBottom:8
  },
  value:{
    color:"#111827",
    fontWeight:"600"
  },
  terms:{
    fontSize:13,
    color:"#6B7280",
    marginBottom:8,
    lineHeight:18
  },
   backIcon: {
    width: 18,
    height: 18,
    marginRight: 6,
  },
   headerContainer: {
    flexDirection: "row", 
    alignItems: "center",
    marginTop: 10,
    marginLeft: 15,
  },
   sectionHeader: {
  flexDirection: "row",
  alignItems: "center",
  marginTop:20
},
sectionIcon: {
  width: 20,
  height: 20,
 marginLeft:15

},
sectionTitle: {
  fontSize: 16,
  fontWeight: "600",
  color: "#2563EB",
  marginLeft:5
},
});

import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView,Image } from "react-native";
import { Checkbox } from "react-native-paper";
import DocumentIcon from "../../assets/Images/document-text.png";
import LeftArrow from "../../assets/Images/Line arrow-left.png"


export default function Agreement({ navigation }) {
  const [checked, setChecked] = useState(false);

  return (
    <ScrollView style={styles.container}>
     <View style={styles.headerContainer}>
      <Image
        source={LeftArrow}
        resizeMode="contain"
        style={styles.backIcon}
      />
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

      <View style={styles.card}>
    

       <View style={styles.infoBox}>
  <Text style={styles.infoText}>
    <Text style={styles.label}>Tenant Name: </Text>
    <Text style={styles.value}>Rajkumar M</Text>
  </Text>
  <Text style={styles.infoText}>
    <Text style={styles.label}>Hostel Address: </Text>
    <Text style={styles.value}>Ground Floor</Text>
  </Text>
  <Text style={styles.infoText}>
    <Text style={styles.label}>Room No: </Text>
    <Text style={styles.value}>103, 3-Bed Sharing</Text>
  </Text>
  <Text style={styles.infoText}>
    <Text style={styles.label}>Advance Rent: </Text>
    <Text style={styles.value}>₹8,000</Text>
  </Text>
  <Text style={styles.infoText}>
    <Text style={styles.label}>Monthly Rent: </Text>
    <Text style={styles.value}>₹6,000</Text>
  </Text>
  <Text style={styles.infoText}>
    <Text style={styles.label}>Rent Due Date: </Text>
    <Text style={styles.value}>5th of Every Month</Text>
  </Text>
  <Text style={styles.infoText}>
    <Text style={styles.label}>Tenant’s Occupation: </Text>
    <Text style={styles.value}>HCL Technologies</Text>
  </Text>
</View>


        <Text style={styles.termsTitle}>Terms & Conditions:</Text>
        <Text style={styles.termsText}>
          1. Tenant must pay the monthly rent of ₹8,000 on or before the 5th of every month.{"\n"}
          2. The advance amount of ₹20,000 is refundable at checkout after deductions (if any).{"\n"}
          3. The room allotted is Ground Floor, Room 103 (3-Bed Sharing).{"\n"}
          4. Tenant is responsible for cleanliness and avoiding damage to hostel property.{"\n"}
          5. Any violation of hostel rules may lead to disciplinary action.
        </Text>

       
      </View>
       <View style={styles.fullBorder} />
       <Text style={styles.reviewText}>
          Review your agreement and Proceed for it through e-sign.
        </Text>

        <View style={styles.checkboxRow}>
          <Checkbox
            status={checked ? "checked" : "unchecked"}
            onPress={() => setChecked(!checked)}
             color="#1E88E5"
          />
          <Text style={styles.checkboxLabel}>I Agree All The Terms & Conditions</Text>
        </View>

        <TouchableOpacity
          style={[styles.signButton, !checked && styles.disabledButton]}
          disabled={!checked}
          onPress={() => navigation.navigate("SignatureScreen")}
        >
          <Text style={styles.signButtonText}>Add Sign</Text>
        </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 60, 
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
    color: "#000",
  },
  headerContainer: {
    flexDirection: "row", 
    alignItems: "center",
    marginTop: 10,
    marginLeft: 15,
  },
  backIcon: {
    width: 18,
    height: 18,
    marginRight: 6,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },

  card: {
    backgroundColor: "#F5F7FF",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#F5F7FF",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginTop:20,
   borderBottomWidth: 1,
  borderBottomColor: "#D9D9D9",
  },
 sectionHeader: {
  flexDirection: "row",
  alignItems: "center",
  marginTop:20
},
fullBorder: {
  height: 1,
  backgroundColor: "#D9D9D9",
  marginHorizontal: -15, 
 
}
,

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

  infoBox: {
   
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
 infoText: {
  fontSize: 14,
  marginVertical: 3,
  color: "#070101ff", 
},

label: {
  fontWeight: "400",
  color: "#00000", 
},

value: {
  color: "#000",
  fontWeight:600
},

  termsTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
  },
  termsText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 12,
  },
  reviewText: {
    fontSize: 14,
    color: "#222222",
    marginTop: 8,
    fontFamily:"Gilroy-Regular",
    fontWeight:400
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
  marginTop:20
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#000",
  },
  signButton: {
    backgroundColor: "#2563EB",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop:20
  },
  disabledButton: {
    backgroundColor: "#C7D2FE",
  },
  signButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});

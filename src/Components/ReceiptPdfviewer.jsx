import React from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import HostelImage from "../assets/Images/Group 1.png";
import PaymentReceivedIcon from "../assets/Images/paymentreceived.png";
import SigantureIcon from "../assets/Images/signature.png";
// import Pdf from "react-native-pdf";

const ReceiptPdfViewer = ({ route }) => {
  const { pdfDetails } = route.params || {};

  return (
    <ScrollView style={styles.container}>
      <View style={styles.receiptCard}>
        {/* HEADER */}
        <View style={styles.header}>
          <Image
            source={HostelImage}
            style={styles.logo}
          />
          
          <View style={{ }}>
               <Text style={styles.hostelName}>Annai Hostel</Text>
            <Text style={styles.address}>7/96 , main road , Athisayapuram , Tenkasi , Tamilnadu-627861</Text>
          </View>
        </View>

        {/* RECEIPT TITLE */}
        <View style={{ alignItems: "center", marginVertical: 10 , marginTop:20, marginBottom:15}}>
          <Text style={styles.title}>
            {/* {pdfDetails?.configurations?.receiptType === "Rent"
              ? "Payment Receipt"
              : pdfDetails?.configurations?.receiptType === "Booking"
              ? "Security Deposit Receipt"
              : pdfDetails?.configurations?.receiptType === "Advance"
              ? "Security Deposit Receipt"
              : "Final Settlement Receipt"} */}

              Payment Receipt
          </Text>
        </View>

        {/* TENANT DETAILS */}
        <View style={styles.row}>
  {/* LEFT SIDE - TENANT DETAILS */}
  <View style={styles.leftColumn}>
    <Text style={styles.sectionHeader}>Receipt to:</Text>

    <View style={styles.detailRow}>
      <Text style={styles.label}>Tenant Name :</Text>
      <Text style={styles.value}>Muthuraja M</Text>
    </View>

    <View style={styles.detailRow}>
      <Text style={styles.label}>Mobile No :</Text>
      <Text style={styles.value}>85647 86274</Text>
    </View>

    <View style={styles.detailRow}>
      <Text style={styles.label}>Room No :</Text>
      <Text style={styles.value}>G-Floor, 103-02</Text>
    </View>

    <View style={styles.detailRow}>
      <Text style={styles.label}>Address :</Text>
      <Text style={[styles.value, { flex: 1 }]}>
        9, 8th Main Rd, Someshwara Nagar, Bengaluru, Karnataka 560011
      </Text>
    </View>
  </View>

  {/* RIGHT SIDE - RECEIPT DETAILS */}
  <View style={styles.rightColumn}>
    <View style={styles.detailRow}>
      <Text style={styles.label}>Receipt No :</Text>
      <Text style={styles.value}>#RSIN001</Text>
    </View>

    <View style={styles.detailRow}>
      <Text style={styles.label}>Date :</Text>
      <Text style={styles.value}>29 Aug 2025</Text>
    </View>

    <View style={styles.detailRow}>
      <Text style={styles.label}>Time :</Text>
      <Text style={styles.value}>11:54:36 AM</Text>
    </View>

    <View style={styles.detailRow}>
      <Text style={styles.label}>Payment Mode :</Text>
      <Text style={[styles.value, { color: "#1E45E1" }]}>UPI / Net Banking</Text>
    </View>
  </View>
</View>


        {/* AMOUNT */}
        <View style={styles.amountBox}>
          <View style={{display:'flex', alignItems:"center", justifyContent:'center' , flex:1}}>
          <Text style={styles.amountTitle}>TOTAL PAID AMOUNT</Text>
          </View>
          <View style={{flex:1}}>
          <View style={styles.amountValueBox}>
            <View style={styles.amountBar} />
            <Text style={styles.amount}>₹ 6500</Text>
          </View>
          <Text style={styles.amountWords}>
            {convertNumberToWords(6500|| 0) } only
          </Text>
          </View>
        </View>

    <View style={styles.acknowledgementRow}>
  {/* Left: Acknowledgement Text */}
  <View style={{flex:1}}>
    <Text style={styles.ackTitle}>Acknowledgement</Text>
    <Text style={styles.ackDescription}>
      This payment confirms your dues till the mentioned period. Final settlement
      during checkout will be calculated based on services utilized and advance paid.
    </Text>
  </View>

  {/* Right: Signature */}
  <View style={{flex:1}}>
    <Image
         source={SigantureIcon}
      style={styles.signature}
      resizeMode="contain"
    />
    <Text style={styles.signText}>Authorized Signature</Text>
  </View>
</View>



     <View style={{display:'flex', flexDirection:'row', marginTop:15, marginBottom:10}}>
      <View style={{flex:1}}>
      <Text style={{fontSize:10}}>"Thank you for choosing roomsearch.in Your transaction is completed"</Text>
     </View>
     <View style={{flex:1 , paddingLeft:40 , }}>
        <Image
      source={PaymentReceivedIcon}
      style={styles.signature}
      resizeMode="contain"
    />
     </View>
     </View>


     <View>
       <Text style={styles.sectionTitle}>Payment for</Text>

      {/* Payment Table */}
      <View style={styles.table}>
        {/* Header Row */}
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.headerCell, { flex: 1 }]}>INVOICE.NO</Text>
          <Text style={[styles.cell, styles.headerCell, { flex: 1 }]}>INV. DATE</Text>
          <Text style={[styles.cell, styles.headerCell, { flex: 1.2 }]}>INVOICE AMOUNT</Text>
          <Text style={[styles.cell, styles.headerCell, { flex: 1.2 }]}>PAYMENT AMOUNT / INR</Text>
        </View>

        {/* Data Row */}
        <View style={styles.row}>
          <Text style={[styles.cell, { flex: 1, color: "#0A68FF", textDecorationLine: "underline" }]}>
            #INV001
          </Text>
          <Text style={[styles.cell, { flex: 1 }]}>29 Aug 2025</Text>
          <Text style={[styles.cell, { flex: 1.2 }]}>₹9,300.00</Text>
          <Text style={[styles.cell, { flex: 1.2 }]}>₹6,000.00</Text>
        </View>
      </View>

     </View>


        <View style={styles.footerContainer}>
      <Text style={styles.footerLeft}>
        email : <Text style={styles.highlight}>contact@roomsearch.in</Text>
      </Text>
      <Text style={styles.footerRight}>
        Contact : <Text style={styles.highlight}>+91 88994 56611</Text>
      </Text>
    </View>
        
      </View>
    </ScrollView>
  );
};

function convertNumberToWords(num) {
  const a = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  if ((num = num.toString()).length > 9) return "Overflow";
  const n = ("000000000" + num)
    .substr(-9)
    .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return;
  let str = "";
  str += n[1] != 0 ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + "Crore " : "";
  str += n[2] != 0 ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + "Lakh " : "";
  str += n[3] != 0 ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + "Thousand " : "";
  str += n[4] != 0 ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + "Hundred " : "";
  str += n[5] != 0
    ? (str != "" ? "and " : "") +
      (a[Number(n[5])] || b[n[5][0]] + " " + a[n[5][1]]) +
      "Only"
    : "";
  return str.trim();
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F8FC" , paddingTop:40},
  receiptCard: {
    margin: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 10,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: { height: 40, width: 40, borderRadius: 6, marginRight: 10 },
  hostelName: { fontSize: 14, fontWeight: "bold", color: "#2B2B2B" },
  address: { fontSize: 12, color: "#4B4B4B", flexWrap: "wrap", width: 150 },
  receiptLabel: { fontSize: 10, color: "#4B4B4B", fontWeight: "600" },
  receiptDate: { fontSize: 12, fontWeight: "700", color: "#16255D" },
  title: { fontSize: 16, fontWeight: "bold", color: "#171717" },
  // row: { flexDirection: "row", marginTop: 10, justifyContent: "space-between" },
  // sectionHeader: { color: "#1E45E1", fontStyle: "italic", fontSize: 12, marginBottom: 4 },
  // label: { fontSize: 11, color: "#4B4B4B" },
  // value: { fontSize: 12, fontWeight: "600", color: "#171717", marginBottom: 4 },
  row: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 15,
},

leftColumn: {
  flex: 1,
  paddingRight: 10,
},

rightColumn: {
  flex: 1,
  paddingLeft: 10,
  paddingTop:20
},

sectionHeader: {
  color: "#1E45E1",
  fontStyle: "italic",
  fontSize: 12,
  marginBottom: 8,
},

detailRow: {
  flexDirection: "row",
  alignItems: "flex-start",
  marginBottom: 6,
  flexWrap: "wrap",
},

label: {
  fontSize: 11,
  color: "#4B4B4B",
  width: 70, 
},

value: {
  fontSize: 12,
  fontWeight: "600",
  color: "#171717",
  flexShrink: 1,
},

  amountBox: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    borderRadius: 10,
    // padding: 10,
    display:'flex',
    flexDirection:'row'
  },
  amountTitle: { fontSize: 12, fontWeight: "bold", color: "#000", marginRight:20},
  amountValueBox: {
    flexDirection: "row",
    alignItems: "center",
    width:"100%",
    backgroundColor: "#F1FFF5",
    // marginTop: 6,
    padding: 8,
    borderRadius: 8,
  },
  amountBar: { height: 24, width: 3, backgroundColor: "#00A651", marginRight: 8 },
  amount: { fontSize: 18, fontWeight: "700", color: "#000" },
  amountWords: { fontSize: 12, color: "#4B4B4B", marginTop: 6, marginBottom:6 , marginLeft:4 },
acknowledgementRow: {
  display:'flex',
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop:15
},

ackTextContainer: {
  flex: 1,
  paddingRight: 10,
},

ackTitle: {
  fontWeight: "700",
  fontSize: 14,
  color: "#000",
  marginBottom: 4,
},

ackDescription: {
  fontSize: 10,
  color: "#333",

},

signatureContainer: {
  flex:1,
  // width: 120,
  // justifyContent: "flex-end",
},

signature: {
  height: 60,
  width: 100,
  marginBottom: 4,
  marginLeft:20,
  transform:'rotate(-5deg)'
},

signText: {
  fontSize: 11,
  color: "#000",
  textAlign: "center",
},

  sectionTitle: {
    fontSize: 13,
    color: "#000",
    fontWeight: "500",
    marginBottom: 8,
  },
  table: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  headerRow: {
    backgroundColor: "#f9f9f9",
  },
  cell: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 10,
    color: "#000",
  },
  headerCell: {
    fontWeight: "600",
    color: "#333",
    fontSize: 9,
  },
   footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderColor: "#ccc",
    marginTop: 20,
    paddingVertical: 6,
    paddingHorizontal: 5,
  },
  footerLeft: {
    fontSize: 11,
    color: "#555",
  },
  footerRight: {
    fontSize: 11,
    color: "#555",
  },
  highlight: {
    fontWeight: "600",
    color: "#000",
  },


});

export default ReceiptPdfViewer;

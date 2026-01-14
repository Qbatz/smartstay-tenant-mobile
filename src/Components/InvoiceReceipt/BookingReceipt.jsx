import React, { useEffect, useContext, useState, useCallback } from "react";
import { View, Text, Image, ScrollView, StyleSheet, BackHandler } from "react-native";
import HostelImage from "../../assets/Images/Group 1.png";
import PaymentReceivedIcon from "../../assets/Images/paymentreceived.png";
import { getPaymentReceiptDetails } from "../../Action/PaymentAction";
import { UsersContext } from "../../Context/UserContext";
import { LoginContexts } from "../../Context/LoginContext";
import { paymentContexts } from "../../Context/PaymentContext";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
// import Pdf from "react-native-pdf";

const BookingReceipt = ({ route }) => {
  console.log(route)

  const navigation = useNavigation();
  const paymentContext = useContext(paymentContexts)
  const userContext = useContext(UsersContext)
  const loginContext = useContext(LoginContexts)
  const { pdfDetails } = route.params || {};
  const [selectedReceiptDetail, setSelectedReceiptDetails] = useState()

  const receiptname = "PaymentReceipt"

  useEffect(() => {
    getPaymentReceiptDetails(userContext.getHostelDetail.hostelId, loginContext.getToken, route.params.transcationId).then(r => {
      console.log(r)
      setSelectedReceiptDetails(r.data)
    })
  }, [])

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.goBack();
        return true;
      };

      const subsription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subsription.remove();
    }, [navigation])
  )

  return (
    <ScrollView style={styles.container}>
      <View style={styles.receiptCard}>
        <View style={styles.header}>
          <View style={{flex:1,justifyContent:'flex-start'}}>
          {selectedReceiptDetail?.configurations?.hostelLogo ? (
            <Image
              source={{ uri: selectedReceiptDetail?.configurations?.hostelLogo }}
              style={styles.hostelImage} />
          ) : (
            <View style={[styles.hostelImage, styles.initialContainer]}>
              <Text style={styles.initialText}>
                {selectedReceiptDetail?.stayInfo?.initials}
              </Text>
            </View>
          )}
          </View>

          <View style={{justifyContent:'flex-end',flex:1}}>
            <Text style={styles.hostelName}>{selectedReceiptDetail?.stayInfo?.hostelName}</Text>
            <Text style={styles.address}>{selectedReceiptDetail?.configurations?.address}</Text>
          </View>
        </View>

        <View style={{ alignItems: "center", marginVertical: 10, marginTop: 20, marginBottom: 15 }}>
          <Text style={[styles.title, { color: selectedReceiptDetail?.configurations?.templateColor }]}>
            {/* {pdfDetails?.configurations?.receiptType === "Rent"
              ? "Payment Receipt"
              : pdfDetails?.configurations?.receiptType === "Booking"
              ? "Security Deposit Receipt"
              : pdfDetails?.configurations?.receiptType === "Advance"
              ? "Security Deposit Receipt"
              : "Final Settlement Receipt"} */}

            {receiptname === "SecurityDeposit" ? "Security Deposit Receipt" : "Booking Payment Receipt"}
          </Text>
        </View>

        <View>
          <Text style={[styles.sectionTitle, { color: selectedReceiptDetail?.configurations?.templateColor }]}>Bill to:</Text>
        </View>

        <View style={{ flexDirection: 'row', padding: 5 }}>
                <View style={{ flex: 1 }}>
                  {/* <Text style={[styles.sectionTitle, { color: selectedReceiptDetail?.configurations?.templateColor }]}>Bill to:</Text> */}
        
                  <View style={styles.row}>
                    <Text style={styles.label}>Name</Text>
                    <Text style={styles.colon}>:</Text>
                    <View style={styles.valueContainer}>
                      <Text style={styles.value}>
                        {selectedReceiptDetail?.customerInfo?.fullName}
                      </Text>
                    </View>
                  </View>
        
                  <View style={styles.row}>
                    <Text style={styles.label}>Phone</Text>
                    <Text style={styles.colon}>:</Text>
                    <View style={styles.valueContainer}>
                      <Text style={styles.value}>
                        +{selectedReceiptDetail?.customerInfo?.countryCode}{" "}
                        {selectedReceiptDetail?.customerInfo?.customerMobileNo}
                      </Text>
                    </View>
                  </View>
        
                </View>
        
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <View style={styles.invStyle}>
        
                    <Text style={styles.invSty}>
                      Invoice : {' '}
                      <Text style={styles.bold}>{selectedReceiptDetail?.invoiceNumber}</Text>
                    </Text>
        
                    <Text style={styles.invSty}>
                      Date : {' '}
                      <Text style={styles.bold}>{selectedReceiptDetail?.receiptInfo?.transactionDate}</Text>
                    </Text>

                    <Text style={styles.invSty}>
                      Time : {' '}
                      <Text style={styles.bold}>{selectedReceiptDetail?.receiptInfo?.transactionTime}</Text>
                    </Text>

                    <Text style={styles.invSty}>
                      Payment mode : {' '}
                      <Text style={[styles.value, { color: "#1E45E1" }]}>{selectedReceiptDetail?.receiptInfo?.paymentMode}</Text>
                    </Text>

                    <Text style={styles.invSty}>
                      Transaction Id : {' '}
                      <Text style={styles.bold}>
                        {selectedReceiptDetail?.receiptInfo?.transactionId  ? 
                        selectedReceiptDetail?.receiptInfo?.transactionId : "N/A"}</Text>
                    </Text>
        
                  
                  </View>
                </View>
        
              </View>

        {/* <View style={styles.row}>
          <View style={styles.leftColumn}>
            <Text style={[styles.sectionHeader, { color: selectedReceiptDetail?.configurations?.templateColor }]}>Receipt to:</Text>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Tenant Name :</Text>
              <Text style={styles.value}>{selectedReceiptDetail?.customerInfo?.fullName}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Mobile No :</Text>
              <Text style={styles.value}>{selectedReceiptDetail?.customerInfo?.customerMobileNo}</Text>
            </View>
          </View>

          <View style={styles.rightColumn}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Receipt No :</Text>
              <Text style={styles.value}>{selectedReceiptDetail?.receiptInfo?.receiptNumber}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Date :</Text>
              <Text style={styles.value}>{selectedReceiptDetail?.receiptInfo?.transactionDate}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Time :</Text>
              <Text style={styles.value}>{selectedReceiptDetail?.receiptInfo?.transactionTime}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Payment Mode :</Text>
              <Text style={[styles.value, { color: "#1E45E1" }]}>{selectedReceiptDetail?.receiptInfo?.paymentMode}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Transaction Id :</Text>
              <Text style={styles.value}>{route?.params?.transcationId}</Text>
            </View>
          </View>
        </View> */}


        <View style={styles.amountBox}>
          <View style={{ display: 'flex', alignItems: "center", justifyContent: 'center', flex: 1 }}>
            <Text style={styles.amountTitle}>TOTAL PAID AMOUNT</Text>
            {receiptname === "SecurityDeposit" && (
              <Text style={{ fontSize: 12, color: "#4B4B4B", marginBottom: 6, }}>Security Deposit (Advance)</Text>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.amountValueBox}>
              <View style={styles.amountBar} />
              <Text style={styles.amount}>
                ₹ {new Intl.NumberFormat('en-IN').format(selectedReceiptDetail?.receiptInfo?.paidAmount)}</Text>
            </View>
            <Text style={styles.amountWords}>
              {convertNumberToWords(selectedReceiptDetail?.receiptInfo?.paidAmount || 0)} only
            </Text>
          </View>
        </View>

        <View style={styles.acknowledgementRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.ackTitle}>Acknowledgement</Text>
            <Text style={styles.ackDescription}>
              Booking amount will tally with your future Advance/Rental amount.
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Image
              source={{ uri: selectedReceiptDetail?.configurations?.signatureUrl }}
              style={styles.signature}
              resizeMode="contain"
            />
            <Text style={styles.signText}>Authorized Signature</Text>
          </View>
        </View>



        <View style={{ display: 'flex', flexDirection: 'row', marginTop: 15, marginBottom: 10 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 10 }}>"Thank you for choosing roomsearch.in Your transaction is completed"</Text>
          </View>
          <View style={{ flex: 1, paddingLeft: 40, }}>
            <Image
              source={PaymentReceivedIcon}
              style={[styles.signature, { tintColor: selectedReceiptDetail?.configurations?.templateColor }]}
              resizeMode="contain"
            />
          </View>
        </View>


        <View>
          <Text style={styles.sectionTitle}>Payment for</Text>

          {receiptname === "SecurityDeposit" ? (
            <View style={styles.securityTable}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCell, { flex: 0.5 }]}>S.NO</Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>DESCRIPTION</Text>
                <Text style={[styles.tableCell, { flex: 1, textAlign: "right" }]}>
                  AMOUNT / INR
                </Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 0.5 }]}>1</Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>
                  Security Deposit (Advance) - Deductions
                </Text>
                <Text style={[styles.tableCell, { flex: 1, textAlign: "right" }]}>
                  Rs: 12,530.00
                </Text>
              </View>

              <View style={[styles.tableRow, styles.totalRow]}>
                <Text style={[styles.tableCell, { flex: 2.5, fontWeight: "600" }]}>
                  Total
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    { flex: 1, textAlign: "right", fontWeight: "600" },
                  ]}
                >
                  ₹ 12,530.00
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.table}>
              <View style={[styles.row, styles.headerRow]}>
                <Text style={[styles.cell, styles.headerCell, { flex: 1 }]}>
                  INVOICE.NO
                </Text>
                <Text style={[styles.cell, styles.headerCell, { flex: 1 }]}>
                  INV. DATE
                </Text>
                <Text style={[styles.cell, styles.headerCell, { flex: 1.2 }]}>
                  INVOICE AMOUNT
                </Text>
                <Text style={[styles.cell, styles.headerCell, { flex: 1.2 }]}>
                  PAYMENT AMOUNT / INR
                </Text>
              </View>

              <View style={styles.row}>
                <Text
                  style={[
                    styles.cell,
                    { flex: 1, color: selectedReceiptDetail?.configurations?.templateColor, textDecorationLine: "underline" },
                  ]}
                >
                  {selectedReceiptDetail?.invoiceNumber}
                </Text>
                <Text style={[styles.cell, { flex: 1 }]}>{selectedReceiptDetail?.invoiceDate}</Text>
                <Text style={[styles.cell, { flex: 1.2 }]}>
                  ₹{new Intl.NumberFormat('en-IN').format(selectedReceiptDetail?.invoiceAmount)}
                </Text>
                <Text style={[styles.cell, { flex: 1.2 }]}>
                  ₹{new Intl.NumberFormat('en-IN').format(selectedReceiptDetail?.receiptInfo?.paidAmount)}</Text>
              </View>
            </View>
          )}
        </View>



        <View style={styles.footerContainer}>
          <Text style={styles.footerLeft}>
            email : <Text style={styles.highlight}>{selectedReceiptDetail?.emailId ? selectedReceiptDetail?.emailId : "N/A "}</Text>
          </Text>
          <Text style={styles.footerRight}>
            Contact : <Text style={styles.highlight}>+91 {selectedReceiptDetail?.mobile ? selectedReceiptDetail?.mobile : "N/A "}</Text>
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
  container: { flex: 1, backgroundColor: "#F7F8FC", paddingTop: 40 },
  receiptCard: {
    margin: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 10,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
  },
  logo: { height: 40, width: 40, borderRadius: 6, marginRight: 10 },
  hostelName: { fontSize: 14, fontWeight: "bold", color: "#2B2B2B",flexWrap:'wrap'},
  address: { fontSize: 12, color: "#4B4B4B", flexWrap: "wrap" },
  receiptLabel: { fontSize: 10, color: "#4B4B4B", fontWeight: "600" },
  receiptDate: { fontSize: 12, fontWeight: "700", color: "#16255D" },
  title: { fontSize: 16, fontWeight: "bold", color: "#171717" },
  row: {
     flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
    justifyContent: 'center'
  },

  leftColumn: {
    flex: 1,
    paddingRight: 10,
  },

  rightColumn: {
    flex: 1,
    paddingLeft: 10,
    paddingTop: 20
  },

  sectionHeader: {
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
    fontSize: 12,
    color: "#4B4B4B",
  },
   colon: {
    marginHorizontal: 5,
    fontSize: 12,
    fontWeight: 600
  },
  valueContainer: {
    flex: 1,

  },

  value: {
    flex: 1,
    fontSize: 11,
    flexShrink: 1,
    fontWeight: 600
  },
   invStyle: {
    alignItems: "flex-end", 
    marginLeft: 20, 
  },
  invSty: {
    fontSize: 11,
    marginBottom: 2,
    
  },
  bold: {
    fontWeight: "600",
    fontSize: 11
  },

  amountBox: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row'
  },
  amountTitle: { fontSize: 12, fontWeight: "bold", color: "#000", marginRight: 20 },
  amountValueBox: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#F1FFF5",
    padding: 8,
    borderRadius: 8,
  },
  amountBar: { height: 24, width: 3, backgroundColor: "#00A651", marginRight: 8 },
  amount: { fontSize: 18, fontWeight: "700", color: "#000" },
  amountWords: { fontSize: 12, color: "#4B4B4B", marginTop: 6, marginBottom: 6, marginLeft: 4 },
  acknowledgementRow: {
    display: 'flex',
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 15
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
    flex: 1,
  },

  signature: {
    height: 60,
    width: 100,
    marginBottom: 4,
    marginLeft: 20,
    transform: 'rotate(-5deg)'
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
    marginBottom: 2,
  },
  table: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    overflow: "hidden",
  },
  // row: {
  //   flexDirection: "row",
  //   borderBottomWidth: 1,
  //   borderColor: "#ddd",
  // },
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

  securityTable: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 6,
  },

  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },

  tableHeader: {
    backgroundColor: "#f9f9f9",
  },

  tableCell: {
    fontSize: 11,
    color: "#000",
  },

  totalRow: {
    backgroundColor: "#f9f9f9",
    borderTopWidth: 1,
    borderColor: "#ddd",
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
    flex:1
  },
  footerRight: {
    fontSize: 11,
    color: "#555",
  },
  highlight: {
    fontWeight: "600",
    color: "#000",
  },
  hostelImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  initialContainer: {
    backgroundColor: '#eef1ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialText: {
    color: '#788fed',
    fontSize: 20,
    fontWeight: 'bold',
  },


});

export default BookingReceipt;

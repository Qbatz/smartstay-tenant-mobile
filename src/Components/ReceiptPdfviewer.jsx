import React, { useEffect, useContext, useState, useCallback } from "react";
import { View, Text, Image, ScrollView, StyleSheet, BackHandler, TouchableOpacity, NativeModules } from "react-native";
import HostelImage from "../assets/Images/Group 1.png";
import PaymentReceivedIcon from "../assets/Images/paymentreceived.png";
import SigantureIcon from "../assets/Images/signature.png";
import { getPaymentReceiptDetails, getReceiptDownload } from "../Action/PaymentAction";
import { UsersContext } from "../Context/UserContext";
import { LoginContexts } from "../Context/LoginContext";
import { paymentContexts } from "../Context/PaymentContext";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import LeftArrow from "../assets/Images/LeftArrow.png"
import ShareIcon from "../assets/Images/Union.png"
import DownloadIcon from "../assets/Images/download.png"
import PaidIcon from "../assets/Images/Checkboxes.png"

// import Pdf from "react-native-pdf";

const ReceiptPdfViewer = ({ route }) => {
  console.log(route)

  const navigation = useNavigation();
  const paymentContext = useContext(paymentContexts)
  const userContext = useContext(UsersContext)
  const loginContext = useContext(LoginContexts)
  const { pdfDetails } = route.params || {};
  const [selectedReceiptDetail, setSelectedReceiptDetails] = useState();
  const {CommonModule}= NativeModules;

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
  const addressLine = selectedReceiptDetail?.customerInfo?.fullAddress?.split(',');
  const handleBack = () => navigation.goBack();

  const handleDownloadReceipt=()=>{
    console.log('dlslsl')

    getReceiptDownload(userContext.getHostelDetail.hostelId, selectedReceiptDetail?.receiptInfo?.receiptId, loginContext.getToken).then(r=>{
      console.log(r)
      CommonModule.downloadPDF(r.data)
    })
  };

  const handleShareReceipt=()=>{
    getReceiptDownload(userContext.getHostelDetail.hostelId, selectedReceiptDetail?.receiptInfo?.receiptId, loginContext.getToken).then(r=>{
      console.log(r)
      CommonModule.sharePDF(r.data, "Sharing the receipt")
    })

  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <ScrollView style={styles.container} >
        <View style={{ padding: 20 }}>

          <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={handleBack}>
                <Image
                  source={LeftArrow}
                  style={{ height: 25, width: 25 }}
                />
              </TouchableOpacity>

              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>

                <Text
                  numberOfLines={1}
                  style={{ fontSize: 18, fontWeight: 600, marginLeft: 5,flex:1  }}>
                  {selectedReceiptDetail?.receiptInfo?.receiptNumber}
                </Text>

                <View style={{
                  flexDirection: "row", borderRadius: 8, padding:5, marginLeft: 6, alignSelf: 'flex-start',
                  backgroundColor: paymentContext.getInvoiceDetail.status === "Paid" ? "#A5FF9624" : "#FFF7E7",
                  justifyContent:'center',alignItems:'center'
                }}>
                  {/* <Image
                    source={PaidIcon}
                    style={{ width: 20, height: 20 }}
                  /> */}
                  <Text
                    numberOfLines={2}
                    style={{
                      fontSize: 11, flexWrap: 'wrap',textAlign:'center',
                      color: paymentContext.getInvoiceDetail.status === "Paid" ? "#09882C" : "#EC9B29"
                    }}>
                    {paymentContext.getInvoiceDetail.status === "Paid"
                    ? "Full Paid"
                    : "Partial Payment"}
                  </Text>
                </View>
              </View>

            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
              <TouchableOpacity
                style={{ marginRight: 8 }}
              onPress={
                handleDownloadReceipt}
              >
                <Image
                  source={DownloadIcon}
                  style={{ width: 22, height: 22, marginLeft: 8, tintColor: 'black' }}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleShareReceipt}>
                <Image
                  source={ShareIcon}
                  style={{ width: 18, height: 18, marginLeft: 8 }}
                />
              </TouchableOpacity>
            </View>

          </View>

          <View style={{ flexDirection: 'row', paddingTop: 50, justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 20, fontWeight: 600 }}>Amount Paid</Text>

            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 18, fontWeight: 600 }}>
                ₹ {new Intl.NumberFormat('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(
                  selectedReceiptDetail?.receiptInfo?.paidAmount
                )}
              </Text>

              <View style={{ flexDirection: "row", marginTop: 6 }}>
                <Image
                  source={PaidIcon}
                  style={{ width: 20, height: 20 }}
                />
                <Text style={{ fontSize: 14, marginLeft: 6 }}>
                  {paymentContext.getInvoiceDetail.status === "Paid"
                    ? "Full Paid"
                    : "Partial Payment"}
                </Text>
              </View>

            </View>
          </View>

          <View style={{
            borderBottomWidth: 0.4,
            borderBottomColor: "grey",
            opacity: 0.4,
            marginTop: 30, marginBottom: 10
          }} />

          <View style={{ paddingTop: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, fontWeight: 400, color: '#3C3C4399' }}>Paid Date</Text>
              <Text style={{ fontSize: 14, fontWeight: 600 }}>
                {selectedReceiptDetail?.receiptInfo?.transactionDate}</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: 400, color: '#3C3C4399' }}>Time</Text>
              <Text style={{ fontSize: 14, fontWeight: 600 }}>
                {selectedReceiptDetail?.receiptInfo?.transactionTime}</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: 400, color: '#3C3C4399' }}>Payment Mode</Text>
              <Text style={{ fontSize: 14, fontWeight: 600 }}>
                {selectedReceiptDetail?.receiptInfo?.paymentMode}</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: 400, color: '#3C3C4399' }}>Reference number</Text>
              <Text style={{ fontSize: 14, fontWeight: 600 }}>
                {selectedReceiptDetail?.receiptInfo?.receiptNumber}</Text>
            </View>

          </View>

          <View style={{
            borderBottomWidth: 0.4,
            borderBottomColor: "grey",
            opacity: 0.4,
            marginTop: 20, marginBottom: 15
          }} />

          <View>

            <Text style={{ fontSize: 16, fontWeight: 600 }}>Payment for</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 15 }}>
              <Text style={{ fontSize: 14, fontWeight: 400 }}>Invoice.no</Text>
              <Text style={{ fontSize: 14, fontWeight: 600 }}>
                {selectedReceiptDetail?.invoiceNumber}</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 9 }}>
              <Text style={{ fontSize: 14, fontWeight: 400 }}>Invoice Date</Text>
              <Text style={{ fontSize: 14, fontWeight: 600 }}>
                {selectedReceiptDetail?.invoiceDate}</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 9 }}>
              <Text style={{ fontSize: 14, fontWeight: 400, }}>Invoice amount</Text>
              <Text style={{ fontSize: 14, fontWeight: 600 }}>
                ₹ {new Intl.NumberFormat('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(
                  selectedReceiptDetail?.invoiceAmount
                )}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 9 }}>
              <Text style={{ fontSize: 14, fontWeight: 400 }}>Payment Amount</Text>
              <Text style={{ fontSize: 14, fontWeight: 600 }}>
                ₹ {new Intl.NumberFormat('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(
                  selectedReceiptDetail?.receiptInfo?.paidAmount
                )}</Text>
            </View>

          </View>

          {paymentContext.getInvoiceDetail.status === "Partial Payment" && (
            <View style={{ paddingTop: 30 }}>
              <Text style={{ fontSize: 14, fontWeight: 400, color: '#3C3C4399' }}>
                Notes & Instructions
              </Text>

              <Text style={{ fontSize: 14, fontWeight: 400, marginTop: 15 }}>
                This payment confirms the partial payment of the mentioned invoice, pay the remaining amount within the
                Due date.
              </Text>
            </View>

          )}




        </View>

      </ScrollView>
    </SafeAreaView>
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
  container: { flex: 1, backgroundColor: "#F7F8FC", paddingTop: 10 },
  receiptCard: {
    margin: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 10,
    elevation: 3,
    flex: 1
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
    marginTop: 2
  },
  info: {
    color: "#333",
    fontSize: 10,
    marginBottom: 2,
    fontWeight: 600
  },

  value: {
    flex: 1,
    fontSize: 11,
    flexShrink: 1,
    fontWeight: 600
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
    flex: 1,
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
  invStyle: {
    alignItems: "flex-end",
    marginLeft: 20,
    minWidth: 150,
    flex: 1,
  },
  invSty: {
    fontSize: 12,
    marginBottom: 2,
  },
  bold: {
    fontWeight: "600",
    fontSize: 10
  },


});

export default ReceiptPdfViewer;

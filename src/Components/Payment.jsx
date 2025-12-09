import React, { useState,useRef,useEffect, useContext} from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  TouchableWithoutFeedback,  Linking, Alert, Animated,
    PanResponder,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import SideArrow from "../assets/Images/arrow-up.png";
import HostelImage from "../assets/Images/Group 1.png";
import ElectrictyIcon from "../assets/Images/electricity.png";
import DownloadIcon from "../assets/Images/download.png";
import DownloadBlueIcon from "../assets/Images/download_Blue.png";
import ShareIcon from "../assets/Images/Union.png";
import PaidIcon from "../assets/Images/Checkboxes.png";
import PaYBillIcon from "../assets/Images/direction-right.png";
import ViewIcon from "../assets/Images/view.png";
import FilterIcon from "../assets/Images/Filter_Icon.png"
import ArrowRightIcon from "../assets/Images/arrow-right.png";
import { getPaymentList } from "../Action/HostelAction";
import { UsersContext } from "../Context/UserContext";
import { LoginContexts } from "../Context/LoginContext";
import { paymentContexts } from "../Context/PaymentContext";



const Payment = (props) => {
  console.log(props)

     const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const context=useContext(UsersContext)
  const loginContext=useContext(LoginContexts)
  const paymentContext=useContext(paymentContexts)


  useEffect(()=>{
      getPaymentList(context.getHostelDetail.hostelId,loginContext.getToken).then(r=>{
        console.log(r)
        paymentContext.updateInvoiceList(r.data)
      })
  },[])

  console.log(paymentContext.getInvoiceList)



  const staticReceiptData = {
  configurations: {
    hostelLogo: "https://example.com/logo.png",
    receiptType: "Rent",
    address: "123, Main Road, Chennai",
    signatureUrl: "https://example.com/signature.png",
  },
  stayInfo: {
    hostelName: "Smart Stay Hostel",
    floorName: "2nd Floor",
    roomName: "Room 202",
    bedName: "B2",
  },
  customerInfo: {
    fullName: "Pon Allwin",
    customerMobileNo: "9876543210",
    countryCode: "91",
    fullAddress: "No. 45, Anna Nagar, Chennai",
  },
  receiptInfo: {
    paidAmount: 5500,
    receiptNumber: "RCP-1023",
    transactionDate: "03/11/2025",
    transactionTime: "10:45 AM",
  },
  accountDetails: { bankName: "Cash" },
};


  const handleOpenModal = (item) => {
    console.log("item", item);
    
    setSelectedPayment(item);
    setModalVisible(true);
  };

   console.log("item", modalVisible);

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedPayment(null);
  };





const handleDownload = async () => {
  try {
    const response = await fetch("https://smartstaytestingapi.s3remotica.com/invoice/invoice-list-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTkzLCJzdWIiOjE5MywidXNlcl90eXBlIjoiYWRtaW4iLCJyb2xlX2lkIjowLCJwbGFuX2NvZGUiOiJvbmVfZGF5IiwicGxhbl9zdGF0dXMiOjEsImlhdCI6MTc2MjQxMDIzOSwiZXhwIjoxNzYyNDEyMDM5fQ.BNCXjNx4B9AH0UV9Yy_dXnnBLzjfDUY7qOJOzuxlS2E`,
      },
      body: JSON.stringify({
        Date: "2025-11-01",
        User_Id: "NOTI1629",
        id: 2148,
      }),
    });

    const data = await response.json();

    const pdfUrl = data?.pdf_url;

    if (pdfUrl) {
      const supported = await Linking.canOpenURL(pdfUrl);
      if (supported) {
        await Linking.openURL(pdfUrl);
      } else {
        Alert.alert("Error", "Cannot open this PDF link");
      }
    } else {
      Alert.alert("No PDF found in response");
    }
  } catch (error) {
    console.error("PDF open error:", error);
    Alert.alert("Error", "Failed to open PDF");
  }
};

const handleReceiptPdfDownload =  () => { 
  setModalVisible(false);
   navigation.navigate("ReceiptPdfView");
};




  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {paymentContext.getInvoiceList?.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => props.onPayment(item)} style={styles.card}>
            <View style={{flexDirection: "row",}}>
              <View style={styles.iconContainer}>
                {item?.title === "July EB Bill" ? (
                  <Image
                    source={ElectrictyIcon}
                    style={styles.icon}
                    resizeMode="contain"
                  />
                ) : (
                  <Image
                    source={SideArrow}
                    style={styles.icon}
                    resizeMode="contain"
                  />
                )}
              </View>

              <View style={styles.infoContainer}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{item.invoiceType}</Text>
                  <Text style={styles.date}>{item.invoiceGeneratedDate}</Text>
                </View>

                <View style={styles.amountContainer}>
                  <Text style={styles.amount}>₹{item.amount}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          item.statusColor === "#0057FF"
                            ? "#E3ECFF"
                            : "#E9F8EE",
                      },
                    ]}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={[styles.statusText, { color: item.statusColor }]}
                      >
                        {item.status}
                      </Text>
                      {item.status === "Pay Now" ?
                       (<Image  source={PaYBillIcon} resizeMode="contain" style={{ width: 20, height: 20 , marginLeft:8 }}/>)
                      : (<Image
                        source={HostelImage}
                        style={{ width: 14, height: 14, marginLeft: 6 }}
                        resizeMode="contain"
                      />)
                      }
                      

                    </View>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ---------- MODAL ---------- */}
     {modalVisible && (
  <View style={styles.sheetOverlay}>

    {/* Tap outside to close */}
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={StyleSheet.absoluteFill} />
    </TouchableWithoutFeedback>

    <Animated.View
      style={[styles.bottomSheet, { transform: [{ translateY: sheetY }] }]}
      {...panResponder.panHandlers}
    >
      <View style={styles.dragIndicator} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {selectedPayment && (
          <>
            <Text style={styles.modalTitle}>{selectedPayment.title}</Text>

            <View style={{ flexDirection: "row" }}>
              <Text style={styles.invoiceId}>#INV001</Text>
              <TouchableOpacity
                onPress={() => handleReceiptPdfDownload(staticReceiptData)}
              >
                <Image
                  source={ViewIcon}
                  style={{ width: 15, height: 15, marginLeft: 5, marginTop: 2 }}
                />
              </TouchableOpacity>
            </View>

            {/* Amount Section */}
            <View style={styles.amountSection}>
              <Text style={styles.label}>Total Amount</Text>

              <View>
                <Text style={styles.totalAmount}>
                  ₹{selectedPayment.amount.toFixed(2)}
                </Text>

                {selectedPayment.status === "Pay Now" && (
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: "rgba(254,243,198,1)" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: "rgba(187,77,0,1)" },
                      ]}
                    >
                      Pending
                    </Text>
                  </View>
                )}

                {(selectedPayment.status === "Partially Paid to" ||
                  selectedPayment.status === "Paid to") && (
                  <View style={{ flexDirection: "row", marginTop: 6 }}>
                    <Image
                      source={PaidIcon}
                      style={{ width: 20, height: 20 }}
                    />
                    <Text style={{ fontSize: 14, marginLeft: 6 }}>
                      {selectedPayment.status === "Partially Paid to"
                        ? "Partially Paid"
                        : "Full Paid"}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Details */}
            <View style={styles.detailsSection}>
              <View style={styles.row}>
                <Text style={styles.detailLabel}>Actual Rent</Text>
                <Text style={styles.detailValue}>₹5512.00</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.detailLabel}>Taxes GST 10%</Text>
                <Text style={styles.detailValue}>₹488.00</Text>
              </View>

              {selectedPayment.paid === "partial" && (
                <>
                  <View style={styles.row}>
                    <Text style={styles.detailLabel}>Paid Amount</Text>
                    <Text style={styles.detailValue}>₹3500.00</Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.detailLabel}>Remain</Text>
                    <View>
                      <Text style={styles.detailValue}>₹2500.00</Text>
                      <Text style={styles.payBillText}>Pay Bill</Text>
                    </View>
                  </View>
                </>
              )}
            </View>

            <View
              style={{
                borderBottomWidth: 0.4,
                borderBottomColor: "grey",
                opacity: 0.4,
                marginVertical: 10,
              }}
            />

            {/* Paid / Due Date */}
            <View style={styles.Billbottom}>
              <Text style={styles.paiddetailLabel}>
                {selectedPayment.status === "Pay Now" ? "Due Date" : "Paid Date"}
              </Text>
              <Text style={styles.paiddetailValue}>25 Sep 2025</Text>
            </View>

            {/* Notes */}
            {selectedPayment.status === "Pay Now" && (
              <View style={{ marginTop: 10 }}>
                <Text style={{ fontSize: 13, color: "rgba(60,60,67,0.6)" }}>
                  Notes & Instructions
                </Text>
                <Text style={styles.noteText}>
                  Kindly pay on or before the due date
                </Text>
                <Text style={styles.noteText}>
                  Late fee may apply after 3 days of due date
                </Text>
                <Text style={styles.noteText}>
                  For any billing errors, contact hostel admin
                </Text>
              </View>
            )}

            {/* Payment mode section */}
            {selectedPayment.status !== "Pay Now" && (
              <View style={{ marginTop: 10 }}>
                <View style={styles.Billbottom}>
                  <Text style={styles.paiddetailLabel}>Payment Mode</Text>
                  <Text style={styles.paiddetailValue}>UPI</Text>
                </View>

                <View style={styles.Billbottom}>
                  <Text style={styles.paiddetailLabel}>Reference number</Text>
                  <Text style={styles.paiddetailValue}>#RSIN001</Text>
                </View>
              </View>
            )}

            {/* Buttons */}
            <View style={styles.buttonRow}>
              {selectedPayment.status === "Pay Now" ? (
                <>
                  <TouchableOpacity
                    style={styles.shareBtn}
                    onPress={handleDownload}
                  >
                    <Text style={{ fontWeight: "600", color: "#071C70" }}>
                      Download Bill
                    </Text>
                    <Image
                      source={DownloadBlueIcon}
                      style={{ width: 17, height: 17, marginLeft: 8 }}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.downloadBtn}>
                    <Text style={styles.downloadText}>Pay Now</Text>
                    <Image
                      source={ArrowRightIcon}
                      style={{ width: 20, height: 20, marginLeft: 8 }}
                    />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity style={styles.shareBtn}>
                    <Text style={styles.shareText}>Share</Text>
                    <Image
                      source={ShareIcon}
                      style={{ width: 17, height: 17, marginLeft: 8 }}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.downloadBtn}
                    onPress={handleDownload}
                  >
                    <Text style={styles.downloadText}>Download</Text>
                    <Image
                      source={DownloadIcon}
                      style={{ width: 20, height: 20, marginLeft: 8 }}
                    />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </Animated.View>
  </View>
)}


      <TouchableOpacity style={styles.filterFab} >
 <Image 
 source={FilterIcon} 
 resizeMode="contain" 
 style={styles.filterIcon}
 />
 </TouchableOpacity>
    </>
  );
};

export default Payment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // paddingHorizontal: 16,
    paddingTop: 20,
  },
  card: {
    
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12  ,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  iconContainer: {
    backgroundColor: "#F3F5FF",
    borderRadius: 10,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: { width: 25, height: 25 },
  infoContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 12,
  },
  title: { fontSize: 14, fontWeight: "600", color: "#000" },
  date: { fontSize: 12, color: "#888", marginTop: 5 },
  amountContainer: { alignItems: "flex-end", justifyContent: "center" },
  amount: { fontSize: 14, fontWeight: "600", color: "#000" },
  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginTop: 6,
  },
  statusText: { fontSize: 12, fontWeight: "500" },

  // 🔽 Modal Styles
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  dragIndicator: {
    width: 50,
    height: 4,
    backgroundColor: "#ccc",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 10,
  },
  modalTitle: { fontSize: 20, fontWeight: "600", color: "#000" },
  invoiceId: {
    fontSize: 13,
    color: "#0057FF",
    fontWeight: "600",
    marginBottom: 6,
  },
  amountSection: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: { fontSize: 20, color: "rgba(31, 38, 51, 1)" , fontWeight: "600" },
  totalAmount: { fontSize: 16, fontWeight: "700", color: "#000" },
  detailsSection: { marginVertical: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 3,
  },
  detailLabel: { fontSize: 13, color: "rgba(31, 38, 51, 1)" },
  detailValue: { fontSize: 15, fontWeight: "600", color: "rgba(31, 38, 51, 1)" },
  payBillText: { fontSize: 13, color: "#0057FF", fontWeight: "600" , marginLeft:10 , marginTop:5},
  paiddetailLabel: { fontSize: 13, color: "rgba(60, 60, 67, 0.6)" },
  paiddetailValue: { fontSize: 13, color: "black" ,  fontWeight: "600" ,},
  Billbottom : {display:'flex', flexDirection:'row',   justifyContent: "space-between",},
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  shareBtn: {
    flex: 1,
    backgroundColor: "#F3F5FF",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
     display:'flex',
    flexDirection:'row',
    marginRight: 10,
    justifyContent:'center'
  },
  shareText: { color: "#000", fontWeight: "600" },
  downloadBtn: {
    flex: 1,
    backgroundColor: "#0057FF",
    paddingVertical: 10,
    borderRadius: 10,
    display:'flex',
    flexDirection:'row',
    alignItems: "center",
    justifyContent:'center'
  },
  downloadText: { color: "#fff", fontWeight: "600" },
  filterFab: {
 position: 'absolute', 
 bottom: 40,
 right: 10, 
 borderRadius: 30,
 width: 60,
 height: 60,
 justifyContent: 'center',
 alignItems: 'center',
 },
 filterIcon: {
   width: 60,
   height: 60,
 },
 sheetOverlay: {
  position: "absolute",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "flex-end",
},

bottomSheet: {
  backgroundColor: "#fff",
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  padding: 20,
  height: "75%",
},

});
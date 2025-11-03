import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import SideArrow from "../assets/Images/arrow-up.png";
import HostelImage from "../assets/Images/Group 1.png";
import ElectrictyIcon from "../assets/Images/electricity.png";
import DownloadIcon from "../assets/Images/download.png";
import ShareIcon from "../assets/Images/Union.png";
import PaidIcon from "../assets/Images/Checkboxes.png";
import PaYBillIcon from "../assets/Images/Checkboxes.png";

const Payment = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const payments = [
    {
      title: "Sep Month Rental",
      date: "02 Oct 2025",
      amount: 6000,
      status: "Pay Now",
      statusColor: "#0057FF",
      paid: false,
    },
    {
      title: "July Month Rental",
      date: "04 Aug 2025",
      amount: 6000,
      status: "Paid to",
      statusColor: "#00C853",
      paid: true,
    },
    {
      title: "July EB Bill",
      date: "04 Aug 2025",
      amount: 650,
      status: "Partially Paid to",
      statusColor: "#FFB300",
      paid: "partial",
    },
  ];

  const handleOpenModal = (item) => {
    setSelectedPayment(item);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedPayment(null);
  };

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {payments.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => handleOpenModal(item)}>
            <View style={styles.card}>
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
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.date}>{item.date}</Text>
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
                       (<Image  source={PaidIcon} resizeMode="contain" style={{ width: 20, height: 20 , marginLeft:8 }}/>)
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
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <TouchableWithoutFeedback onPress={handleCloseModal}>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <View style={styles.dragIndicator} />
                {selectedPayment && (
                  <>
                    <Text style={styles.invoiceId}>#INV001</Text>
                    <Text style={styles.modalTitle}>
                      {selectedPayment.title}
                    </Text>

                    <View style={styles.amountSection}>
                        <View>
                      <Text style={styles.label}>Total Amount</Text>
                      <Text style={styles.totalAmount}>
                        ₹{selectedPayment.amount.toFixed(2)}
                      </Text>
                      </View>

                      <View>
                      <Image  source={PaidIcon} resizeMode="contain" style={{ width: 20, height: 20 , marginLeft:8 }}/>
                      <Text style={styles.label}>{selectedPayment.paid === "partial" ? "Partially paid ": "Full Paid"} </Text>
                      </View>
                    </View>

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
                            <Text style={[styles.payBillText]}>₹2500.00</Text>
                            <Text style={styles.payBillText}>Full Paid</Text>
                            </View>
                          </View>
                        </>
                      )}
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <View style={styles.Billbottom}>
                      <Text style={styles.detailLabel}>Paid Date</Text>
                      <Text style={styles.detailValue}>25 Sep 2025</Text>
                      </View>

                       <View style={styles.Billbottom}>
                      <Text style={[styles.detailLabel, { marginTop: 6 }]}>
                        Payment Mode
                      </Text>
                      <Text style={styles.detailValue}>UPI</Text>
                      </View>

                       <View style={styles.Billbottom}>
                      <Text style={[styles.detailLabel, { marginTop: 6 }]}>
                        Reference number
                      </Text>
                      <Text style={styles.detailValue}>#RSIN001</Text>
                      </View>
                    </View>

                    {/* Buttons */}
                    <View style={styles.buttonRow}>
                      <TouchableOpacity style={styles.shareBtn}>
                        <Text style={styles.shareText}>Share </Text>
                        <Image  source={ShareIcon} resizeMode="contain" style={{ width: 20, height: 20 , marginLeft:8 }}/>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.downloadBtn}>
                        <Text style={styles.downloadText}>Download </Text>
                      <Image  source={DownloadIcon} resizeMode="contain" style={{ width: 20, height: 20 , marginLeft:8 }}/>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default Payment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  card: {
    flexDirection: "row",
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
  modalTitle: { fontSize: 16, fontWeight: "700", color: "#000" },
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
  label: { fontSize: 14, color: "#555" },
  totalAmount: { fontSize: 16, fontWeight: "700", color: "#000" },
  detailsSection: { marginVertical: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 3,
  },
  detailLabel: { fontSize: 13, color: "#777" },
  detailValue: { fontSize: 13, fontWeight: "500", color: "#000" },
  payBillText: { fontSize: 13, color: "#0057FF", fontWeight: "600" },
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
    marginRight: 10,
  },
  shareText: { color: "#000", fontWeight: "600" },
  downloadBtn: {
    flex: 1,
    backgroundColor: "#0057FF",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  downloadText: { color: "#fff", fontWeight: "600" },
});

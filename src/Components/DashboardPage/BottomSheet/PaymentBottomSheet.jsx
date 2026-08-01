import React, { useEffect, useRef, useContext, useState } from "react";
import {
    View,
    StyleSheet,
    Animated,
    PanResponder,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    ScrollView,
    TouchableOpacity, Image,
    TextInput,
    Text,
    Dimensions,
    FlatList,
    NativeModules,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { paymentContexts } from "../../../Context/PaymentContext";
import DownloadIcon from "../../../assets/Images/download.png"
import DownloadBlueIcon from "../../../assets/Images/download_Blue.png";
import ShareIcon from "../../../assets/Images/Union.png";
import PaidIcon from "../../../assets/Images/Checkboxes.png";
import ArrowRightIcon from "../../../assets/Images/arrow-right.png";
import ReceiptPic from "../../../assets/Images/ReceiptPic.png"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useNavigation } from "@react-navigation/native";
import { getInvoiceDownload, getReceiptDownload } from "../../../Action/PaymentAction";
import { UsersContext } from "../../../Context/UserContext";
import { LoginContexts } from "../../../Context/LoginContext";
import AppLoader from "../../ToastFile/LoaderPage";


const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function PaymentBottomSheet({
    visible,
    onClose,

}) {
    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const paymentContext = useContext(paymentContexts)
    const [showVisible, setShowVisible] = useState(true);
    const [rentAmountVisible, setRentAmountVisible] = useState(true)
    const [showNonrefundable, setNonrefundable] = useState(false)
    const navigation = useNavigation();
    const [selected, setSelected] = useState("invoice");
    const [showUnpaidInv, setShowUnpaidInv] = useState(true)


    const { CommonModule } = NativeModules;
    const context = useContext(UsersContext)
    const loginContext = useContext(LoginContexts)
    const [showRedeemTo, setShowRedeemTo] = useState(false);
    const [showRedeemFrom, setShowRedeemFrom] = useState(true)

    // useEffect(() => {
    //     if (visible && selectedComplaintSend) {
    //         setCurrentComplaint(selectedComplaintSend);
    //     }
    // }, [visible, selectedComplaintSend]);
    // console.log(selectedComplaint)

    // useEffect(() => {
    //     if (!visible) {
    //         setComment(false)
    //     }
    // }, [visible])


    /* ================= OPEN / CLOSE ================= */
    useEffect(() => {
        Animated.timing(translateY, {
            toValue: visible ? 0 : SCREEN_HEIGHT,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [visible]);

    /* ================= DRAG DOWN ================= */
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, g) => g.dy > 10,
            onPanResponderMove: (_, g) => {
                if (g.dy > 0) translateY.setValue(g.dy);
            },
            onPanResponderRelease: (_, g) => {
                if (g.dy > 150) {
                    Keyboard.dismiss();
                    onClose && onClose();
                } else {
                    Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;


    const showRedeemedTo = paymentContext?.getInvoiceDetail?.showRedeemedTo;
    const showRedeemedFrom = paymentContext?.getInvoiceDetail?.showRedeemedFrom;

    const handleDownload = (invoiceId) => {
        console.log(invoiceId)

        if (selected === "invoice") {
            getInvoiceDownload(context.getHostelDetail.hostelId, invoiceId, loginContext.getToken).then(r => {
                console.log(r)

                if (r.status == 200) {
                    CommonModule.downloadPDF(r.data)
                }

            })
        }

        if (selected === "receipt") {
            getReceiptDownload(context.getHostelDetail.hostelId,)
        }




    };


    const sharePdf = (invoiceId) => {
        console.log(invoiceId)
        console.log("calling share pdf function")
        getInvoiceDownload(context.getHostelDetail.hostelId, invoiceId, loginContext.getToken).then(r => {
            console.log(r)
            if (r.status == 200) {
                CommonModule.sharePDF(r.data, "Sharing the invoice")
            }
        })

    }

    // const handleReceiptPdfDownload = (invoiceType) => {
    //   if (invoiceType === "Booking") {
    //     navigation.navigate("BookingInvoice");
    //   }
    //   else {
    //     navigation.navigate("InvoiceDesign");
    //   }

    // };

    const handlePaymentReceipt = (transcationId, invoiceType, invoiceStatus) => {

        console.log(transcationId)
        navigation.navigate('ReceiptPdfView', { transcationId: transcationId, invoiceStatus: invoiceStatus })
        // if (invoiceType === "Booking") {
        //   navigation.navigate('BookingReceipt', { transcationId: transcationId,invoiceStatus: invoiceStatus })
        // }
        // else {
        //   navigation.navigate('ReceiptPdfView', { transcationId: transcationId,invoiceStatus:invoiceStatus })
        // }

    }


    const totalUnpaidInvoice = paymentContext?.getInvoiceDetail?.unpaidInvoices?.reduce(
        (sum, item) => sum + Number(item.totalAmount || 0),
        0
    );


    console.log(totalUnpaidInvoice)
    if (!visible) return null;

    return (
        <View style={style.overlay}>
            <AppLoader visible={paymentContext.getLoading} />
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={StyleSheet.absoluteFillObject} />
            </TouchableWithoutFeedback>

            <Animated.View
                {...panResponder.panHandlers}
                style={[
                    style.sheet,
                    { transform: [{ translateY }] },
                ]}
            >

                <SafeAreaView edges={["bottom"]}  >

                    {/* ================= YOUR CONTENT HERE ================= */}

                    <View {...panResponder.panHandlers}>
                        <View style={style.dragindictor} />
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {paymentContext.getInvoiceDetail && ["Rent", "Advance", "Booking", "Reassign_rent"].includes(
                            paymentContext.getInvoiceDetail.invoiceType
                        ) ? (
                            <>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={style.modalTitle}>{paymentContext.getInvoiceDetail?.invoiceType}</Text>

                                    <View style={{ flexDirection: "row" }}>
                                        <Text style={style.invoiceId}>{paymentContext.getInvoiceDetail?.invoiceNumber}</Text>
                                        {/* <TouchableOpacity
                                              onPress={() => handleReceiptPdfDownload(paymentContext.getInvoiceDetail.invoiceType)}
                                            > */}
                                        {/* <Image
                                              source={ViewIcon}
                                              style={{ width: 15, height: 15, marginLeft: 5, marginTop: 2 }}
                                            /> */}
                                        {/* </TouchableOpacity> */}
                                    </View>
                                </View>


                                {/* Amount Section */}
                                <View style={style.amountSection}>
                                    <Text style={style.label}>Total Amount</Text>

                                    <View style={{ alignItems: 'flex-end' }}>
                                        <Text style={style.totalAmount}>
                                            ₹{new Intl.NumberFormat('en-IN', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }).format(
                                                paymentContext.getInvoiceDetail?.totalAmount
                                            )}
                                        </Text>

                                        {paymentContext.getInvoiceDetail?.status === "Pending" && (
                                            <View
                                                style={[
                                                    style.statusBadge,
                                                    { backgroundColor: "rgba(254,243,198,1)" },
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        style.statusText,
                                                        { color: "rgba(187,77,0,1)" },
                                                    ]}
                                                >
                                                    Pending
                                                </Text>
                                            </View>
                                        )}

                                        {(paymentContext.getInvoiceDetail?.status === "Partial Payment" ||
                                            paymentContext.getInvoiceDetail?.status === "Paid") && (
                                                <View style={{ flexDirection: "row", marginTop: 6 }}>
                                                    <Image
                                                        source={PaidIcon}
                                                        style={{ width: 20, height: 20 }}
                                                    />
                                                    <Text style={{ fontSize: 14, marginLeft: 6, fontFamily: 'Gilroy-Medium' }}>
                                                        {paymentContext.getInvoiceDetail.status === "Paid"
                                                            ? "Full Paid"
                                                            : "Partial Payment"}
                                                    </Text>
                                                </View>
                                            )}
                                    </View>
                                </View>



                                {/* Details */}
                                <View style={style.detailsSection}>
                                    {(paymentContext.getInvoiceDetail?.status === "Partial Payment" ||
                                        paymentContext.getInvoiceDetail?.status === "Paid" || paymentContext.getInvoiceDetail?.status == "Pending") && (
                                            paymentContext.getInvoiceDetail?.invoiceItems.map((i, index) => {
                                                return (
                                                    <View style={style.row} key={index}>
                                                        {/* <TouchableOpacity > */}
                                                        <Text style={style.detailLabel}>{i.invoiceItem}</Text>
                                                        {/* </TouchableOpacity> */}
                                                        <Text style={style.detailValue}>₹{new Intl.NumberFormat('en-IN').format(i.amount)}</Text>
                                                    </View>
                                                )
                                            })
                                        )}

                                    {paymentContext.getInvoiceDetail?.discountAmount !== 0 && (
                                        <View style={{ backgroundColor: '#F8F8F8', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 10 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Text style={style.detailLabel}>Actual Amount</Text>
                                                <Text style={style.detailValue}> ₹ {paymentContext.getInvoiceDetail?.discountAmount}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                                                <Text style={style.detailLabel}>Discount</Text>
                                                <Text style={style.detailValue}> ₹ {paymentContext.getInvoiceDetail?.discountAmount}</Text>
                                            </View>

                                            <View style={{
                                                alignSelf: "flex-end", marginTop: 10, backgroundColor: '#00A63E', paddingHorizontal: 10,
                                                paddingVertical: 5, borderRadius: 12
                                            }}>
                                                <Text style={{ fontSize: 13, fontFamily: 'Gilroy-Medium', color: '#FFFFFF' }}>
                                                    Discount Applied</Text>
                                            </View>
                                        </View>
                                    )}
                                    {/* <View style={style.row}>
                                            <Text style={style.detailLabel}>Actual Rent</Text>
                                            <Text style={style.detailValue}>₹{ }</Text>
                                          </View>
                        
                                          <View style={style.row}>
                                            <Text style={style.detailLabel}>Taxes GST 10%</Text>
                                            <Text style={style.detailValue}>₹{paymentContext.getInvoiceDetail.gst}</Text>
                                          </View> */}
                                    {paymentContext.getInvoiceDetail?.receipts.length > 0 && (
                                        (paymentContext.getInvoiceDetail?.status === "Partial Payment" ||
                                            paymentContext.getInvoiceDetail?.status === "Paid") && (
                                            <>

                                                <Text style={[style.detailLabel, { marginTop: 10 }]}>Paid Amount</Text>
                                                {paymentContext.getInvoiceDetail?.receipts.map(i => {
                                                    return (
                                                        <View key={i.transactionId} style={style.row}>
                                                            <TouchableOpacity
                                                                onPress={() =>
                                                                    handlePaymentReceipt(i.transactionId, paymentContext.getInvoiceDetail.invoiceType, paymentContext.getInvoiceDetail?.status)}
                                                                style={{ flexDirection: 'row' }}>
                                                                <Text style={{ fontSize: 12, color: "#1e45e2", fontFamily: 'Gilroy-Semibold' }}>{i.transactionNumber}</Text>
                                                                <Image source={ReceiptPic} style={{ width: 14, height: 14, marginLeft: 5 }} resizeMode="contain" />
                                                            </TouchableOpacity>
                                                            <Text style={style.detailValue}>₹{new Intl.NumberFormat('en-IN').format(i.paidAmount)}</Text>
                                                        </View>
                                                    )
                                                })}

                                            </>
                                        )
                                    )}

                                    {paymentContext?.getInvoiceDetail?.deductions.length > 0 && (
                                        <View style={{ paddingTop: 10,marginBottom:10 }}>
                                            <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Medium' }}>Deductions</Text>

                                            {paymentContext?.getInvoiceDetail?.deductions.map((i, index) => {

                                                return <View key={index}
                                                    style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8, alignItems: 'center' }}>
                                                    <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Regular' }}>{i.type}</Text>

                                                    <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Regular' }}>₹ {i.amount}</Text>
                                                </View>
                                            }
                                            )}

                                        </View>
                                    )}





                                    {paymentContext.getInvoiceDetail.status === "Partial Payment" && (
                                        <>
                                            <View style={style.row}>
                                                <Text style={style.detailLabel}>Remain</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={style.payBillText}>Pay Bill</Text>
                                                <Text style={style.detailValue}>₹{new Intl.NumberFormat('en-IN').format(paymentContext.getInvoiceDetail?.dueAmount)}</Text>
                                            </View>
                                        </>
                                    )
                                    }
                                </View>

                                {showRedeemedTo && paymentContext.getInvoiceDetail.redeemedTo.length > 0 && (
                                    <>
                                        <TouchableOpacity onPress={() => setShowRedeemTo(!showRedeemTo)}
                                            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Text style={style.appldTo}>Applied to</Text>
                                            <Ionicons
                                                name={showRedeemTo ? "chevron-up" : "chevron-down"}
                                                size={20}
                                                style={{ marginRight: 5 }}
                                            />
                                        </TouchableOpacity>


                                        {showRedeemTo && (
                                            paymentContext?.getInvoiceDetail?.redeemedTo.map((i, index) => (
                                                <View style={style.shwRedeem} key={index}>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Text style={style.redeemIncNo}>{i?.invoiceNumber}</Text>
                                                        <Text style={style.redeemAmntTxt}>₹ {i?.redemptionAmount}</Text>
                                                    </View>

                                                    <View style={{ marginVertical: 9, borderWidth: 1, borderColor: '#F2F2F2' }} />

                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Text style={style.redeemDateTxt}>Date</Text>
                                                        <Text style={style.redeemDate}>{i?.redeemedAtDate}</Text>
                                                    </View>
                                                </View>
                                            ))
                                        )}
                                    </>

                                )}

                                {showRedeemedFrom && paymentContext.getInvoiceDetail.redeemedFrom.length > 0 && (
                                    <>
                                        <TouchableOpacity onPress={() => setShowRedeemFrom(!showRedeemFrom)}
                                            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, marginBottom: 8 }}>
                                            <Text style={style.appldTo}>Adjusted From</Text>
                                            <Ionicons
                                                name={showRedeemFrom ? "chevron-up" : "chevron-down"}
                                                size={20}
                                                style={{ marginRight: 5 }}
                                            />
                                        </TouchableOpacity>


                                        {showRedeemFrom && (
                                            paymentContext?.getInvoiceDetail?.redeemedFrom.map((i, index) => (
                                                <View style={style.shwRedeem} key={index}>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Text style={style.redeemIncNo}>{i?.invoiceNumber}</Text>
                                                        <Text style={style.redeemAmntTxt}>₹ {i?.redemptionAmount}</Text>
                                                    </View>

                                                    <View style={{ marginVertical: 9, borderWidth: 1, borderColor: '#F2F2F2' }} />

                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Text style={style.redeemDateTxt}>Date</Text>
                                                        <Text style={style.redeemDate}>{i?.redeemedAtDate}</Text>
                                                    </View>
                                                </View>
                                            ))
                                        )}
                                    </>

                                )}

                                <View
                                    style={{
                                        borderBottomWidth: 0.4,
                                        borderBottomColor: "grey",
                                        opacity: 0.4,
                                        marginVertical: 10,
                                    }}
                                />

                                {/* Paid / Due Date */}
                                <View style={style.Billbottom}>
                                    <Text style={style.paiddetailLabel}>
                                        {paymentContext.getInvoiceDetail.status === "Pending" ? "Due Date" : "Paid Date"}
                                    </Text>
                                    <Text style={style.paiddetailValue}>
                                        {paymentContext.getInvoiceDetail.status === "Pending" ?
                                            paymentContext?.getInvoiceDetail?.dueDate ? paymentContext?.getInvoiceDetail?.dueDate : "N/A"
                                            : paymentContext.getInvoiceDetail.lastPaidDate ? paymentContext.getInvoiceDetail.lastPaidDate : "N/A"}
                                    </Text>
                                </View>

                                {paymentContext.getInvoiceDetail.status === "Partial Payment" &&
                                    <View style={[style.Billbottom, { paddingTop: 7 }]}>
                                        <Text style={style.paiddetailLabel}>
                                            Due Date
                                        </Text>
                                        <Text style={style.paiddetailValue}>
                                            {paymentContext.getInvoiceDetail.dueDate}
                                        </Text>
                                    </View>
                                }


                                {/* Notes */}
                                {paymentContext.getInvoiceDetail.status === "Pending" && (
                                    <View style={{ marginTop: 10 }}>
                                        <Text style={{ fontSize: 14, color: "rgba(60,60,67,0.6)", fontFamily: 'Gilroy-Medium' }}>
                                            Notes & Instructions
                                        </Text>
                                        <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Semibold', marginTop: 8 }}>
                                            Kindly pay on or before the due date
                                        </Text>
                                        <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Semibold' }}>
                                            Late fee may apply after 3 days of due date
                                        </Text>
                                        <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Semibold' }}>
                                            For any billing errors, contact hostel admin
                                        </Text>
                                    </View>
                                )}

                                {/* Payment mode section */}
                                {paymentContext.getInvoiceDetail.status !== "Pending" && (
                                    <View style={{ marginTop: 10 }}>
                                        <View style={style.Billbottom}>
                                            <Text style={style.paiddetailLabel}>Payment Mode</Text>
                                            <Text style={style.paiddetailValue}>
                                                {paymentContext?.getInvoiceDetail?.receipts[0]?.paymentMode ? paymentContext?.getInvoiceDetail?.receipts[0]?.paymentMode : "N/A"}
                                            </Text>
                                            {/* {paymentContext.getInvoiceDetail.receipts.map(i => {
                                                console.log(i)
                                                return (
                        
                                                  <Text key={i.transactionId} style={style.paiddetailValue}>{i.paymentMode}</Text>
                                                )
                        
                                              })} */}

                                        </View>
                                        {console.log(paymentContext.getInvoiceDetail.receipts)}
                                        <View style={[style.Billbottom, { paddingTop: 10 }]}>
                                            <Text style={style.paiddetailLabel}>Reference number</Text>
                                            <Text style={style.paiddetailValue}>
                                                {paymentContext?.getInvoiceDetail?.lastReferenceId ? paymentContext?.getInvoiceDetail?.lastReferenceId : "N/A"}
                                            </Text>
                                            {/* {paymentContext.getInvoiceDetail.receipts.map(i => {
                                                return (
                                                  <Text key={i.transactionId} style={style.paiddetailValue}>{i.referenceNumber}</Text>
                                                )
                        
                                              })} */}
                                        </View>
                                    </View>
                                )}

                                {/* Buttons */}
                                <View style={style.buttonRow}>
                                    {paymentContext.getInvoiceDetail.status === "Pending" ? (
                                        <>
                                            <TouchableOpacity
                                                style={style.shareBtn}
                                                onPress={() => handleDownload(paymentContext.getInvoiceDetail.invoiceId)}
                                            >
                                                <Text style={{ fontFamily: 'Gilroy-Semibold', fontSize: 16, color: "#071C70" }}>
                                                    Download Bill
                                                </Text>
                                                <Image
                                                    source={DownloadBlueIcon}
                                                    style={{ width: 17, height: 17, marginLeft: 8 }}
                                                />
                                            </TouchableOpacity>

                                            <TouchableOpacity disabled style={[style.downloadBtn,{opacity:0.3}]}>
                                                <Text style={style.downloadText}>Pay Now</Text>
                                                <Image
                                                    source={ArrowRightIcon}
                                                    style={{ width: 20, height: 20, marginLeft: 8 }}
                                                />
                                            </TouchableOpacity>
                                        </>
                                    ) : (
                                        <>
                                            <TouchableOpacity style={style.shareBtn} onPress={() => sharePdf(paymentContext.getInvoiceDetail.invoiceId)}>
                                                <Text style={style.shareText}>Share</Text>
                                                <Image
                                                    source={ShareIcon}
                                                    style={{ width: 17, height: 17, marginLeft: 8 }}
                                                />
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={style.downloadBtn}
                                                onPress={() => handleDownload(paymentContext.getInvoiceDetail.invoiceId)}
                                            // handleDownload
                                            >
                                                <Text style={style.downloadText}>Download</Text>
                                                <Image
                                                    source={DownloadIcon}
                                                    style={{ width: 20, height: 20, marginLeft: 8 }}
                                                />
                                            </TouchableOpacity>
                                        </>
                                    )}
                                </View>
                            </>
                        ) :
                            <>
                                <View style={style.row}>
                                    <Text style={style.modalTitle}>{paymentContext?.getInvoiceDetail?.invoiceType}</Text>

                                    {/* <TouchableOpacity
                                            onPress={() => handleReceiptPdfDownload(paymentContext.getInvoiceDetail.invoiceType)}
                                            style={{
                                              flexDirection: "row", backgroundColor: '#F1F4FF', paddingVertical: 3, paddingHorizontal: 5,
                                              borderRadius: 5, alignItems: 'center'
                                            }}> */}
                                    <View style={{
                                        flexDirection: "row", backgroundColor: '#F1F4FF', paddingVertical: 3, paddingHorizontal: 5,
                                        borderRadius: 5, alignItems: 'center'
                                    }}>
                                        <Text style={{ fontSize: 14, color: "#0057FF", fontFamily: 'Gilroy-Semibold' }}>{paymentContext?.getInvoiceDetail?.invoiceNumber}</Text>

                                        {/* <Image
                                              source={ViewIcon}
                                              style={{ width: 15, height: 15, marginLeft: 5, marginTop: 2 }}
                                            /> */}
                                    </View>
                                    {/* </TouchableOpacity> */}
                                </View>

                                <View
                                    style={{
                                        borderBottomWidth: 0.4,
                                        borderBottomColor: "grey",
                                        opacity: 0.4,
                                        marginVertical: 10,
                                    }}
                                />

                                <View style={style.row}>
                                    <Text style={style.modalTitle}>Total Refund</Text>

                                    <Text style={{ fontSize: 18, fontFamily: 'Gilroy-Bold' }}>₹ {paymentContext?.getInvoiceDetail?.totalAmount}</Text>
                                </View>

                                <View style={{ alignItems: 'flex-end' }}>
                                    {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            {/* <Text style={{ fontSize: 14, fontWeight: 400, color: '#1E45E1' }}>{paymentContext?.}</Text> */}
                                    {/* <Image source={ReceiptPic} style={{ width: 16, height: 16, marginLeft: 5 }} resizeMode="contain" /> */}
                                    {/* </View> */}


                                    <Text style={{ fontSize: 13, fontFamily: 'Gilroy-Semibold', color: '#038C3D' }}>{paymentContext?.getInvoiceDetail?.status}</Text>
                                </View>

                                {paymentContext.getInvoiceDetail?.receipts.map(i => {
                                    return (
                                        <View key={i.transactionId} style={style.row}>
                                            <TouchableOpacity onPress={() =>
                                                handlePaymentReceipt(i.transactionId, paymentContext?.getInvoiceDetail.invoiceType, paymentContext.getInvoiceDetail?.status)}
                                                style={{ flexDirection: 'row' }}>
                                                <Text style={{ fontSize: 13, fontFamily: 'Gilroy-Semibold', color: "#1e45e2" }}>{i.transactionNumber}</Text>
                                                <Image source={ReceiptPic} style={{ width: 14, height: 14, marginLeft: 5 }} resizeMode="contain" />
                                            </TouchableOpacity>
                                            <Text style={style.detailValue}>₹{new Intl.NumberFormat('en-IN').format(i.paidAmount)}</Text>
                                        </View>
                                    )
                                })}



                                <View style={[style.row, { paddingTop: 10 }]}>
                                    <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Medium' }}>Advance paid</Text>

                                    <Text style={{ fontSize: 18, fontFamily: 'Gilroy-Semibold' }}>
                                        ₹ {paymentContext?.getInvoiceDetail?.advanceInfo?.totalAdvancePaid}</Text>
                                </View>

                                {paymentContext?.getInvoiceDetail?.status === "Partially Paid" && (
                                    <View style={[style.row, { paddingTop: 3 }]}>
                                        <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Medium' }}>Balance Amount</Text>

                                        <Text style={{ fontSize: 18, fontFamily: 'Gilroy-Semibold' }}>
                                            ₹ {paymentContext?.getInvoiceDetail?.dueAmount || "N/A"}</Text>
                                    </View>
                                )}

                                <View style={style.row}>
                                    <TouchableOpacity onPress={() => setShowVisible(!showVisible)}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Medium' }}>Refundable Rent</Text>
                                            <Ionicons
                                                name={showVisible ? "chevron-up" : "chevron-down"}
                                                size={20}
                                                color="#007FFF"
                                                style={{ marginLeft: 6, padding: 2, borderRadius: 5, backgroundColor: '#EFF6FF', }}
                                            />
                                        </View>
                                    </TouchableOpacity>

                                    {/* <Text style={{ fontSize: 16, fontWeight: 700 }}>₹ 5000</Text> */}
                                </View>


                                {showVisible && (
                                    <>
                                        <View style={style.row}>
                                            <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Regular', color: '#2F2F2F' }}>
                                                Last Rent Paid(30 days)
                                            </Text>
                                            <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Regular', color: '#2F2F2F' }}>
                                                ₹ {new Intl.NumberFormat('en-IN').format(
                                                    paymentContext?.getInvoiceDetail?.currentMonthInfo?.lastRentPaid && paymentContext?.getInvoiceDetail?.currentMonthInfo?.lastRentPaid)}
                                            </Text>
                                        </View>

                                        <View style={style.row}>
                                            <TouchableOpacity onPress={() => setRentAmountVisible(!rentAmountVisible)}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Regular', color: '#2F2F2F' }}>
                                                        Actual Stay days ({paymentContext?.getInvoiceDetail?.currentMonthInfo?.noOfDaysStayed} days)
                                                    </Text>

                                                    <Ionicons
                                                        name={rentAmountVisible ? "chevron-up" : "chevron-down"}
                                                        size={20}
                                                        color="#007FFF"
                                                        style={{ marginLeft: 6, padding: 2, borderRadius: 5, backgroundColor: '#EFF6FF', }}
                                                    />
                                                </View>


                                            </TouchableOpacity>
                                            <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Regular', color: '#2F2F2F' }}>
                                                ₹ {new Intl.NumberFormat('en-IN').format(
                                                    paymentContext?.getInvoiceDetail?.currentMonthInfo?.payableRent ? paymentContext?.getInvoiceDetail?.currentMonthInfo?.payableRent : "N/A")}
                                            </Text>
                                        </View>
                                        {rentAmountVisible && (
                                            <>
                                                <View style={{ marginBottom: 10 }}>
                                                    {paymentContext?.getInvoiceDetail?.currentMonthInfo?.bedHistories.map((r, index) => {
                                                        return <View key={index} style={{ paddingTop: 8, flexDirection: 'row', alignItems: 'center' }}>

                                                            <Text style={{ fontSize: 12, fontFamily: 'Gilroy-Regular', color: '#1e45e2' }}>
                                                                {r?.floorName}{"  "}{r?.roomName}{"  "}{r?.bedName}</Text>

                                                            <Text style={{ fontSize: 12, fontFamily: 'Gilroy-Regular', marginLeft: 5 }}>({r?.noOfDaysStayed} days = {r?.rent})</Text>
                                                        </View>

                                                    })}


                                                </View>
                                            </>
                                        )}
                                    </>


                                    // paymentContext?.getInvoiceDetail?.currentMonthInfo.map(i => {
                                    //   return (
                                    //     <View style={style.row}>
                                    //       <Text style={{ fontSize: 14, fontWeight: 300, color: '#2F2F2F' }}>{i.list}</Text>
                                    //       <Text style={{ fontSize: 14, fontWeight: 300, color: '#2F2F2F' }}>₹ {new Intl.NumberFormat('en-IN').format(i.amount)}</Text>
                                    //     </View>
                                    //   )
                                    // })

                                )}

                                {paymentContext?.getInvoiceDetail?.advanceInfo?.deductions.length > 0 && (
                                    <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                                        <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Medium' }}>Non Refundable Rent</Text>
                                        <TouchableOpacity onPress={() => setNonrefundable(!showNonrefundable)}
                                            style={{ padding: 2, backgroundColor: 'green', marginLeft: 6, borderRadius: 5, backgroundColor: '#EFF6FF', }}>
                                            <Ionicons
                                                name={showNonrefundable ? "chevron-up" : "chevron-down"}
                                                size={20}
                                                color="#007FFF"
                                            />
                                        </TouchableOpacity>

                                    </View>
                                )}

                                {showNonrefundable && (
                                    <>
                                        <View>
                                            {paymentContext?.getInvoiceDetail?.advanceInfo?.deductions.length > 0 && (
                                                paymentContext?.getInvoiceDetail?.advanceInfo?.deductions.map((i, index) => {

                                                    return <View key={index}
                                                        style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8, alignItems: 'center' }}>
                                                        <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Regular' }}>{i.name}</Text>

                                                        <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Regular' }}>₹ {i.amount}</Text>
                                                    </View>
                                                })
                                            )}

                                        </View>
                                    </>
                                )}


                                <View style={style.row}>

                                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
                                        onPress={() => setShowUnpaidInv(!showUnpaidInv)}>

                                        <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Medium' }}>Unpaid Invoices</Text>
                                        <Ionicons
                                            name={showUnpaidInv ? "chevron-up" : "chevron-down"}
                                            size={20}
                                            color="#007FFF"
                                            style={{ marginLeft: 6, padding: 2, borderRadius: 5, backgroundColor: '#EFF6FF', }}
                                        />
                                    </TouchableOpacity>

                                    <Text style={{ fontSize: 18, fontFamily: 'Gilroy-Semibold' }}> ₹ {totalUnpaidInvoice}</Text>
                                </View>

                                {showUnpaidInv && (
                                    <View>
                                        {paymentContext.getInvoiceDetail?.unpaidInvoices.length > 0 && (
                                            paymentContext.getInvoiceDetail?.unpaidInvoices.map((i, index) => (
                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 7, paddingHorizontal: 2 }}
                                                    key={index}>
                                                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', color: '#1E45E1' }}>
                                                            {i?.invoiceNo}</Text>
                                                        <Image source={ReceiptPic} style={{ width: 16, height: 16, marginLeft: 12 }} />
                                                    </TouchableOpacity>

                                                    <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', color: '#2F2F2F' }}>
                                                        ₹ {i?.balanceAmount}</Text>
                                                </View>
                                            ))
                                        )}
                                    </View>
                                )}






                                <View
                                    style={{
                                        borderBottomWidth: 0.4,
                                        borderBottomColor: "grey",
                                        opacity: 0.4,
                                        marginVertical: 10,
                                    }}
                                />

                                {["Partially Paid", "Paid"].includes(paymentContext?.getInvoiceDetail?.status) && (

                                    <View style={style.Billbottom}>
                                        <Text style={style.paiddetailLabel}>
                                            Paid Date
                                        </Text>
                                        <Text style={style.paiddetailValue}>
                                            {paymentContext?.getInvoiceDetail?.lastPaidDate ? paymentContext?.getInvoiceDetail?.lastPaidDate : "N/A"}
                                        </Text>
                                    </View>
                                )}

                                {paymentContext?.getInvoiceDetail?.status === "Pending" && (

                                    <View style={style.Billbottom}>
                                        <Text style={style.paiddetailLabel}>
                                            Due Date
                                        </Text>
                                        <Text style={style.paiddetailValue}>
                                            {paymentContext?.getInvoiceDetail?.dueDate || "N/A"}
                                        </Text>
                                    </View>
                                )}


                                <View style={{ marginTop: 10 }}>
                                    <View style={style.Billbottom}>
                                        <Text style={style.paiddetailLabel}>Payment Mode</Text>
                                        <Text style={style.paiddetailValue}>
                                            {paymentContext?.getInvoiceDetail?.lastPaymentMode ? paymentContext?.getInvoiceDetail?.lastPaymentMode : "N/A"}</Text>

                                    </View>

                                    <View style={[style.Billbottom, { paddingTop: 10 }]}>
                                        <Text style={style.paiddetailLabel}>Reference number</Text>

                                        <Text style={style.paiddetailValue}>
                                            {paymentContext?.getInvoiceDetail?.lastReferenceId ? paymentContext?.getInvoiceDetail?.lastReferenceId : "N/A"}
                                        </Text>
                                        {/* {paymentContext.getInvoiceDetail.receipts.map(i => {
                                              return (
                                                <Text key={i.transactionId} style={style.paiddetailValue}>{i.referenceNumber}</Text>
                                              )
                        
                                            })} */}
                                    </View>
                                </View>

                                {/* {---------Button--} */}

                                <View style={style.buttonRow}>
                                    <TouchableOpacity style={style.shareBtn} onPress={() => sharePdf(paymentContext.getInvoiceDetail.invoiceId)}>
                                        <Text style={style.shareText}>Share</Text>
                                        <Image
                                            source={ShareIcon}
                                            style={{ width: 17, height: 17, marginLeft: 8 }}
                                        />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={style.downloadBtn}
                                        onPress={() => handleDownload(paymentContext.getInvoiceDetail.invoiceId)}
                                    // handleDownload
                                    >
                                        <Text style={style.downloadText}>Download</Text>
                                        <Image
                                            source={DownloadIcon}
                                            style={{ width: 20, height: 20, marginLeft: 8 }}
                                        />
                                    </TouchableOpacity>

                                </View>

                            </>
                        }
                    </ScrollView>


                </SafeAreaView>

            </Animated.View>
        </View>

    );

}



const style = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
    },
    sheet: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 16,
        maxHeight: "98%",
        overflow: 'hidden'
        // dynamic height limit
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 12,
        minHeight: 45,
        textAlignVertical: "top",
    },
    dragindictor: { width: 50, height: 4, backgroundColor: "#ccc", borderRadius: 2, alignSelf: "center", marginBottom: 10 },
    modalTitle: { fontSize: 20, fontFamily: 'Gilroy-Semibold', color: "#000" },
    invoiceId: {
        fontSize: 13,
        color: "#0057FF",
        fontWeight: "600",
        marginBottom: 6,
        fontFamily: 'Gilroy-Semibold',
        paddingVertical: 5, backgroundColor: '#F1F4FF', paddingHorizontal: 8,
        borderRadius: 10
    },
    amountSection: {
        marginTop: 10,
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    label: { fontSize: 20, color: "rgba(31, 38, 51, 1)", fontFamily: 'Gilroy-Semibold' },
    totalAmount: { fontSize: 18, fontFamily: 'Gilroy-Bold', color: "#000" },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginTop: 6 },
    detailsSection: { marginVertical: 10 },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 9,
        alignItems: 'center'
    },
    detailLabel: { fontSize: 14, color: "rgba(31, 38, 51, 1)", fontFamily: 'Gilroy-Medium' },
    detailValue: { fontSize: 16, fontFamily: 'Gilroy-Semibold', color: "rgba(31, 38, 51, 1)" },
    payBillText: { fontSize: 13, color: "#0057FF", fontFamily: 'Gilroy-Semibold' },
    paiddetailLabel: { fontSize: 14, color: "rgba(60, 60, 67, 0.6)", fontFamily: 'Gilroy-Medium' },
    paiddetailValue: { fontSize: 14, color: "black", fontFamily: 'Gilroy-Semibold' },
    Billbottom: { display: 'flex', flexDirection: 'row', justifyContent: "space-between", },
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
        display: 'flex',
        flexDirection: 'row',
        marginRight: 10,
        justifyContent: 'center'
    },
    shareText: { color: "#000", fontFamily: 'Gilroy-Semibold', fontSize: 16 },
    downloadBtn: {
        flex: 1,
        backgroundColor: "#0057FF",
        paddingVertical: 10,
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'center'
    },
    downloadText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Gilroy-Semibold' },
    appldTo: { fontSize: 16, fontFamily: 'Gilroy-Semibold' },
    shwRedeem: {
        borderWidth: 1, borderColor: "#E7E7E7", borderRadius: 8, marginTop: 8,
        paddingVertical: 12, paddingHorizontal: 16
    },
    redeemIncNo: { fontSize: 15, fontFamily: 'Gilroy-Semibold' },
    redeemAmntTxt: { fontSize: 18, fontFamily: 'Gilroy-Semibold' },
    redeemDateTxt: { fontSize: 14, fontFamily: 'Gilroy-Regular', color: '#3C3C4399' },
    redeemDate: { fontSize: 14, fontFamily: 'Gilroy-Semibold' }
});